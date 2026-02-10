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
	{ name: "Icons", filter: (x) => x.AppsIcon },
	{ name: "intl", filter: (x) => x.t && x.t.formatToMarkdownString },
	{ name: "JoinButton", filter: betterdiscord.Webpack.Filters.byStrings("user", "activity", "onAction", "onClose", "themeType", "embeddedActivity") },
	{ name: "LinkButton", filter: betterdiscord.Webpack.Filters.byStrings("route", "iconClassName"), searchExports: true },
	{ name: "LinkButtonClasses", filter: betterdiscord.Webpack.Filters.byKeys("linkButtonIcon") },
	{ name: "LiveBadge", filter: betterdiscord.Webpack.Filters.byStrings("shape", ".ROUND") },
	{ name: "MediaProgressBar", filter: betterdiscord.Webpack.Filters.byStrings("start", "end", "duration", "percentage"), searchExports: true },
	{ name: "ModalAccessUtils", filter: (x) => x.openUserProfileModal },
	{ name: "ModalRoot", filter: (x) => x.Modal },
	{ name: "OpenDM", filter: (x) => x.openPrivateChannel },
	{ name: "OpenVoiceChannel", filter: (x) => x.selectVoiceChannel, searchExports: true },
	{ name: "OpenSpotifyAlbum", filter: betterdiscord.Webpack.Filters.byStrings(".metadata)?void", ".EPISODE?"), searchExports: true },
	{ name: "OpenStream", filter: betterdiscord.Webpack.Filters.byStrings("guildId", "getWindowOpen", "CHANNEL_CALL_POPOUT"), searchExports: true },
	{ name: "Popout", filter: betterdiscord.Webpack.Filters.byStrings("Unsupported animation config:"), searchExports: true },
	{ name: "PopoutContainer", filter: betterdiscord.Webpack.Filters.byStrings("type", "position", "data-popout-animating"), searchExports: true },
	{ name: "PositionClasses", filter: betterdiscord.Webpack.Filters.byKeys("noWrap") },
	{ name: "RootSectionModule", filter: (x) => x?.key === "$Root", searchExports: true },
	{ name: "SpotifyButtons", filter: betterdiscord.Webpack.Filters.byStrings("activity", "PRESS_PLAY_ON_SPOTIFY_BUTTON") },
	{ name: "Tooltip", filter: betterdiscord.Webpack.Filters.byPrototypeKeys("renderTooltip"), searchExports: true },
	{ name: "UpperIconClasses", filter: betterdiscord.Webpack.Filters.byKeys("icon", "upperContainer") },
	{ name: "UseStreamPreviewURL", filter: betterdiscord.Webpack.Filters.byStrings(".canBasicChannel", "previewUrl:", ".CONNECT", "getVoiceChannelId") },
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
const useLocation = Object.values(betterdiscord.Webpack.getBySource(".location", "withRouter")).find((m) => m.length === 0 && String(m).includes(".location"));
const NavigationUtils = betterdiscord.Webpack.getMangled("Transitioning to", {
	transitionTo: betterdiscord.Webpack.Filters.byStrings("Transitioning to"),
	replace: betterdiscord.Webpack.Filters.byStrings('"Replacing route with "'),
	goBack: betterdiscord.Webpack.Filters.byStrings(".goBack()"),
	goForward: betterdiscord.Webpack.Filters.byStrings(".goForward()"),
	transitionToGuild: betterdiscord.Webpack.Filters.byStrings('"transitionToGuild - Transitioning to "')
});
const ModalSystem = betterdiscord.Webpack.getMangled(".modalKey?", {
	openModalLazy: betterdiscord.Webpack.Filters.byStrings(".modalKey?"),
	openModal: betterdiscord.Webpack.Filters.byStrings(",instant:"),
	closeModal: betterdiscord.Webpack.Filters.byStrings(".onCloseCallback()"),
	closeAllModals: betterdiscord.Webpack.Filters.byStrings(".getState();for")
});

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
	},
	external: {
		discord: {
			name: "Discord",
			note: "News from Discord's blog.",
			icon: Common$1.Icons.ClydeIcon,
			color: "var(--background-brand)",
			enabled: true
		},
		nintendo: {
			name: "Nintendo",
			note: "Nintendo news sourced from nintendoeverything.com.",
			icon: Common$1.Icons.NintendoSwitchNeutralIcon,
			color: "rgba(230, 0, 18, 1)",
			enabled: false
		},
		xbox: {
			name: "Xbox",
			note: "News from Xbox's blog.",
			icon: Common$1.Icons.XboxNeutralIcon,
			color: "var(--xbox)",
			enabled: false
		},
		playstation: {
			name: "PlayStation",
			note: "News from PlayStation's blog.",
			icon: Common$1.Icons.PlaystationNeutralIcon,
			color: "var(--playstation)",
			enabled: false
		}
	}
};

