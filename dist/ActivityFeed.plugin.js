/**
 * @name ActivityFeed
 * @author KingGamingYT
 * @description rewrite
 * @version 1.0.0-dev
 */

/*@cc_on
@if (@_jscript)

	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

'use strict';

const betterdiscord = new BdApi("ActivityFeed");
const react = BdApi.React;

// settings/settings.js
const settings = {
	main: {
		v2Cards: {
			name: "Activity Cards V2",
			note: "Enables the colorful visual refresh-inspired activity card designs. Recommended.",
			initial: true
		}
	},
	debug: {
		cardTypeDebug: {
			name: "Show both card types at once",
			note: "Show both types of activity cards under each other in the same list. Only enable if Activity Cards V2 is also enabled.",
			initial: false,
			type: "switch"
		},
		forceRefreshFeed: {
			name: "Force refresh the news article feed",
			note: "Re-roll currently displayed articles. Will not fetch new ones.",
			type: "button"
		}
	},
	default: {
		v2Cards: true,
		cardTypeDebug: false
	}
};

// modules/common.js
const Filters = [
	{ name: "ActivityButtons", filter: betterdiscord.Webpack.Filters.byStrings("activity", "USER_PROFILE_ACTIVITY_BUTTONS") },
	{ name: "ActivityTimer", filter: betterdiscord.Webpack.Filters.byStrings("timestamps", ".TEXT_FEEDBACK_POSITIVE"), searchExports: true },
	{ name: "AnchorClasses", filter: betterdiscord.Webpack.Filters.byKeys("anchor", "anchorUnderlineOnHover"), searchExports: true },
	{ name: "Animated", filter: (x) => x.Easing && x.accelerate },
	{ name: "AvatarFetch", filter: betterdiscord.Webpack.Filters.byStrings("src", "statusColor", "size", "isMobile"), searchExports: true },
	{ name: "ButtonVoidClasses", filter: betterdiscord.Webpack.Filters.byKeys("lookFilled", "button") },
	{ name: "ButtonManaClasses", filter: (x) => x.primary && x.hasText && !x.hasTrailing },
	{ name: "CallButtons", filter: betterdiscord.Webpack.Filters.byStrings("PRESS_JOIN_CALL_BUTTON") },
	{ name: "CardPopout", filter: betterdiscord.Webpack.Filters.byStrings("party", "close", "onSelect"), searchExports: true },
	{ name: "Clipboard", filter: betterdiscord.Webpack.Filters.byStrings("navigator.clipboard.write"), searchExports: true },
	{ name: "DMSidebar", filter: betterdiscord.Webpack.Filters.bySource(".A.CONTACTS_LIST") },
	{ name: "FetchApplications", filter: betterdiscord.Webpack.Filters.byKeys("fetchApplication") },
	{ name: "FetchGames", filter: betterdiscord.Webpack.Filters.byKeys("getDetectableGamesSupplemental") },
	{ name: "FetchUtils", filter: (x) => typeof x === "object" && x.del && x.put, searchExports: true },
	{ name: "FluxDispatcher", filter: betterdiscord.Webpack.Filters.byKeys("dispatch", "subscribe", "register"), searchExports: true },
	{ name: "FormSwitch", filter: betterdiscord.Webpack.Filters.byStrings('"data-toggleable-component":"switch"', 'layout:"horizontal"'), searchExports: true },
	{ name: "GameProfile", filter: (x) => x.openGameProfileModal },
	{ name: "GameProfileCheck", filter: betterdiscord.Webpack.Filters.byStrings("gameProfileModalChecks", "onOpened") },
	{ name: "GradientComponent", filter: betterdiscord.Webpack.Filters.byStrings("darken"), searchExports: true },
	{ name: "HeaderBar", filter: betterdiscord.Webpack.Filters.byKeys("Icon", "Divider") },
	{ name: "intl", filter: (x) => x.t && x.t.formatToMarkdownString },
	{ name: "JoinButton", filter: betterdiscord.Webpack.Filters.byStrings("user", "activity", "onAction", "onClose", "themeType", "embeddedActivity") },
	{ name: "LinkButton", filter: betterdiscord.Webpack.Filters.byStrings("route", "iconClassName"), searchExports: true },
	{ name: "LinkButtonClasses", filter: betterdiscord.Webpack.Filters.byKeys("linkButtonIcon") },
	{ name: "MediaProgressBar", filter: betterdiscord.Webpack.Filters.byStrings("start", "end", "duration", "percentage"), searchExports: true },
	{ name: "ModalAccessUtils", filter: (x) => x.openUserProfileModal },
	{ name: "ModalRoot", filter: (x) => x.Modal },
	{ name: "OpenDM", filter: (x) => x.openPrivateChannel },
	{ name: "OpenVoiceChannel", filter: (x) => x.selectVoiceChannel },
	{ name: "OpenSpotifyAlbum", filter: betterdiscord.Webpack.Filters.byStrings(".metadata)?void", ".EPISODE?"), searchExports: true },
	{ name: "Popout", filter: betterdiscord.Webpack.Filters.byStrings("Unsupported animation config:"), searchExports: true },
	{ name: "PopoutContainer", filter: betterdiscord.Webpack.Filters.byStrings("type", "position", "data-popout-animating"), searchExports: true },
	{ name: "PositionClasses", filter: betterdiscord.Webpack.Filters.byKeys("noWrap") },
	{ name: "RootSectionModule", filter: (x) => x?.key === "$Root", searchExports: true },
	{ name: "SpotifyButtons", filter: betterdiscord.Webpack.Filters.byStrings("activity", "PRESS_PLAY_ON_SPOTIFY_BUTTON") },
	{ name: "Tooltip", filter: betterdiscord.Webpack.Filters.byPrototypeKeys("renderTooltip"), searchExports: true },
	{ name: "UpperIconClasses", filter: betterdiscord.Webpack.Filters.byKeys("icon", "upperContainer") },
	{ name: "VoiceList", filter: betterdiscord.Webpack.Filters.byStrings("maxUsers", "guildId") }
];
const bulkData = betterdiscord.Webpack.getBulk(...Filters);
const CommonExport = () => {
	const result = {};
	Filters.forEach((component, index) => {
		result[component.name] = component.target ? bulkData[index][component.target] : bulkData[index];
	});
	return result;
};
const Common$1 = CommonExport();
const { shell } = require("electron");
const { container } = betterdiscord.Webpack.getModule((m) => m.container && m.panels);
const layoutUtils = betterdiscord.Webpack.getMangled(
	betterdiscord.Webpack.Filters.bySource("$Root", ".ACCORDION"),
	{
		Panel: (x) => String(x).includes(".PANEL,"),
		Button: (x) => String(x).includes(".BUTTON,")
	}
);
const ControllerIcon = "M5.79335761,5 L18.2066424,5 C19.7805584,5 21.0868816,6.21634264 21.1990185,7.78625885 L21.8575059,17.0050826 C21.9307825,18.0309548 21.1585512,18.9219909 20.132679,18.9952675 C20.088523,18.9984215 20.0442685,19 20,19 C18.8245863,19 17.8000084,18.2000338 17.5149287,17.059715 L17,15 L7,15 L6.48507125,17.059715 C6.19999155,18.2000338 5.1754137,19 4,19 C2.97151413,19 2.13776159,18.1662475 2.13776159,17.1377616 C2.13776159,17.0934931 2.1393401,17.0492386 2.1424941,17.0050826 L2.80098151,7.78625885 C2.91311838,6.21634264 4.21944161,5 5.79335761,5 Z M14.5,10 C15.3284271,10 16,9.32842712 16,8.5 C16,7.67157288 15.3284271,7 14.5,7 C13.6715729,7 13,7.67157288 13,8.5 C13,9.32842712 13.6715729,10 14.5,10 Z M18.5,13 C19.3284271,13 20,12.3284271 20,11.5 C20,10.6715729 19.3284271,10 18.5,10 C17.6715729,10 17,10.6715729 17,11.5 C17,12.3284271 17.6715729,13 18.5,13 Z M6,9 L4,9 L4,11 L6,11 L6,13 L8,13 L8,11 L10,11 L10,9 L8,9 L8,7 L6,7 L6,9 Z";
const useLocation = Object.values(betterdiscord.Webpack.getBySource(".location", "withRouter")).find((m) => m.length === 0 && String(m).includes(".location"));
const NavigationUtils = betterdiscord.Webpack.getMangled("transitionTo - Transitioning to", {
	transitionTo: betterdiscord.Webpack.Filters.byStrings('"transitionTo - Transitioning to "'),
	replace: betterdiscord.Webpack.Filters.byStrings('"Replacing route with "'),
	goBack: betterdiscord.Webpack.Filters.byStrings(".goBack()"),
	goForward: betterdiscord.Webpack.Filters.byStrings(".goForward()"),
	transitionToGuild: betterdiscord.Webpack.Filters.byStrings('"transitionToGuild - Transitioning to "')
});

// activity_feed/gameStore.tsx
class GameNewsStore extends betterdiscord.Utils.Store {
	static displayName = "GameNewsStore";
	article = {};
	dataSet = {};
	displaySet = [];
	blacklist = [];
	state = [];
	lastTimeFetched;
	constructor() {
		super();
		this.dataSet = {};
		this.displaySet = [];
		this.article = { index: 0, direction: 1, idling: true, orientation: this.getOrientation() }, this.blacklist = [];
		this.lastTimeFetched;
		this.state = { size: [window.innerWidth, window.innerHeight] };
		window.addEventListener("resize", this.listener);
	}
	listener = () => {
		this.state = { size: [window.innerWidth, window.innerHeight] };
		this.emitChange();
	};
	componentDidMount() {
		window.addEventListener("resize", this.listener);
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.listener);
	}
	getFeeds() {
		return this.dataSet;
	}
	setFeeds() {
		this.dataSet = Object.assign(this.dataSet, betterdiscord.Data.load("ACTest", "dataSet"));
		this.blacklist = betterdiscord.Data.load("ACTest", "blacklist") || [];
		this.lastTimeFetched = betterdiscord.Data.load("ACTest", "lastTimeFetched");
		this.emitChange();
		return;
	}
	getTime() {
		return this.lastTimeFetched;
	}
	getBlacklist() {
		return this.blacklist;
	}
	getBlacklistedGame(gameId) {
		let b = this.blacklist;
		return b.find((e) => e.game_id === gameId);
	}
	clearBlacklist() {
		let b = this.blacklist;
		b.length = 0;
		this.emitChange();
		return;
	}
	blacklistGame(applicationId, gameId) {
		let b = this.blacklist;
		console.log(b);
		if (!b.find((e) => e.game_id === gameId)) {
			b.push({ application_id: applicationId, game_id: gameId });
			console.log(this.blacklist);
			this.emitChange();
			betterdiscord.Data.save("ACTest", "blacklist", this.blacklist);
		}
		return;
	}
	whitelistGame(gameId) {
		let b = this.blacklist;
		const g = b.find((e) => e.game_id === gameId);
		b.splice(b.indexOf(g), 1);
		this.emitChange();
		betterdiscord.Data.save("ACTest", "blacklist", this.blacklist);
		return this.blacklist;
	}
	async #fetchMinecraftFeeds(id, applicationList) {
		const rssFeed = await Promise.all([Net.fetch(`https://net-secondary.web.minecraft-services.net/api/v1.0/en-us/search?pageSize=24&sortType=Recent&category=News&newsOnly=true`).then((r) => r.ok ? r.json() : null)]);
		const article = rssFeed[0].result.results[0];
		const application = this.getApplicationByGameId(id, applicationList);
		return {
			application,
			appId: application.id,
			description: article?.description,
			thumbnail: article?.image,
			timestamp: article?.time * 1e3,
			title: article?.title,
			url: article?.url
		};
	}
	async #fetchFortniteFeeds(steamId, applicationList) {
		const rssFeed = await Promise.all([Net.fetch(`https://fortnite-api.com/v2/news`).then((r) => r.ok ? r.json() : null)]);
		const article = rssFeed[0].data.br.motds[0];
		const application = this.getApplicationByGameId(steamId, applicationList);
		return {
			application,
			appId: application.id,
			description: article?.body,
			thumbnail: article?.image,
			timestamp: rssFeed[0].data.br.date,
			title: article?.title
		};
	}
	async #fetchSteamFeeds(steamId, applicationList) {
		const rssFeed = await Promise.all([Net.fetch(`https://rssjson.vercel.app/api?url=https://store.steampowered.com/feeds/news/app/${steamId}`).then((r) => r.ok ? r.json() : null)]);
		const article = this.getRSSItem(rssFeed);
		const application = this.getApplicationByGameId(steamId, applicationList);
		return {
			application,
			appId: application.id,
			description: article?.description?.[0],
			thumbnail: article?.enclosure?.[0]?.$?.url,
			timestamp: article?.pubDate?.[0],
			title: article?.title?.[0],
			url: article?.link?.[0]
		};
	}
	async fetchFeeds(steamIds, applicationList) {
		for (const steamId of steamIds) {
			(async (steamId2) => {
				let feeds;
				switch (steamId2) {
					case "Minecraft":
						feeds = await this.#fetchMinecraftFeeds(steamId2, applicationList);
						break;
					case "Fortnite":
						feeds = await this.#fetchFortniteFeeds(steamId2, applicationList);
						break;
					default:
						feeds = await this.#fetchSteamFeeds(steamId2, applicationList);
				}
				this.dataSet[steamId2] = {
					id: steamId2,
					application: feeds.application,
					news: {
						application_id: feeds.appId,
						description: feeds.description,
						thumbnail: feeds.thumbnail,
						timestamp: feeds.timestamp,
						title: feeds.title,
						url: feeds?.url
					},
					type: "application_news"
				};
				betterdiscord.Data.save("ACTest", "dataSet", this.dataSet);
			})(steamId);
		}
		this.lastTimeFetched = Date.now();
		betterdiscord.Data.save("ACTest", "lastTimeFetched", this.lastTimeFetched);
	}
	shouldFetch() {
		if (Object.keys(this.getFeeds()).length === 0) {
			this.setFeeds();
		}
		let t = this.lastTimeFetched;
		let p = Object.values(this.getFeeds()).length;
		return null == t || p < 5 || Date.now() - t > 216e5;
	}
	isFetched() {
		let b = Object.values(this.getFeeds()).length > 5;
		return b;
	}
	getByGameId(id) {
		let d = this.dataSet;
		for (let k = 0; k < Object.keys(d).length; k++) {
			if (Object.keys(d)[k] == id) {
				return Object.values(d)[k];
			}
		}
	}
	getApplicationByGameId(id, applicationList) {
		let r;
		if (isNaN(id)) {
			r = applicationList.find((game) => game.name === id);
		} else {
			r = applicationList.find((game) => game.thirdPartySkus.find((sku) => sku.sku === id));
		}
		return r;
	}
	getRSSItem(feed, itemIndex = 0) {
		try {
			return feed?.[0]?.rss?.channel?.[0]?.item?.[itemIndex];
		} catch (e) {
			return null;
		}
	}
	getRandomFeeds(feeds) {
		const oW = new Date(Date.now() - 12096e5);
		let t = [];
		let keys = Object.keys(feeds);
		let _keys = keys.filter((key) => new Date(feeds[key].news.timestamp) > oW && !this.getBlacklistedGame(feeds[key].id));
		if (_keys.length < 5) return;
		for (let g = 0; g < 4; g++) {
			let rand = _keys.length * Math.random() << 0;
			t.push(feeds[_keys[rand]]);
			_keys.splice(rand, 1);
		}
		return t;
	}
	getFeedsForDisplay() {
		const rG = this.displaySet;
		const r = this.getRandomFeeds(this.getFeeds());
		if (!this.shouldFetch() && !this.displaySet.length && r !== void 0) {
			rG.push.apply(rG, r);
		}
		return rG;
	}
	getCurrentArticle() {
		return this.article;
	}
	setCurrentArticle({ index, direction, idling }) {
		let a = this.getCurrentArticle();
		return {
			...a,
			index,
			direction: this.getDirection(direction),
			idling
		};
	}
	getOrientation() {
		this.article;
		let window2 = this.state;
		console.log(window2?.size);
		const val = (window2?.size?.[0] > 1200 || window2?.size?.[1] < 600) && (window2?.size[0] < 1200 || window2?.size?.[1] > 600) ? "vertical" : "horizontal";
		this.emitChange();
		return val;
	}
	getDirection(e) {
		return e > 0 ? 1 : -1;
	}
}
const NewsStore = new GameNewsStore();
NewsStore === betterdiscord.Webpack.getStore("GameNewsStore");

// modules/stores.js
const ApplicationStore = betterdiscord.Webpack.getStore("ApplicationStore");
const ChannelStore$1 = betterdiscord.Webpack.getStore("ChannelStore");
const DetectableGameSupplementalStore = betterdiscord.Webpack.getStore("DetectableGameSupplementalStore");
const GameStore = betterdiscord.Webpack.getStore("GameStore");
const GuildStore = betterdiscord.Webpack.getStore("GuildStore");
const NowPlayingViewStore = betterdiscord.Webpack.getStore("NowPlayingViewStore");
const RunningGameStore = betterdiscord.Webpack.getStore("RunningGameStore");
const UserStore = betterdiscord.Webpack.getStore("UserStore");
const { useStateFromStores } = betterdiscord.Webpack.getMangled((m) => m.Store, { useStateFromStores: betterdiscord.Webpack.Filters.byStrings("useStateFromStores") }, { raw: true });
const VoiceStateStore = betterdiscord.Webpack.getStore("VoiceStateStore");

// styles
let _styles = "";
function _loadStyle(path, css) {
	_styles += "/*" + path + "*/\n" + css + "\n";
}
function styles$1() {
	return _styles;
}

