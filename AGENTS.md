# dsh-web-search-9router

## 项目概述

- **描述**：为 DeepSeek Harness（DSH）提供 9router 背书的网页搜索与抓取 provider，接入 `ctx.web`。把原生 `web_search` / `web_fetch` 工具接到 9router 的 `/v1/search` 与 `/v1/web/fetch` 端点。
- **技术栈**：Node.js（ESM）、cordis 插件、`@deepseek-ai/dsh-web` web seam、schemastery 配置。
- **运行时**：Node 20+（与 DSH 要求一致）。
- **仓库地址**：internal（本地 profile 以 `link:` 依赖引入）。

## 目录结构

```text
dsh-web-search-9router/
├── src/index.js       # 插件入口：search + fetch provider
├── test/              # 测试（node --test）
├── package.json       # ESM 插件清单
├── AGENTS.md
├── .gitignore
└── README.md
```

## 环境与依赖

- 包管理器：pnpm
- 环境变量：`NINE_ROUTER_API_KEY`（9router API 密钥，经 credentials 服务解析）、`NINE_ROUTER_BASE_URL`（可选，覆盖默认端点）
- 安装命令：`pnpm install`
- 本地启动：由 DSH profile 加载，无需独立启动

## 接入方式

1. 在 DSH profile 的 `package.json` dependencies 中加入本包：`"dsh-web-search-9router": "link:/home/rebron1900/workspace/projects/active/dsh-web-search-9router"`。
2. 在 profile 的 `dsh.profile.bundles` 中加入 `"dsh-web-search-9router"`。
3. 在 profile 的 `cordis.patch.yml` 中将 `web` 的 `searchProvider` 和 `fetchProvider` 设为 `9router`；不需要禁用 `web-search-deepseek`。
4. 在 `~/.dsh/.credentials.yaml` 中存 `NINE_ROUTER_API_KEY`；或在本插件 settings 段设置字面 `apiKey`。
5. 重启 `dsh web` 后生效。禁用 `web-search-deepseek` 会按设计隐藏它的设置卡片。

## 代码规范

- 纯 ESM，`type: module`，无构建步骤。
- 插件导出 `name` / `inject` / `Config` / `apply`。
- provider 通过 `ctx.web.registerSearchProvider` / `ctx.web.registerFetchProvider` 注册。
- 错误统一用 `@deepseek-ai/dsh-web` 的 `WebError`，机器可路由 code。
- 不提交密钥、token 或本地环境文件。

## 命名约定

- 插件 id：`9router`；cordis 插件名：`web-search-9router`。
- 配置键、变量、函数：小驼峰。

## Git 规范

- 默认分支：`main`
- 分支命名：`feature/<name>`、`fix/<name>`
- Commit：Conventional Commits（feat/fix/chore/docs/test）
- 提交前执行：`pnpm test`

## 测试

- 测试框架：node:test
- 执行命令：`pnpm test`
- 覆盖范围：`mapSearchResponse` 的响应解析与容错。

## CodeGraph

- 状态：未使用

## 常用命令

```bash
pnpm install
pnpm test
```

## 其他规则
- 禁止反向测试和反向注释,不做的事情不用说出来