// modules/stores.js
const ApplicationStore = betterdiscord.Webpack.getStore("ApplicationStore");
const ChannelStore$1 = betterdiscord.Webpack.getStore("ChannelStore");
const DetectableGameSupplementalStore = betterdiscord.Webpack.getStore("DetectableGameSupplementalStore");
const GameStore = betterdiscord.Webpack.getStore("GameStore");
const GuildStore = betterdiscord.Webpack.getStore("GuildStore");
const NowPlayingViewStore = betterdiscord.Webpack.getStore("NowPlayingViewStore");
const RunningGameStore = betterdiscord.Webpack.getStore("RunningGameStore");
const ThemeStore = betterdiscord.Webpack.getStore("ThemeStore");
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
	whitelist = [];
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
		this.whitelist = [];
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
	setDebugFeeds() {
		BdApi.Webpack.getByKeys("fetchApplications").fetchApplication("1402418491272986635");
		const application = ApplicationStore.getApplicationByName("Minecraft");
		this.displaySet = [
			{
				index: 0,
				id: "TEST",
				application,
				news: {
					application_id: application.id,
					description: "this is a test article! For more information, visit https://example.com.",
					thumbnail: "https://files.catbox.moe/mfrfxj.png",
					timestamp: Date.now(),
					title: "Test Article 1",
					url: "https://example.com"
				},
				type: "application_news"
			},
			{
				index: 1,
				id: "TEST",
				application,
				news: {
					application_id: application.id,
					description: "this is a test article! For more information, visit https://example.com.",
					thumbnail: "https://static.wikia.nocookie.net/silly-cat/images/4/4f/Wire_Cat.png",
					timestamp: Date.now(),
					title: "Test Article 2",
					url: "https://example.com"
				},
				type: "application_news"
			},
			{
				index: 2,
				id: "TEST",
				application,
				news: {
					application_id: application.id,
					description: "this is a test article! For more information, visit https://example.com.",
					thumbnail: "https://files.catbox.moe/mfrfxj.png",
					timestamp: Date.now(),
					title: "Test Article 3",
					url: "https://example.com"
				},
				type: "application_news"
			},
			{
				index: 3,
				id: "TEST",
				application,
				news: {
					application_id: application.id,
					description: "this is a test article! For more information, visit https://example.com.",
					thumbnail: "https://static.wikia.nocookie.net/silly-cat/images/4/4f/Wire_Cat.png",
					timestamp: Date.now(),
					title: "Test Article 4",
					url: "https://example.com"
				},
				type: "application_news"
			}
		];
		this.article = this.displaySet[0];
	}
	getFeeds() {
		return this.dataSet;
	}
	setFeeds() {
		this.dataSet = Object.assign(this.dataSet, betterdiscord.Data.load("dataSet") ? betterdiscord.Data.load("dataSet") : {});
		this.blacklist = betterdiscord.Data.load("blacklist") || [];
		this.whitelist = betterdiscord.Data.load("whitelist") || this.initializeWhitelist();
		this.lastTimeFetched = betterdiscord.Data.load("lastTimeFetched");
		this.emitChange();
		return;
	}
	rerollFeeds() {
		this.displaySet = [];
		this.getFeedsForDisplay();
		this.emitChange();
	}
	getTime() {
		return this.lastTimeFetched;
	}
	initializeWhitelist() {
		let g = this.getFeeds();
		let k = Object.keys(g).filter((k2) => !isNaN(g[k2].news?.application_id));
		let f = {};
		for (let i in k) {
			f[k[i]] = g[k[i]];
		}
		let w = [];
		for (let k2 in f) {
			w.push({ applicationId: f[k2].application.id, gameId: f[k2].id });
		}
		return w;
	}
	getWhitelist() {
		return this.whitelist;
	}
	getBlacklist() {
		return this.blacklist;
	}
	getBlacklistedGame(gameId) {
		let b = this.blacklist;
		return b?.find((e) => e.gameId === gameId);
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
			b.push({ applicationId, gameId });
			console.log(this.blacklist);
			this.emitChange();
			betterdiscord.Data.save("blacklist", this.blacklist);
		}
		return;
	}
	whitelistGame(gameId) {
		let b = this.blacklist;
		const g = b.find((e) => e.game_id === gameId);
		b.splice(b.indexOf(g), 1);
		this.emitChange();
		betterdiscord.Data.save("blacklist", this.blacklist);
		return this.blacklist;
	}
	async #fetchDiscordFeeds() {
		const rssFeed = await Promise.all([betterdiscord.Net.fetch(`https://rssjson.vercel.app/api?url=https://discord.com/blog/rss.xml`).then((r) => r.ok ? r.json() : null)]);
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed?.[0]?.rss?.channel?.[0]?.title?.[0],
				id: "Discord"
			},
			appId: "Discord",
			description: article?.description?.[0],
			thumbnail: article?.["media:thumbnail"]?.[0].$.url,
			timestamp: article?.pubDate?.[0],
			title: article?.title?.[0],
			url: article?.link?.[0]
		};
	}
	async #fetchNintendoFeeds() {
		const rssFeed = await Promise.all([betterdiscord.Net.fetch(`https://rssjson.vercel.app/api?url=https://nintendoeverything.com/feed/`).then((r) => r.ok ? r.json() : null)]);
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed?.[0]?.rss?.channel?.[0]?.title?.[0],
				id: "Nintendo"
			},
			appId: "Nintendo",
			description: article?.description?.[0],
			thumbnail: article?.["media:content"]?.[0].$.url,
			timestamp: article?.pubDate?.[0],
			title: article?.title?.[0],
			url: article?.link?.[0]
		};
	}
	async #fetchXboxFeeds() {
	}
	async #fetchPlaystationFeeds() {
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
					case "discord":
						feeds = await this.#fetchDiscordFeeds();
						break;
					case "nintendo":
						feeds = await this.#fetchNintendoFeeds();
						break;
					default:
						feeds = await this.#fetchSteamFeeds(gameId2, gameData[gameId2]);
				}
				if (this.filterFeeds(feeds)) {
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
		for (let i in betterdiscord.Data.load("external")) {
			if ((betterdiscord.Data.load("external")[i] || settings.external[i].enabled) === true) {
				gameData[i] = "External Source";
			}
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
	filterFeeds(f) {
		const oW = new Date(Date.now() - 12096e5);
		return new Date(f.timestamp) > oW;
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
		let _keys = keys.filter((key) => !this.getBlacklistedGame(feeds[key].id) && this.filterFeeds(feeds[key].news));
		for (let g = 0; g < 4; g++) {
			if (g == _keys[_keys.length - 1]) break;
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
			for (let i = 0; i < rG.length; i++) {
				rG[i] = {
					...rG[i],
					index: i
				};
			}
			this.article = rG[0];
		}
		return rG;
	}
	getCurrentArticle() {
		return this.article;
	}
	setCurrentArticle(i) {
		try {
			this.article = this.displaySet[i];
		} catch {
			this.article = this.displaySet[0];
		}
		this.emitChange();
	}
	getOrientation() {
		const [width, height] = this.state.size?.length ? this.state.size : [WindowStore.windowSize().width, WindowStore.windowSize().height];
		return (width > 1200 || height < 600) && (width < 1200 || height > 600) ? "vertical" : "horizontal";
	}
	getDirection(e) {
		return e >= 0 ? 1 : -1;
	}
	setIdling(e) {
		this.idling = e;
		this.emitChange();
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
const css$4 = `
.activityFeed_21141b {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-border-frame);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

.scrollerBase_21141b {
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

.centerContainer_21141b {
		display: flex;
		flex-direction: column;
		width: 1280px;
		max-width: 100%;
		min-width: 480px;
		margin: 0 auto;
}

.title_21141b {
		align-items: center;
		display: flex;
		justify-content: flex-start;
		overflow: hidden;
		white-space: nowrap;
		font-size: 16px;
		font-weight: 500;
		line-height: 1.25;
		color: var(--text-strong);
}

.titleWrapper_21141b {
		flex: 0 0 auto;
		margin: 0 8px 0 0;
		min-width: auto;
}

.iconWrapper_21141b {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: var(--space-32);
		justify-content: center;
		margin: 0;
		position: relative;
		width: var(--space-32);
}

.headerBar_21141b {
		height: calc(var(--custom-channel-header-height) - 1px);
		min-height: calc(var(--custom-channel-header-height) - 1px);
}

.headerContainer_21141b {
		flex-direction: row;
}

.headerText_21141b {
		display: flex;
		flex: 1;
		font-size: 18px;
		font-weight: 500;
		line-height: 22px;
		margin-top: 20px;
		width: 100%;
		color: var(--text-default);
}

.button_21141b {
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

.sectionDivider_21141b {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 20px 0 20px 0;
}

.emptyState_21141b {
		position: relative;
}

.emptyText_21141b {}

.emptyTitle_21141b {
		font-size: 16px;
		line-height: 20px;
		color: var(--text-default);
}

.emptySubtitle_21141b {
		font-size: 14px;
		color: var(--text-muted);
}`;
_loadStyle("ActivityFeed.module.css", css$4);
const modules_7e65654a = {
	"activityFeed": "activityFeed_21141b",
	"scrollerBase": "scrollerBase_21141b",
	"centerContainer": "centerContainer_21141b",
	"title": "title_21141b",
	"titleWrapper": "titleWrapper_21141b",
	"iconWrapper": "iconWrapper_21141b",
	"headerBar": "headerBar_21141b",
	"headerContainer": "headerContainer_21141b",
	"headerText": "headerText_21141b",
	"button": "button_21141b",
	"sectionDivider": "sectionDivider_21141b",
	"emptyState": "emptyState_21141b",
	"emptyText": "emptyText_21141b",
	"emptyTitle": "emptyTitle_21141b",
	"emptySubtitle": "emptySubtitle_21141b"
};
const MainClasses = modules_7e65654a;

// activity_feed/components/application_news/ApplicationNews.module.css
const css$3 = `
.feedCarousel_ae3f66 {
		display: flex;
		position: relative;
		margin: 20px;
}

.carousel_ae3f66 {
		background-color: var(--background-secondary-alt);
		border-radius: 5px;
		flex: 1 1 75%;
		min-height: 388px;
		margin-right: 20px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

.article_ae3f66 {
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

.articleStandard_ae3f66 {}

.articleSkeleton_ae3f66 {}

.articleSimple_ae3f66 {}

.background_ae3f66 {
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 7.5%;
		mask: linear-gradient(0deg, transparent, #000);
		min-width: 300px;
		background-position: top;
}

.backgroundImage_ae3f66 {
		background-position: top;
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 0;
}

.background_ae3f66, .backgroundImage_ae3f66 {
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

.feedOverflowMenu_ae3f66 {
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 12px;
}

.applicationArea_ae3f66 {
		color: var(--text-default);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
}

.detailsContainer_ae3f66 {}

.details_ae3f66 {
		position: relative;
}

.titleStandard_ae3f66 {
		margin-top: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24px;
		line-height: 28px;
}

.title_ae3f66 {
		color: var(--text-strong);
		display: block;
		font-weight: 500;
}

.description_ae3f66 {
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
				display: contents;
		}
}

.timestamp_ae3f66 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.gameIcon_ae3f66 {
		position: relative;
		pointer-events: auto;
		cursor: pointer;
		height: 40px;
		width: 40px;
		flex-shrink: 0;
		border-radius: 3px;
}

.pagination_ae3f66 {
		-webkit-box-flex: 1;
		flex: 1 1 25%;
		min-width: 0;
}

.verticalPaginationItemContainer_ae3f66 {
		margin: 0;
		overflow: hidden;
}

.scrollerWrap_ae3f66 {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
		height: 100%;
		min-height: 1px;
		position: relative;
}

.scroller_ae3f66 {
		-webkit-box-flex: 1;
		contain: layout;
		flex: 1;
		min-height: 1px;
}
		
.paginationItem_ae3f66, .paginationItem_ae3f66:before {
		transition: all .2s ease;
}

.paginationItem_ae3f66:first-child {
		margin-top: 0;
}

.paginationItem_ae3f66 {
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

.paginationItem_ae3f66:before {
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

.paginationItem_ae3f66:after {
		background-blend-mode: color;
		border-radius: 5px;
		bottom: 0;
		content: "";
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

.splashArt_ae3f66 {
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

.paginationSubtitle_ae3f66, .paginationTitle_ae3f66 {
		font-weight: 600;
}

.paginationText_ae3f66 {
		overflow: hidden;
}

.paginationContent_ae3f66 {
		overflow: hidden;
		position: relative;
		z-index: 1;
}

.paginationTitle_ae3f66 {
		color: var(--text-strong);
		font-size: 16px;
		line-height: 1.25;
		max-height: 40px;
}

.paginationSubtitle_ae3f66 {
		color: var(--text-muted);
		font-size: 12px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.selectedPage_ae3f66 {
		background: var(--background-surface-higher);
		cursor: default;
}

.selectedPage_ae3f66:before {
		transform: translateY(-50%) translateX(0);
}

.selectedPage_ae3f66 .splashArt_ae3f66 {
		filter: grayscale(0);
}

.smallCarousel_ae3f66 {
		background-color: var(--background-secondary-alt);
		-webkit-box-flex: 1;
		border-radius: 5px;
		flex: 1;
		height: 220px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

.titleRowSimple_ae3f66 {
		-webkit-box-align: center;
		-webkit-box-pack: justify;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
}

.paginationSmall_ae3f66 {
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

.arrow_ae3f66 {
		color: var(--text-muted);
		z-index: 2;
}

svg.arrow_ae3f66 {
		height: 26px;
		width: 26px;
}

.arrowContainer_ae3f66 {
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

.arrow_ae3f66, .arrowContainer_ae3f66 {
		box-sizing: border-box;
		pointer-events: all;
}

.prevButtonContainer_ae3f66 {
		left: 6px;
}

.nextButtonContainer_ae3f66 {
		right: 6px;
}

.left_ae3f66 {
		transform: rotate(-90deg);
}

.right_ae3f66 {
		transform: rotate(90deg);
}

.horizontalPaginationItemContainer_ae3f66 {
		-webkit-box-align: center;
		-webkit-box-flex: initial;
		align-items: center;
		display: flex;
		flex: initial;
		margin: 0 auto;
		overflow-y: hidden;
}

.dot_ae3f66 {
		background-color: #fff;
		border-radius: 2px;
		cursor: pointer;
		height: 8px;
		margin-right: 8px;
		pointer-events: all;
		transform: translateZ(0);
		width: 8px;
}

.dotNormal_ae3f66 {
		opacity: 0.2;
}

.dotSelected_ae3f66 {
		opacity: 0.6;
}`;
_loadStyle("ApplicationNews.module.css", css$3);
const modules_98d78101 = {
	"feedCarousel": "feedCarousel_ae3f66",
	"carousel": "carousel_ae3f66",
	"article": "article_ae3f66",
	"articleStandard": "articleStandard_ae3f66",
	"articleSkeleton": "articleSkeleton_ae3f66",
	"articleSimple": "articleSimple_ae3f66",
	"background": "background_ae3f66",
	"backgroundImage": "backgroundImage_ae3f66",
	"feedOverflowMenu": "feedOverflowMenu_ae3f66",
	"applicationArea": "applicationArea_ae3f66",
	"detailsContainer": "detailsContainer_ae3f66",
	"details": "details_ae3f66",
	"titleStandard": "titleStandard_ae3f66",
	"title": "title_ae3f66",
	"description": "description_ae3f66",
	"timestamp": "timestamp_ae3f66",
	"gameIcon": "gameIcon_ae3f66",
	"pagination": "pagination_ae3f66",
	"verticalPaginationItemContainer": "verticalPaginationItemContainer_ae3f66",
	"scrollerWrap": "scrollerWrap_ae3f66",
	"scroller": "scroller_ae3f66",
	"paginationItem": "paginationItem_ae3f66",
	"splashArt": "splashArt_ae3f66",
	"paginationSubtitle": "paginationSubtitle_ae3f66",
	"paginationTitle": "paginationTitle_ae3f66",
	"paginationText": "paginationText_ae3f66",
	"paginationContent": "paginationContent_ae3f66",
	"selectedPage": "selectedPage_ae3f66",
	"smallCarousel": "smallCarousel_ae3f66",
	"titleRowSimple": "titleRowSimple_ae3f66",
	"paginationSmall": "paginationSmall_ae3f66",
	"arrow": "arrow_ae3f66",
	"arrowContainer": "arrowContainer_ae3f66",
	"prevButtonContainer": "prevButtonContainer_ae3f66",
	"nextButtonContainer": "nextButtonContainer_ae3f66",
	"left": "left_ae3f66",
	"right": "right_ae3f66",
	"horizontalPaginationItemContainer": "horizontalPaginationItemContainer_ae3f66",
	"dot": "dot_ae3f66",
	"dotNormal": "dotNormal_ae3f66",
	"dotSelected": "dotSelected_ae3f66"
};
const FeedClasses = modules_98d78101;

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

// activity_feed/components/application_news/components/OverflowBuilder.tsx
function FeedPopout({ applicationId, gameId, articleUrl, close }) {
	const confirmOptions = ["Be rid of it", "Yes", "Proceed"];
	const confirmText = confirmOptions[Math.floor(Math.random() * confirmOptions.length)];
	if (isNaN(applicationId)) {
		return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed=overflow", onClose: close }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: "Copy Article Link", action: () => Common$1.Clipboard(articleUrl) }));
	}
	return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed=overflow", onClose: close }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-app-id", label: "Copy Application ID", action: () => Common$1.Clipboard(applicationId) }), BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: "Copy Article Link", action: () => Common$1.Clipboard(articleUrl) }), BdApi.React.createElement(
		betterdiscord.ContextMenu.Item,
		{
			id: "unfollow-game",
			label: "Unfollow Game",
			action: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common$1.ModalRoot.Modal,
					{
						...props,
						title: "Are you sure?",
						actions: [
							{ text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: confirmText, fullWidth: 1, onClick: () => {
								NewsStore.blacklistGame(applicationId, gameId);
								props.onClose();
							} }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Do you want to hide this game from appearing in your Activity Feed? You can re-enable its visibility at any time in settings."), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, "This action will require you to restart Discord in order to see changes."))
				)
			)
		}
	));
}
function FeedOverflowBuilder({ applicationId, gameId, articleUrl, position }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement(
		Common$1.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(Common$1.PopoutContainer, { position }, BdApi.React.createElement(FeedPopout, { applicationId, gameId, articleUrl, close: () => setShowPopout(false) })),
			position,
			shouldShow: showPopout
		},
		(props) => BdApi.React.createElement(
			"div",
			{
				...props,
				ref: refDOM,
				onClick: () => setShowPopout(true),
				style: { position: "absolute", zIndex: 2, top: "0", right: "0" }
			},
			BdApi.React.createElement(Tooltip, { note: "More" }, BdApi.React.createElement("div", { className: FeedClasses.feedOverflowMenu }, BdApi.React.createElement("svg", { width: "24", height: "24" }, BdApi.React.createElement("path", { d: "M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z", fill: "white" }))))
		)
	);
}