// activity_feed/ActivityFeed.module.css
const css$2 = `
.activityFeed_0f0118 {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-border-frame);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

.scrollerBase_0f0118 {
		contain: layout size;
		height: 100%;
		background: no-repeat bottom;
		background-size: 100%;
		background-image: url(/assets/c486dc65ce2877eeb18e4c39bb49507a.svg);
		&::-webkit-scrollbar {
		background: none;
		border-radius: 8px;
		width: 16px;
		}
		&::-webkit-scrollbar-thumb {
				background-clip: padding-box;
				border: solid 4px #0000;
				border-radius: 8px;
		}
		&:hover::-webkit-scrollbar-thumb {
				background-color: var(--bg-overlay-6, var(--background-tertiary));
		}
}

.centerContainer_0f0118 {
		display: flex;
		flex-direction: column;
		width: 1280px;
		max-width: 100%;
		min-width: 480px;
		margin: 0 auto;
}

.title_0f0118 {
		align-items: center;
		display: flex;
		justify-content: flex-start;
		overflow: hidden;
		white-space: nowrap;
		font-size: 16px;
		font-weight: 500;
		line-height: 1.25;
		color: var(--header-primary);
}

.titleWrapper_0f0118 {
		flex: 0 0 auto;
		margin: 0 8px 0 0;
		min-width: auto;
}

.iconWrapper_0f0118 {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: var(--space-32);
		justify-content: center;
		margin: 0;
		position: relative;
		width: var(--space-32);
}

.headerBar_0f0118 {
		height: calc(var(--custom-channel-header-height) - 1px);
		min-height: calc(var(--custom-channel-header-height) - 1px);
}

.headerContainer_0f0118 {
		flex-direction: row;
}

.headerText_0f0118 {
		display: flex;
		flex: 1;
		font-size: 18px;
		font-weight: 500;
		line-height: 22px;
		margin-top: 20px;
		width: 100%;
		color: var(--text-default);
}

.feedCarousel_0f0118 {
		display: flex;
		position: relative;
}

.carousel_0f0118 {
		background-color: var(--background-secondary-alt);
		border-radius: 5px;
		flex: 1 1 75%;
		min-height: 388px;
		margin-right: 20px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

.article_0f0118 {
		background-color: var(--background-secondary-alt);
		border-radius: 5px;
		bottom: 0;
		box-sizing: border-box;
		height: 100%;
		left: 0;
		overflow: hidden;
		padding: 20px;
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
}

.background_0f0118 {
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 7.5%;
		mask: linear-gradient(0deg, transparent, #000);
		min-width: 300px;
		background-position: top;
}

.backgroundImage_0f0118 {
		background-position: top;
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 0;
}

.background_0f0118, .backgroundImage_0f0118 {
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

.feedOverflowMenu_0f0118 {
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 12px;
}

.applicationArea_0f0118 {
		color: var(--text-default);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
}

.details_0f0118 {
		position: relative;
}

.titleStandard_0f0118 {
		margin-top: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24px;
		line-height: 28px;
}

.title_0f0118 {
		color: var(--header-primary);
		display: block;
		font-weight: 500;
}

.description_0f0118 {
		color: var(--text-default);
		display: -webkit-box;
		font-size: 16px;
		font-weight: 500;
		line-height: 1.2;
		margin-top: 8px;
		max-height: 40px;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		img, br+br {
				display: none;
		}
		a {
				color: inherit;
		}
		p, b, i {
				all: inherit;
				display: contents
		}
		.sharedFilePreviewYouTubeVideo_0f0118 {
				display: none;
		}
}

.timestamp_0f0118 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.gameIcon_0f0118 {
		position: relative;
		pointer-events: auto;
		cursor: pointer;
		height: 40px;
		width: 40px;
		flex-shrink: 0;
		border-radius: 3px;
}

.pagination_0f0118 {
		-webkit-box-flex: 1;
		flex: 1 1 25%;
		min-width: 0;
}

.verticalPaginationItemContainer_0f0118 {
		margin: 0;
		overflow: hidden;
}

.scrollerWrap_0f0118 {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
		height: 100%;
		min-height: 1px;
		position: relative;
}

.scroller_0f0118 {
		-webkit-box-flex: 1;
		contain: layout;
		flex: 1;
		min-height: 1px;
}
		
.paginationItem_0f0118, .paginationItem_0f0118:before {
		transition: all .2s ease;
}

.paginationItem_0f0118:first-child {
		margin-top: 0;
}

.paginationItem_0f0118 {
		-webkit-box-align: center;
		align-items: center;
		background: var(--background-secondary-alt);
		border-radius: 5px;
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		height: 91px;
		margin-top: 8px;
		overflow: hidden;
		padding: 16px;
		position: relative;
		transform: translateZ(0);
}

.paginationItem_0f0118:before {
		background: #fff;
		border-radius: 20px;
		content: "";
		height: 40px;
		left: -5px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%) translateX(-100%);
		transition-delay: .2s;
		width: 10px;
		z-index: 1;
}

.paginationItem_0f0118:after {
		background-blend-mode: color;
		border-radius: 5px;
		bottom: 0;
		content: "";
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

.splashArt_0f0118 {
		filter: grayscale(100%);
		height: 100%;
		opacity: .2;
		width: 100%;
		background-position-x: 50%;
		background-position-y: 40%;
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 0;
		left: 0;
		pointer-events: none;
		position: absolute;
		top: 0;
}

.paginationSubtitle_0f0118, .paginationTitle_0f0118 {
		font-weight: 600;
}

.paginationText_0f0118 {
		overflow: hidden;
}

.paginationContent_0f0118 {
		overflow: hidden;
		position: relative;
		z-index: 1;
}

.paginationTitle_0f0118 {
		color: var(--header-primary);
		font-size: 16px;
		line-height: 1.25;
		max-height: 40px;
}

.paginationSubtitle_0f0118 {
		color: var(--text-muted);
		font-size: 12px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.selectedPage_0f0118 {
		background: var(--background-surface-higher);
		cursor: default;
}

.selectedPage_0f0118:before {
		transform: translateY(-50%) translateX(0);
}

.selectedPage_0f0118 .splashArt_0f0118 {
		filter: grayscale(0);
}

.smallCarousel_0f0118 {
		-webkit-box-flex: 1;
		border-radius: 5px;
		flex: 1;
		height: 220px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

.titleRowSimple_0f0118 {
		-webkit-box-align: center;
		-webkit-box-pack: justify;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
}

.paginationSmall_0f0118 {
		bottom: 0;
		height: 64px;
		left: 0;
		margin: 0 auto;
		min-width: 0;
		right: 0;
		position: absolute;
		z-index: 3;
		display: flex;
}

.arrow_0f0118 {
		color: var(--text-muted);
		z-index: 2;
}

svg.arrow_0f0118 {
		height: 26px;
		width: 26px;
}

.arrowContainer_0f0118 {
		color: var(--white);
		cursor: pointer;
		font-size: 0;
		height: 50px;
		line-height: 0;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 50px;
}

.arrow_0f0118, .arrowContainer_0f0118 {
		box-sizing: border-box;
		pointer-events: all;
}

.button_0f0118 {
		-webkit-box-align: center;
		-webkit-box-pack: center;
		align-items: center;
		background: none;
		border: none;
		border-radius: 3px;
		display: flex;
		font-size: 14px;
		font-weight: 500;
		justify-content: center;
		line-height: 16px;
		position: relative;
		user-select: none;
}

.prevButtonContainer_0f0118 {
		left: 6px;
}

.nextButtonContainer_0f0118 {
		right: 6px;
}

.left_0f0118 {
		transform: rotate(-90deg);
}

.right_0f0118 {
		transform: rotate(90deg);
}

.horizontalPaginationItemContainer_0f0118 {
		-webkit-box-align: center;
		-webkit-box-flex: initial;
		align-items: center;
		display: flex;
		flex: initial;
		margin: 0 auto;
		overflow-y: hidden;
}

.dot_0f0118 {
		background-color: #fff;
		border-radius: 2px;
		cursor: pointer;
		height: 8px;
		margin-right: 8px;
		pointer-events: all;
		transform: translateZ(0);
		width: 8px;
}

.dotNormal_0f0118 {
		opacity: 0.2;
}

.dotSelected_0f0118 {
		opacity: 0.6;
}

.emptyTitle_0f0118 {
		font-size: 16px;
		line-height: 20px;
		color: var(--text-default);
}

.emptySubtitle_0f0118 {
		font-size: 14px;
		color: var(--text-muted);
}`;
_loadStyle("ActivityFeed.module.css", css$2);
const modules_7e65654a = {
	"activityFeed": "activityFeed_0f0118",
	"scrollerBase": "scrollerBase_0f0118",
	"centerContainer": "centerContainer_0f0118",
	"title": "title_0f0118",
	"titleWrapper": "titleWrapper_0f0118",
	"iconWrapper": "iconWrapper_0f0118",
	"headerBar": "headerBar_0f0118",
	"headerContainer": "headerContainer_0f0118",
	"headerText": "headerText_0f0118",
	"feedCarousel": "feedCarousel_0f0118",
	"carousel": "carousel_0f0118",
	"article": "article_0f0118",
	"background": "background_0f0118",
	"backgroundImage": "backgroundImage_0f0118",
	"feedOverflowMenu": "feedOverflowMenu_0f0118",
	"applicationArea": "applicationArea_0f0118",
	"details": "details_0f0118",
	"titleStandard": "titleStandard_0f0118",
	"description": "description_0f0118",
	"sharedFilePreviewYouTubeVideo": "sharedFilePreviewYouTubeVideo_0f0118",
	"timestamp": "timestamp_0f0118",
	"gameIcon": "gameIcon_0f0118",
	"pagination": "pagination_0f0118",
	"verticalPaginationItemContainer": "verticalPaginationItemContainer_0f0118",
	"scrollerWrap": "scrollerWrap_0f0118",
	"scroller": "scroller_0f0118",
	"paginationItem": "paginationItem_0f0118",
	"splashArt": "splashArt_0f0118",
	"paginationSubtitle": "paginationSubtitle_0f0118",
	"paginationTitle": "paginationTitle_0f0118",
	"paginationText": "paginationText_0f0118",
	"paginationContent": "paginationContent_0f0118",
	"selectedPage": "selectedPage_0f0118",
	"smallCarousel": "smallCarousel_0f0118",
	"titleRowSimple": "titleRowSimple_0f0118",
	"paginationSmall": "paginationSmall_0f0118",
	"arrow": "arrow_0f0118",
	"arrowContainer": "arrowContainer_0f0118",
	"button": "button_0f0118",
	"prevButtonContainer": "prevButtonContainer_0f0118",
	"nextButtonContainer": "nextButtonContainer_0f0118",
	"left": "left_0f0118",
	"right": "right_0f0118",
	"horizontalPaginationItemContainer": "horizontalPaginationItemContainer_0f0118",
	"dot": "dot_0f0118",
	"dotNormal": "dotNormal_0f0118",
	"dotSelected": "dotSelected_0f0118",
	"emptyTitle": "emptyTitle_0f0118",
	"emptySubtitle": "emptySubtitle_0f0118"
};
const MainClasses = modules_7e65654a;

