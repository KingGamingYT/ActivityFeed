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
	{ name: "OpenVoiceChannel", filter: (x) => x.selectVoiceChannel, searchExports: true },
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
const WindowStore = betterdiscord.Webpack.getStore("WindowStore");

// activity_feed/Store.tsx
class GameNewsStore extends betterdiscord.Utils.Store {
	static displayName = "GameNewsStore";
	article = {};
	articleSet = {};
	dataSet = {};
	displaySet = [];
	blacklist = [];
	state = [];
	lastTimeFetched;
	idling;
	constructor() {
		super();
		this.articleSet = {};
		this.dataSet = {};
		this.displaySet = [];
		this.article = {};
		this.blacklist = [];
		this.lastTimeFetched;
		this.idling = true;
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
		this.dataSet = Object.assign(this.dataSet, betterdiscord.Data.load("dataSet"));
		this.blacklist = betterdiscord.Data.load("blacklist") || [];
		this.lastTimeFetched = betterdiscord.Data.load("lastTimeFetched");
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
		return b?.find((e) => e.game_id === gameId);
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
	async #fetchMinecraftFeeds(application) {
		const rssFeed = await Promise.all([betterdiscord.Net.fetch(`https://net-secondary.web.minecraft-services.net/api/v1.0/en-us/search?pageSize=24&sortType=Recent&category=News&newsOnly=true`).then((r) => r.ok ? r.json() : null)]);
		const article = rssFeed[0].result.results[0];
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
	async #fetchFortniteFeeds(application) {
		const rssFeed = await Promise.all([betterdiscord.Net.fetch(`https://fortnite-api.com/v2/news`).then((r) => r.ok ? r.json() : null)]);
		const article = rssFeed[0].data.br.motds[0];
		return {
			application,
			appId: application.id,
			description: article?.body,
			thumbnail: article?.image,
			timestamp: rssFeed[0].data.br.date,
			title: article?.title
		};
	}
	async #fetchSteamFeeds(gameId, application) {
		const rssFeed = await Promise.all([betterdiscord.Net.fetch(`https://rssjson.vercel.app/api?url=https://store.steampowered.com/feeds/news/app/${gameId}`).then((r) => r.ok ? r.json() : null)]);
		const article = this.getRSSItem(rssFeed);
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
	async fetchFeeds() {
		const gameData = await this.getFeedGameData();
		for (const gameId of Object.keys(gameData)) {
			(async (gameId2) => {
				let feeds;
				switch (gameId2) {
					case "Minecraft":
						feeds = await this.#fetchMinecraftFeeds(gameData[gameId2]);
						break;
					case "Fortnite":
						feeds = await this.#fetchFortniteFeeds(gameData[gameId2]);
						break;
					default:
						feeds = await this.#fetchSteamFeeds(gameId2, gameData[gameId2]);
				}
				if (this.filterFeeds(feeds, gameId2)) {
					this.dataSet[gameId2] = {
						id: gameId2,
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
					betterdiscord.Data.save("dataSet", this.dataSet);
				}
			})(gameId);
		}
		this.lastTimeFetched = Date.now();
		betterdiscord.Data.save("lastTimeFetched", this.lastTimeFetched);
	}
	async getFeedGameData() {
		const gameData = {};
		const gameList = RunningGameStore.getGamesSeen().filter((game) => GameStore.getGameByName(game.name));
		const gameIds = gameList.filter((game) => game.id || game.name === "Minecraft").map((game) => game.name === "Minecraft" ? GameStore.getGameByName(game.name).id : game.id);
		let applicationList;
		await Common$1.FetchApplications.fetchApplications(gameIds).then(
			applicationList = gameList.map((game) => ApplicationStore.getApplicationByName(game.name)).filter((game) => game && game.thirdPartySkus.length > 0 && game.thirdPartySkus.some((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"))
		);
		const feedIds = applicationList.map((game) => {
			const steamSku = game.thirdPartySkus.find((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite");
			return steamSku?.sku || game.name;
		});
		for (let i = 0; i < feedIds.length; i++) {
			gameData[feedIds[i]] = applicationList[i];
		}
		return gameData;
	}
	shouldFetch() {
		if (Object.keys(this.getFeeds()).length === 0) {
			this.setFeeds();
		}
		let t = this.lastTimeFetched;
		Object.values(this.getFeeds()).length;
		return null == t || Date.now() - t > 216e5;
	}
	isFetched() {
		let b = Object.values(this.getFeeds()).length > 5;
		return b;
	}
	filterFeeds(f, g) {
		const oW = new Date(Date.now() - 12096e5);
		return new Date(f.timestamp) > oW && !this.getBlacklistedGame(g);
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
		let t = [];
		let keys = Object.keys(feeds);
		if (keys.length < 5) return;
		for (let g = 0; g < 4; g++) {
			let rand = keys.length * Math.random() << 0;
			t.push(feeds[keys[rand]]);
			keys.splice(rand, 1);
		}
		return t;
	}
	getFeedsForDisplay() {
		const aA = {};
		const rG = this.displaySet;
		const r = this.getRandomFeeds(this.getFeeds());
		if (!this.shouldFetch() && !this.displaySet.length && r !== void 0) {
			rG.push.apply(rG, r);
			for (let i = 0; i < rG.length; i++) {
				aA[i] = {
					index: i,
					direction: this.getDirection(i + 1 - (this.getCurrentArticle().index || 0)),
					idling: this.idling,
					orientation: this.getOrientation(),
					article: rG[i]
				};
			}
			this.articleSet = aA;
			this.article = aA[0];
		}
		return aA;
	}
	getCurrentArticle() {
		return this.article;
	}
	setCurrentArticle(i) {
		this.article = this.articleSet[i];
	}
	getOrientation() {
		const [width, height] = this.state.length ? this.state.size : [WindowStore.windowSize.width, WindowStore.windowSize.height];
		return (width > 1200 || height < 600) && (width < 1200 || height > 600) ? "vertical" : "horizontal";
	}
	getDirection(e) {
		return e > 0 ? 1 : -1;
	}
	setIdling(e) {
		this.idling = e;
	}
	isIdling() {
		return this.idling;
	}
}
const NewsStore = new GameNewsStore();

// styles
let _styles = "";
function _loadStyle(path, css) {
	_styles += "/*" + path + "*/\n" + css + "\n";
}
function styles$1() {
	return _styles;
}

// activity_feed/ActivityFeed.module.css
const css$3 = `
.activityFeed_f870d5 {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-border-frame);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

.scrollerBase_f870d5 {
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

.centerContainer_f870d5 {
		display: flex;
		flex-direction: column;
		width: 1280px;
		max-width: 100%;
		min-width: 480px;
		margin: 0 auto;
}

.title_f870d5 {
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

.titleWrapper_f870d5 {
		flex: 0 0 auto;
		margin: 0 8px 0 0;
		min-width: auto;
}

.iconWrapper_f870d5 {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: var(--space-32);
		justify-content: center;
		margin: 0;
		position: relative;
		width: var(--space-32);
}

.headerBar_f870d5 {
		height: calc(var(--custom-channel-header-height) - 1px);
		min-height: calc(var(--custom-channel-header-height) - 1px);
}

.headerContainer_f870d5 {
		flex-direction: row;
}

.headerText_f870d5 {
		display: flex;
		flex: 1;
		font-size: 18px;
		font-weight: 500;
		line-height: 22px;
		margin-top: 20px;
		width: 100%;
		color: var(--text-default);
}

.button_f870d5 {
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

.sectionDivider_f870d5 {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 20px 0 20px 0;
}

.emptyText_f870d5 {}`;
_loadStyle("ActivityFeed.module.css", css$3);
const modules_7e65654a = {
	"activityFeed": "activityFeed_f870d5",
	"scrollerBase": "scrollerBase_f870d5",
	"centerContainer": "centerContainer_f870d5",
	"title": "title_f870d5",
	"titleWrapper": "titleWrapper_f870d5",
	"iconWrapper": "iconWrapper_f870d5",
	"headerBar": "headerBar_f870d5",
	"headerContainer": "headerContainer_f870d5",
	"headerText": "headerText_f870d5",
	"button": "button_f870d5",
	"sectionDivider": "sectionDivider_f870d5",
	"emptyText": "emptyText_f870d5"
};
const MainClasses = modules_7e65654a;

// activity_feed/components/common/components/SectionHeader.jsx
function SectionHeader({ label }) {
	return BdApi.React.createElement("div", { className: `${MainClasses.headerContainer} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyBetween} ${Common$1.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: MainClasses.headerText }, label));
}

// activity_feed/components/quick_launcher/QuickLauncher.module.css
const css$2 = `
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
_loadStyle("QuickLauncher.module.css", css$2);
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
const css$1 = `
.nowPlayingContainer_7f8479 {
		display: flex;
		margin-top: var(--space-lg);
		gap: var(--space-lg);
}

.nowPlayingColumn_7f8479 {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: calc(50% - (var(--space-lg) / 2))
}

.nowPlayingContainer_7f8479 .itemCard_7f8479 {
		flex: 1 0 0;
		margin: 16px 16px 0 0;
}

.card_7f8479 {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
		transform: translateZ(0);
}
		
.cardHeader_7f8479 {
		padding: 20px;
		position: relative;
		flex-direction: row;
		background: var(--background-base-lowest);
}

.header_7f8479 {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
}

.nameTag_7f8479 {
		line-height: 17px;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;
		color: var(--text-default);
}

.username_7f8479 {
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

.username_7f8479:hover {
		text-decoration: underline;
}

.card_7f8479:hover .headerIcon_7f8479 {
		display: none;
}

.headerActions_7f8479 {
		display: none;
		margin-left: 8px;
}

.card_7f8479:hover .headerActions_7f8479 {
		display: flex;
}

.headerActions_7f8479 > div[aria-expanded="false"] {
		display: none;
}

.overflowMenu_7f8479 {
		cursor: pointer;
		height: 24px;
		margin-left: 8px;
		transition: opacity .2s linear;
		width: 24px;
		color: var(--interactive-icon-hover);
}

.overflowMenu_7f8479:hover {
		color: var(--interactive-icon-default);
}

.headerIcon_7f8479 {
		border-radius: 4px;
		display: block;
		height: 30px;
		justify-self: end;
		width: 30px;
}

.splashArt_7f8479 {
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

.server_7f8479 {
		mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
		right: 0;
		left: unset;
}

.cardBody_7f8479 {
		display: flex;
		padding: 0 20px;
		background: var(--background-mod-strong)
}

.section_7f8479 {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

.game_7f8479 {
		padding: 20px 0;
}

.gameBody_7f8479 {
		flex-direction: column;
}

.activity_7f8479 {
		flex-direction: row;
}

.activity_7f8479:last-child:not(:only-child) {
		margin-top: 20px;
}

.activity_7f8479 .serviceButtonWrapper_7f8479 {
		gap: 6px;
		display: flex;
		flex-direction: row;
}

.richActivity_7f8479 {
		margin-top: 20px;
}

.activityActivityFeed_7f8479 {}

.activityFeed_7f8479 {
		-webkit-box-flex: 1;
		flex: 1 1 50%;
		min-width: 0;
}

.body_7f8479 {}

.bodyNormal_7f8479 {}

:is(.gameInfoRich_7f8479, .gameNameWrapper_7f8479) {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
}

.gameInfoRich_7f8479 {
		align-items: center;
}

.gameInfo_7f8479 {
		margin-left: 20px;
		min-width: 0;
		color: var(--text-default);
		font-weight: 500;
		flex: 1;
}

:is(.gameName_7f8479, .gameNameWrapper_7f8479, .streamInfo_7f8479) {
		overflow: hidden;
}

.gameName_7f8479 {
		font-size: 16px;
		line-height: 20px;
		margin-right: 10px;
		max-width: fit-content;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.gameName_7f8479.clickable_7f8479:hover {
		text-decoration: underline;
}

.playTime_7f8479:not(a) {
		color: var(--text-muted);
}
.playTime_7f8479 {
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.assets_7f8479 {
		position: relative;
}

.assetsLargeImageActivityFeed_7f8479 {
		width: 90px;
		height: 90px;
}

.assetsSmallImageActivityFeed_7f8479 {
		height: 30px;
		width: 30px;
}

.assets_7f8479 .assetsLargeImage_7f8479 {
		display: block;
		border-radius: 4px; 
		object-fit: cover;
}

.assets_7f8479 .assetsLargeImageActivityFeedTwitch_7f8479 {
		border-radius: 5px;
		height: 260px;
		mask: linear-gradient(0deg, transparent 10%, #000 80%);
		width: 100%;
}

.assets_7f8479:has(.assetsSmallImage_7f8479) .assetsLargeImage_7f8479 {
		mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
}

.richActivity_7f8479 .assetsSmallImage_7f8479, .richActivity_7f8479 .smallEmptyIcon_7f8479 {
		border-radius: 50%;
		position: absolute;
		bottom: -4px;
		right: -4px; 
}

.activity_7f8479 .smallEmptyIcon_7f8479 {
		width: 40px;
		height: 40px;
}

.assets_7f8479 .largeEmptyIcon_7f8479 {
		width: 90px;
		height: 90px;
}

.assets_7f8479 .largeEmptyIcon_7f8479 path {
		transform: scale(3.65) !important;
}

.richActivity_7f8479 svg.assetsSmallImage_7f8479 {
		border-radius: unset !important;
}   

.richActivity_7f8479 .smallEmptyIcon_7f8479 path {
		transform: scale(1.3) !important;
}

.assets_7f8479 .twitchImageContainer_7f8479 {
		background: var(--background-secondary-alt);
		border-radius: 5px;
		position: relative;
}

.assets_7f8479 .twitchBackgroundImage_7f8479 {
		display: inline-block;
		min-height: 260px;
}

.assets_7f8479 .twitchImageOverlay_7f8479 {
		bottom: 0;
		left: 0;
		padding: 16px;
		position: absolute;
		right: 0;
}

.assets_7f8479 .streamName_7f8479 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
		margin-top: 8px;
}

.assets_7f8479 .streamGame_7f8479 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.contentImagesActivityFeed_7f8479 {
		margin-left: 20px;
		color: var(--text-default);
}

:is(.gameInfo_7f8479, .contentImagesActivityFeed_7f8479) {
		align-self: center;
		display: grid;
}

.content_7f8479 {
		flex: 1;
		overflow: hidden;
}

.details_7f8479 {
		font-weight: 600;
}

.ellipsis_7f8479 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.textRow_7f8479 {
		display: block;
		font-size: 14px;
		line-height: 16px;
		margin-bottom: 4px;
}

.voiceSection_7f8479 {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
}

.voiceSectionAssets_7f8479 {
		align-items: center;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

.voiceSectionIconWrapper_7f8479 {
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

.voiceSectionIcon_7f8479 {
		color: var(--header-secondary);
		height: 12px;
		width: 12px;
}

.voiceSectionGuildImage_7f8479 {
		border-radius: 50%;
		mask: url('https://discord.com/assets/a90b040155ee449f.svg');
		mask-size: 100%;
		mask-type: luminance;
}

.voiceSection_7f8479 .details_7f8479 {
		flex: 1;
}

.voiceSectionDetails_7f8479 {
		cursor: pointer;
		margin-left: 20px;
		min-width: 0;
}

.voiceSectionDetails_7f8479:hover :is(.voiceSectionText_7f8479, .voiceSectionSubtext_7f8479) {
		text-decoration: underline;
}

.voiceSectionText_7f8479 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2857142857142858;
}

.voiceSectionSubtext_7f8479 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3333333333333333;
}

.userList_7f8479 {
		flex: 0 1 auto;
		justify-content: flex-end;
}

.voiceSection_7f8479 button {
		flex: 0 1 auto !important;
		width: auto !important;
		margin-left: 20px;
}

.actionsActivity_7f8479 .buttonContainer_7f8479 {
		flex-direction: inherit;
}

.partyStatusWrapper_7f8479 {
		display: flex;
		gap: 4px;
		align-items: center;
}

.partyStatusWrapper_7f8479 button {
		flex: 0 1 50% !important;
		max-height: 24px;
		min-height: 24px !important;
		width: auto !important;
		justify-self: flex-end;
}

.partyList_7f8479 {
		display: flex;
}

.player_7f8479:first-of-type:not(:only-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.userOverflow_7f8479 {}

.emptyUser_7f8479:not(:first-of-type), .player_7f8479:not(:first-of-type) {
		margin-left: -4px;
}

.emptyUser_7f8479:not(:last-of-type), .player_7f8479:not(:last-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.emptyUser_7f8479, .player_7f8479 {
		width: 16px;
		height: 16px;
		border-radius: 50%;
}

.emptyUser_7f8479 svg {
		margin-left: 3px;
}

.partyPlayerCount_7f8479 {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3333333333333333;
}

.nowPlaying_7f8479 .emptyState_7f8479 {
		border: 1px solid;
		border-radius: 5px;
		box-sizing: border-box;
		margin-top: 20px;
		padding: 20px;
		width: 100%;
}

.cardV2_7f8479 {
		background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
		border-radius: var(--radius-md);
		outline: 1px solid var(--border-normal);
		outline-offset: -1px;
		box-sizing: border-box;
		background-clip: border-box;
		overflow: hidden;
		transform: translateZ(0);

		.cardHeader_7f8479 {
				padding: var(--space-lg);
				position: relative;
				flex-direction: row;
				background: unset;
		}
		.nameTag_7f8479 {
				color: var(--white);
		}
		.splashArt_7f8479, .server_7f8479 {
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
				.headerIcon_7f8479 {
						display: none;
				}
				.headerActions_7f8479 {
						display: flex;
				}
		}
		.cardBody_7f8479 {
				display: flex;
				gap: var(--space-lg);
				padding: 0 var(--space-lg) var(--space-lg);
				background: unset;
		}
		.section_7f8479 {
				background: var(--background-mod-normal);
				border-radius: var(--radius-sm);
				padding: var(--space-sm);
		}
		.game_7f8479 {
				padding: 0;
		}
		.voiceSectionText_7f8479 {
				color: var(--white);
		}
		.headerIcon_7f8479, .gameIcon_7f8479, .assetsLargeImage_7f8479.assetsLargeImage_7f8479 {
				border-radius: var(--radius-sm);
		}
		.gameInfo_7f8479 {
				color: var(--white);
		}
		.playTime_7f8479:not(a), .voiceSectionSubtext_7f8479 {
				color: var(--app-message-embed-secondary-text) !important;
		}
		.serviceButtonWrapper_7f8479 {
				gap: 8px !important;
		}
		.contentImagesActivityFeed_7f8479 {
				color: var(--white);
		}
		.textRow_7f8479 {
				font-size: 16px;
				line-height: 18px;
		}
		.state_7f8479 {
				color: var(--app-message-embed-secondary-text);
				font-size: 14px;
				line-height: 16px;
		}
		.activity_7f8479:last-child:not(:only-child) {
				margin-top: 12px;
		}
}`;
_loadStyle("NowPlaying.module.css", css$1);
const modules_7260a078 = {
	"nowPlayingContainer": "nowPlayingContainer_7f8479",
	"nowPlayingColumn": "nowPlayingColumn_7f8479",
	"itemCard": "itemCard_7f8479",
	"card": "card_7f8479",
	"cardHeader": "cardHeader_7f8479",
	"header": "header_7f8479",
	"nameTag": "nameTag_7f8479",
	"username": "username_7f8479",
	"headerIcon": "headerIcon_7f8479",
	"headerActions": "headerActions_7f8479",
	"overflowMenu": "overflowMenu_7f8479",
	"splashArt": "splashArt_7f8479",
	"server": "server_7f8479",
	"cardBody": "cardBody_7f8479",
	"section": "section_7f8479",
	"game": "game_7f8479",
	"gameBody": "gameBody_7f8479",
	"activity": "activity_7f8479",
	"serviceButtonWrapper": "serviceButtonWrapper_7f8479",
	"richActivity": "richActivity_7f8479",
	"activityActivityFeed": "activityActivityFeed_7f8479",
	"activityFeed": "activityFeed_7f8479",
	"body": "body_7f8479",
	"bodyNormal": "bodyNormal_7f8479",
	"gameInfoRich": "gameInfoRich_7f8479",
	"gameNameWrapper": "gameNameWrapper_7f8479",
	"gameInfo": "gameInfo_7f8479",
	"gameName": "gameName_7f8479",
	"streamInfo": "streamInfo_7f8479",
	"clickable": "clickable_7f8479",
	"playTime": "playTime_7f8479",
	"assets": "assets_7f8479",
	"assetsLargeImageActivityFeed": "assetsLargeImageActivityFeed_7f8479",
	"assetsSmallImageActivityFeed": "assetsSmallImageActivityFeed_7f8479",
	"assetsLargeImage": "assetsLargeImage_7f8479",
	"assetsLargeImageActivityFeedTwitch": "assetsLargeImageActivityFeedTwitch_7f8479",
	"assetsSmallImage": "assetsSmallImage_7f8479",
	"smallEmptyIcon": "smallEmptyIcon_7f8479",
	"largeEmptyIcon": "largeEmptyIcon_7f8479",
	"twitchImageContainer": "twitchImageContainer_7f8479",
	"twitchBackgroundImage": "twitchBackgroundImage_7f8479",
	"twitchImageOverlay": "twitchImageOverlay_7f8479",
	"streamName": "streamName_7f8479",
	"streamGame": "streamGame_7f8479",
	"contentImagesActivityFeed": "contentImagesActivityFeed_7f8479",
	"content": "content_7f8479",
	"details": "details_7f8479",
	"ellipsis": "ellipsis_7f8479",
	"textRow": "textRow_7f8479",
	"voiceSection": "voiceSection_7f8479",
	"voiceSectionAssets": "voiceSectionAssets_7f8479",
	"voiceSectionIconWrapper": "voiceSectionIconWrapper_7f8479",
	"voiceSectionIcon": "voiceSectionIcon_7f8479",
	"voiceSectionGuildImage": "voiceSectionGuildImage_7f8479",
	"voiceSectionDetails": "voiceSectionDetails_7f8479",
	"voiceSectionText": "voiceSectionText_7f8479",
	"voiceSectionSubtext": "voiceSectionSubtext_7f8479",
	"userList": "userList_7f8479",
	"actionsActivity": "actionsActivity_7f8479",
	"buttonContainer": "buttonContainer_7f8479",
	"partyStatusWrapper": "partyStatusWrapper_7f8479",
	"partyList": "partyList_7f8479",
	"player": "player_7f8479",
	"userOverflow": "userOverflow_7f8479",
	"emptyUser": "emptyUser_7f8479",
	"partyPlayerCount": "partyPlayerCount_7f8479",
	"nowPlaying": "nowPlaying_7f8479",
	"emptyState": "emptyState_7f8479",
	"cardV2": "cardV2_7f8479",
	"gameIcon": "gameIcon_7f8479",
	"state": "state_7f8479"
};
const NowPlayingClasses = modules_7260a078;

// activity_feed/components/now_playing/activities/components/common/FlexInfo.tsx
function ActivityType({ type, activity, game, channel, server, stream }) {
	useStateFromStores([GuildStore], () => GuildStore.getGuild(channel?.guild_id));
	switch (type) {
		case "REGULAR":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.gameNameWrapper }, BdApi.React.createElement("div", { className: NowPlayingClasses.gameName }, game?.name)), !activity?.assets?.large_image && BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, BdApi.React.createElement(TimeClock, { timestamp: activity.created_at })));
		case "RICH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity.details || activity?.state), activity?.details && BdApi.React.createElement("div", { className: `${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity?.state), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(Common$1.MediaProgressBar, { start: activity?.timestamps?.start || activity?.created_at, end: activity?.timestamps?.end })) : BdApi.React.createElement(Common$1.ActivityTimer, { activity }));
		case "TWITCH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, activity.state && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, `${Common$1.intl.intl.formatToPlainString(Common$1.intl.t[`BMTj28`])} ${activity.state}`));
		case "VOICE":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, server?.name || channel?.name || stream?.globalName), server && BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, channel?.name));
	}
}
function FlexInfo(props) {
	const { className, style, onClick, activity, game, channel, stream, server, type } = props;
	return BdApi.React.createElement("div", { className, style, onClick }, BdApi.React.createElement(
		ActivityType,
		{
			activity,
			game,
			channel,
			stream,
			server,
			type
		}
	));
}

// activity_feed/components/now_playing/activities/components/common/CardTrailing.tsx
function PartyMemberListBuilder({ activity, users }) {
	const emptyNum = activity?.party?.size[1] - activity?.party?.size[0];
	const anonNum = activity?.party?.size[0] - 1;
	const anonUsers = [];
	const emptyUsers = [];
	for (let i = 0; i < anonNum; i++) {
		anonUsers.push("anon");
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
							className: NowPlayingClasses.player
						}
					);
			}
		}
	), users.length + anonUsers.length > 10 && BdApi.React.createElement("div", { className: `${NowPlayingClasses.emptyUser} ${NowPlayingClasses.userOverflow}` }, `+${users.length + anonNum - 10}`));
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
function VoiceCardTrailing({ members, server, channel }) {
	const [width, height] = useWindowSize();
	if (width <= 1240) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(
		Common$1.VoiceList,
		{
			className: NowPlayingClasses.userList,
			users: members,
			maxUsers: 5,
			guildId: server?.id,
			channelId: channel.id,
			size: "SIZE_32"
		}
	), BdApi.React.createElement(Common$1.CallButtons, { channel }));
}
function PartyFooter({ party, players, user, activity }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.sectionDivider, style: { margin: "8px 0 8px 0" } }), BdApi.React.createElement("div", { className: NowPlayingClasses.partyStatusWrapper }, BdApi.React.createElement(PartyMemberListBuilder, { activity, users: players }), BdApi.React.createElement(
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
function VoiceGuildAsset({ channel, server, streamUser }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(
		"img",
		{
			className: NowPlayingClasses.voiceSectionGuildImage,
			src: (() => {
				switch (true) {
					case !!server:
						return `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=40`;
					case !!channel:
						return `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=40`;
					case !!streamUser:
						return `https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=40`;
				}
			})()
		}
	), BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSectionIconWrapper }, BdApi.React.createElement("svg", { className: NowPlayingClasses.voiceSectionIcon, width: "24", height: "24", viewBox: "0 0 24 24" }, BdApi.React.createElement("path", { fill: "currentColor", d: "M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" }))));
}

