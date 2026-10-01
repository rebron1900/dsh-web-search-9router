import { test } from "node:test";
import assert from "node:assert/strict";

const hooks = [];
const React = {
	createElement: (type, props, ...children) => ({ type, props: { ...(props ?? {}), children } }),
	useSyncExternalStore: (subscribe, getSnapshot) => {
		hooks.push({ subscribe, getSnapshot });
		return getSnapshot();
	}
};
const primitives = {
	SettingsForm: (props) => ({ type: "SettingsForm", props }),
	SettingsFormModel: class {
		constructor(scope, specs, secrets) {
			this.scope = scope;
			this.specs = new Map(specs.map((spec) => [spec.field, spec]));
			this.secrets = new Map(secrets.map((spec) => [spec.field, spec]));
			this.staged = new Map();
			this.listeners = new Set();
			this.unsubscribeScope = scope.subscribe(() => this.publish());
			this.store = undefined;
		}
		bind(project) {
			this.project = project;
			const store = {
				getSnapshot: () => project(),
				subscribe: (listener) => { this.listeners.add(listener); return () => this.listeners.delete(listener); }
			};
			this.store = store;
			return store;
		}
		shell() {
			const snapshot = this.scope.getSnapshot();
			return { available: snapshot.status === "ready", writable: snapshot.writable,
				dirty: this.staged.size > 0, invalid: [...this.staged].some(([field, text]) => this.specs.get(field)?.parse(text) === undefined),
				saving: false, failed: false };
		}
		field(field) {
			const staged = this.staged.get(field);
			if (this.secrets.has(field)) return { text: staged ?? "", overridden: false, invalid: false };
			const snapshot = this.scope.getSnapshot();
			const value = snapshot.value?.[field];
			return { text: staged ?? this.specs.get(field).format(value), overridden: Object.hasOwn(snapshot.user ?? {}, field), invalid: staged !== undefined && this.specs.get(field).parse(staged) === undefined };
		}
		actions() {
			return {
				edit: (field, text) => { this.staged.set(field, text); this.publish(); },
				resetField: (field) => { this.staged.set(field, ""); this.publish(); },
				discard: () => { this.staged.clear(); this.publish(); },
				save: async () => {
					const ops = [];
					for (const [field, text] of this.staged) {
						if (this.secrets.has(field)) continue;
						const parsed = this.specs.get(field).parse(text);
						if (!parsed) return;
						ops.push(parsed.kind === "clear" ? { op: "unset", path: [field] } : { op: "set", path: [field], value: parsed.value });
					}
					if (ops.length && !await this.scope.mutate(ops, this.scope.getSnapshot().revision)) return;
					for (const [field, text] of this.staged) if (this.secrets.has(field) && text.trim()) await this.secrets.get(field).write(text.trim());
					this.staged.clear(); this.publish();
				}
			};
		}
		publish() { for (const listener of this.listeners) listener(); }
		dispose() { this.unsubscribeScope(); this.listeners.clear(); }
	},
	settingsTextField: (field) => ({ field, format: (value) => typeof value === "string" ? value : "", parse: (text) => text.trim() ? { kind: "set", value: text.trim() } : { kind: "clear" } }),
	settingsNumberField: (field) => ({ field, format: (value) => typeof value === "number" ? String(value) : "", parse: (text) => text.trim() === "" ? { kind: "clear" } : Number.isFinite(Number(text)) ? { kind: "set", value: Number(text) } : undefined }),
	SettingsSecretField: "SettingsSecretField",
	SettingsValueField: "SettingsValueField"
};
let loaded;
globalThis.window = { __ModuleLoader__: { load: (registration) => { loaded = registration; } } };
await import("../client.js");
const client = loaded.factory((specifier) => {
	if (specifier === "react") return React;
	if (specifier === "@deepseek-ai/dsh-client-ui-primitives") return primitives;
	throw new Error(`Unexpected module: ${specifier}`);
});

function scope({ value = {}, user = {}, base = {}, writable = true } = {}) {
	let current = { status: "ready", value: { ...value }, user: { ...user }, base: { ...base }, revision: 1, writable };
	const listeners = new Set();
	const writes = [];
	return {
		writes,
		getSnapshot: () => current,
		subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
		async mutate(ops, revision) {
			writes.push({ ops, revision });
			const nextValue = { ...current.value };
			const nextUser = { ...current.user };
			for (const op of ops) {
				if (op.op === "set") { nextValue[op.path[0]] = op.value; nextUser[op.path[0]] = op.value; }
				else { delete nextUser[op.path[0]]; if (Object.hasOwn(current.base, op.path[0])) nextValue[op.path[0]] = current.base[op.path[0]]; else delete nextValue[op.path[0]]; }
			}
			current = { ...current, value: nextValue, user: nextUser, revision: current.revision + 1 };
			for (const listener of listeners) listener();
			return true;
		}
	};
}