// activity_feed/components/common/components/SectionHeader.jsx
function SectionHeader({ label }) {
	return BdApi.React.createElement("div", { className: `${MainClasses.headerContainer} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyBetween} ${Common$1.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: MainClasses.headerText }, label));
}

// activity_feed/components/quick_launcher/QuickLauncher.module.css
const css$1 = `
.quickLauncher_01420e {
		display: block;
}

.dock_01420e {
		margin-top: 10px;
		display: flex;
		overflow: hidden;
		flex-wrap: nowrap;
		max-width: 1280px;
}

.dockItem_01420e {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: pointer;
		height: 100px;
		padding: 10px;
		width: 90px;
		flex-direction: column;
}

.dockIcon_01420e:first-child {
		margin-left: 0;
}

.dockIcon_01420e {
		background-size: 100%;
		border-radius: 3px;
		height: 40px;
		margin-bottom: 8px;
		transition: opacity .2s ease-in-out;
		width: 40px;
}

.dockItemText_01420e {
		font-weight: 500;
		height: 31px;
		line-height: normal;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
		white-space: normal;
		width: 100%;
		font-size: 12px;
		color: var(--text-default);
}

.dockItemPlay_01420e {
		display: none;
		z-index: 9999;
}

.dockItemPlay_01420e:disabled, .dockItemPlay_01420e[aria-disabled=true] {
		background-color: var(--green-active, var(--button-positive-background-active)) !important;
}

.dockItem_01420e:hover {
		background: var(--background-base-lowest);
}

.dockItem_01420e:hover .dockItemText_01420e {
		display: none;
}

.dockItem_01420e:hover .dockItemPlay_01420e {
		display: flex;
}

.emptyState_01420e {
		position: relative;
}

.emptyIcon_01420e {
		height: 24px;
		margin-right: 8px;
		width: 24px;
}`;
_loadStyle("QuickLauncher.module.css", css$1);
const modules_1116a9ae = {
	"quickLauncher": "quickLauncher_01420e",
	"dock": "dock_01420e",
	"dockItem": "dockItem_01420e",
	"dockIcon": "dockIcon_01420e",
	"dockItemText": "dockItemText_01420e",
	"dockItemPlay": "dockItemPlay_01420e",
	"emptyState": "emptyState_01420e",
	"emptyIcon": "emptyIcon_01420e"
};
const QuickLauncherClasses = modules_1116a9ae;

// activity_feed/components/quick_launcher/launcher.tsx
function LauncherGameBuilder({ game, runningGames }) {
	const [shouldDisable, setDisable] = react.useState(false);
	setTimeout(() => setDisable(false), 1e4);
	const disableCheck = react.useMemo(() => ~runningGames.findIndex((m) => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
	return BdApi.React.createElement("div", { className: `${QuickLauncherClasses.dockItem} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}, ${Common$1.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, BdApi.React.createElement("div", { className: QuickLauncherClasses.dockIcon, style: { backgroundImage: `url(${"https://cdn.discordapp.com/app-icons/" + GameStore.getGameByName(game.name).id + "/" + GameStore.getGameByName(game.name).icon + ".webp"})` } }), BdApi.React.createElement("div", { className: QuickLauncherClasses.dockItemText }, game.name), BdApi.React.createElement(
		"button",
		{
			className: `${QuickLauncherClasses.dockItemPlay} ${Common$1.ButtonVoidClasses.button} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.colorGreen} ${Common$1.ButtonVoidClasses.sizeSmall} ${Common$1.ButtonVoidClasses.fullWidth} ${Common$1.ButtonVoidClasses.grow}`,
			disabled: disableCheck,
			onClick: () => {
				setDisable(true);
				shell.openExternal(game.exePath);
			}
		},
		BdApi.React.createElement("div", { className: `${Common$1.ButtonVoidClasses.contents}` }, "Play")
	));
}
function QuickLauncherBuilder(props) {
	const runningGames = useStateFromStores([RunningGameStore], () => RunningGameStore.getRunningGames());
	const gameList = useStateFromStores([RunningGameStore], () => RunningGameStore.getGamesSeen());
	const _gameList = gameList.filter((game) => GameStore.getGameByName(game.name)).slice(0, 12);
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Quick Launcher" }), gameList.length === 0 ? BdApi.React.createElement("div", { className: `${QuickLauncherClasses.dock} ${QuickLauncherClasses.emptyState}` }, BdApi.React.createElement("svg", { className: QuickLauncherClasses.emptyIcon, name: "OpenExternal", width: 16, height: 16, viewBox: "0 0 24 24" }, BdApi.React.createElement("path", { fill: "currentColor", transform: "translate(3, 4)", d: "M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" })), BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Discord can quickly launch most games you\u2019ve recently played on this computer. Go ahead and launch one to see it appear here!")) : BdApi.React.createElement("div", { className: QuickLauncherClasses.dock }, _gameList.map((game) => BdApi.React.createElement(LauncherGameBuilder, { game, runningGames }))));
}

