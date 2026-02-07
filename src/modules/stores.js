import { Webpack } from "betterdiscord";

export const ApplicationStore = /* @__PURE__ */ Webpack.getStore("ApplicationStore");
export const ApplicationStreamPreviewStore = /* @__PURE__ */ Webpack.getStore("ApplicationStreamPreviewStore");
export const ChannelStore = /* @__PURE__ */ Webpack.getStore("ChannelStore");
export const DetectableGameSupplementalStore = /* @__PURE__ */ Webpack.getStore("DetectableGameSupplementalStore");
export const FluxStore = /* @__PURE__ */ Webpack.getModule(x => typeof x.ZP?.Store === 'function', {searchExports: false, searchDefault: false});
export const GameStore = /* @__PURE__ */ Webpack.getStore("GameStore");
export const GuildStore = /* @__PURE__ */ Webpack.getStore("GuildStore");
export const NowPlayingViewStore = /* @__PURE__ */ Webpack.getStore("NowPlayingViewStore");
export const RunningGameStore = /* @__PURE__ */ Webpack.getStore("RunningGameStore");
export const ThemeStore = /* @__PURE__ */ Webpack.getStore("ThemeStore");
export const UserStore = /* @__PURE__ */ Webpack.getStore("UserStore");
export const { useStateFromStores } = /* @__PURE__ */ Webpack.getMangled(m => m.Store, { useStateFromStores: /* @__PURE__ */ Webpack.Filters.byStrings("useStateFromStores")}, { raw: true });
export const VoiceStateStore = /* @__PURE__ */ Webpack.getStore("VoiceStateStore");
export const WindowStore = /* @__PURE__ */ Webpack.getStore("WindowStore");



