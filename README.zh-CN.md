# dsh-web-search-9router

为 DeepSeek Harness（DSH）提供 9router 背书的网页搜索与抓取 provider，接入 `ctx.web`，让原生
`web_search` / `web_fetch` 工具使用 9router 的 `/v1/search` 与 `/v1/web/fetch` 端点。

## 为什么需要它

DSH 默认的 `web_search` 走到 `web-search-deepseek` provider，它要求上游实现 Anthropic 的
`web_search_20250305` 服务端搜索工具并返回 `web_search_tool_result` 块。9router 是
OpenAI-compatible 网关，只把该工具当作普通函数定义交给模型，并不会在服务端执行搜索，因此无法
用于原生搜索。本插件直接调用 9router 自有的 `/v1/search` / `/v1/web/fetch`，返回结果映射成
DSH seam 需要的 `WebSource` / `WebFetchBody`。

## 配置

- `baseURL`：9router 兼容 API 的基础地址，请配置为你自己的服务地址。
- `searchModel`：默认 `search-combo`。
- `fetchModel`：默认 `fetch-combo`。
- `searchType`：默认 `web`。
- `maxResults`：默认 `8`。
- `apiKey`：字面密钥（可选，secret）。
- `apiKeyEnv`：credential ref，默认 `NINE_ROUTER_API_KEY`。

## 接入步骤

1. 在 DSH profile 的 `package.json` 加依赖：
   ```json
   "dsh-web-search-9router": "link:/home/rebron1900/workspace/projects/active/dsh-web-search-9router"
   ```
2. 在 `dsh.profile.bundles` 加入 `"dsh-web-search-9router"`。
3. 在 `cordis.patch.yml` 将 `web` 的 `searchProvider` 和 `fetchProvider` 设为 `9router`；不需要禁用 `web-search-deepseek`。
4. 在 `~/.dsh/.credentials.yaml` 存 `NINE_ROUTER_API_KEY`，或在本插件 settings 段设置字面 `apiKey`。
5. 重启 `dsh web` 生效。禁用 `web-search-deepseek` 会按设计隐藏它的设置卡片。

## 测试

```bash
pnpm test
```
