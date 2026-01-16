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
function styles() {
	return _styles;
}

// activity_feed/ActivityFeed.module.css
const css$2 = `
._6eb0556b6899d715_activityFeed {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-border-frame);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

._6eb0556b6899d715_scrollerBase {
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

._6eb0556b6899d715_centerContainer {
		display: flex;
		flex-direction: column;
		width: 1280px;
		max-width: 100%;
		min-width: 480px;
		margin: 0 auto;
}

._6eb0556b6899d715_title {
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

._6eb0556b6899d715_titleWrapper {
		flex: 0 0 auto;
		margin: 0 8px 0 0;
		min-width: auto;
}

._6eb0556b6899d715_iconWrapper {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: var(--space-32);
		justify-content: center;
		margin: 0;
		position: relative;
		width: var(--space-32);
}

._6eb0556b6899d715_headerBar {
		height: calc(var(--custom-channel-header-height) - 1px);
		min-height: calc(var(--custom-channel-header-height) - 1px);
}

._6eb0556b6899d715_headerContainer {
		flex-direction: row;
}

._6eb0556b6899d715_headerText {
		display: flex;
		flex: 1;
		font-size: 18px;
		font-weight: 500;
		line-height: 22px;
		margin-top: 20px;
		width: 100%;
		color: var(--text-default);
}

._6eb0556b6899d715_feedCarousel {
		display: flex;
		position: relative;
}

._6eb0556b6899d715_carousel {
		background-color: var(--background-secondary-alt);
		border-radius: 5px;
		flex: 1 1 75%;
		min-height: 388px;
		margin-right: 20px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

._6eb0556b6899d715_article {
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

._6eb0556b6899d715_background {
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 7.5%;
		mask: linear-gradient(0deg, transparent, #000);
		min-width: 300px;
		background-position: top;
}

._6eb0556b6899d715_backgroundImage {
		background-position: top;
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 0;
}

._6eb0556b6899d715_background, ._6eb0556b6899d715_backgroundImage {
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

._6eb0556b6899d715_feedOverflowMenu {
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 12px;
}

._6eb0556b6899d715_applicationArea {
		color: var(--text-default);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
}

._6eb0556b6899d715_details {
		position: relative;
}

._6eb0556b6899d715_titleStandard {
		margin-top: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24px;
		line-height: 28px;
}

._6eb0556b6899d715_title {
		color: var(--header-primary);
		display: block;
		font-weight: 500;
}

._6eb0556b6899d715_description {
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
		._6eb0556b6899d715_sharedFilePreviewYouTubeVideo {
				display: none;
		}
}

._6eb0556b6899d715_timestamp {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

._6eb0556b6899d715_gameIcon {
		position: relative;
		pointer-events: auto;
		cursor: pointer;
		height: 40px;
		width: 40px;
		flex-shrink: 0;
		border-radius: 3px;
}

._6eb0556b6899d715_pagination {
		-webkit-box-flex: 1;
		flex: 1 1 25%;
		min-width: 0;
}

._6eb0556b6899d715_verticalPaginationItemContainer {
		margin: 0;
		overflow: hidden;
}

._6eb0556b6899d715_scrollerWrap {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
		height: 100%;
		min-height: 1px;
		position: relative;
}

._6eb0556b6899d715_scroller {
		-webkit-box-flex: 1;
		contain: layout;
		flex: 1;
		min-height: 1px;
}
		
._6eb0556b6899d715_paginationItem, ._6eb0556b6899d715_paginationItem:before {
		transition: all .2s ease;
}

._6eb0556b6899d715_paginationItem:first-child {
		margin-top: 0;
}

._6eb0556b6899d715_paginationItem {
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

._6eb0556b6899d715_paginationItem:before {
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

._6eb0556b6899d715_paginationItem:after {
		background-blend-mode: color;
		border-radius: 5px;
		bottom: 0;
		content: "";
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

._6eb0556b6899d715_splashArt {
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

._6eb0556b6899d715_paginationSubtitle, ._6eb0556b6899d715_paginationTitle {
		font-weight: 600;
}

._6eb0556b6899d715_paginationText {
		overflow: hidden;
}

._6eb0556b6899d715_paginationContent {
		overflow: hidden;
		position: relative;
		z-index: 1;
}

._6eb0556b6899d715_paginationTitle {
		color: var(--header-primary);
		font-size: 16px;
		line-height: 1.25;
		max-height: 40px;
}

._6eb0556b6899d715_paginationSubtitle {
		color: var(--text-muted);
		font-size: 12px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._6eb0556b6899d715_selectedPage {
		background: var(--background-surface-higher);
		cursor: default;
}

._6eb0556b6899d715_selectedPage:before {
		transform: translateY(-50%) translateX(0);
}

._6eb0556b6899d715_selectedPage ._6eb0556b6899d715_splashArt {
		filter: grayscale(0);
}

._6eb0556b6899d715_smallCarousel {
		-webkit-box-flex: 1;
		border-radius: 5px;
		flex: 1;
		height: 220px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

._6eb0556b6899d715_titleRowSimple {
		-webkit-box-align: center;
		-webkit-box-pack: justify;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
}

._6eb0556b6899d715_paginationSmall {
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

._6eb0556b6899d715_arrow {
		color: var(--text-muted);
		z-index: 2;
}

svg._6eb0556b6899d715_arrow {
		height: 26px;
		width: 26px;
}

._6eb0556b6899d715_arrowContainer {
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

._6eb0556b6899d715_arrow, ._6eb0556b6899d715_arrowContainer {
		box-sizing: border-box;
		pointer-events: all;
}

._6eb0556b6899d715_button {
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

._6eb0556b6899d715_prevButtonContainer {
		left: 6px;
}

._6eb0556b6899d715_nextButtonContainer {
		right: 6px;
}

._6eb0556b6899d715_left {
		transform: rotate(-90deg);
}

._6eb0556b6899d715_right {
		transform: rotate(90deg);
}

._6eb0556b6899d715_horizontalPaginationItemContainer {
		-webkit-box-align: center;
		-webkit-box-flex: initial;
		align-items: center;
		display: flex;
		flex: initial;
		margin: 0 auto;
		overflow-y: hidden;
}

._6eb0556b6899d715_dot {
		background-color: #fff;
		border-radius: 2px;
		cursor: pointer;
		height: 8px;
		margin-right: 8px;
		pointer-events: all;
		transform: translateZ(0);
		width: 8px;
}

._6eb0556b6899d715_dotNormal {
		opacity: 0.2;
}

._6eb0556b6899d715_dotSelected {
		opacity: 0.6;
}

._6eb0556b6899d715_emptyTitle {
		font-size: 16px;
		line-height: 20px;
		color: var(--text-default);
}

._6eb0556b6899d715_emptySubtitle {
		font-size: 14px;
		color: var(--text-muted);
}`;
_loadStyle("ActivityFeed.module.css", css$2);
const modules_7e65654a = {
	"activityFeed": "_6eb0556b6899d715_activityFeed",
	"scrollerBase": "_6eb0556b6899d715_scrollerBase",
	"centerContainer": "_6eb0556b6899d715_centerContainer",
	"title": "_6eb0556b6899d715_title",
	"titleWrapper": "_6eb0556b6899d715_titleWrapper",
	"iconWrapper": "_6eb0556b6899d715_iconWrapper",
	"headerBar": "_6eb0556b6899d715_headerBar",
	"headerContainer": "_6eb0556b6899d715_headerContainer",
	"headerText": "_6eb0556b6899d715_headerText",
	"feedCarousel": "_6eb0556b6899d715_feedCarousel",
	"carousel": "_6eb0556b6899d715_carousel",
	"article": "_6eb0556b6899d715_article",
	"background": "_6eb0556b6899d715_background",
	"backgroundImage": "_6eb0556b6899d715_backgroundImage",
	"feedOverflowMenu": "_6eb0556b6899d715_feedOverflowMenu",
	"applicationArea": "_6eb0556b6899d715_applicationArea",
	"details": "_6eb0556b6899d715_details",
	"titleStandard": "_6eb0556b6899d715_titleStandard",
	"description": "_6eb0556b6899d715_description",
	"sharedFilePreviewYouTubeVideo": "_6eb0556b6899d715_sharedFilePreviewYouTubeVideo",
	"timestamp": "_6eb0556b6899d715_timestamp",
	"gameIcon": "_6eb0556b6899d715_gameIcon",
	"pagination": "_6eb0556b6899d715_pagination",
	"verticalPaginationItemContainer": "_6eb0556b6899d715_verticalPaginationItemContainer",
	"scrollerWrap": "_6eb0556b6899d715_scrollerWrap",
	"scroller": "_6eb0556b6899d715_scroller",
	"paginationItem": "_6eb0556b6899d715_paginationItem",
	"splashArt": "_6eb0556b6899d715_splashArt",
	"paginationSubtitle": "_6eb0556b6899d715_paginationSubtitle",
	"paginationTitle": "_6eb0556b6899d715_paginationTitle",
	"paginationText": "_6eb0556b6899d715_paginationText",
	"paginationContent": "_6eb0556b6899d715_paginationContent",
	"selectedPage": "_6eb0556b6899d715_selectedPage",
	"smallCarousel": "_6eb0556b6899d715_smallCarousel",
	"titleRowSimple": "_6eb0556b6899d715_titleRowSimple",
	"paginationSmall": "_6eb0556b6899d715_paginationSmall",
	"arrow": "_6eb0556b6899d715_arrow",
	"arrowContainer": "_6eb0556b6899d715_arrowContainer",
	"button": "_6eb0556b6899d715_button",
	"prevButtonContainer": "_6eb0556b6899d715_prevButtonContainer",
	"nextButtonContainer": "_6eb0556b6899d715_nextButtonContainer",
	"left": "_6eb0556b6899d715_left",
	"right": "_6eb0556b6899d715_right",
	"horizontalPaginationItemContainer": "_6eb0556b6899d715_horizontalPaginationItemContainer",
	"dot": "_6eb0556b6899d715_dot",
	"dotNormal": "_6eb0556b6899d715_dotNormal",
	"dotSelected": "_6eb0556b6899d715_dotSelected",
	"emptyTitle": "_6eb0556b6899d715_emptyTitle",
	"emptySubtitle": "_6eb0556b6899d715_emptySubtitle"
};
const MainClasses = modules_7e65654a;

