import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { PROVIDER_ID } from "../src/index.js";

const patches = parse(readFileSync(new URL("../cordis.patch.yml", import.meta.url), "utf8"));

test("bundle activation selects both registered 9router capabilities", () => {
	const selection = patches.find((patch) => patch.id === "web");
	assert.deepEqual(selection?.config, {
		searchProvider: PROVIDER_ID,
		fetchProvider: PROVIDER_ID
	});
});

test("bundle declares the provider entry alongside its selection", () => {
	const entries = patches.flatMap((patch) => patch.insert ?? []);
	assert.ok(entries.some((entry) => entry.id === "web-search-9router" && entry.name === "dsh-web-search-9router"));
});
