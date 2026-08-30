# dsh-web-search-9router

A 9router-backed web search and fetch provider for DeepSeek Harness (DSH). It integrates with `ctx.web` so the native `web_search` and `web_fetch` tools use 9router's `/v1/search` and `/v1/web/fetch` endpoints.

## Why this plugin

DSH's default `web_search` uses the `web-search-deepseek` provider, which requires the upstream service to implement Anthropic's `web_search_20250305` server-side search tool and return `web_search_tool_result` blocks. 9router is an OpenAI-compatible gateway that passes this tool definition to the model as a regular function instead of executing searches server-side, so it cannot provide native search by itself.

This plugin calls 9router's `/v1/search` and `/v1/web/fetch` endpoints directly and maps their responses to the `WebSource` and `WebFetchBody` types expected by the DSH web seam.

## Configuration

- `baseURL`: The base URL of your 9router-compatible API.
- `searchModel`: Defaults to `search-combo`.
- `fetchModel`: Defaults to `fetch-combo`.
- `searchType`: Defaults to `web`.
- `maxResults`: Defaults to `8`.
- `apiKey`: A literal API key (optional, secret).
- `apiKeyEnv`: A credential reference; defaults to `NINE_ROUTER_API_KEY`.

## Install

```bash
npx @deepseek-ai/dsh plugin --profile web add github:rebron1900/dsh-web-search-9router
```

Restart Harness, then hard-refresh the browser. Configure `searchProvider` and `fetchProvider` as `9router` in `cordis.patch.yml`, and configure `NINE_ROUTER_API_KEY` in `~/.dsh/.credentials.yaml` or set `apiKey` in the plugin settings.

To lock a reproducible install, append a commit SHA:

```bash
npx @deepseek-ai/dsh plugin --profile web add github:rebron1900/dsh-web-search-9router#44d1936
```

## Testing

```bash
pnpm test
```
