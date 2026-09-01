window.__ModuleLoader__.load({
  id: "dsh-web-search-9router",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    const React = require("react");
    const { createSnapshotStore } = require("@deepseek-ai/dsh-client-store");
    const { useMemo, useSyncExternalStore } = React;

    const NAMESPACE = "web-search-9router";
    const LOCALE = {
      zh: {
        title: "9router 网页搜索",
        description: "配置 9router 搜索与网页抓取提供方。",
        expand: "展开设置",
        collapse: "收起设置",
        unsaved: "未保存",
        apiKey: "API Key",
        apiKeyHint: "密钥保存在本机。留空表示保持当前密钥。",
        configured: "已配置",
        notConfigured: "未配置",
        apiKeyEnv: "API Key 凭据引用",
        apiKeyEnvHint: "由 DSH 凭据服务解析的凭据名称。",
        baseURL: "接口地址",
        baseURLHint: "留空则使用提供方默认地址。",
        searchModel: "搜索模型",
        searchModelHint: "网页搜索端点使用的模型。",
        fetchModel: "抓取模型",
        fetchModelHint: "网页抓取端点使用的模型。",
        searchType: "搜索类型",
        searchTypeHint: "9router 使用的搜索模式。",
        maxResults: "最大结果数",
        maxResultsHint: "每次搜索返回的结果数量。",
        timeoutMs: "超时时间（毫秒）",
        timeoutMsHint: "请求超时后终止提供方请求。",
        discard: "放弃修改",
        save: "保存",
        saving: "保存中…",
        saveFailed: "保存失败，请检查配置后重试。",
        invalidNumber: "请输入有效数字。"
      },
      en: {
        title: "9router Web Search",
        description: "Configure the 9router search and fetch provider.",
        expand: "Expand settings",
        collapse: "Collapse settings",
        unsaved: "Unsaved",
        apiKey: "API key",
        apiKeyHint: "Stored locally. Leave blank to keep the current key.",
        configured: "Configured",
        notConfigured: "Not configured",
        apiKeyEnv: "API key credential reference",
        apiKeyEnvHint: "Credential name resolved by the DSH credentials service.",
        baseURL: "Base URL",
        baseURLHint: "Leave blank to use the provider default.",
        searchModel: "Search model",
        searchModelHint: "Model used by the web search endpoint.",
        fetchModel: "Fetch model",
        fetchModelHint: "Model used by the web fetch endpoint.",
        searchType: "Search type",
        searchTypeHint: "The search mode used by 9router.",
        maxResults: "Maximum results",
        maxResultsHint: "Number of results returned per search.",
        timeoutMs: "Timeout (ms)",
        timeoutMsHint: "Abort the provider request after this timeout.",
        discard: "Discard changes",
        save: "Save",
        saving: "Saving…",
        saveFailed: "Unable to save. Check the configuration and try again.",
        invalidNumber: "Enter a valid number."
      }
    };
    const css = `.dsh9-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}.dsh9-card-open{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.dsh9-header{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:transparent;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}.dsh9-header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}.dsh9-head-text{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.dsh9-name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}.dsh9-description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}.dsh9-chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}.dsh9-chevron-open{transform:rotate(180deg)}.dsh9-body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}.dsh9-field{flex-direction:column;gap:6px;padding:12px 0;display:flex}.dsh9-field+.dsh9-field{border-top:1px solid var(--dsw-alias-border-l2)}.dsh9-label{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:1.5}.dsh9-input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.dsh9-input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.dsh9-input:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}.dsh9-hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}.dsh9-badge{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.dsh9-head{align-items:center;display:flex;justify-content:space-between;gap:8px}.dsh9-footer{border-top:1px solid var(--dsw-alias-border-l2);justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px;display:flex}.dsh9-error{min-width:0;color:var(--dsw-alias-label-error);flex:1;margin:0;font-size:12px;line-height:1.5}.dsh9-button{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}.dsh9-discard{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:transparent}.dsh9-save{color:var(--dsw-alias-label-on-brand);background:var(--dsw-alias-brand-primary)}.dsh9-button:disabled{opacity:.45;cursor:default}`;
    if (typeof document !== "undefined" && !document.querySelector('style[data-plugin-css="dsh-web-search-9router"]')) {
      const style = document.createElement("style");
      style.dataset.pluginCss = "dsh-web-search-9router";
      style.textContent = css;
      document.head.appendChild(style);
    }

    function Field({ id, label, hint, value, disabled, type = "text", onChange }) {
      return React.createElement("div", { className: "dsh9-field" },
        React.createElement("label", { className: "dsh9-label", htmlFor: id }, label),
        React.createElement("input", {
          id, type, inputMode: type === "number" ? "numeric" : undefined,
          className: "dsh9-input", value: value ?? "", disabled,
          onChange: (event) => onChange(event.target.value)
        }),
        hint ? React.createElement("p", { className: "dsh9-hint" }, hint) : null
      );
    }

    function SecretField({ id, label, hint, value, configured, configuredLabel, notConfiguredLabel, disabled, onChange }) {
      return React.createElement("div", { className: "dsh9-field" },
        React.createElement("div", { className: "dsh9-head" },
          React.createElement("label", { className: "dsh9-label", htmlFor: id }, label),
          React.createElement("span", { className: "dsh9-badge" }, configured ? configuredLabel : notConfiguredLabel)
        ),
        React.createElement("input", { id, type: "password", autoComplete: "off", className: "dsh9-input", value: value ?? "", disabled, onChange: (event) => onChange(event.target.value) }),
        React.createElement("p", { className: "dsh9-hint" }, hint)
      );
    }

    function Card(props) {
      const state = props.useNineRouterCard((snapshot) => snapshot);
      const [open, setOpen] = React.useState(false);
      const localeSubscribe = useMemo(() => props.locale?.subscribe?.bind(props.locale) ?? (() => () => {}), [props.locale]);
      const localeGetSnapshot = useMemo(() => props.locale?.getSnapshot?.bind(props.locale) ?? (() => undefined), [props.locale]);
      useSyncExternalStore(localeSubscribe, localeGetSnapshot);
      const t = props.t;
      if (!state.available) return null;
      const disabled = !state.writable || state.saving;
      const numberInvalid = (field) => state.fields[field] !== "" && !Number.isFinite(Number(state.fields[field]));
      const invalid = numberInvalid("maxResults") || numberInvalid("timeoutMs");
      const blocked = disabled || !state.dirty || invalid;
      const field = (key, label, hint, type = "text") => React.createElement(Field, { id: `dsh9-${key}`, label: t(label), hint: t(hint), type, value: state.fields[key], disabled, onChange: (value) => props.edit(key, value) });
      return React.createElement("li", { className: open ? "dsh9-card dsh9-card-open" : "dsh9-card" },
        React.createElement("button", { type: "button", className: "dsh9-header", "aria-expanded": open, "aria-label": `${t(open ? "collapse" : "expand")}: ${t("title")}`, onClick: () => setOpen(!open) },
          React.createElement("span", { className: "dsh9-head-text" },
            React.createElement("span", { className: "dsh9-name" }, t("title")),
            React.createElement("span", { className: "dsh9-description" }, t("description"))
          ),
          state.dirty ? React.createElement("span", { className: "dsh9-badge" }, t("unsaved")) : null,
          React.createElement("span", { className: open ? "dsh9-chevron dsh9-chevron-open" : "dsh9-chevron", "aria-hidden": "true" }, "⌄")
        ),
        open ? React.createElement("div", { className: "dsh9-body" },
          React.createElement(SecretField, { id: "dsh9-api-key", label: t("apiKey"), hint: t("apiKeyHint"), value: state.fields.apiKey, configured: state.apiKeyConfigured, configuredLabel: t("configured"), notConfiguredLabel: t("notConfigured"), disabled: disabled || !state.apiKeyWritable, onChange: (value) => props.edit("apiKey", value) }),
          field("baseURL", "baseURL", "baseURLHint"),
          field("searchModel", "searchModel", "searchModelHint"),
          field("fetchModel", "fetchModel", "fetchModelHint"),
          field("searchType", "searchType", "searchTypeHint"),
          field("maxResults", "maxResults", "maxResultsHint", "number"),
          field("timeoutMs", "timeoutMs", "timeoutMsHint", "number"),
          invalid ? React.createElement("p", { className: "dsh9-error", role: "status" }, t("invalidNumber")) : null,
          React.createElement("div", { className: "dsh9-footer" },
            state.error ? React.createElement("p", { className: "dsh9-error", role: "status" }, state.error) : null,
            React.createElement("button", { type: "button", className: "dsh9-button dsh9-discard", disabled: disabled || !state.dirty, onClick: props.discard }, t("discard")),
            React.createElement("button", { type: "button", className: "dsh9-button dsh9-save", disabled: blocked, onClick: props.save }, state.saving ? t("saving") : t("save"))
          )
        ) : null
      );
    }

    class Controller {
      constructor(scope, remote) {
        this.scope = scope;
        this.remote = remote;
        this.staged = new Map();
        this.credential = { ref: "", configured: false, writable: true };
        this.saving = false;
        this.error = "";
        this.store = createSnapshotStore(this.project());
        scope.subscribe(() => { this.publish(); this.readCredential(); });
        this.readCredential();
      }
      project() {
        const value = this.scope.getSnapshot().value ?? {};
        const fields = {};
        for (const field of ["apiKey", "apiKeyEnv", "baseURL", "searchModel", "fetchModel", "searchType", "maxResults", "timeoutMs"]) {
          fields[field] = this.staged.has(field) ? this.staged.get(field) : value[field] ?? "";
        }
        return {
          available: this.scope.getSnapshot().status === "ready",
          writable: this.scope.getSnapshot().writable,
          dirty: this.staged.size > 0,
          saving: this.saving,
          error: this.error,
          fields,
          apiKeyConfigured: this.credential.configured,
          apiKeyWritable: this.credential.writable
        };
      }
      publish() { this.store.set(this.project()); }
      async readCredential() {
        const ref = this.scope.getSnapshot().value?.apiKeyEnv ?? "NINE_ROUTER_API_KEY";
        if (!this.remote?.credentials?.describe) return;
        this.credential = { ref, configured: false, writable: true, pending: true };
        this.publish();
        try {
          const response = await this.remote.credentials.describe([ref]);
          if (!response.ok) return;
          const view = response.value?.[ref];
          if (ref === (this.scope.getSnapshot().value?.apiKeyEnv ?? "NINE_ROUTER_API_KEY")) {
            this.credential = { ref, configured: view?.configured ?? false, writable: view?.writable ?? true };
            this.publish();
          }
        } catch {}
      }
      async writeCredential(value) {
        if (!this.remote?.credentials?.set) return false;
        const ref = this.scope.getSnapshot().value?.apiKeyEnv ?? "NINE_ROUTER_API_KEY";
        const response = await this.remote.credentials.set(ref, value);
        if (!response.ok) return false;
        await this.readCredential();
        return this.credential.configured;
      }
      edit(field, value) { this.staged.set(field, value); this.error = ""; this.publish(); }
      discard() { this.staged.clear(); this.error = ""; this.publish(); }
      async save() {
        if (this.saving || this.staged.size === 0) return;
        this.saving = true; this.error = ""; this.publish();
        try {
          for (const [field, raw] of this.staged) {
            if (field === "apiKey") {
              if (raw !== "") await this.writeCredential(raw);
              continue;
            }
            if (raw === "") await this.scope.unset(field);
            else {
              const value = ["maxResults", "timeoutMs"].includes(field) ? Number(raw) : raw;
              await this.scope.set(field, value);
            }
          }
          this.staged.delete("apiKey");
          if (this.staged.size === 0) this.error = "";
        } catch (error) {
          this.error = String(error?.message ?? error);
        } finally {
          this.saving = false; this.publish();
        }
      }
      inject() {
        return { hooks: { nineRouterCard: this.store }, edit: (field, value) => this.edit(field, value), save: () => this.save(), discard: () => this.discard() };
      }
    }

    const inject = ["slots", "locale", "remote", "remote.credentials", "settingsScope"];
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NAMESPACE, LOCALE), "web-search-9router: dictionaries");
      const t = ctx.locale.bind(NAMESPACE);
      const controller = new Controller(ctx.settingsScope.bind({ namespace: NAMESPACE }), ctx.remote);
      ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
        name: "settings.plugin.item",
        key: NAMESPACE,
        locale: NAMESPACE,
        inject: () => ({ ...controller.inject(), t, locale: ctx.locale })
      }, Card));
      ctx.effect(() => () => controller.scope.dispose?.(), "9router settings card");
    }
    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