function credentials() {
	let configured = false;
	const writes = [];
	return {
		writes,
		async describe(refs) { return { ok: true, value: Object.fromEntries(refs.map((ref) => [ref, { configured, writable: true }])) }; },
		async set(ref, value) { writes.push({ ref, value }); configured = true; return { ok: true }; }
	};
}

function mount(formScope, remoteCredentials) {
	let registration;
	const registrations = [];
	const cleanups = [];
	const ctx = {
		effect: (factory) => { cleanups.push(factory()); },
		locale: { register: () => () => {}, bind: () => (key) => key },
		remote: { credentials: remoteCredentials, $on: () => () => {} },
		configForms: {
			get: (namespace) => { assert.equal(namespace, "web-search-9router"); return formScope; },
			whileServed: (namespaces, register) => { assert.deepEqual(namespaces, ["web-search-9router"]); return register(new Set(namespaces)); }
		},
		slots: {
			inject: (name, setup) => { assert.equal(name, "plugins.bundle.config"); return setup(); },
			register: (options, component) => { registration = { options, component }; registrations.push(options.name); return () => {}; }
		}
	};
	client.apply(ctx);
	return { registration, formScope, registrations, dispose: () => cleanups.forEach((cleanup) => cleanup?.()) };
}

test("registers settings directly on the bundle detail page", () => {
	const mounted = mount(scope(), credentials());
	assert.equal(mounted.registration.options.name, "plugins.bundle.config");
	assert.equal(mounted.registration.options.key, "dsh-web-search-9router");
	assert.equal(mounted.registration.options.locale, "web-search-9router");
	assert.deepEqual(mounted.registrations, ["plugins.bundle.config"]);
	assert.deepEqual(client.inject, ["slots", "locale", "remote", "remote.credentials", "configForms"]);
	mounted.dispose();
});

test("saves settings atomically through ConfigForm and clears inherited overrides", async () => {
	const form = scope({ value: { baseURL: "https://user.example/v1", maxResults: 8 }, user: { baseURL: "https://user.example/v1" }, base: { baseURL: "https://base.example/v1" } });
	const mounted = mount(form, credentials());
	const actions = mounted.registration.options.inject();
	actions.edit("searchModel", "search-v2"); actions.resetField("baseURL"); await actions.save();
	assert.deepEqual(form.writes, [{ revision: 1, ops: [
		{ op: "set", path: ["searchModel"], value: "search-v2" }, { op: "unset", path: ["baseURL"] }
	] }]);
	assert.equal(form.getSnapshot().value.baseURL, "https://base.example/v1");
	mounted.dispose();
});

test("rejects invalid numeric drafts without sending config mutations", async () => {
	const form = scope(); const mounted = mount(form, credentials()); const actions = mounted.registration.options.inject();
	actions.edit("maxResults", "not a number"); await actions.save();
	assert.deepEqual(form.writes, []); mounted.dispose();
});

test("writes API keys through credentials without adding them to settings", async () => {
	const form = scope(); const creds = credentials(); const mounted = mount(form, creds); const actions = mounted.registration.options.inject();
	actions.edit("apiKey", "  secret-value  "); await actions.save();
	assert.deepEqual(creds.writes, [{ ref: "NINE_ROUTER_API_KEY", value: "secret-value" }]);
	assert.deepEqual(form.writes, []); assert.equal(form.getSnapshot().value.apiKey, undefined); mounted.dispose();
});

test("renders the shared SettingsForm on the bundle detail page", () => {
	const mounted = mount(scope(), credentials());
	const page = mounted.registration.component({ view: "page", t: (key) => key,
		useNineRouterCard: (selector) => selector(mounted.registration.options.inject().hooks.nineRouterCard.getSnapshot()),
		...mounted.registration.options.inject() });
	assert.equal(page.type.name, "Page");
	const rendered = page.type(page.props);
	assert.equal(rendered.type, primitives.SettingsForm);
	assert.equal(rendered.props.labels.save, "save"); mounted.dispose();
});
