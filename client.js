window.__ModuleLoader__.load({
  id: "dsh-web-search-9router",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    const React = require("react");
    const { SettingsForm, SettingsFormModel, SettingsSecretField, SettingsValueField,
      settingsNumberField, settingsTextField } = require("@deepseek-ai/dsh-client-ui-primitives");

    const NAMESPACE = "web-search-9router";
    const BUNDLE_KEY = "dsh-web-search-9router";
    const DEFAULT_API_KEY_REF = "NINE_ROUTER_API_KEY";
    const FIELDS = [
      ["apiKeyEnv", "apiKeyEnv", "apiKeyEnvHint"],
      ["baseURL", "baseURL", "baseURLHint"],
      ["searchModel", "searchModel", "searchModelHint"],
      ["fetchModel", "fetchModel", "fetchModelHint"],
      ["searchType", "searchType", "searchTypeHint"],
      ["maxResults", "maxResults", "maxResultsHint", true],
      ["timeoutMs", "timeoutMs", "timeoutMsHint", true]
    ];
    const LOCALE = {
      zh: {
        title: "9router 网页搜索",
        description: "配置 9router 搜索与网页抓取提供方。",
        unavailable: "该插件当前未加载，暂时无法配置。",
        readOnly: "本部署的设置为只读。",
        saveFailed: "本部署没有接受这些值，已保留供你修改。",
        saving: "保存中…",
        save: "保存",
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
        overridden: "已覆盖",
        reset: "恢复默认",
        invalidNumber: "请填数字；留空表示使用默认值。"
      },
      en: {
        title: "9router Web Search",
        description: "Configure the 9router search and fetch provider.",
        unavailable: "This plugin is not currently loaded, so it cannot be configured.",
        readOnly: "This deployment stores settings read-only.",
        saveFailed: "The deployment did not accept these values; they were left for you to correct.",
        saving: "Saving…",
        save: "Save",
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
        overridden: "Overridden",
        reset: "Reset to default",
        invalidNumber: "Enter a number, or leave blank to use the default."
      }
    };

    function labels(t) {
      return {
        unavailable: t("unavailable"), readOnly: t("readOnly"), saveFailed: t("saveFailed"),
        save: t("save"), saving: t("saving")
      };
    }

    function Page(props) {
      const state = props.useNineRouterCard((snapshot) => snapshot);
      if (props.view === "summary") return props.t("description");
      const disabled = !state.writable;
      const fields = FIELDS.map(([field, label, hint, numeric]) => React.createElement(SettingsValueField, {
        key: field, id: `plugin-config-9router-${field}`, label: props.t(label), hint: props.t(hint),
        overriddenLabel: props.t("overridden"), resetLabel: props.t("reset"),
        invalidLabel: props.t("invalidNumber"), numeric, disabled, ...state[field],
        onEdit: (text) => props.edit(field, text), onReset: () => props.resetField(field)
      }));
      return React.createElement(SettingsForm, {
        labels: labels(props.t), state, onSave: props.save, onDiscard: props.discard
      }, React.createElement("div", { className: "dsh9-fields" },
        React.createElement(SettingsSecretField, {
          id: "plugin-config-9router-api-key", label: props.t("apiKey"), hint: props.t("apiKeyHint"),
          text: state.apiKey.text, configured: state.apiKeyConfigured,
          stateLabel: state.apiKeyConfigured ? props.t("configured") : props.t("notConfigured"),
          disabled: !state.apiKeyWritable, onEdit: (text) => props.edit("apiKey", text)
        }), ...fields));
    }

    class Controller {
      constructor(scope, ctx) {
        this.scope = scope;
        this.ctx = ctx;
        this.credential = { ref: "", configured: false, writable: true };
        this.form = new SettingsFormModel(scope, FIELDS.map(([field, , , numeric]) =>
          numeric ? settingsNumberField(field) : settingsTextField(field)), [{
          field: "apiKey", write: (text) => this.writeKey(text)
        }]);
        this.store = this.form.bind(() => this.project());
        this.unsubscribe = scope.subscribe(() => this.readCredential());
        this.readCredential();
      }
      ref() {
        const value = this.scope.getSnapshot().value?.apiKeyEnv;
        return typeof value === "string" && value.length > 0 ? value : DEFAULT_API_KEY_REF;
      }
      project() {
        return {
          ...this.form.shell(),
          ...Object.fromEntries(FIELDS.map(([field]) => [field, this.form.field(field)])),
          apiKey: this.form.field("apiKey"),
          apiKeyConfigured: this.credential.configured,
          apiKeyWritable: this.credential.writable
        };
      }
      async readCredential() {
        const ref = this.ref();
        if (ref !== this.credential.ref) this.credential = { ref, configured: false, writable: true };
        try {
          const response = await this.ctx.remote.credentials.describe([ref]);
          if (!response.ok || ref !== this.ref()) return;
          const info = response.value?.[ref];
          this.credential = { ref, configured: info?.configured ?? false, writable: info?.writable ?? true };
          this.store.set(this.project());
        } catch {}
      }
      async refreshCredential(ref) {
        if (ref === this.credential.ref) await this.readCredential();
      }
      async writeKey(text) {
        const response = await this.ctx.remote.credentials.set(this.ref(), text);
        if (!response.ok) return false;
        await this.readCredential();
        return this.credential.configured;
      }
      dispose() { this.unsubscribe(); this.form.dispose(); }
    }

    const inject = ["slots", "locale", "remote", "remote.credentials", "configForms"];
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NAMESPACE, LOCALE), "web-search-9router: dictionaries");
      const t = ctx.locale.bind(NAMESPACE);
      const card = new Controller(ctx.configForms.get(NAMESPACE), ctx);
      ctx.effect(() => () => card.dispose(), "web-search-9router: form");
      ctx.effect(() => ctx.remote.$on("credentials/reference-updated", (ref) => card.refreshCredential(ref)),
        "web-search-9router: credential updates");
      ctx.effect(() => ctx.configForms.whileServed([NAMESPACE], () =>
        ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
          name: "plugins.bundle.config", key: BUNDLE_KEY, locale: NAMESPACE,
          inject: () => ({ hooks: { nineRouterCard: card.store }, ...card.form.actions() })
        }, (props) => React.createElement(Page, { ...props, t })))), "web-search-9router: bundle settings page");
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
