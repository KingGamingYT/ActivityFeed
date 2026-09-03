import { Webpack } from "betterdiscord";

const Filters = [
    { name: "ActivityActions", filter: /* @__PURE__ */ Webpack.Filters.byStrings('display', 'getUserOutbox') },
    { name: "ActivityCardClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('gameState', 'clickableImage') },
    { name: "ActivityTimer", filter: /* @__PURE__ */ Webpack.Filters.byStrings('timestamps', '.TEXT_FEEDBACK_POSITIVE'), searchExports: true },
    { name: "Anchor", filter: /* @__PURE__ */ Webpack.Filters.byStrings("role", "useDefaultUnderlineStyles"), searchExports: true },
    { name: "Animated", filter: x => x.Easing && x.accelerate },
    { name: "AvatarFetch", filter: /* @__PURE__ */ Webpack.Filters.byStrings('src', 'statusColor', 'size', 'isMobile'), searchExports: true },
    { name: "BasicLibraryApplication", filter: /* @__PURE__ */ Webpack.Filters.byPrototypeKeys('getDistributor') },
    { name: "ButtonVoidClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('lookFilled', 'button') },
    { name: "ButtonManaClasses", filter: x => x.primary && x.hasText && !x.hasTrailing },
    { name: "CallButtons", filter: /* @__PURE__ */ Webpack.Filters.byStrings('PRESS_JOIN_CALL_BUTTON') },
    { name: "CaretClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('caret', 'caret--center') },
    { name: "ChannelActionCreators", filter: x => x.openPrivateChannel },
    { name: "Clipboard", filter: /* @__PURE__ */ Webpack.Filters.byStrings('navigator.clipboard.write', 'Clipboard API not supported.'), searchExports: true },
    { name: "ClydeIcon", filter: /* @__PURE__ */ Webpack.Filters.byStrings('colorClass', 'M19.73'), searchExports: true },
    { name: "ContainerRefProvider", filter: /* @__PURE__ */ Webpack.Filters.byStrings('disableFocusRingScope', 'containerRef'), searchExports: true },
    { name: "Endpoints", filter: /* @__PURE__ */ Webpack.Filters.byKeys("GUILD_EMOJI", "GUILD_EMOJIS"), searchExports: true },
    { name: "FetchApplications", filter: /* @__PURE__ */ Webpack.Filters.byKeys("getApplicationsForGuild") },
    { name: "FetchUserApplicationStatistics", filter: /* @__PURE__ */ Webpack.Filters.byStrings('"USER_ACTIVITY_STATISTICS_FETCH_SUCCESS"'), searchExports: true },
    { name: "FetchUserProfile", filter: /* @__PURE__ */ Webpack.Filters.byStrings("fetchProfile error", "USER_PROFILE_FETCH_FAILURE"), searchExports: true },
    { name: "Flex", filter: /* @__PURE__ */ Webpack.Filters.byStrings('grow', 'shrink', 'align', 'basis') },
    { name: "Flux", filter: /* @__PURE__ */ Webpack.Filters.byKeys('PersistedStore', 'connectStores') },
    { name: "FluxDispatcher", filter: /* @__PURE__ */ Webpack.Filters.byKeys('dispatch', 'subscribe', 'register'), searchExports: true },
    { name: "FormSwitch", filter: /* @__PURE__ */ Webpack.Filters.byStrings('hasIcon', 'switchIconsEnabled'), searchExports: true },
    { name: "GameControllerIcon", filter: /* @__PURE__ */ Webpack.Filters.byStrings('.09v4.91a3.09'),  searchExports: true },
    { name: "GameFetchModule", filter: /* @__PURE__ */ Webpack.Filters.bySource("type:\"GAME_FETCH_SUCCESS\",gameIds:") },
    { name: "GameProfileCheck", filter: /* @__PURE__ */ Webpack.Filters.byStrings('gameProfileModalChecks',  'onOpened') },
    { name: "GradientComponent", filter: /* @__PURE__ */ Webpack.Filters.byStrings('darken'), searchExports: true },
    { name: "HeaderBar", filter: /* @__PURE__ */ Webpack.Filters.byKeys("Icon", "Divider") }, 
    { name: "HTTPUtils", filter: x => typeof x === "object" && x.del && x.put, searchExports: true },
    { name: "intl", filter: x=>x.t && x.t.formatToMarkdownString },
    { name: "IsGameLaunchable", filter: /* @__PURE__ */ Webpack.Filters.byStrings('ConnectedAppsStore', 'branchId') },
    { name: "LibraryApplicationUtils", filter: x => x.installApplication },
    { name: "Link", filter: /* @__PURE__ */ Webpack.Filters.byStrings('Anchor', 'href', 'stopPropagation'), searchExports: true },
    { name: "LinkButton", filter: /* @__PURE__ */ Webpack.Filters.byStrings('route', 'iconClassName'), searchExports: true },
    { name: "LinkButtonClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('linkButtonIcon') },
    { name: "LiveBadge", filter: /* @__PURE__ */ Webpack.Filters.byStrings('shape', '.ROUND') },
    { name: "Lodash", filter: /* @__PURE__ */ Webpack.Filters.byKeys('throttle') },
    { name: "Mask", filter: x => x.Masks },
    { name: "MediaProgressBar", filter: /* @__PURE__ */ Webpack.Filters.byStrings('start', 'end', 'duration', 'percentage'), searchExports: true },
    { name: "ModalSystem", filter: x=> x.openModal },
    { name: "ModalRoot", filter: x => x.Modal },
    { name: "NintendoSwitchNeutralIcon", filter: /* @__PURE__ */ Webpack.Filters.byStrings('colorClass', 'M10.04'), searchExports: true },
    { name: "OpenAlbum", filter: /* @__PURE__ */ Webpack.Filters.byStrings('.ALBUM', '.EPISODE'), searchExports: true },
    { name: "OpenArtist", filter: /* @__PURE__ */ Webpack.Filters.byStrings('"no artist ids in metadata"'), searchExports: true },
    { name: "OpenLink", filter: /* @__PURE__ */ Webpack.Filters.byStrings('UserProfile', 'activity', 'application', 'void') },
    { name: "OpenStream", filter: /* @__PURE__ */ Webpack.Filters.byStrings('guildId', 'getWindowOpen', 'CHANNEL_CALL_POPOUT'), searchExports: true },
    { name: "OpenTrack", filter: /* @__PURE__ */ Webpack.Filters.byStrings('.TRACK', 'isProtocolRegistered'), searchExports: true },
    { name: "OpenUserSettings", filter: x=> x.openUserSettings },
    { name: "Popout", filter: /* @__PURE__ */ Webpack.Filters.byStrings("Unsupported animation config:"), searchExports: true },
    { name: "PopoverClasses", filter: x => x.graphic && x.closeButton },
    { name: "PositionClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('noWrap') },
    { name: "ScrollerClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('customTheme', 'thin') },
    { name: "ScrollerHandler", filter: /* @__PURE__ */ Webpack.Filters.byStrings('"rtl"', 'getComputedStyle') },
    { name: "ScrollerAnimationHandler", filter: /* @__PURE__ */ Webpack.Filters.byStrings('animate', 'Math.max(0,', 'scrollPosition') },
    { name: "ScrollerGutterHandler", filter: /* @__PURE__ */ Webpack.Filters.byStrings('scrollbarGutter', 'ownerDocument') },
    { name: "ScrollerRefHandler", filter: /* @__PURE__ */ Webpack.Filters.byStrings('offsetWidth', 'dirty') },
    { name: "ScrollerScrollHandler", filter: /* @__PURE__ */ Webpack.Filters.byStrings('getNodeWindow', 'clamp') },
    { name: "ScrollerStyleHandler", filter: /* @__PURE__ */ Webpack.Filters.byStrings('arguments[2]:"scroll"') },
    { name: "ScrollerOverflowPopoutClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('popoutWrapper', 'size24') },
    { name: "SelectedChannelActionCreators", filter: x=> x.selectVoiceChannel, searchExports: true },
    { name: "Spinner", filter: /* @__PURE__ */ Webpack.Filters.byStrings('="wanderingCubes'), searchExports:true },
    { name: "SupportsAskToJoin", filter: /* @__PURE__ */ Webpack.Filters.byStrings("JOIN)&&", "&&!!(0,"), searchExports: true },
    { name: "TextFormatClasses", filter: /* @__PURE__ */ Webpack.Filters.byKeys('defaultColor') },
    { name: "Text", filter: x => x?.render && x?.render?.toString().includes('tabularNumbers'), searchExports: true },
    { name: "Tooltip", filter: /* @__PURE__ */ Webpack.Filters.byPrototypeKeys("renderTooltip"), searchExports: true },
    { name: "TransitionGroup", filter: /* @__PURE__ */ Webpack.Filters.byStrings("transitionAppear"), searchExports: true },
    { name: "UseStreamPreviewURL", filter: /* @__PURE__ */ Webpack.Filters.byStrings(".canBasicChannel", "previewUrl:", ".CONNECT", "getVoiceChannelId") },
    { name: "UserProfileModalActionCreators", filter: x=>x.openUserProfileModal },
    { name: "UserProfileWrapperComponent", filter: /* @__PURE__ */ Webpack.Filters.byStrings('onClickContainer:', 'user:', '.isNonUserBot()?') },
    { name: "UsernameUtils", filter: x => x.humanizeStatus },
    { name: "VoiceList", filter: /* @__PURE__ */ Webpack.Filters.byStrings('maxUsers', 'guildId', 'getNickname') },
    { name: "XboxNeutralIcon", filter: /* @__PURE__ */ Webpack.Filters.byStrings('22.95c-1.7-.16-3.4-.77-4.88-1.73-1.24-.8-1.52-1.13-1.52-1.8'), searchExports: true },
    { name: "ManaSwitch", filter: Webpack.Filters.byStrings('SWITCH_BACKGROUND_DEFAULT'), searchExports: true }
]

export const bulkData = /* @__PURE__ */ Webpack.getBulk(...Filters);

const CommonExport = () => {
    const result = {};
    Filters.forEach((component, index) => {
        result[component.name] = component.target ? bulkData[index][component.target] : bulkData[index];
    });
    return result;
}

export const Common = CommonExport();

export const { shell } = require('electron');
export const { container } = /* @__PURE__ */ Webpack.getModule(m => m.container && m.panels);

export const Title = /* @__PURE__ */ Webpack.getMangled('flashQueue', {
    WindowTitle: /* @__PURE__ */ Webpack.Filters.byStrings('null')
})

export const ContextMenus = () => {
    let ContextMenuUser = Webpack.getByStrings('isGroupDM', 'targetIsUser', 'guildId', {searchExports: true});
    let ContextMenuActivityFeed = Webpack.getBySource(".ACTIVITY_PANEL,\"NowPlaying\")", { declarationFilter: x => x?.displayName === "withAnalyticsContext()" }).render().props.children().type.prototype.handleChannelContextMenu;
    if (!ContextMenuUser) {
        ContextMenuUser = Webpack.getByStrings('isGroupDM', 'targetIsUser', 'guildId', {searchExports: true});
        ContextMenuActivityFeed = Webpack.getBySource(".ACTIVITY_PANEL,\"NowPlaying\")", { declarationFilter: x => x?.displayName === "withAnalyticsContext()" }).render().props.children().type.prototype.handleChannelContextMenu;
    }
    return {ContextMenuUser, ContextMenuActivityFeed};
}

export const CardPopout = Webpack.getBySource("ACTIVITY_FEED_GUILD_VISITED", { declarationFilter: Webpack.Filters.byStrings("ACTIVITY_FEED_GUILD_VISITED") });
export const AccountPanel = Webpack.getMangled(Webpack.Filters.bySource('"AccountCoachmark"'), {
    Settings: Webpack.Filters.byStrings('webBuildOverride')
}, { mapDeclarations: true });

export const ControllerIcon = "M5.79335761,5 L18.2066424,5 C19.7805584,5 21.0868816,6.21634264 21.1990185,7.78625885 L21.8575059,17.0050826 C21.9307825,18.0309548 21.1585512,18.9219909 20.132679,18.9952675 C20.088523,18.9984215 20.0442685,19 20,19 C18.8245863,19 17.8000084,18.2000338 17.5149287,17.059715 L17,15 L7,15 L6.48507125,17.059715 C6.19999155,18.2000338 5.1754137,19 4,19 C2.97151413,19 2.13776159,18.1662475 2.13776159,17.1377616 C2.13776159,17.0934931 2.1393401,17.0492386 2.1424941,17.0050826 L2.80098151,7.78625885 C2.91311838,6.21634264 4.21944161,5 5.79335761,5 Z M14.5,10 C15.3284271,10 16,9.32842712 16,8.5 C16,7.67157288 15.3284271,7 14.5,7 C13.6715729,7 13,7.67157288 13,8.5 C13,9.32842712 13.6715729,10 14.5,10 Z M18.5,13 C19.3284271,13 20,12.3284271 20,11.5 C20,10.6715729 19.3284271,10 18.5,10 C17.6715729,10 17,10.6715729 17,11.5 C17,12.3284271 17.6715729,13 18.5,13 Z M6,9 L4,9 L4,11 L6,11 L6,13 L8,13 L8,11 L10,11 L10,9 L8,9 L8,7 L6,7 L6,9 Z";
export const Router = Webpack.getMangled('Router-History', {
    useLocation: Webpack.Filters.byRegex(/return .{1,4}.location/)
});
export const NavigationUtils = /* @__PURE__ */ Webpack.getMangled("Transitioning to", {
    transitionTo: /* @__PURE__ */ Webpack.Filters.byStrings("Transitioning to"),
    replace: /* @__PURE__ */ Webpack.Filters.byStrings("\"Replacing route with \""),
    goBack: /* @__PURE__ */ Webpack.Filters.byStrings(".goBack()"),
    goForward: /* @__PURE__ */ Webpack.Filters.byStrings(".goForward()"),
    transitionToGuild: /* @__PURE__ */ Webpack.Filters.byStrings("\"transitionToGuild - Transitioning to \"")
});

export const FetchGameUtils = Webpack.getMangled('Error("Failed to fetch game data")', {
    fetchGames: Webpack.Filters.byStrings('isLoading', 'Array.isArray')
})

export const ManaButtons = Webpack.getMangled(Webpack.Filters.bySource('SPINNING_CIRCLE', '__unsupportedReactNodeAsText', 'tooltipAlign', '"sm","aria-label"'), {
    PrimaryButtonWithIcon: x => String(x).includes('"sm",.'),
    PrimaryButtonLazy: x => String(x).includes('loading'),
    IconOnlyButton: x => String(x).includes('targetElementRef')
});

export const LaunchableGameUtils = Webpack.getMangled(Webpack.Filters.bySource('ConnectedAppsStore', 'isLaunchableLoading'), {
    useApplicationLaunchState: Webpack.Filters.byStrings('isLaunchableLoading'),
    useLaunchableGameId: Webpack.Filters.byStrings('data', 'getOfficialGame'),
    useLaunchableApplicationId: Webpack.Filters.byStrings('data', 'getOfficialGame', 'getGameByApplication')
})

export const ApplicationAssetUtils = Webpack.getMangled(Webpack.Filters.bySource("ApplicationAssetUtils"), {
    getAssetImageFromURL: Webpack.Filters.byStrings('toString'),
    getAssetImage: Webpack.Filters.byStrings('"getAssetImage: size must === [number, number] for Twitch"')
});

export const AvatarUtils = Webpack.getBySource('GUILD_ICON', '"icons"', {declarationFilter: Webpack.Filters.byKeys('getGuildMemberAvatarSource')});

export const SettingsRoot = Webpack.waitForModule((m) => m?.key === "$Root", { searchExports: true, searchDefault: false });
export const RecentlyPlayedByApplicationId = Webpack.waitForModule(Webpack.Filters.byStrings('GLOBAL_FEED', 'application_id', 'useMemo'), {searchExports: true});
export const GameProfileRoot = Webpack.waitForModule(Webpack.Filters.bySource('"GameProfileModal"', 'forceV2'));