// activity_feed/components/now_playing/activities/components/InnerBuilder.tsx
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

// activity_feed/components/now_playing/activities/components/CardActivity.tsx
function ActivityCard({ user, activities, currentActivity, currentGame, players, server, check, v2Enabled }) {
	const gameId = currentActivity?.application_id;
	react.useEffect(() => {
		(async () => {
			await Common$1.FetchGames.getDetectableGamesSupplemental([gameId]);
		})();
	}, [gameId]);
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.activityContainer }, BdApi.React.createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, players, server, check, v2Enabled }), currentActivity?.assets && currentActivity?.assets.large_image && BdApi.React.createElement(RichActivityBuilder, { user, activity: currentActivity, v2Enabled })), v2Enabled && currentActivity?.party && currentActivity?.party.size && BdApi.React.createElement(PartyFooter, { party: currentActivity.party, players, user, activity: currentActivity }), activities.length > 1 && activities.pop() !== currentActivity && BdApi.React.createElement("div", { className: MainClasses.sectionDivider }));
}

// activity_feed/components/now_playing/activities/components/CardActivityWrapper.tsx
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

// activity_feed/components/now_playing/activities/components/CardTwitch.tsx
function TwitchCard({ user, activities }) {
	const activity = activities.filter((activity2) => activity2 && activity2.name && activity2.type === 1)[0];
	return BdApi.React.createElement("div", { className: "activityProfileContainer activityProfileContainerTwitch" }, BdApi.React.createElement("div", { className: "activityProfile activity" }, BdApi.React.createElement("div", { className: "bodyNormal", style: { display: "flex", alignItems: "center", width: "auto" } }, BdApi.React.createElement("div", { className: "assets", style: { position: "relative" } }, BdApi.React.createElement(
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

// activity_feed/components/now_playing/activities/components/CardVoice.tsx
function VoiceCard({ activities, voice, streams }) {
	if (!voice.length && !streams.length) return;
	const stream = streams[0]?.stream;
	const streamUser = streams[0]?.streamUser;
	const channel = stream ? ChannelStore$1.getChannel(stream.channelId) : voice[0]?.channel;
	const members = stream && !channel ? getVoiceParticipants({ voice: stream.channelId }) : voice[0]?.members;
	const server = voice[0]?.guild;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSection }, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSectionAssets }, BdApi.React.createElement(VoiceGuildAsset, { channel, streamUser, server })), BdApi.React.createElement(
		FlexInfo,
		{
			className: `${NowPlayingClasses.details} ${NowPlayingClasses.voiceSectionDetails}`,
			onClick: () => Common$1.OpenVoiceChannel.selectVoiceChannel(channel.id),
			channel,
			stream: streamUser,
			server,
			type: "VOICE"
		}
	), BdApi.React.createElement(VoiceCardTrailing, { members, server, channel })), activities.length ? BdApi.React.createElement("div", { className: MainClasses.sectionDivider }) : null);
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

// activity_feed/components/now_playing/CardBuilder.tsx
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

// activity_feed/components/now_playing/BaseBuilder.tsx
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

// settings/followed_games/FollowBuilder.tsx
function BlacklistBuilder({}) {
	return;
}

// settings/ActivityFeedSettings.module.css
const css = `
.blacklist_4cc1c3 {
		display: flex;
		flex-direction: column;
		gap: 8px;
}

.settingsDivider_4cc1c3 {
		margin-bottom: var(--space-12) !important;
}

.blacklist_4cc1c3 .sectionDivider_4cc1c3, .settingsDivider_4cc1c3 {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 4px 0 4px 0;
		border-color: var(--background-mod-strong);
}

.blacklist_4cc1c3 .sectionDivider_4cc1c3:last-child {
		display: none;
}

.blacklistItem_4cc1c3 {
		display: flex;
}

.blacklistItem_4cc1c3 .blacklistItemIcon_4cc1c3 {
		border-radius: 8px;
		height: 32px;
		width: 32px;
}

.blacklistItem_4cc1c3 .blacklistItemName_4cc1c3 {
		margin-left: 20px;
		margin-bottom: 0;
		min-width: 0;
		font-weight: 500;
		align-content: center;
		flex: 1;
}

.blacklistItem_4cc1c3 button {
		flex: 0 1 auto;
		align-self: center;
		width: auto;
		margin-left: 20px;
}

.search_4cc1c3 {
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

.toggleStack_4cc1c3 {
		padding: var(--space-16) 0 var(--space-16) 0;
}

.buttonItem_4cc1c3 {
		display: flex;
}`;
_loadStyle("ActivityFeedSettings.module.css", css);
const modules_a52d5642 = {
	"blacklist": "blacklist_4cc1c3",
	"settingsDivider": "settingsDivider_4cc1c3",
	"sectionDivider": "sectionDivider_4cc1c3",
	"blacklistItem": "blacklistItem_4cc1c3",
	"blacklistItemIcon": "blacklistItemIcon_4cc1c3",
	"blacklistItemName": "blacklistItemName_4cc1c3",
	"search": "search_4cc1c3",
	"toggleStack": "toggleStack_4cc1c3",
	"buttonItem": "buttonItem_4cc1c3"
};
const SettingsClasses = modules_a52d5642;

// settings/builder.tsx
function SettingsPanelBuilder() {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: SettingsClasses.toggleStack }, Object.keys(settings.main).map((key) => {
		const { name, note, initial, changed } = settings.main[key];
		const [state, setState] = react.useState(betterdiscord.Data.load(key));
		return BdApi.React.createElement(
			Common$1.FormSwitch,
			{
				label: name,
				description: note,
				checked: state ?? initial,
				onChange: (v) => {
					betterdiscord.Data.save(key, v);
					setState(v);
					if (changed) changed(v);
				}
			}
		);
	})), BdApi.React.createElement("div", { className: `${SettingsClasses.settingsDivider} ${MainClasses.sectionDivider}` }), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "Games You Follow", collapsible: false, shown: true }, BdApi.React.createElement("div", { className: `${SettingsClasses.blackList} ${SettingsClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.")), BdApi.React.createElement(BlacklistBuilder, null)), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "Advanced/Debug", collapsible: true, shown: false }, BdApi.React.createElement("div", { className: SettingsClasses.toggleStack }, Object.keys(settings.debug).map((key) => {
		const { name, note, initial, type, changed } = settings.debug[key];
		const [state, setState] = react.useState(betterdiscord.Data.load(key));
		if (type === "switch") return BdApi.React.createElement(
			Common$1.FormSwitch,
			{
				label: name,
				description: note,
				checked: state ?? initial,
				onChange: (v) => {
					betterdiscord.Data.save(key, v);
					setState(v);
					if (changed) changed(v);
				}
			}
		);
		if (type === "button") return BdApi.React.createElement("div", { className: SettingsClasses.buttonItem }, BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1 } }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`, style: { fontWeight: 500, fontSize: "16px", color: "var(--text-default)" } }, name), BdApi.React.createElement("div", { className: NowPlayingClasses.textRow }, note)), BdApi.React.createElement(
			"button",
			{
				className: `${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.colorPrimary} ${Common$1.ButtonVoidClasses.sizeTiny} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart} ${MainClasses.button} ${SettingsClasses.unhideBlacklisted}`,
				onClick: () => NewsStore.displaySet = NewsStore.getRandomFeeds(NewsStore.dataSet)
			},
			"Reroll"
		));
		return;
	}))));
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
	Object.getOwnPropertyDescriptors(betterdiscord.Webpack.getByKeys("itemCard")),
	Object.getOwnPropertyDescriptors(betterdiscord.Webpack.getByKeys("tabularNumbers")),
	Object.getOwnPropertyDescriptors(betterdiscord.Webpack.getByKeys("bar", "container", "progress")),
	Object.getOwnPropertyDescriptors(betterdiscord.Webpack.getModule((x) => x.buttonContainer && Object.keys(x).length === 1)),
	MainClasses,
	NowPlayingClasses,
	QuickLauncherClasses
);
const extraCSS = webpackify(`\n  	.description .sharedFilePreviewYouTubeVideo {\n  			display: none;\n  	}\n\n  	.nowPlayingColumn .tabularNumbers {\n  			color: var(--text-default) !important;\n  	}\n\n  	.nowPlayingColumn :is(.actionsActivity, .customButtons) {\n  			gap: 8px;\n  	}\n\n  	.nowPlayingColumn .header > .wrapper {\n  			display: flex;\n  			cursor: pointer;\n  			margin-right: 20px;\n  			transition: opacity .2s ease;\n  	}\n\n  	.customButtons {\n  			display: flex;\n  			flex-direction: column;\n  	}\n\n  	.headerActions {\n  			.button.lookFilled {\n  					background: var(--control-secondary-background-default);\n  					border: unset;\n  					color: var(--white);\n  					padding: 2px 16px;\n  					width: unset;\n  					svg {\n  							display: none;\n  					} \n  			}\n  			.button.lookFilled:hover {\n  					background-color: var(--control-secondary-background-hover) !important;\n  			}\n  			.button.lookFilled:active {\n  					background-color: var(--control-secondary-background-active) !important; \n  			}\n  			.lookFilled.colorPrimary {\n  					background: unset !important;\n  					border: unset !important;\n  			}\n  			.lookFilled.colorPrimary:hover {\n  					color: var(--interactive-background-hover);\n  					svg {\n  							stroke: var(--interactive-background-hover);\n  					}\n  			}\n  			.lookFilled.colorPrimary:active {\n  					color: var(--interactive-background-active);\n  					svg {\n  							stroke: var(--interactive-background-active);\n  					}\n  			}\n  	}\n\n  	.activityContainer:last-child:not(:only-child, :nth-child(1 of .activityContainer)) .sectionDivider {\n  			display: none;\n  	}\n\n  	.activity .serviceButtonWrapper .sm:not(.hasText) {\n  			padding: 0;\n  			width: calc(var(--custom-button-button-sm-height) + 4px);\n  	}\n\n  	.content .bar {\n  			background-color: var(--opacity-white-24);\n  	}\n\n  	.partyStatusWrapper .disabledButtonWrapper {\n  			flex: 1;\n  	}\n\n  	.partyStatusWrapper .disabledButtonOverlay {\n  			height: 24px;\n  			width: 100%;\n  	}\n\n  	.cardV2 {\n  			.headerActions .button.lookFilled, .cardBody button {\n  					color: var(--white);\n  					background: var(--opacity-white-24) !important;\n  					&:hover {\n  							background: var(--opacity-white-36) !important;\n  					}\n  					&:active {\n  							background: var(--opacity-white-32) !important;\n  					}\n  			}\n  			.tabularNumbers {\n  					color: var(--app-message-embed-secondary-text) !important;\n  			}\n  			.bar {\n  					background-color: var(--opacity-white-24);\n  			}\n  			.progress {\n  					background-color: var(--white);\n  			}\n  			.sectionDivider {\n  					border-color: var(--opacity-white-12) !important;\n  					border-width: 1px;\n  					margin: 12px 0 12px 0;\n  			} \n  	}\n\n  	.theme-light .nowPlaying .emptyState {\n  			background-color: #fff;\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlaying .emptyState {\n  			background-color: rgba(79, 84, 92, .3);\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .quickLauncher .emptyState, .theme-light .blacklist.emptyState {\n  			border-color: rgba(220,221,222,.6);\n  			color: #b9bbbe;\n  	}\n\n  	.theme-dark .quickLauncher .emptyState, .theme-dark .blacklist.emptyState {\n  			border-color: rgba(47,49,54,.6);\n  			color: #72767d;\n  	}\n\n  	.theme-light .nowPlayingColumn .sectionDivider {\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlayingColumn .sectionDivider {\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-dark .voiceSectionIconWrapper {\n  			background-color: var(--primary-800);\n  	}\n\n  	.theme-light .voiceSectionIconWrapper {\n  			background: var(--primary-300);\n  	}\n\n  	.quickLauncher .emptyState, .blacklist.emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  			align-items: center;\n  	}\n\n  	.blackList .emptyState {\n  			position: relative;\n  			padding: 0;\n  			border-bottom: unset; \n  			line-height: 1.60;\n  	}\n`);
function webpackify(css) {
	for (const key in styles) {
		let regex = new RegExp(`\\.${key}([\\s,.):>])`, "g");
		css = styles[key]?.value ? css.replace(regex, `.${styles[key].value}$1`) : css.replace(regex, `.${styles[key]}$1`);
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
	GameNewsStore = NewsStore;
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