// activity_feed/components/application_news/components/CarouselBuilder.tsx
function FeedCarouselBuilder({ currentArticle }) {
	const External = settings.external[currentArticle.id];
	return BdApi.React.createElement("span", { className: FeedClasses.carousel }, BdApi.React.createElement(FeedOverflowBuilder, { applicationId: currentArticle.application.id, gameId: currentArticle.id, articleUrl: currentArticle.news?.url, position: "right" }), BdApi.React.createElement(
		"a",
		{
			tabindex: currentArticle.index,
			className: `${Common$1.AnchorClasses.anchor} ${Common$1.AnchorClasses.anchorUnderlineOnHover}`,
			href: currentArticle.news?.url || "#",
			rel: "noreferrer nopener",
			target: "_blank",
			role: "button"
		},
		BdApi.React.createElement("div", { className: `${FeedClasses.articleStandard} ${FeedClasses.article}`, style: { opacity: 1, zIndex: 1 } }, BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: {
					backgroundImage: currentArticle.news?.thumbnail ? `url(${currentArticle.news?.thumbnail})` : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg)`
				}
			}
		)), BdApi.React.createElement("div", { className: FeedClasses.detailsContainer, style: { opacity: 1, zIndex: 1 } }, BdApi.React.createElement("div", { className: FeedClasses.applicationArea }, isNaN(currentArticle.news?.application_id) ? BdApi.React.createElement(External.icon, { className: FeedClasses.gameIcon, color: "WHITE", style: { backgroundColor: External.color, padding: "5px", width: "30px", height: "30px" } }) : BdApi.React.createElement(
			"img",
			{
				className: FeedClasses.gameIcon,
				src: currentArticle.news?.application_id && currentArticle.application?.icon ? `https://cdn.discordapp.com/app-icons/${currentArticle.news.application_id}/${currentArticle.application?.icon}.webp?size=64&keep_aspect_ratio=false` : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.news.application_id}/capsule_231x87.jpg`
			}
		), BdApi.React.createElement("div", { className: FeedClasses.details }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, currentArticle.news?.title || "No Title"), BdApi.React.createElement("div", { className: FeedClasses.description, dangerouslySetInnerHTML: { __html: currentArticle.news?.description || "No description available." } }), BdApi.React.createElement("div", { className: FeedClasses.timestamp }, Common$1.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), { dateStyle: "long" }))))))
	));
}

// activity_feed/components/application_news/components/MiniCarouselBuilder.tsx
function FeedMiniCarouselBuilder({ currentArticle }) {
	const External = settings.external[currentArticle.id];
	return BdApi.React.createElement("span", { className: FeedClasses.smallCarousel }, BdApi.React.createElement(FeedOverflowBuilder, { applicationId: currentArticle.application.id, gameId: currentArticle.id, articleUrl: currentArticle.news?.url, position: "right" }), BdApi.React.createElement(
		"a",
		{
			tabindex: currentArticle.index,
			className: `${Common$1.AnchorClasses.anchor} ${Common$1.AnchorClasses.anchorUnderlineOnHover}`,
			href: currentArticle.news?.url || "#",
			rel: "noreferrer nopener",
			target: "_blank",
			role: "button"
		},
		BdApi.React.createElement("div", { className: `${FeedClasses.articleSimple} ${FeedClasses.article}`, style: { opacity: 1, zIndex: 1 } }, BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: {
					backgroundImage: currentArticle.news?.thumbnail ? `url(${currentArticle.news?.thumbnail})` : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg)`
				}
			}
		)), BdApi.React.createElement("div", { className: FeedClasses.detailsContainer, style: { opacity: 1, zIndex: 1, marginBottom: "40px" } }, BdApi.React.createElement("div", { className: FeedClasses.applicationArea }, isNaN(currentArticle.news?.application_id) ? BdApi.React.createElement(External.icon, { className: FeedClasses.gameIcon, color: "WHITE", style: { backgroundColor: External.color, padding: "5px", width: "30px", height: "30px" } }) : BdApi.React.createElement(
			"img",
			{
				className: FeedClasses.gameIcon,
				src: currentArticle.news?.application_id && currentArticle.application?.icon ? `https://cdn.discordapp.com/app-icons/${currentArticle.news.application_id}/${currentArticle.application?.icon}.webp?size=64&keep_aspect_ratio=false` : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.news.application_id}/capsule_231x87.jpg`
			}
		), BdApi.React.createElement("div", { className: `${FeedClasses.titleRowSimple}` }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, currentArticle.news?.title || "No Title")))))
	));
}

