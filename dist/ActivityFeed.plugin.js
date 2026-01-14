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

// activity_feed/styles.js
const styles = Object.assign(
	{
		wrapper: betterdiscord.Webpack.getByKeys("wrapper", "svg", "mask").wrapper,
		customButtons: betterdiscord.Webpack.getByKeys("customButtons", "absolute").customButtons,
		hasText: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).hasText,
		sm: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).sm,
		interactiveSelected: betterdiscord.Webpack.getByKeys("icon", "upperContainer").interactiveSelected
	},
	betterdiscord.Webpack.getByKeys("itemCard"),
	betterdiscord.Webpack.getByKeys("tabularNumbers"),
	betterdiscord.Webpack.getByKeys("colorPrimary", "grow"),
	betterdiscord.Webpack.getByKeys("bar", "container", "progress"),
	betterdiscord.Webpack.getModule((x) => x.buttonContainer && Object.keys(x).length === 1)
);
const activityPanelCSS = webpackify(`\n._2cbe2fbfe32e4150-activityFeed {\n  	background: var(--background-gradient-chat, var(--background-base-lower));\n  	border-top: 1px solid var(--app-border-frame);\n  	display: flex;\n  	flex-direction: column;\n  	width: 100%;\n  	overflow: hidden;\n}\n\n._2cbe2fbfe32e4150-scrollerBase {\n  	contain: layout size;\n  	height: 100%;\n  	/*\n  	background: no-repeat bottom;\n  	background-size: 100%;\n  	background-image: url(/assets/c486dc65ce2877eeb18e4c39bb49507a.svg);\n  	*/\n  	&::-webkit-scrollbar {\n  	background: none;\n  	border-radius: 8px;\n  	width: 16px;\n  	}\n  	&::-webkit-scrollbar-thumb {\n  			background-clip: padding-box;\n  			border: solid 4px #0000;\n  			border-radius: 8px;\n  	}\n  	&:hover::-webkit-scrollbar-thumb {\n  			background-color: var(--bg-overlay-6, var(--background-tertiary));\n  	}\n}\n\n._2cbe2fbfe32e4150-centerContainer {\n  	display: flex;\n  	flex-direction: column;\n  	width: 1280px;\n  	max-width: 100%;\n  	min-width: 480px;\n  	margin: 0 auto;\n}\n\n._2cbe2fbfe32e4150-title {\n  	align-items: center;\n  	display: flex;\n  	justify-content: flex-start;\n  	overflow: hidden;\n  	white-space: nowrap;\n  	font-size: 16px;\n  	font-weight: 500;\n  	line-height: 1.25;\n  	color: var(--header-primary);\n}\n\n._2cbe2fbfe32e4150-titleWrapper {\n  	flex: 0 0 auto;\n  	margin: 0 8px 0 0;\n  	min-width: auto;\n}\n\n._2cbe2fbfe32e4150-iconWrapper {\n  	align-items: center;\n  	display: flex;\n  	flex: 0 0 auto;\n  	height: var(--space-32);\n  	justify-content: center;\n  	margin: 0;\n  	position: relative;\n  	width: var(--space-32);\n}\n\n._2cbe2fbfe32e4150-headerBar {\n  	height: calc(var(--custom-channel-header-height) - 1px);\n  	min-height: calc(var(--custom-channel-header-height) - 1px);\n}\n\n._2cbe2fbfe32e4150-headerContainer {\n  	flex-direction: row;\n}\n\n._2cbe2fbfe32e4150-headerText {\n  	display: flex;\n  	flex: 1;\n  	font-size: 18px;\n  	font-weight: 500;\n  	line-height: 22px;\n  	margin-top: 20px;\n  	width: 100%;\n  	color: var(--text-default);\n}\n\n._2cbe2fbfe32e4150-feedCarousel {\n  	display: flex;\n  	position: relative;\n}\n\n._2cbe2fbfe32e4150-carousel {\n  	background-color: var(--background-secondary-alt);\n  	border-radius: 5px;\n  	flex: 1 1 75%;\n  	min-height: 388px;\n  	margin-right: 20px;\n  	overflow: hidden;\n  	position: relative;\n  	transform: translateZ(0);\n}\n\n._2cbe2fbfe32e4150-article {\n  	background-color: var(--background-secondary-alt);\n  	border-radius: 5px;\n  	bottom: 0;\n  	box-sizing: border-box;\n  	height: 100%;\n  	left: 0;\n  	overflow: hidden;\n  	padding: 20px;\n  	position: absolute;\n  	right: 0;\n  	top: 0;\n  	display: flex;\n  	flex-direction: column;\n  	justify-content: flex-end;\n}\n\n._2cbe2fbfe32e4150-background {\n  	background-repeat: no-repeat;\n  	background-size: cover;\n  	bottom: 7.5%;\n  	mask: linear-gradient(0deg, transparent, #000);\n  	min-width: 300px;\n  	background-position: top;\n}\n\n._2cbe2fbfe32e4150-backgroundImage {\n  	background-position: top;\n  	background-repeat: no-repeat;\n  	background-size: cover;\n  	bottom: 0;\n}\n\n._2cbe2fbfe32e4150-background, ._2cbe2fbfe32e4150-backgroundImage {\n  	left: 0;\n  	position: absolute;\n  	right: 0;\n  	top: 0;\n}\n\n._2cbe2fbfe32e4150-feedOverflowMenu {\n  	position: absolute;\n  	top: 0;\n  	right: 0;\n  	padding: 8px 12px;\n}\n\n._2cbe2fbfe32e4150-applicationArea {\n  	color: var(--text-default);\n  	display: flex;\n  	flex-direction: column;\n  	justify-content: center;\n  	position: relative;\n}\n\n._2cbe2fbfe32e4150-details {\n  	position: relative;\n}\n\n._2cbe2fbfe32e4150-titleStandard {\n  	margin-top: 8px;\n  	overflow: hidden;\n  	text-overflow: ellipsis;\n  	white-space: nowrap;\n  	font-size: 24px;\n  	line-height: 28px;\n}\n\n._2cbe2fbfe32e4150-title {\n  	color: var(--header-primary);\n  	display: block;\n  	font-weight: 500;\n}\n\n._2cbe2fbfe32e4150-description {\n  	color: var(--text-default);\n  	display: -webkit-box;\n  	font-size: 16px;\n  	font-weight: 500;\n  	line-height: 1.2;\n  	margin-top: 8px;\n  	max-height: 40px;\n  	overflow: hidden;\n  	text-overflow: ellipsis;\n  	-webkit-line-clamp: 2;\n  	line-clamp: 2;\n  	-webkit-box-orient: vertical;\n  	img, br+br {\n  			display: none;\n  	}\n  	a {\n  			color: inherit;\n  	}\n  	p, b, i {\n  			all: inherit;\n  			display: contents\n  	}\n  	.sharedFilePreviewYouTubeVideo {\n  			display: none;\n  	}\n}\n\n._2cbe2fbfe32e4150-timestamp {\n  	color: var(--text-muted);\n  	font-size: 12px;\n  	font-weight: 600;\n  	margin-top: 8px;\n  	text-transform: uppercase;\n}\n\n._2cbe2fbfe32e4150-gameIcon {\n  	position: relative;\n  	pointer-events: auto;\n  	cursor: pointer;\n  	height: 40px;\n  	width: 40px;\n  	flex-shrink: 0;\n  	border-radius: 3px;\n}\n\n._2cbe2fbfe32e4150-pagination {\n  	-webkit-box-flex: 1;\n  	flex: 1 1 25%;\n  	min-width: 0;\n}\n\n._2cbe2fbfe32e4150-verticalPaginationItemContainer {\n  	margin: 0;\n  	overflow: hidden;\n}\n\n._2cbe2fbfe32e4150-scrollerWrap {\n  	-webkit-box-flex: 1;\n  	display: flex;\n  	flex: 1;\n  	height: 100%;\n  	min-height: 1px;\n  	position: relative;\n}\n\n._2cbe2fbfe32e4150-scroller {\n  	-webkit-box-flex: 1;\n  	contain: layout;\n  	flex: 1;\n  	min-height: 1px;\n}\n  	\n._2cbe2fbfe32e4150-paginationItem, ._2cbe2fbfe32e4150-paginationItem:before {\n  	transition: all .2s ease;\n}\n\n._2cbe2fbfe32e4150-paginationItem:first-child {\n  	margin-top: 0;\n}\n\n._2cbe2fbfe32e4150-paginationItem {\n  	-webkit-box-align: center;\n  	align-items: center;\n  	background: var(--background-secondary-alt);\n  	border-radius: 5px;\n  	box-sizing: border-box;\n  	cursor: pointer;\n  	display: flex;\n  	height: 91px;\n  	margin-top: 8px;\n  	overflow: hidden;\n  	padding: 16px;\n  	position: relative;\n  	transform: translateZ(0);\n}\n\n._2cbe2fbfe32e4150-paginationItem:before {\n  	background: #fff;\n  	border-radius: 20px;\n  	content: "";\n  	height: 40px;\n  	left: -5px;\n  	position: absolute;\n  	top: 50%;\n  	transform: translateY(-50%) translateX(-100%);\n  	transition-delay: .2s;\n  	width: 10px;\n  	z-index: 1;\n}\n\n._2cbe2fbfe32e4150-paginationItem:after {\n  	background-blend-mode: color;\n  	border-radius: 5px;\n  	bottom: 0;\n  	content: "";\n  	left: 0;\n  	position: absolute;\n  	right: 0;\n  	top: 0;\n}\n\n._2cbe2fbfe32e4150-splashArt {\n  	filter: grayscale(100%);\n  	height: 100%;\n  	opacity: .2;\n  	width: 100%;\n  	background-position-x: 50%;\n  	background-position-y: 40%;\n  	background-repeat: no-repeat;\n  	background-size: cover;\n  	bottom: 0;\n  	left: 0;\n  	pointer-events: none;\n  	position: absolute;\n  	top: 0;\n}\n\n._2cbe2fbfe32e4150-paginationSubtitle, ._2cbe2fbfe32e4150-paginationTitle {\n  	font-weight: 600;\n}\n\n._2cbe2fbfe32e4150-paginationText {\n  	overflow: hidden;\n}\n\n._2cbe2fbfe32e4150-paginationContent {\n  	overflow: hidden;\n  	position: relative;\n  	z-index: 1;\n}\n\n._2cbe2fbfe32e4150-paginationTitle {\n  	color: var(--header-primary);\n  	font-size: 16px;\n  	line-height: 1.25;\n  	max-height: 40px;\n}\n\n._2cbe2fbfe32e4150-paginationSubtitle {\n  	color: var(--text-muted);\n  	font-size: 12px;\n  	margin-top: 4px;\n  	overflow: hidden;\n  	text-overflow: ellipsis;\n  	white-space: nowrap;\n}\n\n._2cbe2fbfe32e4150-selectedPage {\n  	background: var(--background-surface-higher);\n  	cursor: default;\n}\n\n._2cbe2fbfe32e4150-selectedPage:before {\n  	transform: translateY(-50%) translateX(0);\n}\n\n._2cbe2fbfe32e4150-selectedPage ._2cbe2fbfe32e4150-splashArt {\n  	filter: grayscale(0);\n}\n\n._2cbe2fbfe32e4150-smallCarousel {\n  	-webkit-box-flex: 1;\n  	border-radius: 5px;\n  	flex: 1;\n  	height: 220px;\n  	overflow: hidden;\n  	position: relative;\n  	transform: translateZ(0);\n}\n\n._2cbe2fbfe32e4150-titleRowSimple {\n  	-webkit-box-align: center;\n  	-webkit-box-pack: justify;\n  	align-items: center;\n  	display: flex;\n  	flex-wrap: wrap;\n  	justify-content: space-between;\n}\n\n._2cbe2fbfe32e4150-paginationSmall {\n  	bottom: 0;\n  	height: 64px;\n  	left: 0;\n  	margin: 0 auto;\n  	min-width: 0;\n  	right: 0;\n  	position: absolute;\n  	z-index: 3;\n  	display: flex;\n}\n\n._2cbe2fbfe32e4150-arrow {\n  	color: var(--text-muted);\n  	z-index: 2;\n}\n\nsvg._2cbe2fbfe32e4150-arrow {\n  	height: 26px;\n  	width: 26px;\n}\n\n._2cbe2fbfe32e4150-arrowContainer {\n  	color: var(--white);\n  	cursor: pointer;\n  	font-size: 0;\n  	height: 50px;\n  	line-height: 0;\n  	position: absolute;\n  	top: 50%;\n  	transform: translateY(-50%);\n  	width: 50px;\n}\n\n._2cbe2fbfe32e4150-arrow, ._2cbe2fbfe32e4150-arrowContainer {\n  	box-sizing: border-box;\n  	pointer-events: all;\n}\n\n._2cbe2fbfe32e4150-button {\n  	-webkit-box-align: center;\n  	-webkit-box-pack: center;\n  	align-items: center;\n  	background: none;\n  	border: none;\n  	border-radius: 3px;\n  	display: flex;\n  	font-size: 14px;\n  	font-weight: 500;\n  	justify-content: center;\n  	line-height: 16px;\n  	position: relative;\n  	user-select: none;\n}\n\n._2cbe2fbfe32e4150-prevButtonContainer {\n  	left: 6px;\n}\n\n._2cbe2fbfe32e4150-nextButtonContainer {\n  	right: 6px;\n}\n\n._2cbe2fbfe32e4150-left {\n  	transform: rotate(-90deg);\n}\n\n._2cbe2fbfe32e4150-right {\n  	transform: rotate(90deg);\n}\n\n._2cbe2fbfe32e4150-horizontalPaginationItemContainer {\n  	-webkit-box-align: center;\n  	-webkit-box-flex: initial;\n  	align-items: center;\n  	display: flex;\n  	flex: initial;\n  	margin: 0 auto;\n  	overflow-y: hidden;\n}\n\n._2cbe2fbfe32e4150-dot {\n  	background-color: #fff;\n  	border-radius: 2px;\n  	cursor: pointer;\n  	height: 8px;\n  	margin-right: 8px;\n  	pointer-events: all;\n  	transform: translateZ(0);\n  	width: 8px;\n}\n\n._2cbe2fbfe32e4150-dotNormal {\n  	opacity: 0.2;\n}\n\n._2cbe2fbfe32e4150-dotSelected {\n  	opacity: 0.6;\n}\n\n._2cbe2fbfe32e4150-dock {\n  	margin-top: 10px;\n  	display: flex;\n  	overflow: hidden;\n  	flex-wrap: nowrap;\n  	max-width: 1280px;\n}\n\n._2cbe2fbfe32e4150-dockItem {\n  	border-radius: 5px;\n  	box-sizing: border-box;\n  	cursor: pointer;\n  	height: 100px;\n  	padding: 10px;\n  	width: 90px;\n  	flex-direction: column;\n}\n\n._2cbe2fbfe32e4150-dockIcon:first-child {\n  	margin-left: 0;\n}\n\n._2cbe2fbfe32e4150-dockIcon {\n  	background-size: 100%;\n  	border-radius: 3px;\n  	height: 40px;\n  	margin-bottom: 8px;\n  	transition: opacity .2s ease-in-out;\n  	width: 40px;\n}\n\n._2cbe2fbfe32e4150-dockItemText {\n  	font-weight: 500;\n  	height: 31px;\n  	line-height: normal;\n  	overflow: hidden;\n  	text-align: center;\n  	text-overflow: ellipsis;\n  	white-space: normal;\n  	width: 100%;\n  	font-size: 12px;\n  	color: var(--text-default);\n}\n\n._2cbe2fbfe32e4150-dockItemPlay {\n  	display: none;\n  	z-index: 9999;\n}\n\n._2cbe2fbfe32e4150-dockItemPlay:disabled, ._2cbe2fbfe32e4150-dockItemPlay[aria-disabled=true] {\n  	background-color: var(--green-active, var(--button-positive-background-active)) !important;\n}\n\n._2cbe2fbfe32e4150-dockItem:hover {\n  	background: var(--background-base-lowest);\n}\n\n._2cbe2fbfe32e4150-dockItem:hover ._2cbe2fbfe32e4150-dockItemText {\n  	display: none;\n}\n\n._2cbe2fbfe32e4150-dockItem:hover ._2cbe2fbfe32e4150-dockItemPlay {\n  	display: flex;\n}\n\n._2cbe2fbfe32e4150-nowPlayingContainer {\n  	display: flex;\n  	margin-top: var(--space-lg);\n  	gap: var(--space-lg);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn {\n  	display: flex;\n  	flex-direction: column;\n  	gap: var(--space-lg);\n  	width: calc(50% - (var(--space-lg) / 2))\n}\n\n._2cbe2fbfe32e4150-nowPlayingContainer .itemCard {\n  	flex: 1 0 0;\n  	margin: 16px 16px 0 0;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-card {\n  	border-radius: 5px;\n  	box-sizing: border-box;\n  	cursor: default;\n  	overflow: hidden;\n  	transform: translateZ(0);\n}\n  	\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-cardHeader {\n  	padding: 20px;\n  	position: relative;\n  	flex-direction: row;\n  	background: var(--background-base-lowest);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-header {\n  	display: flex;\n  	align-items: center;\n  	width: 100%;\n  	height: 40px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-header > .wrapper {\n  	display: flex;\n  	cursor: pointer;\n  	margin-right: 20px;\n  	transition: opacity .2s ease;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-nameTag {\n  	line-height: 17px;\n  	overflow: hidden;\n  	text-overflow: ellipsis;\n  	vertical-align: middle;\n  	white-space: nowrap;\n  	color: var(--text-default);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn .username {\n  	cursor: pointer;\n  	font-size: 16px;\n  	font-weight: 500;\n  	line-height: 20px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn .username:hover {\n  	text-decoration: underline;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-card:hover ._2cbe2fbfe32e4150-headerIcon {\n  	display: none;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-headerActions {\n  	display: none;\n  	margin-left: 8px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-card:hover ._2cbe2fbfe32e4150-headerActions {\n  	display: flex;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-headerActions > div[aria-expanded="false"] {\n  	display: none;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-headerActions {\n  	._2cbe2fbfe32e4150-button.lookFilled {\n  			background: var(--control-secondary-background-default);\n  			border: unset;\n  			color: var(--white);\n  			padding: 2px 16px;\n  			width: unset;\n  			svg {\n  					display: none;\n  			} \n  	}\n  	._2cbe2fbfe32e4150-button.lookFilled:hover {\n  			background-color: var(--control-secondary-background-hover) !important;\n  	}\n  	._2cbe2fbfe32e4150-button.lookFilled:active {\n  			background-color: var(--control-secondary-background-active) !important; \n  	}\n  	.lookFilled.colorPrimary {\n  			background: unset !important;\n  			border: unset !important;\n  	}\n  	.lookFilled.colorPrimary:hover {\n  			color: var(--interactive-background-hover);\n  			svg {\n  					stroke: var(--interactive-background-hover);\n  			}\n  	}\n  	.lookFilled.colorPrimary:active {\n  			color: var(--interactive-background-active);\n  			svg {\n  					stroke: var(--interactive-background-active);\n  			}\n  	}\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-overflowMenu {\n  	cursor: pointer;\n  	height: 24px;\n  	margin-left: 8px;\n  	transition: opacity .2s linear;\n  	width: 24px;\n  	color: var(--interactive-icon-hover);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-overflowMenu:hover {\n  	color: var(--interactive-icon-default);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-headerIcon {\n  	border-radius: 4px;\n  	display: block;\n  	height: 30px;\n  	justify-self: end;\n  	width: 30px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-splashArt {\n  	filter: grayscale(100%);\n  	mask: radial-gradient(100% 100% at top left, hsla(0, 0%, 100%, .6) 0, hsla(0, 0%, 100%, 0) 100%);\n  	opacity: .3;\n  	width: 300px;\n  	background-position-x: 50%;\n  	background-position-y: 40%;\n  	background-repeat: no-repeat;\n  	background-size: cover;\n  	bottom: 0;\n  	left: 0;\n  	pointer-events: none;\n  	position: absolute;\n  	top: 0;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-server {\n  	mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);\n  	right: 0;\n  	left: unset;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-cardBody {\n  	display: flex;\n  	padding: 0 20px;\n  	background: var(--background-mod-strong)\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-section {\n  	-webkit-box-flex: 1;\n  	flex: 1 0 calc(50% - 20px);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-game {\n  	padding: 20px 0;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-gameBody {\n  	flex-direction: column;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-activityContainer:last-child:not(:only-child, :nth-child(1 of ._2cbe2fbfe32e4150-activityContainer)) ._2cbe2fbfe32e4150-sectionDivider {\n  	display: none;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-activity {\n  	flex-direction: row;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-activity:last-child:not(:only-child) {\n  	margin-top: 20px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-activity ._2cbe2fbfe32e4150-serviceButtonWrapper {\n  	gap: 6px;\n  	display: flex;\n  	flex-direction: row;\n  	.sm:not(.hasText) {\n  			padding: 0;\n  			width: calc(var(--custom-button-button-sm-height) + 4px);\n  	}\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-richActivity {\n  	margin-top: 20px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-activityFeed {\n  	-webkit-box-flex: 1;\n  	flex: 1 1 50%;\n  	min-width: 0;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn :is(._2cbe2fbfe32e4150-gameInfoRich, ._2cbe2fbfe32e4150-gameNameWrapper) {\n  	-webkit-box-flex: 1;\n  	display: flex;\n  	flex: 1;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-gameInfoRich {\n  	align-items: center;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-gameInfo {\n  	margin-left: 20px;\n  	min-width: 0;\n  	color: var(--text-default);\n  	font-weight: 500;\n  	flex: 1;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn :is(._2cbe2fbfe32e4150-gameName, ._2cbe2fbfe32e4150-gameNameWrapper, ._2cbe2fbfe32e4150-streamInfo) {\n  	overflow: hidden;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-gameName {\n  	font-size: 16px;\n  	line-height: 20px;\n  	margin-right: 10px;\n  	max-width: fit-content;\n  	text-overflow: ellipsis;\n  	white-space: nowrap;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-gameName._2cbe2fbfe32e4150-clickable:hover {\n  	text-decoration: underline;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-playTime:not(a) {\n  	color: var(--text-muted);\n}\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-playTime {\n  	font-size: 12px;\n  	font-weight: 500;\n  	line-height: 14px;\n  	margin-top: 4px;\n  	overflow: hidden;\n  	text-overflow: ellipsis;\n  	white-space: nowrap;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets {\n  	position: relative;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assetsLargeImageActivityFeed {\n  	width: 90px;\n  	height: 90px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assetsSmallImageActivityFeed {\n  	height: 30px;\n  	width: 30px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-assetsLargeImage {\n  	display: block;\n  	border-radius: 4px; \n  	object-fit: cover;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-assetsLargeImageActivityFeedTwitch {\n  	border-radius: 5px;\n  	height: 260px;\n  	mask: linear-gradient(0deg, transparent 10%, #000 80%);\n  	width: 100%;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets:has(._2cbe2fbfe32e4150-assetsSmallImage) ._2cbe2fbfe32e4150-assetsLargeImage {\n  	mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-richActivity ._2cbe2fbfe32e4150-assetsSmallImage, ._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-richActivity ._2cbe2fbfe32e4150-smallEmptyIcon {\n  	border-radius: 50%;\n  	position: absolute;\n  	bottom: -4px;\n  	right: -4px; \n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-activity ._2cbe2fbfe32e4150-smallEmptyIcon {\n  	width: 40px;\n  	height: 40px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-largeEmptyIcon {\n  	width: 90px;\n  	height: 90px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-largeEmptyIcon path {\n  	transform: scale(3.65) !important;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-richActivity svg.assetsSmallImage {\n  	border-radius: unset !important;\n}   \n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-richActivity ._2cbe2fbfe32e4150-smallEmptyIcon path {\n  	transform: scale(1.3) !important;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-twitchImageContainer {\n  	background: var(--background-secondary-alt);\n  	border-radius: 5px;\n  	position: relative;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-twitchBackgroundImage {\n  	display: inline-block;\n  	min-height: 260px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-twitchImageOverlay {\n  	bottom: 0;\n  	left: 0;\n  	padding: 16px;\n  	position: absolute;\n  	right: 0;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-streamName {\n  	color: var(--text-default);\n  	font-size: 14px;\n  	font-weight: 500;\n  	margin-top: 8px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-assets ._2cbe2fbfe32e4150-streamGame {\n  	color: var(--text-muted);\n  	font-size: 12px;\n  	font-weight: 600;\n  	margin-top: 8px;\n  	text-transform: uppercase;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-contentImagesActivityFeed {\n  	margin-left: 20px;\n  	color: var(--text-default);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn :is(._2cbe2fbfe32e4150-gameInfo, ._2cbe2fbfe32e4150-contentImagesActivityFeed) {\n  	align-self: center;\n  	display: grid;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-content {\n  	flex: 1;\n  	overflow: hidden;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-details {\n  	font-weight: 600;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-ellipsis {\n  	overflow: hidden;\n  	text-overflow: ellipsis;\n  	white-space: nowrap;\n}\n\n._2cbe2fbfe32e4150-textRow {\n  	display: block;\n  	font-size: 14px;\n  	line-height: 16px;\n  	margin-bottom: 4px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-content .bar {\n  	background-color: var(--opacity-white-24);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-sectionDivider {\n  	display: flex;\n  	width: 100%;\n  	border-bottom: 2px solid;\n  	margin: 20px 0 20px 0;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSection {\n  	display: flex;\n  	flex: 1 1 auto;\n  	flex-wrap: nowrap;\n  	align-items: center;\n  	justify-content: flex-start;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionAssets {\n  	align-items: center;\n  	border-radius: 50%;\n  	display: flex;\n  	justify-content: center;\n  	position: relative;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionIconWrapper {\n  	align-items: center;\n  	border-radius: 50%;\n  	bottom: -4px;\n  	display: flex;\n  	height: 20px;\n  	justify-content: center;\n  	position: absolute;\n  	right: -3px;\n  	width: 20px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionIcon {\n  	color: var(--header-secondary);\n  	height: 12px;\n  	width: 12px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionGuildImage {\n  	border-radius: 50%;\n  	mask: url('https://discord.com/assets/a90b040155ee449f.svg');\n  	mask-size: 100%;\n  	mask-type: luminance;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSection ._2cbe2fbfe32e4150-details {\n  	flex: 1;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionDetails {\n  	cursor: pointer;\n  	margin-left: 20px;\n  	min-width: 0;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionDetails:hover :is(._2cbe2fbfe32e4150-voiceSectionText, ._2cbe2fbfe32e4150-voiceSectionSubtext) {\n  	text-decoration: underline;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionText {\n  	color: var(--text-default);\n  	font-size: 14px;\n  	font-weight: 600;\n  	line-height: 1.2857142857142858;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSectionSubtext {\n  	color: var(--text-muted);\n  	font-size: 12px;\n  	font-weight: 400;\n  	line-height: 1.3333333333333333;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-userList {\n  	flex: 0 1 auto;\n  	justify-content: flex-end;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-voiceSection button {\n  	flex: 0 1 auto;\n  	width: auto;\n  	margin-left: 20px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-actionsActivity .buttonContainer {\n  	flex-direction: inherit;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-partyStatusWrapper {\n  	display: flex;\n  	gap: 4px;\n  	align-items: center;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-partyStatusWrapper button {\n  	flex: 0 1 50%;\n  	max-height: 24px;\n  	min-height: 24px;\n  	width: auto !important;\n  	justify-self: flex-end;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-partyStatusWrapper .disabledButtonWrapper {\n  	flex: 1;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-partyStatusWrapper .disabledButtonOverlay {\n  	height: 24px;\n  	width: 100%;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-partyList {\n  	display: flex;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-player:first-of-type {\n  	mask: url(#svg-mask-voice-user-summary-item);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-emptyUser:not(:first-of-type), ._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-player:not(:first-of-type) {\n  	margin-left: -4px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-emptyUser:not(:last-of-type), ._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-player:not(:last-of-type) {\n  	mask: url(#svg-mask-voice-user-summary-item);\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-emptyUser, ._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-player {\n  	width: 16px;\n  	height: 16px;\n  	border-radius: 50%;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-emptyUser svg {\n  	margin-left: 3px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-partyPlayerCount {\n  	color: var(--app-message-embed-secondary-text);\n  	font-size: 12px;\n  	font-weight: 500;\n  	line-height: 1.3333333333333333;\n}\n\n._2cbe2fbfe32e4150-nowPlaying ._2cbe2fbfe32e4150-emptyState {\n  	border: 1px solid;\n  	border-radius: 5px;\n  	box-sizing: border-box;\n  	margin-top: 20px;\n  	padding: 20px;\n  	width: 100%;\n}\n\n._2cbe2fbfe32e4150-quickLauncher ._2cbe2fbfe32e4150-emptyState, ._2cbe2fbfe32e4150-blacklist._2cbe2fbfe32e4150-emptyState {\n  	border-bottom: 1px solid;\n  	font-size: 14px;\n  	padding: 20px 0;\n  	justify-content: flex-start;\n  	align-items: center;\n}\n\n._2cbe2fbfe32e4150-emptyTitle {\n  	font-size: 16px;\n  	line-height: 20px;\n  	color: var(--text-default);\n}\n\n._2cbe2fbfe32e4150-emptySubtitle {\n  	font-size: 14px;\n  	color: var(--text-muted);\n}\n\n.theme-light ._2cbe2fbfe32e4150-nowPlaying ._2cbe2fbfe32e4150-emptyState {\n  	background-color: #fff;\n  	border-color: var(--interactive-background-hover);\n}\n\n.theme-dark ._2cbe2fbfe32e4150-nowPlaying ._2cbe2fbfe32e4150-emptyState {\n  	background-color: rgba(79, 84, 92, .3);\n  	border-color: var(--background-mod-strong);\n}\n\n.theme-light ._2cbe2fbfe32e4150-quickLauncher ._2cbe2fbfe32e4150-emptyState, .theme-light ._2cbe2fbfe32e4150-blacklist._2cbe2fbfe32e4150-emptyState {\n  	border-color: rgba(220,221,222,.6);\n  	color: #b9bbbe;\n}\n\n.theme-dark ._2cbe2fbfe32e4150-quickLauncher ._2cbe2fbfe32e4150-emptyState, .theme-dark ._2cbe2fbfe32e4150-blacklist._2cbe2fbfe32e4150-emptyState {\n  	border-color: rgba(47,49,54,.6);\n  	color: #72767d;\n}\n\n.theme-light ._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-sectionDivider {\n  	border-color: var(--interactive-background-hover);\n}\n\n.theme-dark ._2cbe2fbfe32e4150-nowPlayingColumn ._2cbe2fbfe32e4150-sectionDivider {\n  	border-color: var(--background-mod-strong);\n}\n\n.theme-dark ._2cbe2fbfe32e4150-voiceSectionIconWrapper {\n  	background-color: var(--primary-800);\n}\n\n.theme-light ._2cbe2fbfe32e4150-voiceSectionIconWrapper {\n  	background: var(--primary-300);\n}\n\n._2cbe2fbfe32e4150-emptyIcon {\n  	height: 24px;\n  	margin-right: 8px;\n  	width: 24px;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn .tabularNumbers {\n  	color: var(--text-default) !important;\n}\n\n._2cbe2fbfe32e4150-nowPlayingColumn :is(._2cbe2fbfe32e4150-actionsActivity, .customButtons) {\n  	gap: 8px;\n}\n\n.customButtons {\n  	display: flex;\n  	flex-direction: column;\n}\n\n._2cbe2fbfe32e4150-blacklist {\n  	display: flex;\n  	flex-direction: column;\n  	gap: 8px;\n}\n\n._2cbe2fbfe32e4150-blacklist ._2cbe2fbfe32e4150-sectionDivider, ._2cbe2fbfe32e4150-settingsDivider._2cbe2fbfe32e4150-sectionDivider {\n  	display: flex;\n  	width: 100%;\n  	border-bottom: 2px solid;\n  	margin: 4px 0 4px 0;\n  	border-color: var(--background-mod-strong);\n}\n\n._2cbe2fbfe32e4150-blacklist ._2cbe2fbfe32e4150-sectionDivider:last-child {\n  	display: none;\n}\n\n._2cbe2fbfe32e4150-blacklistItem {\n  	display: flex;\n}\n\n._2cbe2fbfe32e4150-blacklistItem ._2cbe2fbfe32e4150-blacklistItemIcon {\n  	border-radius: 8px;\n  	height: 32px;\n  	width: 32px;\n}\n\n._2cbe2fbfe32e4150-blacklistItem ._2cbe2fbfe32e4150-blacklistItemName {\n  	margin-left: 20px;\n  	margin-bottom: 0;\n  	min-width: 0;\n  	font-weight: 500;\n  	align-content: center;\n  	flex: 1;\n}\n\n._2cbe2fbfe32e4150-blacklistItem button {\n  	flex: 0 1 auto;\n  	align-self: center;\n  	width: auto;\n  	margin-left: 20px;\n}\n\n._2cbe2fbfe32e4150-search {\n  	padding: 12px;\n  	margin: 12px 0;\n  	input::placeholder {\n  			font-weight: 600;\n  			font-size: 14px;\n  			color: var(--text-muted);\n  	}\n  	svg {\n  			path {\n  					fill: var(--text-muted);\n  			}\n  			circle {\n  					color: var(--text-muted);\n  			}\n  			path, circle {\n  					stroke: var(--text-muted);\n  					stroke-width: 3px;\n  			}\n  	}\n}\n\n._2cbe2fbfe32e4150-cardV2 {\n  	background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));\n  	border-radius: var(--radius-md);\n  	outline: 1px solid var(--border-normal);\n  	outline-offset: -1px;\n  	box-sizing: border-box;\n  	background-clip: border-box;\n  	overflow: hidden;\n  	transform: translateZ(0);\n\n  	._2cbe2fbfe32e4150-headerActions ._2cbe2fbfe32e4150-button.lookFilled, ._2cbe2fbfe32e4150-cardBody button {\n  			color: var(--white);\n  			background: var(--opacity-white-24);\n  			&:hover {\n  					background: var(--opacity-white-36);\n  			}\n  			&:active {\n  					background: var(--opacity-white-32);\n  			}\n  	}\n\n  	._2cbe2fbfe32e4150-cardHeader {\n  			padding: var(--space-lg);\n  			position: relative;\n  			flex-direction: row;\n  			background: unset;\n  	}\n  	._2cbe2fbfe32e4150-nameTag {\n  			color: var(--white);\n  	}\n  	._2cbe2fbfe32e4150-splashArt, ._2cbe2fbfe32e4150-server {\n  			background-position: center;\n  			background-repeat: no-repeat;\n  			background-size: cover;\n  			filter: unset;\n  			mask: radial-gradient(100% 100% at top right, var(--white) 0, transparent 100%);\n  			opacity: .3;\n  			position: absolute;\n  			top: 0;\n  			left: unset;\n  			right: 0;\n  			width: 300px;\n  			height: 120px;\n  			pointer-events: none;\n  			z-index: -1;\n  	}\n  	&:hover {\n  			._2cbe2fbfe32e4150-headerIcon {\n  					display: none;\n  			}\n  			._2cbe2fbfe32e4150-headerActions {\n  					display: flex;\n  			}\n  	}\n  	._2cbe2fbfe32e4150-cardBody {\n  			display: flex;\n  			gap: var(--space-lg);\n  			padding: 0 var(--space-lg) var(--space-lg);\n  			background: unset;\n  	}\n  	._2cbe2fbfe32e4150-section {\n  			background: var(--background-mod-normal);\n  			border-radius: var(--radius-sm);\n  			padding: var(--space-sm);\n  	}\n  	._2cbe2fbfe32e4150-game {\n  			padding: 0;\n  	}\n  	._2cbe2fbfe32e4150-sectionDivider {\n  			border-color: var(--opacity-white-12) !important;\n  			border-width: 1px;\n  			margin: 12px 0 12px 0;\n  	}\n  	._2cbe2fbfe32e4150-voiceSectionText {\n  			color: var(--white);\n  	}\n  	._2cbe2fbfe32e4150-headerIcon, ._2cbe2fbfe32e4150-gameIcon, ._2cbe2fbfe32e4150-assetsLargeImage._2cbe2fbfe32e4150-assetsLargeImage {\n  			border-radius: var(--radius-sm);\n  	}\n  	._2cbe2fbfe32e4150-gameInfo {\n  			color: var(--white);\n  	}\n  	._2cbe2fbfe32e4150-playTime:not(a), ._2cbe2fbfe32e4150-voiceSectionSubtext {\n  			color: var(--app-message-embed-secondary-text) !important;\n  	}\n  	._2cbe2fbfe32e4150-serviceButtonWrapper {\n  			gap: 8px !important;\n  	}\n  	._2cbe2fbfe32e4150-contentImagesActivityFeed {\n  			color: var(--white);\n  	}\n  	._2cbe2fbfe32e4150-textRow {\n  			font-size: 16px;\n  			line-height: 18px;\n  	}\n  	._2cbe2fbfe32e4150-state {\n  			color: var(--app-message-embed-secondary-text);\n  			font-size: 14px;\n  			line-height: 16px;\n  	}\n  	.tabularNumbers {\n  			color: var(--app-message-embed-secondary-text) !important;\n  	}\n  	.bar {\n  			background-color: var(--opacity-white-24);\n  	}\n  	.progress {\n  			background-color: var(--white);\n  	}\n  	._2cbe2fbfe32e4150-activity:last-child:not(:only-child) {\n  			margin-top: 12px;\n  	}\n}\n`);
function webpackify(css) {
	for (const key in styles) {
		let regex = new RegExp(`\\.${key}([\\s,.):>])`, "g");
		css = css.replace(regex, `.${styles[key]}$1`);
	}
	return css;
}

