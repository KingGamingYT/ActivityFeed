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
	{ name: "ReactSpring", filter: betterdiscord.Webpack.Filters.byKeys("useSpring", "a") },
	{ name: "RootSectionModule", filter: (x) => x?.key === "$Root", searchExports: true },
	{ name: "Spinner", filter: betterdiscord.Webpack.Filters.byStrings('="wanderingCubes'), searchExports: true },
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
const Router = betterdiscord.Webpack.getMangled("Router-History", {
	useLocation: betterdiscord.Webpack.Filters.byRegex(/return .{1,4}.location/)
});
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
			icon: Common.Icons.ClydeIcon,
			color: "var(--background-brand)",
			enabled: true
		},
		nintendo: {
			name: "Nintendo",
			note: "Nintendo news sourced from nintendoeverything.com.",
			icon: Common.Icons.NintendoSwitchNeutralIcon,
			color: "rgba(230, 0, 18, 1)",
			enabled: false
		},
		xbox: {
			name: "Xbox",
			note: "News from Xbox's blog.",
			icon: Common.Icons.XboxNeutralIcon,
			color: "var(--xbox)",
			enabled: false
		}
	}
};

// modules/stores.js
const ApplicationStore = betterdiscord.Webpack.getStore("ApplicationStore");
const ChannelStore = betterdiscord.Webpack.getStore("ChannelStore");
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
		this.dataSet = betterdiscord.Data.load("dataSet") ? Object.assign(this.dataSet, betterdiscord.Data.load("dataSet")) : {};
		this.whitelist = betterdiscord.Data.load("whitelist") || [];
		this.blacklist = betterdiscord.Data.load("blacklist") || [];
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
		if (!this.getBlacklistedGame(gameId)) {
			b.push({ applicationId, gameId });
			this.emitChange();
			betterdiscord.Data.save("blacklist", this.blacklist);
		}
		return;
	}
	whitelistGame(gameId) {
		let b = this.blacklist;
		const g = this.getBlacklistedGame(gameId);
		console.log(b);
		b.splice(b.indexOf(g), 1);
		this.emitChange();
		console.log(b);
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
		const rssFeed = await Promise.all([BdApi.Net.fetch(`https://rssjson.vercel.app/api?url=https://news.xbox.com/en-us/feed/`).then((r) => r.ok ? r.json() : null)]);
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed?.[0]?.rss?.channel?.[0]?.title?.[0],
				id: "Xbox"
			},
			appId: "Xbox",
			description: article?.description?.[0],
			thumbnail: article?.["content:encoded"]?.[0].match(/\"(https:\/\/xboxwire.thesourcemediaassets.com\/sites\/\d+\/\d+\/\d+\/.*(?=).(jpg|jpeg|png))\"/)[1],
			timestamp: article?.pubDate?.[0],
			title: article?.title?.[0],
			url: article?.link?.[0]
		};
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
					case "xbox":
						feeds = await this.#fetchXboxFeeds();
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
		await Common.FetchApplications.fetchApplications(gameIds);
		applicationList = gameList.map((game) => ApplicationStore.getApplicationByName(game.name)).filter((game) => game && game.thirdPartySkus.length > 0 && game.thirdPartySkus.some((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"));
		const feedIds = applicationList.map((game) => {
			const steamSku = game.thirdPartySkus.find((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite");
			return steamSku?.sku || game.name;
		});
		for (let i = 0; i < feedIds.length; i++) {
			gameData[feedIds[i]] = applicationList[i];
			this.whitelist[i] = { applicationId: applicationList[i].id, gameId: feedIds[i] };
		}
		for (let i in betterdiscord.Data.load("external") ?? settings.external) {
			if ((betterdiscord.Data.load("external") && betterdiscord.Data.load("external")[i] || settings.external[i].enabled) === true) {
				gameData[i] = "External Source";
			}
		}
		betterdiscord.Data.save("whitelist", this.whitelist);
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
		if (!_keys.length) return;
		for (let g = 0; g < 4; g++) {
			if (g > _keys.length) break;
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
		if (this.displaySet[i]) {
			this.article = this.displaySet[i];
		} else {
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
.activityFeed_05583e {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-border-frame);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

.scrollerBase_05583e {
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

.centerContainer_05583e {
		display: flex;
		flex-direction: column;
		width: 1280px;
		max-width: 100%;
		min-width: 480px;
		margin: 0 auto;
}

.title_05583e {
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

.titleWrapper_05583e {
		flex: 0 0 auto;
		margin: 0 8px 0 0;
		min-width: auto;
}

.iconWrapper_05583e {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: var(--space-32);
		justify-content: center;
		margin: 0;
		position: relative;
		width: var(--space-32);
}

.headerBar_05583e {
		height: var(--custom-channel-header-height);
		min-height: var(--custom-channel-header-height);
}

.headerContainer_05583e {
		flex-direction: row;
}

.headerText_05583e {
		display: flex;
		flex: 1;
		font-size: 18px;
		font-weight: 500;
		line-height: 22px;
		margin-top: 20px;
		width: 100%;
		color: var(--text-default);
}

.button_05583e {
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

.sectionDivider_05583e {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 20px 0 20px 0;
}

.emptyState_05583e {
		position: relative;
}

.emptyText_05583e {}

.emptyTitle_05583e {
		font-size: 16px;
		line-height: 20px;
		color: var(--text-default);
}

.emptySubtitle_05583e {
		font-size: 14px;
		color: var(--text-muted);
}`;
_loadStyle("ActivityFeed.module.css", css$4);
const modules_7e65654a = {
	"activityFeed": "activityFeed_05583e",
	"scrollerBase": "scrollerBase_05583e",
	"centerContainer": "centerContainer_05583e",
	"title": "title_05583e",
	"titleWrapper": "titleWrapper_05583e",
	"iconWrapper": "iconWrapper_05583e",
	"headerBar": "headerBar_05583e",
	"headerContainer": "headerContainer_05583e",
	"headerText": "headerText_05583e",
	"button": "button_05583e",
	"sectionDivider": "sectionDivider_05583e",
	"emptyState": "emptyState_05583e",
	"emptyText": "emptyText_05583e",
	"emptyTitle": "emptyTitle_05583e",
	"emptySubtitle": "emptySubtitle_05583e"
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

// activity_feed/components/common/components/TooltipBuilder.tsx
const Tooltip = ({ note, position, children }) => {
	return BdApi.React.createElement(Common.Tooltip, { text: note, position: position || "top" }, (props) => {
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
		return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed=overflow", onClose: close }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: "Copy Article Link", action: () => Common.Clipboard(articleUrl) }));
	}
	return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed=overflow", onClose: close }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-app-id", label: "Copy Application ID", action: () => Common.Clipboard(applicationId) }), BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: "Copy Article Link", action: () => Common.Clipboard(articleUrl) }), BdApi.React.createElement(
		betterdiscord.ContextMenu.Item,
		{
			id: "unfollow-game",
			label: "Unfollow Game",
			action: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
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
		Common.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(Common.PopoutContainer, { position }, BdApi.React.createElement(FeedPopout, { applicationId, gameId, articleUrl, close: () => setShowPopout(false) })),
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
	Common.ReactSpring.useSpring(
		() => NewsStore.getOrientation() === "horizontal" ? {
			from: { x: 0, y: 0 },
			to: { x: 15, y: 15 }
		} : {
			from: { x: 0, y: 0 },
			to: { x: 15, y: 15 }
		}
	);
	return BdApi.React.createElement("span", { className: FeedClasses.carousel }, BdApi.React.createElement(FeedOverflowBuilder, { applicationId: currentArticle.application.id, gameId: currentArticle.id, articleUrl: currentArticle.news?.url, position: "right" }), BdApi.React.createElement(
		"a",
		{
			tabindex: currentArticle.index,
			className: `${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`,
			href: currentArticle.news?.url || "#",
			rel: "noreferrer nopener",
			target: "_blank",
			role: "button"
		},
		BdApi.React.createElement(Common.ReactSpring.animated.div, { className: `${FeedClasses.articleStandard} ${FeedClasses.article}`, style: { opacity: 1, zIndex: 1 } }, BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
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
		), BdApi.React.createElement("div", { className: FeedClasses.details }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, currentArticle.news?.title || "No Title"), BdApi.React.createElement("div", { className: FeedClasses.description, dangerouslySetInnerHTML: { __html: currentArticle.news?.description || "No description available." } }), BdApi.React.createElement("div", { className: FeedClasses.timestamp }, Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), { dateStyle: "long" }))))))
	));
}

// activity_feed/components/application_news/components/MiniCarouselBuilder.tsx
function FeedMiniCarouselBuilder({ currentArticle }) {
	const External = settings.external[currentArticle.id];
	return BdApi.React.createElement("span", { className: FeedClasses.smallCarousel }, BdApi.React.createElement(FeedOverflowBuilder, { applicationId: currentArticle.application.id, gameId: currentArticle.id, articleUrl: currentArticle.news?.url, position: "right" }), BdApi.React.createElement(
		"a",
		{
			tabindex: currentArticle.index,
			className: `${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`,
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
			className: `${FeedClasses.prevButtonContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`,
			onClick: () => NewsStore.setCurrentArticle(currentArticle.index - 1),
			disabled: currentArticle.index === 0 && true
		},
		BdApi.React.createElement("div", { className: Common.ButtonVoidClasses.contents }, BdApi.React.createElement("svg", { width: "24", height: "24", className: `${FeedClasses.arrow} ${FeedClasses.left}` }, BdApi.React.createElement("polygon", { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8" })))
	), BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.horizontalPaginationItemContainer} ${Common.PositionClasses.alignCenter}` }, articleSet.map((article) => {
		if (!article) return;
		return BdApi.React.createElement(MiniSubpagination, { article, currentArticle });
	}))), BdApi.React.createElement(
		"button",
		{
			type: "button",
			className: `${FeedClasses.nextButtonContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`,
			onClick: () => NewsStore.setCurrentArticle(currentArticle.index + 1),
			disabled: currentArticle.index === 3 && true
		},
		BdApi.React.createElement("div", { className: Common.ButtonVoidClasses.contents }, BdApi.React.createElement("svg", { width: "24", height: "24", className: `${FeedClasses.arrow} ${FeedClasses.right}` }, BdApi.React.createElement("polygon", { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8" })))
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
	return BdApi.React.createElement("div", { className: `${MainClasses.headerContainer} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: MainClasses.headerText }, label));
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
	return BdApi.React.createElement("div", { className: `${QuickLauncherClasses.dockItem} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, BdApi.React.createElement("div", { className: QuickLauncherClasses.dockIcon, style: { backgroundImage: `url(${"https://cdn.discordapp.com/app-icons/" + GameStore.getGameByName(game.name).id + "/" + GameStore.getGameByName(game.name).icon + ".webp"})` } }), BdApi.React.createElement("div", { className: QuickLauncherClasses.dockItemText }, game.name), BdApi.React.createElement(
		"button",
		{
			className: `${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`,
			disabled: disableCheck,
			onClick: () => {
				setDisable(true);
				shell.openExternal(game.exePath);
			}
		},
		BdApi.React.createElement("div", { className: `${Common.ButtonVoidClasses.contents}` }, "Play")
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
		if (chunkLength * (i + 1) <= cards.length) chunks.push(cards.slice(Math.ceil(chunkLength * i), Math.ceil(chunkLength * (i + 1))));
	}
	return chunks;
}
function TimeClock({ timestamp }) {
	const time = Math.floor((Date.now() - new Date(parseInt(timestamp))) / 1e3);
	if (time / 86400 > 1) {
		return Common.intl.intl.formatToPlainString(Common.intl.t["2rUo/p"], { time: Math.floor(time / 86400) });
	} else if (time / 3600 > 1) {
		return Common.intl.intl.formatToPlainString(Common.intl.t["eNoooU"], { time: Math.floor(time / 3600) });
	} else if (time / 60 > 1) {
		return Common.intl.intl.formatToPlainString(Common.intl.t["03mIHW"], { time: Math.floor(time / 60) });
	} else if (time % 60 < 60) {
		return Common.intl.intl.formatToPlainString(Common.intl.t["ahzZr+"]);
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
		case !!(activity?.assets && activity?.assets.large_image?.includes("external")):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case !!(activity?.assets && activity?.assets.large_image):
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
	return Common.GradientComponent(input || null);
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
		case !!(voice && !activity):
			input = "https://cdn.discordapp.com/banners/" + voice[0]?.guild?.id + "/" + voice[0]?.guild?.banner + ".webp?size=1024&keep_aspect_ratio=true";
			break;
		case !!(voice && stream):
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
		switch (activities[i]?.activity?.type) {
			case 0:
				pass.playing = 1;
				break;
			case 1:
				pass.streaming = 1;
				break;
			case 2:
				pass.listening = 1;
				break;
			case 3:
				pass.watching = 1;
				break;
			case 4:
				pass.custom = 1;
				break;
			case 5:
				pass.competing = 1;
				break;
		}
		if (activities[i]?.activity?.platform?.includes("xbox")) {
			pass.xbox = 1;
		}
		if (activities[i]?.activity?.platform?.includes("playstation") || activities[i]?.platform?.includes("ps5")) {
			pass.playstation = 1;
		}
		if (isSpotify) {
			pass.spotify = 1;
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
.nowPlaying_77d53e {}

.nowPlayingContainer_77d53e {
		display: flex;
		margin-top: var(--space-lg);
		gap: var(--space-lg);
}

.nowPlayingColumn_77d53e {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: calc(50% - (var(--space-lg) / 2))
}

.nowPlayingContainer_77d53e .itemCard_77d53e {
		flex: 1 0 0;
		margin: 16px 16px 0 0;
}

.card_77d53e {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
		transform: translateZ(0);
}
		
.cardHeader_77d53e {
		padding: 20px;
		position: relative;
		flex-direction: row;
		background: var(--background-base-lowest);
}

.header_77d53e {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
}

.nameTag_77d53e {
		line-height: 17px;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;
		color: var(--text-default);
}

.username_77d53e {
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

.username_77d53e:hover {
		text-decoration: underline;
}

.card_77d53e:hover .headerIcon_77d53e, .header_77d53e:has(.headerActions_77d53e[aria-expanded="true"]) .headerIcon_77d53e {
		display: none;
}

.headerActions_77d53e {
		display: none;
		margin-left: 8px;
}

.card_77d53e:hover .headerActions_77d53e, .headerActions_77d53e[aria-expanded="true"] {
		display: flex;
}

.overflowMenu_77d53e {
		cursor: pointer;
		height: 24px;
		margin-left: 8px;
		transition: opacity .2s linear;
		width: 24px;
		color: var(--interactive-icon-hover);
}

.overflowMenu_77d53e:hover {
		color: var(--interactive-icon-default);
}

.headerIcon_77d53e {
		border-radius: 4px;
		display: block;
		height: 30px;
		justify-self: end;
		width: 30px;
}

.splashArt_77d53e {
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

.server_77d53e {
		mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
		right: 0;
		left: unset;
}

.cardBody_77d53e {
		display: flex;
		padding: 0 20px;
		background: var(--background-mod-strong)
}

.section_77d53e {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

.game_77d53e {
		padding: 20px 0;
}

.gameBody_77d53e {
		flex-direction: column;
}

.activity_77d53e {
		flex-direction: row;
}

.activity_77d53e:last-child:not(:only-child) {
		margin-top: 20px;
}

.activity_77d53e .serviceButtonWrapper_77d53e {
		gap: 6px;
		display: flex;
		flex-direction: row;
}

.richActivity_77d53e {
		margin-top: 20px;
}

.activityActivityFeed_77d53e {}

.activityFeed_77d53e {
		-webkit-box-flex: 1;
		flex: 1 1 50%;
		min-width: 0;
}

.body_77d53e {}

.bodyNormal_77d53e {}

:is(.gameInfoRich_77d53e, .gameNameWrapper_77d53e) {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
}

.gameInfoRich_77d53e {
		align-items: center;
}

.gameInfo_77d53e {
		margin-left: 20px;
		min-width: 0;
		color: var(--text-default);
		font-weight: 500;
		flex: 1;
}

:is(.gameName_77d53e, .gameNameWrapper_77d53e, .streamInfo_77d53e) {
		overflow: hidden;
}

.gameName_77d53e {
		font-size: 16px;
		line-height: 20px;
		margin-right: 10px;
		max-width: fit-content;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.gameName_77d53e.clickable_77d53e:hover {
		text-decoration: underline;
}

.playTime_77d53e:not(a) {
		color: var(--text-muted);
}
.playTime_77d53e {
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.assets_77d53e {
		position: relative;
}

.assetsLargeImageActivityFeed_77d53e {
		width: 90px;
		height: 90px;
}

.assetsSmallImageActivityFeed_77d53e {
		height: 30px;
		width: 30px;
}

.assets_77d53e .assetsLargeImage_77d53e {
		display: block;
		border-radius: 4px; 
		object-fit: cover;
}

.assets_77d53e .assetsLargeImageActivityFeedTwitch_77d53e {
		border-radius: 5px;
		min-height: 260px;
		mask: linear-gradient(0deg, transparent 10%, #000 80%);
		width: 100%;
		-webkit-user-drag: none;
}

.assets_77d53e:has(.assetsSmallImage_77d53e) .assetsLargeImage_77d53e {
		mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
}

.richActivity_77d53e .assetsSmallImage_77d53e, .richActivity_77d53e .smallEmptyIcon_77d53e {
		border-radius: 50%;
		position: absolute;
		bottom: -4px;
		right: -4px; 
}

.activity_77d53e .smallEmptyIcon_77d53e {
		width: 40px;
		height: 40px;
}

.assets_77d53e .largeEmptyIcon_77d53e {
		width: 90px;
		height: 90px;
}

.assets_77d53e .largeEmptyIcon_77d53e path {
		transform: scale(3.65) !important;
}

.richActivity_77d53e svg.assetsSmallImage_77d53e {
		border-radius: unset !important;
}   

.richActivity_77d53e .smallEmptyIcon_77d53e path {
		transform: scale(1.3) !important;
}

.assets_77d53e .twitchImageContainer_77d53e {
		background: var(--background-secondary-alt);
		border-radius: 5px;
		position: relative;
}

.assets_77d53e .twitchBackgroundImage_77d53e {
		display: inline-block;
		min-height: 260px;
}

.assets_77d53e .twitchImageOverlay_77d53e {
		bottom: 0;
		left: 0;
		padding: 16px;
		position: absolute;
		right: 0;
}

.assets_77d53e .streamName_77d53e {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
		margin-top: 8px;
}

.assets_77d53e .streamGame_77d53e {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.contentImagesActivityFeed_77d53e {
		margin-left: 20px;
		color: var(--text-default);
}

:is(.gameInfo_77d53e, .contentImagesActivityFeed_77d53e) {
		align-self: center;
		display: grid;
}

.content_77d53e {
		flex: 1;
		overflow: hidden;
}

.details_77d53e {
		font-weight: 600;
}

.ellipsis_77d53e {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.textRow_77d53e {
		display: block;
		font-size: 14px;
		line-height: 16px;
		margin-bottom: 4px;
}

.voiceSection_77d53e {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
}

.voiceSectionAssets_77d53e {
		align-items: center;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

.voiceSectionIconWrapper_77d53e {
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

.voiceSectionIcon_77d53e {
		color: var(--text-default);
		height: 12px;
		width: 12px;
}

.voiceSectionGuildImage_77d53e {
		border-radius: 50%;
		mask: url('https://discord.com/assets/a90b040155ee449f.svg');
		mask-size: 100%;
		mask-type: luminance;
}

.voiceSection_77d53e .details_77d53e {
		flex: 1;
}

.voiceSectionDetails_77d53e {
		cursor: pointer;
		margin-left: 20px;
		min-width: 0;
}

.voiceSectionDetails_77d53e:hover :is(.voiceSectionText_77d53e, .voiceSectionSubtext_77d53e) {
		text-decoration: underline;
}

.voiceSectionText_77d53e {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2857142857142858;
}

.voiceSectionSubtext_77d53e {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3333333333333333;
}

.userList_77d53e {
		flex: 0 1 auto;
		justify-content: flex-end;
}

.voiceSection_77d53e button {
		flex: 0 1 auto !important;
		width: auto !important;
		margin-left: 20px;
}

.streamSection_77d53e {
		position: relative;
}

.applicationStreamingSection_77d53e {
		display: grid;
		grid-template-columns: 32px minmax(20px, auto) max-content;
		-webkit-box-align: center;
		align-items: center;
		gap: 12px 12px;
}

.applicationStreamingAvatar_77d53e {
		cursor: pointer;
}

.applicationStreamingDetails_77d53e {
		margin-left: 16px;
		min-width: 0;
}

.applicationStreamingPreviewWrapper_77d53e {
		margin-top: 12px;
		cursor: pointer;
		border-radius: 4px;
		position: relative;
}

.applicationStreamingPreviewSize_77d53e {
		height: 100%;
		width: 100%;
}

.applicationStreamingPreview_77d53e {
		width: 100%;
		height: 100%;
		object-fit: contain;
}

.applicationStreamingHoverWrapper_77d53e {
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

.applicationStreamingHoverWrapper_77d53e:hover {
		opacity: 1;
}

.applicationStreamingHoverText_77d53e {
		color: var(--white);
		font-size: 16px;
		font-weight: 600;
		line-height: 20px;
		background: rgba(0, 0, 0, 0.6);
		padding: 8px 20px;
		border-radius: 20px;
}

.emptyPreviewContainer_77d53e {
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

.emptyPreviewImage_77d53e {
		width: 80%;
		height: 60%;
		margin-bottom: 10px;
		background-position: 50% center;
		background-repeat: no-repeat;
}

.emptyPreviewText_77d53e {
		color: var(--text-default);
}

.inner_77d53e {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
}

.actionsActivity_77d53e .buttonContainer_77d53e {
		flex-direction: inherit;
}

.partyStatusWrapper_77d53e {
		display: flex;
		gap: 4px;
		align-items: center;
}

.partyStatusWrapper_77d53e button {
		flex: 0 1 50% !important;
		max-height: 24px;
		min-height: 24px !important;
		width: auto !important;
		justify-self: flex-end;
}

.partyList_77d53e {
		display: flex;
}

.player_77d53e:first-of-type:not(:only-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.userOverflow_77d53e {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		align-content: center;
		margin-right: 8px;
}

.emptyUser_77d53e:not(:first-of-type), .player_77d53e:not(:first-of-type) {
		margin-left: -4px;
}

.emptyUser_77d53e:not(:last-of-type), .player_77d53e:not(:last-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.emptyUser_77d53e, .player_77d53e {
		width: 16px;
		height: 16px;
		border-radius: 50%;
}

.emptyUser_77d53e svg {
		margin-left: 3px;
}

.partyPlayerCount_77d53e {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3333333333333333;
		margin-top: 1px;
}

.cardV2_77d53e {
		background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
		border-radius: var(--radius-md);
		outline: 1px solid var(--border-normal);
		outline-offset: -1px;
		box-sizing: border-box;
		background-clip: border-box;
		overflow: hidden;
		transform: translateZ(0);

		.cardHeader_77d53e {
				padding: var(--space-lg);
				position: relative;
				flex-direction: row;
				background: unset;
		}
		.nameTag_77d53e {
				color: var(--white);
		}
		.splashArt_77d53e, .server_77d53e {
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
				.headerIcon_77d53e {
						display: none;
				}
				.headerActions_77d53e {
						display: flex;
				}
		}
		.cardBody_77d53e {
				display: flex;
				gap: var(--space-lg);
				padding: 0 var(--space-lg) var(--space-lg);
				background: unset;
		}
		.section_77d53e {
				background: var(--background-mod-normal);
				border-radius: var(--radius-sm);
				padding: var(--space-sm);
		}
		.game_77d53e {
				padding: 0;
		}
		.voiceSectionText_77d53e {
				color: var(--white);
		}
		.headerIcon_77d53e, .gameIcon_77d53e, .assetsLargeImage_77d53e.assetsLargeImage_77d53e {
				border-radius: var(--radius-sm);
		}
		.gameInfo_77d53e {
				color: var(--white);
		}
		.playTime_77d53e:not(a), .voiceSectionSubtext_77d53e {
				color: var(--app-message-embed-secondary-text) !important;
		}
		.serviceButtonWrapper_77d53e {
				margin-left: 20px;
				gap: 8px !important;
		}
		.contentImagesActivityFeed_77d53e {
				color: var(--white);
		}
		.textRow_77d53e {
				font-size: 16px;
				line-height: 18px;
		}
		.state_77d53e {
				color: var(--app-message-embed-secondary-text);
				font-size: 14px;
				line-height: 16px;
		}
		.activity_77d53e:last-child:not(:only-child) {
				margin-top: 12px;
		}
		.applicationStreamingPreviewWrapper_77d53e {
				background-color: var(--opacity-white-12);
				img {
						border-radius: var(--radius-sm);
				}
		}
}`;
_loadStyle("NowPlaying.module.css", css$1);
const modules_7260a078 = {
	"nowPlaying": "nowPlaying_77d53e",
	"nowPlayingContainer": "nowPlayingContainer_77d53e",
	"nowPlayingColumn": "nowPlayingColumn_77d53e",
	"itemCard": "itemCard_77d53e",
	"card": "card_77d53e",
	"cardHeader": "cardHeader_77d53e",
	"header": "header_77d53e",
	"nameTag": "nameTag_77d53e",
	"username": "username_77d53e",
	"headerIcon": "headerIcon_77d53e",
	"headerActions": "headerActions_77d53e",
	"overflowMenu": "overflowMenu_77d53e",
	"splashArt": "splashArt_77d53e",
	"server": "server_77d53e",
	"cardBody": "cardBody_77d53e",
	"section": "section_77d53e",
	"game": "game_77d53e",
	"gameBody": "gameBody_77d53e",
	"activity": "activity_77d53e",
	"serviceButtonWrapper": "serviceButtonWrapper_77d53e",
	"richActivity": "richActivity_77d53e",
	"activityActivityFeed": "activityActivityFeed_77d53e",
	"activityFeed": "activityFeed_77d53e",
	"body": "body_77d53e",
	"bodyNormal": "bodyNormal_77d53e",
	"gameInfoRich": "gameInfoRich_77d53e",
	"gameNameWrapper": "gameNameWrapper_77d53e",
	"gameInfo": "gameInfo_77d53e",
	"gameName": "gameName_77d53e",
	"streamInfo": "streamInfo_77d53e",
	"clickable": "clickable_77d53e",
	"playTime": "playTime_77d53e",
	"assets": "assets_77d53e",
	"assetsLargeImageActivityFeed": "assetsLargeImageActivityFeed_77d53e",
	"assetsSmallImageActivityFeed": "assetsSmallImageActivityFeed_77d53e",
	"assetsLargeImage": "assetsLargeImage_77d53e",
	"assetsLargeImageActivityFeedTwitch": "assetsLargeImageActivityFeedTwitch_77d53e",
	"assetsSmallImage": "assetsSmallImage_77d53e",
	"smallEmptyIcon": "smallEmptyIcon_77d53e",
	"largeEmptyIcon": "largeEmptyIcon_77d53e",
	"twitchImageContainer": "twitchImageContainer_77d53e",
	"twitchBackgroundImage": "twitchBackgroundImage_77d53e",
	"twitchImageOverlay": "twitchImageOverlay_77d53e",
	"streamName": "streamName_77d53e",
	"streamGame": "streamGame_77d53e",
	"contentImagesActivityFeed": "contentImagesActivityFeed_77d53e",
	"content": "content_77d53e",
	"details": "details_77d53e",
	"ellipsis": "ellipsis_77d53e",
	"textRow": "textRow_77d53e",
	"voiceSection": "voiceSection_77d53e",
	"voiceSectionAssets": "voiceSectionAssets_77d53e",
	"voiceSectionIconWrapper": "voiceSectionIconWrapper_77d53e",
	"voiceSectionIcon": "voiceSectionIcon_77d53e",
	"voiceSectionGuildImage": "voiceSectionGuildImage_77d53e",
	"voiceSectionDetails": "voiceSectionDetails_77d53e",
	"voiceSectionText": "voiceSectionText_77d53e",
	"voiceSectionSubtext": "voiceSectionSubtext_77d53e",
	"userList": "userList_77d53e",
	"streamSection": "streamSection_77d53e",
	"applicationStreamingSection": "applicationStreamingSection_77d53e",
	"applicationStreamingAvatar": "applicationStreamingAvatar_77d53e",
	"applicationStreamingDetails": "applicationStreamingDetails_77d53e",
	"applicationStreamingPreviewWrapper": "applicationStreamingPreviewWrapper_77d53e",
	"applicationStreamingPreviewSize": "applicationStreamingPreviewSize_77d53e",
	"applicationStreamingPreview": "applicationStreamingPreview_77d53e",
	"applicationStreamingHoverWrapper": "applicationStreamingHoverWrapper_77d53e",
	"applicationStreamingHoverText": "applicationStreamingHoverText_77d53e",
	"emptyPreviewContainer": "emptyPreviewContainer_77d53e",
	"emptyPreviewImage": "emptyPreviewImage_77d53e",
	"emptyPreviewText": "emptyPreviewText_77d53e",
	"inner": "inner_77d53e",
	"actionsActivity": "actionsActivity_77d53e",
	"buttonContainer": "buttonContainer_77d53e",
	"partyStatusWrapper": "partyStatusWrapper_77d53e",
	"partyList": "partyList_77d53e",
	"player": "player_77d53e",
	"userOverflow": "userOverflow_77d53e",
	"emptyUser": "emptyUser_77d53e",
	"partyPlayerCount": "partyPlayerCount_77d53e",
	"cardV2": "cardV2_77d53e",
	"gameIcon": "gameIcon_77d53e",
	"state": "state_77d53e"
};
const NowPlayingClasses = modules_7260a078;

// activity_feed/components/now_playing/activities/components/common/FlexInfo.tsx
function ActivityType({ type, activity, game, channel, server, stream, streamUser }) {
	useStateFromStores([GuildStore], () => GuildStore.getGuild(channel?.guild_id));
	switch (type) {
		case "REGULAR":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.gameNameWrapper }, BdApi.React.createElement("div", { className: NowPlayingClasses.gameName }, game?.name)), !activity?.assets?.large_image && BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, BdApi.React.createElement(TimeClock, { timestamp: activity.created_at })));
		case "RICH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity.details || activity?.state), activity?.details && BdApi.React.createElement("div", { className: `${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity?.state), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(Common.MediaProgressBar, { start: activity?.timestamps?.start || activity?.created_at, end: activity?.timestamps?.end })) : BdApi.React.createElement(Common.ActivityTimer, { activity }));
		case "TWITCH":
			return BdApi.React.createElement("div", { className: NowPlayingClasses.streamInfo }, BdApi.React.createElement("div", { className: NowPlayingClasses.gameName }, game?.name), BdApi.React.createElement(
				"a",
				{
					className: `${Common.ButtonVoidClasses.lookLink} ${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover} ${NowPlayingClasses.playTime}`,
					href: activity.url,
					rel: "noreferrer nopener",
					target: "_blank",
					role: "button"
				},
				activity.url
			));
		case "TWITCH_OVERLAY":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.streamName }, activity.details), BdApi.React.createElement("div", { className: NowPlayingClasses.streamGame }, Common.intl.intl.formatToPlainString(Common.intl.t["IGYgjl"], { gameName: activity.state })));
		case "VOICE":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, server?.name || channel?.name || streamUser?.globalName), server && BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, channel?.name));
		case "STREAM":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { style: { display: "flex", alignItems: "flex-end" } }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, streamUser.globalName || streamUser.username), BdApi.React.createElement(Common.LiveBadge, { style: { marginLeft: "5px" } })), BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, Common.intl.intl.format(Common.intl.t["0wJXSh"], { name: BdApi.React.createElement("strong", null, stream.name) })));
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
						Common.AvatarFetch,
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
		Common.VoiceList,
		{
			className: `${NowPlayingClasses.userList}`,
			users: players,
			maxUsers: players.length,
			guildId: server?.id,
			size: "SIZE_32"
		}
	), check?.spotify !== 0 && BdApi.React.createElement("div", { className: `${NowPlayingClasses.serviceButtonWrapper}` }, BdApi.React.createElement(Common.SpotifyButtons, { user, activity })), !activity?.name.includes("YouTube Music") && activity?.assets ? null : BdApi.React.createElement(
		"div",
		{
			className: `${MainClasses.button} ${NowPlayingClasses.actionsActivity} ${Common.ButtonVoidClasses.lookFilled} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`,
			style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }
		},
		v2Enabled && activity?.party && activity?.party?.size ? null : BdApi.React.createElement(Common.ActivityButtons, { user, activity })
	));
}
function RichCardTrailing({ activity, user, v2Enabled }) {
	const [width, height] = useWindowSize();
	return BdApi.React.createElement(BdApi.React.Fragment, null, width > 1240 && !activity?.name.includes("YouTube Music") && BdApi.React.createElement(
		"div",
		{
			className: `${MainClasses.button} ${NowPlayingClasses.actionsActivity} ${Common.ButtonVoidClasses.lookFilled} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`,
			style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }
		},
		v2Enabled && activity?.party && activity?.party?.size ? null : BdApi.React.createElement(Common.ActivityButtons, { user, activity })
	));
}
function VoiceCardTrailing({ members, server, channel }) {
	const [width, height] = useWindowSize();
	if (width <= 1240) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(
		Common.VoiceList,
		{
			className: NowPlayingClasses.userList,
			users: members,
			maxUsers: 5,
			guildId: server?.id,
			channelId: channel.id,
			size: "SIZE_32"
		}
	), BdApi.React.createElement(Common.CallButtons, { channel }));
}
function PartyFooter({ party, players, user, activity }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.sectionDivider, style: { margin: "8px 0 8px 0" } }), BdApi.React.createElement("div", { className: NowPlayingClasses.partyStatusWrapper }, BdApi.React.createElement(PartyMemberListBuilder, { activity, users: players }), BdApi.React.createElement(
		"div",
		{
			className: NowPlayingClasses.partyPlayerCount,
			style: { flex: "1 1 100%" }
		},
		Common.intl.intl.formatToPlainString(Common.intl.t["gLu7NU"], { partySize: party.size[0], maxPartySize: party.size[1] })
	), BdApi.React.createElement(Common.JoinButton, { user, activity })));
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
			onClick: () => Common.openSpotifyAlbumFromStatus(activity, user.id),
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
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: id });
	return BdApi.React.createElement(BdApi.React.Fragment, null, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: NowPlayingClasses.gameIcon, style: { width: "40px", height: "40px" }, transform: "scale(1.65)" }) : BdApi.React.createElement(
		"img",
		{
			className: NowPlayingClasses.gameIcon,
			style: { width: "40px", height: "40px", cursor: useGameProfile && "pointer" },
			"aria-label": Common.intl.intl.formatToPlainString(Common.intl.t["nh+jWk"], { game: name }),
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
function TwitchImageAsset({ url, imageId, streamUrl }) {
	return BdApi.React.createElement(
		"a",
		{
			className: `${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover} ${NowPlayingClasses.twitchBackgroundImage}`,
			href: streamUrl,
			rel: "noreferrer nopener",
			target: "_blank"
		},
		!imageId ? BdApi.React.createElement(FallbackAsset, { className: `${NowPlayingClasses.assetsLargeImageActivityFeedTwitch} ${NowPlayingClasses.assetsLargeImage}`, transform: "scale(1.65)" }) : BdApi.React.createElement(
			"img",
			{
				className: `${NowPlayingClasses.assetsLargeImageActivityFeedTwitch} ${NowPlayingClasses.assetsLargeImage}`,
				alt: null,
				src: url,
				onError: (e) => e.currentTarget.src = "https://static-cdn.jtvnw.net/ttv-static/404_preview-900x500.jpg"
			}
		)
	);
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
					case !!(channel && channel?.icon):
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
	return BdApi.React.createElement("div", { className: `${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter} ${Common.PositionClasses.flex} ${NowPlayingClasses.activity}`, style: { flex: "1 1 auto" } }, (() => {
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
function RegularTwitchActivityBuilder({ user, activity, game }) {
	return BdApi.React.createElement("div", { className: `${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter} ${Common.PositionClasses.flex} ${NowPlayingClasses.twitchActivity}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(GameIconAsset, { url: `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`, id: activity?.application_id, name: game?.name }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.gameInfoRich} ${NowPlayingClasses.gameInfo}`, activity, game, type: "TWITCH" }), BdApi.React.createElement(RichCardTrailing, { activity, user }));
}
function RichActivityBuilder({ user, activity, v2Enabled }) {
	return BdApi.React.createElement("div", { className: `${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignStretch} ${Common.PositionClasses.flex} ${NowPlayingClasses.richActivity}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common.PositionClasses.flex}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.assets}` }, BdApi.React.createElement(
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
function RichTwitchActivityBuilder({ activity }) {
	return BdApi.React.createElement("div", { className: `${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignStretch} ${Common.PositionClasses.flex} ${NowPlayingClasses.richActivity}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common.PositionClasses.flex}` }, BdApi.React.createElement("div", { className: NowPlayingClasses.assets }, BdApi.React.createElement("div", { className: NowPlayingClasses.twitchImageContainer }, BdApi.React.createElement(FlexInfo, { className: NowPlayingClasses.twitchImageOverlay, activity, type: "TWITCH_OVERLAY" }), BdApi.React.createElement(
		TwitchImageAsset,
		{
			url: activity.name.includes("YouTube") ? `https://i.ytimg.com/vi/${activity.assets?.large_image.substring(activity.assets?.large_image.indexOf(":") + 1)}/hqdefault_live.jpg` : `https://static-cdn.jtvnw.net/previews-ttv/live_user_${activity.assets?.large_image.substring(activity.assets?.large_image.indexOf(":") + 1)}-900x500.jpg`,
			imageId: activity.assets?.large_image,
			streamUrl: activity.url
		}
	))))));
}

// activity_feed/components/now_playing/activities/components/CardActivity.tsx
function ActivityCard({ user, activities, currentActivity, currentGame, players, server, check, v2Enabled }) {
	if (currentActivity.type == 1) return;
	const gameId = currentActivity?.application_id;
	react.useEffect(() => {
		(async () => {
			await Common.FetchGames.getDetectableGamesSupplemental([gameId]);
		})();
	}, [gameId]);
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.activityContainer }, BdApi.React.createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, players, server, check, v2Enabled }), currentActivity?.assets && currentActivity?.assets.large_image && BdApi.React.createElement(RichActivityBuilder, { user, activity: currentActivity, v2Enabled })), v2Enabled && currentActivity?.party && currentActivity?.party.size && BdApi.React.createElement(PartyFooter, { party: currentActivity.party, players, user, activity: currentActivity }), activities.length > 1 && activities.pop() !== currentActivity && BdApi.React.createElement("div", { className: MainClasses.sectionDivider }));
}

// activity_feed/components/now_playing/activities/components/CardActivityWrapper.tsx
function ActivityCardWrapper({ user, activities, voice, streams, check, v2Enabled }) {
	if (!activities) return;
	return activities.map((activity) => {
		const currentActivity = activity?.activity || streams[0].activity;
		const currentGame = activity?.game || Common.GameStore.getGameByName(streams[0].activity.name);
		const players = activity.playingMembers;
		const server = voice[0]?.guild;
		return BdApi.React.createElement(ActivityCard, { user, activities, currentActivity, currentGame, players, server, check, v2Enabled });
	});
}

// activity_feed/components/now_playing/activities/components/CardTwitch.tsx
function TwitchCard({ user, activity, check }) {
	if (!check?.streaming) return;
	const currentGame = activity?.game;
	const currentActivity = activity?.activity;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(RegularTwitchActivityBuilder, { user, activity: currentActivity, game: currentGame }), BdApi.React.createElement(RichTwitchActivityBuilder, { activity: currentActivity }), BdApi.React.createElement("div", { className: MainClasses.sectionDivider }));
}

// activity_feed/components/now_playing/activities/components/CardStream.tsx
function StreamFallback() {
	return BdApi.React.createElement(
		"div",
		{
			className: `${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap}${Common.PositionClasses.alignCenter} ${Common.PositionClasses.justifyCenter} ${NowPlayingClasses.emptyPreviewContainer} ${NowPlayingClasses.applicationStreamingPreviewSize}`,
			style: { flex: "1 1 auto" }
		},
		BdApi.React.createElement(Common.Spinner, null)
	);
}
function StreamPlaceholder() {
	return BdApi.React.createElement(
		"div",
		{
			className: `${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap}${Common.PositionClasses.alignCenter} ${Common.PositionClasses.justifyCenter} ${NowPlayingClasses.emptyPreviewContainer} ${NowPlayingClasses.applicationStreamingPreviewSize}`,
			style: { flex: "1 1 auto" }
		},
		BdApi.React.createElement("div", { className: NowPlayingClasses.emptyPreviewImage, style: { backgroundImage: "url(https://static.discord.com/assets/b93ef52d62a513a4f2127a6ca0c3208c.svg)" } }),
		BdApi.React.createElement("div", { className: NowPlayingClasses.emptyPreviewText }, Common.intl.intl.formatToPlainString(Common.intl.t["uQZTBV"]))
	);
}
function StreamPreview({ stream }) {
	const { previewUrl, isLoading } = Common.UseStreamPreviewURL(stream.guildId, stream.channelId, stream.ownerId);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, isLoading ? BdApi.React.createElement(StreamPlaceholder, null) : !previewUrl ? BdApi.React.createElement(StreamFallback, null) : BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, style: { position: "relative" } }, BdApi.React.createElement("img", { className: NowPlayingClasses.applicationStreamingPreview, src: previewUrl })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverWrapper, onClick: () => {
		return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream);
	} }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverText }, Common.intl.intl.formatToPlainString(Common.intl.t["7Xq/nV"]))));
}
function StreamCard({ stream, streamUser, streamActivity }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.streamSection }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingSection }, BdApi.React.createElement(Common.AvatarFetch, { imageClassName: "applicationStreamingAvatar", src: `https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=48`, size: "SIZE_40" }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.details} ${NowPlayingClasses.applicationStreamingDetails}`, type: "STREAM", stream: streamActivity, streamUser })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewWrapper, style: { paddingTop: "54.25%" } }, BdApi.React.createElement("div", { className: NowPlayingClasses.inner }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, BdApi.React.createElement(StreamPreview, { stream })))));
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
	const streamsInfo = streams.map((item) => item.stream);
	const streamUsers = streams.map((item) => item.streamUser);
	const channel = stream ? ChannelStore.getChannel(stream.channelId) : voice[0]?.channel;
	const members = stream ? getVoiceParticipants({ voice: stream.channelId }) : voice[0]?.members;
	const server = voice[0]?.guild;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSection }, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSectionAssets }, BdApi.React.createElement(VoiceGuildAsset, { channel, streamUser: streamUsers[0], server })), BdApi.React.createElement(
		FlexInfo,
		{
			className: `${NowPlayingClasses.details} ${NowPlayingClasses.voiceSectionDetails}`,
			onClick: () => Common.OpenVoiceChannel.selectVoiceChannel(channel.id),
			channel,
			streamUser: streamUsers[0],
			server,
			type: "VOICE"
		}
	), BdApi.React.createElement(VoiceCardTrailing, { members, server, channel })), stream && streams[0]?.activity && streams.map(
		(stream2, index) => BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.sectionDivider }), BdApi.React.createElement(StreamCard, { stream: streamsInfo[index], streamUser: streamUsers[index], streamActivity: streams[index]?.activity }))
	), activities.length ? BdApi.React.createElement("div", { className: MainClasses.sectionDivider }) : null);
}

// activity_feed/components/now_playing/card_shop/components/CardBody.tsx
function CardBody({ activities, user, voice, streams, check, isSpotify, v2Enabled }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.cardBody }, BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.game }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.gameBody} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(VoiceCard, { activities, voice, streams }), BdApi.React.createElement(TwitchCard, { user, activity: activities.find((entry) => entry.activity.type == 1) || streams.find((entry) => entry.activity.type == 1), check }), BdApi.React.createElement(ActivityCardWrapper, { user, activities, voice, streams, check, v2Enabled })))));
}

// activity_feed/components/now_playing/card_shop/components/CardHeader.tsx
function Splash({ splash, className }) {
	if (!splash) return;
	return BdApi.React.createElement("div", { className, style: { backgroundImage: `url(${splash})` } });
}
function DiscordTag({ user, voice }) {
	let outputtedUsername;
	switch (true) {
		case !!(voice && voice[0]?.members.length > 2):
			outputtedUsername = `${user.globalName || user.username}, ${Common.intl.intl.formatToPlainString(Common.intl.t["zRRd8G"], { count: voice[0]?.members.length - 2, name: voice[0]?.members[voice[0]?.members.length - 1].globalName || voice[0]?.members[voice[0]?.members.length - 1].username })}`;
			break;
		case !!(voice && voice[0]?.members.length > 1):
			outputtedUsername = Common.intl.intl.formatToPlainString(Common.intl.t["4SM/RX"], { user1: user.globalName || user.username || voice[0]?.members[1].username, user2: voice[0]?.members[1].globalName || voice[0]?.members[1].username });
			break;
		default:
			outputtedUsername = user.globalName || user.username;
	}
	return BdApi.React.createElement("div", { className: NowPlayingClasses.nameTag, style: { flex: 1 } }, BdApi.React.createElement("span", { className: `${NowPlayingClasses.username} username`, onClick: () => Common.ModalAccessUtils.openUserProfileModal({ userId: user.id }) }, outputtedUsername));
}
function HeaderActions({ card, user }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.headerActions} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`, style: { flex: "0" }, "aria-expanded": showPopout }, BdApi.React.createElement("button", { type: "button", className: `${MainClasses.button} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.lookFilled}`, onClick: () => Common.OpenDM.openPrivateChannel({ recipientIds: user.id }) }, "Message"), BdApi.React.createElement(
		Common.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(Common.PopoutContainer, { position: "left" }, BdApi.React.createElement(Common.CardPopout, { party: card.party, close: () => setShowPopout(false) })),
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
			BdApi.React.createElement(Tooltip, { note: "More" }, BdApi.React.createElement("button", { className: `${MainClasses.button} ${Common.ButtonVoidClasses.lookBlank} ${Common.ButtonVoidClasses.grow}`, type: "button" }, BdApi.React.createElement("svg", { className: `${NowPlayingClasses.overflowMenu}`, role: "img", width: "16", height: "16", viewBox: "0 0 24 24" }, BdApi.React.createElement("g", { fill: "none", fillRule: "evenodd" }, BdApi.React.createElement("path", { d: "M24 0v24H0V0z" }), BdApi.React.createElement("path", { d: "M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z", fill: "currentColor" })))))
		)
	));
}
function HeaderIcon({ activities, isSpotify, currentGame }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, isSpotify ? BdApi.React.createElement("svg", { className: `${NowPlayingClasses.headerIcon}`, "aria-hidden": true, role: "image", width: "16", height: "16", viewBox: "0 0 16 16" }, BdApi.React.createElement("g", { fill: "none", fillRule: "evenodd" }, BdApi.React.createElement("path", { fill: "var(--spotify)", d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z" }), BdApi.React.createElement("rect", { width: "16", height: "16" }))) : activities.length !== 0 && BdApi.React.createElement("img", { className: `${NowPlayingClasses.headerIcon}`, alt: "", src: `https://cdn.discordapp.com/app-icons/${currentGame?.id}/${currentGame?.icon}.png?size=64&keep_aspect_ratio=false` }));
}
function CardHeader({ card, activities, game, splash, user, voice, isSpotify }) {
	const status = card.party.priorityMembers[0].status;
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.cardHeader} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(Splash, { splash, className: betterdiscord.Utils.className(NowPlayingClasses.splashArt, voice && activities.length === 0 && NowPlayingClasses.server) }), BdApi.React.createElement("div", { className: NowPlayingClasses.header }, BdApi.React.createElement(Common.AvatarFetch, { imageClassName: "avatar", src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`, status, size: "SIZE_40" }), BdApi.React.createElement(DiscordTag, { user, voice }), BdApi.React.createElement(HeaderActions, { card, user }), BdApi.React.createElement(HeaderIcon, { activities, isSpotify, currentGame: game })));
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
			await Common.FetchGames.getDetectableGamesSupplemental([currentGame?.id]);
		})();
	}, [currentGame?.id]);
	const game = DetectableGameSupplementalStore.getGame(currentGame?.id) || ApplicationStore.getApplication(currentGame?.id) && DetectableGameSupplementalStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id);
	const splash = SplashGen(isSpotify, activities[0]?.activity, { currentGame, data: game }, voice, streams[0]?.stream);
	return BdApi.React.createElement("div", { className: v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } }, BdApi.React.createElement(CardHeader, { card, activities, game: currentGame, splash, user, voice, isSpotify }), BdApi.React.createElement(CardBody, { activities, user, voice, streams, check: filterCheck, isSpotify, v2Enabled }));
}

// activity_feed/components/now_playing/BaseBuilder.tsx
function NowPlayingColumnBuilder({ nowPlayingCards }) {
	return nowPlayingCards.map((card) => [
		BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") ?? settings.default.v2Cards }),
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
	return BdApi.React.createElement("div", { className: MainClasses.activityFeed }, BdApi.React.createElement(Common.HeaderBar, { className: MainClasses.headerBar, "aria-label": "Activity" }, BdApi.React.createElement("div", { className: MainClasses.iconWrapper }, BdApi.React.createElement(Common.Icons.GameControllerIcon, null)), BdApi.React.createElement("div", { className: MainClasses.titleWrapper }, BdApi.React.createElement("div", { className: MainClasses.title }, "Activity"))), BdApi.React.createElement(Scroller, null, BdApi.React.createElement("div", { className: MainClasses.centerContainer }, BdApi.React.createElement(NewsFeedBuilder, null), BdApi.React.createElement(QuickLauncherBuilder, { className: QuickLauncherClasses.quickLauncher, style: { position: "relative", padding: "0 20px 0 20px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: NowPlayingClasses.nowPlaying, style: { position: "relative", padding: "0 20px 20px 20px" } }), BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))));
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
	const [state, setState] = react.useState(betterdiscord.Data.load("external")?.[service] || item.enabled);
	return BdApi.React.createElement("div", { className: SettingsClasses.blacklistItem, style: { display: "flex" } }, BdApi.React.createElement(item.icon, { className: SettingsClasses.blacklistItemIcon, color: "WHITE", style: { backgroundColor: item.color, padding: "5px" } }), BdApi.React.createElement("div", { className: SettingsClasses.blacklistItemTextContainer }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}` }, item.name || "Unknown Source"), item.note && BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemDescription} ${MainClasses.emptySubtitle}` }, item.note)), !state ? BdApi.React.createElement(
		"button",
		{
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
					{
						...props,
						title: "Are you sure?",
						actions: [
							{ text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: "Yes", fullWidth: 1, onClick: () => {
								betterdiscord.Data.save("external", { ...betterdiscord.Data.load("external"), [service]: true });
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
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
					{
						...props,
						title: "Are you sure?",
						actions: [
							{ text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: "Yes", fullWidth: 1, onClick: () => {
								betterdiscord.Data.save("external", { ...betterdiscord.Data.load("external"), [service]: false });
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
	const application = GameStore.getDetectableGame(game.applicationId == "356875570916753438" ? "1402418491272986635" : game.applicationId);
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
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
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
			className: `${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`,
			onClick: () => ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
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
		return whitelist?.filter((item) => GameStore.getDetectableGame(item?.applicationId == "356875570916753438" ? "1402418491272986635" : item?.applicationId)?.name.toLowerCase().includes(_query));
	}, [whitelist, query]);
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
			Common.FormSwitch,
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
			Common.FormSwitch,
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
				className: `${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${MainClasses.button} ${SettingsClasses.unhideBlacklisted}`,
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
const extraCSS = webpackify(`\n  	.description .sharedFilePreviewYouTubeVideo {\n  			display: none;\n  	}\n\n  	.nowPlayingColumn .tabularNumbers {\n  			color: var(--text-default) !important;\n  	}\n\n  	.nowPlayingColumn :is(.actionsActivity, .customButtons) {\n  			gap: 8px;\n  	}\n\n  	.nowPlayingColumn .header > .wrapper {\n  			display: flex;\n  			cursor: pointer;\n  			margin-right: 20px;\n  			transition: opacity .2s ease;\n  	}\n\n  	.customButtons {\n  			display: flex;\n  			flex-direction: column;\n  	}\n\n  	.headerActions {\n  			.button.lookFilled {\n  					background: var(--control-secondary-background-default);\n  					border: unset;\n  					color: var(--white);\n  					padding: 2px 16px;\n  					width: unset;\n  					svg {\n  							display: none;\n  					} \n  			}\n  			.button.lookFilled:hover {\n  					background-color: var(--control-secondary-background-hover) !important;\n  			}\n  			.button.lookFilled:active {\n  					background-color: var(--control-secondary-background-active) !important; \n  			}\n  			.lookFilled.colorPrimary {\n  					background: unset !important;\n  					border: unset !important;\n  			}\n  			.lookFilled.colorPrimary:hover {\n  					color: var(--interactive-background-hover);\n  					svg {\n  							stroke: var(--interactive-background-hover);\n  					}\n  			}\n  			.lookFilled.colorPrimary:active {\n  					color: var(--interactive-background-active);\n  					svg {\n  							stroke: var(--interactive-background-active);\n  					}\n  			}\n  	}\n\n  	.activityContainer:last-child:not(:only-child, :nth-child(1 of .activityContainer)) .sectionDivider {\n  			display: none;\n  	}\n\n  	.sectionDivider:last-child {\n  			display: none;\n  	}\n\n  	.activity .serviceButtonWrapper .sm:not(.hasText) {\n  			padding: 0;\n  			width: calc(var(--custom-button-button-sm-height) + 4px);\n  	}\n\n  	.content .bar {\n  			background-color: var(--opacity-white-24);\n  	}\n\n  	.partyStatusWrapper .disabledButtonWrapper {\n  			flex: 1;\n  	}\n\n  	.partyStatusWrapper .disabledButtonOverlay {\n  			height: 24px;\n  			width: 100%;\n  	}\n\n  	.theme-dark .applicationStreamingPreviewWrapper {\n  			background-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .applicationStreamingPreviewWrapper {\n  			background-color: var(--interactive-background-default);\n  	}\n\n  	.cardV2 {\n  			.headerActions .button.lookFilled, .cardBody button {\n  					color: var(--white);\n  					background: var(--opacity-white-24) !important;\n  					&:hover {\n  							background: var(--opacity-white-36) !important;\n  					}\n  					&:active {\n  							background: var(--opacity-white-32) !important;\n  					}\n  			}\n  			.tabularNumbers {\n  					color: var(--app-message-embed-secondary-text) !important;\n  			}\n  			.bar {\n  					background-color: var(--opacity-white-24);\n  			}\n  			.progress {\n  					background-color: var(--white);\n  			}\n  			.sectionDivider {\n  					border-color: var(--opacity-white-12) !important;\n  					border-width: 1px;\n  					margin: 12px 0 12px 0;\n  			} \n  	}\n\n  	.nowPlaying .emptyState {\n  			border: 1px solid;\n  			border-radius: 5px;\n  			box-sizing: border-box;\n  			margin-top: 20px;\n  			padding: 20px;\n  			width: 100%;\n  	}\n\n  	.theme-light .nowPlaying .emptyState {\n  			background-color: #fff;\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlaying .emptyState {\n  			background-color: rgba(79, 84, 92, .3);\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .quickLauncher .emptyState, .theme-light .blacklist.emptyState {\n  			border-color: rgba(220,221,222,.6);\n  			color: #b9bbbe;\n  	}\n\n  	.theme-dark .quickLauncher .emptyState, .theme-dark .blacklist.emptyState {\n  			border-color: rgba(47,49,54,.6);\n  			color: #72767d;\n  	}\n\n  	.theme-light .nowPlayingColumn .sectionDivider {\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlayingColumn .sectionDivider {\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-dark .voiceSectionIconWrapper {\n  			background-color: var(--primary-800);\n  	}\n\n  	.theme-light .voiceSectionIconWrapper {\n  			background: var(--primary-300);\n  	}\n\n  	.quickLauncher .emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  			align-items: center;\n  	}\n\n  	.blacklist.emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  	}\n\n  	.blackList .emptyState {\n  			position: relative;\n  			padding: 0;\n  			border-bottom: unset; \n  			line-height: 1.60;\n  	}\n\n  	.blacklist .sectionDivider, .settingsDivider {\n  			display: flex;\n  			width: 100%;\n  			border-bottom: 2px solid;\n  			margin: 4px 0 4px 0;\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.blacklist .sectionDivider:last-child {\n  			display: none;\n  	}\n\n  	// news feed transitions\n\n  	.slide-up-enter  { transform: translateY(100%); opacity: 0; }\n  	.slide-up-enter-active { transform: translateY(0); opacity: 1; transition: all 350ms ease; }\n  	.slide-up-exit  { transform: translateY(0); opacity: 1; }\n  	.slide-up-exit-active { transform: translateY(-100%); opacity: 0; transition: all 350ms ease; }\n\n  	.slide-down-enter  { transform: translateY(-100%); opacity: 0; }\n  	.slide-down-enter-active { transform: translateY(0); opacity: 1; transition: all 350ms ease; }\n  	.slide-down-exit  { transform: translateY(0); opacity: 1; }\n  	.slide-down-exit-active { transform: translateY(100%); opacity: 0; transition: all 350ms ease; }\n`);
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
	return Router.useLocation().pathname.startsWith("/activity-feed");
}
function NavigatorButton() {
	return react.createElement(
		Common.LinkButton,
		{
			selected: useSelectedState(),
			route: "/activity-feed",
			text: "Activity",
			icon: () => {
				return react.createElement(Common.Icons.GameControllerIcon, { color: "currentColor", className: Common.LinkButtonClasses.linkButtonIcon });
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
	async start() {
		NewsStore.whitelist = betterdiscord.Data.load("whitelist");
		NewsStore.blacklist = betterdiscord.Data.load("blacklist") || [];
		if (NewsStore.shouldFetch() === true) await NewsStore.fetchFeeds();
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
		betterdiscord.Patcher.after(Common.DMSidebar, "A", (that, [props], res) => {
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
						return react.createElement("div", { className: "buttonItem_267ac", style: { display: "flex" } }, [
							react.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1 } }, [
								react.createElement("div", { className: "blacklistItemName_267ac textRow_267ac", style: { fontWeight: 500, fontSize: "16px", color: "var(--text-primary)" } }, name),
								react.createElement("div", { className: "textRow_267ac" }, note)
							]),
							react.createElement(
								"button",
								{
									className: `button_267ac unhideBlacklisted_267ac ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`,
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