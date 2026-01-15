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
	}
};

// modules/common.js
const Filters = [
	{ name: "ActivityTimer", filter: betterdiscord.Webpack.Filters.byStrings("timestamps", ".TEXT_FEEDBACK_POSITIVE"), searchExports: true },
	{ name: "AnchorClasses", filter: betterdiscord.Webpack.Filters.byKeys("anchor", "anchorUnderlineOnHover"), searchExports: true },
	{ name: "Animated", filter: (x) => x.Easing && x.accelerate },
	{ name: "AvatarFetch", filter: betterdiscord.Webpack.Filters.bySource("src", "statusColor", "size", "isMobile"), searchExports: true },
	{ name: "ButtonClasses", filter: betterdiscord.Webpack.Filters.byKeys("lookFilled", "button") },
	{ name: "CallButtons", filter: betterdiscord.Webpack.Filters.byStrings("PRESS_JOIN_CALL_BUTTON") },
	{ name: "CardPopout", filter: betterdiscord.Webpack.Filters.byStrings("party", "close", "onSelect"), searchExports: true },
	{ name: "Clipboard", filter: betterdiscord.Webpack.Filters.byStrings("navigator.clipboard.write"), searchExports: true },
	{ name: "DMSidebar", filter: betterdiscord.Webpack.Filters.bySource(".Z.CONTACTS_LIST") },
	{ name: "FetchApplications", filter: betterdiscord.Webpack.Filters.byKeys("fetchApplication") },
	{ name: "FetchGames", filter: betterdiscord.Webpack.Filters.byKeys("getDetectableGamesSupplemental") },
	{ name: "FetchUtils", filter: (x) => typeof x === "object" && x.del && x.put, searchExports: true },
	{ name: "FluxDispatcher", filter: betterdiscord.Webpack.Filters.byKeys("dispatch", "subscribe", "register") },
	{ name: "FormSwitch", filter: betterdiscord.Webpack.Filters.byStrings('"data-toggleable-component":"switch"', 'layout:"horizontal"'), searchExports: true },
	{ name: "GameProfile", filter: (x) => x.openGameProfileModal },
	{ name: "GameProfileCheck", filter: betterdiscord.Webpack.Filters.byStrings("gameProfileModalChecks", "onOpened") },
	{ name: "GradientComponent", filter: betterdiscord.Webpack.Filters.byStrings("darken", "s.Bd") },
	{ name: "HeaderBar", filter: betterdiscord.Webpack.Filters.byKeys("Icon", "Divider") },
	{ name: "intl", filter: (x) => x.t && x.t.formatToMarkdownString },
	{ name: "JoinButton", filter: betterdiscord.Webpack.Filters.byStrings("user", "activity", "onAction", "onClose", "themeType", "embeddedActivity") },
	{ name: "LinkButton", filter: betterdiscord.Webpack.Filters.byStrings("route", "iconClassName"), searchExports: true },
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
const Common = CommonExport();
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
const GameStore = betterdiscord.Webpack.getStore("GameStore");
const NowPlayingViewStore = betterdiscord.Webpack.getStore("NowPlayingViewStore");
const RunningGameStore = betterdiscord.Webpack.getStore("RunningGameStore");
const UserStore = betterdiscord.Webpack.getStore("UserStore");
const { useStateFromStores } = betterdiscord.Webpack.getMangled((m) => m.Store, { useStateFromStores: betterdiscord.Webpack.Filters.byStrings("useStateFromStores") }, { raw: true });

// styles
let _styles = "";
function _loadStyle(path, css) {
	_styles += "/*" + path + "*/\n" + css + "\n";
}

// activity_feed/ActivityFeed.module.css
const css = `
._0ba2b6a9e50a96c2_activityFeed {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-border-frame);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

._0ba2b6a9e50a96c2_scrollerBase {
		contain: layout size;
		height: 100%;
		/*
		background: no-repeat bottom;
		background-size: 100%;
		background-image: url(/assets/c486dc65ce2877eeb18e4c39bb49507a.svg);
		*/
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

._0ba2b6a9e50a96c2_centerContainer {
		display: flex;
		flex-direction: column;
		width: 1280px;
		max-width: 100%;
		min-width: 480px;
		margin: 0 auto;
}

._0ba2b6a9e50a96c2_title {
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

._0ba2b6a9e50a96c2_titleWrapper {
		flex: 0 0 auto;
		margin: 0 8px 0 0;
		min-width: auto;
}

._0ba2b6a9e50a96c2_iconWrapper {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: var(--space-32);
		justify-content: center;
		margin: 0;
		position: relative;
		width: var(--space-32);
}

._0ba2b6a9e50a96c2_headerBar {
		height: calc(var(--custom-channel-header-height) - 1px);
		min-height: calc(var(--custom-channel-header-height) - 1px);
}

._0ba2b6a9e50a96c2_headerContainer {
		flex-direction: row;
}

._0ba2b6a9e50a96c2_headerText {
		display: flex;
		flex: 1;
		font-size: 18px;
		font-weight: 500;
		line-height: 22px;
		margin-top: 20px;
		width: 100%;
		color: var(--text-default);
}

._0ba2b6a9e50a96c2_feedCarousel {
		display: flex;
		position: relative;
}

._0ba2b6a9e50a96c2_carousel {
		background-color: var(--background-secondary-alt);
		border-radius: 5px;
		flex: 1 1 75%;
		min-height: 388px;
		margin-right: 20px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

._0ba2b6a9e50a96c2_article {
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

._0ba2b6a9e50a96c2_background {
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 7.5%;
		mask: linear-gradient(0deg, transparent, #000);
		min-width: 300px;
		background-position: top;
}

._0ba2b6a9e50a96c2_backgroundImage {
		background-position: top;
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 0;
}

._0ba2b6a9e50a96c2_background, ._0ba2b6a9e50a96c2_backgroundImage {
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

._0ba2b6a9e50a96c2_feedOverflowMenu {
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 12px;
}

._0ba2b6a9e50a96c2_applicationArea {
		color: var(--text-default);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
}

._0ba2b6a9e50a96c2_details {
		position: relative;
}

._0ba2b6a9e50a96c2_titleStandard {
		margin-top: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24px;
		line-height: 28px;
}

._0ba2b6a9e50a96c2_title {
		color: var(--header-primary);
		display: block;
		font-weight: 500;
}

._0ba2b6a9e50a96c2_description {
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
		._0ba2b6a9e50a96c2_sharedFilePreviewYouTubeVideo {
				display: none;
		}
}

._0ba2b6a9e50a96c2_timestamp {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

._0ba2b6a9e50a96c2_gameIcon {
		position: relative;
		pointer-events: auto;
		cursor: pointer;
		height: 40px;
		width: 40px;
		flex-shrink: 0;
		border-radius: 3px;
}

._0ba2b6a9e50a96c2_pagination {
		-webkit-box-flex: 1;
		flex: 1 1 25%;
		min-width: 0;
}

._0ba2b6a9e50a96c2_verticalPaginationItemContainer {
		margin: 0;
		overflow: hidden;
}

._0ba2b6a9e50a96c2_scrollerWrap {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
		height: 100%;
		min-height: 1px;
		position: relative;
}

._0ba2b6a9e50a96c2_scroller {
		-webkit-box-flex: 1;
		contain: layout;
		flex: 1;
		min-height: 1px;
}
		
._0ba2b6a9e50a96c2_paginationItem, ._0ba2b6a9e50a96c2_paginationItem:before {
		transition: all .2s ease;
}

._0ba2b6a9e50a96c2_paginationItem:first-child {
		margin-top: 0;
}

._0ba2b6a9e50a96c2_paginationItem {
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

._0ba2b6a9e50a96c2_paginationItem:before {
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

._0ba2b6a9e50a96c2_paginationItem:after {
		background-blend-mode: color;
		border-radius: 5px;
		bottom: 0;
		content: "";
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

._0ba2b6a9e50a96c2_splashArt {
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

._0ba2b6a9e50a96c2_paginationSubtitle, ._0ba2b6a9e50a96c2_paginationTitle {
		font-weight: 600;
}

._0ba2b6a9e50a96c2_paginationText {
		overflow: hidden;
}

._0ba2b6a9e50a96c2_paginationContent {
		overflow: hidden;
		position: relative;
		z-index: 1;
}

._0ba2b6a9e50a96c2_paginationTitle {
		color: var(--header-primary);
		font-size: 16px;
		line-height: 1.25;
		max-height: 40px;
}

._0ba2b6a9e50a96c2_paginationSubtitle {
		color: var(--text-muted);
		font-size: 12px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._0ba2b6a9e50a96c2_selectedPage {
		background: var(--background-surface-higher);
		cursor: default;
}

._0ba2b6a9e50a96c2_selectedPage:before {
		transform: translateY(-50%) translateX(0);
}

._0ba2b6a9e50a96c2_selectedPage ._0ba2b6a9e50a96c2_splashArt {
		filter: grayscale(0);
}

._0ba2b6a9e50a96c2_smallCarousel {
		-webkit-box-flex: 1;
		border-radius: 5px;
		flex: 1;
		height: 220px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

._0ba2b6a9e50a96c2_titleRowSimple {
		-webkit-box-align: center;
		-webkit-box-pack: justify;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
}

._0ba2b6a9e50a96c2_paginationSmall {
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

._0ba2b6a9e50a96c2_arrow {
		color: var(--text-muted);
		z-index: 2;
}

svg._0ba2b6a9e50a96c2_arrow {
		height: 26px;
		width: 26px;
}

._0ba2b6a9e50a96c2_arrowContainer {
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

._0ba2b6a9e50a96c2_arrow, ._0ba2b6a9e50a96c2_arrowContainer {
		box-sizing: border-box;
		pointer-events: all;
}

._0ba2b6a9e50a96c2_button {
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

._0ba2b6a9e50a96c2_prevButtonContainer {
		left: 6px;
}

._0ba2b6a9e50a96c2_nextButtonContainer {
		right: 6px;
}

._0ba2b6a9e50a96c2_left {
		transform: rotate(-90deg);
}

._0ba2b6a9e50a96c2_right {
		transform: rotate(90deg);
}

._0ba2b6a9e50a96c2_horizontalPaginationItemContainer {
		-webkit-box-align: center;
		-webkit-box-flex: initial;
		align-items: center;
		display: flex;
		flex: initial;
		margin: 0 auto;
		overflow-y: hidden;
}

._0ba2b6a9e50a96c2_dot {
		background-color: #fff;
		border-radius: 2px;
		cursor: pointer;
		height: 8px;
		margin-right: 8px;
		pointer-events: all;
		transform: translateZ(0);
		width: 8px;
}

._0ba2b6a9e50a96c2_dotNormal {
		opacity: 0.2;
}

._0ba2b6a9e50a96c2_dotSelected {
		opacity: 0.6;
}

._0ba2b6a9e50a96c2_dock {
		margin-top: 10px;
		display: flex;
		overflow: hidden;
		flex-wrap: nowrap;
		max-width: 1280px;
}

._0ba2b6a9e50a96c2_dockItem {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: pointer;
		height: 100px;
		padding: 10px;
		width: 90px;
		flex-direction: column;
}

._0ba2b6a9e50a96c2_dockIcon:first-child {
		margin-left: 0;
}

._0ba2b6a9e50a96c2_dockIcon {
		background-size: 100%;
		border-radius: 3px;
		height: 40px;
		margin-bottom: 8px;
		transition: opacity .2s ease-in-out;
		width: 40px;
}

._0ba2b6a9e50a96c2_dockItemText {
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

._0ba2b6a9e50a96c2_dockItemPlay {
		display: none;
		z-index: 9999;
}

._0ba2b6a9e50a96c2_dockItemPlay:disabled, ._0ba2b6a9e50a96c2_dockItemPlay[aria-disabled=true] {
		background-color: var(--green-active, var(--button-positive-background-active)) !important;
}

._0ba2b6a9e50a96c2_dockItem:hover {
		background: var(--background-base-lowest);
}

._0ba2b6a9e50a96c2_dockItem:hover ._0ba2b6a9e50a96c2_dockItemText {
		display: none;
}

._0ba2b6a9e50a96c2_dockItem:hover ._0ba2b6a9e50a96c2_dockItemPlay {
		display: flex;
}

._0ba2b6a9e50a96c2_nowPlayingContainer {
		display: flex;
		margin-top: var(--space-lg);
		gap: var(--space-lg);
}

._0ba2b6a9e50a96c2_nowPlayingColumn {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: calc(50% - (var(--space-lg) / 2))
}

._0ba2b6a9e50a96c2_nowPlayingContainer ._0ba2b6a9e50a96c2_itemCard {
		flex: 1 0 0;
		margin: 16px 16px 0 0;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_card {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
		transform: translateZ(0);
}
		
._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_cardHeader {
		padding: 20px;
		position: relative;
		flex-direction: row;
		background: var(--background-base-lowest);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_header {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_header > ._0ba2b6a9e50a96c2_wrapper {
		display: flex;
		cursor: pointer;
		margin-right: 20px;
		transition: opacity .2s ease;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_nameTag {
		line-height: 17px;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;
		color: var(--text-default);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_username {
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_username:hover {
		text-decoration: underline;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_card:hover ._0ba2b6a9e50a96c2_headerIcon {
		display: none;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_headerActions {
		display: none;
		margin-left: 8px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_card:hover ._0ba2b6a9e50a96c2_headerActions {
		display: flex;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_headerActions > div[aria-expanded="false"] {
		display: none;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_headerActions {
		._0ba2b6a9e50a96c2_button._0ba2b6a9e50a96c2_lookFilled {
				background: var(--control-secondary-background-default);
				border: unset;
				color: var(--white);
				padding: 2px 16px;
				width: unset;
				svg {
						display: none;
				} 
		}
		._0ba2b6a9e50a96c2_button._0ba2b6a9e50a96c2_lookFilled:hover {
				background-color: var(--control-secondary-background-hover) !important;
		}
		._0ba2b6a9e50a96c2_button._0ba2b6a9e50a96c2_lookFilled:active {
				background-color: var(--control-secondary-background-active) !important; 
		}
		._0ba2b6a9e50a96c2_lookFilled._0ba2b6a9e50a96c2_colorPrimary {
				background: unset !important;
				border: unset !important;
		}
		._0ba2b6a9e50a96c2_lookFilled._0ba2b6a9e50a96c2_colorPrimary:hover {
				color: var(--interactive-background-hover);
				svg {
						stroke: var(--interactive-background-hover);
				}
		}
		._0ba2b6a9e50a96c2_lookFilled._0ba2b6a9e50a96c2_colorPrimary:active {
				color: var(--interactive-background-active);
				svg {
						stroke: var(--interactive-background-active);
				}
		}
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_overflowMenu {
		cursor: pointer;
		height: 24px;
		margin-left: 8px;
		transition: opacity .2s linear;
		width: 24px;
		color: var(--interactive-icon-hover);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_overflowMenu:hover {
		color: var(--interactive-icon-default);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_headerIcon {
		border-radius: 4px;
		display: block;
		height: 30px;
		justify-self: end;
		width: 30px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_splashArt {
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

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_server {
		mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
		right: 0;
		left: unset;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_cardBody {
		display: flex;
		padding: 0 20px;
		background: var(--background-mod-strong)
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_section {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_game {
		padding: 20px 0;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_gameBody {
		flex-direction: column;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_activityContainer:last-child:not(:only-child, :nth-child(1 of ._0ba2b6a9e50a96c2_activityContainer)) ._0ba2b6a9e50a96c2_sectionDivider {
		display: none;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_activity {
		flex-direction: row;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_activity:last-child:not(:only-child) {
		margin-top: 20px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_activity ._0ba2b6a9e50a96c2_serviceButtonWrapper {
		gap: 6px;
		display: flex;
		flex-direction: row;
		._0ba2b6a9e50a96c2_sm:not(._0ba2b6a9e50a96c2_hasText) {
				padding: 0;
				width: calc(var(--custom-button-button-sm-height) + 4px);
		}
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_richActivity {
		margin-top: 20px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_activityFeed {
		-webkit-box-flex: 1;
		flex: 1 1 50%;
		min-width: 0;
}

._0ba2b6a9e50a96c2_nowPlayingColumn :is(._0ba2b6a9e50a96c2_gameInfoRich, ._0ba2b6a9e50a96c2_gameNameWrapper) {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_gameInfoRich {
		align-items: center;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_gameInfo {
		margin-left: 20px;
		min-width: 0;
		color: var(--text-default);
		font-weight: 500;
		flex: 1;
}

._0ba2b6a9e50a96c2_nowPlayingColumn :is(._0ba2b6a9e50a96c2_gameName, ._0ba2b6a9e50a96c2_gameNameWrapper, ._0ba2b6a9e50a96c2_streamInfo) {
		overflow: hidden;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_gameName {
		font-size: 16px;
		line-height: 20px;
		margin-right: 10px;
		max-width: fit-content;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_gameName._0ba2b6a9e50a96c2_clickable:hover {
		text-decoration: underline;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_playTime:not(a) {
		color: var(--text-muted);
}
._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_playTime {
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets {
		position: relative;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assetsLargeImageActivityFeed {
		width: 90px;
		height: 90px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assetsSmallImageActivityFeed {
		height: 30px;
		width: 30px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_assetsLargeImage {
		display: block;
		border-radius: 4px; 
		object-fit: cover;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_assetsLargeImageActivityFeedTwitch {
		border-radius: 5px;
		height: 260px;
		mask: linear-gradient(0deg, transparent 10%, #000 80%);
		width: 100%;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets:has(._0ba2b6a9e50a96c2_assetsSmallImage) ._0ba2b6a9e50a96c2_assetsLargeImage {
		mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_richActivity ._0ba2b6a9e50a96c2_assetsSmallImage, ._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_richActivity ._0ba2b6a9e50a96c2_smallEmptyIcon {
		border-radius: 50%;
		position: absolute;
		bottom: -4px;
		right: -4px; 
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_activity ._0ba2b6a9e50a96c2_smallEmptyIcon {
		width: 40px;
		height: 40px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_largeEmptyIcon {
		width: 90px;
		height: 90px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_largeEmptyIcon path {
		transform: scale(3.65) !important;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_richActivity svg._0ba2b6a9e50a96c2_assetsSmallImage {
		border-radius: unset !important;
}   

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_richActivity ._0ba2b6a9e50a96c2_smallEmptyIcon path {
		transform: scale(1.3) !important;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_twitchImageContainer {
		background: var(--background-secondary-alt);
		border-radius: 5px;
		position: relative;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_twitchBackgroundImage {
		display: inline-block;
		min-height: 260px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_twitchImageOverlay {
		bottom: 0;
		left: 0;
		padding: 16px;
		position: absolute;
		right: 0;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_streamName {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
		margin-top: 8px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_assets ._0ba2b6a9e50a96c2_streamGame {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_contentImagesActivityFeed {
		margin-left: 20px;
		color: var(--text-default);
}

._0ba2b6a9e50a96c2_nowPlayingColumn :is(._0ba2b6a9e50a96c2_gameInfo, ._0ba2b6a9e50a96c2_contentImagesActivityFeed) {
		align-self: center;
		display: grid;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_content {
		flex: 1;
		overflow: hidden;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_details {
		font-weight: 600;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._0ba2b6a9e50a96c2_textRow {
		display: block;
		font-size: 14px;
		line-height: 16px;
		margin-bottom: 4px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_content ._0ba2b6a9e50a96c2_bar {
		background-color: var(--opacity-white-24);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_sectionDivider {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 20px 0 20px 0;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSection {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionAssets {
		align-items: center;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionIconWrapper {
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

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionIcon {
		color: var(--header-secondary);
		height: 12px;
		width: 12px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionGuildImage {
		border-radius: 50%;
		mask: url('https://discord.com/assets/a90b040155ee449f.svg');
		mask-size: 100%;
		mask-type: luminance;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSection ._0ba2b6a9e50a96c2_details {
		flex: 1;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionDetails {
		cursor: pointer;
		margin-left: 20px;
		min-width: 0;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionDetails:hover :is(._0ba2b6a9e50a96c2_voiceSectionText, ._0ba2b6a9e50a96c2_voiceSectionSubtext) {
		text-decoration: underline;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionText {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2857142857142858;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSectionSubtext {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3333333333333333;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_userList {
		flex: 0 1 auto;
		justify-content: flex-end;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_voiceSection button {
		flex: 0 1 auto;
		width: auto;
		margin-left: 20px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_actionsActivity ._0ba2b6a9e50a96c2_buttonContainer {
		flex-direction: inherit;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_partyStatusWrapper {
		display: flex;
		gap: 4px;
		align-items: center;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_partyStatusWrapper button {
		flex: 0 1 50%;
		max-height: 24px;
		min-height: 24px;
		width: auto !important;
		justify-self: flex-end;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_partyStatusWrapper ._0ba2b6a9e50a96c2_disabledButtonWrapper {
		flex: 1;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_partyStatusWrapper ._0ba2b6a9e50a96c2_disabledButtonOverlay {
		height: 24px;
		width: 100%;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_partyList {
		display: flex;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_player:first-of-type {
		mask: url(#svg-mask-voice-user-summary-item);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_emptyUser:not(:first-of-type), ._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_player:not(:first-of-type) {
		margin-left: -4px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_emptyUser:not(:last-of-type), ._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_player:not(:last-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_emptyUser, ._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_player {
		width: 16px;
		height: 16px;
		border-radius: 50%;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_emptyUser svg {
		margin-left: 3px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_partyPlayerCount {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3333333333333333;
}

._0ba2b6a9e50a96c2_nowPlaying ._0ba2b6a9e50a96c2_emptyState {
		border: 1px solid;
		border-radius: 5px;
		box-sizing: border-box;
		margin-top: 20px;
		padding: 20px;
		width: 100%;
}

._0ba2b6a9e50a96c2_quickLauncher ._0ba2b6a9e50a96c2_emptyState, ._0ba2b6a9e50a96c2_blacklist._0ba2b6a9e50a96c2_emptyState {
		border-bottom: 1px solid;
		font-size: 14px;
		padding: 20px 0;
		justify-content: flex-start;
		align-items: center;
}

._0ba2b6a9e50a96c2_emptyTitle {
		font-size: 16px;
		line-height: 20px;
		color: var(--text-default);
}

._0ba2b6a9e50a96c2_emptySubtitle {
		font-size: 14px;
		color: var(--text-muted);
}

._0ba2b6a9e50a96c2_themeLight ._0ba2b6a9e50a96c2_nowPlaying ._0ba2b6a9e50a96c2_emptyState {
		background-color: #fff;
		border-color: var(--interactive-background-hover);
}

._0ba2b6a9e50a96c2_themeDark ._0ba2b6a9e50a96c2_nowPlaying ._0ba2b6a9e50a96c2_emptyState {
		background-color: rgba(79, 84, 92, .3);
		border-color: var(--background-mod-strong);
}

._0ba2b6a9e50a96c2_themeLight ._0ba2b6a9e50a96c2_quickLauncher ._0ba2b6a9e50a96c2_emptyState, ._0ba2b6a9e50a96c2_themeLight ._0ba2b6a9e50a96c2_blacklist._0ba2b6a9e50a96c2_emptyState {
		border-color: rgba(220,221,222,.6);
		color: #b9bbbe;
}

._0ba2b6a9e50a96c2_themeDark ._0ba2b6a9e50a96c2_quickLauncher ._0ba2b6a9e50a96c2_emptyState, ._0ba2b6a9e50a96c2_themeDark ._0ba2b6a9e50a96c2_blacklist._0ba2b6a9e50a96c2_emptyState {
		border-color: rgba(47,49,54,.6);
		color: #72767d;
}

._0ba2b6a9e50a96c2_themeLight ._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_sectionDivider {
		border-color: var(--interactive-background-hover);
}

._0ba2b6a9e50a96c2_themeDark ._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_sectionDivider {
		border-color: var(--background-mod-strong);
}

._0ba2b6a9e50a96c2_themeDark ._0ba2b6a9e50a96c2_voiceSectionIconWrapper {
		background-color: var(--primary-800);
}

._0ba2b6a9e50a96c2_themeLight ._0ba2b6a9e50a96c2_voiceSectionIconWrapper {
		background: var(--primary-300);
}

._0ba2b6a9e50a96c2_emptyIcon {
		height: 24px;
		margin-right: 8px;
		width: 24px;
}

._0ba2b6a9e50a96c2_nowPlayingColumn ._0ba2b6a9e50a96c2_tabularNumbers {
		color: var(--text-default) !important;
}

._0ba2b6a9e50a96c2_nowPlayingColumn :is(._0ba2b6a9e50a96c2_actionsActivity, ._0ba2b6a9e50a96c2_customButtons) {
		gap: 8px;
}

._0ba2b6a9e50a96c2_customButtons {
		display: flex;
		flex-direction: column;
}

._0ba2b6a9e50a96c2_blacklist {
		display: flex;
		flex-direction: column;
		gap: 8px;
}

._0ba2b6a9e50a96c2_blacklist ._0ba2b6a9e50a96c2_sectionDivider, ._0ba2b6a9e50a96c2_settingsDivider._0ba2b6a9e50a96c2_sectionDivider {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 4px 0 4px 0;
		border-color: var(--background-mod-strong);
}

._0ba2b6a9e50a96c2_blacklist ._0ba2b6a9e50a96c2_sectionDivider:last-child {
		display: none;
}

._0ba2b6a9e50a96c2_blacklistItem {
		display: flex;
}

._0ba2b6a9e50a96c2_blacklistItem ._0ba2b6a9e50a96c2_blacklistItemIcon {
		border-radius: 8px;
		height: 32px;
		width: 32px;
}

._0ba2b6a9e50a96c2_blacklistItem ._0ba2b6a9e50a96c2_blacklistItemName {
		margin-left: 20px;
		margin-bottom: 0;
		min-width: 0;
		font-weight: 500;
		align-content: center;
		flex: 1;
}

._0ba2b6a9e50a96c2_blacklistItem button {
		flex: 0 1 auto;
		align-self: center;
		width: auto;
		margin-left: 20px;
}

._0ba2b6a9e50a96c2_search {
		padding: 12px;
		margin: 12px 0;
		input::placeholder {
				font-weight: 600;
				font-size: 14px;
				color: var(--text-muted);
		}
		svg {
				path {
						fill: var(--text-muted);
				}
				circle {
						color: var(--text-muted);
				}
				path, circle {
						stroke: var(--text-muted);
						stroke-width: 3px;
				}
		}
}

._0ba2b6a9e50a96c2_cardV2 {
		background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
		border-radius: var(--radius-md);
		outline: 1px solid var(--border-normal);
		outline-offset: -1px;
		box-sizing: border-box;
		background-clip: border-box;
		overflow: hidden;
		transform: translateZ(0);

		._0ba2b6a9e50a96c2_headerActions ._0ba2b6a9e50a96c2_button._0ba2b6a9e50a96c2_lookFilled, ._0ba2b6a9e50a96c2_cardBody button {
				color: var(--white);
				background: var(--opacity-white-24);
				&:hover {
						background: var(--opacity-white-36);
				}
				&:active {
						background: var(--opacity-white-32);
				}
		}

		._0ba2b6a9e50a96c2_cardHeader {
				padding: var(--space-lg);
				position: relative;
				flex-direction: row;
				background: unset;
		}
		._0ba2b6a9e50a96c2_nameTag {
				color: var(--white);
		}
		._0ba2b6a9e50a96c2_splashArt, ._0ba2b6a9e50a96c2_server {
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
				._0ba2b6a9e50a96c2_headerIcon {
						display: none;
				}
				._0ba2b6a9e50a96c2_headerActions {
						display: flex;
				}
		}
		._0ba2b6a9e50a96c2_cardBody {
				display: flex;
				gap: var(--space-lg);
				padding: 0 var(--space-lg) var(--space-lg);
				background: unset;
		}
		._0ba2b6a9e50a96c2_section {
				background: var(--background-mod-normal);
				border-radius: var(--radius-sm);
				padding: var(--space-sm);
		}
		._0ba2b6a9e50a96c2_game {
				padding: 0;
		}
		._0ba2b6a9e50a96c2_sectionDivider {
				border-color: var(--opacity-white-12) !important;
				border-width: 1px;
				margin: 12px 0 12px 0;
		}
		._0ba2b6a9e50a96c2_voiceSectionText {
				color: var(--white);
		}
		._0ba2b6a9e50a96c2_headerIcon, ._0ba2b6a9e50a96c2_gameIcon, ._0ba2b6a9e50a96c2_assetsLargeImage._0ba2b6a9e50a96c2_assetsLargeImage {
				border-radius: var(--radius-sm);
		}
		._0ba2b6a9e50a96c2_gameInfo {
				color: var(--white);
		}
		._0ba2b6a9e50a96c2_playTime:not(a), ._0ba2b6a9e50a96c2_voiceSectionSubtext {
				color: var(--app-message-embed-secondary-text) !important;
		}
		._0ba2b6a9e50a96c2_serviceButtonWrapper {
				gap: 8px !important;
		}
		._0ba2b6a9e50a96c2_contentImagesActivityFeed {
				color: var(--white);
		}
		._0ba2b6a9e50a96c2_textRow {
				font-size: 16px;
				line-height: 18px;
		}
		._0ba2b6a9e50a96c2_state {
				color: var(--app-message-embed-secondary-text);
				font-size: 14px;
				line-height: 16px;
		}
		._0ba2b6a9e50a96c2_tabularNumbers {
				color: var(--app-message-embed-secondary-text) !important;
		}
		._0ba2b6a9e50a96c2_bar {
				background-color: var(--opacity-white-24);
		}
		._0ba2b6a9e50a96c2_progress {
				background-color: var(--white);
		}
		._0ba2b6a9e50a96c2_activity:last-child:not(:only-child) {
				margin-top: 12px;
		}
}`;
_loadStyle("ActivityFeed.module.css", css);
const modules_7e65654a = {
	"activityFeed": "_0ba2b6a9e50a96c2_activityFeed",
	"scrollerBase": "_0ba2b6a9e50a96c2_scrollerBase",
	"centerContainer": "_0ba2b6a9e50a96c2_centerContainer",
	"title": "_0ba2b6a9e50a96c2_title",
	"titleWrapper": "_0ba2b6a9e50a96c2_titleWrapper",
	"iconWrapper": "_0ba2b6a9e50a96c2_iconWrapper",
	"headerBar": "_0ba2b6a9e50a96c2_headerBar",
	"headerContainer": "_0ba2b6a9e50a96c2_headerContainer",
	"headerText": "_0ba2b6a9e50a96c2_headerText",
	"feedCarousel": "_0ba2b6a9e50a96c2_feedCarousel",
	"carousel": "_0ba2b6a9e50a96c2_carousel",
	"article": "_0ba2b6a9e50a96c2_article",
	"background": "_0ba2b6a9e50a96c2_background",
	"backgroundImage": "_0ba2b6a9e50a96c2_backgroundImage",
	"feedOverflowMenu": "_0ba2b6a9e50a96c2_feedOverflowMenu",
	"applicationArea": "_0ba2b6a9e50a96c2_applicationArea",
	"details": "_0ba2b6a9e50a96c2_details",
	"titleStandard": "_0ba2b6a9e50a96c2_titleStandard",
	"description": "_0ba2b6a9e50a96c2_description",
	"sharedFilePreviewYouTubeVideo": "_0ba2b6a9e50a96c2_sharedFilePreviewYouTubeVideo",
	"timestamp": "_0ba2b6a9e50a96c2_timestamp",
	"gameIcon": "_0ba2b6a9e50a96c2_gameIcon",
	"pagination": "_0ba2b6a9e50a96c2_pagination",
	"verticalPaginationItemContainer": "_0ba2b6a9e50a96c2_verticalPaginationItemContainer",
	"scrollerWrap": "_0ba2b6a9e50a96c2_scrollerWrap",
	"scroller": "_0ba2b6a9e50a96c2_scroller",
	"paginationItem": "_0ba2b6a9e50a96c2_paginationItem",
	"splashArt": "_0ba2b6a9e50a96c2_splashArt",
	"paginationSubtitle": "_0ba2b6a9e50a96c2_paginationSubtitle",
	"paginationTitle": "_0ba2b6a9e50a96c2_paginationTitle",
	"paginationText": "_0ba2b6a9e50a96c2_paginationText",
	"paginationContent": "_0ba2b6a9e50a96c2_paginationContent",
	"selectedPage": "_0ba2b6a9e50a96c2_selectedPage",
	"smallCarousel": "_0ba2b6a9e50a96c2_smallCarousel",
	"titleRowSimple": "_0ba2b6a9e50a96c2_titleRowSimple",
	"paginationSmall": "_0ba2b6a9e50a96c2_paginationSmall",
	"arrow": "_0ba2b6a9e50a96c2_arrow",
	"arrowContainer": "_0ba2b6a9e50a96c2_arrowContainer",
	"button": "_0ba2b6a9e50a96c2_button",
	"prevButtonContainer": "_0ba2b6a9e50a96c2_prevButtonContainer",
	"nextButtonContainer": "_0ba2b6a9e50a96c2_nextButtonContainer",
	"left": "_0ba2b6a9e50a96c2_left",
	"right": "_0ba2b6a9e50a96c2_right",
	"horizontalPaginationItemContainer": "_0ba2b6a9e50a96c2_horizontalPaginationItemContainer",
	"dot": "_0ba2b6a9e50a96c2_dot",
	"dotNormal": "_0ba2b6a9e50a96c2_dotNormal",
	"dotSelected": "_0ba2b6a9e50a96c2_dotSelected",
	"dock": "_0ba2b6a9e50a96c2_dock",
	"dockItem": "_0ba2b6a9e50a96c2_dockItem",
	"dockIcon": "_0ba2b6a9e50a96c2_dockIcon",
	"dockItemText": "_0ba2b6a9e50a96c2_dockItemText",
	"dockItemPlay": "_0ba2b6a9e50a96c2_dockItemPlay",
	"nowPlayingContainer": "_0ba2b6a9e50a96c2_nowPlayingContainer",
	"nowPlayingColumn": "_0ba2b6a9e50a96c2_nowPlayingColumn",
	"itemCard": "_0ba2b6a9e50a96c2_itemCard",
	"card": "_0ba2b6a9e50a96c2_card",
	"cardHeader": "_0ba2b6a9e50a96c2_cardHeader",
	"header": "_0ba2b6a9e50a96c2_header",
	"wrapper": "_0ba2b6a9e50a96c2_wrapper",
	"nameTag": "_0ba2b6a9e50a96c2_nameTag",
	"username": "_0ba2b6a9e50a96c2_username",
	"headerIcon": "_0ba2b6a9e50a96c2_headerIcon",
	"headerActions": "_0ba2b6a9e50a96c2_headerActions",
	"lookFilled": "_0ba2b6a9e50a96c2_lookFilled",
	"colorPrimary": "_0ba2b6a9e50a96c2_colorPrimary",
	"overflowMenu": "_0ba2b6a9e50a96c2_overflowMenu",
	"server": "_0ba2b6a9e50a96c2_server",
	"cardBody": "_0ba2b6a9e50a96c2_cardBody",
	"section": "_0ba2b6a9e50a96c2_section",
	"game": "_0ba2b6a9e50a96c2_game",
	"gameBody": "_0ba2b6a9e50a96c2_gameBody",
	"activityContainer": "_0ba2b6a9e50a96c2_activityContainer",
	"sectionDivider": "_0ba2b6a9e50a96c2_sectionDivider",
	"activity": "_0ba2b6a9e50a96c2_activity",
	"serviceButtonWrapper": "_0ba2b6a9e50a96c2_serviceButtonWrapper",
	"sm": "_0ba2b6a9e50a96c2_sm",
	"hasText": "_0ba2b6a9e50a96c2_hasText",
	"richActivity": "_0ba2b6a9e50a96c2_richActivity",
	"gameInfoRich": "_0ba2b6a9e50a96c2_gameInfoRich",
	"gameNameWrapper": "_0ba2b6a9e50a96c2_gameNameWrapper",
	"gameInfo": "_0ba2b6a9e50a96c2_gameInfo",
	"gameName": "_0ba2b6a9e50a96c2_gameName",
	"streamInfo": "_0ba2b6a9e50a96c2_streamInfo",
	"clickable": "_0ba2b6a9e50a96c2_clickable",
	"playTime": "_0ba2b6a9e50a96c2_playTime",
	"assets": "_0ba2b6a9e50a96c2_assets",
	"assetsLargeImageActivityFeed": "_0ba2b6a9e50a96c2_assetsLargeImageActivityFeed",
	"assetsSmallImageActivityFeed": "_0ba2b6a9e50a96c2_assetsSmallImageActivityFeed",
	"assetsLargeImage": "_0ba2b6a9e50a96c2_assetsLargeImage",
	"assetsLargeImageActivityFeedTwitch": "_0ba2b6a9e50a96c2_assetsLargeImageActivityFeedTwitch",
	"assetsSmallImage": "_0ba2b6a9e50a96c2_assetsSmallImage",
	"smallEmptyIcon": "_0ba2b6a9e50a96c2_smallEmptyIcon",
	"largeEmptyIcon": "_0ba2b6a9e50a96c2_largeEmptyIcon",
	"twitchImageContainer": "_0ba2b6a9e50a96c2_twitchImageContainer",
	"twitchBackgroundImage": "_0ba2b6a9e50a96c2_twitchBackgroundImage",
	"twitchImageOverlay": "_0ba2b6a9e50a96c2_twitchImageOverlay",
	"streamName": "_0ba2b6a9e50a96c2_streamName",
	"streamGame": "_0ba2b6a9e50a96c2_streamGame",
	"contentImagesActivityFeed": "_0ba2b6a9e50a96c2_contentImagesActivityFeed",
	"content": "_0ba2b6a9e50a96c2_content",
	"ellipsis": "_0ba2b6a9e50a96c2_ellipsis",
	"textRow": "_0ba2b6a9e50a96c2_textRow",
	"bar": "_0ba2b6a9e50a96c2_bar",
	"voiceSection": "_0ba2b6a9e50a96c2_voiceSection",
	"voiceSectionAssets": "_0ba2b6a9e50a96c2_voiceSectionAssets",
	"voiceSectionIconWrapper": "_0ba2b6a9e50a96c2_voiceSectionIconWrapper",
	"voiceSectionIcon": "_0ba2b6a9e50a96c2_voiceSectionIcon",
	"voiceSectionGuildImage": "_0ba2b6a9e50a96c2_voiceSectionGuildImage",
	"voiceSectionDetails": "_0ba2b6a9e50a96c2_voiceSectionDetails",
	"voiceSectionText": "_0ba2b6a9e50a96c2_voiceSectionText",
	"voiceSectionSubtext": "_0ba2b6a9e50a96c2_voiceSectionSubtext",
	"userList": "_0ba2b6a9e50a96c2_userList",
	"actionsActivity": "_0ba2b6a9e50a96c2_actionsActivity",
	"buttonContainer": "_0ba2b6a9e50a96c2_buttonContainer",
	"partyStatusWrapper": "_0ba2b6a9e50a96c2_partyStatusWrapper",
	"disabledButtonWrapper": "_0ba2b6a9e50a96c2_disabledButtonWrapper",
	"disabledButtonOverlay": "_0ba2b6a9e50a96c2_disabledButtonOverlay",
	"partyList": "_0ba2b6a9e50a96c2_partyList",
	"player": "_0ba2b6a9e50a96c2_player",
	"emptyUser": "_0ba2b6a9e50a96c2_emptyUser",
	"partyPlayerCount": "_0ba2b6a9e50a96c2_partyPlayerCount",
	"nowPlaying": "_0ba2b6a9e50a96c2_nowPlaying",
	"emptyState": "_0ba2b6a9e50a96c2_emptyState",
	"quickLauncher": "_0ba2b6a9e50a96c2_quickLauncher",
	"blacklist": "_0ba2b6a9e50a96c2_blacklist",
	"emptyTitle": "_0ba2b6a9e50a96c2_emptyTitle",
	"emptySubtitle": "_0ba2b6a9e50a96c2_emptySubtitle",
	"theme-light": "_0ba2b6a9e50a96c2_themeLight",
	"theme-dark": "_0ba2b6a9e50a96c2_themeDark",
	"emptyIcon": "_0ba2b6a9e50a96c2_emptyIcon",
	"tabularNumbers": "_0ba2b6a9e50a96c2_tabularNumbers",
	"customButtons": "_0ba2b6a9e50a96c2_customButtons",
	"settingsDivider": "_0ba2b6a9e50a96c2_settingsDivider",
	"blacklistItem": "_0ba2b6a9e50a96c2_blacklistItem",
	"blacklistItemIcon": "_0ba2b6a9e50a96c2_blacklistItemIcon",
	"blacklistItemName": "_0ba2b6a9e50a96c2_blacklistItemName",
	"search": "_0ba2b6a9e50a96c2_search",
	"cardV2": "_0ba2b6a9e50a96c2_cardV2",
	"state": "_0ba2b6a9e50a96c2_state",
	"progress": "_0ba2b6a9e50a96c2_progress"
};

// activity_feed/common/components/SectionHeader.jsx
function SectionHeader({ label }) {
	return BdApi.React.createElement("div", { className: `${modules_7e65654a.headerContainer} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: modules_7e65654a.headerText }, label));
}

// activity_feed/quick_launcher/launcher.tsx
function LauncherGameBuilder({ game, runningGames }) {
	const [shouldDisable, setDisable] = react.useState(false);
	setTimeout(() => setDisable(false), 1e4);
	const disableCheck = react.useMemo(() => ~runningGames.findIndex((m) => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
	return BdApi.React.createElement("div", { className: `${modules_7e65654a.dockItem} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, BdApi.React.createElement("div", { className: modules_7e65654a.dockIcon, style: { backgroundImage: `url(${"https://cdn.discordapp.com/app-icons/" + GameStore.getGameByName(game.name).id + "/" + GameStore.getGameByName(game.name).icon + ".webp"})` } }), BdApi.React.createElement("div", { className: modules_7e65654a.dockItemText }, game.name), BdApi.React.createElement(
		"button",
		{
			className: `${modules_7e65654a.dockItemPlay} ${Common.ButtonClasses.button} ${Common.ButtonClasses.lookFilled} ${Common.ButtonClasses.colorGreen} ${Common.ButtonClasses.sizeSmall} ${Common.ButtonClasses.fullWidth} ${Common.ButtonClasses.grow}`,
			disabled: disableCheck,
			onClick: () => {
				setDisable(true);
				shell.openExternal(game.exePath);
			}
		},
		BdApi.React.createElement("div", { className: `${Common.ButtonClasses.contents}` }, "Play")
	));
}
function QuickLauncherBuilder(props) {
	const runningGames = useStateFromStores([RunningGameStore], () => RunningGameStore.getRunningGames());
	const gameList = useStateFromStores([RunningGameStore], () => RunningGameStore.getGamesSeen());
	const _gameList = gameList.filter((game) => GameStore.getGameByName(game.name)).slice(0, 12);
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Quick Launcher" }), gameList.length === 0 ? BdApi.React.createElement("div", { className: `${modules_7e65654a.dock} ${modules_7e65654a.emptyState}` }, BdApi.React.createElement("svg", { className: modules_7e65654a.emptyIcon, name: "OpenExternal", width: 16, height: 16, viewBox: "0 0 24 24" }, BdApi.React.createElement("path", { fill: "currentColor", transform: "translate(3, 4)", d: "M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" })), BdApi.React.createElement("div", { className: modules_7e65654a.emptyText }, "Discord can quickly launch most games you\u2019ve recently played on this computer. Go ahead and launch one to see it appear here!")) : BdApi.React.createElement("div", { className: modules_7e65654a.dock }, _gameList.map((game) => BdApi.React.createElement(LauncherGameBuilder, { game, runningGames }))));
}

// activity_feed/common/methods/common.js
function chunkArray(cards, num) {
	let chunkLength = Math.max(cards.length / num, 1);
	const chunks = [];
	for (let i = 0; i < num; i++) {
		if (chunkLength * (i + 1) <= cards.length) chunks.push(cards.slice(chunkLength * i, chunkLength * (i + 1)));
	}
	return chunks.reverse();
}
function GradGen(check, isSpotify, activity, game, voice, stream) {
	let input;
	switch (true) {
		case !!check.streaming:
			input = "https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg";
			break;
		case !!isSpotify:
			input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
			break;
		case !!activity?.name.includes("YouTube Music"):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case !!game?.icon:
			input = `https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon}.png?size=1024&keep_aspect_ratio=true`;
			break;
		case !!activity?.platform?.includes("xbox"):
			input = "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png";
			break;
		case (!!activity?.assets && activity?.assets.large_image?.includes("external")):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case !!activity:
			input = `https://cdn.discordapp.com/app-assets/${activity?.application_id}/${activity?.assets?.large_image}.png`;
			break;
		case !!voice[0]?.guild:
			input = `https://cdn.discordapp.com/icons/${voice[0]?.guild.id}/${voice[0]?.guild.icon}.png?size=1024`;
			break;
		case (!!voice && stream):
			input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`;
			break;
	}
	return Common.GradientComponent(input || null);
}
function activityCheck({ activities, spotify }) {
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
		if (activities[i].activity.type == 4) {
			pass.custom = 1;
		}
		if (activities[i].activity.type == 0) {
			pass.playing = 1;
		}
		if (activities[i]?.activity.platform?.includes("xbox")) {
			pass.xbox = 1;
		}
		if (activities[i]?.activity.platform?.includes("playstation") || activities[i]?.platform?.includes("ps5")) {
			pass.playstation = 1;
		}
		if (activities[i].activity.type == 1) {
			pass.streaming = 1;
		}
		if (activities[i].activity.type == 2) {
			pass.listening = 1;
		}
		if (spotify) {
			pass.spotify = 1;
		}
		if (activities[i].activity.type == 3) {
			pass.watching = 1;
		}
		if (activities[i].activity.type == 5) {
			pass.competing = 1;
		}
	}
	return pass;
}

// activity_feed/now_playing/cardBuilder.tsx
function NowPlayingCardBuilder({ card, v2Enabled }) {
	card.party.priorityMembers[0].user;
	card.party.priorityMembers[0].status;
	const activities = card.party.currentActivities;
	const currentGame = card.party.currentActivities[0]?.game;
	const voice = card.party.voiceChannels;
	const streams = card.party.applicationStreams;
	const isSpotify = card.party.isSpotifyActivity;
	const filterCheck = activityCheck({ activities, spotify: isSpotify });
	const cardGrad = GradGen(filterCheck, isSpotify, activities[0]?.activity, currentGame, voice, streams[0]?.stream);
	return BdApi.React.createElement("div", { className: v2Enabled ? modules_7e65654a.cardV2 : modules_7e65654a.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } });
}

// activity_feed/now_playing/baseBuilder.tsx
function NowPlayingColumnBuilder({ nowPlayingCards }) {
	return nowPlayingCards.map((card) => [
		BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") }),
		betterdiscord.Data.load("cardTypeDebug") && BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: false })
	]);
}
function NowPlayingBuilder(props) {
	Common.FluxDispatcher.dispatch({ type: "NOW_PLAYING_MOUNTED" });
	const nowPlayingCards = useStateFromStores([NowPlayingViewStore], () => NowPlayingViewStore.nowPlayingCards);
	const cardColumns = chunkArray(nowPlayingCards, 2);
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Now Playing" }), nowPlayingCards.length === 0 ? BdApi.React.createElement("div", { className: modules_7e65654a.emptyState }, BdApi.React.createElement("div", { className: modules_7e65654a.emptyTitle }, "Nobody is playing anything right now..."), BdApi.React.createElement("div", { className: modules_7e65654a.emptySubtitle }, "When someone starts playing a game we'll show it here!")) : BdApi.React.createElement("div", { className: modules_7e65654a.nowPlayingContainer }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: modules_7e65654a.nowPlayingColumn }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column })))));
}

// activity_feed/base.tsx
function Scroller({ children, padding }) {
	return BdApi.React.createElement("div", { className: modules_7e65654a.scrollerBase, style: { overflow: "hidden scroll", paddingRight: `${padding}px` || "0px" } }, children);
}
function TabBaseBuilder() {
	document.title = "Activity";
	const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"];
	return BdApi.React.createElement("div", { className: modules_7e65654a.activityFeed }, BdApi.React.createElement(Common.HeaderBar, { className: modules_7e65654a.headerBar, "aria-label": "Activity" }, BdApi.React.createElement("div", { className: modules_7e65654a.iconWrapper }, BdApi.React.createElement("svg", { className: Common.UpperIconClasses.icon, style: { width: 24, height: 24 }, viewBox: "0 0 24 24", fill: "none" }, BdApi.React.createElement("path", { d: ControllerIcon, fill: "var(--channel-icon)" }))), BdApi.React.createElement("div", { className: modules_7e65654a.titleWrapper }, BdApi.React.createElement("div", { className: modules_7e65654a.title }, "Activity"))), BdApi.React.createElement(Scroller, null, BdApi.React.createElement("div", { className: modules_7e65654a.centerContainer }, BdApi.React.createElement(QuickLauncherBuilder, { className: modules_7e65654a.quickLauncher, style: { position: "relative", padding: "0 20px 0 20px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: modules_7e65654a.nowPlaying, style: { position: "relative", padding: "0 20px 20px 20px" } }), BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))));
}

// settings/builder.tsx
function SettingsPanelBuilder() {
	return;
}

// index.ts
function useSelectedState() {
	return useLocation().pathname.startsWith("/activity-feed");
}
function NavigatorButton() {
	return react.createElement(
		Common.LinkButton,
		{
			selected: useSelectedState(),
			route: "/activity-feed",
			text: "Activity",
			icon: () => {
				return react.createElement(
					"svg",
					{ style: { width: "20", height: "20" }, viewBox: "0 0 20 20", fill: "none" },
					react.createElement("path", { d: ControllerIcon, fill: "var(--channel-icon)", transform: "scale(0.90)" })
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
		betterdiscord.DOM.addStyle("activityPanelCSS", css);
		betterdiscord.Patcher.after(Common.DMSidebar, "Z", (that, [props], res) => {
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
		betterdiscord.Patcher.after(Common.RootSectionModule, "buildLayout", (that, [props], res) => {
			const section = betterdiscord.Utils.findInTree(res, (tree) => Object.values(tree).includes("activity_section"), { walkable: ["props", "children"] });
			betterdiscord.Patcher.after(section, "buildLayout", (that2, [props2], res2) => {
				if (!betterdiscord.Utils.findInTree(res2, (tree) => Object.values(tree).includes("activity_feed_sidebar_item", { walkable: ["props", "children"] }))) {
					res2.push(sidebarItem);
				}
				return res2;
			});
		});
		function fu() {
			const appI = betterdiscord.ReactUtils.getOwnerInstance(document.querySelector("div[class$=-app] > div[class$=-app]"), {
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
					return react.createElement(Common.FormSwitch, {
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
			})
		];
	}
}

module.exports = ActivityFeed;

/*@end@*/