// activity_feed/components/application_news/components/MiniPaginationBuilder.tsx
function MiniSubpagination({ article, currentArticle }) {
	return BdApi.React.createElement(
		"div",
		{
			className: article.index === currentArticle.index ? `${FeedClasses.dotSelected} ${FeedClasses.dot}` : `${FeedClasses.dotNormal} ${FeedClasses.dot}`,
			onClick: () => NewsStore.setCurrentArticle(article.index)
		}
	);
}
function FeedMiniPaginationBuilder({ articleSet, currentArticle }) {
	return BdApi.React.createElement("div", { className: FeedClasses.paginationSmall }, BdApi.React.createElement(
		"button",
		{
			type: "button",
			className: `${FeedClasses.prevButtonContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.grow}`,
			onClick: () => NewsStore.setCurrentArticle(currentArticle.index - 1),
			disabled: currentArticle.index === 0 && true
		},
		BdApi.React.createElement("div", { className: Common$1.ButtonVoidClasses.contents }, BdApi.React.createElement("svg", { width: "24", height: "24", className: `${FeedClasses.arrow} ${FeedClasses.left}` }, BdApi.React.createElement("polygon", { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8" })))
	), BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.horizontalPaginationItemContainer} ${Common$1.PositionClasses.alignCenter}` }, articleSet.map((article) => {
		if (!article) return;
		return BdApi.React.createElement(MiniSubpagination, { article, currentArticle });
	}))), BdApi.React.createElement(
		"button",
		{
			type: "button",
			className: `${FeedClasses.nextButtonContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.grow}`,
			onClick: () => NewsStore.setCurrentArticle(currentArticle.index + 1),
			disabled: currentArticle.index === 3 && true
		},
		BdApi.React.createElement("div", { className: Common$1.ButtonVoidClasses.contents }, BdApi.React.createElement("svg", { width: "24", height: "24", className: `${FeedClasses.arrow} ${FeedClasses.right}` }, BdApi.React.createElement("polygon", { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8" })))
	));
}

// activity_feed/components/application_news/components/PaginationBuilder.tsx
function Subpagination({ article }) {
	const currentArticle = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle());
	betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling());
	return BdApi.React.createElement(
		"div",
		{
			className: article.index === NewsStore.getCurrentArticle().index ? `${FeedClasses.paginationItem} ${FeedClasses.selectedPage}` : FeedClasses.paginationItem,
			onClick: () => {
				NewsStore.setCurrentArticle(article.index);
				NewsStore.setIdling(false);
				console.log(NewsStore.getDirection(article.index - currentArticle.index));
			},
			key: article
		},
		BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.splashArt,
				style: {
					backgroundImage: article.news?.thumbnail ? `url(${article.news?.thumbnail})` : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${article.id}/capsule_616x353.jpg)`
				}
			}
		),
		BdApi.React.createElement("div", { className: FeedClasses.paginationText }, BdApi.React.createElement("div", { className: `${FeedClasses.paginationTitle} ${FeedClasses.paginationContent}` }, article.news?.title || "No Title"), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSubtitle} ${FeedClasses.paginationContent}` }, article.application.name || "Unknown Game"))
	);
}
function FeedPaginationBuilder({ articleSet }) {
	return BdApi.React.createElement("div", { className: FeedClasses.pagination }, BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.verticalPaginationItemContainer}` }, articleSet.map((article) => {
		if (!article) return;
		return BdApi.React.createElement(Subpagination, { article });
	}))));
}

// activity_feed/components/application_news/components/SkeletonBuilder.tsx
function FeedSkeletonBuilder() {
	const type = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
	if (type === "vertical") {
		return BdApi.React.createElement("div", { className: FeedClasses.feedCarousel }, BdApi.React.createElement("span", { className: FeedClasses.carousel }, BdApi.React.createElement("div", { className: `${FeedClasses.articleSkeleton} ${FeedClasses.article}` })), BdApi.React.createElement("div", { className: FeedClasses.pagination }, BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.verticalPaginationItemContainer}` }, BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` }), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` }), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` }), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` })))));
	} else if (type === "horizontal") {
		return BdApi.React.createElement("div", { className: FeedClasses.feedCarousel }, BdApi.React.createElement("span", { className: FeedClasses.smallCarousel }, BdApi.React.createElement("div", { className: `${FeedClasses.articleSkeleton} ${FeedClasses.articleSimple} ${FeedClasses.article}` })));
	} else console.log(`Failed to get correct orientation! Here is the current value: ${type}`);
	return;
}

// activity_feed/components/application_news/components/SkeletonErrorBuilder.tsx
function FeedSkeletonErrorBuilder({ errorText, errorDescription }) {
	const type = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
	if (type === "vertical") {
		return BdApi.React.createElement("div", { className: FeedClasses.feedCarousel }, BdApi.React.createElement("span", { className: FeedClasses.carousel }, BdApi.React.createElement("div", { className: `${FeedClasses.articleSkeleton} ${FeedClasses.article}` }, BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: { backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" }
			}
		)), BdApi.React.createElement("div", { className: FeedClasses.detailsContainer }, BdApi.React.createElement("div", { className: FeedClasses.details }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, errorText), errorDescription && BdApi.React.createElement("div", { className: FeedClasses.description }, errorDescription))))));
	} else if (type === "horizontal") {
		return BdApi.React.createElement("div", { className: FeedClasses.feedCarousel }, BdApi.React.createElement("span", { className: FeedClasses.smallCarousel }, BdApi.React.createElement("div", { className: `${FeedClasses.articleSkeleton} ${FeedClasses.articleSimple} ${FeedClasses.article}` }, BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: { backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" }
			}
		)), BdApi.React.createElement("div", { className: FeedClasses.detailsContainer, style: { marginBottom: "40px" } }, BdApi.React.createElement("div", { className: FeedClasses.titleRowSimple }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, errorText))))));
	} else console.log(`Failed to get correct orientation! Here is the current value: ${type}`);
	return;
}

// activity_feed/components/application_news/FeedBuilder.tsx
function NewsFeedBuilder() {
	if (NewsStore.shouldFetch() === true) NewsStore.fetchFeeds();
	const articles = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getFeedsForDisplay());
	const currentArticle = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle());
	const orientation = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
	const isIdling = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling());
	const [time, setTime] = react.useState(new Date());
	const [waitTime, setWaitTime] = react.useState(true);
	react.useEffect(() => {
		const inv = setInterval(() => {
			const newTime = Math.floor((Math.floor((new Date()).getTime()) - Math.floor(time.getTime())) / 1e3);
			if (newTime > 0 && articles) {
				console.log(newTime);
				if (Math.floor(newTime) % 8 == 0 && isIdling) {
					NewsStore.setCurrentArticle(currentArticle.index === 3 ? currentArticle.index - 3 : currentArticle.index + 1);
				}
			}
		}, 8e3);
		return () => clearInterval(inv);
	});
	if (Object.keys(articles).length) return BdApi.React.createElement("div", { className: FeedClasses.feedCarousel, onMouseOver: () => {
		NewsStore.setIdling(false);
		setTime(new Date());
	}, onMouseLeave: () => {
		NewsStore.setIdling(true);
		setTime(new Date());
	} }, orientation === "vertical" ? BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(FeedCarouselBuilder, { currentArticle }), BdApi.React.createElement(FeedPaginationBuilder, { articleSet: articles })) : orientation === "horizontal" ? BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(FeedMiniCarouselBuilder, { currentArticle }), BdApi.React.createElement(FeedMiniPaginationBuilder, { articleSet: articles, currentArticle })) : BdApi.React.createElement(
		FeedSkeletonErrorBuilder,
		{
			errorText: "Activity Feed Unavailable",
			errorDescription: "You've reached an ultra rare error! Reload Discord to try again. Error: orientation-match-failed"
		}
	));
	setTimeout(() => setWaitTime(false), 1e4);
	if (waitTime) {
		return BdApi.React.createElement(FeedSkeletonBuilder, null);
	}
	return BdApi.React.createElement(
		FeedSkeletonErrorBuilder,
		{
			errorText: "Activity Feed Unavailable",
			errorDescription: "You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again."
		}
	);
}

// activity_feed/components/common/components/SectionHeader.jsx
function SectionHeader({ label }) {
	return BdApi.React.createElement("div", { className: `${MainClasses.headerContainer} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyBetween} ${Common$1.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: MainClasses.headerText }, label));
}