// modules/stores.js
const GameStore = betterdiscord.Webpack.getStore("GameStore");
const NowPlayingViewStore = betterdiscord.Webpack.getStore("NowPlayingViewStore");
const RunningGameStore = betterdiscord.Webpack.getStore("RunningGameStore");
const UserStore = betterdiscord.Webpack.getStore("UserStore");
const { useStateFromStores } = betterdiscord.Webpack.getMangled((m) => m.Store, { useStateFromStores: betterdiscord.Webpack.Filters.byStrings("useStateFromStores") }, { raw: true });

// activity_feed/common/SectionHeader.jsx
function SectionHeader({ label }) {
	return BdApi.React.createElement("div", { className: `_2cbe2fbfe32e4150-headerContainer ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-headerText" }, label));
}

// activity_feed/quick_launcher/launcher.tsx
function LauncherGameBuilder({ game, runningGames }) {
	const [shouldDisable, setDisable] = react.useState(false);
	setTimeout(() => setDisable(false), 1e4);
	const disableCheck = react.useMemo(() => ~runningGames.findIndex((m) => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
	return BdApi.React.createElement("div", { className: `_2cbe2fbfe32e4150-dockItem ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-dockIcon", style: { backgroundImage: `url(${"https://cdn.discordapp.com/app-icons/" + GameStore.getGameByName(game.name).id + "/" + GameStore.getGameByName(game.name).icon + ".webp"})` } }), BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-dockItemText" }, game.name), BdApi.React.createElement(
		"button",
		{
			className: `_2cbe2fbfe32e4150-dockItemPlay ${Common.ButtonClasses.button} ${Common.ButtonClasses.lookFilled} ${Common.ButtonClasses.colorGreen} ${Common.ButtonClasses.sizeSmall} ${Common.ButtonClasses.fullWidth} ${Common.ButtonClasses.grow}`,
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
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Quick Launcher" }), gameList.length === 0 ? BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-dock _2cbe2fbfe32e4150-emptyState" }, BdApi.React.createElement("svg", { className: "_2cbe2fbfe32e4150-emptyIcon", name: "OpenExternal", width: 16, height: 16, viewBox: "0 0 24 24" }, BdApi.React.createElement("path", { fill: "currentColor", transform: "translate(3, 4)", d: "M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" })), BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-emptyText" }, "Discord can quickly launch most games you\u2019ve recently played on this computer. Go ahead and launch one to see it appear here!")) : BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-dock" }, _gameList.map((game) => BdApi.React.createElement(LauncherGameBuilder, { game, runningGames }))));
}