// activity_feed/components/common/components/SectionHeader.jsx
function SectionHeader({ label }) {
	return BdApi.React.createElement("div", { className: `${MainClasses.headerContainer} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: MainClasses.headerText }, label));
}

// activity_feed/components/quick_launcher/QuickLauncher.module.css
const css$1 = `
._8e586c23073d00b5_quickLauncher {
		display: block;
}

._8e586c23073d00b5_dock {
		margin-top: 10px;
		display: flex;
		overflow: hidden;
		flex-wrap: nowrap;
		max-width: 1280px;
}

._8e586c23073d00b5_dockItem {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: pointer;
		height: 100px;
		padding: 10px;
		width: 90px;
		flex-direction: column;
}

._8e586c23073d00b5_dockIcon:first-child {
		margin-left: 0;
}

._8e586c23073d00b5_dockIcon {
		background-size: 100%;
		border-radius: 3px;
		height: 40px;
		margin-bottom: 8px;
		transition: opacity .2s ease-in-out;
		width: 40px;
}

._8e586c23073d00b5_dockItemText {
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

._8e586c23073d00b5_dockItemPlay {
		display: none;
		z-index: 9999;
}

._8e586c23073d00b5_dockItemPlay:disabled, ._8e586c23073d00b5_dockItemPlay[aria-disabled=true] {
		background-color: var(--green-active, var(--button-positive-background-active)) !important;
}

._8e586c23073d00b5_dockItem:hover {
		background: var(--background-base-lowest);
}

._8e586c23073d00b5_dockItem:hover ._8e586c23073d00b5_dockItemText {
		display: none;
}

._8e586c23073d00b5_dockItem:hover ._8e586c23073d00b5_dockItemPlay {
		display: flex;
}

._8e586c23073d00b5_emptyIcon {
		height: 24px;
		margin-right: 8px;
		width: 24px;
}`;
_loadStyle("QuickLauncher.module.css", css$1);
const modules_1116a9ae = {
	"quickLauncher": "_8e586c23073d00b5_quickLauncher",
	"dock": "_8e586c23073d00b5_dock",
	"dockItem": "_8e586c23073d00b5_dockItem",
	"dockIcon": "_8e586c23073d00b5_dockIcon",
	"dockItemText": "_8e586c23073d00b5_dockItemText",
	"dockItemPlay": "_8e586c23073d00b5_dockItemPlay",
	"emptyIcon": "_8e586c23073d00b5_emptyIcon"
};
const QuickLauncherClasses = modules_1116a9ae;

// activity_feed/components/quick_launcher/launcher.tsx
function LauncherGameBuilder({ game, runningGames }) {
	const [shouldDisable, setDisable] = react.useState(false);
	setTimeout(() => setDisable(false), 1e4);
	const disableCheck = react.useMemo(() => ~runningGames.findIndex((m) => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
	return BdApi.React.createElement("div", { className: `${QuickLauncherClasses.dockItem} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, BdApi.React.createElement("div", { className: QuickLauncherClasses.dockIcon, style: { backgroundImage: `url(${"https://cdn.discordapp.com/app-icons/" + GameStore.getGameByName(game.name).id + "/" + GameStore.getGameByName(game.name).icon + ".webp"})` } }), BdApi.React.createElement("div", { className: QuickLauncherClasses.dockItemText }, game.name), BdApi.React.createElement(
		"button",
		{
			className: `${QuickLauncherClasses.dockItemPlay} ${Common.ButtonClasses.button} ${Common.ButtonClasses.lookFilled} ${Common.ButtonClasses.colorGreen} ${Common.ButtonClasses.sizeSmall} ${Common.ButtonClasses.fullWidth} ${Common.ButtonClasses.grow}`,
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

// activity_feed/components/now_playing/card_shop/components/CardBody.tsx
function CardBody({}) {
	return;
}

// activity_feed/components/now_playing/card_shop/components/CardHeader.tsx
function CardHeader({}) {
	return;
}

// activity_feed/components/now_playing/NowPlaying.module.css
const css = `
._932dc34d1f525dd9_nowPlayingContainer {
		display: flex;
		margin-top: var(--space-lg);
		gap: var(--space-lg);
}

._932dc34d1f525dd9_nowPlayingColumn {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: calc(50% - (var(--space-lg) / 2))
}

._932dc34d1f525dd9_nowPlayingContainer ._932dc34d1f525dd9_itemCard {
		flex: 1 0 0;
		margin: 16px 16px 0 0;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_card {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
		transform: translateZ(0);
}
		
._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_cardHeader {
		padding: 20px;
		position: relative;
		flex-direction: row;
		background: var(--background-base-lowest);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_header {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_header > ._932dc34d1f525dd9_wrapper {
		display: flex;
		cursor: pointer;
		margin-right: 20px;
		transition: opacity .2s ease;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_nameTag {
		line-height: 17px;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;
		color: var(--text-default);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_username {
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_username:hover {
		text-decoration: underline;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_card:hover ._932dc34d1f525dd9_headerIcon {
		display: none;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_headerActions {
		display: none;
		margin-left: 8px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_card:hover ._932dc34d1f525dd9_headerActions {
		display: flex;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_headerActions > div[aria-expanded="false"] {
		display: none;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_headerActions {
		._932dc34d1f525dd9_button._932dc34d1f525dd9_lookFilled {
				background: var(--control-secondary-background-default);
				border: unset;
				color: var(--white);
				padding: 2px 16px;
				width: unset;
				svg {
						display: none;
				} 
		}
		._932dc34d1f525dd9_button._932dc34d1f525dd9_lookFilled:hover {
				background-color: var(--control-secondary-background-hover) !important;
		}
		._932dc34d1f525dd9_button._932dc34d1f525dd9_lookFilled:active {
				background-color: var(--control-secondary-background-active) !important; 
		}
		._932dc34d1f525dd9_lookFilled._932dc34d1f525dd9_colorPrimary {
				background: unset !important;
				border: unset !important;
		}
		._932dc34d1f525dd9_lookFilled._932dc34d1f525dd9_colorPrimary:hover {
				color: var(--interactive-background-hover);
				svg {
						stroke: var(--interactive-background-hover);
				}
		}
		._932dc34d1f525dd9_lookFilled._932dc34d1f525dd9_colorPrimary:active {
				color: var(--interactive-background-active);
				svg {
						stroke: var(--interactive-background-active);
				}
		}
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_overflowMenu {
		cursor: pointer;
		height: 24px;
		margin-left: 8px;
		transition: opacity .2s linear;
		width: 24px;
		color: var(--interactive-icon-hover);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_overflowMenu:hover {
		color: var(--interactive-icon-default);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_headerIcon {
		border-radius: 4px;
		display: block;
		height: 30px;
		justify-self: end;
		width: 30px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_splashArt {
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

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_server {
		mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
		right: 0;
		left: unset;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_cardBody {
		display: flex;
		padding: 0 20px;
		background: var(--background-mod-strong)
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_section {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_game {
		padding: 20px 0;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_gameBody {
		flex-direction: column;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_activityContainer:last-child:not(:only-child, :nth-child(1 of ._932dc34d1f525dd9_activityContainer)) ._932dc34d1f525dd9_sectionDivider {
		display: none;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_activity {
		flex-direction: row;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_activity:last-child:not(:only-child) {
		margin-top: 20px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_activity ._932dc34d1f525dd9_serviceButtonWrapper {
		gap: 6px;
		display: flex;
		flex-direction: row;
		._932dc34d1f525dd9_sm:not(._932dc34d1f525dd9_hasText) {
				padding: 0;
				width: calc(var(--custom-button-button-sm-height) + 4px);
		}
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_richActivity {
		margin-top: 20px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_activityFeed {
		-webkit-box-flex: 1;
		flex: 1 1 50%;
		min-width: 0;
}

._932dc34d1f525dd9_nowPlayingColumn :is(._932dc34d1f525dd9_gameInfoRich, ._932dc34d1f525dd9_gameNameWrapper) {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_gameInfoRich {
		align-items: center;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_gameInfo {
		margin-left: 20px;
		min-width: 0;
		color: var(--text-default);
		font-weight: 500;
		flex: 1;
}

._932dc34d1f525dd9_nowPlayingColumn :is(._932dc34d1f525dd9_gameName, ._932dc34d1f525dd9_gameNameWrapper, ._932dc34d1f525dd9_streamInfo) {
		overflow: hidden;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_gameName {
		font-size: 16px;
		line-height: 20px;
		margin-right: 10px;
		max-width: fit-content;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_gameName._932dc34d1f525dd9_clickable:hover {
		text-decoration: underline;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_playTime:not(a) {
		color: var(--text-muted);
}
._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_playTime {
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets {
		position: relative;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assetsLargeImageActivityFeed {
		width: 90px;
		height: 90px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assetsSmallImageActivityFeed {
		height: 30px;
		width: 30px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_assetsLargeImage {
		display: block;
		border-radius: 4px; 
		object-fit: cover;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_assetsLargeImageActivityFeedTwitch {
		border-radius: 5px;
		height: 260px;
		mask: linear-gradient(0deg, transparent 10%, #000 80%);
		width: 100%;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets:has(._932dc34d1f525dd9_assetsSmallImage) ._932dc34d1f525dd9_assetsLargeImage {
		mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_richActivity ._932dc34d1f525dd9_assetsSmallImage, ._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_richActivity ._932dc34d1f525dd9_smallEmptyIcon {
		border-radius: 50%;
		position: absolute;
		bottom: -4px;
		right: -4px; 
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_activity ._932dc34d1f525dd9_smallEmptyIcon {
		width: 40px;
		height: 40px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_largeEmptyIcon {
		width: 90px;
		height: 90px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_largeEmptyIcon path {
		transform: scale(3.65) !important;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_richActivity svg._932dc34d1f525dd9_assetsSmallImage {
		border-radius: unset !important;
}   

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_richActivity ._932dc34d1f525dd9_smallEmptyIcon path {
		transform: scale(1.3) !important;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_twitchImageContainer {
		background: var(--background-secondary-alt);
		border-radius: 5px;
		position: relative;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_twitchBackgroundImage {
		display: inline-block;
		min-height: 260px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_twitchImageOverlay {
		bottom: 0;
		left: 0;
		padding: 16px;
		position: absolute;
		right: 0;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_streamName {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
		margin-top: 8px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_assets ._932dc34d1f525dd9_streamGame {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_contentImagesActivityFeed {
		margin-left: 20px;
		color: var(--text-default);
}

._932dc34d1f525dd9_nowPlayingColumn :is(._932dc34d1f525dd9_gameInfo, ._932dc34d1f525dd9_contentImagesActivityFeed) {
		align-self: center;
		display: grid;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_content {
		flex: 1;
		overflow: hidden;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_details {
		font-weight: 600;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

._932dc34d1f525dd9_textRow {
		display: block;
		font-size: 14px;
		line-height: 16px;
		margin-bottom: 4px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_content ._932dc34d1f525dd9_bar {
		background-color: var(--opacity-white-24);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_sectionDivider {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 20px 0 20px 0;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSection {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionAssets {
		align-items: center;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionIconWrapper {
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

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionIcon {
		color: var(--header-secondary);
		height: 12px;
		width: 12px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionGuildImage {
		border-radius: 50%;
		mask: url('https://discord.com/assets/a90b040155ee449f.svg');
		mask-size: 100%;
		mask-type: luminance;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSection ._932dc34d1f525dd9_details {
		flex: 1;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionDetails {
		cursor: pointer;
		margin-left: 20px;
		min-width: 0;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionDetails:hover :is(._932dc34d1f525dd9_voiceSectionText, ._932dc34d1f525dd9_voiceSectionSubtext) {
		text-decoration: underline;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionText {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2857142857142858;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSectionSubtext {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3333333333333333;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_userList {
		flex: 0 1 auto;
		justify-content: flex-end;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_voiceSection button {
		flex: 0 1 auto;
		width: auto;
		margin-left: 20px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_actionsActivity ._932dc34d1f525dd9_buttonContainer {
		flex-direction: inherit;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_partyStatusWrapper {
		display: flex;
		gap: 4px;
		align-items: center;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_partyStatusWrapper button {
		flex: 0 1 50%;
		max-height: 24px;
		min-height: 24px;
		width: auto !important;
		justify-self: flex-end;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_partyStatusWrapper ._932dc34d1f525dd9_disabledButtonWrapper {
		flex: 1;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_partyStatusWrapper ._932dc34d1f525dd9_disabledButtonOverlay {
		height: 24px;
		width: 100%;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_partyList {
		display: flex;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_player:first-of-type {
		mask: url(#svg-mask-voice-user-summary-item);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_emptyUser:not(:first-of-type), ._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_player:not(:first-of-type) {
		margin-left: -4px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_emptyUser:not(:last-of-type), ._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_player:not(:last-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_emptyUser, ._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_player {
		width: 16px;
		height: 16px;
		border-radius: 50%;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_emptyUser svg {
		margin-left: 3px;
}

._932dc34d1f525dd9_nowPlayingColumn ._932dc34d1f525dd9_partyPlayerCount {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3333333333333333;
}

._932dc34d1f525dd9_nowPlaying ._932dc34d1f525dd9_emptyState {
		border: 1px solid;
		border-radius: 5px;
		box-sizing: border-box;
		margin-top: 20px;
		padding: 20px;
		width: 100%;
}

._932dc34d1f525dd9_cardV2 {
		background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
		border-radius: var(--radius-md);
		outline: 1px solid var(--border-normal);
		outline-offset: -1px;
		box-sizing: border-box;
		background-clip: border-box;
		overflow: hidden;
		transform: translateZ(0);

		._932dc34d1f525dd9_headerActions ._932dc34d1f525dd9_button._932dc34d1f525dd9_lookFilled, ._932dc34d1f525dd9_cardBody button {
				color: var(--white);
				background: var(--opacity-white-24);
				&:hover {
						background: var(--opacity-white-36);
				}
				&:active {
						background: var(--opacity-white-32);
				}
		}

		._932dc34d1f525dd9_cardHeader {
				padding: var(--space-lg);
				position: relative;
				flex-direction: row;
				background: unset;
		}
		._932dc34d1f525dd9_nameTag {
				color: var(--white);
		}
		._932dc34d1f525dd9_splashArt, ._932dc34d1f525dd9_server {
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
				._932dc34d1f525dd9_headerIcon {
						display: none;
				}
				._932dc34d1f525dd9_headerActions {
						display: flex;
				}
		}
		._932dc34d1f525dd9_cardBody {
				display: flex;
				gap: var(--space-lg);
				padding: 0 var(--space-lg) var(--space-lg);
				background: unset;
		}
		._932dc34d1f525dd9_section {
				background: var(--background-mod-normal);
				border-radius: var(--radius-sm);
				padding: var(--space-sm);
		}
		._932dc34d1f525dd9_game {
				padding: 0;
		}
		._932dc34d1f525dd9_sectionDivider {
				border-color: var(--opacity-white-12) !important;
				border-width: 1px;
				margin: 12px 0 12px 0;
		}
		._932dc34d1f525dd9_voiceSectionText {
				color: var(--white);
		}
		._932dc34d1f525dd9_headerIcon, ._932dc34d1f525dd9_gameIcon, ._932dc34d1f525dd9_assetsLargeImage._932dc34d1f525dd9_assetsLargeImage {
				border-radius: var(--radius-sm);
		}
		._932dc34d1f525dd9_gameInfo {
				color: var(--white);
		}
		._932dc34d1f525dd9_playTime:not(a), ._932dc34d1f525dd9_voiceSectionSubtext {
				color: var(--app-message-embed-secondary-text) !important;
		}
		._932dc34d1f525dd9_serviceButtonWrapper {
				gap: 8px !important;
		}
		._932dc34d1f525dd9_contentImagesActivityFeed {
				color: var(--white);
		}
		._932dc34d1f525dd9_textRow {
				font-size: 16px;
				line-height: 18px;
		}
		._932dc34d1f525dd9_state {
				color: var(--app-message-embed-secondary-text);
				font-size: 14px;
				line-height: 16px;
		}
		._932dc34d1f525dd9_activity:last-child:not(:only-child) {
				margin-top: 12px;
		}
}`;
_loadStyle("NowPlaying.module.css", css);
const modules_7260a078 = {
	"nowPlayingContainer": "_932dc34d1f525dd9_nowPlayingContainer",
	"nowPlayingColumn": "_932dc34d1f525dd9_nowPlayingColumn",
	"itemCard": "_932dc34d1f525dd9_itemCard",
	"card": "_932dc34d1f525dd9_card",
	"cardHeader": "_932dc34d1f525dd9_cardHeader",
	"header": "_932dc34d1f525dd9_header",
	"wrapper": "_932dc34d1f525dd9_wrapper",
	"nameTag": "_932dc34d1f525dd9_nameTag",
	"username": "_932dc34d1f525dd9_username",
	"headerIcon": "_932dc34d1f525dd9_headerIcon",
	"headerActions": "_932dc34d1f525dd9_headerActions",
	"button": "_932dc34d1f525dd9_button",
	"lookFilled": "_932dc34d1f525dd9_lookFilled",
	"colorPrimary": "_932dc34d1f525dd9_colorPrimary",
	"overflowMenu": "_932dc34d1f525dd9_overflowMenu",
	"splashArt": "_932dc34d1f525dd9_splashArt",
	"server": "_932dc34d1f525dd9_server",
	"cardBody": "_932dc34d1f525dd9_cardBody",
	"section": "_932dc34d1f525dd9_section",
	"game": "_932dc34d1f525dd9_game",
	"gameBody": "_932dc34d1f525dd9_gameBody",
	"activityContainer": "_932dc34d1f525dd9_activityContainer",
	"sectionDivider": "_932dc34d1f525dd9_sectionDivider",
	"activity": "_932dc34d1f525dd9_activity",
	"serviceButtonWrapper": "_932dc34d1f525dd9_serviceButtonWrapper",
	"sm": "_932dc34d1f525dd9_sm",
	"hasText": "_932dc34d1f525dd9_hasText",
	"richActivity": "_932dc34d1f525dd9_richActivity",
	"activityFeed": "_932dc34d1f525dd9_activityFeed",
	"gameInfoRich": "_932dc34d1f525dd9_gameInfoRich",
	"gameNameWrapper": "_932dc34d1f525dd9_gameNameWrapper",
	"gameInfo": "_932dc34d1f525dd9_gameInfo",
	"gameName": "_932dc34d1f525dd9_gameName",
	"streamInfo": "_932dc34d1f525dd9_streamInfo",
	"clickable": "_932dc34d1f525dd9_clickable",
	"playTime": "_932dc34d1f525dd9_playTime",
	"assets": "_932dc34d1f525dd9_assets",
	"assetsLargeImageActivityFeed": "_932dc34d1f525dd9_assetsLargeImageActivityFeed",
	"assetsSmallImageActivityFeed": "_932dc34d1f525dd9_assetsSmallImageActivityFeed",
	"assetsLargeImage": "_932dc34d1f525dd9_assetsLargeImage",
	"assetsLargeImageActivityFeedTwitch": "_932dc34d1f525dd9_assetsLargeImageActivityFeedTwitch",
	"assetsSmallImage": "_932dc34d1f525dd9_assetsSmallImage",
	"smallEmptyIcon": "_932dc34d1f525dd9_smallEmptyIcon",
	"largeEmptyIcon": "_932dc34d1f525dd9_largeEmptyIcon",
	"twitchImageContainer": "_932dc34d1f525dd9_twitchImageContainer",
	"twitchBackgroundImage": "_932dc34d1f525dd9_twitchBackgroundImage",
	"twitchImageOverlay": "_932dc34d1f525dd9_twitchImageOverlay",
	"streamName": "_932dc34d1f525dd9_streamName",
	"streamGame": "_932dc34d1f525dd9_streamGame",
	"contentImagesActivityFeed": "_932dc34d1f525dd9_contentImagesActivityFeed",
	"content": "_932dc34d1f525dd9_content",
	"details": "_932dc34d1f525dd9_details",
	"ellipsis": "_932dc34d1f525dd9_ellipsis",
	"textRow": "_932dc34d1f525dd9_textRow",
	"bar": "_932dc34d1f525dd9_bar",
	"voiceSection": "_932dc34d1f525dd9_voiceSection",
	"voiceSectionAssets": "_932dc34d1f525dd9_voiceSectionAssets",
	"voiceSectionIconWrapper": "_932dc34d1f525dd9_voiceSectionIconWrapper",
	"voiceSectionIcon": "_932dc34d1f525dd9_voiceSectionIcon",
	"voiceSectionGuildImage": "_932dc34d1f525dd9_voiceSectionGuildImage",
	"voiceSectionDetails": "_932dc34d1f525dd9_voiceSectionDetails",
	"voiceSectionText": "_932dc34d1f525dd9_voiceSectionText",
	"voiceSectionSubtext": "_932dc34d1f525dd9_voiceSectionSubtext",
	"userList": "_932dc34d1f525dd9_userList",
	"actionsActivity": "_932dc34d1f525dd9_actionsActivity",
	"buttonContainer": "_932dc34d1f525dd9_buttonContainer",
	"partyStatusWrapper": "_932dc34d1f525dd9_partyStatusWrapper",
	"disabledButtonWrapper": "_932dc34d1f525dd9_disabledButtonWrapper",
	"disabledButtonOverlay": "_932dc34d1f525dd9_disabledButtonOverlay",
	"partyList": "_932dc34d1f525dd9_partyList",
	"player": "_932dc34d1f525dd9_player",
	"emptyUser": "_932dc34d1f525dd9_emptyUser",
	"partyPlayerCount": "_932dc34d1f525dd9_partyPlayerCount",
	"nowPlaying": "_932dc34d1f525dd9_nowPlaying",
	"emptyState": "_932dc34d1f525dd9_emptyState",
	"cardV2": "_932dc34d1f525dd9_cardV2",
	"gameIcon": "_932dc34d1f525dd9_gameIcon",
	"state": "_932dc34d1f525dd9_state"
};
const NowPlayingClasses = modules_7260a078;

// activity_feed/components/now_playing/cardBuilder.tsx
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
	return BdApi.React.createElement("div", { className: v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } }, BdApi.React.createElement(CardHeader, null), BdApi.React.createElement(CardBody, null));
}

// activity_feed/components/now_playing/baseBuilder.tsx
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
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Now Playing" }), nowPlayingCards.length === 0 ? BdApi.React.createElement("div", { className: MainClasses.emptyState }, BdApi.React.createElement("div", { className: MainClasses.emptyTitle }, "Nobody is playing anything right now..."), BdApi.React.createElement("div", { className: MainClasses.emptySubtitle }, "When someone starts playing a game we'll show it here!")) : BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingContainer }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingColumn }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column })))));
}

// activity_feed/base.tsx
function Scroller({ children, padding }) {
	return BdApi.React.createElement("div", { className: MainClasses.scrollerBase, style: { overflow: "hidden scroll", paddingRight: `${padding}px` || "0px" } }, children);
}
function TabBaseBuilder() {
	document.title = "Activity";
	const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"];
	return BdApi.React.createElement("div", { className: MainClasses.activityFeed }, BdApi.React.createElement(Common.HeaderBar, { className: MainClasses.headerBar, "aria-label": "Activity" }, BdApi.React.createElement("div", { className: MainClasses.iconWrapper }, BdApi.React.createElement("svg", { className: Common.UpperIconClasses.icon, style: { width: 24, height: 24 }, viewBox: "0 0 24 24", fill: "none" }, BdApi.React.createElement("path", { d: ControllerIcon, fill: "var(--channel-icon)" }))), BdApi.React.createElement("div", { className: MainClasses.titleWrapper }, BdApi.React.createElement("div", { className: MainClasses.title }, "Activity"))), BdApi.React.createElement(Scroller, null, BdApi.React.createElement("div", { className: MainClasses.centerContainer }, BdApi.React.createElement(QuickLauncherBuilder, { className: QuickLauncherClasses.quickLauncher, style: { position: "relative", padding: "0 20px 0 20px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: NowPlayingClasses.nowPlaying, style: { position: "relative", padding: "0 20px 20px 20px" } }), BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))));
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
		betterdiscord.DOM.addStyle("activityPanelCSS", styles());
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