// activity_feed/components/quick_launcher/QuickLauncher.module.css
const css$2 = `
.quickLauncher_8e586c {
		display: block;
}

.dock_8e586c {
		margin-top: 10px;
		display: flex;
		overflow: hidden;
		flex-wrap: nowrap;
		max-width: 1280px;
}

.dockItem_8e586c {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: pointer;
		height: 100px;
		padding: 10px;
		width: 90px;
		flex-direction: column;
}

.dockIcon_8e586c:first-child {
		margin-left: 0;
}

.dockIcon_8e586c {
		background-size: 100%;
		border-radius: 3px;
		height: 40px;
		margin-bottom: 8px;
		transition: opacity .2s ease-in-out;
		width: 40px;
}

.dockItemText_8e586c {
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

.dockItemPlay_8e586c {
		display: none;
		z-index: 9999;
}

.dockItemPlay_8e586c:disabled, .dockItemPlay_8e586c[aria-disabled=true] {
		background-color: var(--green-active, var(--button-positive-background-active)) !important;
}

.dockItem_8e586c:hover {
		background: var(--background-base-lowest);
}

.dockItem_8e586c:hover .dockItemText_8e586c {
		display: none;
}

.dockItem_8e586c:hover .dockItemPlay_8e586c {
		display: flex;
}

.emptyIcon_8e586c {
		height: 24px;
		margin-right: 8px;
		width: 24px;
}`;
_loadStyle("QuickLauncher.module.css", css$2);
const modules_1116a9ae = {
	"quickLauncher": "quickLauncher_8e586c",
	"dock": "dock_8e586c",
	"dockItem": "dockItem_8e586c",
	"dockIcon": "dockIcon_8e586c",
	"dockItemText": "dockItemText_8e586c",
	"dockItemPlay": "dockItemPlay_8e586c",
	"emptyIcon": "emptyIcon_8e586c"
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
.nowPlaying_280635 {}

.nowPlayingContainer_280635 {
		display: flex;
		margin-top: var(--space-lg);
		gap: var(--space-lg);
}

.nowPlayingColumn_280635 {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: calc(50% - (var(--space-lg) / 2))
}

.nowPlayingContainer_280635 .itemCard_280635 {
		flex: 1 0 0;
		margin: 16px 16px 0 0;
}

.card_280635 {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
		transform: translateZ(0);
}
		
.cardHeader_280635 {
		padding: 20px;
		position: relative;
		flex-direction: row;
		background: var(--background-base-lowest);
}

.header_280635 {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
}

.nameTag_280635 {
		line-height: 17px;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;
		color: var(--text-default);
}

.username_280635 {
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

.username_280635:hover {
		text-decoration: underline;
}

.card_280635:hover .headerIcon_280635, .header_280635:has(.headerActions_280635[aria-expanded="true"]) .headerIcon_280635 {
		display: none;
}

.headerActions_280635 {
		display: none;
		margin-left: 8px;
}

.card_280635:hover .headerActions_280635, .headerActions_280635[aria-expanded="true"] {
		display: flex;
}

.overflowMenu_280635 {
		cursor: pointer;
		height: 24px;
		margin-left: 8px;
		transition: opacity .2s linear;
		width: 24px;
		color: var(--interactive-icon-hover);
}

.overflowMenu_280635:hover {
		color: var(--interactive-icon-default);
}

.headerIcon_280635 {
		border-radius: 4px;
		display: block;
		height: 30px;
		justify-self: end;
		width: 30px;
}

.splashArt_280635 {
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

.server_280635 {
		mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
		right: 0;
		left: unset;
}

.cardBody_280635 {
		display: flex;
		padding: 0 20px;
		background: var(--background-mod-strong)
}

.section_280635 {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

.game_280635 {
		padding: 20px 0;
}

.gameBody_280635 {
		flex-direction: column;
}

.activity_280635 {
		flex-direction: row;
}

.activity_280635:last-child:not(:only-child) {
		margin-top: 20px;
}

.activity_280635 .serviceButtonWrapper_280635 {
		gap: 6px;
		display: flex;
		flex-direction: row;
}

.richActivity_280635 {
		margin-top: 20px;
}

.activityActivityFeed_280635 {}

.activityFeed_280635 {
		-webkit-box-flex: 1;
		flex: 1 1 50%;
		min-width: 0;
}

.body_280635 {}

.bodyNormal_280635 {}

:is(.gameInfoRich_280635, .gameNameWrapper_280635) {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
}

.gameInfoRich_280635 {
		align-items: center;
}

.gameInfo_280635 {
		margin-left: 20px;
		min-width: 0;
		color: var(--text-default);
		font-weight: 500;
		flex: 1;
}

:is(.gameName_280635, .gameNameWrapper_280635, .streamInfo_280635) {
		overflow: hidden;
}

.gameName_280635 {
		font-size: 16px;
		line-height: 20px;
		margin-right: 10px;
		max-width: fit-content;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.gameName_280635.clickable_280635:hover {
		text-decoration: underline;
}

.playTime_280635:not(a) {
		color: var(--text-muted);
}
.playTime_280635 {
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.assets_280635 {
		position: relative;
}

.assetsLargeImageActivityFeed_280635 {
		width: 90px;
		height: 90px;
}

.assetsSmallImageActivityFeed_280635 {
		height: 30px;
		width: 30px;
}

.assets_280635 .assetsLargeImage_280635 {
		display: block;
		border-radius: 4px; 
		object-fit: cover;
}

.assets_280635 .assetsLargeImageActivityFeedTwitch_280635 {
		border-radius: 5px;
		height: 260px;
		mask: linear-gradient(0deg, transparent 10%, #000 80%);
		width: 100%;
}

.assets_280635:has(.assetsSmallImage_280635) .assetsLargeImage_280635 {
		mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
}

.richActivity_280635 .assetsSmallImage_280635, .richActivity_280635 .smallEmptyIcon_280635 {
		border-radius: 50%;
		position: absolute;
		bottom: -4px;
		right: -4px; 
}

.activity_280635 .smallEmptyIcon_280635 {
		width: 40px;
		height: 40px;
}

.assets_280635 .largeEmptyIcon_280635 {
		width: 90px;
		height: 90px;
}

.assets_280635 .largeEmptyIcon_280635 path {
		transform: scale(3.65) !important;
}

.richActivity_280635 svg.assetsSmallImage_280635 {
		border-radius: unset !important;
}   

.richActivity_280635 .smallEmptyIcon_280635 path {
		transform: scale(1.3) !important;
}

.assets_280635 .twitchImageContainer_280635 {
		background: var(--background-secondary-alt);
		border-radius: 5px;
		position: relative;
}

.assets_280635 .twitchBackgroundImage_280635 {
		display: inline-block;
		min-height: 260px;
}

.assets_280635 .twitchImageOverlay_280635 {
		bottom: 0;
		left: 0;
		padding: 16px;
		position: absolute;
		right: 0;
}

.assets_280635 .streamName_280635 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
		margin-top: 8px;
}

.assets_280635 .streamGame_280635 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.contentImagesActivityFeed_280635 {
		margin-left: 20px;
		color: var(--text-default);
}

:is(.gameInfo_280635, .contentImagesActivityFeed_280635) {
		align-self: center;
		display: grid;
}

.content_280635 {
		flex: 1;
		overflow: hidden;
}

.details_280635 {
		font-weight: 600;
}

.ellipsis_280635 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.textRow_280635 {
		display: block;
		font-size: 14px;
		line-height: 16px;
		margin-bottom: 4px;
}

.voiceSection_280635 {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
}

.voiceSectionAssets_280635 {
		align-items: center;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

.voiceSectionIconWrapper_280635 {
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

.voiceSectionIcon_280635 {
		color: var(--text-default);
		height: 12px;
		width: 12px;
}

.voiceSectionGuildImage_280635 {
		border-radius: 50%;
		mask: url('https://discord.com/assets/a90b040155ee449f.svg');
		mask-size: 100%;
		mask-type: luminance;
}

.voiceSection_280635 .details_280635 {
		flex: 1;
}

.voiceSectionDetails_280635 {
		cursor: pointer;
		margin-left: 20px;
		min-width: 0;
}

.voiceSectionDetails_280635:hover :is(.voiceSectionText_280635, .voiceSectionSubtext_280635) {
		text-decoration: underline;
}

.voiceSectionText_280635 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2857142857142858;
}

.voiceSectionSubtext_280635 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3333333333333333;
}

.userList_280635 {
		flex: 0 1 auto;
		justify-content: flex-end;
}

.voiceSection_280635 button {
		flex: 0 1 auto !important;
		width: auto !important;
		margin-left: 20px;
}

.streamSection_280635 {
		position: relative;
}

.applicationStreamingSection_280635 {
		display: grid;
		grid-template-columns: 32px minmax(20px, auto) max-content;
		-webkit-box-align: center;
		align-items: center;
		gap: 12px 12px;
}

.applicationStreamingAvatar_280635 {
		cursor: pointer;
}

.applicationStreamingDetails_280635 {
		margin-left: 16px;
		min-width: 0;
}

.applicationStreamingPreviewWrapper_280635 {
		margin-top: 12px;
		cursor: pointer;
		border-radius: 4px;
		position: relative;
}

.applicationStreamingPreviewSize_280635 {
		height: 100%;
		width: 100%;
}

.applicationStreamingPreview_280635 {
		width: 100%;
		height: 100%;
		object-fit: contain;
}

.applicationStreamingHoverWrapper_280635 {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		-webkit-box-align: center;
		align-items: center;
		-webkit-box-pack: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity 0.2s ease-in-out 0s;
}

.applicationStreamingHoverWrapper_280635:hover {
		opacity: 1;
}

.applicationStreamingHoverText_280635 {
		color: var(--white);
		font-size: 16px;
		font-weight: 600;
		line-height: 20px;
		background: rgba(0, 0, 0, 0.6);
		padding: 8px 20px;
		border-radius: 20px;
}

.emptyPreviewContainer_280635 {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-direction: column;
		align-items: center;
		justify-content: center;
}

.emptyPreviewImage_280635 {
		width: 80%;
		height: 60%;
		margin-bottom: 10px;
		background-position: 50% center;
		background-repeat: no-repeat;
}

.emptyPreviewText_280635 {
		color: var(--text-default);
}

.inner_280635 {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
}

.actionsActivity_280635 .buttonContainer_280635 {
		flex-direction: inherit;
}

.partyStatusWrapper_280635 {
		display: flex;
		gap: 4px;
		align-items: center;
}

.partyStatusWrapper_280635 button {
		flex: 0 1 50% !important;
		max-height: 24px;
		min-height: 24px !important;
		width: auto !important;
		justify-self: flex-end;
}

.partyList_280635 {
		display: flex;
}

.player_280635:first-of-type:not(:only-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.userOverflow_280635 {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		align-content: center;
		margin-right: 8px;
}

.emptyUser_280635:not(:first-of-type), .player_280635:not(:first-of-type) {
		margin-left: -4px;
}

.emptyUser_280635:not(:last-of-type), .player_280635:not(:last-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.emptyUser_280635, .player_280635 {
		width: 16px;
		height: 16px;
		border-radius: 50%;
}

.emptyUser_280635 svg {
		margin-left: 3px;
}

.partyPlayerCount_280635 {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3333333333333333;
		margin-top: 1px;
}

.cardV2_280635 {
		background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
		border-radius: var(--radius-md);
		outline: 1px solid var(--border-normal);
		outline-offset: -1px;
		box-sizing: border-box;
		background-clip: border-box;
		overflow: hidden;
		transform: translateZ(0);

		.cardHeader_280635 {
				padding: var(--space-lg);
				position: relative;
				flex-direction: row;
				background: unset;
		}
		.nameTag_280635 {
				color: var(--white);
		}
		.splashArt_280635, .server_280635 {
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
				.headerIcon_280635 {
						display: none;
				}
				.headerActions_280635 {
						display: flex;
				}
		}
		.cardBody_280635 {
				display: flex;
				gap: var(--space-lg);
				padding: 0 var(--space-lg) var(--space-lg);
				background: unset;
		}
		.section_280635 {
				background: var(--background-mod-normal);
				border-radius: var(--radius-sm);
				padding: var(--space-sm);
		}
		.game_280635 {
				padding: 0;
		}
		.voiceSectionText_280635 {
				color: var(--white);
		}
		.headerIcon_280635, .gameIcon_280635, .assetsLargeImage_280635.assetsLargeImage_280635 {
				border-radius: var(--radius-sm);
		}
		.gameInfo_280635 {
				color: var(--white);
		}
		.playTime_280635:not(a), .voiceSectionSubtext_280635 {
				color: var(--app-message-embed-secondary-text) !important;
		}
		.serviceButtonWrapper_280635 {
				margin-left: 20px;
				gap: 8px !important;
		}
		.contentImagesActivityFeed_280635 {
				color: var(--white);
		}
		.textRow_280635 {
				font-size: 16px;
				line-height: 18px;
		}
		.state_280635 {
				color: var(--app-message-embed-secondary-text);
				font-size: 14px;
				line-height: 16px;
		}
		.activity_280635:last-child:not(:only-child) {
				margin-top: 12px;
		}
		.applicationStreamingPreviewWrapper_280635 {
				background-color: var(--opacity-white-12);
				img {
						border-radius: var(--radius-sm);
				}
		}
}`;
_loadStyle("NowPlaying.module.css", css$1);
const modules_7260a078 = {
	"nowPlaying": "nowPlaying_280635",
	"nowPlayingContainer": "nowPlayingContainer_280635",
	"nowPlayingColumn": "nowPlayingColumn_280635",
	"itemCard": "itemCard_280635",
	"card": "card_280635",
	"cardHeader": "cardHeader_280635",
	"header": "header_280635",
	"nameTag": "nameTag_280635",
	"username": "username_280635",
	"headerIcon": "headerIcon_280635",
	"headerActions": "headerActions_280635",
	"overflowMenu": "overflowMenu_280635",
	"splashArt": "splashArt_280635",
	"server": "server_280635",
	"cardBody": "cardBody_280635",
	"section": "section_280635",
	"game": "game_280635",
	"gameBody": "gameBody_280635",
	"activity": "activity_280635",
	"serviceButtonWrapper": "serviceButtonWrapper_280635",
	"richActivity": "richActivity_280635",
	"activityActivityFeed": "activityActivityFeed_280635",
	"activityFeed": "activityFeed_280635",
	"body": "body_280635",
	"bodyNormal": "bodyNormal_280635",
	"gameInfoRich": "gameInfoRich_280635",
	"gameNameWrapper": "gameNameWrapper_280635",
	"gameInfo": "gameInfo_280635",
	"gameName": "gameName_280635",
	"streamInfo": "streamInfo_280635",
	"clickable": "clickable_280635",
	"playTime": "playTime_280635",
	"assets": "assets_280635",
	"assetsLargeImageActivityFeed": "assetsLargeImageActivityFeed_280635",
	"assetsSmallImageActivityFeed": "assetsSmallImageActivityFeed_280635",
	"assetsLargeImage": "assetsLargeImage_280635",
	"assetsLargeImageActivityFeedTwitch": "assetsLargeImageActivityFeedTwitch_280635",
	"assetsSmallImage": "assetsSmallImage_280635",
	"smallEmptyIcon": "smallEmptyIcon_280635",
	"largeEmptyIcon": "largeEmptyIcon_280635",
	"twitchImageContainer": "twitchImageContainer_280635",
	"twitchBackgroundImage": "twitchBackgroundImage_280635",
	"twitchImageOverlay": "twitchImageOverlay_280635",
	"streamName": "streamName_280635",
	"streamGame": "streamGame_280635",
	"contentImagesActivityFeed": "contentImagesActivityFeed_280635",
	"content": "content_280635",
	"details": "details_280635",
	"ellipsis": "ellipsis_280635",
	"textRow": "textRow_280635",
	"voiceSection": "voiceSection_280635",
	"voiceSectionAssets": "voiceSectionAssets_280635",
	"voiceSectionIconWrapper": "voiceSectionIconWrapper_280635",
	"voiceSectionIcon": "voiceSectionIcon_280635",
	"voiceSectionGuildImage": "voiceSectionGuildImage_280635",
	"voiceSectionDetails": "voiceSectionDetails_280635",
	"voiceSectionText": "voiceSectionText_280635",
	"voiceSectionSubtext": "voiceSectionSubtext_280635",
	"userList": "userList_280635",
	"streamSection": "streamSection_280635",
	"applicationStreamingSection": "applicationStreamingSection_280635",
	"applicationStreamingAvatar": "applicationStreamingAvatar_280635",
	"applicationStreamingDetails": "applicationStreamingDetails_280635",
	"applicationStreamingPreviewWrapper": "applicationStreamingPreviewWrapper_280635",
	"applicationStreamingPreviewSize": "applicationStreamingPreviewSize_280635",
	"applicationStreamingPreview": "applicationStreamingPreview_280635",
	"applicationStreamingHoverWrapper": "applicationStreamingHoverWrapper_280635",
	"applicationStreamingHoverText": "applicationStreamingHoverText_280635",
	"emptyPreviewContainer": "emptyPreviewContainer_280635",
	"emptyPreviewImage": "emptyPreviewImage_280635",
	"emptyPreviewText": "emptyPreviewText_280635",
	"inner": "inner_280635",
	"actionsActivity": "actionsActivity_280635",
	"buttonContainer": "buttonContainer_280635",
	"partyStatusWrapper": "partyStatusWrapper_280635",
	"partyList": "partyList_280635",
	"player": "player_280635",
	"userOverflow": "userOverflow_280635",
	"emptyUser": "emptyUser_280635",
	"partyPlayerCount": "partyPlayerCount_280635",
	"cardV2": "cardV2_280635",
	"gameIcon": "gameIcon_280635",
	"state": "state_280635"
};
const NowPlayingClasses = modules_7260a078;

// activity_feed/components/now_playing/activities/components/common/FlexInfo.tsx
function ActivityType({ type, activity, game, channel, server, stream, streamUser }) {
	useStateFromStores([GuildStore], () => GuildStore.getGuild(channel?.guild_id));
	switch (type) {
		case "REGULAR":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.gameNameWrapper }, BdApi.React.createElement("div", { className: NowPlayingClasses.gameName }, game?.name)), !activity?.assets?.large_image && BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, BdApi.React.createElement(TimeClock, { timestamp: activity.created_at })));
		case "RICH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity.details || activity?.state), activity?.details && BdApi.React.createElement("div", { className: `${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity?.state), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(Common$1.MediaProgressBar, { start: activity?.timestamps?.start || activity?.created_at, end: activity?.timestamps?.end })) : BdApi.React.createElement(Common$1.ActivityTimer, { activity }));
		case "TWITCH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, activity.state && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, `${Common$1.intl.intl.formatToPlainString(Common$1.intl.t[`BMTj28`])} ${activity.state}`));
		case "VOICE":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, server?.name || channel?.name || streamUser?.globalName), server && BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, channel?.name));
		case "STREAM":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { style: { display: "flex", alignItems: "flex-end" } }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, streamUser.globalName || streamUser.username), BdApi.React.createElement(Common$1.LiveBadge, { style: { marginLeft: "5px" } })), BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, Common$1.intl.intl.format(Common$1.intl.t["0wJXSh"], { name: BdApi.React.createElement("strong", null, stream.name) })));
	}
}
function FlexInfo(props) {
	const { className, style, onClick, activity, game, channel, stream, streamUser, server, type } = props;
	return BdApi.React.createElement("div", { className, style, onClick }, BdApi.React.createElement(
		ActivityType,
		{
			activity,
			game,
			channel,
			stream,
			streamUser,
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
	const { className, style, transform } = props;
	return BdApi.React.createElement("svg", { className, style }, BdApi.React.createElement(
		"path",
		{
			style: { transform },
			fill: "white",
			fillRule: "evenodd",
			d: "M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
		}
	));
}
function SpotifyAsset({ activity, user }) {
	const [shouldFallback, setShouldFallback] = react.useState(false);
	return BdApi.React.createElement(BdApi.React.Fragment, null, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: NowPlayingClasses.smallEmptyIcon, style: { width: "40px", height: "40px" }, transform: "scale(1.65)" }) : BdApi.React.createElement(
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
	return BdApi.React.createElement(BdApi.React.Fragment, null, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: NowPlayingClasses.gameIcon, style: { width: "40px", height: "40px" }, transform: "scale(1.65)" }) : BdApi.React.createElement(
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
	return BdApi.React.createElement(Tooltip, { note: tooltipText }, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: `${NowPlayingClasses[`assets${type}Image`]} ${NowPlayingClasses[`assets${type}ImageActivityFeed`]}`, transform: type === "Large" ? "scale(3.65)" : "scale(1.30)" }) : BdApi.React.createElement(
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
	return BdApi.React.createElement(BdApi.React.Fragment, null, !imageId ? BdApi.React.createElement(FallbackAsset, { className: "assetsLargeImage", transform: "scale(1.65)" }) : BdApi.React.createElement(
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

// activity_feed/components/now_playing/activities/components/CardStream.tsx
function StreamFallback() {
	return BdApi.React.createElement(
		"div",
		{
			className: `${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap}${Common$1.PositionClasses.alignCenter} ${Common$1.PositionClasses.justifyCenter} ${NowPlayingClasses.emptyPreviewContainer} ${NowPlayingClasses.applicationStreamingPreviewSize}`,
			style: { flex: "1 1 auto" }
		},
		BdApi.React.createElement("div", { className: NowPlayingClasses.emptyPreviewImage, style: { backgroundImage: "url(https://static.discord.com/assets/b93ef52d62a513a4f2127a6ca0c3208c.svg)" } }),
		BdApi.React.createElement("div", { className: NowPlayingClasses.emptyPreviewText }, Common$1.intl.intl.formatToPlainString(Common$1.intl.t["uQZTBV"]))
	);
}
function StreamPreview({ stream }) {
	const { previewUrl, isLoading } = Common$1.UseStreamPreviewURL(stream.guildId, stream.channelId, stream.ownerId);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, isLoading ? BdApi.React.createElement(StreamFallback, null) : BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, style: { position: "relative" } }, BdApi.React.createElement("img", { className: NowPlayingClasses.applicationStreamingPreview, src: previewUrl })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverWrapper, onClick: () => {
		return Common$1.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common$1.OpenStream(stream);
	} }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverText }, Common$1.intl.intl.formatToPlainString(Common$1.intl.t["7Xq/nV"]))));
}
function StreamCard({ stream, streamUser, streamActivity }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.streamSection }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingSection }, BdApi.React.createElement(Common$1.AvatarFetch, { imageClassName: "applicationStreamingAvatar", src: `https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=48`, size: "SIZE_40" }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.details} ${NowPlayingClasses.applicationStreamingDetails}`, type: "STREAM", stream: streamActivity, streamUser })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewWrapper, style: { paddingTop: "54.25%" } }, BdApi.React.createElement("div", { className: NowPlayingClasses.inner }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, BdApi.React.createElement(StreamPreview, { stream })))));
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
	const members = stream ? getVoiceParticipants({ voice: stream.channelId }) : voice[0]?.members;
	const server = voice[0]?.guild;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSection }, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSectionAssets }, BdApi.React.createElement(VoiceGuildAsset, { channel, streamUser, server })), BdApi.React.createElement(
		FlexInfo,
		{
			className: `${NowPlayingClasses.details} ${NowPlayingClasses.voiceSectionDetails}`,
			onClick: () => Common$1.OpenVoiceChannel.selectVoiceChannel(channel.id),
			channel,
			streamUser,
			server,
			type: "VOICE"
		}
	), BdApi.React.createElement(VoiceCardTrailing, { members, server, channel })), stream && streams[0]?.activity && BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.sectionDivider }), BdApi.React.createElement(StreamCard, { stream, streamUser, streamActivity: streams[0]?.activity })), activities.length ? BdApi.React.createElement("div", { className: MainClasses.sectionDivider }) : null);
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
			outputtedUsername = `${user.globalName || user.username}, ${Common$1.intl.intl.formatToPlainString(Common$1.intl.t["zRRd8G"], { count: voice[0]?.members.length - 2, name: voice[0]?.members[voice[0]?.members.length - 1].globalName || voice[0]?.members[voice[0]?.members.length - 1].username })}`;
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
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.headerActions} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart} ${Common$1.PositionClasses.alignCenter}`, style: { flex: "0" }, "aria-expanded": showPopout }, BdApi.React.createElement("button", { type: "button", className: `${MainClasses.button} ${Common$1.ButtonVoidClasses.sizeSmall} ${Common$1.ButtonVoidClasses.lookFilled}`, onClick: () => Common$1.OpenDM.openPrivateChannel({ recipientIds: user.id }) }, "Message"), BdApi.React.createElement(
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
		BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") || settings.default.v2Cards }),
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
	return BdApi.React.createElement("div", { className: MainClasses.activityFeed }, BdApi.React.createElement(Common$1.HeaderBar, { className: MainClasses.headerBar, "aria-label": "Activity" }, BdApi.React.createElement("div", { className: MainClasses.iconWrapper }, BdApi.React.createElement(Common$1.Icons.GameControllerIcon, null)), BdApi.React.createElement("div", { className: MainClasses.titleWrapper }, BdApi.React.createElement("div", { className: MainClasses.title }, "Activity"))), BdApi.React.createElement(Scroller, null, BdApi.React.createElement("div", { className: MainClasses.centerContainer }, BdApi.React.createElement(NewsFeedBuilder, null), BdApi.React.createElement(QuickLauncherBuilder, { className: QuickLauncherClasses.quickLauncher, style: { position: "relative", padding: "0 20px 0 20px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: NowPlayingClasses.nowPlaying, style: { position: "relative", padding: "0 20px 20px 20px" } }), BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))));
}

// settings/ActivityFeedSettings.module.css
const css = `
.blacklist_8ebe67 {
		display: flex;
		flex-direction: column;
		gap: 8px;
}

.settingsDivider_8ebe67 {
		margin-bottom: var(--space-12) !important;
}

.blacklistItem_8ebe67 {
		display: flex;
}

.blacklistItem_8ebe67 .blacklistItemIcon_8ebe67 {
		border-radius: 8px;
		height: 32px;
		width: 32px;
}

.blacklistItem_8ebe67 .blacklistItemName_8ebe67, .blacklistItem_8ebe67 .blacklistItemTextContainer_8ebe67 {
		margin-left: 20px;
		margin-bottom: 0;
		min-width: 0;
		font-weight: 500;
		align-content: center;
		flex: 1;
}

.blacklistItem_8ebe67 .blacklistItemTextContainer_8ebe67 > .blacklistItemName_8ebe67 {
		margin-left: 0;
}

.blacklistItem_8ebe67 .blacklistItemDescription_8ebe67 {}

.blacklistItem_8ebe67 button {
		flex: 0 1 auto;
		align-self: center;
		width: auto;
		margin-left: 20px;
}

.search_8ebe67 {
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

.toggleStack_8ebe67 {
		padding: var(--space-16) 0 var(--space-16) 0;
}

.buttonItem_8ebe67 {
		display: flex;
}`;
_loadStyle("ActivityFeedSettings.module.css", css);
const modules_a52d5642 = {
	"blacklist": "blacklist_8ebe67",
	"settingsDivider": "settingsDivider_8ebe67",
	"blacklistItem": "blacklistItem_8ebe67",
	"blacklistItemIcon": "blacklistItemIcon_8ebe67",
	"blacklistItemName": "blacklistItemName_8ebe67",
	"blacklistItemTextContainer": "blacklistItemTextContainer_8ebe67",
	"blacklistItemDescription": "blacklistItemDescription_8ebe67",
	"search": "search_8ebe67",
	"toggleStack": "toggleStack_8ebe67",
	"buttonItem": "buttonItem_8ebe67"
};
const SettingsClasses = modules_a52d5642;

// settings/followed_games/ExternalSources.tsx
function ExternalItemBuilder({ service }) {
	const item = settings.external[service];
	const [state, setState] = react.useState(betterdiscord.Data.load(service) || item.enabled);
	return BdApi.React.createElement("div", { className: SettingsClasses.blacklistItem, style: { display: "flex" } }, BdApi.React.createElement(item.icon, { className: SettingsClasses.blacklistItemIcon, color: "WHITE", style: { backgroundColor: item.color, padding: "5px" } }), BdApi.React.createElement("div", { className: SettingsClasses.blacklistItemTextContainer }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}` }, item.name || "Unknown Source"), item.note && BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemDescription} ${MainClasses.emptySubtitle}` }, item.note)), !state ? BdApi.React.createElement(
		"button",
		{
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.colorPrimary} ${Common$1.ButtonVoidClasses.sizeTiny} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common$1.ModalRoot.Modal,
					{
						...props,
						title: "Are you sure?",
						actions: [
							{ text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: "Yes", fullWidth: 1, onClick: () => {
								betterdiscord.Data.save("external", { [service]: true });
								setState(true);
								props.onClose();
							} }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Do you want to follow this source? Its announcements will appear in your Activity Feed."), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, "This action will require you to restart Discord in order to see changes."))
				)
			)
		},
		"Follow"
	) : BdApi.React.createElement(
		"button",
		{
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.colorPrimary} ${Common$1.ButtonVoidClasses.sizeTiny} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common$1.ModalRoot.Modal,
					{
						...props,
						title: "Are you sure?",
						actions: [
							{ text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: "Yes", fullWidth: 1, onClick: () => {
								betterdiscord.Data.save("external", { [service]: false });
								setState(false);
								props.onClose();
							} }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Do you want to unfollow this source? Its announcements will be hidden from your Activity Feed."), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, "This action will require you to restart Discord in order to see changes."))
				)
			)
		},
		"Unfollow"
	));
}
function ExternalSourcesListBuilder() {
	return BdApi.React.createElement("div", { className: SettingsClasses.blacklist }, Object.keys(settings.external).map((key) => {
		return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(ExternalItemBuilder, { service: key }), BdApi.React.createElement("div", { className: MainClasses.sectionDivider }));
	}));
}