// activity_feed/components/common/methods/common.js
function chunkArray(cards, num) {
	let chunkLength = Math.max(cards.length / num, 1);
	const chunks = [];
	for (let i = 0; i < num; i++) {
		if (chunkLength * (i + 1) <= cards.length) chunks.push(cards.slice(chunkLength * i, chunkLength * (i + 1)));
	}
	return chunks.reverse();
}
function TimeClock({ timestamp }) {
	const time = Math.floor((Date.now() - new Date(parseInt(timestamp))) / 1e3);
	if (time / 86400 > 1) {
		return Common$1.intl.intl.formatToPlainString(Common$1.intl.t["2rUo/p"], { time: Math.floor(time / 86400) });
	} else if (time / 3600 > 1) {
		return Common$1.intl.intl.formatToPlainString(Common$1.intl.t["eNoooU"], { time: Math.floor(time / 3600) });
	} else if (time / 60 > 1) {
		return Common$1.intl.intl.formatToPlainString(Common$1.intl.t["03mIHW"], { time: Math.floor(time / 60) });
	} else if (time % 60 < 60) {
		return Common$1.intl.intl.formatToPlainString(Common$1.intl.t["ahzZr+"]);
	}
}
function GradGen(check, isSpotify, activity, game, voice, stream) {
	let input;
	switch (true) {
		case !!check?.streaming:
			input = "https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg";
			break;
		case !!isSpotify:
			input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
			break;
		case !!activity?.name.includes("YouTube Music"):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case !!activity?.platform?.includes("xbox"):
			input = "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png";
			break;
		case (!!activity?.assets && activity?.assets.large_image?.includes("external")):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case !!activity?.assets:
			input = `https://cdn.discordapp.com/app-assets/${activity?.application_id}/${activity?.assets?.large_image}.png`;
			break;
		case !!game?.icon:
			input = `https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon}.png?size=1024&keep_aspect_ratio=true`;
			break;
		case !!voice[0]?.guild:
			input = `https://cdn.discordapp.com/icons/${voice[0]?.guild.id}/${voice[0]?.guild.icon}.png?size=1024`;
			break;
		case (!!voice && stream):
			input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`;
			break;
	}
	return Common$1.GradientComponent(input || null);
}
function SplashGen(isSpotify, activity, game, voice, stream) {
	let input;
	switch (true) {
		case !!game?.currentGame?.splash?.length:
			input = `https://cdn.discordapp.com/app-icons/${game?.currentGame?.id}/${game?.currentGame?.splash}.png?size=1024&keep_aspect_ratio=true`;
			break;
		case !!isSpotify:
			input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
			break;
		case !!["YouTube Music", "Crunchyroll"].includes(activity?.name):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case (!!voice && !activity):
			input = "https://cdn.discordapp.com/banners/" + voice[0]?.guild?.id + "/" + voice[0]?.guild?.banner + ".webp?size=1024&keep_aspect_ratio=true";
			break;
		case (!!voice && stream):
			input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`;
			break;
		default:
			input = game?.data?.artwork[0];
	}
	return input || null;
}
function activityCheck(activities, isSpotify) {
	if (!activities) return;
	let pass = {
		playing: 0,
		xbox: 0,
		playstation: 0,
		streaming: 0,
		listening: 0,
		spotify: 0,
		watching: 0,
		competing: 0,
		custom: 0
	};
	for (let i = 0; i < activities.length; i++) {
		if (!activities[i]) {
			return;
		}
		if (activities[i].type == 4) {
			pass.custom = 1;
		}
		if (activities[i].type == 0) {
			pass.playing = 1;
		}
		if (activities[i]?.platform?.includes("xbox")) {
			pass.xbox = 1;
		}
		if (activities[i]?.platform?.includes("playstation") || activities[i]?.platform?.includes("ps5")) {
			pass.playstation = 1;
		}
		if (activities[i].type == 1) {
			pass.streaming = 1;
		}
		if (activities[i].type == 2) {
			pass.listening = 1;
		}
		if (isSpotify) {
			pass.spotify = 1;
		}
		if (activities[i].type == 3) {
			pass.watching = 1;
		}
		if (activities[i].type == 5) {
			pass.competing = 1;
		}
	}
	return pass;
}
function useWindowSize() {
	const [size, setSize] = react.useState([0, 0]);
	react.useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);
	return size;
}

// activity_feed/components/now_playing/NowPlaying.module.css
const css = `
.nowPlayingContainer_23d387 {
		display: flex;
		margin-top: var(--space-lg);
		gap: var(--space-lg);
}

.nowPlayingColumn_23d387 {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: calc(50% - (var(--space-lg) / 2))
}

.nowPlayingContainer_23d387 .itemCard_23d387 {
		flex: 1 0 0;
		margin: 16px 16px 0 0;
}

.card_23d387 {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
		transform: translateZ(0);
}
		
.cardHeader_23d387 {
		padding: 20px;
		position: relative;
		flex-direction: row;
		background: var(--background-base-lowest);
}

.header_23d387 {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
}

.nameTag_23d387 {
		line-height: 17px;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;
		color: var(--text-default);
}

.username_23d387 {
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

.username_23d387:hover {
		text-decoration: underline;
}

.card_23d387:hover .headerIcon_23d387 {
		display: none;
}

.headerActions_23d387 {
		display: none;
		margin-left: 8px;
}

.card_23d387:hover .headerActions_23d387 {
		display: flex;
}

.headerActions_23d387 > div[aria-expanded="false"] {
		display: none;
}

.overflowMenu_23d387 {
		cursor: pointer;
		height: 24px;
		margin-left: 8px;
		transition: opacity .2s linear;
		width: 24px;
		color: var(--interactive-icon-hover);
}

.overflowMenu_23d387:hover {
		color: var(--interactive-icon-default);
}

.headerIcon_23d387 {
		border-radius: 4px;
		display: block;
		height: 30px;
		justify-self: end;
		width: 30px;
}

.splashArt_23d387 {
		filter: grayscale(100%);
		mask: radial-gradient(100% 100% at top left, hsla(0, 0%, 100%, .6) 0, hsla(0, 0%, 100%, 0) 100%);
		opacity: .3;
		width: 300px;
		background-position-x: 50%;
		background-position-y: 40%;
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 0;
		left: 0;
		pointer-events: none;
		position: absolute;
		top: 0;
}

.server_23d387 {
		mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
		right: 0;
		left: unset;
}

.cardBody_23d387 {
		display: flex;
		padding: 0 20px;
		background: var(--background-mod-strong)
}

.section_23d387 {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

.game_23d387 {
		padding: 20px 0;
}

.gameBody_23d387 {
		flex-direction: column;
}

.activityContainer_23d387:last-child:not(:only-child, :nth-child(1 of .activityContainer_23d387)) .sectionDivider_23d387 {
		display: none;
}

.activity_23d387 {
		flex-direction: row;
}

.activity_23d387:last-child:not(:only-child) {
		margin-top: 20px;
}

.activity_23d387 .serviceButtonWrapper_23d387 {
		gap: 6px;
		display: flex;
		flex-direction: row;
}

.richActivity_23d387 {
		margin-top: 20px;
}

.activityActivityFeed_23d387 {}

.activityFeed_23d387 {
		-webkit-box-flex: 1;
		flex: 1 1 50%;
		min-width: 0;
}

.body_23d387 {}

.bodyNormal_23d387 {}

:is(.gameInfoRich_23d387, .gameNameWrapper_23d387) {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
}

.gameInfoRich_23d387 {
		align-items: center;
}

.gameInfo_23d387 {
		margin-left: 20px;
		min-width: 0;
		color: var(--text-default);
		font-weight: 500;
		flex: 1;
}

:is(.gameName_23d387, .gameNameWrapper_23d387, .streamInfo_23d387) {
		overflow: hidden;
}

.gameName_23d387 {
		font-size: 16px;
		line-height: 20px;
		margin-right: 10px;
		max-width: fit-content;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.gameName_23d387.clickable_23d387:hover {
		text-decoration: underline;
}

.playTime_23d387:not(a) {
		color: var(--text-muted);
}
.playTime_23d387 {
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.assets_23d387 {
		position: relative;
}

.assetsLargeImageActivityFeed_23d387 {
		width: 90px;
		height: 90px;
}

.assetsSmallImageActivityFeed_23d387 {
		height: 30px;
		width: 30px;
}

.assets_23d387 .assetsLargeImage_23d387 {
		display: block;
		border-radius: 4px; 
		object-fit: cover;
}

.assets_23d387 .assetsLargeImageActivityFeedTwitch_23d387 {
		border-radius: 5px;
		height: 260px;
		mask: linear-gradient(0deg, transparent 10%, #000 80%);
		width: 100%;
}

.assets_23d387:has(.assetsSmallImage_23d387) .assetsLargeImage_23d387 {
		mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
}

.richActivity_23d387 .assetsSmallImage_23d387, .richActivity_23d387 .smallEmptyIcon_23d387 {
		border-radius: 50%;
		position: absolute;
		bottom: -4px;
		right: -4px; 
}

.activity_23d387 .smallEmptyIcon_23d387 {
		width: 40px;
		height: 40px;
}

.assets_23d387 .largeEmptyIcon_23d387 {
		width: 90px;
		height: 90px;
}

.assets_23d387 .largeEmptyIcon_23d387 path {
		transform: scale(3.65) !important;
}

.richActivity_23d387 svg.assetsSmallImage_23d387 {
		border-radius: unset !important;
}   

.richActivity_23d387 .smallEmptyIcon_23d387 path {
		transform: scale(1.3) !important;
}

.assets_23d387 .twitchImageContainer_23d387 {
		background: var(--background-secondary-alt);
		border-radius: 5px;
		position: relative;
}

.assets_23d387 .twitchBackgroundImage_23d387 {
		display: inline-block;
		min-height: 260px;
}

.assets_23d387 .twitchImageOverlay_23d387 {
		bottom: 0;
		left: 0;
		padding: 16px;
		position: absolute;
		right: 0;
}

.assets_23d387 .streamName_23d387 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
		margin-top: 8px;
}

.assets_23d387 .streamGame_23d387 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.contentImagesActivityFeed_23d387 {
		margin-left: 20px;
		color: var(--text-default);
}

:is(.gameInfo_23d387, .contentImagesActivityFeed_23d387) {
		align-self: center;
		display: grid;
}

.content_23d387 {
		flex: 1;
		overflow: hidden;
}

.details_23d387 {
		font-weight: 600;
}

.ellipsis_23d387 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.textRow_23d387 {
		display: block;
		font-size: 14px;
		line-height: 16px;
		margin-bottom: 4px;
}

.sectionDivider_23d387 {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 20px 0 20px 0;
}

.voiceSection_23d387 {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
}

.voiceSectionAssets_23d387 {
		align-items: center;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

.voiceSectionIconWrapper_23d387 {
		align-items: center;
		border-radius: 50%;
		bottom: -4px;
		display: flex;
		height: 20px;
		justify-content: center;
		position: absolute;
		right: -3px;
		width: 20px;
}

.voiceSectionIcon_23d387 {
		color: var(--header-secondary);
		height: 12px;
		width: 12px;
}

.voiceSectionGuildImage_23d387 {
		border-radius: 50%;
		mask: url('https://discord.com/assets/a90b040155ee449f.svg');
		mask-size: 100%;
		mask-type: luminance;
}

.voiceSection_23d387 .details_23d387 {
		flex: 1;
}

.voiceSectionDetails_23d387 {
		cursor: pointer;
		margin-left: 20px;
		min-width: 0;
}

.voiceSectionDetails_23d387:hover :is(.voiceSectionText_23d387, .voiceSectionSubtext_23d387) {
		text-decoration: underline;
}

.voiceSectionText_23d387 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2857142857142858;
}

.voiceSectionSubtext_23d387 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3333333333333333;
}

.userList_23d387 {
		flex: 0 1 auto;
		justify-content: flex-end;
}

.voiceSection_23d387 button {
		flex: 0 1 auto;
		width: auto;
		margin-left: 20px;
}

.actionsActivity_23d387 .buttonContainer_23d387 {
		flex-direction: inherit;
}

.partyStatusWrapper_23d387 {
		display: flex;
		gap: 4px;
		align-items: center;
}

.partyStatusWrapper_23d387 button {
		flex: 0 1 50% !important;
		max-height: 24px;
		min-height: 24px !important;
		width: auto !important;
		justify-self: flex-end;
}

.partyList_23d387 {
		display: flex;
}

.player_23d387:first-of-type {
		mask: url(#svg-mask-voice-user-summary-item);
}

.emptyUser_23d387:not(:first-of-type), .player_23d387:not(:first-of-type) {
		margin-left: -4px;
}

.emptyUser_23d387:not(:last-of-type), .player_23d387:not(:last-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.emptyUser_23d387, .player_23d387 {
		width: 16px;
		height: 16px;
		border-radius: 50%;
}

.emptyUser_23d387 svg {
		margin-left: 3px;
}

.partyPlayerCount_23d387 {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3333333333333333;
}

.nowPlaying_23d387 .emptyState_23d387 {
		border: 1px solid;
		border-radius: 5px;
		box-sizing: border-box;
		margin-top: 20px;
		padding: 20px;
		width: 100%;
}

.cardV2_23d387 {
		background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
		border-radius: var(--radius-md);
		outline: 1px solid var(--border-normal);
		outline-offset: -1px;
		box-sizing: border-box;
		background-clip: border-box;
		overflow: hidden;
		transform: translateZ(0);

		.cardHeader_23d387 {
				padding: var(--space-lg);
				position: relative;
				flex-direction: row;
				background: unset;
		}
		.nameTag_23d387 {
				color: var(--white);
		}
		.splashArt_23d387, .server_23d387 {
				background-position: center;
				background-repeat: no-repeat;
				background-size: cover;
				filter: unset;
				mask: radial-gradient(100% 100% at top right, var(--white) 0, transparent 100%);
				opacity: .3;
				position: absolute;
				top: 0;
				left: unset;
				right: 0;
				width: 300px;
				height: 120px;
				pointer-events: none;
				z-index: -1;
		}
		&:hover {
				.headerIcon_23d387 {
						display: none;
				}
				.headerActions_23d387 {
						display: flex;
				}
		}
		.cardBody_23d387 {
				display: flex;
				gap: var(--space-lg);
				padding: 0 var(--space-lg) var(--space-lg);
				background: unset;
		}
		.section_23d387 {
				background: var(--background-mod-normal);
				border-radius: var(--radius-sm);
				padding: var(--space-sm);
		}
		.game_23d387 {
				padding: 0;
		}
		.sectionDivider_23d387 {
				border-color: var(--opacity-white-12) !important;
				border-width: 1px;
				margin: 12px 0 12px 0;
		}
		.voiceSectionText_23d387 {
				color: var(--white);
		}
		.headerIcon_23d387, .gameIcon_23d387, .assetsLargeImage_23d387.assetsLargeImage_23d387 {
				border-radius: var(--radius-sm);
		}
		.gameInfo_23d387 {
				color: var(--white);
		}
		.playTime_23d387:not(a), .voiceSectionSubtext_23d387 {
				color: var(--app-message-embed-secondary-text) !important;
		}
		.serviceButtonWrapper_23d387 {
				gap: 8px !important;
		}
		.contentImagesActivityFeed_23d387 {
				color: var(--white);
		}
		.textRow_23d387 {
				font-size: 16px;
				line-height: 18px;
		}
		.state_23d387 {
				color: var(--app-message-embed-secondary-text);
				font-size: 14px;
				line-height: 16px;
		}
		.activity_23d387:last-child:not(:only-child) {
				margin-top: 12px;
		}
}`;
_loadStyle("NowPlaying.module.css", css);
const modules_7260a078 = {
	"nowPlayingContainer": "nowPlayingContainer_23d387",
	"nowPlayingColumn": "nowPlayingColumn_23d387",
	"itemCard": "itemCard_23d387",
	"card": "card_23d387",
	"cardHeader": "cardHeader_23d387",
	"header": "header_23d387",
	"nameTag": "nameTag_23d387",
	"username": "username_23d387",
	"headerIcon": "headerIcon_23d387",
	"headerActions": "headerActions_23d387",
	"overflowMenu": "overflowMenu_23d387",
	"splashArt": "splashArt_23d387",
	"server": "server_23d387",
	"cardBody": "cardBody_23d387",
	"section": "section_23d387",
	"game": "game_23d387",
	"gameBody": "gameBody_23d387",
	"activityContainer": "activityContainer_23d387",
	"sectionDivider": "sectionDivider_23d387",
	"activity": "activity_23d387",
	"serviceButtonWrapper": "serviceButtonWrapper_23d387",
	"richActivity": "richActivity_23d387",
	"activityActivityFeed": "activityActivityFeed_23d387",
	"activityFeed": "activityFeed_23d387",
	"body": "body_23d387",
	"bodyNormal": "bodyNormal_23d387",
	"gameInfoRich": "gameInfoRich_23d387",
	"gameNameWrapper": "gameNameWrapper_23d387",
	"gameInfo": "gameInfo_23d387",
	"gameName": "gameName_23d387",
	"streamInfo": "streamInfo_23d387",
	"clickable": "clickable_23d387",
	"playTime": "playTime_23d387",
	"assets": "assets_23d387",
	"assetsLargeImageActivityFeed": "assetsLargeImageActivityFeed_23d387",
	"assetsSmallImageActivityFeed": "assetsSmallImageActivityFeed_23d387",
	"assetsLargeImage": "assetsLargeImage_23d387",
	"assetsLargeImageActivityFeedTwitch": "assetsLargeImageActivityFeedTwitch_23d387",
	"assetsSmallImage": "assetsSmallImage_23d387",
	"smallEmptyIcon": "smallEmptyIcon_23d387",
	"largeEmptyIcon": "largeEmptyIcon_23d387",
	"twitchImageContainer": "twitchImageContainer_23d387",
	"twitchBackgroundImage": "twitchBackgroundImage_23d387",
	"twitchImageOverlay": "twitchImageOverlay_23d387",
	"streamName": "streamName_23d387",
	"streamGame": "streamGame_23d387",
	"contentImagesActivityFeed": "contentImagesActivityFeed_23d387",
	"content": "content_23d387",
	"details": "details_23d387",
	"ellipsis": "ellipsis_23d387",
	"textRow": "textRow_23d387",
	"voiceSection": "voiceSection_23d387",
	"voiceSectionAssets": "voiceSectionAssets_23d387",
	"voiceSectionIconWrapper": "voiceSectionIconWrapper_23d387",
	"voiceSectionIcon": "voiceSectionIcon_23d387",
	"voiceSectionGuildImage": "voiceSectionGuildImage_23d387",
	"voiceSectionDetails": "voiceSectionDetails_23d387",
	"voiceSectionText": "voiceSectionText_23d387",
	"voiceSectionSubtext": "voiceSectionSubtext_23d387",
	"userList": "userList_23d387",
	"actionsActivity": "actionsActivity_23d387",
	"buttonContainer": "buttonContainer_23d387",
	"partyStatusWrapper": "partyStatusWrapper_23d387",
	"partyList": "partyList_23d387",
	"player": "player_23d387",
	"emptyUser": "emptyUser_23d387",
	"partyPlayerCount": "partyPlayerCount_23d387",
	"nowPlaying": "nowPlaying_23d387",
	"emptyState": "emptyState_23d387",
	"cardV2": "cardV2_23d387",
	"gameIcon": "gameIcon_23d387",
	"state": "state_23d387"
};
const NowPlayingClasses = modules_7260a078;

// activity_feed/components/now_playing/activities/components/common/FlexInfo.tsx
function ActivityType({ type, filterCheck, activity, game, voice, channel }) {
	const guildChannel = useStateFromStores([GuildStore], () => GuildStore.getGuild(channel?.guild_id));
	switch (type) {
		case "REGULAR":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.gameNameWrapper }, BdApi.React.createElement("div", { className: NowPlayingClasses.gameName }, game?.name)), !activity?.assets?.large_image && BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, BdApi.React.createElement(TimeClock, { timestamp: activity.created_at })));
		case "RICH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity.details || activity?.state), activity?.details && BdApi.React.createElement("div", { className: `${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity?.state), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(Common$1.MediaProgressBar, { start: activity?.timestamps?.start || activity?.created_at, end: activity?.timestamps?.end })) : BdApi.React.createElement(Common$1.ActivityTimer, { activity }));
		case "TWITCH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, activity.state && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, `${Common$1.intl.intl.formatToPlainString(Common$1.intl.t[`BMTj28`])} ${activity.state}`));
		case "SPOTIFY":
			return BdApi.React.createElement(BdApi.React.Fragment, null, activity.state && BdApi.React.createElement("div", { className: "details textRow ellipsis" }, `by ${activity.state}`), activity.assets?.large_text && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, `on ${activity.assets?.large_text}`), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(Common$1.MediaProgressBar, { start: activity?.timestamps?.start, end: activity?.timestamps?.end })) : BdApi.React.createElement(Common$1.ActivityTimer, { activity }));
		case "VOICE":
			return BdApi.React.createElement(BdApi.React.Fragment, null, guildChannel?.name && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, Common$1.intl.intl.formatToPlainString(Common$1.intl.t[`Xe4de2`], { channelName: guildChannel?.name })));
	}
}
function FlexInfo(props) {
	const { className, style, activity, game, voice, channel, type } = props;
	const filterCheck = activityCheck({ activities: [activity] });
	return BdApi.React.createElement("div", { className, style }, BdApi.React.createElement(ActivityType, { filterCheck, activity, game, voice, channel, type }));
}

