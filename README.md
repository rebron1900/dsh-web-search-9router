# 🌐 dsh-web-search-9router

> **Web search & fetch for DeepSeek Harness, powered by 9router.**
> Wires the native `web_search` and `web_fetch` tools into 9router's `/v1/search` and `/v1/web/fetch` endpoints — no server-side search tool required.

[![Version](https://img.shields.io/badge/version-0.2.3-green)](https://github.com/lordraiden/dsh-web-search-9router/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![DSH](https://img.shields.io/badge/DSH-%3E%3D0.2.0--rc.2-brightgreen)](https://github.com/deepseek-ai/DeepSeek-Harness)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![ESM](https://img.shields.io/badge/module-ESM-8e44ad)](https://nodejs.org/api/esm.html)
[![GitHub stars](https://img.shields.io/github/stars/lordraiden/dsh-web-search-9router?style=social)](https://github.com/lordraiden/dsh-web-search-9router)

🇺🇸 **English** · [🇨🇳 简体中文](./README.zh-CN.md)

---

## ✨ What it does

- 🔎 **Search provider** — routes DSH's native `web_search` through 9router's `/v1/search`, returning deduplicated `WebSource` results (title, snippet, published date).
- 📄 **Fetch provider** — routes DSH's native `web_fetch` through 9router's `/v1/web/fetch`, returning clean text/markdown bodies.
- 🎛️ **Bundle settings** — configure the API key, base URL, models, and limits directly on the plugin's bundle detail page.
- 🔐 **Credentials-aware** — stores API keys through DSH's credentials service and resolves the configured credential reference (`NINE_ROUTER_API_KEY` by default).
- 🧱 **Zero build** — pure ESM, plain JavaScript, no bundler required.

## 🧭 Why this plugin

DSH's default `web_search` uses the `web-search-deepseek` provider, which requires the upstream service to implement Anthropic's `web_search_20250305` **server-side** search tool and return `web_search_tool_result` blocks.

9router is an **OpenAI-compatible gateway**: it passes that tool definition to the model as a regular function *instead of executing searches server-side* — so it cannot provide native search by itself.

| | `web-search-deepseek` (default) | **9router (this plugin)** |
|---|---|---|
| Requires | Anthropic `web_search_20250305` server-side tool | Any 9router-compatible gateway |
| Works with 9router | ❌ | ✅ |
| Search endpoint | model-provided | `POST /v1/search` |
| Fetch endpoint | model-provided | `POST /v1/web/fetch` |

This plugin calls 9router's own endpoints directly and maps their responses to the `WebSource` and `WebFetchBody` types expected by the DSH web seam.

## ⚙️ How it works

```text
 web_search / web_fetch (native DSH tools)
            │
            ▼
        ctx.web seam
            │  provider = "9router"
            ▼
  dsh-web-search-9router
   ├── search  → POST {baseURL}/search      → WebSource[]
   └── fetch   → POST {baseURL}/web/fetch   → WebFetchBody
            │
            ▼
      9router gateway (9router)
```

Errors surface as machine-routable `WebError` codes (`WEB_PROVIDER_ERROR`, `WEB_PROVIDER_CREDENTIAL_MISSING`, `WEB_ABORTED`), and non-2xx fetch responses come back as results — never silent throws.

## 🚀 Quick start

**Requirements:** DSH `>=0.2.0-rc.2` and Node.js 20 or later.

**1. Install the plugin**

```bash
npx @deepseek-ai/dsh plugin --profile web add github:lordraiden/dsh-web-search-9router
```

**2. Select the providers**

In your profile's `cordis.patch.yml`, set `searchProvider` and `fetchProvider` to `9router`:

```yaml
- id: web
  config:
    searchProvider: 9router
    fetchProvider: 9router
```

**3. Configure the plugin**

Restart DSH and refresh the browser. Open **Plugins**, select **dsh-web-search-9router**, and configure it directly on the bundle detail page. Entering an API key stores it in DSH credentials under the selected credential reference; the key is never written to plugin settings.

> 🔒 **Reproducible installs** — append a commit SHA to pin an exact version:
>
> ```bash
> npx @deepseek-ai/dsh plugin --profile web add github:lordraiden/dsh-web-search-9router#44d1936
> ```

## 🛠️ Configuration

| Key | Type | Default | Description |
|---|---|---|---|
| `baseURL` | string | 9router default endpoint | Base URL of your 9router-compatible API (`NINE_ROUTER_BASE_URL` env also honored) |
| `searchModel` | string | `search-combo` | Model name for the search endpoint |
| `fetchModel` | string | `fetch-combo` | Model name for the fetch endpoint |
| `searchType` | string | `web` | `search_type` sent to the search endpoint |
| `maxResults` | number | `8` | Max sources per search |
| `timeoutMs` | number | `30000` | Per-request timeout |
| API key | credential | — | Write-only field stored by the DSH credentials service, not in plugin settings |
| `apiKeyEnv` | credential-ref | `NINE_ROUTER_API_KEY` | Credential reference used to store and resolve the API key |

## 🧪 Development

```bash
pnpm install   # install dependencies
pnpm test      # run the test suite (node:test)
```

**Repository layout**

```text
dsh-web-search-9router/
├── src/index.js       # plugin entry: search + fetch providers
├── client.js          # bundle detail settings form
├── cordis.patch.yml   # bundle patch registering the plugin
├── test/              # node --test suite
└── package.json       # ESM plugin manifest
```

## 🌱 Ecosystem & releases

- 📦 **Distribution** — the GitHub repository is the only distribution source; stable versions ship as `v<version>` GitHub Releases.
- 📚 **Directory** — listed in [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin).
- 🐛 **Issues & requests** — open an [issue](https://github.com/lordraiden/dsh-web-search-9router/issues).

## 📄 License

[MIT](./LICENSE)

## 🙏 Acknowledgments

This project is a fork of [rebron1900/dsh-web-search-9router](https://github.com/rebron1900/dsh-web-search-9router) — thank you for the original 9router-backed web search and fetch provider for DeepSeek Harness.