// activity_feed/now_playing/columnBuilder.tsx
function NowPlayingColumnBuilder({}) {
	return;
}

// activity_feed/common.js
function chunkArray(cards, num) {
	let chunkLength = Math.max(cards.length / num, 1);
	const chunks = [];
	for (let i = 0; i < num; i++) {
		if (chunkLength * (i + 1) <= cards.length) chunks.push(cards.slice(chunkLength * i, chunkLength * (i + 1)));
	}
	return chunks.reverse();
}

// activity_feed/now_playing/baseBuilder.tsx
function NowPlayingBuilder(props) {
	Common.FluxDispatcher.dispatch({ type: "NOW_PLAYING_MOUNTED" });
	const user = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
	const nowPlayingCards = useStateFromStores([NowPlayingViewStore], () => NowPlayingViewStore.nowPlayingCards);
	const cardColumns = chunkArray(nowPlayingCards, 2);
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Now Playing" }), nowPlayingCards.length === 0 ? BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-emptyState" }, BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-emptyTitle" }, "Nobody is playing anything right now..."), BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-emptySubtitle" }, "When someone starts playing a game we'll show it here!")) : BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-nowPlayingContainer" }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-nowPlayingColumn" }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column, currentUser: user })))));
}

// activity_feed/base.tsx
function Scroller({ children, padding }) {
	return BdApi.React.createElement("div", { className: `_2cbe2fbfe32e4150-scrollerBase`, style: { overflow: "hidden scroll", paddingRight: `${padding}px` || "0px" } }, children);
}
function TabBaseBuilder() {
	document.title = "Activity";
	const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"];
	return BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-activityFeed" }, BdApi.React.createElement(Common.HeaderBar, { className: "_2cbe2fbfe32e4150-headerBar", "aria-label": "Activity" }, BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-iconWrapper" }, BdApi.React.createElement("svg", { className: Common.UpperIconClasses.icon, style: { width: 24, height: 24 }, viewBox: "0 0 24 24", fill: "none" }, BdApi.React.createElement("path", { d: ControllerIcon, fill: "var(--channel-icon)" }))), BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-titleWrapper" }, BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-title" }, "Activity"))), BdApi.React.createElement(Scroller, null, BdApi.React.createElement("div", { className: "_2cbe2fbfe32e4150-centerContainer" }, BdApi.React.createElement(QuickLauncherBuilder, { className: "_2cbe2fbfe32e4150-quickLauncher", style: { position: "relative", padding: "0 20px 0 20px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: "_2cbe2fbfe32e4150-nowPlaying", style: { position: "relative", padding: "0 20px 20px 20px" } }), BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))));
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
		console.log(activityPanelCSS);
		betterdiscord.DOM.addStyle("activityPanelCSS", activityPanelCSS);
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