// activity_feed/components/now_playing/activities/components/common/CardTrailing.tsx
function PartyMemberListBuilder({ activity, users }) {
	const emptyNum = activity?.party?.size[1] - activity?.party?.size[0];
	const anonNum = activity?.party?.size[0] - 1;
	const emptyUsers = [];
	for (let i = 0; i < anonNum; i++) {
		emptyUsers.push("anon");
	}
	for (let i = 0; i < emptyNum; i++) {
		emptyUsers.push(null);
	}
	const playerFill = users.concat(emptyUsers);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.partyList }, playerFill.splice(0, 10).map(
		(player) => {
			switch (player) {
				case "anon":
					return BdApi.React.createElement("div", { className: NowPlayingClasses.emptyUser, style: { background: "var(--experimental-avatar-embed-bg)" } }, BdApi.React.createElement("svg", { width: "10", height: "10" }, BdApi.React.createElement("path", { fill: "rgba(255, 255, 255, 0.7)", d: "M4.99967 4.16671C5.4417 4.16671 5.86563 3.99111 6.17819 3.67855C6.49075 3.36599 6.66634 2.94207 6.66634 2.50004C6.66634 2.05801 6.49075 1.63409 6.17819 1.32153C5.86563 1.00897 5.4417 0.833374 4.99967 0.833374C4.55765 0.833374 4.13372 1.00897 3.82116 1.32153C3.5086 1.63409 3.33301 2.05801 3.33301 2.50004C3.33301 2.94207 3.5086 3.36599 3.82116 3.67855C4.13372 3.99111 4.55765 4.16671 4.99967 4.16671ZM4.80384 4.58337C3.75071 4.58337 2.74071 5.00173 1.99604 5.7464C1.25136 6.49108 0.833008 7.50108 0.833008 8.55421C0.833008 8.89171 1.10801 9.16671 1.44551 9.16671H1.53717C1.63717 9.16671 1.72051 9.09587 1.74551 9.00004C1.86634 8.53337 2.09551 8.09587 2.29551 7.78754C2.35384 7.70004 2.47467 7.74587 2.46217 7.85004L2.35384 8.93754C2.34551 9.06254 2.43717 9.16671 2.56217 9.16671H7.43717C7.46638 9.16685 7.49529 9.16086 7.52202 9.14911C7.54876 9.13736 7.57273 9.12013 7.59237 9.09852C7.61202 9.07691 7.6269 9.05141 7.63605 9.02368C7.64521 8.99595 7.64843 8.9666 7.64551 8.93754L7.53301 7.85421C7.52467 7.74587 7.64551 7.70004 7.70384 7.78754C7.90384 8.09587 8.13301 8.53754 8.25384 8.99587C8.27884 9.09587 8.36217 9.16671 8.46217 9.16671H8.55384C8.89134 9.16671 9.16634 8.89171 9.16634 8.55421C9.16634 7.50108 8.74799 6.49108 8.00331 5.7464C7.25863 5.00173 6.24864 4.58337 5.19551 4.58337H4.80384Z" })));
				case null:
					return BdApi.React.createElement("div", { className: NowPlayingClasses.emptyUser, style: { background: "var(--experimental-avatar-embed-bg" } });
				default:
					return BdApi.React.createElement(
						Common$1.AvatarFetch,
						{
							src: `https://cdn.discordapp.com/avatars/${player?.id}/${player?.avatar}.webp?size=16`,
							size: "SIZE_16",
							imageClassName: NowPlayingClasses.player
						}
					);
			}
		}
	), playerFill.length > 10 && BdApi.React.createElement("div", { className: `${NowPlayingClasses.emptyUser} ${NowPlayingClasses.userOverflow}` }, `+${users.length + anonNum - 10}`));
}
function RegularCardTrailing({ activity, user, server, players, check, v2Enabled }) {
	const [width, height] = useWindowSize();
	if (width < 1240) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, server && BdApi.React.createElement(
		Common$1.VoiceList,
		{
			className: `${NowPlayingClasses.userList}`,
			users: players,
			maxUsers: players.length,
			guildId: server?.id,
			size: "SIZE_32"
		}
	), check?.spotify !== 0 && BdApi.React.createElement("div", { className: `${NowPlayingClasses.serviceButtonWrapper}` }, BdApi.React.createElement(Common$1.SpotifyButtons, { user, activity })), !activity?.name.includes("YouTube Music") && activity?.assets ? null : BdApi.React.createElement(
		"div",
		{
			className: `${MainClasses.button} ${NowPlayingClasses.actionsActivity} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`,
			style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }
		},
		v2Enabled && activity?.party && activity?.party?.size ? null : BdApi.React.createElement(Common$1.ActivityButtons, { user, activity })
	));
}
function RichCardTrailing({ activity, user, v2Enabled }) {
	const [width, height] = useWindowSize();
	return BdApi.React.createElement(BdApi.React.Fragment, null, width > 1240 && !activity?.name.includes("YouTube Music") && BdApi.React.createElement(
		"div",
		{
			className: `${MainClasses.button} ${NowPlayingClasses.actionsActivity} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`,
			style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }
		},
		v2Enabled && activity?.party && activity?.party?.size ? null : BdApi.React.createElement(Common$1.ActivityButtons, { user, activity })
	));
}
function PartyFooter({ party, players, user, activity }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.sectionDivider, style: { margin: "8px 0 8px 0" } }), BdApi.React.createElement("div", { className: NowPlayingClasses.partyStatusWrapper }, BdApi.React.createElement(PartyMemberListBuilder, { activity, users: players }), BdApi.React.createElement(
		"div",
		{
			className: NowPlayingClasses.partyPlayerCount,
			style: { flex: "1 1 100%" }
		},
		Common$1.intl.intl.formatToPlainString(Common$1.intl.t["gLu7NU"], { partySize: party.size[0], maxPartySize: party.size[1] })
	), BdApi.React.createElement(Common$1.JoinButton, { user, activity })));
}