// settings/followed_games/FollowedGames.tsx
function FollowedGameItemBuilder({ game, whitelist, blacklist, updateBlacklist, key }) {
	const application = GameStore.getDetectableGame(game.applicationId) || GameStore.getGameByApplication(ApplicationStore.getApplication(game.applicationId));
	const isUnfollowed = Boolean(NewsStore.getBlacklistedGame(game.gameId));
	return BdApi.React.createElement("div", { className: SettingsClasses.blacklistItem, style: { display: "flex" } }, BdApi.React.createElement(
		"img",
		{
			className: SettingsClasses.blacklistItemIcon,
			src: `https://cdn.discordapp.com/app-icons/${application?.id}/${application.icon}.webp?size=32&keep_aspect_ratio=false`
		}
	), BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}` }, application.name || "Unknown Game"), isUnfollowed ? BdApi.React.createElement(
		"button",
		{
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.colorPrimary} ${Common$1.ButtonVoidClasses.sizeTiny} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common$1.ModalRoot.Modal,
					{
						...props,
						title: "Are you sure?",
						actions: [
							{ text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: "Yes", fullWidth: 1, onClick: () => {
								NewsStore.whitelistGame(game.gameId);
								updateBlacklist(blacklist.filter((item) => item.gameId !== game.gameId));
								console.log(blacklist);
								props.onClose();
							} }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Do you want to follow this game? Its announcements will appear in your Activity Feed."), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, "This action will require you to restart Discord in order to see changes."))
				)
			)
		},
		"Follow"
	) : BdApi.React.createElement(
		"button",
		{
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common$1.ButtonVoidClasses.lookFilled} ${Common$1.ButtonVoidClasses.colorPrimary} ${Common$1.ButtonVoidClasses.sizeTiny} ${Common$1.PositionClasses.flex} ${Common$1.PositionClasses.noWrap} ${Common$1.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common$1.ModalRoot.Modal,
					{
						...props,
						title: "Are you sure?",
						actions: [
							{ text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: "Yes", fullWidth: 1, onClick: () => {
								NewsStore.blacklistGame(application.id, game.gameId);
								updateBlacklist(blacklist.filter((item) => item.gameId !== game.gameId));
								props.onClose();
							} }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Do you want to unfollow this game? Its announcements will be hidden from your Activity Feed."), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, "This action will require you to restart Discord in order to see changes."))
				)
			)
		},
		"Unfollow"
	));
}
function FollowedGameListBuilder() {
	const whitelist = NewsStore.getWhitelist();
	const [blacklist, updateBlacklist] = react.useState(NewsStore.getBlacklist());
	const [query, setQuery] = react.useState("");
	const filtered = react.useMemo(() => {
		const _query = query.toLowerCase();
		return whitelist?.filter((item) => (GameStore.getDetectableGame(item?.applicationId) || GameStore.getGameByApplication(ApplicationStore.getApplication(item?.applicationId)))?.name.toLowerCase().includes(_query));
	}, [whitelist, query]);
	console.log(filtered, query);
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(betterdiscord.Components.SearchInput, { className: SettingsClasses.search, onChange: (e) => setQuery(e.target.value.toLowerCase()), placeholder: "Search for Games" }), filtered?.length ? BdApi.React.createElement("div", { className: SettingsClasses.blacklist }, filtered.map(
		(game) => BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(FollowedGameItemBuilder, { game, whitelist, blacklist, updateBlacklist, key: game.applicationId }), BdApi.React.createElement("div", { className: MainClasses.sectionDivider }))
	)) : BdApi.React.createElement("div", { className: `${SettingsClasses.blacklist} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "No results.")));
}

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
	})), BdApi.React.createElement("div", { className: `${SettingsClasses.settingsDivider} ${MainClasses.sectionDivider}` }), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "Games You Follow", collapsible: false, shown: true }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklist} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.")), BdApi.React.createElement(FollowedGameListBuilder, null)), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "External News", collapsible: false, shown: true }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklist} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "News from external sources outside of your game library.")), BdApi.React.createElement(ExternalSourcesListBuilder, null)), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "Advanced/Debug", collapsible: true, shown: false }, BdApi.React.createElement("div", { className: SettingsClasses.toggleStack }, Object.keys(settings.debug).map((key) => {
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
				onClick: () => NewsStore.rerollFeeds()
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
	FeedClasses,
	NowPlayingClasses,
	QuickLauncherClasses,
	SettingsClasses
);
const extraCSS = webpackify(`\n  	.description .sharedFilePreviewYouTubeVideo {\n  			display: none;\n  	}\n\n  	.nowPlayingColumn .tabularNumbers {\n  			color: var(--text-default) !important;\n  	}\n\n  	.nowPlayingColumn :is(.actionsActivity, .customButtons) {\n  			gap: 8px;\n  	}\n\n  	.nowPlayingColumn .header > .wrapper {\n  			display: flex;\n  			cursor: pointer;\n  			margin-right: 20px;\n  			transition: opacity .2s ease;\n  	}\n\n  	.customButtons {\n  			display: flex;\n  			flex-direction: column;\n  	}\n\n  	.headerActions {\n  			.button.lookFilled {\n  					background: var(--control-secondary-background-default);\n  					border: unset;\n  					color: var(--white);\n  					padding: 2px 16px;\n  					width: unset;\n  					svg {\n  							display: none;\n  					} \n  			}\n  			.button.lookFilled:hover {\n  					background-color: var(--control-secondary-background-hover) !important;\n  			}\n  			.button.lookFilled:active {\n  					background-color: var(--control-secondary-background-active) !important; \n  			}\n  			.lookFilled.colorPrimary {\n  					background: unset !important;\n  					border: unset !important;\n  			}\n  			.lookFilled.colorPrimary:hover {\n  					color: var(--interactive-background-hover);\n  					svg {\n  							stroke: var(--interactive-background-hover);\n  					}\n  			}\n  			.lookFilled.colorPrimary:active {\n  					color: var(--interactive-background-active);\n  					svg {\n  							stroke: var(--interactive-background-active);\n  					}\n  			}\n  	}\n\n  	.activityContainer:last-child:not(:only-child, :nth-child(1 of .activityContainer)) .sectionDivider {\n  			display: none;\n  	}\n\n  	.activity .serviceButtonWrapper .sm:not(.hasText) {\n  			padding: 0;\n  			width: calc(var(--custom-button-button-sm-height) + 4px);\n  	}\n\n  	.content .bar {\n  			background-color: var(--opacity-white-24);\n  	}\n\n  	.partyStatusWrapper .disabledButtonWrapper {\n  			flex: 1;\n  	}\n\n  	.partyStatusWrapper .disabledButtonOverlay {\n  			height: 24px;\n  			width: 100%;\n  	}\n\n  	.theme-dark .applicationStreamingPreviewWrapper {\n  			background-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .applicationStreamingPreviewWrapper {\n  			background-color: var(--interactive-background-default);\n  	}\n\n  	.cardV2 {\n  			.headerActions .button.lookFilled, .cardBody button {\n  					color: var(--white);\n  					background: var(--opacity-white-24) !important;\n  					&:hover {\n  							background: var(--opacity-white-36) !important;\n  					}\n  					&:active {\n  							background: var(--opacity-white-32) !important;\n  					}\n  			}\n  			.tabularNumbers {\n  					color: var(--app-message-embed-secondary-text) !important;\n  			}\n  			.bar {\n  					background-color: var(--opacity-white-24);\n  			}\n  			.progress {\n  					background-color: var(--white);\n  			}\n  			.sectionDivider {\n  					border-color: var(--opacity-white-12) !important;\n  					border-width: 1px;\n  					margin: 12px 0 12px 0;\n  			} \n  	}\n\n  	.nowPlaying .emptyState {\n  			border: 1px solid;\n  			border-radius: 5px;\n  			box-sizing: border-box;\n  			margin-top: 20px;\n  			padding: 20px;\n  			width: 100%;\n  	}\n\n  	.theme-light .nowPlaying .emptyState {\n  			background-color: #fff;\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlaying .emptyState {\n  			background-color: rgba(79, 84, 92, .3);\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .quickLauncher .emptyState, .theme-light .blacklist.emptyState {\n  			border-color: rgba(220,221,222,.6);\n  			color: #b9bbbe;\n  	}\n\n  	.theme-dark .quickLauncher .emptyState, .theme-dark .blacklist.emptyState {\n  			border-color: rgba(47,49,54,.6);\n  			color: #72767d;\n  	}\n\n  	.theme-light .nowPlayingColumn .sectionDivider {\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlayingColumn .sectionDivider {\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-dark .voiceSectionIconWrapper {\n  			background-color: var(--primary-800);\n  	}\n\n  	.theme-light .voiceSectionIconWrapper {\n  			background: var(--primary-300);\n  	}\n\n  	.quickLauncher .emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  			align-items: center;\n  	}\n\n  	.blacklist.emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  	}\n\n  	.blackList .emptyState {\n  			position: relative;\n  			padding: 0;\n  			border-bottom: unset; \n  			line-height: 1.60;\n  	}\n\n  	.blacklist .sectionDivider, .settingsDivider {\n  			display: flex;\n  			width: 100%;\n  			border-bottom: 2px solid;\n  			margin: 4px 0 4px 0;\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.blacklist .sectionDivider:last-child {\n  			display: none;\n  	}\n`);
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
				return react.createElement(Common$1.Icons.GameControllerIcon, { color: "currentColor", className: Common$1.LinkButtonClasses.linkButtonIcon });
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
		const Route = betterdiscord.Webpack.getByStrings("disableTrack", "impressionName");
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