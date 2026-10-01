import { test } from "node:test";
import assert from "node:assert/strict";
import { createLaunchEnvironmentSnapshot } from "@deepseek-ai/dsh-launch-environment";
import { apply, Config, DEFAULT_API_KEY_ENV, DEFAULT_BASE_URL, DEFAULT_FETCH_MODEL, DEFAULT_MAX_RESULTS, DEFAULT_SEARCH_MODEL, DEFAULT_SEARCH_TYPE, DEFAULT_TIMEOUT_MS, NineRouterFetchProvider, NineRouterSearchProvider, inject } from "../src/index.js";

function signal(value) {
	return { get: () => value, set: (next) => { value = next; } };
}

function harness() {
	const config = {
		apiKey: signal(undefined),
		apiKeyEnv: signal(DEFAULT_API_KEY_ENV),
		baseURL: signal(DEFAULT_BASE_URL),
		searchModel: signal(DEFAULT_SEARCH_MODEL),
		fetchModel: signal(DEFAULT_FETCH_MODEL),
		searchType: signal(DEFAULT_SEARCH_TYPE),
		maxResults: signal(DEFAULT_MAX_RESULTS),
		timeoutMs: signal(DEFAULT_TIMEOUT_MS)
	};
	const providers = {};
	const settings = {};
	const owner = { id: "plugin-fiber" };
	const child = {
		settings: { configure: (options, fiber) => { settings.configured = { options, fiber }; return () => {}; } },
		effect: (factory) => { settings.dispose = factory(); }
	};
	const ctx = {
		fiber: owner,
		inject: (services, callback) => { settings.services = services; callback(child); },
		web: {
			registerSearchProvider: (provider) => { providers.search = provider; return () => {}; },
			registerFetchProvider: (provider) => { providers.fetch = provider; return () => {}; }
		},
		get: (key) => key === "launchEnvironment" ? createLaunchEnvironmentSnapshot([{ source: "process", values: {} }]) : undefined
	};
	apply(ctx, config);
	return { config, ctx, providers, settings };
}

test("declares all settings volatile and the literal API key secret", () => {
	const schema = Config.toJSON();
	const root = schema.refs[String(schema.uid)];
	assert.equal(Object.keys(root.dict).length, 8);
	for (const [field, id] of Object.entries(root.dict)) {
		const node = schema.refs[String(id)];
		assert.equal(node.meta.volatile, true, `${field} should be live editable`);
		if (field === "apiKey") assert.equal(node.meta.role, "secret");
	}
});

test("registers providers from Host config signals and opts out of an automatic settings page", () => {
	const h = harness();
	assert.deepEqual(inject, ["web"]);
	assert.deepEqual(h.settings.services, ["settings"]);
	assert.deepEqual(h.settings.configured, { options: { auto: false }, fiber: h.ctx.fiber });
	assert.equal(typeof h.settings.dispose, "function");
	assert.ok(h.providers.search instanceof NineRouterSearchProvider);
	assert.ok(h.providers.fetch instanceof NineRouterFetchProvider);
	assert.equal(h.providers.search.resolveOptions().searchModel, DEFAULT_SEARCH_MODEL);
	h.config.searchModel.set("search-updated");
	h.config.maxResults.set(4);
	assert.equal(h.providers.search.resolveOptions().searchModel, "search-updated");
	assert.equal(h.providers.search.resolveOptions().maxResults, 4);
	assert.equal(h.providers.fetch.resolveOptions().searchModel, "search-updated");
});

test("keeps the launch-environment fallback for an unset base URL", () => {
	const h = harness();
	h.config.baseURL.set(undefined);
	const snapshot = createLaunchEnvironmentSnapshot([{ source: "process", values: { NINE_ROUTER_BASE_URL: "https://env.example/v1" } }]);
	h.ctx.get = (key) => key === "launchEnvironment" ? snapshot : undefined;
	assert.equal(h.providers.search.resolveOptions().baseURL, "https://env.example/v1");
});