// activity_feed/TooltipBuilder.tsx
const Tooltip = ({ note, position, children }) => {
	return BdApi.React.createElement(Common$1.Tooltip, { text: note, position: position || "top" }, (props) => {
		children.props = {
			...props,
			...children.props
		};
		return children;
	});
};

// activity_feed/components/now_playing/activities/components/common/ActivityAssets.tsx
function XboxImageAsset({ url }) {
	return BdApi.React.createElement(
		"img",
		{
			className: `${NowPlayingClasses.gameIcon}`,
			style: { width: "60px", height: "60px", pointerEvents: "none" },
			src: url
		}
	);
}
function FallbackAsset(props) {
	return BdApi.React.createElement("svg", { ...props }, BdApi.React.createElement(
		"path",
		{
			style: { transform: "scale(1.65)" },
			fill: "white",
			d: "M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
		}
	));
}
function SpotifyAsset({ activity, user }) {
	const [shouldFallback, setShouldFallback] = react.useState(false);
	return BdApi.React.createElement(BdApi.React.Fragment, null, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: NowPlayingClasses.smallEmptyIcon, style: { width: "40px", height: "40px" } }) : BdApi.React.createElement(
		"svg",
		{
			className: NowPlayingClasses.gameIcon,
			role: "image",
			width: "40",
			height: "40",
			viewBox: "0 0 16 16",
			onClick: () => Common$1.openSpotifyAlbumFromStatus(activity, user.id),
			onError: () => setShouldFallback(true)
		},
		BdApi.React.createElement("g", { fill: "none", fillRule: "evenodd" }, BdApi.React.createElement(
			"path",
			{
				fill: "var(--spotify)",
				d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
			}
		), BdApi.React.createElement("rect", { width: "16", height: "16" }))
	));
}
function GameIconAsset({ url, id, name }) {
	const [shouldFallback, setShouldFallback] = react.useState(false);
	const useGameProfile = Common$1.GameProfileCheck({ trackEntryPointImpression: false, applicationId: id });
	console.log(useGameProfile);
	return BdApi.React.createElement(BdApi.React.Fragment, null, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: NowPlayingClasses.gameIcon, style: { width: "40px", height: "40px" } }) : BdApi.React.createElement(
		"img",
		{
			className: NowPlayingClasses.gameIcon,
			style: { width: "40px", height: "40px", cursor: useGameProfile && "pointer" },
			"aria-label": Common$1.intl.intl.formatToPlainString(Common$1.intl.t["nh+jWk"], { game: name }),
			src: url,
			onClick: useGameProfile,
			onError: () => setShouldFallback(true)
		}
	));
}
function RichImageAsset({ url, tooltipText, onClick, type }) {
	const [shouldFallback, setShouldFallback] = react.useState(false);
	return BdApi.React.createElement(Tooltip, { note: tooltipText }, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: `${NowPlayingClasses[`assets${type}Image`]} ${NowPlayingClasses[`assets${type}ImageActivityFeed`]}` }) : BdApi.React.createElement(
		"img",
		{
			className: `${NowPlayingClasses[`assets${type}Image`]} ${NowPlayingClasses[`assets${type}ImageActivityFeed`]}`,
			"aria-label": tooltipText,
			alt: tooltipText,
			src: `${url}`,
			onClick,
			onError: () => setShouldFallback(true)
		}
	));
}
function TwitchImageAsset({ url, imageId, altText }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, !imageId ? BdApi.React.createElement(FallbackAsset, { className: "assetsLargeImage" }) : BdApi.React.createElement(
		"img",
		{
			className: "assetsLargeImageTwitch assetsLargeImage",
			"aria-label": altText,
			alt: altText,
			src: url,
			onError: (e) => e.currentTarget.src = "https://static-cdn.jtvnw.net/ttv-static/404_preview-162x90.jpg"
		}
	));
}

// activity_feed/components/now_playing/activities/components/innerBuilder.tsx
function RegularActivityBuilder({ activity, user, game, players, server, check, v2Enabled }) {
	return BdApi.React.createElement("div", { className: `${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart} ${Common$1.PositionClasses.alignCenter} ${Common$1.PositionClasses.flex} ${NowPlayingClasses.activity}`, style: { flex: "1 1 auto" } }, (() => {
		switch (true) {
			case !!check?.spotify:
				return BdApi.React.createElement(SpotifyAsset, { activity, user });
			case !!activity?.platform?.includes("xbox"):
				return BdApi.React.createElement(XboxImageAsset, { url: "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png" });
			default:
				return BdApi.React.createElement(GameIconAsset, { url: `https://cdn.discordapp.com/app-icons/${game?.id}/${game.icon}.webp?size=64&keep_aspect_ratio=false`, id: activity?.application_id, name: game?.name });
		}
	})(), BdApi.React.createElement(FlexInfo, { className: NowPlayingClasses.gameInfo, activity, game, type: "REGULAR" }), BdApi.React.createElement(RegularCardTrailing, { activity, user, server, players, check, v2Enabled }));
}
function RichActivityBuilder({ user, activity, v2Enabled }) {
	return BdApi.React.createElement("div", { className: `${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart} ${Common$1.PositionClasses.alignStretch} ${Common$1.PositionClasses.flex} ${NowPlayingClasses.richActivity}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common$1.PositionClasses.flex}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.assets}` }, BdApi.React.createElement(
		RichImageAsset,
		{
			url: (() => {
				switch (true) {
					case !!activity?.assets?.large_image?.includes("spotify"):
						return `https://i.scdn.co/image/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
					case !!activity?.assets?.large_image?.includes("external"):
						return `https://media.discordapp.net/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
					default:
						return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
				}
			})(),
			tooltipText: activity.assets.large_text,
			type: "Large"
		}
	), activity?.assets && activity?.assets.small_image && BdApi.React.createElement(
		RichImageAsset,
		{
			url: activity?.assets?.small_image?.includes("external") ? `https://media.discordapp.net/${activity.assets.small_image?.substring(activity.assets.small_image.indexOf(":") + 1)}` : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`,
			tooltipText: activity.assets.small_text,
			type: "Small"
		}
	)), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.contentImagesActivityFeed} ${NowPlayingClasses.content}`, activity, type: "RICH" }), BdApi.React.createElement(RichCardTrailing, { activity, user, v2Enabled }))));
}

// activity_feed/components/now_playing/activities/components/cardActivity.tsx
function ActivityCard({ user, activities, currentActivity, currentGame, players, server, check, v2Enabled }) {
	const gameId = currentActivity?.application_id;
	react.useEffect(() => {
		(async () => {
			await Common$1.FetchGames.getDetectableGamesSupplemental([gameId]);
		})();
	}, [gameId]);
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.activityContainer }, BdApi.React.createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, check, v2Enabled }), currentActivity?.assets && currentActivity?.assets.large_image && BdApi.React.createElement(RichActivityBuilder, { user, activity: currentActivity, v2Enabled })), v2Enabled && currentActivity?.party && currentActivity?.party.size && BdApi.React.createElement(PartyFooter, { party: currentActivity.party, players, user, activity: currentActivity }), activities.length > 1 && BdApi.React.createElement("div", { className: NowPlayingClasses.sectionDivider }));
}

// activity_feed/components/now_playing/activities/components/cardActivityWrapper.tsx
function ActivityCardWrapper({ user, activities, voice, streams, check, v2Enabled }) {
	if (!activities) return;
	return activities.map((activity) => {
		const currentActivity = activity?.activity || streams[0].activity;
		const currentGame = activity?.game || Common$1.GameStore.getGameByName(streams[0].activity.name);
		const players = activity.playingMembers;
		const server = voice[0]?.guild;
		return BdApi.React.createElement(ActivityCard, { user, activities, currentActivity, currentGame, players, server, check, v2Enabled });
	});
}

// activity_feed/components/now_playing/activities/components/cardTwitch.tsx
function TwitchCard({ user, activities }) {
	const activity = activities.filter((activity2) => activity2 && activity2.name && activity2.type === 1)[0];
	return BdApi.React.createElement("div", { className: "activityProfileContainer activityProfileContainerTwitch" }, BdApi.React.createElement("div", { className: "activityProfile activity" }, BdApi.React.createElement(ActivityHeader, { activity }), BdApi.React.createElement("div", { className: "bodyNormal", style: { display: "flex", alignItems: "center", width: "auto" } }, BdApi.React.createElement("div", { className: "assets", style: { position: "relative" } }, BdApi.React.createElement(
		TwitchImageAsset,
		{
			url: activity.name.includes("YouTube") ? `https://i.ytimg.com/vi/${activity?.assets?.large_image.substring(activity?.assets?.large_image.indexOf(":") + 1)}/hqdefault_live.jpg` : `https://static-cdn.jtvnw.net/previews-ttv/live_user_${activity?.assets?.large_image.substring(activity?.assets?.large_image.indexOf(":") + 1)}-162x90.jpg`,
			imageId: activity?.assets?.large_image,
			altText: activity?.assets?.large_text
		}
	)), BdApi.React.createElement(FlexInfo, { className: "contentImagesProfile content", activity, type: "TWITCH" }), BdApi.React.createElement("div", { className: "buttonsWrapper actionsProfile" }, BdApi.React.createElement(Common.ActivityButtons, { user, activity })))));
}

// activity_feed/components/now_playing/activities/methods/getVoiceParticipants.js
function getVoiceParticipants({ voice }) {
	let participants = [];
	const channelParticipants = Object.keys(VoiceStateStore.getVoiceStatesForChannel(voice));
	for (let i = 0; i < channelParticipants.length; i++) {
		participants.push(UserStore.getUser(channelParticipants[i]));
	}
	return participants;
}

