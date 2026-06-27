import { Webpack } from "betterdiscord";

export const ApplicationStore = /* @__PURE__ */ Webpack.getStore("ApplicationStore");
export const ApplicationStreamPreviewStore = /* @__PURE__ */ Webpack.getStore("ApplicationStreamPreviewStore");
export const AuthenticationStore = /* @__PURE__ */ Webpack.getStore("AuthenticationStore");
export const ChannelStore = /* @__PURE__ */ Webpack.getStore("ChannelStore");
export const ConnectedAppsStore = /* @__PURE__ */ Webpack.getStore("ConnectedAppsStore");
export const ContentInventoryStore = /* @__PURE__ */ Webpack.getStore("ContentInventoryStore");
export const DispatchApplicationStore = /* @__PURE__@ */ Webpack.getStore("DispatchApplicationStore");
export const FluxStore = /* @__PURE__ */ Webpack.getModule(x => typeof x.ZP?.Store === 'function', {searchExports: false, searchDefault: false});
export const GameStore = /* @__PURE__ */ Webpack.getStore("GameStore");
export const GuildStore = /* @__PURE__ */ Webpack.getStore("GuildStore");
export const LaunchableGameStore = /* @__PURE__@ */ Webpack.getStore("LaunchableGameStore");
export const LibraryApplicationStatisticsStore =  /* @__PURE__ */ Webpack.getStore("LibraryApplicationStatisticsStore");
export const LibraryApplicationStore = /* @__PURE__@ */ Webpack.getStore("LibraryApplicationStore");
export const NewGameStore = /* @__PURE__ */ Webpack.getStore("NewGameStore");
export const NowPlayingViewStore = /* @__PURE__ */ Webpack.getStore("NowPlayingViewStore");
export const PresenceStore = /* @__PURE__ */ Webpack.getStore("PresenceStore");
export const RunningGameStore = /* @__PURE__ */ Webpack.getStore("RunningGameStore");
export const ThemeStore = /* @__PURE__ */ Webpack.getStore("ThemeStore");
export const UserProfileStore = /* @__PURE__ */ Webpack.getStore("UserProfileStore");
export const UserSettingsProtoStore = /* @__PURE__ */ Webpack.getStore("UserSettingsProtoStore");
export const UserStore = /* @__PURE__ */ Webpack.getStore("UserStore");
export const { useStateFromStores } = /* @__PURE__ */ Webpack.getMangled(m => m.Store, { useStateFromStores: /* @__PURE__ */ Webpack.Filters.byStrings("useStateFromStores")}, { raw: true });
export const VoiceStateStore = /* @__PURE__ */ Webpack.getStore("VoiceStateStore");
export const WindowStore = /* @__PURE__ */ Webpack.getStore("WindowStore");