// activity_feed/components/now_playing/activities/components/cardVoice.tsx
function VoiceCard({ activities, voice, streams }) {
	if (!voice.length && !streams.length) return;
	useWindowSize();
	const stream = streams[0]?.stream;
	streams[0]?.streamUser;
	const channel = stream ? ChannelStore$1.getChannel(stream.channelId) : voice[0]?.channel;
	stream && !channel ? getVoiceParticipants({ voice: stream.channelId }) : voice[0]?.members;
	voice[0]?.guild;
	return BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSection }, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSectionAssets }));
}

// activity_feed/components/now_playing/card_shop/components/CardBody.tsx
function CardBody({ activities, user, voice, streams, check, isSpotify, v2Enabled }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.cardBody }, BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.game }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.gameBody} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(VoiceCard, { activities, voice, streams }), (() => {
		switch (true) {
			case !!check?.streaming:
				return BdApi.React.createElement(TwitchCard, { user, activity: activities[0] });
			default:
				return BdApi.React.createElement(ActivityCardWrapper, { user, activities, voice, streams, check, v2Enabled });
		}
	})()))));
}

// activity_feed/components/now_playing/card_shop/components/CardHeader.tsx
function Splash({ splash, className }) {
	if (!splash) return;
	return BdApi.React.createElement("div", { className, style: { backgroundImage: `url(${splash})` } });
}
function DiscordTag({ user, voice }) {
	let outputtedUsername;
	switch (true) {
		case (!!voice && voice[0]?.members.length > 2):
			outputtedUsername = `${user.globalName}, ${Common$1.intl.intl.formatToPlainString(Common$1.intl.t["zRRd8G"], { count: voice[0]?.members.length - 2, name: voice[0]?.members[voice[0]?.members.length - 1].globalName || voice[0]?.members[voice[0]?.members.length - 1].username })}`;
			break;
		case (!!voice && voice[0]?.members.length > 1):
			outputtedUsername = Common$1.intl.intl.formatToPlainString(Common$1.intl.t["4SM/RX"], { user1: user.globalName || voice[0]?.members[1].username, user2: voice[0]?.members[1].globalName || voice[0]?.members[1].username });
			break;
		default:
			outputtedUsername = user.globalName || user.username;
	}
	return BdApi.React.createElement("div", { className: NowPlayingClasses.nameTag, style: { flex: 1 } }, BdApi.React.createElement("span", { className: `${NowPlayingClasses.username} username`, onClick: () => Common$1.ModalAccessUtils.openUserProfileModal({ userId: user.id }) }, outputtedUsername));
}
function HeaderActions({ card, user }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.headerActions} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart} ${Common$1.PositionClasses.alignCenter}`, style: { flex: "0" } }, BdApi.React.createElement("button", { type: "button", className: `${MainClasses.button} ${Common$1.ButtonVoidClasses.sizeSmall} ${Common$1.ButtonVoidClasses.lookFilled}`, onClick: () => Common$1.OpenDM.openPrivateChannel({ recipientIds: user.id }) }, "Message"), BdApi.React.createElement(
		Common$1.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(Common$1.PopoutContainer, { position: "left" }, BdApi.React.createElement(Common$1.CardPopout, { party: card.party, close: () => setShowPopout(false) })),
			position: "left",
			shouldShow: showPopout
		},
		(props) => BdApi.React.createElement(
			"span",
			{
				...props,
				ref: refDOM,
				onClick: () => {
					setShowPopout(true);
				}
			},
			BdApi.React.createElement(Tooltip, { note: "More" }, BdApi.React.createElement("button", { className: `${MainClasses.button} ${Common$1.ButtonVoidClasses.lookBlank} ${Common$1.ButtonVoidClasses.grow}`, type: "button" }, BdApi.React.createElement("svg", { className: `${NowPlayingClasses.overflowMenu}`, role: "img", width: "16", height: "16", viewBox: "0 0 24 24" }, BdApi.React.createElement("g", { fill: "none", fillRule: "evenodd" }, BdApi.React.createElement("path", { d: "M24 0v24H0V0z" }), BdApi.React.createElement("path", { d: "M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z", fill: "currentColor" })))))
		)
	));
}
function HeaderIcon({ activities, isSpotify, currentGame }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, isSpotify ? BdApi.React.createElement("svg", { className: `${NowPlayingClasses.headerIcon}`, "aria-hidden": true, role: "image", width: "16", height: "16", viewBox: "0 0 16 16" }, BdApi.React.createElement("g", { fill: "none", fillRule: "evenodd" }, BdApi.React.createElement("path", { fill: "var(--spotify)", d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z" }), BdApi.React.createElement("rect", { width: "16", height: "16" }))) : activities.length !== 0 && BdApi.React.createElement("img", { className: `${NowPlayingClasses.headerIcon}`, alt: "", src: `https://cdn.discordapp.com/app-icons/${currentGame?.id}/${currentGame?.icon}.png?size=64&keep_aspect_ratio=false` }));
}
function CardHeader({ card, activities, game, splash, user, voice, isSpotify }) {
	const status = card.party.priorityMembers[0].status;
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.cardHeader} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart} ${Common$1.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(Splash, { splash, className: betterdiscord.Utils.className(NowPlayingClasses.splashArt, voice && activities.length === 0 && NowPlayingClasses.server) }), BdApi.React.createElement("div", { className: NowPlayingClasses.header }, BdApi.React.createElement(Common$1.AvatarFetch, { imageClassName: "avatar", src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`, status, size: "SIZE_40" }), BdApi.React.createElement(DiscordTag, { user, voice }), BdApi.React.createElement(HeaderActions, { card, user }), BdApi.React.createElement(HeaderIcon, { activities, isSpotify, currentGame: game })));
}

// activity_feed/components/now_playing/cardBuilder.tsx
function NowPlayingCardBuilder({ card, v2Enabled }) {
	const user = card.party.priorityMembers[0].user;
	const activities = card.party.currentActivities;
	const currentGame = card.party.currentActivities[0]?.game;
	const voice = card.party.voiceChannels;
	const streams = card.party.applicationStreams;
	const isSpotify = card.party.isSpotifyActivity;
	const filterCheck = activityCheck(activities, isSpotify);
	const cardGrad = GradGen(filterCheck, isSpotify, activities[0]?.activity, currentGame, voice, streams[0]?.stream);
	react.useEffect(() => {
		(async () => {
			await Common$1.FetchGames.getDetectableGamesSupplemental([currentGame?.id]);
		})();
	}, [currentGame?.id]);
	const game = DetectableGameSupplementalStore.getGame(currentGame?.id) || ApplicationStore.getApplication(currentGame?.id) && DetectableGameSupplementalStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id);
	const splash = SplashGen(isSpotify, activities[0]?.activity, { currentGame, data: game }, voice, streams[0]?.stream);
	return BdApi.React.createElement("div", { className: v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } }, BdApi.React.createElement(CardHeader, { card, activities, game: currentGame, splash, user, voice, isSpotify }), BdApi.React.createElement(CardBody, { activities, user, voice, streams, check: filterCheck, isSpotify, v2Enabled }));
}

// activity_feed/components/now_playing/baseBuilder.tsx
function NowPlayingColumnBuilder({ nowPlayingCards }) {
	return nowPlayingCards.map((card) => [
		BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") }),
		betterdiscord.Data.load("cardTypeDebug") && BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: false })
	]);
}
function NowPlayingBuilder(props) {
	Common$1.FluxDispatcher.dispatch({ type: "NOW_PLAYING_MOUNTED" });
	const nowPlayingCards = useStateFromStores([NowPlayingViewStore], () => NowPlayingViewStore.nowPlayingCards);
	const cardColumns = chunkArray(nowPlayingCards, 2);
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Now Playing" }), nowPlayingCards.length === 0 ? BdApi.React.createElement("div", { className: MainClasses.emptyState }, BdApi.React.createElement("div", { className: MainClasses.emptyTitle }, "Nobody is playing anything right now..."), BdApi.React.createElement("div", { className: MainClasses.emptySubtitle }, "When someone starts playing a game we'll show it here!")) : BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingContainer }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingColumn }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column })))));
}

// activity_feed/base.tsx
function Scroller({ children, padding }) {
	return BdApi.React.createElement("div", { className: MainClasses.scrollerBase, style: { overflow: "hidden scroll", paddingRight: `${padding}px` || "0px" } }, children);
}
function TabBaseBuilder() {
	document.title = "Activity";
	const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"];
	return BdApi.React.createElement("div", { className: MainClasses.activityFeed }, BdApi.React.createElement(Common$1.HeaderBar, { className: MainClasses.headerBar, "aria-label": "Activity" }, BdApi.React.createElement("div", { className: MainClasses.iconWrapper }, BdApi.React.createElement("svg", { className: Common$1.UpperIconClasses.icon, style: { width: 24, height: 24 }, viewBox: "0 0 24 24", fill: "none" }, BdApi.React.createElement("path", { d: ControllerIcon, fill: "var(--channel-icon)" }))), BdApi.React.createElement("div", { className: MainClasses.titleWrapper }, BdApi.React.createElement("div", { className: MainClasses.title }, "Activity"))), BdApi.React.createElement(Scroller, null, BdApi.React.createElement("div", { className: MainClasses.centerContainer }, BdApi.React.createElement(QuickLauncherBuilder, { className: QuickLauncherClasses.quickLauncher, style: { position: "relative", padding: "0 20px 0 20px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: NowPlayingClasses.nowPlaying, style: { position: "relative", padding: "0 20px 20px 20px" } }), BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))));
}

// settings/builder.tsx
function SettingsPanelBuilder() {
	return;
}

// activity_feed/extra.js
const styles = Object.assign(
	{
		wrapper: betterdiscord.Webpack.getByKeys("wrapper", "svg", "mask").wrapper,
		customButtons: betterdiscord.Webpack.getByKeys("customButtons", "absolute").customButtons,
		hasText: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).hasText,
		sm: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).sm,
		interactiveSelected: betterdiscord.Webpack.getByKeys("icon", "upperContainer").interactiveSelected,
		lookFilled: betterdiscord.Webpack.getByKeys("colorPrimary", "grow").lookFilled,
		colorPrimary: betterdiscord.Webpack.getByKeys("colorPrimary", "grow").colorPrimary
	},
	betterdiscord.Webpack.getByKeys("itemCard"),
	betterdiscord.Webpack.getByKeys("tabularNumbers"),
	betterdiscord.Webpack.getByKeys("bar", "container", "progress"),
	betterdiscord.Webpack.getModule((x) => x.buttonContainer && Object.keys(x).length === 1),
	MainClasses,
	NowPlayingClasses,
	QuickLauncherClasses
);
const extraCSS = webpackify(`\n  	._2cbe2fbfe32e4150-description .sharedFilePreviewYouTubeVideo {\n  			display: none;\n  	}\n\n  	.nowPlayingColumn .tabularNumbers {\n  			color: var(--text-default) !important;\n  	}\n\n  	.nowPlayingColumn :is(.actionsActivity, .customButtons) {\n  			gap: 8px;\n  	}\n\n  	.nowPlayingColumn .header > .wrapper {\n  			display: flex;\n  			cursor: pointer;\n  			margin-right: 20px;\n  			transition: opacity .2s ease;\n  	}\n\n  	.customButtons {\n  			display: flex;\n  			flex-direction: column;\n  	}\n\n  	.headerActions {\n  			.button.lookFilled {\n  					background: var(--control-secondary-background-default);\n  					border: unset;\n  					color: var(--white);\n  					padding: 2px 16px;\n  					width: unset;\n  					svg {\n  							display: none;\n  					} \n  			}\n  			.button.lookFilled:hover {\n  					background-color: var(--control-secondary-background-hover) !important;\n  			}\n  			.button.lookFilled:active {\n  					background-color: var(--control-secondary-background-active) !important; \n  			}\n  			.lookFilled.colorPrimary {\n  					background: unset !important;\n  					border: unset !important;\n  			}\n  			.lookFilled.colorPrimary:hover {\n  					color: var(--interactive-background-hover);\n  					svg {\n  							stroke: var(--interactive-background-hover);\n  					}\n  			}\n  			.lookFilled.colorPrimary:active {\n  					color: var(--interactive-background-active);\n  					svg {\n  							stroke: var(--interactive-background-active);\n  					}\n  			}\n  	}\n\n  	.activity .serviceButtonWrapper .sm:not(.hasText) {\n  			padding: 0;\n  			width: calc(var(--custom-button-button-sm-height) + 4px);\n  	}\n\n  	.content .bar {\n  			background-color: var(--opacity-white-24);\n  	}\n\n  	.partyStatusWrapper .disabledButtonWrapper {\n  			flex: 1;\n  	}\n\n  	.partyStatusWrapper .disabledButtonOverlay {\n  			height: 24px;\n  			width: 100%;\n  	}\n\n  	.cardV2 {\n  			.headerActions .button.lookFilled, .cardBody button {\n  					color: var(--white);\n  					background: var(--opacity-white-24);\n  					&:hover {\n  							background: var(--opacity-white-36);\n  					}\n  					&:active {\n  							background: var(--opacity-white-32);\n  					}\n  			}\n  			.tabularNumbers {\n  					color: var(--app-message-embed-secondary-text) !important;\n  			}\n  			.bar {\n  					background-color: var(--opacity-white-24);\n  			}\n  			.progress {\n  					background-color: var(--white);\n  			}\n  	}\n\n  	.theme-light .nowPlaying .emptyState {\n  			background-color: #fff;\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlaying .emptyState {\n  			background-color: rgba(79, 84, 92, .3);\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .quickLauncher .emptyState, .theme-light .blacklist.emptyState {\n  			border-color: rgba(220,221,222,.6);\n  			color: #b9bbbe;\n  	}\n\n  	.theme-dark .quickLauncher .emptyState, .theme-dark .blacklist.emptyState {\n  			border-color: rgba(47,49,54,.6);\n  			color: #72767d;\n  	}\n\n  	.theme-light .nowPlayingColumn .sectionDivider {\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlayingColumn .sectionDivider {\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-dark .voiceSectionIconWrapper {\n  			background-color: var(--primary-800);\n  	}\n\n  	.theme-light .voiceSectionIconWrapper {\n  			background: var(--primary-300);\n  	}\n\n  	.quickLauncher .emptyState, .blacklist.emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  			align-items: center;\n  	}\n`);
function webpackify(css) {
	for (const key in styles) {
		let regex = new RegExp(`\\.${key}([\\s,.):>])`, "g");
		css = css.replace(regex, `.${styles[key]}$1`);
	}
	console.log(css);
	return css;
}

// index.ts
function useSelectedState() {
	return useLocation().pathname.startsWith("/activity-feed");
}
function NavigatorButton() {
	return react.createElement(
		Common$1.LinkButton,
		{
			selected: useSelectedState(),
			route: "/activity-feed",
			text: "Activity",
			icon: () => {
				return react.createElement(
					"svg",
					{ className: Common$1.LinkButtonClasses.linkButtonIcon, width: 20, height: 20, viewBox: "0 0 20 20", fill: "none" },
					react.createElement("path", { d: ControllerIcon, fill: "currentColor", transform: "scale(0.90)" })
				);
			}
		}
	);
}
const panelObj = layoutUtils.Panel(
	"activity_feed_panel",
	{
		buildLayout: () => [],
		key: "activity_feed_panel",
		StronglyDiscouragedCustomComponent: () => react.createElement(SettingsPanelBuilder),
		type: 3,
		useTitle: () => "Activity Feed"
	}
);
const sidebarItem = layoutUtils.Button(
	"activity_feed_sidebar_item",
	{
		buildLayout: () => [panelObj],
		icon: () => react.createElement("svg", {
			className: "newspaperIcon_267ac",
			role: "img",
			width: "20",
			height: "20",
			fill: "none",
			viewBox: "0 0 24 24",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}, [
			react.createElement(
				"defs",
				{},
				react.createElement("mask", { id: "newspaper-mask" }, [
					react.createElement("rect", { width: 24, height: 24, fill: "#fff", stroke: "none" }),
					react.createElement("g", { stroke: "#000" }, [
						react.createElement("path", { d: "M15 18h-5" }),
						react.createElement("path", { d: "M18 14h-8" }),
						react.createElement("path", { d: "M10 6h8v4h-8V6Z" })
					])
				])
			),
			react.createElement("path", { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z", fill: "currentColor", mask: "url(#newspaper-mask)" }),
			react.createElement("path", { d: "M4 22a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" })
		]),
		key: "activity_feed_sidebar_item",
		legacySearchKey: "ACTIVITY_FEED",
		type: 2,
		useTitle: () => "Activity Feed"
	}
);
class ActivityFeed {
	start() {
		NewsStore.blacklist = betterdiscord.Data.load("blacklist");
		const Route = betterdiscord.Webpack.getByStrings('["impressionName","impressionProperties","disableTrack"]');
		if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
			NavigationUtils.transitionTo("/channels/@me");
		}
		function NewType(props) {
			const ret = NewType._(props);
			const { children } = betterdiscord.Utils.findInTree(ret, (node) => node && node.children?.length > 5, { walkable: ["children", "props"] });
			const index = children.findIndex((m) => m.key === "activity-feed");
			if (~index) {
				children.splice(index, 1);
			}
			children.push(
				react.createElement(Route, {
					disableTrack: true,
					path: "/activity-feed",
					render: () => TabBaseBuilder(),
					exact: true,
					key: "activity-feed"
				})
			);
			return ret;
		}
		betterdiscord.DOM.addStyle("activityPanelCSS", styles$1());
		betterdiscord.DOM.addStyle("activityPanelSupplementalCSS", extraCSS);
		betterdiscord.Patcher.after(Common$1.DMSidebar, "A", (that, [props], res) => {
			const panel = betterdiscord.Utils.findInTree(res, (m) => m?.homeLink, { walkable: ["props", "children"] });
			const selected = useSelectedState();
			if (selected) {
				for (const child of panel.children) {
					const link = betterdiscord.Utils.findInTree(child, (m) => m && typeof m === "object" && "selected" in m, { walkable: ["props", "children"] });
					if (link) {
						link.selected = false;
					}
				}
			}
			const index = panel.children.findIndex((m) => m?.key === "activityCenter_button");
			if (index !== -1) return;
			panel.children.unshift(
				react.createElement(NavigatorButton, { key: "activityCenter_button" })
			);
		});
		betterdiscord.Patcher.after(betterdiscord.Webpack.getByPrototypeKeys("handleHistoryChange", "ensureChannelMatchesGuild").prototype, "render", (that, args, res) => {
			const channelRouteProps = betterdiscord.Utils.findInTree(res, (node) => node && node.path?.length > 5, { walkable: ["children", "props"] });
			channelRouteProps.path = [
				...channelRouteProps.path.filter((m) => m !== "/activity-feed"),
				"/activity-feed"
			];
		});
		betterdiscord.Patcher.after(Common$1.RootSectionModule, "buildLayout", (that, [props], res) => {
			const section = betterdiscord.Utils.findInTree(res, (tree) => Object.values(tree).includes("activity_section"), { walkable: ["props", "children"] });
			betterdiscord.Patcher.after(section, "buildLayout", (that2, [props2], res2) => {
				if (!betterdiscord.Utils.findInTree(res2, (tree) => Object.values(tree).includes("activity_feed_sidebar_item", { walkable: ["props", "children"] }))) {
					res2.push(sidebarItem);
				}
				return res2;
			});
		});
		function fu() {
			const appI = betterdiscord.ReactUtils.getOwnerInstance(document.querySelector("div[class^=app_] > div[class^=app_]"), {
				filter: (m) => typeof m.ensureChannelMatchesGuild === "function"
			});
			console.log("fu()");
			if (appI) {
				appI.forceUpdate(() => {
					const inst = betterdiscord.ReactUtils.getOwnerInstance(document.querySelector(`.${container}`));
					betterdiscord.Patcher.after(inst, "render", (that, args, res) => {
						NewType._ ??= res.props.children.type;
						res.props.children.type = NewType;
					});
					inst?.forceUpdate(() => {
						console.log("inst.forceUpdate");
						appI.forceUpdate();
						inst.forceUpdate();
					});
				});
			}
		}
		fu();
		{
			const appMount = document.getElementById("app-mount");
			const reactContainerKey = Object.keys(appMount).find((m) => m.startsWith("__reactContainer$"));
			let container2 = appMount[reactContainerKey];
			while (!container2.stateNode?.isReactComponent) {
				container2 = container2.child;
			}
			container2 = container2.child;
			while (!container2.stateNode?.isReactComponent) {
				container2 = container2.child;
			}
			betterdiscord.Patcher.after(container2.stateNode, "render", fu);
			const undo = betterdiscord.Patcher.after(container2.stateNode, "render", () => {
				undo();
				fu();
			});
		}
	}
	stop() {
		betterdiscord.Patcher.unpatchAll("ActivityFeed");
		betterdiscord.DOM.removeStyle("activityFeedCSS");
		betterdiscord.ReactUtils.getOwnerInstance(document.querySelector(`.${container}`)).forceUpdate();
	}
	getSettingsPanel() {
		return [
			react.createElement(() => Object.keys(settings.main).map(
				(key) => {
					const { name, note, initial, changed } = settings.main[key];
					const [state, setState] = react.useState(betterdiscord.Data.load(key));
					return react.createElement(Common$1.FormSwitch, {
						label: name,
						description: note,
						checked: state ?? initial,
						onChange: (v) => {
							betterdiscord.Data.save(key, v);
							setState(v);
							if (changed)
								changed(v);
						}
					});
				}
			)),
			react.createElement(betterdiscord.Components.Text, { size: betterdiscord.Components.Text.Sizes.SIZE_16, strong: true, style: { borderTop: "thin solid var(--border-subtle)", paddingTop: "var(--space-12)", paddingBottom: "var(--space-12)" } }, "Activity Feed"),
			react.createElement(betterdiscord.Components.SettingGroup, {
				name: "Games You've Hidden",
				collapsible: true,
				shown: false,
				children: [
					react.createElement(
						"div",
						{ className: "blacklist_267ac emptyState_267ac", style: { padding: 0, borderBottom: "unset" } },
						react.createElement("div", { className: "emptyText_267ac" }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Below are the games you have hidden.")
					)
				]
			}),
			react.createElement(betterdiscord.Components.SettingGroup, {
				name: "Advanced/Debug",
				collapsible: true,
				shown: false,
				children: react.createElement(
					"div",
					{ className: "toggleStack_267ac", style: { padding: "var(--space-16) 0 var(--space-16) 0" } },
					react.createElement(() => Object.keys(settings.debug).map((key) => {
						const { name, note, initial, type, changed } = settings.debug[key];
						const [state, setState] = react.useState(betterdiscord.Data.load(key));
						if (type === "switch") {
							return react.createElement(Common$1.FormSwitch, {
								label: name,
								description: note,
								checked: state ?? initial,
								onChange: (v) => {
									betterdiscord.Data.save(key, v);
									setState(v);
									if (changed)
										changed(v);
								}
							});
						}
						return react.createElement("div", { className: "buttonItem_267ac", style: { display: "flex" } }, [
							react.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1 } }, [
								react.createElement("div", { className: "blacklistItemName_267ac textRow_267ac", style: { fontWeight: 500, fontSize: "16px", color: "var(--text-primary)" } }, name),
								react.createElement("div", { className: "textRow_267ac" }, note)
							]),
							react.createElement(
								"button",
								{
									className: `button_267ac unhideBlacklisted_267ac ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.colorPrimary} ${Common$1.ButtonVoidClasses.sizeTiny} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`,
									onClick: () => NewsStore.displaySet = NewsStore.getRandomFeeds(NewsStore.dataSet)
								},
								"Reroll"
							)
						]);
					}))
				)
			})
		];
	}
}

module.exports = ActivityFeed;

/*@end@*/