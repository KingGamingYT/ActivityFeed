/**
 * @name ActivityFeed
 * @author KingGamingYT
 * @description A from-the-ground-up recreation of Discord's Activity Feed tab circa late 2018-early 2019, featuring game news, a quick launcher, and friend activity with modern touches.
 * @version 1.0.0
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
	{ name: "ActivityActions", filter: betterdiscord.Webpack.Filters.byStrings("display", "getUserOutbox") },
	{ name: "ActivityButtons", filter: betterdiscord.Webpack.Filters.byStrings("activity", "USER_PROFILE_ACTIVITY_BUTTONS") },
	{ name: "ActivityCardClasses", filter: betterdiscord.Webpack.Filters.byKeys("gameState", "clickableImage") },
	{ name: "ActivitySectionModule", filter: (x) => x.key === "activity_section", searchExports: true },
	{ name: "ActivityTimer", filter: betterdiscord.Webpack.Filters.byStrings("timestamps", ".TEXT_FEEDBACK_POSITIVE"), searchExports: true },
	{ name: "AnchorClasses", filter: betterdiscord.Webpack.Filters.byKeys("anchor", "anchorUnderlineOnHover"), searchExports: true },
	{ name: "Animated", filter: (x) => x.Easing && x.accelerate },
	{ name: "AvatarFetch", filter: betterdiscord.Webpack.Filters.byStrings("src", "statusColor", "size", "isMobile"), searchExports: true },
	{ name: "BasicLibraryApplication", filter: betterdiscord.Webpack.Filters.byPrototypeKeys("getDistributor") },
	{ name: "ButtonVoidClasses", filter: betterdiscord.Webpack.Filters.byKeys("lookFilled", "button") },
	{ name: "ButtonManaClasses", filter: (x) => x.primary && x.hasText && !x.hasTrailing },
	{ name: "CallButtons", filter: betterdiscord.Webpack.Filters.byStrings("PRESS_JOIN_CALL_BUTTON") },
	{ name: "CaretClasses", filter: betterdiscord.Webpack.Filters.byKeys("caret", "caret--center") },
	{ name: "Clipboard", filter: betterdiscord.Webpack.Filters.byStrings("navigator.clipboard.write", "Clipboard API not supported."), searchExports: true },
	{ name: "ClydeIcon", filter: betterdiscord.Webpack.Filters.byStrings("colorClass", "M19.73"), searchExports: true },
	{ name: "ContainerRefProvider", filter: betterdiscord.Webpack.Filters.byStrings("setContainer", "Provider"), searchExports: true },
	{ name: "DMSidebar", filter: betterdiscord.Webpack.Filters.bySource(".A.CONTACTS_LIST") },
	{ name: "Endpoints", filter: betterdiscord.Webpack.Filters.byKeys("GUILD_EMOJI", "GUILD_EMOJIS"), searchExports: true },
	{ name: "FetchApplications", filter: betterdiscord.Webpack.Filters.byKeys("getApplicationsForGuild") },
	{ name: "FetchUserApplicationStatistics", filter: betterdiscord.Webpack.Filters.byStrings('"USER_ACTIVITY_STATISTICS_FETCH_SUCCESS"'), searchExports: true },
	{ name: "FetchUserProfile", filter: betterdiscord.Webpack.Filters.byStrings("fetchProfile error", "USER_PROFILE_FETCH_FAILURE"), searchExports: true },
	{ name: "Flex", filter: betterdiscord.Webpack.Filters.byStrings("grow", "shrink", "align", "basis") },
	{ name: "FluxDispatcher", filter: betterdiscord.Webpack.Filters.byKeys("dispatch", "subscribe", "register"), searchExports: true },
	{ name: "FluxStore", filter: (x) => typeof x.Ay?.Store === "function", searchExports: false, searchDefault: false },
	{ name: "FormSwitch", filter: betterdiscord.Webpack.Filters.byStrings("hasIcon", "switchIconsEnabled"), searchExports: true },
	{ name: "GameControllerIcon", filter: betterdiscord.Webpack.Filters.byStrings(".09v4.91a3.09"), searchExports: true },
	{ name: "GameFetchModule", filter: betterdiscord.Webpack.Filters.bySource('type:"GAME_FETCH_SUCCESS",gameIds:') },
	{ name: "GameProfile", filter: (x) => x.openGameProfileModal },
	{ name: "GameProfileCheck", filter: betterdiscord.Webpack.Filters.byStrings("gameProfileModalChecks", "onOpened") },
	{ name: "GradientComponent", filter: betterdiscord.Webpack.Filters.byStrings("darken"), searchExports: true },
	{ name: "HeaderBar", filter: betterdiscord.Webpack.Filters.byKeys("Icon", "Divider") },
	{ name: "HTTPUtils", filter: (x) => typeof x === "object" && x.del && x.put, searchExports: true },
	{ name: "intl", filter: (x) => x.t && x.t.formatToMarkdownString },
	{ name: "IsGameLaunchable", filter: betterdiscord.Webpack.Filters.byStrings("ConnectedAppsStore", "branchId") },
	{ name: "JoinButton", filter: betterdiscord.Webpack.Filters.byStrings("user", "activity", "onAction", "onClose", "themeType", "embeddedActivity") },
	{ name: "LibraryApplicationUtils", filter: (x) => x.installApplication },
	{ name: "Link", filter: betterdiscord.Webpack.Filters.byStrings("Anchor", "href", "stopPropagation"), searchExports: true },
	{ name: "LinkButton", filter: betterdiscord.Webpack.Filters.byStrings("route", "iconClassName"), searchExports: true },
	{ name: "LinkButtonClasses", filter: betterdiscord.Webpack.Filters.byKeys("linkButtonIcon") },
	{ name: "LiveBadge", filter: betterdiscord.Webpack.Filters.byStrings("shape", ".ROUND") },
	{ name: "Lodash", filter: betterdiscord.Webpack.Filters.byKeys("throttle") },
	{ name: "MediaProgressBar", filter: betterdiscord.Webpack.Filters.byStrings("start", "end", "duration", "percentage"), searchExports: true },
	{ name: "ModalAccessUtils", filter: (x) => x.openUserProfileModal },
	{ name: "ModalSystem", filter: (x) => x.openModal },
	{ name: "NintendoSwitchNeutralIcon", filter: betterdiscord.Webpack.Filters.byStrings("colorClass", "M10.04"), searchExports: true },
	{ name: "ModalRoot", filter: (x) => x.Modal },
	{ name: "OpenAlbum", filter: betterdiscord.Webpack.Filters.byStrings(".ALBUM", ".EPISODE"), searchExports: true },
	{ name: "OpenArtist", filter: betterdiscord.Webpack.Filters.byStrings('"no artist ids in metadata"'), searchExports: true },
	{ name: "OpenDM", filter: (x) => x.openPrivateChannel },
	{ name: "OpenLink", filter: betterdiscord.Webpack.Filters.byStrings("UserProfile", "activity", "application", "void") },
	{ name: "OpenVoiceChannel", filter: (x) => x.selectVoiceChannel, searchExports: true },
	{ name: "OpenStream", filter: betterdiscord.Webpack.Filters.byStrings("guildId", "getWindowOpen", "CHANNEL_CALL_POPOUT"), searchExports: true },
	{ name: "OpenTrack", filter: betterdiscord.Webpack.Filters.byStrings(".TRACK", "isProtocolRegistered"), searchExports: true },
	{ name: "OpenUserSettings", filter: (x) => x.openUserSettings },
	{ name: "Popout", filter: betterdiscord.Webpack.Filters.byStrings("Unsupported animation config:"), searchExports: true },
	{ name: "PopoverClasses", filter: (x) => x.graphic && x.closeButton },
	{ name: "PositionClasses", filter: betterdiscord.Webpack.Filters.byKeys("noWrap") },
	{ name: "ReactSpring", filter: betterdiscord.Webpack.Filters.byKeys("useSpring", "a") },
	{ name: "RootSectionModule", filter: (x) => x?.key === "$Root", searchExports: true },
	{ name: "ScrollerClasses", filter: betterdiscord.Webpack.Filters.byKeys("customTheme", "thin") },
	{ name: "ScrollerHandler", filter: betterdiscord.Webpack.Filters.byStrings('"rtl"', "getComputedStyle") },
	{ name: "ScrollerSpecHandler", filter: betterdiscord.Webpack.Filters.byStrings("document.body.appendChild(", "offsetWidth") },
	{ name: "ScrollerStyleHandler", filter: betterdiscord.Webpack.Filters.byStrings('arguments[2]:"scroll"') },
	{ name: "ScrollerOverflowPopoutClasses", filter: betterdiscord.Webpack.Filters.byKeys("popoutWrapper", "size24") },
	{ name: "Spinner", filter: betterdiscord.Webpack.Filters.byStrings('="wanderingCubes'), searchExports: true },
	{ name: "SpotifyButtons", filter: betterdiscord.Webpack.Filters.byStrings("activity", "PRESS_PLAY_ON_SPOTIFY_BUTTON") },
	{ name: "TextFormatClasses", filter: betterdiscord.Webpack.Filters.byKeys("defaultColor") },
	{ name: "Tooltip", filter: betterdiscord.Webpack.Filters.byPrototypeKeys("renderTooltip"), searchExports: true },
	{ name: "TransitionGroup", filter: betterdiscord.Webpack.Filters.byStrings("transitionAppear"), searchExports: true },
	{ name: "UIModule", filter: (x) => x.Heading && x.ButtonGroup },
	{ name: "UpperIconClasses", filter: betterdiscord.Webpack.Filters.byKeys("icon", "upperContainer") },
	{ name: "UseStreamPreviewURL", filter: betterdiscord.Webpack.Filters.byStrings(".canBasicChannel", "previewUrl:", ".CONNECT", "getVoiceChannelId") },
	{ name: "UserProfileWrapperComponent", filter: betterdiscord.Webpack.Filters.byStrings("onClickContainer:", "user:", ".isNonUserBot()?") },
	{ name: "UsernameUtils", filter: (x) => x.humanizeStatus },
	{ name: "VoiceList", filter: betterdiscord.Webpack.Filters.byStrings("maxUsers", "guildId", "getNickname") },
	{ name: "XboxNeutralIcon", filter: betterdiscord.Webpack.Filters.byStrings("22.95c-1.7-.16-3.4-.77-4.88-1.73-1.24-.8-1.52-1.13-1.52-1.8"), searchExports: true },
	{ name: "ManaSwitch", filter: betterdiscord.Webpack.Filters.byStrings("SWITCH_BACKGROUND_DEFAULT"), searchExports: true }
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
const Title = betterdiscord.Webpack.getMangled("flashQueue", {
	WindowTitle: betterdiscord.Webpack.Filters.byStrings("null")
});
const ContextMenus = () => {
	let ContextMenuUser = betterdiscord.Webpack.getByStrings("isGroupDM", "targetIsUser", "guildId", { searchExports: true });
	let ContextMenuActivityFeed = betterdiscord.Webpack.getBySource('.ACTIVITY_PANEL,"NowPlaying")', { declarationFilter: (x) => x?.displayName === "withAnalyticsContext()" }).render().props.children().type.prototype.handleChannelContextMenu;
	if (!ContextMenuUser) {
		ContextMenuUser = betterdiscord.Webpack.getByStrings("isGroupDM", "targetIsUser", "guildId", { searchExports: true });
		ContextMenuActivityFeed = betterdiscord.Webpack.getBySource('.ACTIVITY_PANEL,"NowPlaying")', { declarationFilter: (x) => x?.displayName === "withAnalyticsContext()" }).render().props.children().type.prototype.handleChannelContextMenu;
	}
	return { ContextMenuUser, ContextMenuActivityFeed };
};
const CardPopout = betterdiscord.Webpack.getBySource("ACTIVITY_FEED_GUILD_VISITED", { declarationFilter: betterdiscord.Webpack.Filters.byStrings("ACTIVITY_FEED_GUILD_VISITED") });
const SettingsButton = betterdiscord.Webpack.getMangled(betterdiscord.Webpack.Filters.bySource("webBuildOverride"), {
	Button: betterdiscord.Webpack.Filters.byStrings("webBuildOverride")
}, { mapDeclarations: true });
const Router = betterdiscord.Webpack.getMangled("Router-History", {
	useLocation: betterdiscord.Webpack.Filters.byRegex(/return .{1,4}.location/)
});
const FetchGameUtils = betterdiscord.Webpack.getMangled('Error("Failed to fetch game data")', {
	fetchGames: betterdiscord.Webpack.Filters.byStrings("isLoading", "Array.isArray")
});
const ManaButtons = betterdiscord.Webpack.getMangled(betterdiscord.Webpack.Filters.bySource("SPINNING_CIRCLE", "__unsupportedReactNodeAsText", "tooltipAlign", '"sm","aria-label"'), {
	PrimaryButtonWithIcon: (x) => String(x).includes('"sm",.'),
	PrimaryButtonLazy: (x) => String(x).includes("loading"),
	IconOnlyButton: (x) => String(x).includes("targetElementRef")
});
const SettingsRoot = betterdiscord.Webpack.waitForModule((m) => m?.key === "$Root", { searchExports: true, searchDefault: false });
const RecentlyPlayedByApplicationId = betterdiscord.Webpack.waitForModule(betterdiscord.Webpack.Filters.byStrings("GLOBAL_FEED", "application_id", "useMemo"), { searchExports: true });
betterdiscord.Webpack.waitForModule(betterdiscord.Webpack.Filters.bySource('"GameProfileModal"', "forceV2"));

// modules/stores.js
const ApplicationStore = betterdiscord.Webpack.getStore("ApplicationStore");
const ChannelStore = betterdiscord.Webpack.getStore("ChannelStore");
const ConnectedAppsStore = betterdiscord.Webpack.getStore("ConnectedAppsStore");
const ContentInventoryStore = betterdiscord.Webpack.getStore("ContentInventoryStore");
const DispatchApplicationStore = betterdiscord.Webpack.getStore("DispatchApplicationStore");
const GameStore = betterdiscord.Webpack.getStore("GameStore");
const LaunchableGameStore = betterdiscord.Webpack.getStore("LaunchableGameStore");
const LibraryApplicationStatisticsStore = betterdiscord.Webpack.getStore("LibraryApplicationStatisticsStore");
const LibraryApplicationStore = betterdiscord.Webpack.getStore("LibraryApplicationStore");
const NewGameStore = betterdiscord.Webpack.getStore("NewGameStore");
const NowPlayingViewStore = betterdiscord.Webpack.getStore("NowPlayingViewStore");
const PresenceStore = betterdiscord.Webpack.getStore("PresenceStore");
const RunningGameStore = betterdiscord.Webpack.getStore("RunningGameStore");
const ThemeStore = betterdiscord.Webpack.getStore("ThemeStore");
const UserProfileStore = betterdiscord.Webpack.getStore("UserProfileStore");
const UserSettingsProtoStore = betterdiscord.Webpack.getStore("UserSettingsProtoStore");
const UserStore = betterdiscord.Webpack.getStore("UserStore");
const { useStateFromStores } = betterdiscord.Webpack.getMangled((m) => m.Store, { useStateFromStores: betterdiscord.Webpack.Filters.byStrings("useStateFromStores") }, { raw: true });
const VoiceStateStore = betterdiscord.Webpack.getStore("VoiceStateStore");
const WindowStore = betterdiscord.Webpack.getStore("WindowStore");

// fast-xml-parser
const nameStartChar = ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*';
const regexName = new RegExp('^' + nameRegexp + '$');
function getAllMatches(string, regex) {
	const matches = [];
	let match = regex.exec(string);
	while (match) {
		const allmatches = [];
		allmatches.startIndex = regex.lastIndex - match[0].length;
		const len = match.length;
		for (let index = 0; index < len; index++) {
			allmatches.push(match[index]);
		}
		matches.push(allmatches);
		match = regex.exec(string);
	}
	return matches;
}
const isName = function (string) {
	const match = regexName.exec(string);
	return !(match === null || typeof match === 'undefined');
};
function isExist(v) {
	return typeof v !== 'undefined';
}
const DANGEROUS_PROPERTY_NAMES = [
	'hasOwnProperty',
	'toString',
	'valueOf',
	'__defineGetter__',
	'__defineSetter__',
	'__lookupGetter__',
	'__lookupSetter__'
];
const criticalProperties = ["__proto__", "constructor", "prototype"];

// fast-xml-parser
const defaultOptions$1 = {
	allowBooleanAttributes: false,
	unpairedTags: []
};
function validate(xmlData, options) {
	options = Object.assign({}, defaultOptions$1, options);
	const tags = [];
	let tagFound = false;
	let reachedRoot = false;
	if (xmlData[0] === '\ufeff') {
		xmlData = xmlData.substr(1);
	}
	for (let i = 0; i < xmlData.length; i++) {
		if (xmlData[i] === '<' && xmlData[i + 1] === '?') {
			i += 2;
			i = readPI(xmlData, i);
			if (i.err) return i;
		} else if (xmlData[i] === '<') {
			let tagStartPos = i;
			i++;
			if (xmlData[i] === '!') {
				i = readCommentAndCDATA(xmlData, i);
				continue;
			} else {
				let closingTag = false;
				if (xmlData[i] === '/') {
					closingTag = true;
					i++;
				}
				let tagName = '';
				for (; i < xmlData.length &&
					xmlData[i] !== '>' &&
					xmlData[i] !== ' ' &&
					xmlData[i] !== '\t' &&
					xmlData[i] !== '\n' &&
					xmlData[i] !== '\r'; i++
				) {
					tagName += xmlData[i];
				}
				tagName = tagName.trim();
				if (tagName[tagName.length - 1] === '/') {
					tagName = tagName.substring(0, tagName.length - 1);
					i--;
				}
				if (!validateTagName(tagName)) {
					let msg;
					if (tagName.trim().length === 0) {
						msg = "Invalid space after '<'.";
					} else {
						msg = "Tag '" + tagName + "' is an invalid name.";
					}
					return getErrorObject('InvalidTag', msg, getLineNumberForPosition(xmlData, i));
				}
				const result = readAttributeStr(xmlData, i);
				if (result === false) {
					return getErrorObject('InvalidAttr', "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
				}
				let attrStr = result.value;
				i = result.index;
				if (attrStr[attrStr.length - 1] === '/') {
					const attrStrStart = i - attrStr.length;
					attrStr = attrStr.substring(0, attrStr.length - 1);
					const isValid = validateAttributeString(attrStr, options);
					if (isValid === true) {
						tagFound = true;
					} else {
						return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
					}
				} else if (closingTag) {
					if (!result.tagClosed) {
						return getErrorObject('InvalidTag', "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
					} else if (attrStr.trim().length > 0) {
						return getErrorObject('InvalidTag', "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
					} else if (tags.length === 0) {
						return getErrorObject('InvalidTag', "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
					} else {
						const otg = tags.pop();
						if (tagName !== otg.tagName) {
							let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
							return getErrorObject('InvalidTag',
								"Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
								getLineNumberForPosition(xmlData, tagStartPos));
						}
						if (tags.length == 0) {
							reachedRoot = true;
						}
					}
				} else {
					const isValid = validateAttributeString(attrStr, options);
					if (isValid !== true) {
						return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
					}
					if (reachedRoot === true) {
						return getErrorObject('InvalidXml', 'Multiple possible root nodes found.', getLineNumberForPosition(xmlData, i));
					} else if (options.unpairedTags.indexOf(tagName) !== -1) ; else {
						tags.push({ tagName, tagStartPos });
					}
					tagFound = true;
				}
				for (i++; i < xmlData.length; i++) {
					if (xmlData[i] === '<') {
						if (xmlData[i + 1] === '!') {
							i++;
							i = readCommentAndCDATA(xmlData, i);
							continue;
						} else if (xmlData[i + 1] === '?') {
							i = readPI(xmlData, ++i);
							if (i.err) return i;
						} else {
							break;
						}
					} else if (xmlData[i] === '&') {
						const afterAmp = validateAmpersand(xmlData, i);
						if (afterAmp == -1)
							return getErrorObject('InvalidChar', "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
						i = afterAmp;
					} else {
						if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
							return getErrorObject('InvalidXml', "Extra text at the end", getLineNumberForPosition(xmlData, i));
						}
					}
				}
				if (xmlData[i] === '<') {
					i--;
				}
			}
		} else {
			if (isWhiteSpace(xmlData[i])) {
				continue;
			}
			return getErrorObject('InvalidChar', "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
		}
	}
	if (!tagFound) {
		return getErrorObject('InvalidXml', 'Start tag expected.', 1);
	} else if (tags.length == 1) {
		return getErrorObject('InvalidTag', "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
	} else if (tags.length > 0) {
		return getErrorObject('InvalidXml', "Invalid '" +
			JSON.stringify(tags.map(t => t.tagName), null, 4).replace(/\r?\n/g, '') +
			"' found.", { line: 1, col: 1 });
	}
	return true;
}function isWhiteSpace(char) {
	return char === ' ' || char === '\t' || char === '\n' || char === '\r';
}
function readPI(xmlData, i) {
	const start = i;
	for (; i < xmlData.length; i++) {
		if (xmlData[i] == '?' || xmlData[i] == ' ') {
			const tagname = xmlData.substr(start, i - start);
			if (i > 5 && tagname === 'xml') {
				return getErrorObject('InvalidXml', 'XML declaration allowed only at the start of the document.', getLineNumberForPosition(xmlData, i));
			} else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
				i++;
				break;
			} else {
				continue;
			}
		}
	}
	return i;
}
function readCommentAndCDATA(xmlData, i) {
	if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
		for (i += 3; i < xmlData.length; i++) {
			if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
				i += 2;
				break;
			}
		}
	} else if (
		xmlData.length > i + 8 &&
		xmlData[i + 1] === 'D' &&
		xmlData[i + 2] === 'O' &&
		xmlData[i + 3] === 'C' &&
		xmlData[i + 4] === 'T' &&
		xmlData[i + 5] === 'Y' &&
		xmlData[i + 6] === 'P' &&
		xmlData[i + 7] === 'E'
	) {
		let angleBracketsCount = 1;
		for (i += 8; i < xmlData.length; i++) {
			if (xmlData[i] === '<') {
				angleBracketsCount++;
			} else if (xmlData[i] === '>') {
				angleBracketsCount--;
				if (angleBracketsCount === 0) {
					break;
				}
			}
		}
	} else if (
		xmlData.length > i + 9 &&
		xmlData[i + 1] === '[' &&
		xmlData[i + 2] === 'C' &&
		xmlData[i + 3] === 'D' &&
		xmlData[i + 4] === 'A' &&
		xmlData[i + 5] === 'T' &&
		xmlData[i + 6] === 'A' &&
		xmlData[i + 7] === '['
	) {
		for (i += 8; i < xmlData.length; i++) {
			if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
				i += 2;
				break;
			}
		}
	}
	return i;
}
const doubleQuote = '"';
const singleQuote = "'";
function readAttributeStr(xmlData, i) {
	let attrStr = '';
	let startChar = '';
	let tagClosed = false;
	for (; i < xmlData.length; i++) {
		if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
			if (startChar === '') {
				startChar = xmlData[i];
			} else if (startChar !== xmlData[i]) ; else {
				startChar = '';
			}
		} else if (xmlData[i] === '>') {
			if (startChar === '') {
				tagClosed = true;
				break;
			}
		}
		attrStr += xmlData[i];
	}
	if (startChar !== '') {
		return false;
	}
	return {
		value: attrStr,
		index: i,
		tagClosed: tagClosed
	};
}
const validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g');
function validateAttributeString(attrStr, options) {
	const matches = getAllMatches(attrStr, validAttrStrRegxp);
	const attrNames = {};
	for (let i = 0; i < matches.length; i++) {
		if (matches[i][1].length === 0) {
			return getErrorObject('InvalidAttr', "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]))
		} else if (matches[i][3] !== undefined && matches[i][4] === undefined) {
			return getErrorObject('InvalidAttr', "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
		} else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
			return getErrorObject('InvalidAttr', "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
		}
		const attrName = matches[i][2];
		if (!validateAttrName(attrName)) {
			return getErrorObject('InvalidAttr', "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
		}
		if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) {
			attrNames[attrName] = 1;
		} else {
			return getErrorObject('InvalidAttr', "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
		}
	}
	return true;
}
function validateNumberAmpersand(xmlData, i) {
	let re = /\d/;
	if (xmlData[i] === 'x') {
		i++;
		re = /[\da-fA-F]/;
	}
	for (; i < xmlData.length; i++) {
		if (xmlData[i] === ';')
			return i;
		if (!xmlData[i].match(re))
			break;
	}
	return -1;
}
function validateAmpersand(xmlData, i) {
	i++;
	if (xmlData[i] === ';')
		return -1;
	if (xmlData[i] === '#') {
		i++;
		return validateNumberAmpersand(xmlData, i);
	}
	let count = 0;
	for (; i < xmlData.length; i++, count++) {
		if (xmlData[i].match(/\w/) && count < 20)
			continue;
		if (xmlData[i] === ';')
			break;
		return -1;
	}
	return i;
}
function getErrorObject(code, message, lineNumber) {
	return {
		err: {
			code: code,
			msg: message,
			line: lineNumber.line || lineNumber,
			col: lineNumber.col,
		},
	};
}
function validateAttrName(attrName) {
	return isName(attrName);
}
function validateTagName(tagname) {
	return isName(tagname) ;
}
function getLineNumberForPosition(xmlData, index) {
	const lines = xmlData.substring(0, index).split(/\r?\n/);
	return {
		line: lines.length,
		col: lines[lines.length - 1].length + 1
	};
}
function getPositionFromMatch(match) {
	return match.startIndex + match[1].length;
}

// fast-xml-parser
const defaultOnDangerousProperty = (name) => {
	if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
		return "__" + name;
	}
	return name;
};
const defaultOptions = {
	preserveOrder: false,
	attributeNamePrefix: '@_',
	attributesGroupName: false,
	textNodeName: '#text',
	ignoreAttributes: true,
	removeNSPrefix: false,
	allowBooleanAttributes: false,
	parseTagValue: true,
	parseAttributeValue: false,
	trimValues: true,
	cdataPropName: false,
	numberParseOptions: {
		hex: true,
		leadingZeros: true,
		eNotation: true
	},
	tagValueProcessor: function (tagName, val) {
		return val;
	},
	attributeValueProcessor: function (attrName, val) {
		return val;
	},
	stopNodes: [],
	alwaysCreateTextNode: false,
	isArray: () => false,
	commentPropName: false,
	unpairedTags: [],
	processEntities: true,
	htmlEntities: false,
	ignoreDeclaration: false,
	ignorePiTags: false,
	transformTagName: false,
	transformAttributeName: false,
	updateTag: function (tagName, jPath, attrs) {
		return tagName
	},
	captureMetaData: false,
	maxNestedTags: 100,
	strictReservedNames: true,
	jPath: true,
	onDangerousProperty: defaultOnDangerousProperty
};
function validatePropertyName(propertyName, optionName) {
	if (typeof propertyName !== 'string') {
		return;
	}
	const normalized = propertyName.toLowerCase();
	if (DANGEROUS_PROPERTY_NAMES.some(dangerous => normalized === dangerous.toLowerCase())) {
		throw new Error(
			`[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
		);
	}
	if (criticalProperties.some(dangerous => normalized === dangerous.toLowerCase())) {
		throw new Error(
			`[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
		);
	}
}
function normalizeProcessEntities(value) {
	if (typeof value === 'boolean') {
		return {
			enabled: value,
			maxEntitySize: 10000,
			maxExpansionDepth: 10,
			maxTotalExpansions: 1000,
			maxExpandedLength: 100000,
			maxEntityCount: 100,
			allowedTags: null,
			tagFilter: null
		};
	}
	if (typeof value === 'object' && value !== null) {
		return {
			enabled: value.enabled !== false,
			maxEntitySize: Math.max(1, value.maxEntitySize ?? 10000),
			maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 10000),
			maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? Infinity),
			maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 100000),
			maxEntityCount: Math.max(1, value.maxEntityCount ?? 1000),
			allowedTags: value.allowedTags ?? null,
			tagFilter: value.tagFilter ?? null
		};
	}
	return normalizeProcessEntities(true);
}
const buildOptions = function (options) {
	const built = Object.assign({}, defaultOptions, options);
	const propertyNameOptions = [
		{ value: built.attributeNamePrefix, name: 'attributeNamePrefix' },
		{ value: built.attributesGroupName, name: 'attributesGroupName' },
		{ value: built.textNodeName, name: 'textNodeName' },
		{ value: built.cdataPropName, name: 'cdataPropName' },
		{ value: built.commentPropName, name: 'commentPropName' }
	];
	for (const { value, name } of propertyNameOptions) {
		if (value) {
			validatePropertyName(value, name);
		}
	}
	if (built.onDangerousProperty === null) {
		built.onDangerousProperty = defaultOnDangerousProperty;
	}
	built.processEntities = normalizeProcessEntities(built.processEntities);
	built.unpairedTagsSet = new Set(built.unpairedTags);
	if (built.stopNodes && Array.isArray(built.stopNodes)) {
		built.stopNodes = built.stopNodes.map(node => {
			if (typeof node === 'string' && node.startsWith('*.')) {
				return '..' + node.substring(2);
			}
			return node;
		});
	}
	return built;
};

// fast-xml-parser
let METADATA_SYMBOL$1;
if (typeof Symbol !== "function") {
	METADATA_SYMBOL$1 = "@@xmlMetadata";
} else {
	METADATA_SYMBOL$1 = Symbol("XML Node Metadata");
}
class XmlNode {
	constructor(tagname) {
		this.tagname = tagname;
		this.child = [];
		this[":@"] = Object.create(null);
	}
	add(key, val) {
		if (key === "__proto__") key = "#__proto__";
		this.child.push({ [key]: val });
	}
	addChild(node, startIndex) {
		if (node.tagname === "__proto__") node.tagname = "#__proto__";
		if (node[":@"] && Object.keys(node[":@"]).length > 0) {
			this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
		} else {
			this.child.push({ [node.tagname]: node.child });
		}
		if (startIndex !== undefined) {
			this.child[this.child.length - 1][METADATA_SYMBOL$1] = { startIndex };
		}
	}
	static getMetaDataSymbol() {
		return METADATA_SYMBOL$1;
	}
}

// fast-xml-parser
class DocTypeReader {
		constructor(options) {
				this.suppressValidationErr = !options;
				this.options = options;
		}
		readDocType(xmlData, i) {
				const entities = Object.create(null);
				let entityCount = 0;
				if (xmlData[i + 3] === 'O' &&
						xmlData[i + 4] === 'C' &&
						xmlData[i + 5] === 'T' &&
						xmlData[i + 6] === 'Y' &&
						xmlData[i + 7] === 'P' &&
						xmlData[i + 8] === 'E') {
						i = i + 9;
						let angleBracketsCount = 1;
						let hasBody = false, comment = false;
						let exp = "";
						for (; i < xmlData.length; i++) {
								if (xmlData[i] === '<' && !comment) {
										if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
												i += 7;
												let entityName, val;
												[entityName, val, i] = this.readEntityExp(xmlData, i + 1, this.suppressValidationErr);
												if (val.indexOf("&") === -1) {
														if (this.options.enabled !== false &&
																this.options.maxEntityCount != null &&
																entityCount >= this.options.maxEntityCount) {
																throw new Error(
																		`Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
																);
														}
														const escaped = entityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
														entities[entityName] = {
																regx: RegExp(`&${escaped};`, "g"),
																val: val
														};
														entityCount++;
												}
										}
										else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
												i += 8;
												const { index } = this.readElementExp(xmlData, i + 1);
												i = index;
										} else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) {
												i += 8;
										} else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
												i += 9;
												const { index } = this.readNotationExp(xmlData, i + 1, this.suppressValidationErr);
												i = index;
										} else if (hasSeq(xmlData, "!--", i)) comment = true;
										else throw new Error(`Invalid DOCTYPE`);
										angleBracketsCount++;
										exp = "";
								} else if (xmlData[i] === '>') {
										if (comment) {
												if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
														comment = false;
														angleBracketsCount--;
												}
										} else {
												angleBracketsCount--;
										}
										if (angleBracketsCount === 0) {
												break;
										}
								} else if (xmlData[i] === '[') {
										hasBody = true;
								} else {
										exp += xmlData[i];
								}
						}
						if (angleBracketsCount !== 0) {
								throw new Error(`Unclosed DOCTYPE`);
						}
				} else {
						throw new Error(`Invalid Tag instead of DOCTYPE`);
				}
				return { entities, i };
		}
		readEntityExp(xmlData, i) {
				i = skipWhitespace(xmlData, i);
				const startIndex = i;
				while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
						i++;
				}
				let entityName = xmlData.substring(startIndex, i);
				validateEntityName$1(entityName);
				i = skipWhitespace(xmlData, i);
				if (!this.suppressValidationErr) {
						if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") {
								throw new Error("External entities are not supported");
						} else if (xmlData[i] === "%") {
								throw new Error("Parameter entities are not supported");
						}
				}
				let entityValue = "";
				[i, entityValue] = this.readIdentifierVal(xmlData, i, "entity");
				if (this.options.enabled !== false &&
						this.options.maxEntitySize != null &&
						entityValue.length > this.options.maxEntitySize) {
						throw new Error(
								`Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
						);
				}
				i--;
				return [entityName, entityValue, i];
		}
		readNotationExp(xmlData, i) {
				i = skipWhitespace(xmlData, i);
				const startIndex = i;
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						i++;
				}
				let notationName = xmlData.substring(startIndex, i);
				!this.suppressValidationErr && validateEntityName$1(notationName);
				i = skipWhitespace(xmlData, i);
				const identifierType = xmlData.substring(i, i + 6).toUpperCase();
				if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
						throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
				}
				i += identifierType.length;
				i = skipWhitespace(xmlData, i);
				let publicIdentifier = null;
				let systemIdentifier = null;
				if (identifierType === "PUBLIC") {
						[i, publicIdentifier] = this.readIdentifierVal(xmlData, i, "publicIdentifier");
						i = skipWhitespace(xmlData, i);
						if (xmlData[i] === '"' || xmlData[i] === "'") {
								[i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
						}
				} else if (identifierType === "SYSTEM") {
						[i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
						if (!this.suppressValidationErr && !systemIdentifier) {
								throw new Error("Missing mandatory system identifier for SYSTEM notation");
						}
				}
				return { notationName, publicIdentifier, systemIdentifier, index: --i };
		}
		readIdentifierVal(xmlData, i, type) {
				let identifierVal = "";
				const startChar = xmlData[i];
				if (startChar !== '"' && startChar !== "'") {
						throw new Error(`Expected quoted string, found "${startChar}"`);
				}
				i++;
				const startIndex = i;
				while (i < xmlData.length && xmlData[i] !== startChar) {
						i++;
				}
				identifierVal = xmlData.substring(startIndex, i);
				if (xmlData[i] !== startChar) {
						throw new Error(`Unterminated ${type} value`);
				}
				i++;
				return [i, identifierVal];
		}
		readElementExp(xmlData, i) {
				i = skipWhitespace(xmlData, i);
				const startIndex = i;
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						i++;
				}
				let elementName = xmlData.substring(startIndex, i);
				if (!this.suppressValidationErr && !isName(elementName)) {
						throw new Error(`Invalid element name: "${elementName}"`);
				}
				i = skipWhitespace(xmlData, i);
				let contentModel = "";
				if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) i += 4;
				else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) i += 2;
				else if (xmlData[i] === "(") {
						i++;
						const startIndex = i;
						while (i < xmlData.length && xmlData[i] !== ")") {
								i++;
						}
						contentModel = xmlData.substring(startIndex, i);
						if (xmlData[i] !== ")") {
								throw new Error("Unterminated content model");
						}
				} else if (!this.suppressValidationErr) {
						throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
				}
				return {
						elementName,
						contentModel: contentModel.trim(),
						index: i
				};
		}
		readAttlistExp(xmlData, i) {
				i = skipWhitespace(xmlData, i);
				let startIndex = i;
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						i++;
				}
				let elementName = xmlData.substring(startIndex, i);
				validateEntityName$1(elementName);
				i = skipWhitespace(xmlData, i);
				startIndex = i;
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						i++;
				}
				let attributeName = xmlData.substring(startIndex, i);
				if (!validateEntityName$1(attributeName)) {
						throw new Error(`Invalid attribute name: "${attributeName}"`);
				}
				i = skipWhitespace(xmlData, i);
				let attributeType = "";
				if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
						attributeType = "NOTATION";
						i += 8;
						i = skipWhitespace(xmlData, i);
						if (xmlData[i] !== "(") {
								throw new Error(`Expected '(', found "${xmlData[i]}"`);
						}
						i++;
						let allowedNotations = [];
						while (i < xmlData.length && xmlData[i] !== ")") {
								const startIndex = i;
								while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") {
										i++;
								}
								let notation = xmlData.substring(startIndex, i);
								notation = notation.trim();
								if (!validateEntityName$1(notation)) {
										throw new Error(`Invalid notation name: "${notation}"`);
								}
								allowedNotations.push(notation);
								if (xmlData[i] === "|") {
										i++;
										i = skipWhitespace(xmlData, i);
								}
						}
						if (xmlData[i] !== ")") {
								throw new Error("Unterminated list of notations");
						}
						i++;
						attributeType += " (" + allowedNotations.join("|") + ")";
				} else {
						const startIndex = i;
						while (i < xmlData.length && !/\s/.test(xmlData[i])) {
								i++;
						}
						attributeType += xmlData.substring(startIndex, i);
						const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
						if (!this.suppressValidationErr && !validTypes.includes(attributeType.toUpperCase())) {
								throw new Error(`Invalid attribute type: "${attributeType}"`);
						}
				}
				i = skipWhitespace(xmlData, i);
				let defaultValue = "";
				if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
						defaultValue = "#REQUIRED";
						i += 8;
				} else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
						defaultValue = "#IMPLIED";
						i += 7;
				} else {
						[i, defaultValue] = this.readIdentifierVal(xmlData, i, "ATTLIST");
				}
				return {
						elementName,
						attributeName,
						attributeType,
						defaultValue,
						index: i
				}
		}
}
const skipWhitespace = (data, index) => {
		while (index < data.length && /\s/.test(data[index])) {
				index++;
		}
		return index;
};
function hasSeq(data, seq, i) {
		for (let j = 0; j < seq.length; j++) {
				if (seq[j] !== data[i + j + 1]) return false;
		}
		return true;
}
function validateEntityName$1(name) {
		if (isName(name))
				return name;
		else
				throw new Error(`Invalid entity name ${name}`);
}

// strnum
const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
const binRegex = /^0b[01]+$/;
const octRegex = /^0o[0-7]+$/;
const numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
const consider = {
		hex: true,
		binary: false,
		octal: false,
		leadingZeros: true,
		decimalPoint: "\.",
		eNotation: true,
		infinity: "original",
};
function toNumber(str, options = {}) {
		options = Object.assign({}, consider, options);
		if (!str || typeof str !== "string") return str;
		let trimmedStr = str.trim();
		if (trimmedStr.length === 0) return str;
		else if (options.skipLike !== undefined && options.skipLike.test(trimmedStr)) return str;
		else if (trimmedStr === "0") return 0;
		else if (options.hex && hexRegex.test(trimmedStr)) {
				return parse_int(trimmedStr, 16);
		} else if (options.binary && binRegex.test(trimmedStr)) {
				return parse_int(trimmedStr, 2);
		} else if (options.octal && octRegex.test(trimmedStr)) {
				return parse_int(trimmedStr, 8);
		} else if (!isFinite(trimmedStr)) {
				return handleInfinity(str, Number(trimmedStr), options);
		} else if (trimmedStr.includes('e') || trimmedStr.includes('E')) {
				return resolveEnotation(str, trimmedStr, options);
		} else {
				const match = numRegex.exec(trimmedStr);
				if (match) {
						const sign = match[1] || "";
						const leadingZeros = match[2];
						let numTrimmedByZeros = trimZeros(match[3]);
						const decimalAdjacentToLeadingZeros = sign ?
								str[leadingZeros.length + 1] === "."
								: str[leadingZeros.length] === ".";
						if (!options.leadingZeros
								&& (leadingZeros.length > 1
										|| (leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros))) {
								return str;
						}
						else {
								const num = Number(trimmedStr);
								const parsedStr = String(num);
								if (num === 0) return num;
								if (parsedStr.search(/[eE]/) !== -1) {
										if (options.eNotation) return num;
										else return str;
								} else if (trimmedStr.indexOf(".") !== -1) {
										if (parsedStr === "0") return num;
										else if (parsedStr === numTrimmedByZeros) return num;
										else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
										else return str;
								}
								let n = leadingZeros ? numTrimmedByZeros : trimmedStr;
								if (leadingZeros) {
										return (n === parsedStr) || (sign + n === parsedStr) ? num : str
								} else {
										return (n === parsedStr) || (n === sign + parsedStr) ? num : str
								}
						}
				} else {
						return str;
				}
		}
}
const eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function resolveEnotation(str, trimmedStr, options) {
		if (!options.eNotation) return str;
		const notation = trimmedStr.match(eNotationRegx);
		if (notation) {
				let sign = notation[1] || "";
				const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
				const leadingZeros = notation[2];
				const eAdjacentToLeadingZeros = sign ?
						str[leadingZeros.length + 1] === eChar
						: str[leadingZeros.length] === eChar;
				if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
				else if (leadingZeros.length === 1
						&& (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) {
						return Number(trimmedStr);
				} else if (leadingZeros.length > 0) {
						if (options.leadingZeros && !eAdjacentToLeadingZeros) {
								trimmedStr = (notation[1] || "") + notation[3];
								return Number(trimmedStr);
						} else return str;
				} else {
						return Number(trimmedStr);
				}
		} else {
				return str;
		}
}
function trimZeros(numStr) {
		if (numStr && numStr.indexOf(".") !== -1) {
				numStr = numStr.replace(/0+$/, "");
				if (numStr === ".") numStr = "0";
				else if (numStr[0] === ".") numStr = "0" + numStr;
				else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
				return numStr;
		}
		return numStr;
}
function parse_int(numStr, base) {
		const str = numStr.trim();
		if (base === 2 || base === 8) numStr = str.substring(2);
		if (parseInt) return parseInt(numStr, base);
		else if (Number.parseInt) return Number.parseInt(numStr, base);
		else if (window && window.parseInt) return window.parseInt(numStr, base);
		else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
function handleInfinity(str, num, options) {
		const isPositive = num === Infinity;
		switch (options.infinity.toLowerCase()) {
				case "null":
						return null;
				case "infinity":
						return num;
				case "string":
						return isPositive ? "Infinity" : "-Infinity";
				case "original":
				default:
						return str;
		}
}

// fast-xml-parser
function getIgnoreAttributesFn(ignoreAttributes) {
		if (typeof ignoreAttributes === 'function') {
				return ignoreAttributes
		}
		if (Array.isArray(ignoreAttributes)) {
				return (attrName) => {
						for (const pattern of ignoreAttributes) {
								if (typeof pattern === 'string' && attrName === pattern) {
										return true
								}
								if (pattern instanceof RegExp && pattern.test(attrName)) {
										return true
								}
						}
				}
		}
		return () => false
}

// path-expression-matcher
class Expression {
	constructor(pattern, options = {}, data) {
		this.pattern = pattern;
		this.separator = options.separator || '.';
		this.segments = this._parse(pattern);
		this.data = data;
		this._hasDeepWildcard = this.segments.some(seg => seg.type === 'deep-wildcard');
		this._hasAttributeCondition = this.segments.some(seg => seg.attrName !== undefined);
		this._hasPositionSelector = this.segments.some(seg => seg.position !== undefined);
	}
	_parse(pattern) {
		const segments = [];
		let i = 0;
		let currentPart = '';
		while (i < pattern.length) {
			if (pattern[i] === this.separator) {
				if (i + 1 < pattern.length && pattern[i + 1] === this.separator) {
					if (currentPart.trim()) {
						segments.push(this._parseSegment(currentPart.trim()));
						currentPart = '';
					}
					segments.push({ type: 'deep-wildcard' });
					i += 2;
				} else {
					if (currentPart.trim()) {
						segments.push(this._parseSegment(currentPart.trim()));
					}
					currentPart = '';
					i++;
				}
			} else {
				currentPart += pattern[i];
				i++;
			}
		}
		if (currentPart.trim()) {
			segments.push(this._parseSegment(currentPart.trim()));
		}
		return segments;
	}
	_parseSegment(part) {
		const segment = { type: 'tag' };
		let bracketContent = null;
		let withoutBrackets = part;
		const bracketMatch = part.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
		if (bracketMatch) {
			withoutBrackets = bracketMatch[1] + bracketMatch[3];
			if (bracketMatch[2]) {
				const content = bracketMatch[2].slice(1, -1);
				if (content) {
					bracketContent = content;
				}
			}
		}
		let namespace = undefined;
		let tagAndPosition = withoutBrackets;
		if (withoutBrackets.includes('::')) {
			const nsIndex = withoutBrackets.indexOf('::');
			namespace = withoutBrackets.substring(0, nsIndex).trim();
			tagAndPosition = withoutBrackets.substring(nsIndex + 2).trim();
			if (!namespace) {
				throw new Error(`Invalid namespace in pattern: ${part}`);
			}
		}
		let tag = undefined;
		let positionMatch = null;
		if (tagAndPosition.includes(':')) {
			const colonIndex = tagAndPosition.lastIndexOf(':');
			const tagPart = tagAndPosition.substring(0, colonIndex).trim();
			const posPart = tagAndPosition.substring(colonIndex + 1).trim();
			const isPositionKeyword = ['first', 'last', 'odd', 'even'].includes(posPart) ||
				/^nth\(\d+\)$/.test(posPart);
			if (isPositionKeyword) {
				tag = tagPart;
				positionMatch = posPart;
			} else {
				tag = tagAndPosition;
			}
		} else {
			tag = tagAndPosition;
		}
		if (!tag) {
			throw new Error(`Invalid segment pattern: ${part}`);
		}
		segment.tag = tag;
		if (namespace) {
			segment.namespace = namespace;
		}
		if (bracketContent) {
			if (bracketContent.includes('=')) {
				const eqIndex = bracketContent.indexOf('=');
				segment.attrName = bracketContent.substring(0, eqIndex).trim();
				segment.attrValue = bracketContent.substring(eqIndex + 1).trim();
			} else {
				segment.attrName = bracketContent.trim();
			}
		}
		if (positionMatch) {
			const nthMatch = positionMatch.match(/^nth\((\d+)\)$/);
			if (nthMatch) {
				segment.position = 'nth';
				segment.positionValue = parseInt(nthMatch[1], 10);
			} else {
				segment.position = positionMatch;
			}
		}
		return segment;
	}
	get length() {
		return this.segments.length;
	}
	hasDeepWildcard() {
		return this._hasDeepWildcard;
	}
	hasAttributeCondition() {
		return this._hasAttributeCondition;
	}
	hasPositionSelector() {
		return this._hasPositionSelector;
	}
	toString() {
		return this.pattern;
	}
}

// path-expression-matcher
class ExpressionSet {
	constructor() {
		this._byDepthAndTag = new Map();
		this._wildcardByDepth = new Map();
		this._deepWildcards = [];
		this._patterns = new Set();
		this._sealed = false;
	}
	add(expression) {
		if (this._sealed) {
			throw new TypeError(
				'ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.'
			);
		}
		if (this._patterns.has(expression.pattern)) return this;
		this._patterns.add(expression.pattern);
		if (expression.hasDeepWildcard()) {
			this._deepWildcards.push(expression);
			return this;
		}
		const depth = expression.length;
		const lastSeg = expression.segments[expression.segments.length - 1];
		const tag = lastSeg?.tag;
		if (!tag || tag === '*') {
			if (!this._wildcardByDepth.has(depth)) this._wildcardByDepth.set(depth, []);
			this._wildcardByDepth.get(depth).push(expression);
		} else {
			const key = `${depth}:${tag}`;
			if (!this._byDepthAndTag.has(key)) this._byDepthAndTag.set(key, []);
			this._byDepthAndTag.get(key).push(expression);
		}
		return this;
	}
	addAll(expressions) {
		for (const expr of expressions) this.add(expr);
		return this;
	}
	has(expression) {
		return this._patterns.has(expression.pattern);
	}
	get size() {
		return this._patterns.size;
	}
	seal() {
		this._sealed = true;
		return this;
	}
	get isSealed() {
		return this._sealed;
	}
	matchesAny(matcher) {
		return this.findMatch(matcher) !== null;
	}
	findMatch(matcher) {
		const depth = matcher.getDepth();
		const tag = matcher.getCurrentTag();
		const exactKey = `${depth}:${tag}`;
		const exactBucket = this._byDepthAndTag.get(exactKey);
		if (exactBucket) {
			for (let i = 0; i < exactBucket.length; i++) {
				if (matcher.matches(exactBucket[i])) return exactBucket[i];
			}
		}
		const wildcardBucket = this._wildcardByDepth.get(depth);
		if (wildcardBucket) {
			for (let i = 0; i < wildcardBucket.length; i++) {
				if (matcher.matches(wildcardBucket[i])) return wildcardBucket[i];
			}
		}
		for (let i = 0; i < this._deepWildcards.length; i++) {
			if (matcher.matches(this._deepWildcards[i])) return this._deepWildcards[i];
		}
		return null;
	}
}

// path-expression-matcher
class MatcherView {
	constructor(matcher) {
		this._matcher = matcher;
	}
	get separator() {
		return this._matcher.separator;
	}
	getCurrentTag() {
		const path = this._matcher.path;
		return path.length > 0 ? path[path.length - 1].tag : undefined;
	}
	getCurrentNamespace() {
		const path = this._matcher.path;
		return path.length > 0 ? path[path.length - 1].namespace : undefined;
	}
	getAttrValue(attrName) {
		const path = this._matcher.path;
		if (path.length === 0) return undefined;
		return path[path.length - 1].values?.[attrName];
	}
	hasAttr(attrName) {
		const path = this._matcher.path;
		if (path.length === 0) return false;
		const current = path[path.length - 1];
		return current.values !== undefined && attrName in current.values;
	}
	getPosition() {
		const path = this._matcher.path;
		if (path.length === 0) return -1;
		return path[path.length - 1].position ?? 0;
	}
	getCounter() {
		const path = this._matcher.path;
		if (path.length === 0) return -1;
		return path[path.length - 1].counter ?? 0;
	}
	getIndex() {
		return this.getPosition();
	}
	getDepth() {
		return this._matcher.path.length;
	}
	toString(separator, includeNamespace = true) {
		return this._matcher.toString(separator, includeNamespace);
	}
	toArray() {
		return this._matcher.path.map(n => n.tag);
	}
	matches(expression) {
		return this._matcher.matches(expression);
	}
	matchesAny(exprSet) {
		return exprSet.matchesAny(this._matcher);
	}
}
class Matcher {
	constructor(options = {}) {
		this.separator = options.separator || '.';
		this.path = [];
		this.siblingStacks = [];
		this._pathStringCache = null;
		this._view = new MatcherView(this);
	}
	push(tagName, attrValues = null, namespace = null) {
		this._pathStringCache = null;
		if (this.path.length > 0) {
			this.path[this.path.length - 1].values = undefined;
		}
		const currentLevel = this.path.length;
		if (!this.siblingStacks[currentLevel]) {
			this.siblingStacks[currentLevel] = new Map();
		}
		const siblings = this.siblingStacks[currentLevel];
		const siblingKey = namespace ? `${namespace}:${tagName}` : tagName;
		const counter = siblings.get(siblingKey) || 0;
		let position = 0;
		for (const count of siblings.values()) {
			position += count;
		}
		siblings.set(siblingKey, counter + 1);
		const node = {
			tag: tagName,
			position: position,
			counter: counter
		};
		if (namespace !== null && namespace !== undefined) {
			node.namespace = namespace;
		}
		if (attrValues !== null && attrValues !== undefined) {
			node.values = attrValues;
		}
		this.path.push(node);
	}
	pop() {
		if (this.path.length === 0) return undefined;
		this._pathStringCache = null;
		const node = this.path.pop();
		if (this.siblingStacks.length > this.path.length + 1) {
			this.siblingStacks.length = this.path.length + 1;
		}
		return node;
	}
	updateCurrent(attrValues) {
		if (this.path.length > 0) {
			const current = this.path[this.path.length - 1];
			if (attrValues !== null && attrValues !== undefined) {
				current.values = attrValues;
			}
		}
	}
	getCurrentTag() {
		return this.path.length > 0 ? this.path[this.path.length - 1].tag : undefined;
	}
	getCurrentNamespace() {
		return this.path.length > 0 ? this.path[this.path.length - 1].namespace : undefined;
	}
	getAttrValue(attrName) {
		if (this.path.length === 0) return undefined;
		return this.path[this.path.length - 1].values?.[attrName];
	}
	hasAttr(attrName) {
		if (this.path.length === 0) return false;
		const current = this.path[this.path.length - 1];
		return current.values !== undefined && attrName in current.values;
	}
	getPosition() {
		if (this.path.length === 0) return -1;
		return this.path[this.path.length - 1].position ?? 0;
	}
	getCounter() {
		if (this.path.length === 0) return -1;
		return this.path[this.path.length - 1].counter ?? 0;
	}
	getIndex() {
		return this.getPosition();
	}
	getDepth() {
		return this.path.length;
	}
	toString(separator, includeNamespace = true) {
		const sep = separator || this.separator;
		const isDefault = (sep === this.separator && includeNamespace === true);
		if (isDefault) {
			if (this._pathStringCache !== null) {
				return this._pathStringCache;
			}
			const result = this.path.map(n =>
				(n.namespace) ? `${n.namespace}:${n.tag}` : n.tag
			).join(sep);
			this._pathStringCache = result;
			return result;
		}
		return this.path.map(n =>
			(includeNamespace && n.namespace) ? `${n.namespace}:${n.tag}` : n.tag
		).join(sep);
	}
	toArray() {
		return this.path.map(n => n.tag);
	}
	reset() {
		this._pathStringCache = null;
		this.path = [];
		this.siblingStacks = [];
	}
	matches(expression) {
		const segments = expression.segments;
		if (segments.length === 0) {
			return false;
		}
		if (expression.hasDeepWildcard()) {
			return this._matchWithDeepWildcard(segments);
		}
		return this._matchSimple(segments);
	}
	_matchSimple(segments) {
		if (this.path.length !== segments.length) {
			return false;
		}
		for (let i = 0; i < segments.length; i++) {
			if (!this._matchSegment(segments[i], this.path[i], i === this.path.length - 1)) {
				return false;
			}
		}
		return true;
	}
	_matchWithDeepWildcard(segments) {
		let pathIdx = this.path.length - 1;
		let segIdx = segments.length - 1;
		while (segIdx >= 0 && pathIdx >= 0) {
			const segment = segments[segIdx];
			if (segment.type === 'deep-wildcard') {
				segIdx--;
				if (segIdx < 0) {
					return true;
				}
				const nextSeg = segments[segIdx];
				let found = false;
				for (let i = pathIdx; i >= 0; i--) {
					if (this._matchSegment(nextSeg, this.path[i], i === this.path.length - 1)) {
						pathIdx = i - 1;
						segIdx--;
						found = true;
						break;
					}
				}
				if (!found) {
					return false;
				}
			} else {
				if (!this._matchSegment(segment, this.path[pathIdx], pathIdx === this.path.length - 1)) {
					return false;
				}
				pathIdx--;
				segIdx--;
			}
		}
		return segIdx < 0;
	}
	_matchSegment(segment, node, isCurrentNode) {
		if (segment.tag !== '*' && segment.tag !== node.tag) {
			return false;
		}
		if (segment.namespace !== undefined) {
			if (segment.namespace !== '*' && segment.namespace !== node.namespace) {
				return false;
			}
		}
		if (segment.attrName !== undefined) {
			if (!isCurrentNode) {
				return false;
			}
			if (!node.values || !(segment.attrName in node.values)) {
				return false;
			}
			if (segment.attrValue !== undefined) {
				if (String(node.values[segment.attrName]) !== String(segment.attrValue)) {
					return false;
				}
			}
		}
		if (segment.position !== undefined) {
			if (!isCurrentNode) {
				return false;
			}
			const counter = node.counter ?? 0;
			if (segment.position === 'first' && counter !== 0) {
				return false;
			} else if (segment.position === 'odd' && counter % 2 !== 1) {
				return false;
			} else if (segment.position === 'even' && counter % 2 !== 0) {
				return false;
			} else if (segment.position === 'nth' && counter !== segment.positionValue) {
				return false;
			}
		}
		return true;
	}
	matchesAny(exprSet) {
		return exprSet.matchesAny(this);
	}
	snapshot() {
		return {
			path: this.path.map(node => ({ ...node })),
			siblingStacks: this.siblingStacks.map(map => new Map(map))
		};
	}
	restore(snapshot) {
		this._pathStringCache = null;
		this.path = snapshot.path.map(node => ({ ...node }));
		this.siblingStacks = snapshot.siblingStacks.map(map => new Map(map));
	}
	readOnly() {
		return this._view;
	}
}

// @nodable
const DEFAULT_XML_ENTITIES = {
	apos: { regex: /&(apos|#0*39|#x0*27);/g, val: "'" },
	gt: { regex: /&(gt|#0*62|#x0*3[Ee]);/g, val: '>' },
	lt: { regex: /&(lt|#0*60|#x0*3[Cc]);/g, val: '<' },
	quot: { regex: /&(quot|#0*34|#x0*22);/g, val: '"' },
};
const AMP_ENTITY = { regex: /&(amp|#0*38|#x0*26);/g, val: '&' };
const SPECIAL_CHARS = new Set('!?\\\\/[]$%{}^&*()<>|+');
function validateEntityName(name) {
	for (const ch of name) {
		if (SPECIAL_CHARS.has(ch)) {
			throw new Error(`[EntityReplacer] Invalid character '${ch}' in entity name: "${name}"`);
		}
	}
	return name;
}
function escapeForRegex(str) {
	return str.replace(/[.\-+*:]/g, '\\$&');
}
function resolveTable(option, builtIn, enabledByDefault = false) {
	if (option === false || option === null) return null;
	if (option === true) return builtIn;
	if (option === undefined) return enabledByDefault ? builtIn : null;
	if (typeof option === 'object') return option;
	return null;
}
function resolveApplyLimitsTo(spec) {
	if (spec === 'all') return 'all';
	if (typeof spec === 'string') return new Set([spec]);
	if (Array.isArray(spec)) return new Set(spec);
	return new Set(['external']);
}
function buildEntries(map) {
	const entries = [];
	for (const key of Object.keys(map)) {
		const raw = map[key];
		if (typeof raw === 'object' && raw !== null && (raw.val !== undefined)) {
			entries.push([key, { regex: raw.regex ?? raw.regx, val: raw.val }]);
		} else if (typeof raw === 'string') {
			if (raw.indexOf('&') !== -1) continue;
			validateEntityName(key);
			entries.push([key, {
				regex: new RegExp('&' + escapeForRegex(key) + ';', 'g'),
				val: raw,
			}]);
		}
	}
	return entries;
}
class EntityReplacer {
	constructor(options = {}) {
		this._defaultTable = resolveTable(options.default, DEFAULT_XML_ENTITIES, true);
		this._systemTable = resolveTable(options.system, null, false);
		this._ampEnabled = options.amp !== false && options.amp !== null;
		this._maxTotalExpansions = options.maxTotalExpansions || 0;
		this._maxExpandedLength = options.maxExpandedLength || 0;
		this._applyLimitsTo = resolveApplyLimitsTo(options.applyLimitsTo ?? 'external');
		this._postCheck = typeof options.postCheck === 'function' ? options.postCheck : r => r;
		this._limitExternal = this._applyLimitsTo === 'all' || (this._applyLimitsTo instanceof Set && this._applyLimitsTo.has('external'));
		this._limitSystem = this._applyLimitsTo === 'all' || (this._applyLimitsTo instanceof Set && this._applyLimitsTo.has('system'));
		this._limitDefault = this._applyLimitsTo === 'all' || (this._applyLimitsTo instanceof Set && this._applyLimitsTo.has('default'));
		this._defaultEntries = this._defaultTable ? Object.entries(this._defaultTable) : [];
		this._systemEntries = this._systemTable ? Object.entries(this._systemTable) : [];
		this._persistentEntries = [];
		this._inputEntries = [];
		this._totalExpansions = 0;
		this._expandedLength = 0;
	}
	setExternalEntities(map) {
		this._persistentEntries = buildEntries(map);
	}
	addExternalEntity(key, value) {
		validateEntityName(key);
		if (typeof value === 'string' && value.indexOf('&') === -1) {
			this._persistentEntries.push([key, {
				regex: new RegExp('&' + escapeForRegex(key) + ';', 'g'),
				val: value,
			}]);
		}
	}
	addInputEntities(map) {
		this._totalExpansions = 0;
		this._expandedLength = 0;
		this._inputEntries = buildEntries(map);
	}
	reset() {
		this._inputEntries = [];
		this._totalExpansions = 0;
		this._expandedLength = 0;
	}
	replace(str) {
		if (typeof str !== 'string' || str.length === 0) return str;
		if (str.indexOf('&') === -1) return str;
		const original = str;
		if (this._persistentEntries.length > 0) {
			str = this._applyEntries(str, this._persistentEntries, this._limitExternal);
		}
		if (this._inputEntries.length > 0 && str.indexOf('&') !== -1) {
			str = this._applyEntries(str, this._inputEntries, this._limitExternal);
		}
		if (this._defaultEntries.length > 0 && str.indexOf('&') !== -1) {
			str = this._applyEntries(str, this._defaultEntries, this._limitDefault);
		}
		if (this._systemEntries.length > 0 && str.indexOf('&') !== -1) {
			str = this._applyEntries(str, this._systemEntries, this._limitSystem);
		}
		if (this._ampEnabled && str.indexOf('&') !== -1) {
			str = str.replace(AMP_ENTITY.regex, AMP_ENTITY.val);
		}
		str = this._postCheck(str, original);
		return str;
	}
	parse(val) {
		return this.replace(val);
	}
	_applyEntries(str, entries, track) {
		const limitExpansions = track && this._maxTotalExpansions > 0;
		const limitLength = track && this._maxExpandedLength > 0;
		const trackAny = limitExpansions || limitLength;
		for (let i = 0; i < entries.length; i++) {
			if (str.indexOf('&') === -1) break;
			const entity = entries[i][1];
			if (!trackAny) {
				str = str.replace(entity.regex, entity.val);
				continue;
			}
			if (limitExpansions && !limitLength) {
				let count = 0;
				str = str.replace(entity.regex, (...args) => {
					count++;
					return typeof entity.val === 'function' ? entity.val(...args) : entity.val;
				});
				if (count > 0) {
					this._totalExpansions += count;
					if (this._totalExpansions > this._maxTotalExpansions) {
						throw new Error(
							`[EntityReplacer] Entity expansion count limit exceeded: ` +
							`${this._totalExpansions} > ${this._maxTotalExpansions}`
						);
					}
				}
			} else if (limitLength && !limitExpansions) {
				const before = str.length;
				str = str.replace(entity.regex, entity.val);
				const delta = str.length - before;
				if (delta > 0) {
					this._expandedLength += delta;
					if (this._expandedLength > this._maxExpandedLength) {
						throw new Error(
							`[EntityReplacer] Expanded content length limit exceeded: ` +
							`${this._expandedLength} > ${this._maxExpandedLength}`
						);
					}
				}
			} else {
				const before = str.length;
				let count = 0;
				str = str.replace(entity.regex, (...args) => {
					count++;
					return typeof entity.val === 'function' ? entity.val(...args) : entity.val;
				});
				if (count > 0) {
					this._totalExpansions += count;
					if (this._totalExpansions > this._maxTotalExpansions) {
						throw new Error(
							`[EntityReplacer] Entity expansion count limit exceeded: ` +
							`${this._totalExpansions} > ${this._maxTotalExpansions}`
						);
					}
				}
				const delta = str.length - before;
				if (delta > 0) {
					this._expandedLength += delta;
					if (this._expandedLength > this._maxExpandedLength) {
						throw new Error(
							`[EntityReplacer] Expanded content length limit exceeded: ` +
							`${this._expandedLength} > ${this._maxExpandedLength}`
						);
					}
				}
			}
		}
		return str;
	}
}

// @nodable
const COMMON_HTML = {
	nbsp: { regex: /&(nbsp|#0*160|#x0*[Aa]0);/g, val: '\u00a0' },
	copy: { regex: /&(copy|#0*169|#x0*[Aa]9);/g, val: '\u00a9' },
	reg: { regex: /&(reg|#0*174|#x0*[Aa][Ee]);/g, val: '\u00ae' },
	trade: { regex: /&(trade|#0*8482|#x0*2122);/g, val: '\u2122' },
	mdash: { regex: /&(mdash|#0*8212|#x0*2014);/g, val: '\u2014' },
	ndash: { regex: /&(ndash|#0*8211|#x0*2013);/g, val: '\u2013' },
	hellip: { regex: /&(hellip|#0*8230|#x0*2026);/g, val: '\u2026' },
	laquo: { regex: /&(laquo|#0*171|#x0*[Aa][Bb]);/g, val: '\u00ab' },
	raquo: { regex: /&(raquo|#0*187|#x0*[Bb][Bb]);/g, val: '\u00bb' },
	lsquo: { regex: /&(lsquo|#0*8216|#x0*2018);/g, val: '\u2018' },
	rsquo: { regex: /&(rsquo|#0*8217|#x0*2019);/g, val: '\u2019' },
	ldquo: { regex: /&(ldquo|#0*8220|#x0*201[Cc]);/g, val: '\u201c' },
	rdquo: { regex: /&(rdquo|#0*8221|#x0*201[Dd]);/g, val: '\u201d' },
	bull: { regex: /&(bull|#0*8226|#x0*2022);/g, val: '\u2022' },
	para: { regex: /&(para|#0*182|#x0*[Bb]6);/g, val: '\u00b6' },
	sect: { regex: /&(sect|#0*167|#x0*[Aa]7);/g, val: '\u00a7' },
	deg: { regex: /&(deg|#0*176|#x0*[Bb]0);/g, val: '\u00b0' },
	frac12: { regex: /&(frac12|#0*189|#x0*[Bb][Dd]);/g, val: '\u00bd' },
	frac14: { regex: /&(frac14|#0*188|#x0*[Bb][Cc]);/g, val: '\u00bc' },
	frac34: { regex: /&(frac34|#0*190|#x0*[Bb][Ee]);/g, val: '\u00be' },
	inr: { regex: /&(inr|#0*8377);/g, val: "₹" },
};
const CURRENCY_ENTITIES = {
	cent: { regex: /&(cent|#0*162|#x0*[Aa]2);/g, val: '\u00a2' },
	pound: { regex: /&(pound|#0*163|#x0*[Aa]3);/g, val: '\u00a3' },
	yen: { regex: /&(yen|#0*165|#x0*[Aa]5);/g, val: '\u00a5' },
	euro: { regex: /&(euro|#0*8364|#x0*20[Aa][Cc]);/g, val: '\u20ac' },
	inr: { regex: /&(inr|#0*8377|#x0*20[Bb]9);/g, val: '\u20b9' },
	curren: { regex: /&(curren|#0*164|#x0*[Aa]4);/g, val: '\u00a4' },
	fnof: { regex: /&(fnof|#0*402|#x0*192);/g, val: '\u0192' },
};
const NUMERIC_ENTITIES = {
	num_dec: {
		regex: /&#0*([0-9]{1,7});/g,
		val: (_, s) => fromCodePoint(s, 10, "&#"),
	},
	num_hex: {
		regex: /&#x0*([0-9a-fA-F]{1,6});/g,
		val: (_, s) => fromCodePoint(s, 16, "&#x"),
	},
};
function fromCodePoint(str, base, prefix) {
	const codePoint = Number.parseInt(str, base);
	if (codePoint >= 0 && codePoint <= 0x10FFFF) {
		return String.fromCodePoint(codePoint);
	} else {
		return prefix + str + ";";
	}
}

// fast-xml-parser
function extractRawAttributes(prefixedAttrs, options) {
	if (!prefixedAttrs) return {};
	const attrs = options.attributesGroupName
		? prefixedAttrs[options.attributesGroupName]
		: prefixedAttrs;
	if (!attrs) return {};
	const rawAttrs = {};
	for (const key in attrs) {
		if (key.startsWith(options.attributeNamePrefix)) {
			const rawName = key.substring(options.attributeNamePrefix.length);
			rawAttrs[rawName] = attrs[key];
		} else {
			rawAttrs[key] = attrs[key];
		}
	}
	return rawAttrs;
}
function extractNamespace(rawTagName) {
	if (!rawTagName || typeof rawTagName !== 'string') return undefined;
	const colonIndex = rawTagName.indexOf(':');
	if (colonIndex !== -1 && colonIndex > 0) {
		const ns = rawTagName.substring(0, colonIndex);
		if (ns !== 'xmlns') {
			return ns;
		}
	}
	return undefined;
}
class OrderedObjParser {
	constructor(options) {
		this.options = options;
		this.currentNode = null;
		this.tagsNodeStack = [];
		this.parseXml = parseXml;
		this.parseTextData = parseTextData;
		this.resolveNameSpace = resolveNameSpace;
		this.buildAttributesMap = buildAttributesMap;
		this.isItStopNode = isItStopNode;
		this.replaceEntitiesValue = replaceEntitiesValue;
		this.readStopNodeData = readStopNodeData;
		this.saveTextToParentTag = saveTextToParentTag;
		this.addChild = addChild;
		this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
		this.entityExpansionCount = 0;
		this.currentExpandedLength = 0;
		this.entityReplacer = new EntityReplacer({
			default: true,
			system: this.options.htmlEntities ? { ...COMMON_HTML, ...NUMERIC_ENTITIES, ...CURRENCY_ENTITIES } : {},
			maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
			maxExpandedLength: this.options.processEntities.maxExpandedLength,
			applyLimitsTo: "all",
		});
		this.matcher = new Matcher();
		this.readonlyMatcher = this.matcher.readOnly();
		this.isCurrentNodeStopNode = false;
		this.stopNodeExpressionsSet = new ExpressionSet();
		const stopNodesOpts = this.options.stopNodes;
		if (stopNodesOpts && stopNodesOpts.length > 0) {
			for (let i = 0; i < stopNodesOpts.length; i++) {
				const stopNodeExp = stopNodesOpts[i];
				if (typeof stopNodeExp === 'string') {
					this.stopNodeExpressionsSet.add(new Expression(stopNodeExp));
				} else if (stopNodeExp instanceof Expression) {
					this.stopNodeExpressionsSet.add(stopNodeExp);
				}
			}
			this.stopNodeExpressionsSet.seal();
		}
	}
}
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
	const options = this.options;
	if (val !== undefined) {
		if (options.trimValues && !dontTrim) {
			val = val.trim();
		}
		if (val.length > 0) {
			if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
			const jPathOrMatcher = options.jPath ? jPath.toString() : jPath;
			const newval = options.tagValueProcessor(tagName, val, jPathOrMatcher, hasAttributes, isLeafNode);
			if (newval === null || newval === undefined) {
				return val;
			} else if (typeof newval !== typeof val || newval !== val) {
				return newval;
			} else if (options.trimValues) {
				return parseValue(val, options.parseTagValue, options.numberParseOptions);
			} else {
				const trimmedVal = val.trim();
				if (trimmedVal === val) {
					return parseValue(val, options.parseTagValue, options.numberParseOptions);
				} else {
					return val;
				}
			}
		}
	}
}
function resolveNameSpace(tagname) {
	if (this.options.removeNSPrefix) {
		const tags = tagname.split(':');
		const prefix = tagname.charAt(0) === '/' ? '/' : '';
		if (tags[0] === 'xmlns') {
			return '';
		}
		if (tags.length === 2) {
			tagname = prefix + tags[1];
		}
	}
	return tagname;
}
const attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])([\\s\\S]*?)\\3)?', 'gm');
function buildAttributesMap(attrStr, jPath, tagName) {
	const options = this.options;
	if (options.ignoreAttributes !== true && typeof attrStr === 'string') {
		const matches = getAllMatches(attrStr, attrsRegx);
		const len = matches.length;
		const attrs = {};
		const processedVals = new Array(len);
		let hasRawAttrs = false;
		const rawAttrsForMatcher = {};
		for (let i = 0; i < len; i++) {
			const attrName = this.resolveNameSpace(matches[i][1]);
			const oldVal = matches[i][4];
			if (attrName.length && oldVal !== undefined) {
				let val = oldVal;
				if (options.trimValues) val = val.trim();
				val = this.replaceEntitiesValue(val, tagName, this.readonlyMatcher);
				processedVals[i] = val;
				rawAttrsForMatcher[attrName] = val;
				hasRawAttrs = true;
			}
		}
		if (hasRawAttrs && typeof jPath === 'object' && jPath.updateCurrent) {
			jPath.updateCurrent(rawAttrsForMatcher);
		}
		const jPathStr = options.jPath ? jPath.toString() : this.readonlyMatcher;
		let hasAttrs = false;
		for (let i = 0; i < len; i++) {
			const attrName = this.resolveNameSpace(matches[i][1]);
			if (this.ignoreAttributesFn(attrName, jPathStr)) continue;
			let aName = options.attributeNamePrefix + attrName;
			if (attrName.length) {
				if (options.transformAttributeName) {
					aName = options.transformAttributeName(aName);
				}
				aName = sanitizeName(aName, options);
				if (matches[i][4] !== undefined) {
					const oldVal = processedVals[i];
					const newVal = options.attributeValueProcessor(attrName, oldVal, jPathStr);
					if (newVal === null || newVal === undefined) {
						attrs[aName] = oldVal;
					} else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
						attrs[aName] = newVal;
					} else {
						attrs[aName] = parseValue(oldVal, options.parseAttributeValue, options.numberParseOptions);
					}
					hasAttrs = true;
				} else if (options.allowBooleanAttributes) {
					attrs[aName] = true;
					hasAttrs = true;
				}
			}
		}
		if (!hasAttrs) return;
		if (options.attributesGroupName) {
			const attrCollection = {};
			attrCollection[options.attributesGroupName] = attrs;
			return attrCollection;
		}
		return attrs;
	}
}
const parseXml = function (xmlData) {
	xmlData = xmlData.replace(/\r\n?/g, "\n");
	const xmlObj = new XmlNode('!xml');
	let currentNode = xmlObj;
	let textData = "";
	this.matcher.reset();
	this.entityExpansionCount = 0;
	this.currentExpandedLength = 0;
	const options = this.options;
	const docTypeReader = new DocTypeReader(options.processEntities);
	const xmlLen = xmlData.length;
	for (let i = 0; i < xmlLen; i++) {
		const ch = xmlData[i];
		if (ch === '<') {
			const c1 = xmlData.charCodeAt(i + 1);
			if (c1 === 47) {
				const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
				let tagName = xmlData.substring(i + 2, closeIndex).trim();
				if (options.removeNSPrefix) {
					const colonIndex = tagName.indexOf(":");
					if (colonIndex !== -1) {
						tagName = tagName.substr(colonIndex + 1);
					}
				}
				tagName = transformTagName(options.transformTagName, tagName, "", options).tagName;
				if (currentNode) {
					textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
				}
				const lastTagName = this.matcher.getCurrentTag();
				if (tagName && options.unpairedTagsSet.has(tagName)) {
					throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
				}
				if (lastTagName && options.unpairedTagsSet.has(lastTagName)) {
					this.matcher.pop();
					this.tagsNodeStack.pop();
				}
				this.matcher.pop();
				this.isCurrentNodeStopNode = false;
				currentNode = this.tagsNodeStack.pop();
				textData = "";
				i = closeIndex;
			} else if (c1 === 63) {
				let tagData = readTagExp(xmlData, i, false, "?>");
				if (!tagData) throw new Error("Pi Tag is not closed.");
				textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
				if ((options.ignoreDeclaration && tagData.tagName === "?xml") || options.ignorePiTags) ; else {
					const childNode = new XmlNode(tagData.tagName);
					childNode.add(options.textNodeName, "");
					if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
						childNode[":@"] = this.buildAttributesMap(tagData.tagExp, this.matcher, tagData.tagName);
					}
					this.addChild(currentNode, childNode, this.readonlyMatcher, i);
				}
				i = tagData.closeIndex + 1;
			} else if (c1 === 33
				&& xmlData.charCodeAt(i + 2) === 45
				&& xmlData.charCodeAt(i + 3) === 45) {
				const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
				if (options.commentPropName) {
					const comment = xmlData.substring(i + 4, endIndex - 2);
					textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
					currentNode.add(options.commentPropName, [{ [options.textNodeName]: comment }]);
				}
				i = endIndex;
			} else if (c1 === 33
				&& xmlData.charCodeAt(i + 2) === 68) {
				const result = docTypeReader.readDocType(xmlData, i);
				this.entityReplacer.addInputEntities(result.entities);
				i = result.i;
			} else if (c1 === 33
				&& xmlData.charCodeAt(i + 2) === 91) {
				const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
				const tagExp = xmlData.substring(i + 9, closeIndex);
				textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
				let val = this.parseTextData(tagExp, currentNode.tagname, this.readonlyMatcher, true, false, true, true);
				if (val == undefined) val = "";
				if (options.cdataPropName) {
					currentNode.add(options.cdataPropName, [{ [options.textNodeName]: tagExp }]);
				} else {
					currentNode.add(options.textNodeName, val);
				}
				i = closeIndex + 2;
			} else {
				let result = readTagExp(xmlData, i, options.removeNSPrefix);
				if (!result) {
					const context = xmlData.substring(Math.max(0, i - 50), Math.min(xmlLen, i + 50));
					throw new Error(`readTagExp returned undefined at position ${i}. Context: "${context}"`);
				}
				let tagName = result.tagName;
				const rawTagName = result.rawTagName;
				let tagExp = result.tagExp;
				let attrExpPresent = result.attrExpPresent;
				let closeIndex = result.closeIndex;
				({ tagName, tagExp } = transformTagName(options.transformTagName, tagName, tagExp, options));
				if (options.strictReservedNames &&
					(tagName === options.commentPropName
						|| tagName === options.cdataPropName
						|| tagName === options.textNodeName
						|| tagName === options.attributesGroupName
					)) {
					throw new Error(`Invalid tag name: ${tagName}`);
				}
				if (currentNode && textData) {
					if (currentNode.tagname !== '!xml') {
						textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher, false);
					}
				}
				const lastTag = currentNode;
				if (lastTag && options.unpairedTagsSet.has(lastTag.tagname)) {
					currentNode = this.tagsNodeStack.pop();
					this.matcher.pop();
				}
				let isSelfClosing = false;
				if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
					isSelfClosing = true;
					if (tagName[tagName.length - 1] === "/") {
						tagName = tagName.substr(0, tagName.length - 1);
						tagExp = tagName;
					} else {
						tagExp = tagExp.substr(0, tagExp.length - 1);
					}
					attrExpPresent = (tagName !== tagExp);
				}
				let prefixedAttrs = null;
				let namespace = undefined;
				namespace = extractNamespace(rawTagName);
				if (tagName !== xmlObj.tagname) {
					this.matcher.push(tagName, {}, namespace);
				}
				if (tagName !== tagExp && attrExpPresent) {
					prefixedAttrs = this.buildAttributesMap(tagExp, this.matcher, tagName);
					if (prefixedAttrs) {
						extractRawAttributes(prefixedAttrs, options);
					}
				}
				if (tagName !== xmlObj.tagname) {
					this.isCurrentNodeStopNode = this.isItStopNode();
				}
				const startIndex = i;
				if (this.isCurrentNodeStopNode) {
					let tagContent = "";
					if (isSelfClosing) {
						i = result.closeIndex;
					}
					else if (options.unpairedTagsSet.has(tagName)) {
						i = result.closeIndex;
					}
					else {
						const result = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
						if (!result) throw new Error(`Unexpected end of ${rawTagName}`);
						i = result.i;
						tagContent = result.tagContent;
					}
					const childNode = new XmlNode(tagName);
					if (prefixedAttrs) {
						childNode[":@"] = prefixedAttrs;
					}
					childNode.add(options.textNodeName, tagContent);
					this.matcher.pop();
					this.isCurrentNodeStopNode = false;
					this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
				} else {
					if (isSelfClosing) {
						({ tagName, tagExp } = transformTagName(options.transformTagName, tagName, tagExp, options));
						const childNode = new XmlNode(tagName);
						if (prefixedAttrs) {
							childNode[":@"] = prefixedAttrs;
						}
						this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
						this.matcher.pop();
						this.isCurrentNodeStopNode = false;
					}
					else if (options.unpairedTagsSet.has(tagName)) {
						const childNode = new XmlNode(tagName);
						if (prefixedAttrs) {
							childNode[":@"] = prefixedAttrs;
						}
						this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
						this.matcher.pop();
						this.isCurrentNodeStopNode = false;
						i = result.closeIndex;
						continue;
					}
					else {
						const childNode = new XmlNode(tagName);
						if (this.tagsNodeStack.length > options.maxNestedTags) {
							throw new Error("Maximum nested tags exceeded");
						}
						this.tagsNodeStack.push(currentNode);
						if (prefixedAttrs) {
							childNode[":@"] = prefixedAttrs;
						}
						this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
						currentNode = childNode;
					}
					textData = "";
					i = closeIndex;
				}
			}
		} else {
			textData += xmlData[i];
		}
	}
	return xmlObj.child;
};
function addChild(currentNode, childNode, matcher, startIndex) {
	if (!this.options.captureMetaData) startIndex = undefined;
	const jPathOrMatcher = this.options.jPath ? matcher.toString() : matcher;
	const result = this.options.updateTag(childNode.tagname, jPathOrMatcher, childNode[":@"]);
	if (result === false) ; else if (typeof result === "string") {
		childNode.tagname = result;
		currentNode.addChild(childNode, startIndex);
	} else {
		currentNode.addChild(childNode, startIndex);
	}
}
function replaceEntitiesValue(val, tagName, jPath) {
	const entityConfig = this.options.processEntities;
	if (!entityConfig || !entityConfig.enabled) {
		return val;
	}
	if (entityConfig.allowedTags) {
		const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
		const allowed = Array.isArray(entityConfig.allowedTags)
			? entityConfig.allowedTags.includes(tagName)
			: entityConfig.allowedTags(tagName, jPathOrMatcher);
		if (!allowed) {
			return val;
		}
	}
	if (entityConfig.tagFilter) {
		const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
		if (!entityConfig.tagFilter(tagName, jPathOrMatcher)) {
			return val;
		}
	}
	return this.entityReplacer.replace(val);
}
function saveTextToParentTag(textData, parentNode, matcher, isLeafNode) {
	if (textData) {
		if (isLeafNode === undefined) isLeafNode = parentNode.child.length === 0;
		textData = this.parseTextData(textData,
			parentNode.tagname,
			matcher,
			false,
			parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false,
			isLeafNode);
		if (textData !== undefined && textData !== "")
			parentNode.add(this.options.textNodeName, textData);
		textData = "";
	}
	return textData;
}
function isItStopNode() {
	if (this.stopNodeExpressionsSet.size === 0) return false;
	return this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
	let attrBoundary = 0;
	const chars = [];
	const len = xmlData.length;
	const closeCode0 = closingChar.charCodeAt(0);
	const closeCode1 = closingChar.length > 1 ? closingChar.charCodeAt(1) : -1;
	for (let index = i; index < len; index++) {
		const code = xmlData.charCodeAt(index);
		if (attrBoundary) {
			if (code === attrBoundary) attrBoundary = 0;
		} else if (code === 34 || code === 39) {
			attrBoundary = code;
		} else if (code === closeCode0) {
			if (closeCode1 !== -1) {
				if (xmlData.charCodeAt(index + 1) === closeCode1) {
					return { data: String.fromCharCode(...chars), index };
				}
			} else {
				return { data: String.fromCharCode(...chars), index };
			}
		} else if (code === 9) {
			chars.push(32);
			continue;
		}
		chars.push(code);
	}
}
function findClosingIndex(xmlData, str, i, errMsg) {
	const closingIndex = xmlData.indexOf(str, i);
	if (closingIndex === -1) {
		throw new Error(errMsg)
	} else {
		return closingIndex + str.length - 1;
	}
}
function findClosingChar(xmlData, char, i, errMsg) {
	const closingIndex = xmlData.indexOf(char, i);
	if (closingIndex === -1) throw new Error(errMsg);
	return closingIndex;
}
function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
	const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
	if (!result) return;
	let tagExp = result.data;
	const closeIndex = result.index;
	const separatorIndex = tagExp.search(/\s/);
	let tagName = tagExp;
	let attrExpPresent = true;
	if (separatorIndex !== -1) {
		tagName = tagExp.substring(0, separatorIndex);
		tagExp = tagExp.substring(separatorIndex + 1).trimStart();
	}
	const rawTagName = tagName;
	if (removeNSPrefix) {
		const colonIndex = tagName.indexOf(":");
		if (colonIndex !== -1) {
			tagName = tagName.substr(colonIndex + 1);
			attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
		}
	}
	return {
		tagName: tagName,
		tagExp: tagExp,
		closeIndex: closeIndex,
		attrExpPresent: attrExpPresent,
		rawTagName: rawTagName,
	}
}
function readStopNodeData(xmlData, tagName, i) {
	const startIndex = i;
	let openTagCount = 1;
	const xmllen = xmlData.length;
	for (; i < xmllen; i++) {
		if (xmlData[i] === "<") {
			const c1 = xmlData.charCodeAt(i + 1);
			if (c1 === 47) {
				const closeIndex = findClosingChar(xmlData, ">", i, `${tagName} is not closed`);
				let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
				if (closeTagName === tagName) {
					openTagCount--;
					if (openTagCount === 0) {
						return {
							tagContent: xmlData.substring(startIndex, i),
							i: closeIndex
						}
					}
				}
				i = closeIndex;
			} else if (c1 === 63) {
				const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
				i = closeIndex;
			} else if (c1 === 33
				&& xmlData.charCodeAt(i + 2) === 45
				&& xmlData.charCodeAt(i + 3) === 45) {
				const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
				i = closeIndex;
			} else if (c1 === 33
				&& xmlData.charCodeAt(i + 2) === 91) {
				const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
				i = closeIndex;
			} else {
				const tagData = readTagExp(xmlData, i, '>');
				if (tagData) {
					const openTagName = tagData && tagData.tagName;
					if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
						openTagCount++;
					}
					i = tagData.closeIndex;
				}
			}
		}
	}
}
function parseValue(val, shouldParse, options) {
	if (shouldParse && typeof val === 'string') {
		const newval = val.trim();
		if (newval === 'true') return true;
		else if (newval === 'false') return false;
		else return toNumber(val, options);
	} else {
		if (isExist(val)) {
			return val;
		} else {
			return '';
		}
	}
}
function transformTagName(fn, tagName, tagExp, options) {
	if (fn) {
		const newTagName = fn(tagName);
		if (tagExp === tagName) {
			tagExp = newTagName;
		}
		tagName = newTagName;
	}
	tagName = sanitizeName(tagName, options);
	return { tagName, tagExp };
}
function sanitizeName(name, options) {
	if (criticalProperties.includes(name)) {
		throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
	} else if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
		return options.onDangerousProperty(name);
	}
	return name;
}

// fast-xml-parser
const METADATA_SYMBOL = XmlNode.getMetaDataSymbol();
function stripAttributePrefix(attrs, prefix) {
	if (!attrs || typeof attrs !== 'object') return {};
	if (!prefix) return attrs;
	const rawAttrs = {};
	for (const key in attrs) {
		if (key.startsWith(prefix)) {
			const rawName = key.substring(prefix.length);
			rawAttrs[rawName] = attrs[key];
		} else {
			rawAttrs[key] = attrs[key];
		}
	}
	return rawAttrs;
}
function prettify(node, options, matcher, readonlyMatcher) {
	return compress(node, options, matcher, readonlyMatcher);
}
function compress(arr, options, matcher, readonlyMatcher) {
	let text;
	const compressedObj = {};
	for (let i = 0; i < arr.length; i++) {
		const tagObj = arr[i];
		const property = propName(tagObj);
		if (property !== undefined && property !== options.textNodeName) {
			const rawAttrs = stripAttributePrefix(
				tagObj[":@"] || {},
				options.attributeNamePrefix
			);
			matcher.push(property, rawAttrs);
		}
		if (property === options.textNodeName) {
			if (text === undefined) text = tagObj[property];
			else text += "" + tagObj[property];
		} else if (property === undefined) {
			continue;
		} else if (tagObj[property]) {
			let val = compress(tagObj[property], options, matcher, readonlyMatcher);
			const isLeaf = isLeafTag(val, options);
			if (tagObj[":@"]) {
				assignAttributes(val, tagObj[":@"], readonlyMatcher, options);
			} else if (Object.keys(val).length === 1 && val[options.textNodeName] !== undefined && !options.alwaysCreateTextNode) {
				val = val[options.textNodeName];
			} else if (Object.keys(val).length === 0) {
				if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
				else val = "";
			}
			if (tagObj[METADATA_SYMBOL] !== undefined && typeof val === "object" && val !== null) {
				val[METADATA_SYMBOL] = tagObj[METADATA_SYMBOL];
			}
			if (compressedObj[property] !== undefined && Object.prototype.hasOwnProperty.call(compressedObj, property)) {
				if (!Array.isArray(compressedObj[property])) {
					compressedObj[property] = [compressedObj[property]];
				}
				compressedObj[property].push(val);
			} else {
				const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() : readonlyMatcher;
				if (options.isArray(property, jPathOrMatcher, isLeaf)) {
					compressedObj[property] = [val];
				} else {
					compressedObj[property] = val;
				}
			}
			if (property !== undefined && property !== options.textNodeName) {
				matcher.pop();
			}
		}
	}
	if (typeof text === "string") {
		if (text.length > 0) compressedObj[options.textNodeName] = text;
	} else if (text !== undefined) compressedObj[options.textNodeName] = text;
	return compressedObj;
}
function propName(obj) {
	const keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (key !== ":@") return key;
	}
}
function assignAttributes(obj, attrMap, readonlyMatcher, options) {
	if (attrMap) {
		const keys = Object.keys(attrMap);
		const len = keys.length;
		for (let i = 0; i < len; i++) {
			const atrrName = keys[i];
			const rawAttrName = atrrName.startsWith(options.attributeNamePrefix)
				? atrrName.substring(options.attributeNamePrefix.length)
				: atrrName;
			const jPathOrMatcher = options.jPath
				? readonlyMatcher.toString() + "." + rawAttrName
				: readonlyMatcher;
			if (options.isArray(atrrName, jPathOrMatcher, true, true)) {
				obj[atrrName] = [attrMap[atrrName]];
			} else {
				obj[atrrName] = attrMap[atrrName];
			}
		}
	}
}
function isLeafTag(obj, options) {
	const { textNodeName } = options;
	const propCount = Object.keys(obj).length;
	if (propCount === 0) {
		return true;
	}
	if (
		propCount === 1 &&
		(obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)
	) {
		return true;
	}
	return false;
}

// fast-xml-parser
class XMLParser {
		constructor(options) {
				this.externalEntities = {};
				this.options = buildOptions(options);
		}
		parse(xmlData, validationOption) {
				if (typeof xmlData !== "string" && xmlData.toString) {
						xmlData = xmlData.toString();
				} else if (typeof xmlData !== "string") {
						throw new Error("XML data is accepted in String or Bytes[] form.")
				}
				if (validationOption) {
						if (validationOption === true) validationOption = {};
						const result = validate(xmlData, validationOption);
						if (result !== true) {
								throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`)
						}
				}
				const orderedObjParser = new OrderedObjParser(this.options);
				orderedObjParser.entityReplacer.setExternalEntities(this.externalEntities);
				const orderedResult = orderedObjParser.parseXml(xmlData);
				if (this.options.preserveOrder || orderedResult === undefined) return orderedResult;
				else return prettify(orderedResult, this.options, orderedObjParser.matcher, orderedObjParser.readonlyMatcher);
		}
		addEntity(key, value) {
				if (value.indexOf("&") !== -1) {
						throw new Error("Entity value can't have '&'")
				} else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
						throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'")
				} else if (value === "&") {
						throw new Error("An entity with value '&' is not permitted");
				} else {
						this.externalEntities[key] = value;
				}
		}
		static getMetaDataSymbol() {
				return XmlNode.getMetaDataSymbol();
		}
}

// activity_feed/common/methods/getIntlString.js
function getIntlString(hash, parameter) {
	if (parameter) return Common.intl.intl.formatToPlainString(Common.intl.t[`${hash}`], parameter);
	return Common.intl.intl.formatToPlainString(Common.intl.t[`${hash}`]);
}

// activity_feed/common/methods/getCustomString.js
const i18n = {
	"en-US": {
		TEST: "hi! this is a test string for the i18n system! i am so tired!",
		ACTIVITY_FEED: "Activity Feed",
		ACTIVITY_FEED_ACTION_RESTART_REQUIRED: "This action will require you to restart Discord in order to see changes.",
		ACTIVITY_FEED_COACHMARK_CONTENT_BODY: "You can customize which games appear on the Activity Feed and other fun toggles in settings. Look for the tab!",
		ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_TITLE: "You're not following any games",
		ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_SUBTITLE: "Discord will automatically follow games that you play, but you can unfollow anytime.",
		ACTIVITY_FEED_HEADER_DESCRIPTION_EXTERNAL_SOURCES: "News from external sources outside of your game library.",
		ACTIVITY_FEED_HEADER_DESCRIPTION_GAMES_YOU_FOLLOW: "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.",
		ACTIVITY_FEED_HEADER_DESCRIPTION_VISUAL_REFRESH: "Modern styling toggles for each part of the Activity Feed.",
		ACTIVITY_FEED_SETTINGS_ADVANCED_DESCRIPTION: "Developer options only! Don't touch these unless you want to break the activity feed in some way.",
		ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_CLOSED: "View Advanced & Debug Settings for Activity Feed",
		ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_OPEN: "Hide Advanced & Debug Settings for Activity Feed",
		ACTIVITY_FEED_SETTINGS_EXTERNAL_DISCORD_BLOG_DESCRIPTION: "News from Discord's blog.",
		ACTIVITY_FEED_SETTINGS_EXTERNAL_NINTENDO_BLOG_DESCRIPTION: "Nintendo news sourced from nintendoeverything.com.",
		ACTIVITY_FEED_SETTINGS_EXTERNAL_XBOX_BLOG_DESCRIPTION: "News from Xbox's blog.",
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_DESCRIPTION: "Enables the colorful visual refresh-inspired activity card designs. Recommended.",
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_DESCRIPTION: "Enables basic modern styling for the Activity Feed. Below options are highly recommended.",
		ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_DESCRIPTION: "Enables modern styling for news articles. Recommended.",
		ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_DESCRIPTION: "Enables modern styling for the quick launcher. Recommended.",
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_TITLE: "Refreshed Activity Cards",
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_TITLE: "Refreshed Activity Feed",
		ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_TITLE: "Refreshed Application News",
		ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_TITLE: "Refreshed Quick Launcher",
		ACTIVITY_FEED_SUBSCRIBE_TO_EXTERNAL: "Do you want to follow this source? Its announcements will appear in your Activity Feed.",
		ACTIVITY_FEED_SUBSCRIBE_TO_GAME: "Do you want to follow this game? Its announcements will appear in your Activity Feed.",
		ACTIVITY_FEED_UNAVAILABLE: "Activity Feed Unavailable",
		ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_GENERIC: "You've reached an ultra rare error! Reload Discord to try again.",
		ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_NO_DATA: "You may not have enough game history to create an Activity Feed. Reload Discord to try again.",
		ACTIVITY_FEED_UNSUBSCRIBE_FROM_EXTERNAL: "Do you want to unfollow this source? Its announcements will be hidden from your Activity Feed.",
		ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME: "Do you want to unfollow this game? Its announcements will be removed from your Activity Feed.",
		COPY_ARTICLE_LINK: "Copy Article Link",
		EXTERNAL_NEWS: "External News",
		GAMES_YOU_FOLLOW: "Games You Follow",
		MORE_RECENT_PLAYERS_SECTION_TITLE: ({ playerCount }) => `+${playerCount} more recent players`,
		NEWS: "News",
		NOW_PLAYING_EMPTY_TITLE: "Nobody is playing anything right now...",
		NOW_PLAYING_EMPTY_SUBTITLE: "When someone starts playing a game we'll show it here!",
		QUICK_LAUNCHER: "Quick Launcher",
		QUICK_LAUNCHER_EMPTY: "Discord can quickly launch most games you\u2019ve recently played on this computer. Go ahead and launch one to see it appear here!",
		RECENT_NEWS: "Recent News",
		SEARCH_FOR_GAMES: "Search for Games",
		SHOW_ON_ACTIVITY_FEED: "Show on Activity Feed",
		VISUAL_REFRESH: "Visual Refresh"
	},
	"en-GB": {},
	"zh-CN": {},
	"zh-TW": {},
	"cs": {},
	"da": {},
	"nl": {},
	"fr": {},
	"de": {},
	"el": {},
	"hu": {},
	"it": {},
	"ja": {},
	"ko": {},
	"pl": {},
	"pt-PT": {},
	"pt-BR": {},
	"ru": {},
	"sk": {},
	"es-419": {},
	"es-ES": {},
	"sv-SE": {},
	"tr": {},
	"bg": {},
	"uk": {},
	"fi": {},
	"no": {},
	"hr": {},
	"ro": {},
	"lt": {},
	"th": {},
	"vi": {},
	"hi": {},
	"he": {},
	"ar": {},
	"id": {}
};
function getCustomString(str, parameter) {
	const locale = Common.intl.intl.currentLocale;
	const defaultLocale = "en-US";
	if (!i18n[locale]?.[str] && !i18n[defaultLocale]?.[str]) console.warn(`Requested message ${str} does not have a value in the requested locale ${locale} nor the default locale ${defaultLocale}`);
	if (parameter && i18n[defaultLocale]?.[str] instanceof Function) {
		return i18n[locale]?.[str]?.(parameter) ?? i18n[defaultLocale]?.[str]?.(parameter) ?? "";
	}
	return i18n[locale]?.[str] ?? i18n[defaultLocale]?.[str] ?? "";
}

// activity_feed/common/methods/locale.js
const locale = {
	Strings: {
		TEST: () => getCustomString("TEST"),
		ACTIVITY: () => getIntlString("IC5Ann"),
		ACTIVITY_FEED: () => getCustomString("ACTIVITY_FEED"),
		ACTIVITY_FEED_ACTION_RESTART_REQUIRED: () => getCustomString("ACTIVITY_FEED_ACTION_RESTART_REQUIRED"),
		ACTIVITY_FEED_COACHMARK_CONTENT_BODY: () => getCustomString("ACTIVITY_FEED_COACHMARK_CONTENT_BODY"),
		ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_TITLE: () => getCustomString("ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_TITLE"),
		ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_SUBTITLE: () => getCustomString("ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_SUBTITLE"),
		ACTIVITY_FEED_HEADER_DESCRIPTION_EXTERNAL_SOURCES: () => getCustomString("ACTIVITY_FEED_HEADER_DESCRIPTION_EXTERNAL_SOURCES"),
		ACTIVITY_FEED_HEADER_DESCRIPTION_GAMES_YOU_FOLLOW: () => getCustomString("ACTIVITY_FEED_HEADER_DESCRIPTION_GAMES_YOU_FOLLOW"),
		ACTIVITY_FEED_HEADER_DESCRIPTION_VISUAL_REFRESH: () => getCustomString("ACTIVITY_FEED_HEADER_DESCRIPTION_VISUAL_REFRESH"),
		ACTIVITY_FEED_SETTINGS_ADVANCED_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_ADVANCED_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_CLOSED: () => getCustomString("ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_CLOSED"),
		ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_OPEN: () => getCustomString("ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_OPEN"),
		ACTIVITY_FEED_SETTINGS_EXTERNAL_DISCORD_BLOG_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_EXTERNAL_DISCORD_BLOG_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_EXTERNAL_NINTENDO_BLOG_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_EXTERNAL_NINTENDO_BLOG_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_EXTERNAL_XBOX_BLOG_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_EXTERNAL_XBOX_BLOG_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_DESCRIPTION: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_DESCRIPTION"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_TITLE: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_TITLE"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_TITLE: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_TITLE"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_TITLE: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_TITLE"),
		ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_TITLE: () => getCustomString("ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_TITLE"),
		ACTIVITY_FEED_SUBSCRIBE_TO_EXTERNAL: () => getCustomString("ACTIVITY_FEED_SUBSCRIBE_TO_EXTERNAL"),
		ACTIVITY_FEED_SUBSCRIBE_TO_GAME: () => getCustomString("ACTIVITY_FEED_SUBSCRIBE_TO_GAME"),
		ACTIVITY_FEED_UNAVAILABLE: () => getCustomString("ACTIVITY_FEED_UNAVAILABLE"),
		ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_GENERIC: () => getCustomString("ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_GENERIC"),
		ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_NO_DATA: () => getCustomString("ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_NO_DATA"),
		ACTIVITY_FEED_UNSUBSCRIBE_FROM_EXTERNAL: () => getCustomString("ACTIVITY_FEED_UNSUBSCRIBE_FROM_EXTERNAL"),
		ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME: () => getCustomString("ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME"),
		ADVANCED: () => getIntlString("x3t315"),
		ARE_YOU_SURE: () => getIntlString("8ZRTsv"),
		CANCEL: () => getIntlString("TQBY1J"),
		CLOSE: () => getIntlString("cpT0Cq"),
		COPY_APPLICATION_ID: () => getIntlString("FfCL+6"),
		COPY_ARTICLE_LINK: () => getCustomString("COPY_ARTICLE_LINK"),
		EXTERNAL_NEWS: () => getCustomString("EXTERNAL_NEWS"),
		FOLLOW: () => getIntlString("3aOv+h"),
		FOLLOWING: () => getIntlString("w1IVQk"),
		GAME_ICON_FOR: (game) => getIntlString("nh+jWk", game),
		GAMES_YOU_FOLLOW: () => getCustomString("GAMES_YOU_FOLLOW"),
		JUST_STARTED_PLAYING: () => getIntlString("ahzZr+"),
		JUST_STOPPED_PLAYING: () => getIntlString("EluAd9"),
		LISTEN_ALONG: () => getIntlString("eU3inB"),
		MESSAGE: () => getIntlString("zROXEV"),
		MORE_RECENT_PLAYERS_SECTION_TITLE: (playerCount) => getCustomString("MORE_RECENT_PLAYERS_SECTION_TITLE", playerCount),
		NEWS: () => getCustomString("NEWS"),
		NO_RESULTS_FOUND: () => getIntlString("ojoWgX"),
		NOW_PLAYING: () => getIntlString("3elwAB"),
		NOW_PLAYING_EMPTY_TITLE: () => getCustomString("NOW_PLAYING_EMPTY_TITLE"),
		NOW_PLAYING_EMPTY_SUBTITLE: () => getCustomString("NOW_PLAYING_EMPTY_SUBTITLE"),
		OPEN_GAME_PROFILE: () => getIntlString("f7aVGn"),
		PARTY_SIZE: ({ partySize, maxPartySize }) => getIntlString("gLu7NU", { partySize, maxPartySize }),
		PLAY: () => getIntlString("RscU7I"),
		PLAY_GAME: () => getIntlString("XKUw8m"),
		PLAY_ON_SPOTIFY: () => getIntlString("rRffNz"),
		PLAYED_DAYS_AGO: (time) => getIntlString("yP1T84", time),
		PLAYED_HOURS_AGO: (time) => getIntlString("cRMUpw", time),
		PLAYED_MINUTES_AGO: (time) => getIntlString("BZxG8Z", time),
		PLAYING_FOR_DAY: (time) => getIntlString("2rUo/p", time),
		PLAYING_FOR_HOUR: (time) => getIntlString("eNoooU", time),
		PLAYING_FOR_MINUTE: (time) => getIntlString("03mIHW", time),
		PLAYING_GAME: (gameName) => getIntlString("IGYgjl", gameName),
		QUICK_LAUNCHER: () => getCustomString("QUICK_LAUNCHER"),
		QUICK_LAUNCHER_EMPTY: () => getCustomString("QUICK_LAUNCHER_EMPTY"),
		RECENT_NEWS: () => getCustomString("RECENT_NEWS"),
		SEARCH_FOR_GAMES: () => getCustomString("SEARCH_FOR_GAMES"),
		SHOW_ON_ACTIVITY_FEED: () => getCustomString("SHOW_ON_ACTIVITY_FEED"),
		STREAM_JUST_STARTED_PROMPT: () => getIntlString("uQZTBV"),
		STREAMING: () => getIntlString("KDdjou"),
		STREAMING_CONTENT: (name) => getIntlString("0wJXSh"),
		TAKE_ME_THERE: () => getIntlString("w7s5Qr"),
		UNFOLLOW: () => getIntlString("CMy0Cj"),
		UNKNOWN_GAME: () => getIntlString("GIWFlF"),
		USER_AND_USER_AND_OTHERS: ({ user1, user2, extras }) => getIntlString("5CSEcJ", { user1, user2, extras }),
		USER_AND_USER: ({ user1, user2 }) => getIntlString("4SM/RX", { user1, user2 }),
		VISUAL_REFRESH: () => getCustomString("VISUAL_REFRESH"),
		WATCH: () => getIntlString("I6JG46"),
		WATCH_STREAM: () => getIntlString("7Xq/nV"),
		WHATS_NEW: () => getIntlString("mfcR/v"),
		YES: () => getIntlString("p89ACt")
	}
};

// activity_feed/common/methods/common.js
function chunkArray(cards, num) {
	let chunkLength = Math.max(cards.length / num, 1);
	const chunks = [];
	for (let i = 0; i < num; i++) {
		if (chunkLength * (i + 1) <= cards.length) chunks.push(cards.slice(Math.ceil(chunkLength * i), Math.ceil(chunkLength * (i + 1))));
	}
	return chunks;
}
function getVoiceParticipants({ voice }) {
	let participants = [];
	const channelParticipants = Object.keys(VoiceStateStore.getVoiceStatesForChannel(voice));
	for (let i = 0; i < channelParticipants.length; i++) {
		participants.push(UserStore.getUser(channelParticipants[i]));
	}
	return participants;
}
function TimeClock({ timestamp }) {
	const time = Math.floor((Date.now() - new Date(parseInt(timestamp))) / 1e3);
	switch (true) {
		case !!(time / 86400 > 1):
			return locale.Strings.PLAYING_FOR_DAY({ time: Math.floor(time / 86400) });
		case !!(time / 3600 > 1):
			return locale.Strings.PLAYING_FOR_HOUR({ time: Math.floor(time / 3600) });
		case !!(time / 60 > 1):
			return locale.Strings.PLAYING_FOR_MINUTE({ time: Math.floor(time / 60) });
		case !!(time % 60 < 60):
			return locale.Strings.JUST_STARTED_PLAYING();
	}
}
function InactiveTimeClock({ timestamp }) {
	const time = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1e3);
	switch (true) {
		case !!(time / 86400 > 1):
			return locale.Strings.PLAYED_DAYS_AGO({ time: Math.floor(time / 86400) });
		case !!(time / 3600 > 1):
			return locale.Strings.PLAYED_HOURS_AGO({ time: Math.floor(time / 3600) });
		case !!(time / 60 > 1):
			return locale.Strings.PLAYED_MINUTES_AGO({ time: Math.floor(time / 60) });
		case !!(time % 60 < 60):
			return locale.Strings.JUST_STOPPED_PLAYING();
		case !!isNaN(time):
			return TimeClock({ timestamp });
	}
}
function GradGen(game, check, isSpotify, activity, voice, stream) {
	let input;
	switch (true) {
		case !!check?.find((x) => x.type === "STREAMING"):
			check?.find((x) => x.plaform === "YOUTUBE") ? input = "https://discord.com/assets/ff3516ac66b71ef616b1df63e20fee65.png" : input = "https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg";
			break;
		case !!isSpotify:
			input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
			break;
		case !!check?.find((x) => x.platform === "YT_MUSIC"):
			input = `https://media.discordapp.net/external${activity?.assets?.large_image?.substring(activity?.assets?.large_image?.indexOf("/"))}`;
			break;
		case !!check?.find((x) => x.platform === "XBOX"):
			input = "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png";
			break;
		case !!(activity?.assets && activity?.assets.large_image?.includes("external")):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case !!(activity?.assets && activity?.assets.large_image):
			input = `https://cdn.discordapp.com/app-assets/${activity?.application_id}/${activity?.assets?.large_image}.png`;
			break;
		case !!(game?.icon || game?.iconHash):
			input = `https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon || game?.supplementalData?.iconHash}.png?size=1024&keep_aspect_ratio=true`;
			break;
		case !!(voice && voice[0]?.guild):
			input = `https://cdn.discordapp.com/icons/${voice[0]?.guild.id}/${voice[0]?.guild.icon}.png?size=1024`;
			break;
		case (!!voice && stream):
			input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`;
			break;
	}
	return Common.GradientComponent(input || null);
}
function SplashGen(game, isSpotify, activity, voice, stream, check) {
	let input;
	switch (true) {
		case !!game?.data?.bannerHash?.length:
			input = game.data.getArtworkURLs()[0];
			break;
		case !!isSpotify:
			input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
			break;
		case !!check?.find((x) => x.platform === "XBOX"):
			input = "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png";
			break;
		case !!check?.find((x) => x.platform === "YT_MUSIC" || x.platform === "CRUNCHYROLL"):
			input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf("/"))}`;
			break;
		case !!(voice && voice[0]?.guild?.banner && !activity):
			input = "https://cdn.discordapp.com/banners/" + voice[0]?.guild?.id + "/" + voice[0]?.guild?.banner + ".webp?size=1024&keep_aspect_ratio=true";
			break;
		case !!(voice && stream):
			stream.guildId ? input = `https://cdn.discordapp.com/icons/${stream.guildId}/${voice[0]?.guild?.icon}.png?size=1024` : input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`;
			break;
		case !!(voice && !activity):
			input = `https://cdn.discordapp.com/icons/${voice[0]?.guild?.id}/${voice[0]?.guild?.icon}.png?size=1024`;
			break;
		case !!check?.find((x) => x.type === "STREAMING"):
			check?.find((x) => x.plaform === "YOUTUBE") ? input = `https://discord.com/assets/0fa530ba9c04ac32.svg` : input = `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`;
			break;
		case !!(!game?.data?.media?.artwork_urls && game?.data?.screenshotUrls):
			input = game?.data?.screenshotUrls[0];
			break;
		case !!!game?.data?.screenshotUrls:
			input = game?.application?.getIconURL(1024, "webp");
			break;
		default:
			input = game?.data?.media?.artwork_urls[0];
	}
	return input || null;
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
function useEffectEvent(callback) {
	const ref = react.useRef(callback);
	ref.current = callback;
	return react.useMemo(() => {
		const handler = {
			get [Symbol.for("callback")]() {
				return ref.current;
			}
		};
		for (const key of Reflect.ownKeys(Reflect)) {
			if (typeof Reflect[key] !== "function") continue;
			handler[key] = (_, ...args) => Reflect[key](ref.current, ...args);
		}
		return new Proxy(ref.current, handler);
	}, []);
}
async function parseXML(xml) {
	let body = await xml;
	let result;
	const entities = [{ key: "#8211", value: "\u2013" }, { key: "#8217", value: "'" }, { key: "#39", value: "'" }, { key: "#8220", value: "\u201C" }, { key: "#8221", value: "\u201D" }];
	const parser = new XMLParser({ ignoreDeclaration: true, ignoreAttributes: false, attributeNamePrefix: "_", numberParseOptions: { leadingZeros: false, hex: true } });
	for (let e in entities) {
		parser.addEntity(entities[e].key, entities[e].value);
	}
	try {
		result = await parser.parse(body);
	} catch (e) {
		return null;
	}
	return result;
}

// activity_feed/components/coachmark/ActivityFeedSettingsCoachmarkStore.tsx
const ActivityFeedSettingsCoachmarkStore = new class ActivityFeedSettingsCoachmarkStore extends betterdiscord.Utils.Store {
	static displayName = "ActivityFeedSettingsCoachmarkStore";
	hasDismissedSettingsCoachmark;
	constructor() {
		super();
		this.hasDismissedSettingsCoachmark = betterdiscord.Data.load("hasDismissedSettingsCoachmark") ?? false;
	}
	setHasDismissedSettingsCoachmark(v) {
		this.hasDismissedSettingsCoachmark = v;
		betterdiscord.Data.save("hasDismissedSettingsCoachmark", v);
		this.emitChange();
		return;
	}
}();

// settings/settings.jsx
const settings = {
	main: {
		v2Frame: {
			name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_TITLE(),
			note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_DESCRIPTION(),
			initial: true
		},
		v2News: {
			name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_TITLE(),
			note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_DESCRIPTION(),
			initial: true
		},
		v2Dock: {
			name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_TITLE(),
			note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_DESCRIPTION(),
			initial: true
		},
		v2Cards: {
			name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_TITLE(),
			note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_DESCRIPTION(),
			initial: true
		}
	},
	debug: {
		forceRerollFeed: {
			name: "Re-roll the news article feed",
			note: "Re-roll currently displayed articles. Will not fetch new ones.",
			innerText: "Reroll",
			type: "button",
			onClick: () => NewsStore.rerollFeeds()
		},
		forceRefreshFeed: {
			name: "Refresh the news article feed",
			note: BdApi.React.createElement(BdApi.React.Fragment, null, "Re-fetch news. WILL fetch new articles if they are available. ", BdApi.React.createElement("strong", null, "Do NOT spam this! You will likely be rate limited by one of many services if not multiple!")),
			innerText: "Refresh",
			type: "button",
			onClick: () => NewsStore.refreshFeeds()
		},
		resetCoachmark: {
			name: "Reset Settings Coachmark",
			note: "Settings coachmark will reappear again after having previously been dismissed.",
			innerText: "Reset",
			type: "button",
			onClick: () => ActivityFeedSettingsCoachmarkStore.setHasDismissedSettingsCoachmark(false)
		},
		clearLockedInArticles: {
			name: "Clear locked in articles",
			note: "Wipes articles that have been locked in.",
			innerText: "Wipe",
			type: "button",
			onClick: () => NewsStore.clearLockedArticles()
		},
		lockedInArticles: {
			name: "Lock in articles",
			note: "Add up to four articles which will always be displayed no matter what. #11p4tw",
			initial: false,
			type: "switch"
		},
		cardTypeDebug: {
			name: "Show both card types at once",
			note: "Show both types of activity cards under each other in the same list. Only enable if Activity Cards V2 is also enabled.",
			initial: false,
			type: "switch"
		},
		freezeDock: {
			name: "Force empty quick launcher",
			note: "Always make the quick launcher act as if it is empty.",
			type: "switch"
		},
		freezeCards: {
			name: "Force empty activity cards",
			note: "Always make the now playing section act as if it is empty.",
			type: "switch"
		},
		freezeNews: {
			name: "Force news feed state",
			initial: 0,
			type: "radio",
			options: [
				{
					name: "Off",
					description: "Feed will load normally.",
					value: 0
				},
				{
					name: "Always fail",
					description: "Feed will always fail to load, displaying the article fallback.",
					value: 1
				},
				{
					name: "Always continuously load",
					description: "Feed will always display the feed skeleton.",
					value: 2
				}
			]
		}
	},
	default: {
		v2Frame: true,
		v2News: true,
		v2Dock: true,
		v2Cards: true,
		cardTypeDebug: false,
		freezeDock: false,
		freezeCards: false,
		freezeNews: false
	},
	external: {
		discord: {
			name: "Discord",
			note: locale.Strings.ACTIVITY_FEED_SETTINGS_EXTERNAL_DISCORD_BLOG_DESCRIPTION(),
			icon: Common.ClydeIcon,
			color: "var(--background-brand)",
			enabled: true
		},
		nintendo: {
			name: "Nintendo",
			note: locale.Strings.ACTIVITY_FEED_SETTINGS_EXTERNAL_NINTENDO_BLOG_DESCRIPTION(),
			icon: Common.NintendoSwitchNeutralIcon,
			color: "rgba(230, 0, 18, 1)",
			enabled: false
		},
		xbox: {
			name: "Xbox",
			note: locale.Strings.ACTIVITY_FEED_SETTINGS_EXTERNAL_XBOX_BLOG_DESCRIPTION(),
			icon: Common.XboxNeutralIcon,
			color: "var(--platform-xbox)",
			enabled: false
		}
	}
};

// commonjsHelpers.js

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

// @jitbit
var HtmlSanitizer$1 = {exports: {}};

// @jitbit
HtmlSanitizer$1.exports;
var hasRequiredHtmlSanitizer;
function requireHtmlSanitizer () {
	if (hasRequiredHtmlSanitizer) return HtmlSanitizer$1.exports;
	hasRequiredHtmlSanitizer = 1;
	(function (module) {
		const HtmlSanitizer = new (function () {
			const _tagWhitelist = {
				'A': true, 'ABBR': true, 'B': true, 'BLOCKQUOTE': true, 'BODY': true, 'BR': true, 'CENTER': true, 'CODE': true, 'DD': true, 'DIV': true, 'DL': true, 'DT': true, 'EM': true, 'FONT': true,
				'H1': true, 'H2': true, 'H3': true, 'H4': true, 'H5': true, 'H6': true, 'HR': true, 'I': true, 'IMG': true, 'LABEL': true, 'LI': true, 'OL': true, 'P': true, 'PRE': true,
				'SMALL': true, 'SOURCE': true, 'SPAN': true, 'STRONG': true, 'SUB': true, 'SUP': true, 'TABLE': true, 'TBODY': true, 'TR': true, 'TD': true, 'TH': true, 'THEAD': true, 'UL': true, 'U': true, 'VIDEO': true
			};
			const _contentTagWhiteList = { 'FORM': true, 'GOOGLE-SHEETS-HTML-ORIGIN': true };
			const _attributeWhitelist = { 'align': true, 'color': true, 'controls': true, 'height': true, 'href': true, 'id': true, 'src': true, 'style': true, 'target': true, 'title': true, 'type': true, 'width': true };
			const _cssWhitelist = { 'background-color': true, 'color': true, 'font-size': true, 'font-weight': true, 'text-align': true, 'text-decoration': true, 'width': true };
			const _schemaWhiteList = [ 'http:', 'https:', 'data:', 'm-files:', 'file:', 'ftp:', 'mailto:', 'pw:' ];
			const _uriAttributes = { 'href': true, 'action': true };
			const _parser = new DOMParser();
			this.SanitizeHtml = function (input, extraSelector, callback) {
				input = input.trim();
				if (input == "") return "";
				if (input == "<br>") return "";
				if (input.indexOf("<body")==-1) input = "<body>" + input + "</body>";
				let doc = _parser.parseFromString(input, "text/html");
				if (doc.body.tagName !== 'BODY')
					doc.body.remove();
				if (typeof doc.createElement !== 'function')
					doc.createElement.remove();
				function makeSanitizedCopy(node) {
					let newNode;
					if (node.nodeType == Node.TEXT_NODE) {
						newNode = node.cloneNode(true);
					} else if (node.nodeType == Node.ELEMENT_NODE && (_tagWhitelist[node.tagName] || _contentTagWhiteList[node.tagName] || (extraSelector && node.matches(extraSelector))) && (!callback || callback(node))) {
						if (_contentTagWhiteList[node.tagName])
							newNode = doc.createElement('DIV');
						else
							newNode = doc.createElement(node.tagName);
						for (let i = 0; i < node.attributes.length; i++) {
							let attr = node.attributes[i];
							if (_attributeWhitelist[attr.name]) {
								if (attr.name == "style") {
									for (let s = 0; s < node.style.length; s++) {
										let styleName = node.style[s];
										if (_cssWhitelist[styleName])
											newNode.style.setProperty(styleName, node.style.getPropertyValue(styleName));
									}
								}
								else {
									if (_uriAttributes[attr.name]) {
										if (attr.value.indexOf(":") > -1 && !startsWithAny(attr.value, _schemaWhiteList))
											continue;
									}
									newNode.setAttribute(attr.name, attr.value);
								}
							}
						}
						for (let i = 0; i < node.childNodes.length; i++) {
							let subCopy = makeSanitizedCopy(node.childNodes[i]);
							newNode.appendChild(subCopy, false);
						}
						if ((newNode.tagName == "SPAN" || newNode.tagName == "B" || newNode.tagName == "I" || newNode.tagName == "U")
							&& newNode.innerHTML.trim() == "") {
							return doc.createDocumentFragment();
						}
					} else {
						newNode = doc.createDocumentFragment();
					}
					return newNode;
				}				let resultElement = makeSanitizedCopy(doc.body);
				return resultElement.innerHTML
					.replace(/div><div/g, "div>\n<div");
			};
			function startsWithAny(str, substrings) {
				for (let i = 0; i < substrings.length; i++) {
					if (str.indexOf(substrings[i]) == 0) {
						return true;
					}
				}
				return false;
			}
			this.AllowedTags = _tagWhitelist;
			this.AllowedAttributes = _attributeWhitelist;
			this.AllowedCssStyles = _cssWhitelist;
			this.AllowedSchemas = _schemaWhiteList;
		});
		if (module.exports) {
			module.exports = HtmlSanitizer;
		}
	} (HtmlSanitizer$1));
	return HtmlSanitizer$1.exports;
}

// @jitbit
var HtmlSanitizerExports = /*@__PURE__*/ requireHtmlSanitizer();
const HtmlSanitizer = /*@__PURE__*/getDefaultExportFromCjs(HtmlSanitizerExports);

// styles
let _styles = "";
function _loadStyle(path, css) {
	_styles += "/*" + path + "*/\n" + css + "\n";
}
function styles$1() {
	return _styles;
}

// activity_feed/ActivityFeed.module.css
const css$5 = `
.activityFeed__2cbe2 {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-frame-border);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

.scrollerBase__2cbe2 {
		background: no-repeat bottom;
		background-size: 100%;
		background-image: url(https://discord.com/assets/c486dc65ce2877eeb18e4c39bb49507a.svg);
}

.centerContainer__2cbe2 {
		display: flex;
		flex-direction: column;
		width: 1284px;
		max-width: 100%;
		min-width: 245px;
		margin: 0 auto;
}

.title__2cbe2 {
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

.titleWrapper__2cbe2 {
		flex: 0 0 auto;
		margin: 0 8px 0 0;
		min-width: auto;
}

.iconWrapper__2cbe2 {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: var(--space-32);
		justify-content: center;
		margin: 0;
		position: relative;
		width: var(--space-32);
		path {
				fill: currentColor;
		}
		svg {
				color: var(--channel-icon);
				height: var(--chat-input-icon-size);
				width: var(--chat-input-icon-size);
		}
}

.headerBar__2cbe2 {
		height: var(--custom-channel-header-height);
		min-height: var(--custom-channel-header-height);
}

.headerContainer__2cbe2 {
		flex-direction: row;
}

.headerText__2cbe2 {
		display: flex;
		flex: 1;
		font-size: 18px;
		font-weight: 500;
		line-height: 22px;
		margin-top: 20px;
		width: 100%;
		color: var(--text-default);
}

.button__2cbe2 {
		-webkit-box-align: center;
		-webkit-box-pack: center;
		align-items: center;
		background: none;
		border: none;
		display: flex;
		font-size: 14px;
		font-weight: 500;
		justify-content: center;
		line-height: 16px;
		position: relative;
		user-select: none;
}

.sectionDivider__2cbe2 {
		display: flex;
		width: 100%;
		border-bottom: 2px solid;
		margin: 20px 0 20px 0;
}

.emptyState__2cbe2 {
		position: relative;
}

.emptyText__2cbe2 {}

.emptyTitle__2cbe2 {
		font-size: 16px;
		line-height: 20px;
		color: var(--text-default);
}

.emptySubtitle__2cbe2 {
		font-size: 14px;
		color: var(--text-muted);
}

.activityFeedV2__2cbe2 {
		.headerText__2cbe2 {
				font-size: 24px;
				font-weight: 400;
				line-height: 1.25;
		}
		.emptyState__2cbe2.emptyState__2cbe2 {
				margin-top: var(--space-lg);
				border-radius: var(--radius-sm);
				flex-wrap: unset;
		}
}`;
_loadStyle("ActivityFeed.module.css", css$5);
const modules_7e65654a = {
	"activityFeed": "activityFeed__2cbe2",
	"scrollerBase": "scrollerBase__2cbe2",
	"centerContainer": "centerContainer__2cbe2",
	"title": "title__2cbe2",
	"titleWrapper": "titleWrapper__2cbe2",
	"iconWrapper": "iconWrapper__2cbe2",
	"headerBar": "headerBar__2cbe2",
	"headerContainer": "headerContainer__2cbe2",
	"headerText": "headerText__2cbe2",
	"button": "button__2cbe2",
	"sectionDivider": "sectionDivider__2cbe2",
	"emptyState": "emptyState__2cbe2",
	"emptyText": "emptyText__2cbe2",
	"emptyTitle": "emptyTitle__2cbe2",
	"emptySubtitle": "emptySubtitle__2cbe2",
	"activityFeedV2": "activityFeedV2__2cbe2"
};
const MainClasses = modules_7e65654a;

// activity_feed/Store.tsx
const NewsStore = new class GameNewsStore extends betterdiscord.Utils.Store {
	static displayName = "GameNewsStore";
	article = {};
	dataSet = {};
	displaySet = [];
	lockSet = [];
	blacklist = [];
	whitelist = [];
	followedGames = [];
	state = [];
	settingsOpened = false;
	lastTimeFetched;
	idling;
	direction;
	constructor() {
		super();
		this.dataSet = {};
		this.displaySet = [];
		this.lockSet = [];
		this.article = {};
		this.blacklist = [];
		this.whitelist = [];
		this.followedGames = [];
		this.settingsOpened = false;
		this.lastTimeFetched;
		this.direction = 1;
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
	setDebugFeed(num) {
		if (num < 1) {
			console.warn("Invalid article input.");
			return;
		}
		const testImages = ["https://files.catbox.moe/mfrfxj.png", "https://static.wikia.nocookie.net/silly-cat/images/4/4f/Wire_Cat.png", "https://github.com/Moder112/HWCInternalDatabase/blob/master/static/img/Main.jpg?raw=true", "https://github.com/Moder112/HWCInternalDatabase/blob/master/static/img/him.jpg?raw=true"];
		this.displaySet = [];
		for (let i = 0; i < num; i++) {
			this.displaySet.push({
				index: i,
				id: "discord",
				application: {
					name: "Test Article",
					id: "Discord"
				},
				news: {
					application_id: "Discord",
					description: "this is a test article! For more information, visit https://example.com.",
					thumbnail: `${testImages[Math.floor(Math.random() * testImages.length)]}`,
					timestamp: Date.now(),
					title: `Test Article ${i + 1}`,
					url: "https://example.com"
				},
				type: "application_news"
			});
		}
		this.article = this.displaySet[0];
	}
	getFeeds() {
		return this.dataSet;
	}
	setFeeds() {
		this.dataSet = betterdiscord.Data.load("dataSet") ? Object.assign(this.dataSet, betterdiscord.Data.load("dataSet")) : {};
		this.lockSet = betterdiscord.Data.load("lockSet") || [];
		this.whitelist = betterdiscord.Data.load("whitelist") || [];
		this.blacklist = betterdiscord.Data.load("blacklist") || [];
		this.followedGames = betterdiscord.Data.load("followedGames") || [];
		this.lastTimeFetched = betterdiscord.Data.load("lastTimeFetched");
		this.emitChange();
		return;
	}
	rerollFeeds() {
		this.displaySet = [];
		this.getFeedsForDisplay();
		this.emitChange();
	}
	refreshFeeds() {
		this.lastTimeFetched = 0;
		this.emitChange();
	}
	getTime() {
		return this.lastTimeFetched;
	}
	getWhitelist() {
		return this.whitelist;
	}
	getWhitelistedGameByApplicationId(applicationId) {
		let w = this.whitelist;
		return w.find((e) => e.applicationId === applicationId);
	}
	getWhitelistedGameByGameId(gameId) {
		let w = this.whitelist;
		return w.find((e) => e.gameId === gameId);
	}
	getBlacklist() {
		return this.blacklist;
	}
	getBlacklistedGameByApplicationId(applicationId) {
		let b = this.blacklist;
		return b?.find((e) => e.applicationId === applicationId);
	}
	getBlacklistedGameByGameId(gameId) {
		let b = this.blacklist;
		return b?.find((e) => e.gameId === gameId);
	}
	clearBlacklist() {
		let b = this.blacklist;
		b.length = 0;
		this.emitChange();
		return;
	}
	blacklistGame(application, gameId) {
		let b = this.blacklist;
		let g;
		if (this.isGameFollowed(application?.linkedApplications?.[0]?.id ?? application.id)) {
			this.unfollowGame(application?.linkedApplications?.[0]?.id ?? application.id);
			return;
		}
		if (!gameId) g = this.getWhitelistedGameByApplicationId(application.id);
		if (!this.getBlacklistedGameByGameId(gameId ?? g?.gameId)) {
			b.push({ applicationId: application?.linkedApplications?.[0]?.id ?? application.id, gameId: gameId ?? g?.gameId, name: application.name });
			this.emitChange();
			betterdiscord.Data.save("blacklist", this.blacklist);
		}
		return;
	}
	isGameBlacklisted(applicationId) {
		let r = this.getBlacklistedGameByApplicationId(applicationId);
		return Boolean(r);
	}
	whitelistGame(gameId) {
		let b = this.blacklist;
		const g = this.getBlacklistedGameByGameId(gameId);
		b.splice(b.indexOf(g), 1);
		this.emitChange();
		betterdiscord.Data.save("blacklist", this.blacklist);
		return this.blacklist;
	}
	isGameWhitelisted(applicationId) {
		let r = this.getWhitelistedGameByApplicationId(applicationId);
		if (r && this.getBlacklistedGameByGameId(r?.gameId)) return false;
		return Boolean(r);
	}
	isGameFollowed(applicationId) {
		let f = this.followedGames;
		return Boolean(f?.find((e) => e.applicationId === applicationId)) ?? false;
	}
	getManuallyFollowedGames() {
		return this.followedGames;
	}
	followGame(application) {
		if (this.isGameWhitelisted(application.id)) return;
		if (this.isGameBlacklisted(application.id)) {
			this.whitelistGame(this.getBlacklistedGameByApplicationId(application.id)?.gameId);
			return;
		}
		let f = this.followedGames;
		let g = application.thirdPartySkus.find((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite")?.id || application.name;
		f.push({ applicationId: application.id, gameId: g, name: application.name });
		this.emitChange();
		betterdiscord.Data.save("followedGames", this.followedGames);
		return;
	}
	unfollowGame(applicationId) {
		let f = this.followedGames;
		let r = this.isGameFollowed(applicationId);
		if (r) f.splice(f.indexOf(r), 1);
		this.emitChange();
		betterdiscord.Data.save("followedGames", this.followedGames);
		return;
	}
	sanitize(content) {
		const ignore = ["IMG", "VIDEO", "LI", "DIV", "A"];
		for (let i = 0; i < ignore.length; i++) {
			delete HtmlSanitizer.AllowedTags[ignore[i]];
		}
		return HtmlSanitizer.SanitizeHtml(content);
	}
	sortFeeds(f) {
		let a = this.getFeeds();
		let da = f.map((k) => a[k].news.timestamp).sort((n, o) => new Date(n) - new Date(o)).reverse();
		let d = new Set();
		for (let k in da) {
			d.add(new Date(da[k]).toDateString());
		}
		return Array.from(d);
	}
	async fetchAnyFeed(url, options) {
		const rssFeed = await Promise.resolve(betterdiscord.Net.fetch(`${url}`, options).then((r) => r.ok ? r : null));
		const feedClone = rssFeed?.clone();
		const result = rssFeed?.json().catch((e) => parseXML(feedClone?.text()));
		return result;
	}
	async #fetchDiscordFeeds() {
		const rssFeed = await Promise.resolve(parseXML(betterdiscord.Net.fetch(`https://discord.com/blog/rss.xml`).then((r) => r.ok ? r.text() : null).catch((e) => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for Discord`, e))));
		if (!rssFeed) return;
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed?.rss?.channel?.title,
				id: "Discord"
			},
			appId: "Discord",
			description: article?.description,
			thumbnail: article?.["media:thumbnail"]?._url,
			timestamp: article?.pubDate,
			title: article?.title,
			url: article?.link
		};
	}
	async #fetchNintendoFeeds() {
		const rssFeed = await Promise.resolve(parseXML(betterdiscord.Net.fetch(`https://nintendoeverything.com/feed/`).then((r) => r.ok ? r.text() : null).catch((e) => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for Nintendo`, e))));
		if (!rssFeed) return;
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed?.rss?.channel?.title,
				id: "Nintendo"
			},
			appId: "Nintendo",
			description: article?.description,
			thumbnail: article?.["media:content"]?._url,
			timestamp: article?.pubDate,
			title: article?.title,
			url: article?.link
		};
	}
	async #fetchXboxFeeds() {
		const rssFeed = await Promise.resolve(parseXML(betterdiscord.Net.fetch(`https://news.xbox.com/en-us/feed/`, { headers: { "User-Agent": "activity" } }).then((r) => r.ok ? r.text() : null)).catch((e) => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for Xbox`, e)));
		if (!rssFeed) return;
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed?.rss?.channel?.title,
				id: "Xbox"
			},
			appId: "Xbox",
			description: article?.description,
			thumbnail: article?.["content:encoded"]?.match(/\"(https:\/\/xboxwire.thesourcemediaassets.com\/sites\/\d+\/\d+\/\d+\/.*(?=).(jpg|jpeg|png))\"/)[1],
			timestamp: article?.pubDate,
			title: article?.title,
			url: article?.link
		};
	}
	async #fetchSubnauticaFeeds(application) {
		const rssFeed = await Promise.resolve(betterdiscord.Net.fetch(`https://unknownworlds-strapi.live.kraftonamericas.com/api/articles?sort[0]=published_date%3Adesc&sort[1]=id%3Adesc&sort[2]=published_date%3Adesc&start=0&limit=4`).then((r) => r.ok ? r.json() : null).catch((e) => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? "game"}`, e)));
		if (!rssFeed) return;
		const article = rssFeed.data[0];
		return {
			application,
			appId: application.id,
			description: article.summary,
			thumbnail: article.thumbnail_image.url,
			timestamp: article.publishedAt,
			title: article.title,
			url: `https://unknownworlds.com/en/news/${article.slug}`
		};
	}
	async #fetchMinecraftFeeds(application) {
		const rssFeed = await Promise.resolve(betterdiscord.Net.fetch(`https://net-secondary.web.minecraft-services.net/api/v1.0/en-us/search?pageSize=24&sortType=Recent&category=News&newsOnly=true`).then((r) => r.ok ? r.json() : null).catch((e) => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? "game"}`, e)));
		if (!rssFeed) return;
		const article = rssFeed.result.results[0];
		return {
			application,
			appId: application.id,
			description: article?.description && new DOMParser().parseFromString(article?.description, "text/html").body.innerText,
			thumbnail: article?.image,
			timestamp: article?.time * 1e3,
			title: article?.title && new DOMParser().parseFromString(article?.title, "text/html").body.innerText,
			url: article?.url
		};
	}
	async #fetchFortniteFeeds(application) {
		const rssFeed = await Promise.resolve(betterdiscord.Net.fetch(`https://fortnite-api.com/v2/news`).then((r) => r.ok ? r.json() : null).catch((e) => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? "game"}`, e)));
		if (!rssFeed) return;
		const article = rssFeed.data.br.motds[0];
		return {
			application,
			appId: application.id,
			description: article?.body,
			thumbnail: article?.image,
			timestamp: rssFeed.data.br.date,
			title: article?.title
		};
	}
	async #fetchSteamFeeds(gameId, application) {
		const rssFeed = await Promise.all([parseXML(betterdiscord.Net.fetch(`https://store.steampowered.com/feeds/news/app/${gameId}`).then((r) => r.ok ? r.text() : null).catch((e) => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? gameId}`, e)))]);
		if (!rssFeed) return;
		const backupThumbnail = await Promise.resolve(betterdiscord.Net.fetch(`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${gameId}/capsule_616x353.jpg`).then((r) => r.ok ? r.url : null));
		const article = this.getRSSItem(rssFeed);
		return {
			application,
			appId: application.id,
			description: article?.description && new DOMParser().parseFromString(article?.description, "text/html").body.innerText.replaceAll(/(^| )([^. ]+)\.([^. ]+)(?= |$)/g, "$1$2. $3"),
			thumbnail: article?.enclosure?._url || backupThumbnail,
			timestamp: article?.pubDate,
			title: article?.title,
			url: article?.link
		};
	}
	async feedSelector(g, s) {
		let d;
		switch (g) {
			case "Minecraft":
				d = await this.#fetchMinecraftFeeds(s);
				break;
			case "Fortnite":
				d = await this.#fetchFortniteFeeds(s);
				break;
			case "264710":
			case "848450":
			case "1962700":
				d = await this.#fetchSubnauticaFeeds(s);
				break;
			case "discord":
				d = await this.#fetchDiscordFeeds();
				break;
			case "nintendo":
				d = await this.#fetchNintendoFeeds();
				break;
			case "xbox":
				d = await this.#fetchXboxFeeds();
				break;
			default:
				d = await this.#fetchSteamFeeds(g, s);
		}
		return d;
	}
	async fetchFeeds() {
		this.lastTimeFetched = Date.now();
		betterdiscord.Data.save("lastTimeFetched", this.lastTimeFetched);
		const gameData = await this.getFeedGameData();
		for (const gameId of Object.keys(gameData)) {
			(async (gameId2) => {
				const { application, appId, description, thumbnail, timestamp, title, url } = await this.feedSelector(gameId2, gameData[gameId2]);
				if (this.isNewsInDate({ timestamp })) {
					this.dataSet[gameId2] = {
						id: gameId2,
						application,
						news: {
							application_id: appId,
							description: description && this.sanitize(description),
							thumbnail,
							timestamp,
							title,
							url
						},
						type: "application_news"
					};
					betterdiscord.Data.save("dataSet", this.dataSet);
				}
			})(gameId);
		}
	}
	async getFeedGameData() {
		const gameData = {};
		let analyticData;
		await Common.FetchUserApplicationStatistics().then(analyticData = LibraryApplicationStatisticsStore.applicationStatistics);
		const manuallyFollowedGames = this.followedGames;
		const gameIds = Object.values(analyticData).map((game) => game.application_id).concat(manuallyFollowedGames);
		let idOverflow = [];
		if (gameIds.length > 112) {
			for (let i = 0; i < gameIds.length; i++) {
				if (i % 112 === 0) {
					idOverflow.push(gameIds.splice(0, 112));
				}
			}
			await Common.FetchApplications.fetchApplications(gameIds);
			idOverflow.map(async (idSplit) => {
				return await Common.FetchApplications.fetchApplications(idSplit);
			});
		} else {
			await Common.FetchApplications.fetchApplications(gameIds);
		}
		const gameList = Object.values(analyticData).filter((game) => ApplicationStore.getApplication(game.application_id));
		let applicationList;
		applicationList = gameList.map((game) => ApplicationStore.getApplication(game.application_id)).filter((game) => game && game.thirdPartySkus.length > 0 && game.thirdPartySkus.some((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"));
		const feedIds = applicationList.map((game) => {
			const steamSku = game.thirdPartySkus.find((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite");
			return steamSku?.sku || game.name;
		});
		for (let i = 0; i < feedIds.length; i++) {
			gameData[feedIds[i]] = applicationList[i];
			this.whitelist[i] = { applicationId: applicationList[i].id, gameId: feedIds[i], name: applicationList[i].name };
		}
		this.whitelist = this.whitelist.filter((item, index, array) => {
			return array.findIndex((x) => x?.gameId === item.gameId) === index;
		});
		for (let i in settings.external) {
			if ((betterdiscord.Data.load("external") && betterdiscord.Data.load("external")[i] || settings.external[i].enabled) === true) {
				gameData[i] = "External Source";
			}
		}
		betterdiscord.Data.save("whitelist", this.whitelist);
		return gameData;
	}
	getByGameId(id) {
		let d = this.dataSet;
		for (let k = 0; k < Object.keys(d).length; k++) {
			if (Object.keys(d)[k] == id) {
				return Object.values(d)[k];
			}
		}
	}
	getByApplicationId(id) {
		let d = this.dataSet;
		for (let k of Object.keys(d)) {
			if (d[k].news.application_id === id) {
				return d[k];
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
	async getDirectByApplicationId(id, shouldSave) {
		const game = GameStore.getGameByApplication(ApplicationStore.getApplication(id));
		const articleId = game?.thirdPartySkus?.find((sku) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite")?.id || game.name;
		const article = await this.feedSelector(articleId, game);
		if (!article) return;
		const news = {
			id: articleId,
			application: article.application,
			news: {
				application_id: article.appId,
				description: article.description && this.sanitize(article.description),
				thumbnail: article.thumbnail,
				timestamp: article.timestamp,
				title: article.title,
				url: article?.url
			},
			type: "application_news"
		};
		if (this.isNewsInDate(article)) {
			if (shouldSave) {
				Object.assign(this.dataSet[articleId], news);
				this.whitelist.push({ applicationId: article.appId, gameId: articleId });
				betterdiscord.Data.save("whitelist", this.whitelist);
				betterdiscord.Data.save("dataSet", this.dataSet);
			}
			return news;
		}
		return;
	}
	getRSSItem(feed, itemIndex = 0) {
		if (feed?.length) {
			try {
				return feed[0]?.rss?.channel?.item[itemIndex];
			} catch (e) {
				return null;
			}
		}
		try {
			return feed?.rss?.channel?.item[itemIndex];
		} catch (e) {
			return null;
		}
	}
	getRandomFeeds(feeds) {
		let t = [];
		let s = this.lockSet;
		t = t.concat(s);
		let keys = Object.keys(feeds);
		let _keys = keys.filter((key) => !this.isGameBlacklisted(feeds[key].application?.id) && !this.isArticleLockedIn(feeds[key]) && this.isNewsInDate(feeds[key].news));
		let total = _keys.length;
		let sorted = this.sortFeeds(_keys);
		if (!_keys.length) return;
		ld: for (let d in sorted) {
			let f = _keys.filter((k) => new Date(feeds[k].news.timestamp).toDateString() === sorted[d]);
			for (let g = 0; g <= 4 - s.length; g++) {
				if (g > f.length) break;
				if (g > total - 1 || t.length > 3) break ld;
				let rand = f.length * Math.random() << 0;
				t.push(feeds[f[rand]]);
				f.splice(rand, 1);
			}
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
	lockInArticle(article) {
		let l = this.lockSet;
		if (!this.isArticleLockedIn(article) || l.length < 4) {
			l.push(article);
			betterdiscord.Data.save("lockSet", l);
			this.emitChange();
		} else {
			return Common.ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
					{
						...props,
						title: "That didn't work",
						actions: [
							{ text: "Ok", variant: "primary", fullWidth: 0, onClick: () => props.onClose() }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Article is already locked in, or you've reached the maximum number (4)."))
				)
			);
		}
		return;
	}
	isArticleLockedIn(article) {
		let s = this.lockSet;
		return Boolean(s.find((entry) => entry.id === article.id));
	}
	releaseLockedArticle(article) {
		let l = this.lockSet;
		if (this.isArticleLockedIn(article)) {
			l.splice(l.indexOf(article), 1);
			this.emitChange();
			betterdiscord.Data.save("lockList", l);
		} else {
			return Common.ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
					{
						...props,
						title: "That didn't work",
						actions: [
							{ text: "Ok", variant: "primary", fullWidth: 0, onClick: () => props.onClose() }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Article is not locked in."))
				)
			);
		}
		return;
	}
	clearLockedArticles() {
		this.lockSet = [];
		return;
	}
	getOrientation() {
		const [width, height] = this.state.size?.length ? this.state.size : [WindowStore.windowSize().width, WindowStore.windowSize().height];
		return (width > 1200 || height < 600) && (width < 1200 || height > 600) ? "vertical" : "horizontal";
	}
	setDirection(e) {
		this.direction = e >= 0 ? 1 : -1;
		this.emitChange();
	}
	getDirection() {
		return this.direction;
	}
	setIdling(e) {
		this.idling = e;
		this.emitChange();
	}
	isIdling() {
		return this.idling;
	}
	isFetched() {
		let b = Object.values(this.getFeeds()).length > 5;
		return b;
	}
	shouldFetch() {
		if (Object.keys(this.getFeeds()).length === 0) {
			this.setFeeds();
		}
		let t = this.lastTimeFetched;
		Object.values(this.getFeeds()).length;
		return null == t || Date.now() - t > 216e5;
	}
	isNewsInDate(f) {
		if (!f) return;
		const oW = new Date(Date.now() - 12096e5);
		return new Date(f.timestamp) > oW;
	}
	haveSettingsBeenOpened() {
		return this.settingsOpened;
	}
	setHaveSettingsBeenOpened(e) {
		this.settingsOpened = e;
		this.emitChange();
	}
}();

// activity_feed/components/application_news/ApplicationNews.module.css
const css$4 = `
.feedCarousel__94d97 {
		display: flex;
		position: relative;
		margin: 20px;
		margin-right: 4px;
}

.carousel__94d97 {
		background-color: var(--background-secondary-alt);
		border-radius: 5px;
		flex: 1 1 75%;
		min-height: 388px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

.carousel__94d97:not(:only-child) {
		margin-right: 20px;
}

.article__94d97 {
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

.articleStandard__94d97 {}

.articleSkeleton__94d97 {}

.articleSimple__94d97 {}

.unavailable__94d97 {
		padding: 20px;
}

.background__94d97 {
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 7.5%;
		mask: linear-gradient(0deg, transparent, #000);
		min-width: 300px;
		background-position: top;
}

.backgroundImage__94d97 {
		background-position: top;
		background-repeat: no-repeat;
		background-size: cover;
		bottom: 0;
}

.background__94d97, .backgroundImage__94d97 {
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

.theme-dark .backgroundBackup__94d97, .theme-dark .splashArt__94d97 {
		background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 400 408'%3E%3Cdefs%3E%3Cstyle%3E.b%7Bopacity:.3;%7D%3C/style%3E%3C/defs%3E%3Cimage class='b' width='400' height='408' xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGYCAYAAABs7LShAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUM2QkE3ODcyOUIzMTFFNkFFQkZGMjI5MUJDQjk1MkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUM2QkE3ODgyOUIzMTFFNkFFQkZGMjI5MUJDQjk1MkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQzZCQTc4NTI5QjMxMUU2QUVCRkYyMjkxQkNCOTUyQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQzZCQTc4NjI5QjMxMUU2QUVCRkYyMjkxQkNCOTUyQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pggo/nIAAIzVSURBVHja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'/%3E%3C/svg%3E");
}

.theme-light .backgroundBackup__94d97, .theme-light .splashArt__94d97 {
		background-image: url("data:image/webp;base64,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");
}

.feedOverflowMenu__94d97 {
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 12px;
}

.applicationArea__94d97 {
		color: var(--text-default);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
}

.detailsContainer__94d97 {}

.details__94d97 {
		position: relative;
		overflow: hidden;
}

.body__94d97 {
		position: relative;
		word-break: break-word;
}

.titleStandard__94d97 {
		margin-top: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24px;
		line-height: 28px;
}

.title__94d97 {
		color: var(--text-strong);
		display: block;
		font-weight: 500;
}

.body__94d97 > .title__94d97 {
		line-height: 20px;
}

.description__94d97 {
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
		img, br+br, .sharedFilePreviewYouTubeVideo {
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

.body__94d97 .description__94d97 {
		font-size: 14px;
}

.timestamp__94d97 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.gameIcon__94d97 {
		position: relative;
		pointer-events: auto;
		cursor: pointer;
		height: 40px;
		width: 40px;
		flex-shrink: 0;
		border-radius: 3px;
}

.clickableIcon__94d97 {
		opacity: 0.8;
		cursor: pointer;
}

.pagination__94d97 {
		-webkit-box-flex: 1;
		flex: 1 1 25%;
		min-width: 0;
}

.verticalPaginationItemContainer__94d97 {
		margin: 0;
		overflow: hidden;
}

.scrollerWrap__94d97 {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
		height: 100%;
		min-height: 1px;
		position: relative;
}

.scroller__94d97 {
		-webkit-box-flex: 1;
		contain: layout;
		flex: 1;
		min-height: 1px;
}
		
.paginationItem__94d97, .paginationItem__94d97:before {
		transition: all .2s ease;
}

.paginationItem__94d97:first-child {
		margin-top: 0;
}

.paginationItem__94d97 {
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

.paginationItem__94d97:before {
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

.paginationItem__94d97:after {
		background-blend-mode: color;
		border-radius: 5px;
		bottom: 0;
		content: "";
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
}

.theme-dark .paginationItem__94d97:after {
		background: linear-gradient(270deg, transparent 0, var(--background-secondary-alt))
}

.theme-light .paginationItem__94d97:after {
		background: linear-gradient(270deg, transparent 0, var(--background-secondary-alt))
}

.paginationSkeleton__94d97 {}

.splashArt__94d97 {
		filter: grayscale(100%);
		transition: all .2s ease;
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

.paginationItem__94d97:not(.selectedPage__94d97):hover {
		background: var(--background-secondary-alt);
}

.paginationItem__94d97:hover .splashArt__94d97 {
		filter: grayscale(0);
}

.paginationSubtitle__94d97, .paginationTitle__94d97 {
		font-weight: 600;
}

.paginationText__94d97 {
		overflow: hidden;
}

.paginationContent__94d97 {
		overflow: hidden;
		position: relative;
		z-index: 1;
}

.paginationTitle__94d97 {
		color: var(--text-strong);
		font-size: 16px;
		line-height: 1.25;
		max-height: 40px;
}

.paginationSubtitle__94d97 {
		color: var(--text-muted);
		font-size: 12px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.selectedPage__94d97 {
		background: var(--background-secondary-alt);
		cursor: default;
}

.selectedPage__94d97:before {
		transform: translateY(-50%) translateX(0);
}

.selectedPage__94d97 .splashArt__94d97 {
		filter: grayscale(0);
}

.smallCarousel__94d97 {
		background-color: var(--background-secondary-alt);
		-webkit-box-flex: 1;
		border-radius: 5px;
		flex: 1;
		height: 220px;
		overflow: hidden;
		position: relative;
		transform: translateZ(0);
}

.titleRowSimple__94d97 {
		-webkit-box-align: center;
		-webkit-box-pack: justify;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
}

.paginationSmall__94d97 {
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

.arrow__94d97 {
		color: var(--text-muted);
		z-index: 2;
}

svg.arrow__94d97 {
		height: 26px;
		width: 26px;
}

.arrowContainer__94d97 {
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

.arrow__94d97, .arrowContainer__94d97 {
		box-sizing: border-box;
		pointer-events: all;
}

.prevButtonContainer__94d97 {
		left: 6px;
}

.nextButtonContainer__94d97 {
		right: 6px;
}

.left__94d97 {
		transform: rotate(-90deg);
}

.right__94d97 {
		transform: rotate(90deg);
}

.horizontalPaginationItemContainer__94d97 {
		-webkit-box-align: center;
		-webkit-box-flex: initial;
		align-items: center;
		display: flex;
		flex: initial;
		margin: 0 auto;
		overflow-y: hidden;
}

.dot__94d97 {
		background-color: #fff;
		border-radius: 2px;
		cursor: pointer;
		height: 8px;
		margin-right: 8px;
		pointer-events: all;
		transform: translateZ(0);
		width: 8px;
}

.dotNormal__94d97 {
		opacity: 0.2;
}

.dotSelected__94d97 {
		opacity: 0.6;
}

@keyframes pulse__94d97 {
	0% {
		background: var(--background-surface-high);
	}
	30% {
		background: var(--background-surface-highest);
	}
	70% {
		background: var(--background-surface-highest);
	}
	to {
		background: var(--background-surface-high);
	}
}

.full-motion .feedCarouselV2__94d97 :is(.articleSkeleton__94d97:not(.unavailable__94d97), .paginationSkeleton__94d97) {
		animation: pulse__94d97 2s ease-in-out infinite alternate;
		animation-fill-mode: backwards;
}
.full-motion .feedCarouselV2__94d97 :is(.articleSkeleton__94d97, .paginationSkeleton__94d97):nth-of-type(5n+1) {
		animation-delay: 0s;
}
.full-motion .feedCarouselV2__94d97 :is(.articleSkeleton__94d97, .paginationSkeleton__94d97):nth-of-type(5n+2) {
		animation-delay: .4s;
}
.full-motion .feedCarouselV2__94d97 :is(.articleSkeleton__94d97, .paginationSkeleton__94d97):nth-of-type(5n+3) {
		animation-delay: .8s;
}
.full-motion .feedCarouselV2__94d97 :is(.articleSkeleton__94d97, .paginationSkeleton__94d97):nth-of-type(5n+4) {
		animation-delay: 1.2s;
}

.news__94d97 {
		align-items: flex-end;
		box-sizing: border-box;
		display: flex;
		overflow: hidden;
		padding: 20px;
		position: relative;
		height: 270px;
}

.newsLink__94d97 {}

.feedCarouselV2__94d97 {
		.carousel__94d97 {
				background-color: var(--background-surface-high);
				border-radius: var(--radius-md);
		}

		.smallCarousel__94d97 {
				background-color: var(--background-surface-high);
				border-radius: var(--radius-md);
		}

		.article__94d97 {
				background-color: var(--background-surface-high);
				border-radius: var(--radius-md);
				outline: 1px solid var(--border-muted);
				outline-offset: -1px;
				overflow: hidden;
				padding: var(--space-lg);
		}

		.background__94d97 {
				z-index: -1;
		}

		.applicationArea__94d97 {
				gap: var(--space-xs);
		}

		.titleStandard__94d97 {
				margin: unset;
		}

		.details__94d97 {
				display: flex;
				flex-direction: column;
				gap: var(--space-xs);
				> div {
						margin: unset;
				}
		}

		.gameIcon__94d97 {
				border-radius: var(--radius-sm);
		}

		.description__94d97 {
				color: var(--text-subtle);
				font-size: 14px;
				font-weight: 400;
				line-height: 1.2857142857142858;
		}

		.timestamp__94d97 {
				color: var(--text-muted);
				font-size: 12px;
				font-weight: 400;
				text-transform: unset;
		}

		.feedOverflowMenu__94d97 {
				/* Mimic Mana Button */
				top: var(--space-lg);
				right: var(--space-lg);
				align-items: center;
				background-color: var(--control-overlay-secondary-background-default);
				border: 1px solid var(--control-overlay-secondary-border-default);
				border-radius: var(--radius-sm);
				color: var(--control-overlay-secondary-text-default);
				cursor: pointer;
				display: flex;
				justify-content: center;
				min-height: 38px;
				min-width: 38px;
				padding: 0;
				transition: background .2s ease, border .2s ease, color .2s ease;
				&:hover {
						background-color: var(--control-overlay-secondary-background-hover);
						border-color: var(--control-overlay-secondary-border-hover);
						color: var(--control-overlay-secondary-text-hover);
				}
				&:active {
						background-color: var(--control-overlay-secondary-background-active);
						border-color: var(--control-overlay-secondary-border-active);
						color: var(--control-overlay-secondary-text-active);
				}
				svg {
						scale: 0.833333333;
						/* Set SVG size from 24px to 20px */
				}
		}

		.paginationItem__94d97 {
				background-color: var(--background-surface-high);
				border: 1px solid var(--border-muted);
				border-radius: var(--radius-md);
				overflow: hidden;
		}

		.paginationItem__94d97:after {
				background: linear-gradient(270deg, transparent 0, var(--background-surface-high)) !important;
		}

		.paginationItem__94d97:not(.selectedPage__94d97):hover {
				background: var(--background-surface-high);
		}

		.paginationSubtitle__94d97 {
				color: var(--text-subtle);
				font-weight: 400;
		}

		.paginationSmall__94d97 {
				align-items: center;
				height: unset;
				margin-inline: var(--space-lg);
				margin-bottom: var(--space-lg);
		}

		.horizontalPaginationItemContainer__94d97 {
				gap: 8px;
		}

		.selectedPage__94d97 {
				background: var(--background-surface-high);
		}

		.splashArt__94d97 {
				opacity: .1;
				transition: .5s ease;
		}

		.selectedPage__94d97 .splashArt__94d97 {
				opacity: .2;
		}

		.dot__94d97 {
				background-color: var(--icon-strong);
				border-radius: var(--radius-round);
				margin: unset;
				transition: opacity 0.2s ease, width 0.2s ease;
		}

		.dotNormal__94d97 {
				opacity: 0.6;
		}

		.dotSelected__94d97 {
				opacity: 1;
				width: 32px;
		}

		.arrowContainer__94d97 {
				position: unset;
				background-color: transparent;
				border: 1px solid transparent;
				border-radius: var(--radius-sm);
				color: var(--control-icon-only-icon-default);
				cursor: pointer;
				display: flex;
				justify-content: center;
				min-height: 40px;
				min-width: 40px;
				height: 40px;
				width: 40px;
				padding: 0;
				transform: unset;
				transition: background .2s ease, border .2s ease, color .2s ease;
				&:hover {
						background-color: var(--control-icon-only-background-hover);
						border-color: var(--control-icon-only-border-hover);
						color: var(--control-icon-only-icon-hover);
				}
				&:active {
						background-color: var(--control-icon-only-background-active);
						border-color: var(--control-icon-only-border-active);
						color: var(--control-icon-only-icon-active);
				}
		}
		
		svg.arrow__94d97 {
				transform-origin: center;
				width: 24px;
				height: 24px;
				scale: 0.833333333;
		}
}`;
_loadStyle("ApplicationNews.module.css", css$4);
const modules_98d78101 = {
	"feedCarousel": "feedCarousel__94d97",
	"carousel": "carousel__94d97",
	"article": "article__94d97",
	"articleStandard": "articleStandard__94d97",
	"articleSkeleton": "articleSkeleton__94d97",
	"articleSimple": "articleSimple__94d97",
	"unavailable": "unavailable__94d97",
	"background": "background__94d97",
	"backgroundImage": "backgroundImage__94d97",
	"backgroundBackup": "backgroundBackup__94d97",
	"splashArt": "splashArt__94d97",
	"feedOverflowMenu": "feedOverflowMenu__94d97",
	"applicationArea": "applicationArea__94d97",
	"detailsContainer": "detailsContainer__94d97",
	"details": "details__94d97",
	"body": "body__94d97",
	"titleStandard": "titleStandard__94d97",
	"title": "title__94d97",
	"description": "description__94d97",
	"timestamp": "timestamp__94d97",
	"gameIcon": "gameIcon__94d97",
	"clickableIcon": "clickableIcon__94d97",
	"pagination": "pagination__94d97",
	"verticalPaginationItemContainer": "verticalPaginationItemContainer__94d97",
	"scrollerWrap": "scrollerWrap__94d97",
	"scroller": "scroller__94d97",
	"paginationItem": "paginationItem__94d97",
	"paginationSkeleton": "paginationSkeleton__94d97",
	"selectedPage": "selectedPage__94d97",
	"paginationSubtitle": "paginationSubtitle__94d97",
	"paginationTitle": "paginationTitle__94d97",
	"paginationText": "paginationText__94d97",
	"paginationContent": "paginationContent__94d97",
	"smallCarousel": "smallCarousel__94d97",
	"titleRowSimple": "titleRowSimple__94d97",
	"paginationSmall": "paginationSmall__94d97",
	"arrow": "arrow__94d97",
	"arrowContainer": "arrowContainer__94d97",
	"prevButtonContainer": "prevButtonContainer__94d97",
	"nextButtonContainer": "nextButtonContainer__94d97",
	"left": "left__94d97",
	"right": "right__94d97",
	"horizontalPaginationItemContainer": "horizontalPaginationItemContainer__94d97",
	"dot": "dot__94d97",
	"dotNormal": "dotNormal__94d97",
	"dotSelected": "dotSelected__94d97",
	"feedCarouselV2": "feedCarouselV2__94d97",
	"pulse": "pulse__94d97",
	"news": "news__94d97",
	"newsLink": "newsLink__94d97"
};
const FeedClasses = modules_98d78101;

// activity_feed/common/components/TooltipBuilder.tsx
const Tooltip = ({ note, position, children, forceOpen }) => {
	return BdApi.React.createElement(Common.Tooltip, { text: note, forceOpen, position: position || "top" }, (props) => {
		const child = react.Children.only(children);
		return react.cloneElement(child, Object.entries(props).reduce((pre, [key, value]) => {
			pre[key] = key in props ? (...args) => {
				child.props[key]?.(...args);
				return value(...args);
			} : value;
			return pre;
		}, {}));
	});
};

// activity_feed/components/application_news/components/OverflowBuilder.tsx
function FeedPopout({ application, gameId, articleUrl, close }) {
	const article = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getByGameId(gameId));
	if (isNaN(application.id)) {
		return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed-overflow", onClose: close ?? ((e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e)) }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: locale.Strings.COPY_ARTICLE_LINK(), action: () => Common.Clipboard(articleUrl) }), !betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && betterdiscord.Data.load("lockingInArticles") && BdApi.React.createElement(
			betterdiscord.ContextMenu.Item,
			{
				id: "lock-in-article",
				label: "Lock In Article",
				action: () => NewsStore.lockInArticle(article)
			}
		), betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && betterdiscord.Data.load("lockingInArticles") && BdApi.React.createElement(
			betterdiscord.ContextMenu.Item,
			{
				id: "unlock-article",
				label: "Unlock Article",
				action: () => NewsStore.releaseLockedArticle(article)
			}
		));
	}
	return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed-overflow", onClose: close ?? ((e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e)) }, UserSettingsProtoStore.settings.appearance.developerMode && BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-app-id", label: locale.Strings.COPY_APPLICATION_ID(), action: () => Common.Clipboard(application.id) }), BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: locale.Strings.COPY_ARTICLE_LINK(), action: () => Common.Clipboard(articleUrl) }), BdApi.React.createElement(
		betterdiscord.ContextMenu.Item,
		{
			id: "unfollow-game",
			label: "Unfollow Game",
			action: () => Common.ModalSystem.openModal(
				(props) => BdApi.React.createElement(
					Common.ModalRoot.Modal,
					{
						...props,
						title: locale.Strings.ARE_YOU_SURE(),
						actions: [
							{ text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
							{ text: locale.Strings.YES(), fullWidth: 1, onClick: () => {
								NewsStore.blacklistGame(application, gameId);
								props.onClose();
							} }
						]
					},
					BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME()), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()))
				)
			)
		}
	), !betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && betterdiscord.Data.load("lockedInArticles") && BdApi.React.createElement(
		betterdiscord.ContextMenu.Item,
		{
			id: "lock-in-article",
			label: "Lock In Article",
			action: () => NewsStore.lockInArticle(article)
		}
	), betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && betterdiscord.Data.load("lockedInArticles") && BdApi.React.createElement(
		betterdiscord.ContextMenu.Item,
		{
			id: "unlock-article",
			label: "Unlock Article",
			action: () => NewsStore.releaseLockedArticle(article)
		}
	));
}
function FeedOverflowBuilder({ application, gameId, articleUrl, position }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement(
		Common.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(FeedPopout, { application, gameId, articleUrl, close: () => setShowPopout(false) }),
			position,
			shouldShow: showPopout
		},
		(props) => BdApi.React.createElement(
			"div",
			{
				...props,
				ref: refDOM,
				onClick: () => setShowPopout(true),
				style: { position: "absolute", zIndex: 3, top: "0", right: "0" }
			},
			BdApi.React.createElement(Tooltip, { note: "More" }, BdApi.React.createElement("div", { className: FeedClasses.feedOverflowMenu }, BdApi.React.createElement("svg", { width: "24", height: "24" }, BdApi.React.createElement("path", { d: "M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z", fill: "white" }))))
		)
	);
}

// activity_feed/components/application_news/components/MiniPaginationBuilder.tsx
function ArrowIcon({ type }) {
	return BdApi.React.createElement("svg", { width: "24", height: "24", className: `${FeedClasses.arrow} ${FeedClasses[type]}` }, BdApi.React.createElement(
		"path",
		{
			fill: "currentColor",
			fillRule: "nonzero",
			d: betterdiscord.Data.load("v2News") ?? settings.default.v2News ? "M12.7004 3.30002C12.5135 3.11679 12.2621 3.01416 12.0004 3.01416C11.7386 3.01416 11.4873 3.11679 11.3004 3.30002L3.30039 11.3C3.18577 11.386 3.09097 11.4956 3.02239 11.6214C2.95381 11.7472 2.91306 11.8862 2.90291 12.0291C2.89275 12.172 2.91342 12.3155 2.96352 12.4497C3.01362 12.5839 3.09198 12.7058 3.19328 12.8071C3.29459 12.9084 3.41649 12.9868 3.55072 13.0369C3.68494 13.087 3.82837 13.1077 3.97128 13.0975C4.11419 13.0873 4.25325 13.0466 4.37905 12.978C4.50484 12.9094 4.61443 12.8146 4.70039 12.7L11.0004 6.42002V20C11.0004 20.2652 11.1057 20.5196 11.2933 20.7071C11.4808 20.8947 11.7352 21 12.0004 21C12.2656 21 12.52 20.8947 12.7075 20.7071C12.895 20.5196 13.0004 20.2652 13.0004 20V6.41002L19.3004 12.71C19.4928 12.8726 19.7396 12.9565 19.9912 12.9451C20.2429 12.9336 20.4809 12.8276 20.6578 12.6482C20.8347 12.4688 20.9373 12.2292 20.9452 11.9774C20.9531 11.7256 20.8657 11.4801 20.7004 11.29L12.7004 3.29002V3.30002Z" : "M13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"
		}
	));
}
function MiniSubpagination({ article, currentArticle }) {
	return BdApi.React.createElement(
		"div",
		{
			className: article.index === currentArticle.index ? `${FeedClasses.dotSelected} ${FeedClasses.dot}` : `${FeedClasses.dotNormal} ${FeedClasses.dot}`,
			onClick: () => {
				NewsStore.setCurrentArticle(article.index);
				NewsStore.setIdling(false);
				NewsStore.setDirection(article.index - currentArticle.index);
			}
		}
	);
}
function FeedMiniPaginationBuilder({ articleSet, currentArticle }) {
	return BdApi.React.createElement("div", { className: FeedClasses.paginationSmall }, BdApi.React.createElement(
		"button",
		{
			type: "button",
			className: `${FeedClasses.prevButtonContainer} ${FeedClasses.arrowContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`,
			onClick: () => {
				NewsStore.setCurrentArticle(currentArticle.index === 0 ? 3 : currentArticle.index - 1);
				NewsStore.setIdling(false);
				NewsStore.setDirection(-1);
			}
		},
		BdApi.React.createElement("div", { className: Common.ButtonVoidClasses.contents }, BdApi.React.createElement(ArrowIcon, { type: "left" }))
	), BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.horizontalPaginationItemContainer} ${Common.PositionClasses.alignCenter}` }, articleSet.map((article) => article && BdApi.React.createElement(MiniSubpagination, { article, currentArticle })))), BdApi.React.createElement(
		"button",
		{
			type: "button",
			className: `${FeedClasses.nextButtonContainer} ${FeedClasses.arrowContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`,
			onClick: () => {
				NewsStore.setCurrentArticle(currentArticle.index === 3 ? 0 : currentArticle.index + 1);
				NewsStore.setIdling(false);
				NewsStore.setDirection(1);
			}
		},
		BdApi.React.createElement("div", { className: Common.ButtonVoidClasses.contents }, BdApi.React.createElement(ArrowIcon, { type: "right" }))
	));
}

// activity_feed/components/application_news/components/PaginationBuilder.tsx
function Subpagination({ article }) {
	const currentArticle = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle());
	const thumbnail = article.news?.thumbnail?.replace(/\s/g, "%20");
	return BdApi.React.createElement(
		"div",
		{
			className: article.index === betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle()).index ? `${FeedClasses.paginationItem} ${FeedClasses.selectedPage}` : FeedClasses.paginationItem,
			onClick: () => {
				NewsStore.setCurrentArticle(article.index);
				NewsStore.setIdling(false);
				NewsStore.setDirection(article.index - currentArticle.index);
			},
			onContextMenu: (e) => betterdiscord.ContextMenu.open(e, (props) => BdApi.React.createElement(FeedPopout, { ...props, application: article.application, gameId: article.id, articleUrl: article.news?.url })),
			key: article.id
		},
		BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.splashArt,
				style: { backgroundImage: article.news?.thumbnail && `url(${thumbnail})` }
			}
		),
		BdApi.React.createElement("div", { className: FeedClasses.paginationText }, BdApi.React.createElement("div", { className: `${FeedClasses.paginationTitle} ${FeedClasses.paginationContent}` }, article.news?.title || "No Title"), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSubtitle} ${FeedClasses.paginationContent}` }, article.application?.name || "Unknown Game"))
	);
}
function FeedPaginationBuilder({ articleSet }) {
	return BdApi.React.createElement("div", { className: FeedClasses.pagination }, BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.verticalPaginationItemContainer}` }, articleSet.map((article) => article && BdApi.React.createElement(Subpagination, { article })))));
}

// activity_feed/components/application_news/components/SkeletonBuilder.tsx
function FeedSkeletonBuilder() {
	const type = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
	if (type === "vertical") {
		return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2News") ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel) }, BdApi.React.createElement("span", { className: FeedClasses.carousel }, BdApi.React.createElement("div", { className: `${FeedClasses.articleSkeleton} ${FeedClasses.article}` })), BdApi.React.createElement("div", { className: FeedClasses.pagination }, BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.verticalPaginationItemContainer}` }, BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` }), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` }), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` }), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}` })))));
	} else if (type === "horizontal") {
		return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2News") ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel) }, BdApi.React.createElement("span", { className: FeedClasses.smallCarousel }, BdApi.React.createElement("div", { className: `${FeedClasses.articleSkeleton} ${FeedClasses.articleSimple} ${FeedClasses.article}` })));
	} else console.log(`Failed to get correct orientation! Here is the current value: ${type}`);
	return;
}

// activity_feed/components/application_news/components/SkeletonErrorBuilder.tsx
function FeedSkeletonErrorBuilder({ errorText, errorDescription }) {
	const type = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
	if (type === "vertical") {
		return BdApi.React.createElement("span", { className: FeedClasses.carousel }, BdApi.React.createElement("div", { className: `${FeedClasses.unavailable} ${FeedClasses.articleSkeleton} ${FeedClasses.article}` }, BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: { backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" }
			}
		)), BdApi.React.createElement("div", { className: FeedClasses.detailsContainer }, BdApi.React.createElement("div", { className: FeedClasses.details }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, errorText), errorDescription && BdApi.React.createElement("div", { className: FeedClasses.description }, errorDescription)))));
	} else if (type === "horizontal") {
		return BdApi.React.createElement("span", { className: FeedClasses.smallCarousel }, BdApi.React.createElement("div", { className: `${FeedClasses.unavailable} ${FeedClasses.articleSkeleton} ${FeedClasses.articleSimple} ${FeedClasses.article}` }, BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: { backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" }
			}
		)), BdApi.React.createElement("div", { className: FeedClasses.detailsContainer, style: { marginBottom: "40px" } }, BdApi.React.createElement("div", { className: FeedClasses.titleRowSimple }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, errorText)))));
	} else console.log(`Failed to get correct orientation! Here is the current value: ${type}`);
	return;
}

// activity_feed/components/application_news/components/Article.tsx
function FeedArticle(Article2) {
	return function WrappedComponent(props) {
		let id = props.article.application.id;
		if (isNaN(id)) id = void 0;
		const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: id });
		const orientation = betterdiscord.Hooks.useStateFromStores(NewsStore, () => NewsStore.getOrientation());
		return BdApi.React.createElement(Article2, { ...props, useGameProfile, orientation });
	};
}
class Article extends betterdiscord.React.PureComponent {
	static displayName = "FeedArticle";
	state;
	_animatedBackground = new Common.Animated.Value(0);
	_animatedText = new Common.Animated.Value(0);
	_zIndex = new Common.Animated.Value(1);
	constructor(article) {
		super(article);
		this.state = {
			getDirection: () => NewsStore.getDirection()
		};
	}
	componentWillEnter(e) {
		let direction = this.state.getDirection();
		this._zIndex.setValue(direction === 1 ? 2 : 1), direction === 1 && (this._animatedBackground.setValue(-1), Common.Animated.timing(this._animatedBackground, {
			toValue: 0,
			duration: 250,
			delay: 100
		}).start()), this._animatedText.setValue(-direction), Common.Animated.timing(this._animatedText, {
			toValue: 0,
			duration: 200,
			delay: 300
		}).start(e);
	}
	componentWillLeave(e) {
		let direction = this.state.getDirection();
		this._zIndex.setValue(direction === 1 ? 1 : 2), Common.Animated.timing(this._animatedText, {
			toValue: direction,
			duration: 200
		}).start(), direction === 1 ? setTimeout(e, 350) : Common.Animated.timing(this._animatedBackground, {
			toValue: -1,
			delay: 200,
			duration: 200
		}).start(e);
	}
	getRootStyle() {
		let anim = this.props.orientation === "horizontal" ? {
			translateX: this._animatedBackground.interpolate({
				inputRange: [0, 1],
				outputRange: ["0px", "-15px"]
			})
		} : {
			translateY: this._animatedBackground.interpolate({
				inputRange: [0, 1],
				outputRange: ["0px", "15px"]
			})
		};
		return Common.Animated.accelerate({
			transform: [{ scale: this._animatedBackground.interpolate({ inputRange: [-1, 0, 1], outputRange: [1.015, 1, 1.015] }) }, anim],
			opacity: this._animatedBackground.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0], easing: Common.Animated.Easing.in(Common.Animated.Easing.ease) }),
			zIndex: this._zIndex
		});
	}
	getTextStyle() {
		let anim = this.props.orientation === "horizontal" ? {
			translateX: this._animatedText.interpolate({
				inputRange: [0, 1],
				outputRange: ["0px", "-15px"]
			})
		} : {
			translateY: this._animatedText.interpolate({
				inputRange: [0, 1],
				outputRange: ["0px", "15px"]
			})
		};
		return {
			transform: [anim],
			opacity: this._animatedText.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0], easing: Common.Animated.Easing.in(Common.Animated.Easing.ease) }),
			zIndex: 1,
			marginBottom: this.props.orientation === "horizontal" ? "40px" : "0px"
		};
	}
	handleRightClick(e) {
		let currentArticle = this.props.article;
		return betterdiscord.ContextMenu.open(e, (props) => BdApi.React.createElement(FeedPopout, { ...props, application: currentArticle.application, gameId: currentArticle.id, articleUrl: currentArticle.news?.url }));
	}
	renderBackground() {
		let currentArticle = this.props.article;
		const thumbnail = currentArticle.news?.thumbnail?.replace(/\s/g, "%20");
		return BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: betterdiscord.Utils.className(FeedClasses.backgroundImage, !currentArticle.news?.thumbnail && FeedClasses.backgroundBackup),
				style: { backgroundImage: currentArticle.news?.thumbnail && `url(${thumbnail})` }
			}
		));
	}
	renderApplicationIcon() {
		let currentArticle = this.props.article;
		const External = settings.external[currentArticle.id];
		const useGameProfile = this.props.useGameProfile;
		return isNaN(currentArticle.news?.application_id) ? BdApi.React.createElement(External.icon, { className: FeedClasses.gameIcon, color: "WHITE", style: { backgroundColor: External.color, padding: "5px", width: "30px", height: "30px" } }) : BdApi.React.createElement(
			"img",
			{
				className: FeedClasses.gameIcon,
				onClick: useGameProfile,
				onMouseOver: (e) => Boolean(useGameProfile) && e.currentTarget.classList.add(FeedClasses.clickableIcon),
				onMouseLeave: (e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(FeedClasses.clickableIcon),
				src: currentArticle.news?.application_id && currentArticle.application?.icon ? `https://cdn.discordapp.com/app-icons/${currentArticle.news.application_id}/${currentArticle.application?.icon}.webp?size=64&keep_aspect_ratio=false` : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.news.application_id}/capsule_231x87.jpg`
			}
		);
	}
	render() {
		if (!this) return;
		let currentArticle = this.props.article;
		const simple = this.props.orientation === "horizontal";
		return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(FeedOverflowBuilder, { application: currentArticle.application, gameId: currentArticle.id, articleUrl: currentArticle.news?.url, position: "right" }), BdApi.React.createElement(
			"a",
			{
				tabindex: currentArticle.index,
				className: `${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`,
				href: currentArticle.news?.url || "#",
				rel: "noreferrer nopener",
				target: "_blank",
				role: "button"
			},
			BdApi.React.createElement(Common.Animated.div, { className: betterdiscord.Utils.className(simple ? FeedClasses.articleSimple : FeedClasses.articleStandard, FeedClasses.article), style: this.getRootStyle(), onContextMenu: (e) => this.handleRightClick(e) }, this.renderBackground(), BdApi.React.createElement(Common.Animated.div, { className: FeedClasses.detailsContainer, style: this.getTextStyle() }, BdApi.React.createElement("div", { className: FeedClasses.applicationArea }, this.renderApplicationIcon(), BdApi.React.createElement("div", { className: simple ? FeedClasses.titleRowSimple : FeedClasses.details }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, currentArticle.news?.title || "No Title"), !simple && BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: FeedClasses.description, dangerouslySetInnerHTML: { __html: currentArticle.news?.description || "No description available." } }), BdApi.React.createElement("div", { className: FeedClasses.timestamp }, Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), { dateStyle: "long" })))))))
		));
	}
}
const NewsArticle = FeedArticle(Article);

// activity_feed/components/application_news/FeedBuilder.tsx
function NewsFeedBuilder() {
	const articles = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getFeedsForDisplay());
	const currentArticle = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle());
	const orientation = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
	const isIdling = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling());
	const [time, setTime] = react.useState(new Date());
	const [waitTime, setWaitTime] = react.useState(true);
	react.useEffect(() => {
		const delay = setTimeout(() => setWaitTime(false), 1e4);
		return clearTimeout.bind(null, delay);
	}, [setWaitTime]);
	const timerCallback = useEffectEvent(() => {
		const newTime = Math.floor((Math.floor((new Date()).getTime()) - Math.floor(time.getTime())) / 1e3);
		if (newTime > 0 && articles) {
			if (Math.floor(newTime) % 8 == 0 && isIdling) {
				NewsStore.setCurrentArticle(currentArticle.index === 3 ? currentArticle.index - 3 : currentArticle.index + 1);
			}
		}
	});
	react.useEffect(() => clearInterval.bind(null, setInterval(timerCallback, 8e3)), []);
	if (waitTime && !Object.keys(articles).length) {
		return BdApi.React.createElement(FeedSkeletonBuilder, null);
	}
	switch (betterdiscord.Data.load("freezeNews") ?? Number(settings.default.freezeNews)) {
		case 0:
			break;
		case 1:
			return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2News") ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel) }, BdApi.React.createElement(
				FeedSkeletonErrorBuilder,
				{
					errorText: locale.Strings.ACTIVITY_FEED_UNAVAILABLE(),
					errorDescription: "If you're seeing this, you've manually triggered this error. Welcome to the club!"
				}
			));
		case 2:
			return BdApi.React.createElement(FeedSkeletonBuilder, null);
	}
	if (Object.keys(articles).length) return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2News") ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel), onMouseOver: () => {
		NewsStore.setIdling(false);
		setTime(new Date());
	}, onMouseLeave: () => {
		NewsStore.setIdling(true);
		setTime(new Date());
	} }, orientation === "vertical" ? BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(Common.TransitionGroup, { component: "span", className: FeedClasses.carousel, transitionEnter: true, transitionAppear: true, transitionLeave: true }, BdApi.React.createElement(NewsArticle, { article: currentArticle, key: `${currentArticle.index}` })), BdApi.React.createElement(FeedPaginationBuilder, { articleSet: articles })) : orientation === "horizontal" ? BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(Common.TransitionGroup, { component: "span", className: FeedClasses.smallCarousel, transitionEnter: true, transitionAppear: true, transitionLeave: true }, BdApi.React.createElement(NewsArticle, { article: currentArticle, key: `${currentArticle.index}` })), BdApi.React.createElement(FeedMiniPaginationBuilder, { articleSet: articles, currentArticle })) : BdApi.React.createElement(
		FeedSkeletonErrorBuilder,
		{
			errorText: locale.Strings.ACTIVITY_FEED_UNAVAILABLE(),
			errorDescription: locale.Strings.ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_GENERIC()
		}
	)));
	return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2News") ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel) }, BdApi.React.createElement(
		FeedSkeletonErrorBuilder,
		{
			errorText: locale.Strings.ACTIVITY_FEED_UNAVAILABLE(),
			errorDescription: locale.Strings.ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_NO_DATA()
		}
	));
}

// activity_feed/common/components/SectionHeader.tsx
const SectionHeader = ({ label }) => {
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, className: MainClasses.headerContainer, justify: Common.Flex.Justify.BETWEEN }, BdApi.React.createElement("div", { className: MainClasses.headerText }, label));
};

// activity_feed/components/quick_launcher/QuickLauncher.module.css
const css$3 = `
.quickLauncher__1ffe5 {
		display: block;
}

.dock__1ffe5 {
		margin-top: 10px;
		display: flex;
		overflow: hidden;
		flex-wrap: wrap;
		max-height: 100px;
		max-width: 1280px;
}

.dockItem__1ffe5 {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: pointer;
		height: 100px;
		padding: 10px;
		width: 90px;
}

.dockIcon__1ffe5:first-child {
		margin-left: 0;
}

.dockIcon__1ffe5 {
		background-size: 100%;
		border-radius: 3px;
		height: 40px;
		margin-bottom: 8px;
		transition: opacity .2s ease-in-out;
		width: 40px;
}

.dockIcon__1ffe5.dockIconDisabled__1ffe5 {
		cursor: not-allowed;
		opacity: 0.2;
}

.dockItemText__1ffe5 {
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

.dockItemPlay__1ffe5 {
		display: none;
		z-index: 9999;
}

.dockItemPlay__1ffe5:disabled, .dockItemPlay__1ffe5[aria-disabled=true] {
		background-color: var(--green-active, var(--button-positive-background-active)) !important;
}

.dockItem__1ffe5:hover {
		background: var(--background-base-lowest);
}

.dockItem__1ffe5:hover .dockItemText__1ffe5 {
		display: none;
}

.dockItem__1ffe5:hover .dockItemPlay__1ffe5 {
		display: flex;
}

.emptyIcon__1ffe5 {
		height: 24px;
		margin-right: 8px;
		width: 24px;
}

.dockV2__1ffe5 {
	margin-top: var(--space-lg);
		.dockItem__1ffe5 {
				border-radius: var(--radius-md);
				&:hover {
						background: var(--interactive-background-hover);
						outline: 1px solid var(--border-normal);
						outline-offset: -1px;
				}
		}
		.dockIcon__1ffe5 {
				border-radius: var(--radius-sm);
		}
		.emptyIcon__1ffe5 {
				margin-right: 10px;
				flex-shrink: 0;
		}
}`;
_loadStyle("QuickLauncher.module.css", css$3);
const modules_1116a9ae = {
	"quickLauncher": "quickLauncher__1ffe5",
	"dock": "dock__1ffe5",
	"dockItem": "dockItem__1ffe5",
	"dockIcon": "dockIcon__1ffe5",
	"dockIconDisabled": "dockIconDisabled__1ffe5",
	"dockItemText": "dockItemText__1ffe5",
	"dockItemPlay": "dockItemPlay__1ffe5",
	"emptyIcon": "emptyIcon__1ffe5",
	"dockV2": "dockV2__1ffe5"
};
const QuickLauncherClasses = modules_1116a9ae;

// activity_feed/components/quick_launcher/launcher.tsx
function PlayPopout({ close, launcher, game, state }) {
	const setDisable = state;
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: game?.id });
	return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "launcher-context-menu", onClose: close }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "play-game", label: locale.Strings.PLAY_GAME(), action: () => {
		setDisable(true);
		launcher();
	} }), BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "open-game-profile", label: locale.Strings.OPEN_GAME_PROFILE(), action: useGameProfile, disabled: !useGameProfile }), UserSettingsProtoStore.settings.appearance.developerMode && BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-app-id", label: locale.Strings.COPY_APPLICATION_ID(), action: () => Common.Clipboard(game.id) }));
}
function LauncherGameBuilder({ game, runningGames }) {
	const [shouldDisable, setDisable] = react.useState(false);
	react.useEffect(() => {
		const delay = setTimeout(() => setDisable(false), 1e4);
		return clearTimeout.bind(null, delay);
	});
	const disableCheck = react.useMemo(() => ~runningGames.findIndex((m) => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
	const fullGame = GameStore.getDetectableGame(GameStore.searchGamesByName(game.name)[0]);
	const skuViaGame = fullGame.thirdPartySkus;
	const isSteam = Object.values(skuViaGame).find((x) => x.distributor.toLowerCase().includes("steam"));
	const canPlay = Common.IsGameLaunchable({ LibraryApplicationStore, LaunchableGameStore, DispatchApplicationStore, ConnectedAppsStore, applicationId: fullGame.id });
	const libraryApplication = new Common.BasicLibraryApplication({ fullGame });
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: fullGame?.id ?? game?.id });
	const refDOM = react.useRef(null);
	const [showPopout, setShowPopout] = react.useState(false);
	function openGame() {
		const items = game.exePath.split("/");
		switch (true) {
			case !!canPlay:
				Common.LibraryApplicationUtils.playApplication(game?.id, libraryApplication, {});
				break;
			case (!!!!isSteam && ["steamapps", "steamlibrary"].some((item) => items.includes(item))):
				shell.openExternal(`steam://run/${isSteam.id}`);
				break;
			default:
				shell.openExternal(game.exePath);
		}
	}
	return BdApi.React.createElement(
		Common.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(PlayPopout, { close: () => setShowPopout(false), launcher: openGame, game: fullGame, state: setDisable }),
			position: "right",
			shouldShow: showPopout
		},
		(props) => BdApi.React.createElement(Common.Flex, { ...props, align: Common.Flex.Align.CENTER, className: QuickLauncherClasses.dockItem, direction: Common.Flex.Direction.VERTICAL, onClick: (e) => e.shiftKey && !disableCheck && setShowPopout(true), ref: refDOM, style: { flex: "0 0 auto" } }, BdApi.React.createElement("div", { className: betterdiscord.Utils.className(QuickLauncherClasses.dockIcon, disableCheck && QuickLauncherClasses.dockIconDisabled), style: { backgroundImage: `url(${"https://cdn.discordapp.com/app-icons/" + fullGame.id + "/" + fullGame.icon + ".webp?size=56"})` }, onClick: useGameProfile }), BdApi.React.createElement("div", { className: QuickLauncherClasses.dockItemText }, game.name), BdApi.React.createElement(
			"button",
			{
				className: `${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`,
				disabled: disableCheck,
				onClick: () => {
					setDisable(true);
					openGame();
				}
			},
			BdApi.React.createElement("div", { className: `${Common.ButtonVoidClasses.contents}` }, locale.Strings.PLAY())
		))
	);
}
function LauncherEmptyBuilder() {
	return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2Dock") ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock, MainClasses.emptyState) }, BdApi.React.createElement("svg", { className: QuickLauncherClasses.emptyIcon, name: "OpenExternal", width: 16, height: 16, viewBox: "0 0 24 24" }, BdApi.React.createElement("path", { fill: "currentColor", transform: "translate(3, 4)", d: "M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" })), BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.QUICK_LAUNCHER_EMPTY()));
}
function QuickLauncherBuilder(props) {
	const runningGames = useStateFromStores([RunningGameStore], () => RunningGameStore.getRunningGames());
	const gameList = useStateFromStores([RunningGameStore], () => RunningGameStore.getGamesSeen());
	const _gameList = gameList.filter((game) => GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0])).slice(0, 14);
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: locale.Strings.QUICK_LAUNCHER() }), gameList.length === 0 || (betterdiscord.Data.load("freezeDock") ?? settings.default.freezeDock) ? BdApi.React.createElement(LauncherEmptyBuilder, null) : BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2Dock") ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock) }, _gameList.map((game) => BdApi.React.createElement(LauncherGameBuilder, { game, runningGames, key: game.id }))));
}

// activity_feed/components/now_playing/activities/components/common/ActivityButtons.tsx
const themeContext = betterdiscord.Webpack.getMangled(betterdiscord.Webpack.Filters.bySource("themePreferenceForSystemTheme", "createContext"), {
	ClientThemeContext: betterdiscord.Webpack.Filters.byStrings("useContext")
});
const activityAuth = betterdiscord.Webpack.getByStrings("alpha2", "embeddedActivityConfig", { searchExports: true });
const activityIdCheck = betterdiscord.Webpack.getBySource("{return!!(0", ")(e)}}", { searchExports: true });
const getCTA = betterdiscord.Webpack.getByStrings("ctaConfig", "flatMap");
const fetchAuthorization = betterdiscord.Webpack.getByStrings("parentId", "disableFetch", { searchExports: true });
const CloudPlayButton = betterdiscord.Webpack.getByStrings('"PRESS_CLOUD_PLAY_BUTTON"');
const isEmbeddedActivity = betterdiscord.Webpack.getByStrings(".EMBEDDED", "{return(0,");
const isSupportedPlatform = betterdiscord.Webpack.getByStrings("META_QUEST", "supported_platforms");
const CTAButton = betterdiscord.Webpack.getByStrings("distributorCTAConfigs", "PLAY_CTA_DISPLAYED");
const isNonConsole = betterdiscord.Webpack.getByStrings(".CUSTOM_STATUS&&(null");
const isXbox = betterdiscord.Webpack.getByStrings("platform===", ".XBOX");
const isPlayStation = betterdiscord.Webpack.getByStrings("platform===", ".PS5");
const XboxIcon = betterdiscord.Webpack.getByStrings("M8.95185131");
const PlayStationIcon = betterdiscord.Webpack.getByStrings("M17.7516");
const isStream = betterdiscord.Webpack.getByStrings("Array.isArray(e)?e.some(");
const isJoinable = betterdiscord.Webpack.getByStrings("JOIN)&&", "&&!!(0,", { searchExports: true });
const isInstance = betterdiscord.Webpack.getByStrings(".INSTANCE&&null!=e");
const isStageChannel = betterdiscord.Webpack.getByStrings("e?.application_id===", "SS", { searchExports: true });
const ActivityMetadataUpdate = betterdiscord.Webpack.getByStrings("USER_ACTIVITY_METADATA", "ACTIVITY_METADATA_UPDATE", { searchExports: true });
const Parser = betterdiscord.Webpack.getByKeys("formatPathWithQuery");
const sanitize = betterdiscord.Webpack.getByStrings("sanitizeUrl", "contextKey", { searchExports: true });
const ChannelContext = betterdiscord.Webpack.getByStrings(".POPOUT", "onClose", "contextless");
const joinProps = betterdiscord.Webpack.getByStrings("DispatchApplicationStore", "embeddedActivity", { searchExports: true });
const getPlayableGame = betterdiscord.Webpack.getByStrings("data", "getOfficialGame", ":null!", { searchExports: true });
const SlashCommandIcon = betterdiscord.Webpack.getByStrings("7.61c-.25.95.31", { searchExports: true });
const GameUtils = betterdiscord.Webpack.getByKeys("launch", "reportUnverifiedGame");
const ContainerTooltip = betterdiscord.Webpack.getByStrings("asContainer", "keyboardShortcut", { searchExports: true });
const DoorExitIcon = betterdiscord.Webpack.getByStrings('"string"==typeof', "18.5V22a1", { searchExports: true });
const GameControllerIcon = betterdiscord.Webpack.getByStrings(".09v4.91a3.09", { searchExports: true });
const ControllerLinkIcon = betterdiscord.Webpack.getByStrings("2.4l.57-.58a.74.74", "14.99a3.17");
const getTrack = betterdiscord.Webpack.getByStrings("USER_ACTIVITY_PLAY", "spotifyData", { searchExports: true });
const getTrackSync = betterdiscord.Webpack.getByStrings("USER_ACTIVITY_SYNC", "spotifyData", { searchExports: true });
const hasParty = betterdiscord.Webpack.getByStrings("LISTENING", "SPOTIFY).name", { searchExports: true });
const SpotifyIcon = betterdiscord.Webpack.getByStrings("M12.7609503,7.08043507", { searchExports: true });
const ListenAlongIcon = betterdiscord.Webpack.getByStrings("0Zm-2.77-.2-3.33-2.5a.25", "className", { searchExports: true });
function WidgetButton({ applicationId, onAction, onClose }) {
	return;
}
async function ParseCustomButton({ activity, user, index }) {
	try {
		const request = await ActivityMetadataUpdate(activity, user.id);
		if (request.button_urls.length <= index) return;
		const url = request.button_urls[index];
		if ("string" != typeof url) return;
		const parsed = Parser.safeParseWithQuery(url);
		if (!parsed?.protocol || !parsed?.hostname) return;
		sanitize({ href: Parser.format(parsed), trusted: 0 });
	} catch (e) {
	}
}
function CustomButton({ user, activity, onAction }) {
	const { themeType } = themeContext.ClientThemeContext();
	if (!activity?.buttons || activity.buttons.length < 1) return;
	const isCrunchyroll = activity?.application_id === "981509069309354054";
	return themeType === "MODAL_V2" ? BdApi.React.createElement("div", { className: Common.ActivityCardClasses.customButtons }, activity.buttons.map((button, index) => BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			text: isCrunchyroll ? locale.Strings.WATCH() : button,
			onClick: (e) => {
				e.stopPropagation();
				onAction?.({
					action: isCrunchyroll ? "PRESS_WATCH_ON_CRUNCHYROLL_BUTTON" : "PRESS_CUSTOM_BUTTON"
				})();
				ParseCustomButton({ user, activity, index });
			}
		}
	))) : BdApi.React.createElement("div", { className: Common.ActivityCardClasses.customButtons }, activity.buttons.map((button, index) => BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			text: isCrunchyroll ? locale.Strings.WATCH() : button,
			fullWidth: true,
			onClick: (e) => {
				e.stopPropagation();
				onAction?.({
					action: isCrunchyroll ? "PRESS_WATCH_ON_CRUNCHYROLL_BUTTON" : "PRESS_CUSTOM_BUTTON"
				});
				ParseCustomButton({ user, activity, index });
			}
		}
	)));
}
function ConnectAccountButton({ startAuthorization, onAction }) {
	const { themeType } = themeContext.E();
	const isModalV2 = themeType === "MODAL_V2";
	return BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			icon: () => BdApi.React.createElement(ControllerLinkIcon, { color: "currentColor" }),
			text: locale.Strings.CONNECT_ACCOUNT(),
			fullWidth: !isModalV2,
			onClick: (e) => {
				e.stopPropagation();
				onAction?.({ action: "PRESS_CONNECT_ACCOUNT_BUTTON" });
				startAuthorization({});
			}
		}
	);
}
function ConsoleButton({ platformType, icon, onAction }) {
	return;
}
function WatchStreamButton({ activity, onAction }) {
	themeContext.ClientThemeContext();
	return;
}
function PlayButton({ user, activity, onAction, onClose }) {
	const { themeType } = themeContext.ClientThemeContext();
	const channelContext = ChannelContext({ applicationId: activity?.application_id, onClose });
	const isJoinable2 = joinProps({ activity, user, onClose });
	const isPlayable = getPlayableGame(activity?.application_id);
	if (!isJoinable2 && activity && isEmbeddedActivity(activity)) return BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			icon: BdApi.React.createElement(SlashCommandIcon, null),
			text: locale.Strings.PLAY(),
			fullWidth: themeType !== "MODAL_V2",
			onClick: (e) => {
				e.stopPropagation();
				isPlayable ? GameUtils.launch({ applicationId: isPlayable }) : onAction?.({ action: "PRESS_PLAY_BUTTON" });
				channelContext();
			}
		}
	);
	if (!isJoinable2) return;
	const { isJoining, handleJoinRequest, buttonCTA, tooltip, isEnabled, isEmbedded } = isJoinable2;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(ContainerTooltip, { text: tooltip, asContainer: !isEnabled }, BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			icon: isEmbedded ? BdApi.React.createElement(DoorExitIcon, null) : BdApi.React.createElement(GameControllerIcon, null),
			text: buttonCTA,
			disabled: !isEnabled,
			loading: isJoining,
			fullWidth: themeType !== "MODAL_V2",
			onClick: (e) => {
				e.stopPropagation();
				onAction?.({ action: isEmbedded ? "PRESS_JOIN_BUTTON" : "PRESS_ASK_TO_JOIN_BUTTON" });
				handleJoinRequest();
			}
		}
	)));
}
function NotifyButton({ user, activity, onAction }) {
	themeContext.ClientThemeContext();
	return;
}
function StageChannelListenButton({ activity, onAction, onClose }) {
	themeContext.ClientThemeContext();
	return;
}
function ActivityButtons({ user, activity, onAction, onClose, application, containerClassName }) {
	const { themeType } = themeContext.ClientThemeContext();
	const isSelf = useStateFromStores([UserStore], () => UserStore.getCurrentUser().id === user.id);
	const hasConfig = activityAuth(application);
	const idCheck = activityIdCheck.o(activity?.application_id ?? application?.id);
	const ctaButtons = getCTA(activity?.application_id);
	const { fetched, canStartAuthorization, hasAlreadyLinked, startAuthorization } = fetchAuthorization(application);
	const isModal = themeType === "MODAL" || themeType === "MODAL_V2";
	const isPopout = themeType === "POPOUT";
	const buttons = (() => {
		if (isSelf) return isPopout && activity?.type === 0 && application?.id ? BdApi.React.createElement(
			WidgetButton,
			{
				applicationId: application.id,
				onAction,
				onClose
			}
		) : null;
		if (activity?.buttons && activity?.buttons.length >= 1) return BdApi.React.createElement(
			CustomButton,
			{
				user,
				activity,
				onAction
			}
		);
		if (!idCheck && hasConfig && application && !isModal) return BdApi.React.createElement(
			CloudPlayButton.A,
			{
				application,
				onAction,
				onClose
			}
		);
		if (isEmbeddedActivity(activity) || isSupportedPlatform(activity) && idCheck) return BdApi.React.createElement(
			PlayButton,
			{
				user,
				activity,
				onAction,
				onClose
			}
		);
		if (fetched && canStartAuthorization && !hasAlreadyLinked) return BdApi.React.createElement(
			ConnectAccountButton,
			{
				startAuthorization,
				onAction
			}
		);
		if (ctaButtons.length > 0) return BdApi.React.createElement(
			CTAButton,
			{
				distributorCTAConfigs: ctaButtons,
				fullWidth: themeType !== "MODAL_V2",
				stopPropagation: true,
				onAction,
				onClose
			}
		);
		if (!isNonConsole(activity)) {
			if (isXbox(activity)) return BdApi.React.createElement(
				ConsoleButton,
				{
					platformType: "xbox",
					icon: () => BdApi.React.createElement(XboxIcon, null),
					onAction
				}
			);
			if (isPlayStation(activity)) return BdApi.React.createElement(
				ConsoleButton,
				{
					platformType: "playstation",
					icon: () => BdApi.React.createElement(PlayStationIcon, null),
					onAction
				}
			);
		}
		return isStream(activity) ? BdApi.React.createElement(
			WatchStreamButton,
			{
				activity,
				onAction
			}
		) : isJoinable(activity) ? BdApi.React.createElement(
			PlayButton,
			{
				user,
				activity,
				onAction,
				onClose
			}
		) : isInstance(activity, 1) ? BdApi.React.createElement(
			NotifyButton,
			{
				user,
				activity,
				onAction
			}
		) : isStageChannel(activity) ? BdApi.React.createElement(
			StageChannelListenButton,
			{
				activity,
				onAction,
				onClose
			}
		) : null;
	})();
	return !buttons ? null : BdApi.React.createElement("div", { className: containerClassName }, buttons);
}
function SpotifyButtons({ user, activity, onAction }) {
	const { themeType } = themeContext.ClientThemeContext();
	const track = getTrack(activity, user);
	const trackSync = getTrackSync(activity, user);
	if (!hasParty(activity) || !isInstance(activity, 32) && !isInstance(activity, 16)) return;
	const handleListenAlongOnClick = (e) => {
		e.stopPropagation();
		onAction?.({ action: "PRESS_LISTEN_ALONG_ON_SPOTIFY_BUTTON" });
		trackSync.onClick();
	};
	const handlePlayOnClick = (e) => {
		e?.stopPropagation();
		onAction?.({ action: "PRESS_PLAY_ON_SPOTIFY_BUTTON" });
		track.onClick();
	};
	return themeType === "MODAL_V2" ? BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(ContainerTooltip, { text: trackSync.tooltip }, BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			text: trackSync.label ?? locale.Strings.LISTEN_ALONG(),
			onClick: handleListenAlongOnClick,
			disabled: trackSync.disabled,
			loading: trackSync.loading
		}
	)), BdApi.React.createElement(ContainerTooltip, { text: track.tooltip }, BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			text: track.label ?? locale.Strings.PLAY_ON_SPOTIFY(),
			onClick: handlePlayOnClick,
			disabled: track.disabled,
			loading: track.loading
		}
	))) : BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: Common.ActivityCardClasses.primaryButton }, BdApi.React.createElement(ContainerTooltip, { text: track.tooltip }, BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			icon: () => BdApi.React.createElement(SpotifyIcon, null),
			text: track.label ?? locale.Strings.PLAY_ON_SPOTIFY(),
			onClick: handlePlayOnClick,
			disabled: track.disabled,
			loading: track.loading,
			fullWidth: true
		}
	))), BdApi.React.createElement(
		ManaButtons.IconOnlyButton,
		{
			icon: () => BdApi.React.createElement(ListenAlongIcon, { color: "currentColor" }),
			tooltipText: trackSync.tooltip ?? locale.Strings.LISTEN_ALONG(),
			ariaLabel: trackSync.label ?? locale.Strings.LISTEN_ALONG(),
			disabled: trackSync.disabled,
			loading: trackSync.loading,
			fullWidth: true
		}
	));
}
const handleGameProfileClick = betterdiscord.Webpack.getByStrings("stopPropagation", "gameProfileModalChecks", "onOpened");
const handleEmbeddedApplicationClick = betterdiscord.Webpack.getByStrings("POPOUT", '"contextless"');
const isPlayingActivity = betterdiscord.Webpack.getByStrings("entry", "PLAYING", "sourceUserId", { searchExports: true });
const isTypePlayingActivity = betterdiscord.Webpack.getByStrings(".PLAYING}");
function handleApplicationClick({ user, currentUser, activity, application, onClose }) {
	const gameId = GameStore.searchGamesByName(application?.name)?.[0];
	const openGameProfile = betterdiscord.ReactUtils.wrapInHooks(handleGameProfileClick)({ trackEntryPointImpression: false, gameId, ...isPlayingActivity({ activity, user }) });
	const openEmbeddedAppProfile = betterdiscord.ReactUtils.wrapInHooks(handleEmbeddedApplicationClick)({ applicationId: activity?.application_id });
	const isEmbedded = isEmbeddedActivity(activity);
	const isTypePlaying = isTypePlayingActivity(activity);
	const isCrunchyroll = activity?.application_id === "981509069309354054";
	return isEmbedded && !application ? openEmbeddedAppProfile : !isEmbedded && isTypePlaying ? openGameProfile : isCrunchyroll && user.id !== currentUser.id ? () => ParseCustomButton({ user, activity, index: 0 }) : null;
}

// activity_feed/components/now_playing/NowPlaying.module.css
const css$2 = `
.nowPlaying__93528, .whatsNew__93528 {}

.nowPlayingContainer__93528 {
		display: flex;
		margin-top: var(--space-lg);
		gap: var(--space-lg);
}

.nowPlayingColumn__93528 {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: calc(50% - (var(--space-lg) / 2))
}

.nowPlayingContainer__93528 .itemCard__93528 {
		flex: 1 0 0;
		margin: 16px 16px 0 0;
}

.card__93528 {
		border-radius: 5px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
		transform: translateZ(0);
}
		
.cardHeader__93528 {
		padding: 20px;
		position: relative;
		flex-direction: row;
		background: var(--background-base-lowest);
}

.header__93528 {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
}

.avatar__93528 {
		margin-right: 20px;
		transition: opacity .2s ease;
		cursor: pointer;
}

.avatar__93528:hover {
		opacity: 0.8;
}

.applicationStreamingAvatar__93528 {}

.lastPlayedAvatar__93528 {}

.nameTag__93528 {
		line-height: 17px;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;
		color: var(--text-default);
}

.username__93528 {
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

.username__93528:hover {
		text-decoration: underline;
}

.header__93528 .gameIcon__93528 {
		margin-right: 20px;
}

.headerTitle__93528 {
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
}

.card__93528:hover .headerIcon__93528, .header__93528:has(.headerActions__93528[aria-expanded="true"]) .headerIcon__93528 {
		display: none;
}

.headerActions__93528 {
		display: none;
		margin-left: 8px;
}

.card__93528:hover .headerActions__93528, .headerActions__93528[aria-expanded="true"] {
		display: flex;
}

.overflowMenu__93528 {
		cursor: pointer;
		height: 24px;
		margin-left: 8px;
		transition: opacity .2s linear;
		width: 24px;
		color: var(--interactive-icon-hover);
}

.overflowMenu__93528:hover {
		color: var(--interactive-icon-default);
}

.headerIcon__93528 {
		border-radius: 4px;
		display: block;
		height: 30px;
		justify-self: end;
		width: 30px;
}

.gameIcon__93528 {
		border-radius: 4px;
}

.clickableIcon__93528 {
		opacity: 0.8;
		cursor: pointer;
}
.clickableText__93528 {
		text-decoration: underline;
		cursor: pointer;
}

.splashArt__93528 {
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

.server__93528 {
		mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
		right: 0;
		left: unset;
}

.cardBody__93528 {
		display: flex;
		flex-direction: column;
		padding: 0 20px;
		background: var(--background-mod-strong);
}

.whatsNew__93528 .cardBody__93528 {
		padding: 20px 20px 0;
}

.section__93528 {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

.section__93528:last-child:not(:only-child) {
		padding-bottom: 20px;
}

.sectionTitleWrapper__93528 {
		align-items: center;
		display: flex;
		flex: 1 1 auto;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		color: var(--text-default);
}

.sectionTitle__93528 {
		font-size: 12px;
		font-weight: 500;
		text-transform: uppercase;
}

.sectionLine__93528 {
		-webkit-box-flex: 1;
		flex: 1;
		height: 1px;
		margin: unset !important;
		margin-left: 20px !important;
}

.game__93528 {
		padding: 20px 0;
}

.gameBody__93528 {
		flex-direction: column;
}

.activityContainer__93528 {}

.activity__93528 {
		flex-direction: row;
}

.activity__93528:last-child:not(:only-child) {
		margin-top: 20px;
}

.activity__93528 .serviceButtonWrapper__93528 {
		gap: 6px;
		display: flex;
		flex-direction: row;
}

.richActivity__93528 {
		margin-top: 20px;
}

.activityActivityFeed__93528 {}

.activityFeed__93528 {
		-webkit-box-flex: 1;
		flex: 1 1 50%;
		min-width: 0;
}

.body__93528 {}

.bodyNormal__93528 {}

:is(.gameInfoRich__93528, .gameNameWrapper__93528) {
		-webkit-box-flex: 1;
		display: flex;
		flex: 1;
}

.gameInfoRich__93528 {
		align-items: center;
}

.gameInfo__93528 {
		margin-left: 20px;
		min-width: 0;
		color: var(--text-default);
		font-weight: 500;
		flex: 1;
}

:is(.gameName__93528, .gameNameWrapper__93528, .streamInfo__93528) {
		overflow: hidden;
}

.gameName__93528 {
		font-size: 16px;
		line-height: 20px;
		margin-right: 10px;
		max-width: fit-content;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.gameName__93528.clickable__93528:hover {
		text-decoration: underline;
}

.playTime__93528:not(a) {
		color: var(--text-muted);
}
.playTime__93528 {
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.assets__93528 {
		position: relative;
}

.assetsLargeImageActivityFeed__93528 {
		width: 90px;
		height: 90px;
}

.assetsSmallImageActivityFeed__93528 {
		height: 30px;
		width: 30px;
}

.assets__93528 .assetsLargeImage__93528 {
		display: block;
		border-radius: 4px; 
		object-fit: cover;
}

.assets__93528 .assetsLargeImageActivityFeedTwitch__93528 {
		border-radius: 5px;
		min-height: 260px;
		mask: linear-gradient(0deg, transparent 10%, #000 80%);
		width: 100%;
		-webkit-user-drag: none;
}

.assets__93528:has(.assetsSmallImage__93528) .assetsLargeImage__93528 {
		mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
}

.richActivity__93528 .assetsSmallImage__93528, .richActivity__93528 .smallEmptyIcon__93528 {
		border-radius: 50%;
		position: absolute;
		bottom: -4px;
		right: -4px; 
}

.activity__93528 .smallEmptyIcon__93528 {
		width: 40px;
		height: 40px;
}

.assets__93528 .largeEmptyIcon__93528 {
		width: 90px;
		height: 90px;
}

.assets__93528 .largeEmptyIcon__93528 path {
		transform: scale(3.65) !important;
}

.richActivity__93528 svg.assetsSmallImage__93528 {
		border-radius: unset !important;
}   

.richActivity__93528 .smallEmptyIcon__93528 path {
		transform: scale(1.3) !important;
}

.assets__93528 .twitchImageContainer__93528 {
		background: var(--background-secondary-alt);
		border-radius: 5px;
		position: relative;
}

.assets__93528 .twitchBackgroundImage__93528 {
		display: inline-block;
		min-height: 260px;
}

.assets__93528 .twitchImageOverlay__93528 {
		bottom: 0;
		left: 0;
		padding: 16px;
		position: absolute;
		right: 0;
}

.assets__93528 .streamName__93528 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
		margin-top: 8px;
}

.assets__93528 .streamGame__93528 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
		margin-top: 8px;
		text-transform: uppercase;
}

.contentImagesActivityFeed__93528 {
		margin-left: 20px;
		color: var(--text-default);
}

:is(.gameInfo__93528, .contentImagesActivityFeed__93528) {
		align-self: center;
		display: grid;
}

.content__93528 {
		flex: 1;
		overflow: hidden;
}

.contents__93528 {
		color: var(--text-strong);
		margin: 0 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.details__93528 {
		font-weight: 600;
}

.ellipsis__93528 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.textRow__93528 {
		color: var(--text-default);
		display: block;
		font-size: 14px;
		line-height: 16px;
		margin-bottom: 4px;
}

.voiceSection__93528 {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
}

.voiceSectionAssets__93528 {
		align-items: center;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

.voiceSectionIconWrapper__93528 {
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

.voiceSectionIcon__93528 {
		color: var(--text-default);
		height: 12px;
		width: 12px;
}

.voiceSectionGuildImage__93528 {
		border-radius: 50%;
		mask: url('https://discord.com/assets/a90b040155ee449f.svg');
		mask-size: 100%;
		mask-type: luminance;
}

.voiceSection__93528 .details__93528 {
		flex: 1;
}

.voiceSectionDetails__93528 {
		cursor: pointer;
		margin-left: 20px;
		min-width: 0;
}

.voiceSectionDetails__93528:hover :is(.voiceSectionText__93528, .voiceSectionSubtext__93528) {
		text-decoration: underline;
}

.voiceSectionText__93528 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2857142857142858;
}

.voiceSectionSubtext__93528 {
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3333333333333333;
}

.userList__93528 {
		flex: 0 1 auto;
		justify-content: flex-end;
}

.voiceSection__93528 button {
		flex: 0 1 auto !important;
		width: auto !important;
		margin-left: 20px;
}

.streamSection__93528 {
		position: relative;
}

.applicationStreamingSection__93528 {
		display: grid;
		grid-template-columns: 32px minmax(20px, auto) max-content;
		-webkit-box-align: center;
		align-items: center;
		gap: 12px 12px;
}

.applicationStreamingDetails__93528 {
		margin-left: 16px;
		min-width: 0;
}

.theme-dark .applicationStreamingPreviewWrapper__93528 {
		background-color: var(--background-mod-strong);
}

.theme-light .applicationStreamingPreviewWrapper__93528 {
		background-color: var(--interactive-background-default);
}

.applicationStreamingPreviewWrapper__93528 {
		margin-top: 12px;
		cursor: pointer;
		border-radius: 4px;
		position: relative;
}

.applicationStreamingPreviewSize__93528 {
		height: 100%;
		width: 100%;
}

.applicationStreamingPreview__93528 {
		width: 100%;
		height: 100%;
		object-fit: contain;
}

.applicationStreamingHoverWrapper__93528 {
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

.applicationStreamingHoverWrapper__93528:hover {
		opacity: 1;
}

.applicationStreamingHoverText__93528 {
		color: var(--white);
		font-size: 16px;
		font-weight: 600;
		line-height: 20px;
		background: rgba(0, 0, 0, 0.6);
		padding: 8px 20px;
		border-radius: 20px;
}

.emptyPreviewContainer__93528 {
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

.emptyPreviewImage__93528 {
		width: 80%;
		height: 60%;
		margin-bottom: 10px;
		background-position: 50% center;
		background-repeat: no-repeat;
}

.emptyPreviewText__93528 {
		color: var(--text-default);
}

.inner__93528 {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
}

.actionsActivityFeed__93528 .buttonContainer__93528 {
		flex-direction: inherit;
}

.partyStatusWrapper__93528 {
		display: flex;
		gap: 4px;
		align-items: center;
}

.partyStatusWrapper__93528 button {
		flex: 0 1 50% !important;
		max-height: 24px;
		min-height: 24px !important;
		width: auto !important;
		justify-self: flex-end;
}

.partyList__93528 {
		display: flex;
}

.player__93528:first-of-type {
		mask: url(#svg-mask-voice-user-summary-item);
}

.userOverflow__93528 {
		display: flex;
		flex-wrap: wrap;
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		align-content: center;
		justify-content: center;
		margin-right: 8px;
}

.emptyUser__93528:not(:first-of-type), .player__93528:not(:first-of-type) {
		margin-left: -4px;
}

.emptyUser__93528:not(:last-of-type), .player__93528:not(:last-of-type) {
		mask: url(#svg-mask-voice-user-summary-item);
}

.emptyUser__93528, .player__93528 {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--experimental-avatar-embed-bg);
}

.emptyUser__93528 svg {
		margin-left: 3px;
}

.partyPlayerCount__93528 {
		color: var(--app-message-embed-secondary-text);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3333333333333333;
		margin-top: 1px;
}

.lastPlayedSection__93528 {}

.lastPlayedPlayer__93528 {
		align-items: stretch;
		border-bottom: 1px solid transparent;
		display: flex;
		flex: 1 1 auto;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		padding-bottom: 20px;
		border-bottom-color: var(--background-mod-strong);
}

.lastPlayedPlayer__93528:last-child {
		border-bottom: none;
}

.lastPlayedPlayer__93528+.lastPlayedPlayer__93528 {
		padding-top: 20px;
}

.lastPlayedPlayer__93528 button {
		display: none;
		width: unset;
		align-self: center;
}

.lastPlayedPlayer__93528:hover button {
		display: block;
}

.lastPlayedDetails__93528 {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
}

.overflownPlayers__93528 {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
		gap: 8px;
		padding-bottom: 20px;
}

.overflowUserOverflow__93528 {}

.overflowExtraOverflow__93528 {}

.overflowExtraText__93528 {
		color: var(--text-default);
		font-size: 14px;
		font-weight: 500;
}

.avatarEmpty__93528 {
		align-items: center;
		background: var(--background-base-lowest);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
}

.soloAvatar__93528 {
		height: 30px;
		width: 30px;
}

.soloAvatarTooltip__93528 {
		text-align: center;
}

.soloAvatarTooltipTimestamp__93528 {
		opacity: 0.6;
}

.news__93528 {
		background: var(--background-secondary-alt);
		border-radius: 3px;
		margin-top: 20px;
}

.followGameButtonActivityFeed__93528 {
		background: var(--control-secondary-background-default);
		color: var(--white);
		&:hover {
				background-color: var(--control-secondary-background-hover) !important;
		}
		&:active {
				background-color: var(--control-secondary-background-active) !important; 
		}
}

.popoutContainer__93528 {
		box-shadow: inset 0 0 0 1px var(--border-subtle), var(--shadow-high);
		display: flex;
		flex-direction: column;
		max-height: 40vh;
		position: relative;
		width: 200px;
}

.userListItem__93528 {
		align-items: center;
		display: flex;
		margin: 8px -8px;
		padding: 4px 8px;
}

.userListItem__93528 .lastPlayedDetails__93528 {
		margin-left: 10px;
}

.cardV2__93528 {
		background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
		border-radius: var(--radius-md);
		outline: 1px solid var(--border-normal);
		outline-offset: -1px;
		box-sizing: border-box;
		background-clip: border-box;
		overflow: hidden;
		transform: translateZ(0);

		.cardHeader__93528 {
				padding: var(--space-lg);
				position: relative;
				flex-direction: row;
				background: unset;
		}
		.nameTag__93528 {
				color: var(--white);
		}
		.splashArt__93528, .server__93528 {
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
				.headerIcon__93528 {
						display: none;
				}
				.headerActions__93528 {
						display: flex;
				}
		}
		.cardBody__93528 {
				display: flex;
				gap: var(--space-lg);
				padding: 0 var(--space-lg) var(--space-lg);
				background: unset;
		}
		.section__93528 {
				background: var(--background-mod-normal);
				border-radius: var(--radius-sm);
				padding: var(--space-sm);
		}
		.game__93528 {
				padding: 0;
		}
		.voiceSectionText__93528 {
				color: var(--white);
		}
		.headerIcon__93528, .gameIcon__93528, .assetsLargeImage__93528.assetsLargeImage__93528 {
				border-radius: var(--radius-sm);
		}
		.gameInfo__93528 {
				color: var(--white);
		}
		.playTime__93528:not(a), .voiceSectionSubtext__93528 {
				color: var(--app-message-embed-secondary-text) !important;
		}
		.serviceButtonWrapper__93528 {
				margin-left: 20px;
				gap: 8px !important;
		}
		.contentImagesActivityFeed__93528 {
				color: var(--white);
		}
		.textRow__93528 {
				font-size: 16px;
				line-height: 18px;
		}
		.details__93528 {
				color: var(--white);
		}
		.state__93528 {
				color: var(--app-message-embed-secondary-text);
				font-size: 14px;
				line-height: 16px;
		}
		.activity__93528:last-child:not(:only-child) {
				margin-top: 12px;
		}
		.applicationStreamingPreviewWrapper__93528 {
				background-color: var(--opacity-white-12);
				border-radius: var(--radius-sm);
				img {
						border-radius: var(--radius-sm);
				}
		}
		.streamGame__93528 {
				font-weight: 400;
				text-transform: unset;
		}

		.lastPlayedSection__93528 {
				display: flex;
				flex-direction: column;
				gap: var(--space-lg);
		}

		.lastPlayedSection__93528:last-child:not(:only-child) {
				margin-top: var(--space-lg);
		}

		.lastPlayedPlayer__93528 {
				padding: 0 !important;
				border: 0 !important;
		}

		.section__93528:last-child:not(:only-child) {
				padding-bottom: var(--space-sm);
		}

		.sectionTitleWrapper__93528 {
				color: var(--white);
		}

		.sectionTitle__93528 {
				font-size: 12px;
				font-weight: 500;
				line-height: 1.3333333333333333;
				text-transform: unset;
		}

		.lastPlayedPlayer__93528:is(:only-child, :last-child) {
				padding-bottom: 0;
		}

		.overflownPlayers__93528 {
				gap: 2.5px;
				margin-top: 0;
				padding-bottom: 0;
		}

		.overflowUserOverflow__93528:not(:last-of-type) {
				margin-inline-end: -6px;
				mask: url(/assets/38fe464a6fea7d0e.svg);
				mask-size: 100%;
				mask-type: alpha;
		}

		.overflowExtraText__93528 {
				color: var(--white);
		}

		.avatarEmpty__93528 {
				background: var(--opacity-white-12);
		}
}`;
_loadStyle("NowPlaying.module.css", css$2);
const modules_7260a078 = {
	"nowPlaying": "nowPlaying__93528",
	"whatsNew": "whatsNew__93528",
	"nowPlayingContainer": "nowPlayingContainer__93528",
	"nowPlayingColumn": "nowPlayingColumn__93528",
	"itemCard": "itemCard__93528",
	"card": "card__93528",
	"cardHeader": "cardHeader__93528",
	"header": "header__93528",
	"avatar": "avatar__93528",
	"applicationStreamingAvatar": "applicationStreamingAvatar__93528",
	"lastPlayedAvatar": "lastPlayedAvatar__93528",
	"nameTag": "nameTag__93528",
	"username": "username__93528",
	"gameIcon": "gameIcon__93528",
	"headerTitle": "headerTitle__93528",
	"headerIcon": "headerIcon__93528",
	"headerActions": "headerActions__93528",
	"overflowMenu": "overflowMenu__93528",
	"clickableIcon": "clickableIcon__93528",
	"clickableText": "clickableText__93528",
	"splashArt": "splashArt__93528",
	"server": "server__93528",
	"cardBody": "cardBody__93528",
	"section": "section__93528",
	"sectionTitleWrapper": "sectionTitleWrapper__93528",
	"sectionTitle": "sectionTitle__93528",
	"sectionLine": "sectionLine__93528",
	"game": "game__93528",
	"gameBody": "gameBody__93528",
	"activityContainer": "activityContainer__93528",
	"activity": "activity__93528",
	"serviceButtonWrapper": "serviceButtonWrapper__93528",
	"richActivity": "richActivity__93528",
	"activityActivityFeed": "activityActivityFeed__93528",
	"activityFeed": "activityFeed__93528",
	"body": "body__93528",
	"bodyNormal": "bodyNormal__93528",
	"gameInfoRich": "gameInfoRich__93528",
	"gameNameWrapper": "gameNameWrapper__93528",
	"gameInfo": "gameInfo__93528",
	"gameName": "gameName__93528",
	"streamInfo": "streamInfo__93528",
	"clickable": "clickable__93528",
	"playTime": "playTime__93528",
	"assets": "assets__93528",
	"assetsLargeImageActivityFeed": "assetsLargeImageActivityFeed__93528",
	"assetsSmallImageActivityFeed": "assetsSmallImageActivityFeed__93528",
	"assetsLargeImage": "assetsLargeImage__93528",
	"assetsLargeImageActivityFeedTwitch": "assetsLargeImageActivityFeedTwitch__93528",
	"assetsSmallImage": "assetsSmallImage__93528",
	"smallEmptyIcon": "smallEmptyIcon__93528",
	"largeEmptyIcon": "largeEmptyIcon__93528",
	"twitchImageContainer": "twitchImageContainer__93528",
	"twitchBackgroundImage": "twitchBackgroundImage__93528",
	"twitchImageOverlay": "twitchImageOverlay__93528",
	"streamName": "streamName__93528",
	"streamGame": "streamGame__93528",
	"contentImagesActivityFeed": "contentImagesActivityFeed__93528",
	"content": "content__93528",
	"contents": "contents__93528",
	"details": "details__93528",
	"ellipsis": "ellipsis__93528",
	"textRow": "textRow__93528",
	"voiceSection": "voiceSection__93528",
	"voiceSectionAssets": "voiceSectionAssets__93528",
	"voiceSectionIconWrapper": "voiceSectionIconWrapper__93528",
	"voiceSectionIcon": "voiceSectionIcon__93528",
	"voiceSectionGuildImage": "voiceSectionGuildImage__93528",
	"voiceSectionDetails": "voiceSectionDetails__93528",
	"voiceSectionText": "voiceSectionText__93528",
	"voiceSectionSubtext": "voiceSectionSubtext__93528",
	"userList": "userList__93528",
	"streamSection": "streamSection__93528",
	"applicationStreamingSection": "applicationStreamingSection__93528",
	"applicationStreamingDetails": "applicationStreamingDetails__93528",
	"applicationStreamingPreviewWrapper": "applicationStreamingPreviewWrapper__93528",
	"applicationStreamingPreviewSize": "applicationStreamingPreviewSize__93528",
	"applicationStreamingPreview": "applicationStreamingPreview__93528",
	"applicationStreamingHoverWrapper": "applicationStreamingHoverWrapper__93528",
	"applicationStreamingHoverText": "applicationStreamingHoverText__93528",
	"emptyPreviewContainer": "emptyPreviewContainer__93528",
	"emptyPreviewImage": "emptyPreviewImage__93528",
	"emptyPreviewText": "emptyPreviewText__93528",
	"inner": "inner__93528",
	"actionsActivityFeed": "actionsActivityFeed__93528",
	"buttonContainer": "buttonContainer__93528",
	"partyStatusWrapper": "partyStatusWrapper__93528",
	"partyList": "partyList__93528",
	"player": "player__93528",
	"userOverflow": "userOverflow__93528",
	"emptyUser": "emptyUser__93528",
	"partyPlayerCount": "partyPlayerCount__93528",
	"lastPlayedSection": "lastPlayedSection__93528",
	"lastPlayedPlayer": "lastPlayedPlayer__93528",
	"lastPlayedDetails": "lastPlayedDetails__93528",
	"overflownPlayers": "overflownPlayers__93528",
	"overflowUserOverflow": "overflowUserOverflow__93528",
	"overflowExtraOverflow": "overflowExtraOverflow__93528",
	"overflowExtraText": "overflowExtraText__93528",
	"avatarEmpty": "avatarEmpty__93528",
	"soloAvatar": "soloAvatar__93528",
	"soloAvatarTooltip": "soloAvatarTooltip__93528",
	"soloAvatarTooltipTimestamp": "soloAvatarTooltipTimestamp__93528",
	"news": "news__93528",
	"followGameButtonActivityFeed": "followGameButtonActivityFeed__93528",
	"popoutContainer": "popoutContainer__93528",
	"userListItem": "userListItem__93528",
	"cardV2": "cardV2__93528",
	"state": "state__93528"
};
const NowPlayingClasses = modules_7260a078;

// activity_feed/components/now_playing/activities/components/common/DiscordTag.tsx
function DiscordTag({ user, partiedMembers, voice }) {
	let outputtedUsername;
	if (voice && voice[0]) {
		const user1 = Common.UsernameUtils.getName(partiedMembers?.[0]);
		const user2 = partiedMembers?.[1] && Common.UsernameUtils.getName(partiedMembers[1]);
		switch (partiedMembers?.length) {
			case 1:
				outputtedUsername = user1;
				break;
			case 2:
				outputtedUsername = locale.Strings.USER_AND_USER({ user1, user2 });
				break;
			default:
				outputtedUsername = locale.Strings.USER_AND_USER_AND_OTHERS({ user1, user2, extras: partiedMembers.length - 2 });
				break;
		}
	} else {
		outputtedUsername = Common.UsernameUtils.getName(user);
	}
	return BdApi.React.createElement("div", { className: NowPlayingClasses.nameTag, style: { display: "flex", flex: 1 } }, BdApi.React.createElement("span", { className: `${NowPlayingClasses.username} username`, onClick: () => Common.ModalAccessUtils.openUserProfileModal({ userId: user.id }) }, outputtedUsername));
}

// activity_feed/components/now_playing/PresenceTypeStore.tsx
const PresenceTypeStore = new class PresenceTypeStore extends betterdiscord.Utils.Store {
	static displayName = "PresenceTypeStore";
	types = {};
	constructor() {
		super();
		this.types = {
			0: "PLAYING",
			1: "STREAMING",
			2: "LISTENING",
			3: "WATCHING",
			4: "CUSTOM",
			5: "COMPETING"
		};
	}
	getAllActivityTypes(activities) {
		let f = [];
		for (let a of activities) {
			if (!a) return;
			f.push(this.getActivityType(a));
		}
		return f;
	}
	getAllActivityProperties(activities, isSpotify) {
		let d = [];
		for (let a of activities) {
			if (!a) return;
			d.push(this.getActivityProperties(a, isSpotify));
		}
		return d;
	}
	getActivityType(activity) {
		if (activity?.activity) activity = activity?.activity;
		return this.types[activity?.type];
	}
	getActivityPlatform(activity, isSpotify) {
		if (activity?.activity) activity = activity?.activity;
		switch (true) {
			case !!(isSpotify || activity?.name?.toLowerCase()?.includes("spotify")):
				return "SPOTIFY";
			case !!activity?.platform?.includes("xbox"):
				return "XBOX";
			case !!(activity?.platform?.includes("playstation") || activity?.platform?.includes("ps5")):
				return "PLAYSTATION";
			case !!activity?.name?.toLowerCase().includes("youtube music"):
				return "YT_MUSIC";
			case !!activity?.name?.toLowerCase().endsWith("youtube"):
				return "YOUTUBE";
			case !!activity?.name?.toLowerCase().includes("twitch"):
				return "TWITCH";
			case !!activity?.name?.toLowerCase().includes("crunchyroll"):
				return "CRUNCHYROLL";
		}
	}
	getActivityProperties(activity, isSpotify) {
		return { type: this.getActivityType(activity), platform: this.getActivityPlatform(activity, isSpotify) };
	}
}();

// activity_feed/components/now_playing/activities/components/common/FlexInfo.tsx
function ActivityType(props) {
	const { activity, user, game, channel, stream, streamUser, server, type } = props;
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: game?.id });
	const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
	const activityProperties = betterdiscord.Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getActivityProperties(activity));
	switch (type) {
		case "REGULAR":
			const handleClick = handleApplicationClick({ user, currentUser, activity, application: game });
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.gameNameWrapper }, BdApi.React.createElement(
				"div",
				{
					className: NowPlayingClasses.gameName,
					onClick: handleClick ?? useGameProfile,
					onMouseOver: (e) => Boolean(handleClick ?? useGameProfile) && e.currentTarget.classList.add(NowPlayingClasses.clickableText),
					onMouseLeave: (e) => Boolean(handleClick ?? useGameProfile) && e.currentTarget.classList.remove(NowPlayingClasses.clickableText)
				},
				game?.name
			)), !activity?.assets?.large_image && BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, BdApi.React.createElement(TimeClock, { timestamp: activity?.timestamps?.start || activity?.created_at })));
		case "RICH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, activityProperties?.platform === "YT_MUSIC" ? BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(Common.Link, { href: activity?.details_url }, BdApi.React.createElement(
				"div",
				{
					className: `${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`,
					onMouseOver: (e) => e.currentTarget.classList.add(NowPlayingClasses.clickableText),
					onMouseLeave: (e) => e.currentTarget.classList.remove(NowPlayingClasses.clickableText)
				},
				activity.details || activity?.state
			)), activity?.details && BdApi.React.createElement(Common.Link, { href: activity?.state_url }, BdApi.React.createElement(
				"div",
				{
					className: `${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`,
					onMouseOver: (e) => e.currentTarget.classList.add(NowPlayingClasses.clickableText),
					onMouseLeave: (e) => e.currentTarget.classList.remove(NowPlayingClasses.clickableText)
				},
				activity?.state
			))) : BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(
				"div",
				{
					className: `${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`,
					onClick: () => {
						switch (activityProperties?.platform) {
							case "SPOTIFY":
								return Common.OpenTrack(activity);
							case "CRUNCHYROLL":
								return handleApplicationClick({ user, currentUser, activity })();
						}
					},
					onMouseOver: (e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.add(NowPlayingClasses.clickableText),
					onMouseLeave: (e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.remove(NowPlayingClasses.clickableText)
				},
				activity.details || activity?.state
			), activity?.details && BdApi.React.createElement(
				"div",
				{
					className: `${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`,
					onClick: () => activityProperties?.platform === "SPOTIFY" && Common.OpenArtist(activity, user.id, 0),
					onMouseOver: (e) => activityProperties?.platform === "SPOTIFY" && e.currentTarget.classList.add(NowPlayingClasses.clickableText),
					onMouseLeave: (e) => activityProperties?.platform === "SPOTIFY" && e.currentTarget.classList.remove(NowPlayingClasses.clickableText)
				},
				activity?.state
			)), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(Common.MediaProgressBar, { start: activity?.timestamps?.start || activity?.created_at, end: activity?.timestamps?.end })) : BdApi.React.createElement(Common.ActivityTimer, { activity }));
		case "TWITCH":
			return BdApi.React.createElement("div", { className: NowPlayingClasses.streamInfo }, BdApi.React.createElement("div", { className: NowPlayingClasses.gameName }, activity?.name.toLowerCase().includes("twitch") ? game?.name : game?.name.substring(0, 13) + activity?.name), BdApi.React.createElement(
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
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.streamName }, activity.details), activity.state && BdApi.React.createElement("div", { className: NowPlayingClasses.streamGame }, locale.Strings.PLAYING_GAME({ gameName: activity.state })));
		case "VOICE":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, server?.name || channel?.name || Common.UsernameUtils.getName(streamUser)), server && BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, channel?.name));
		case "STREAM":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { style: { display: "flex", alignItems: "flex-end" } }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, Common.UsernameUtils.getName(streamUser)), BdApi.React.createElement(Common.LiveBadge, { style: { marginLeft: "5px" } })), BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, activity ? Common.intl.intl.format(Common.intl.t["0wJXSh"], { name: BdApi.React.createElement("strong", null, stream.name) }) : locale.Strings.STREAMING()));
		case "LAST_PLAYED":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(DiscordTag, { user: streamUser }), BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, activity.endedAt ? BdApi.React.createElement(InactiveTimeClock, { timestamp: activity?.endedAt }) : locale.Strings.NOW_PLAYING()));
	}
}
function FlexInfo(props) {
	const { className, style, onClick } = props;
	return BdApi.React.createElement("div", { className, style, onClick }, BdApi.React.createElement(ActivityType, { ...props }));
}

// activity_feed/components/now_playing/activities/components/common/AvatarWithPopoutWrapper.tsx
function AvatarWithPopoutWrapper({ className, user, status, size }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
	return BdApi.React.createElement(
		Common.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(Common.UserProfileWrapperComponent, { currentUser, user }),
			position: "right",
			shouldShow: showPopout
		},
		(props) => BdApi.React.createElement(
			"div",
			{
				...props,
				ref: refDOM,
				onClick: async () => {
					if (!UserProfileStore.getUserProfile(user.id)) {
						await Common.FetchUserProfile(user.id, { withMutualGuilds: true, withMutualFriends: true });
					}
					setShowPopout(true);
				},
				className
			},
			BdApi.React.createElement(Common.AvatarFetch, { imageClassName: className, src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`, status, size })
		)
	);
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
	const totalCount = users.length + anonNum;
	const userOverflowCount = totalCount - 10;
	const playerFill = users.concat(emptyUsers);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.partyList }, playerFill.splice(0, 10).map(
		(player) => {
			switch (player) {
				case "anon":
					return BdApi.React.createElement("div", { className: NowPlayingClasses.emptyUser }, BdApi.React.createElement("svg", { width: "10", height: "10" }, BdApi.React.createElement("path", { fill: "rgba(255, 255, 255, 0.7)", d: "M4.99967 4.16671C5.4417 4.16671 5.86563 3.99111 6.17819 3.67855C6.49075 3.36599 6.66634 2.94207 6.66634 2.50004C6.66634 2.05801 6.49075 1.63409 6.17819 1.32153C5.86563 1.00897 5.4417 0.833374 4.99967 0.833374C4.55765 0.833374 4.13372 1.00897 3.82116 1.32153C3.5086 1.63409 3.33301 2.05801 3.33301 2.50004C3.33301 2.94207 3.5086 3.36599 3.82116 3.67855C4.13372 3.99111 4.55765 4.16671 4.99967 4.16671ZM4.80384 4.58337C3.75071 4.58337 2.74071 5.00173 1.99604 5.7464C1.25136 6.49108 0.833008 7.50108 0.833008 8.55421C0.833008 8.89171 1.10801 9.16671 1.44551 9.16671H1.53717C1.63717 9.16671 1.72051 9.09587 1.74551 9.00004C1.86634 8.53337 2.09551 8.09587 2.29551 7.78754C2.35384 7.70004 2.47467 7.74587 2.46217 7.85004L2.35384 8.93754C2.34551 9.06254 2.43717 9.16671 2.56217 9.16671H7.43717C7.46638 9.16685 7.49529 9.16086 7.52202 9.14911C7.54876 9.13736 7.57273 9.12013 7.59237 9.09852C7.61202 9.07691 7.6269 9.05141 7.63605 9.02368C7.64521 8.99595 7.64843 8.9666 7.64551 8.93754L7.53301 7.85421C7.52467 7.74587 7.64551 7.70004 7.70384 7.78754C7.90384 8.09587 8.13301 8.53754 8.25384 8.99587C8.27884 9.09587 8.36217 9.16671 8.46217 9.16671H8.55384C8.89134 9.16671 9.16634 8.89171 9.16634 8.55421C9.16634 7.50108 8.74799 6.49108 8.00331 5.7464C7.25863 5.00173 6.24864 4.58337 5.19551 4.58337H4.80384Z" })));
				case null:
					return BdApi.React.createElement("div", { className: NowPlayingClasses.emptyUser });
				default:
					return BdApi.React.createElement(Tooltip, { note: Common.UsernameUtils.getName(player) }, BdApi.React.createElement("div", null, BdApi.React.createElement(
						AvatarWithPopoutWrapper,
						{
							className: NowPlayingClasses.player,
							user: player,
							size: "SIZE_16"
						}
					)));
			}
		}
	), totalCount > 10 && BdApi.React.createElement("div", { className: `${NowPlayingClasses.emptyUser} ${NowPlayingClasses.userOverflow}`, style: { width: userOverflowCount > 9 ? "22px" : "19px", borderRadius: userOverflowCount > 9 && "16px" } }, `+${userOverflowCount}`));
}
function RegularCardTrailing({ activity, user, server, players, v2Enabled }) {
	const [width, height] = useWindowSize();
	const activityProperties = betterdiscord.Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getActivityProperties(activity));
	const action = Common.ActivityActions({ display: "live", user, activity });
	if (width <= 1240 && width >= 1200) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, server && BdApi.React.createElement(
		Common.VoiceList,
		{
			className: `${NowPlayingClasses.userList}`,
			users: players,
			maxUsers: players.length,
			guildId: server?.id,
			size: "SIZE_32"
		}
	), activityProperties.platform === "SPOTIFY" && BdApi.React.createElement("div", { className: `${NowPlayingClasses.serviceButtonWrapper}` }, BdApi.React.createElement(SpotifyButtons, { user, activity, onAction: action })), activityProperties.platform !== "YT_MUSIC" && activity?.assets ? null : BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.END, className: NowPlayingClasses.actionsActivityFeed, direction: Common.Flex.Direction.VERTICAL, justify: Common.Flex.Justify.CENTER, style: { flex: "0 1 auto", marginLeft: "20px" } }, v2Enabled && activity?.party && activity?.party?.size ? null : BdApi.React.createElement(ActivityButtons, { user, activity, onAction: action })));
}
function RichCardTrailing({ activity, user, v2Enabled }) {
	const [width, height] = useWindowSize();
	const activityProperties = betterdiscord.Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getActivityProperties(activity));
	const action = Common.ActivityActions({ display: "live", user, activity });
	if (width <= 1240 && width >= 1200) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, activityProperties.platform !== "YT_MUSIC" && BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.END, className: NowPlayingClasses.actionsActivityFeed, direction: Common.Flex.Direction.VERTICAL, justify: Common.Flex.Justify.CENTER, style: { flex: "0 1 auto", marginLeft: "20px" } }, v2Enabled && activity?.party && activity?.party?.size ? null : BdApi.React.createElement(ActivityButtons, { user, activity, onAction: action })));
}
function VoiceCardTrailing({ members, server, channel }) {
	const [width, height] = useWindowSize();
	if (width <= 1240 && width >= 1200) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(
		Common.VoiceList,
		{
			className: NowPlayingClasses.userList,
			users: members,
			maxUsers: width >= 1420 || width < 1200 ? 5 : width >= 1380 ? 4 : width >= 1300 ? 3 : 2,
			guildId: server?.id,
			channelId: channel.id,
			size: "SIZE_32"
		}
	), BdApi.React.createElement(Common.CallButtons, { channel }));
}
function PartyFooter({ party, players, user, activity }) {
	const action = Common.ActivityActions({ display: "live", user, activity });
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.sectionDivider, style: { margin: "8px 0 8px 0" } }), BdApi.React.createElement("div", { className: NowPlayingClasses.partyStatusWrapper }, BdApi.React.createElement(PartyMemberListBuilder, { activity, users: players }), BdApi.React.createElement(
		"div",
		{
			className: NowPlayingClasses.partyPlayerCount,
			style: { flex: "1 1 100%" }
		},
		locale.Strings.PARTY_SIZE({ partySize: party.size[0], maxPartySize: party.size[1] })
	), BdApi.React.createElement(ActivityButtons, { user, activity, onAction: action })));
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
	return BdApi.React.createElement("svg", { ...props, viewBox: "0 0 24 24" }, BdApi.React.createElement(
		"path",
		{
			fill: "white",
			fillRule: "evenodd",
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
			onClick: (e) => {
				activity.name.toLowerCase().includes("spotify") && e.stopPropagation(), Common.OpenAlbum(activity, user.id);
			},
			onMouseOver: (e) => activity.name.toLowerCase().includes("spotify") && e.currentTarget.classList.add(NowPlayingClasses.clickableIcon),
			onMouseLeave: (e) => activity.name.toLowerCase().includes("spotify") && e.currentTarget.classList.remove(NowPlayingClasses.clickableIcon),
			onError: () => setShouldFallback(true)
		},
		BdApi.React.createElement("g", { fill: "none", fillRule: "evenodd" }, BdApi.React.createElement(
			"path",
			{
				fill: "var(--platform-spotify)",
				d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
			}
		), BdApi.React.createElement("rect", { width: "16", height: "16" }))
	));
}
function GameIconAsset({ url, id, name, onClick }) {
	const [shouldFallback, setShouldFallback] = react.useState(false);
	let appId = id;
	if (isNaN(appId)) appId = void 0;
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: appId });
	return BdApi.React.createElement(BdApi.React.Fragment, null, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: NowPlayingClasses.gameIcon, style: { width: "40px", height: "40px" } }) : BdApi.React.createElement(
		"img",
		{
			className: NowPlayingClasses.gameIcon,
			style: { width: "40px", height: "40px" },
			"aria-label": locale.Strings.GAME_ICON_FOR({ game: name }),
			src: `${url}`,
			onClick: onClick ?? useGameProfile,
			onMouseOver: (e) => Boolean(onClick ?? useGameProfile) && e.currentTarget.classList.add(NowPlayingClasses.clickableIcon),
			onMouseLeave: (e) => Boolean(onClick ?? useGameProfile) && e.currentTarget.classList.remove(NowPlayingClasses.clickableIcon),
			onError: () => setShouldFallback(true)
		}
	));
}
function RichImageAsset({ url, tooltipText, onClick, onMouseOver, onMouseLeave, type }) {
	const [shouldFallback, setShouldFallback] = react.useState(false);
	{
		betterdiscord.Plugins.get("ActivityFeed").version.includes("dev") && shouldFallback && console.log("rich image failed.", url);
	}
	return BdApi.React.createElement(Tooltip, { note: tooltipText }, shouldFallback ? BdApi.React.createElement(FallbackAsset, { className: `${NowPlayingClasses[`assets${type}Image`]} ${NowPlayingClasses[`assets${type}ImageActivityFeed`]}` }) : BdApi.React.createElement(
		"img",
		{
			className: `${NowPlayingClasses[`assets${type}Image`]} ${NowPlayingClasses[`assets${type}ImageActivityFeed`]}`,
			"aria-label": tooltipText,
			alt: tooltipText,
			src: `${url}`,
			onClick,
			onMouseOver,
			onMouseLeave,
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
		!imageId ? BdApi.React.createElement(FallbackAsset, { className: `${NowPlayingClasses.assetsLargeImageActivityFeedTwitch} ${NowPlayingClasses.assetsLargeImage}` }) : BdApi.React.createElement(
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
function RegularActivityBuilder({ activity, activityProperties, user, game, players, server, v2Enabled }) {
	const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
	const isTwitch = ["TWITCH", "YOUTUBE"].includes(activityProperties.platform);
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, className: NowPlayingClasses.activity }, (() => {
		switch (activityProperties.platform) {
			case "SPOTIFY":
				return BdApi.React.createElement(SpotifyAsset, { activity, user });
			case "XBOX":
				return BdApi.React.createElement(XboxImageAsset, { url: "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png" });
			case "TWITCH":
			case "YOUTUBE":
				return BdApi.React.createElement(
					GameIconAsset,
					{
						url: activity.name.toLowerCase().includes("youtube") ? `https://discord.com/assets/0fa530ba9c04ac32.svg` : `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`,
						id: activity?.application_id,
						name: activity?.name
					}
				);
			default:
				return BdApi.React.createElement(
					GameIconAsset,
					{
						url: game?.getIconURL(64, "webp"),
						id: activity?.application_id,
						name: game?.name,
						onClick: handleApplicationClick({ user, currentUser, activity, application: game })
					}
				);
		}
	})(), BdApi.React.createElement(FlexInfo, { className: NowPlayingClasses.gameInfo, user, activity, game, type: isTwitch ? "TWITCH" : "REGULAR" }), BdApi.React.createElement(RegularCardTrailing, { activity, user, server, players, v2Enabled }));
}
function RichActivityBuilder({ user, activity, activityProperties, v2Enabled }) {
	const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
	return BdApi.React.createElement(Common.Flex, { className: NowPlayingClasses.richActivity }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common.PositionClasses.flex}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.assets}` }, BdApi.React.createElement(
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
			onClick: () => {
				switch (activityProperties?.platform) {
					case "SPOTIFY":
					case "YT_MUSIC":
						return Common.OpenTrack(activity);
					case "CRUNCHYROLL":
						return handleApplicationClick({ user, currentUser, activity })();
				}
			},
			onMouseOver: (e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.add(NowPlayingClasses.clickableIcon),
			onMouseLeave: (e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.remove(NowPlayingClasses.clickableIcon),
			type: "Large"
		}
	), activity?.assets && activity?.assets.small_image && BdApi.React.createElement(
		RichImageAsset,
		{
			url: activity?.assets?.small_image?.includes("external") ? `https://media.discordapp.net/${activity.assets.small_image?.substring(activity.assets.small_image.indexOf(":") + 1)}` : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`,
			tooltipText: activity.assets.small_text,
			type: "Small"
		}
	)), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.contentImagesActivityFeed} ${NowPlayingClasses.content}`, activity, user, type: "RICH" }), BdApi.React.createElement(RichCardTrailing, { activity, user, v2Enabled }))));
}
function RichTwitchActivityBuilder({ activity }) {
	return BdApi.React.createElement(Common.Flex, { className: NowPlayingClasses.richActivity }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}` }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common.PositionClasses.flex}` }, BdApi.React.createElement("div", { className: NowPlayingClasses.assets }, BdApi.React.createElement("div", { className: NowPlayingClasses.twitchImageContainer }, BdApi.React.createElement(FlexInfo, { className: NowPlayingClasses.twitchImageOverlay, activity, type: "TWITCH_OVERLAY" }), BdApi.React.createElement(
		TwitchImageAsset,
		{
			url: activity.name.includes("YouTube") ? `https://i.ytimg.com/vi/${activity.assets?.large_image.substring(activity.assets?.large_image.indexOf(":") + 1)}/hqdefault_live.jpg` : `https://static-cdn.jtvnw.net/previews-ttv/live_user_${activity.assets?.large_image.substring(activity.assets?.large_image.indexOf(":") + 1)}-900x500.jpg`,
			imageId: activity.assets?.large_image,
			streamUrl: activity.url
		}
	))))));
}

// activity_feed/components/now_playing/activities/components/common/ActivityCardContextMenu.tsx
function ActivityCardContextMenu({ user, currentActivity, currentGame }) {
	switch (currentActivity.type) {
		case 0: {
			let id = currentActivity?.application_id ?? currentGame?.id;
			if (isNaN(id)) id = void 0;
			const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: id });
			let application = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplicationByName(currentGame.name));
			if (application.type == null) application = ApplicationStore.getApplication(id);
			const handleClick = handleApplicationClick({ user, activity: currentActivity, application: currentGame });
			const isFollowed = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(application.id ?? currentActivity?.application_id));
			const isWhitelisted = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameWhitelisted(application.id ?? currentActivity?.application_id));
			return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "activity-context", onClose: (e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e) }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "open-game-profile", label: locale.Strings.OPEN_GAME_PROFILE(), action: handleClick ?? useGameProfile, disabled: !handleClick || !useGameProfile }), BdApi.React.createElement(
				betterdiscord.ContextMenu.CheckboxItem,
				{
					id: "follow-game",
					label: locale.Strings.SHOW_ON_ACTIVITY_FEED(),
					checked: isFollowed || isWhitelisted,
					disabled: !currentGame || application.type == null,
					action: isFollowed || isWhitelisted ? () => NewsStore.blacklistGame(application ?? { id: currentActivity?.application_id }) : () => NewsStore.followGame(application ?? currentGame)
				}
			));
		}
		default:
			Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" });
			return;
	}
}

// activity_feed/components/now_playing/activities/components/CardActivity.tsx
function ActivityCard({ user, activities, activityProperties, currentActivity, currentGame, players, server, v2Enabled }) {
	if (currentActivity.type == 1) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.activityContainer, onContextMenu: (e) => betterdiscord.ContextMenu.open(e, (props) => BdApi.React.createElement(ActivityCardContextMenu, { ...props, user, currentActivity, currentGame })) }, BdApi.React.createElement(RegularActivityBuilder, { user, activity: currentActivity, activityProperties, game: currentGame, players, server, v2Enabled }), currentActivity?.assets && currentActivity?.assets.large_image && BdApi.React.createElement(RichActivityBuilder, { user, activity: currentActivity, activityProperties, v2Enabled })), v2Enabled && currentActivity?.party && currentActivity?.party.size && BdApi.React.createElement(PartyFooter, { party: currentActivity.party, players, user, activity: currentActivity }), activities.length > 1 && activities.pop() !== currentActivity && BdApi.React.createElement("div", { className: MainClasses.sectionDivider }));
}

// activity_feed/components/now_playing/activities/components/CardActivityWrapper.tsx
function ActivityCardWrapper({ user, activities, voice, streams, v2Enabled }) {
	if (!activities || !activities.length) return;
	return activities.map((activity) => {
		const currentActivity = activity?.activity || streams[0].activity;
		const currentGame = activity?.application || GameStore.getDetectableGame(GameStore.searchGamesByName(streams[0].activity.name)[0]);
		const players = activity.playingMembers;
		const server = voice[0]?.guild;
		const activityProperties = PresenceTypeStore.getActivityProperties(currentActivity);
		return BdApi.React.createElement(ActivityCard, { user, activities, activityProperties, currentActivity, currentGame, players, server, v2Enabled, key: currentActivity.application_id });
	});
}

// activity_feed/components/now_playing/activities/components/CardTwitch.tsx
function TwitchCard({ user, activity }) {
	const currentActivity = activity?.activity;
	const activityProperties = betterdiscord.Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getActivityProperties(currentActivity));
	const currentGame = activity?.application;
	return !currentActivity || !activityProperties?.type === "STREAMING" ? BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(RegularActivityBuilder, { user, activity: currentActivity, activityProperties, game: currentGame }), BdApi.React.createElement(RichTwitchActivityBuilder, { activity: currentActivity }), BdApi.React.createElement("div", { className: MainClasses.sectionDivider })) : null;
}

// activity_feed/components/now_playing/activities/components/CardStream.tsx
function StreamContextMenu({ stream }) {
	return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "watch-stream-context", onClose: (e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e) }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "watch-stream", label: locale.Strings.WATCH_STREAM(), action: () => {
		return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream);
	} }));
}
function StreamFallback() {
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, className: betterdiscord.Utils.className(NowPlayingClasses.emptyPreviewContainer, NowPlayingClasses.applicationStreamingPreviewSize), justify: Common.Flex.Justify.CENTER }, BdApi.React.createElement(Common.Spinner, null));
}
function StreamPlaceholder() {
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, className: betterdiscord.Utils.className(NowPlayingClasses.emptyPreviewContainer, NowPlayingClasses.applicationStreamingPreviewSize), justify: Common.Flex.Justify.CENTER }, BdApi.React.createElement("div", { className: NowPlayingClasses.emptyPreviewImage, style: { backgroundImage: "url(https://static.discord.com/assets/b93ef52d62a513a4f2127a6ca0c3208c.svg)" } }), BdApi.React.createElement("div", { className: NowPlayingClasses.emptyPreviewText }, locale.Strings.STREAM_JUST_STARTED_PROMPT()));
}
function StreamPreview({ stream }) {
	const { previewUrl, isLoading } = Common.UseStreamPreviewURL(stream.guildId, stream.channelId, stream.ownerId);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, isLoading ? BdApi.React.createElement(StreamFallback, null) : !previewUrl ? BdApi.React.createElement(StreamPlaceholder, null) : BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, style: { position: "relative" } }, BdApi.React.createElement("img", { className: NowPlayingClasses.applicationStreamingPreview, src: previewUrl })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverWrapper, onClick: () => {
		return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream);
	} }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverText }, locale.Strings.WATCH_STREAM())));
}
function StreamCard({ stream, streamUser, streamActivity }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.streamSection, onContextMenu: (e) => betterdiscord.ContextMenu.open(e, (props) => BdApi.React.createElement(StreamContextMenu, { ...props, stream })) }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingSection }, BdApi.React.createElement(AvatarWithPopoutWrapper, { className: `${NowPlayingClasses.applicationStreamingAvatar} ${NowPlayingClasses.avatar}`, user: streamUser, size: "SIZE_40" }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.details} ${NowPlayingClasses.applicationStreamingDetails}`, type: "STREAM", stream: streamActivity, streamUser })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewWrapper, style: { paddingTop: "54.25%" } }, BdApi.React.createElement("div", { className: NowPlayingClasses.inner }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, BdApi.React.createElement(StreamPreview, { stream })))));
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
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSection, onContextMenu: (e) => {
		let Menus = ContextMenus();
		return Menus.ContextMenuActivityFeed(e, channel);
	} }, BdApi.React.createElement("div", { className: NowPlayingClasses.voiceSectionAssets }, BdApi.React.createElement(VoiceGuildAsset, { channel, streamUser: streamUsers[0], server })), BdApi.React.createElement(
		FlexInfo,
		{
			className: `${NowPlayingClasses.details} ${NowPlayingClasses.voiceSectionDetails}`,
			onClick: () => Common.OpenVoiceChannel.selectVoiceChannel(channel.id),
			channel,
			streamUser: streamUsers[0],
			server,
			type: "VOICE"
		}
	), BdApi.React.createElement(VoiceCardTrailing, { members, server, channel })), stream && streams.map(
		(stream2, index) => BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.sectionDivider }), BdApi.React.createElement(StreamCard, { stream: streamsInfo[index], streamUser: streamUsers[index], streamActivity: streams[index]?.activity, key: `stream-${streamUsers[index].id}` }))
	), activities.length ? BdApi.React.createElement("div", { className: MainClasses.sectionDivider }) : null);
}

// activity_feed/components/now_playing/card_shop/now_playing/CardBody.tsx
function NowPlayingCardBody({ activities, user, voice, streams, v2Enabled }) {
	const twitchActivity = activities.find((entry) => entry.activity?.type == 1) || streams.find((entry) => entry.activity?.type == 1);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.cardBody }, BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.game }, BdApi.React.createElement(Common.Flex, { className: NowPlayingClasses.gameBody }, voice && BdApi.React.createElement(VoiceCard, { activities, voice, streams, key: `voice-${voice[0]?.guild?.id || voice[0]?.channel?.id}` }), twitchActivity && BdApi.React.createElement(TwitchCard, { user, activity: twitchActivity, key: `twitch-${user.id}` }), activities && BdApi.React.createElement(ActivityCardWrapper, { user, activities, voice, streams, v2Enabled })))));
}

// activity_feed/components/now_playing/activities/components/common/MessageButton.tsx
function MessageButton({ user }) {
	return BdApi.React.createElement(
		ManaButtons.PrimaryButtonWithIcon,
		{
			text: locale.Strings.MESSAGE(),
			onClick: () => Common.OpenDM.openPrivateChannel({ recipientIds: user.id })
		}
	);
}

// activity_feed/components/now_playing/activities/components/common/Splash.tsx
function Splash({ splash, className }) {
	if (!splash) return;
	return BdApi.React.createElement("div", { className, style: { backgroundImage: `url(${splash})` } });
}

// activity_feed/components/now_playing/card_shop/now_playing/CardHeader.tsx
function HeaderActions$1({ card, user }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, "aria-expanded": showPopout, className: NowPlayingClasses.headerActions, grow: true }, BdApi.React.createElement(MessageButton, { user }), BdApi.React.createElement(
		Common.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(CardPopout, { party: card.party, close: () => setShowPopout(false) }),
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
function HeaderIcon({ activities, isSpotify, application }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, isSpotify ? BdApi.React.createElement("svg", { className: `${NowPlayingClasses.headerIcon}`, "aria-hidden": true, role: "image", width: "16", height: "16", viewBox: "0 0 16 16" }, BdApi.React.createElement("g", { fill: "none", fillRule: "evenodd" }, BdApi.React.createElement("path", { fill: "var(--platform-spotify)", d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z" }), BdApi.React.createElement("rect", { width: "16", height: "16" }))) : activities.length !== 0 && BdApi.React.createElement("img", { className: `${NowPlayingClasses.headerIcon}`, alt: "", src: application.getIconURL(64, "png") }));
}
function NowPlayingCardHeader({ card, activities, application, splash, user, priorityMembers, partiedMembers, voice, isSpotify }) {
	const status = priorityMembers[0].status;
	const channel = ChannelStore.getDMChannelFromUserId(user.id);
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, className: NowPlayingClasses.cardHeader, onContextMenu: (e) => {
		let Menus = ContextMenus();
		return Menus.ContextMenuUser(e, user, channel);
	} }, BdApi.React.createElement(Splash, { splash, className: betterdiscord.Utils.className(NowPlayingClasses.splashArt, voice && activities.length === 0 && NowPlayingClasses.server) }), BdApi.React.createElement("div", { className: NowPlayingClasses.header }, BdApi.React.createElement(AvatarWithPopoutWrapper, { className: NowPlayingClasses.avatar, user, status, size: "SIZE_40" }), BdApi.React.createElement(DiscordTag, { user, partiedMembers, voice }), BdApi.React.createElement(HeaderActions$1, { card, user }), BdApi.React.createElement(HeaderIcon, { activities, isSpotify, application })));
}

// activity_feed/common/components/Scroller.tsx
function Scroller({ children, className, dir = "ltr", orientation = "vertical", paddingFix = true, fade = false, ref, style, type }) {
	const scrollerClass = type === "auto" ? Common.ScrollerClasses.auto : type === "none" ? Common.ScrollerClasses.none : type === "thin" && Common.ScrollerClasses.thin;
	const classSpec = Common.ScrollerSpecHandler(scrollerClass);
	const refDOM = react.useRef(null);
	const handler = Common.ScrollerHandler({ paddingFix, orientation, dir, className, scrollerRef: refDOM, spec: classSpec });
	return BdApi.React.createElement(
		"div",
		{
			ref: () => {
				typeof ref == "function" ? ref(scrollerClass) : !ref && (ref.current = scrollerClass);
				refDOM.current = scrollerClass;
			},
			className: betterdiscord.Utils.className(className, scrollerClass, fade && Common.ScrollerClasses.fade),
			style: Common.ScrollerStyleHandler(style, orientation),
			dir
		},
		BdApi.React.createElement(Common.ContainerRefProvider, { containerRef: refDOM }, [children, handler])
	);
}

// activity_feed/components/now_playing/activities/components/WhatsNewListItem.tsx
function WhatsNewListItem({ player }) {
	const user = player.user;
	const status = player.status;
	const channel = ChannelStore.getDMChannelFromUserId(user.id);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.lastPlayedPlayer, onContextMenu: (e) => {
		let Menus = ContextMenus();
		return Menus.ContextMenuUser(e, user, channel);
	} }, BdApi.React.createElement(AvatarWithPopoutWrapper, { className: `${NowPlayingClasses.lastPlayedAvatar} ${NowPlayingClasses.avatar}`, user, status, size: "SIZE_40" }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.details} ${NowPlayingClasses.lastPlayedDetails}`, type: "LAST_PLAYED", activity: player, streamUser: user }), BdApi.React.createElement(MessageButton, { user }));
}
function WhatsNewOverflowExtraPopout({ players }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const scrollerRef = react.useRef(null);
	const popoutRef = react.useRef(null);
	const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
	return BdApi.React.createElement(Scroller, { className: Common.ScrollerOverflowPopoutClasses.scroller, ref: scrollerRef, type: "thin" }, BdApi.React.createElement("div", { className: NowPlayingClasses.popoutContainer }, players.map((player) => {
		const user = player.user;
		return BdApi.React.createElement(
			Common.Popout,
			{
				shouldShow: showPopout,
				clickTrap: true,
				position: "top",
				targetElementRef: popoutRef,
				onRequestClose: () => setShowPopout(false),
				renderPopout: () => BdApi.React.createElement(Common.UserProfileWrapperComponent, { currentUser, user })
			},
			(props) => BdApi.React.createElement("div", { ...props, ref: popoutRef, className: NowPlayingClasses.userListItem }, BdApi.React.createElement(Common.AvatarFetch, { imageClassName: `${NowPlayingClasses.lastPlayedAvatar} ${NowPlayingClasses.avatar}`, src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`, size: "SIZE_32" }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.details} ${NowPlayingClasses.lastPlayedDetails}`, type: "LAST_PLAYED", activity: player, streamUser: user }))
		);
	})));
}
function WhatsNewOverflowExtra({ players }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement(
		Common.Popout,
		{
			shouldShow: showPopout,
			clickTrap: true,
			position: "top",
			targetElementRef: refDOM,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(WhatsNewOverflowExtraPopout, { players })
		},
		(props) => BdApi.React.createElement("div", { ...props, ref: refDOM, className: `${NowPlayingClasses.overflowUserOverflow} ${NowPlayingClasses.overflowExtraOverflow}`, onClick: () => {
			setShowPopout(true);
		} }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.soloAvatar} ${NowPlayingClasses.avatarEmpty}` }, BdApi.React.createElement("div", { className: NowPlayingClasses.overflowExtraText }, players.length > 99 ? ">99" : `+${players.length}`)))
	);
}
function WhatsNewOverflowUserTooltip({ player }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.soloAvatarTooltip }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, Common.UsernameUtils.getName(player.user)), BdApi.React.createElement("div", { className: NowPlayingClasses.soloAvatarTooltipTimestamp }, player.endedAt ? BdApi.React.createElement(InactiveTimeClock, { timestamp: player?.endedAt }) : locale.Strings.NOW_PLAYING()));
}
function WhatsNewOverflowUser({ player }) {
	const user = player.user;
	return BdApi.React.createElement(Tooltip, { note: BdApi.React.createElement(WhatsNewOverflowUserTooltip, { player }) }, BdApi.React.createElement("div", { className: NowPlayingClasses.overflowUserOverflow }, BdApi.React.createElement(AvatarWithPopoutWrapper, { className: NowPlayingClasses.soloAvatar, user, size: "SIZE_32" })));
}
function WhatsNewListOverflow({ players, overflowPlayerCount, extras, v2Enabled }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.sectionTitleWrapper }, BdApi.React.createElement("div", { className: NowPlayingClasses.sectionTitle }, locale.Strings.MORE_RECENT_PLAYERS_SECTION_TITLE({ playerCount: overflowPlayerCount })), !v2Enabled && BdApi.React.createElement("div", { className: `${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}` })), BdApi.React.createElement("div", { className: NowPlayingClasses.overflownPlayers }, players.map((player, index) => {
		return extras?.length && index === players.length - 1 ? BdApi.React.createElement(WhatsNewOverflowExtra, { players: extras }) : BdApi.React.createElement(WhatsNewOverflowUser, { player });
	})));
}

// activity_feed/components/now_playing/activities/components/CardMiniNews.tsx
function CardMiniNews({ currentArticle, className }) {
	const thumbnail = currentArticle.news?.thumbnail?.replace(/\s/g, "%20");
	return BdApi.React.createElement(
		"a",
		{
			tabindex: currentArticle.index,
			className: betterdiscord.Utils.className(Common.AnchorClasses.anchor, FeedClasses.newsLink, FeedClasses.news, className),
			href: currentArticle.news?.url || "#",
			onContextMenu: (e) => betterdiscord.ContextMenu.open(e, (props) => BdApi.React.createElement(FeedPopout, { ...props, application: currentArticle.application, gameId: currentArticle.id, articleUrl: currentArticle.news?.url })),
			rel: "noreferrer nopener",
			target: "_blank",
			role: "button"
		},
		BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: {
					backgroundImage: `url(${thumbnail}), \n  											url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg),\n  											url(https://static.discord.com/assets/6a0d045ec452de05f71ee63fece2327f.svg)`
				}
			}
		)),
		BdApi.React.createElement("div", { className: FeedClasses.body }, BdApi.React.createElement("div", { className: FeedClasses.title }, currentArticle.news?.title || "No Title"), BdApi.React.createElement("div", { className: FeedClasses.description, dangerouslySetInnerHTML: { __html: currentArticle.news?.description || "No description available." } }), BdApi.React.createElement("div", { className: FeedClasses.timestamp }, Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), { dateStyle: "long" })))
	);
}

// activity_feed/components/now_playing/card_shop/whats_new/CardBody.tsx
function WhatsNewCardBody({ players, news, v2Enabled }) {
	let slicedPlayers = players;
	let overflowPlayers = [];
	let extraPlayers = [];
	if (players.length > 4) {
		slicedPlayers = players.slice(0, 3);
		overflowPlayers = players.slice(3);
	}
	const overflowPlayerCount = overflowPlayers.length;
	const areExtraPlayers = players.length > 14;
	if (areExtraPlayers) {
		extraPlayers = overflowPlayers.slice(v2Enabled ? 15 : 11);
		overflowPlayers.splice(v2Enabled ? 16 : 12);
	}
	return BdApi.React.createElement("div", { className: NowPlayingClasses.cardBody }, BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.lastPlayedSection }, slicedPlayers.map((player) => {
		if (!player) return;
		return BdApi.React.createElement(WhatsNewListItem, { player });
	})), overflowPlayers.length > 1 && BdApi.React.createElement("div", { className: NowPlayingClasses.lastPlayedSection }, BdApi.React.createElement(WhatsNewListOverflow, { players: overflowPlayers, overflowPlayerCount, extras: extraPlayers, v2Enabled }))), news && BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.sectionTitleWrapper }, BdApi.React.createElement("div", { className: NowPlayingClasses.sectionTitle }, locale.Strings.NEWS()), !v2Enabled && BdApi.React.createElement("div", { className: `${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}` })), BdApi.React.createElement(CardMiniNews, { currentArticle: news, className: NowPlayingClasses.news })));
}

// activity_feed/components/now_playing/activities/components/common/FollowButton.tsx
function FollowButton({ application, fullWidth = false }) {
	const originalApplication = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplicationByName(application.name));
	const isFollowed = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(originalApplication?.id ?? application.id));
	const isWhitelisted = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameWhitelisted(originalApplication?.id ?? application.id));
	return isFollowed || isWhitelisted ? BdApi.React.createElement(
		"button",
		{
			type: "button",
			className: betterdiscord.Utils.className(NowPlayingClasses.followGameButtonActivityFeed, MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled, Common.ButtonVoidClasses.grow),
			disabled: true
		},
		BdApi.React.createElement("div", { className: NowPlayingClasses.contents }, locale.Strings.FOLLOWING())
	) : BdApi.React.createElement(
		"button",
		{
			type: "button",
			className: betterdiscord.Utils.className(NowPlayingClasses.followGameButtonActivityFeed, MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled, Common.ButtonVoidClasses.grow),
			onClick: () => NewsStore.followGame(application)
		},
		BdApi.React.createElement("div", { className: NowPlayingClasses.contents }, locale.Strings.FOLLOW())
	);
}

// activity_feed/components/now_playing/card_shop/whats_new/CardHeader.tsx
function HeaderActions({ game }) {
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, className: NowPlayingClasses.headerActions, grow: true }, BdApi.React.createElement(FollowButton, { application: game }));
}
function GameTag({ game }) {
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: game?.id });
	return BdApi.React.createElement("div", { className: NowPlayingClasses.nameTag, style: { flex: 1 } }, BdApi.React.createElement(
		"div",
		{
			className: NowPlayingClasses.headerTitle,
			onMouseOver: (e) => Boolean(useGameProfile) && e.currentTarget.classList.add(NowPlayingClasses.clickableText),
			onMouseLeave: (e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(NowPlayingClasses.clickableText),
			onClick: useGameProfile
		},
		game?.name
	));
}
function WhatsNewCardHeader({ game, splash }) {
	return BdApi.React.createElement(Common.Flex, { align: Common.Flex.Align.CENTER, className: NowPlayingClasses.cardHeader, onContextMenu: (e) => betterdiscord.ContextMenu.open(e, (props) => BdApi.React.createElement(ActivityCardContextMenu, { ...props, user: { id: 0 }, currentActivity: { type: 0 }, currentGame: game })) }, BdApi.React.createElement(Splash, { splash, className: NowPlayingClasses.splashArt }), BdApi.React.createElement("div", { className: NowPlayingClasses.header }, BdApi.React.createElement(GameIconAsset, { url: `https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon ?? game?.iconHash}.webp?size=64&keep_aspect_ratio=false`, id: game?.id, name: game?.name }), BdApi.React.createElement(GameTag, { game }), BdApi.React.createElement(HeaderActions, { game })));
}

// activity_feed/components/now_playing/CardBuilder.tsx
function NowPlayingCardBuilder({ card, v2Enabled }) {
	const priorityMembers = card.party.priorityMembers;
	const partiedMembers = card.party.partiedMembers;
	const activities = card.party.currentActivities;
	const application = card.party.currentActivities[0]?.application;
	const voice = card.party.voiceChannels;
	const streams = card.party.applicationStreams;
	const isSpotify = card.party.isSpotifyActivity;
	const user = priorityMembers[0].user;
	const activityProperties = betterdiscord.Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getAllActivityProperties(activities, isSpotify));
	const cardGrad = GradGen(application, activityProperties, isSpotify, activities[0]?.activity, voice, streams[0]?.stream);
	const { data, error, isLoading, refetch } = betterdiscord.ReactUtils.wrapInHooks(FetchGameUtils.fetchGames)(application?.linkedGames?.[0]?.id || application?.id);
	const splash = SplashGen({ application, data }, isSpotify, activities[0]?.activity, voice, streams[0]?.stream, activityProperties);
	return BdApi.React.createElement("div", { className: v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } }, BdApi.React.createElement(NowPlayingCardHeader, { card, activities, application, splash, user, priorityMembers, partiedMembers, voice, isSpotify }), BdApi.React.createElement(NowPlayingCardBody, { activities, user, voice, streams, isSpotify, v2Enabled }));
}
function WhatsNewCardBuilder({ card, v2Enabled }) {
	const players = card.players;
	const game = card.application;
	const titleNews = card.titleNews;
	const application = ApplicationStore.getApplication(game?.linkedApplications?.[0]?.id || game.id);
	const cardGrad = GradGen(application ?? game);
	const splash = SplashGen({ application, data: game });
	return BdApi.React.createElement("div", { className: v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } }, BdApi.React.createElement(WhatsNewCardHeader, { game, splash }), BdApi.React.createElement(WhatsNewCardBody, { players, news: titleNews, v2Enabled }));
}

// activity_feed/components/now_playing/LastPlayedStore.tsx
const LastPlayedStore = () => {
	let lastPlayedCards = [];
	let lastFetched = betterdiscord.Data.load("lastFetched") ?? void 0;
	let shouldPersistentlyFetch = false;
	function fetchLastPlayed() {
		let seenGames = ContentInventoryStore.getFeeds().get("global feed")?.unranked_game_entries;
		if (!seenGames) {
			console.log("%c[LastPlayedStore]", "color: #800080; font-weight: 700;", "Failed to fetch content inventory feed data.");
			throw new Error();
		}
		const recentlySeenGames = seenGames.filter((entry) => new Date(entry.content?.started_at) > new Date(Date.now() - 432e6)).map((item) => item.content);
		const recentlySeenGameIds = recentlySeenGames.map((entry) => entry?.extra?.application_id);
		const _recentlySeenGameIds = Array.from(new Set(recentlySeenGameIds.map((id) => id)));
		FetchGameUtils.fetchGames.fetchMany(_recentlySeenGameIds);
		lastFetched = Date.now();
		betterdiscord.Data.save("lastFetched", lastFetched);
		setLastPlayed(_recentlySeenGameIds);
		return;
	}
	async function setLastPlayed(g) {
		await Common.FetchApplications.fetchApplications(g);
		let titleNews = [];
		let playerList = [];
		for (let id of g) {
			const presentNews = await NewsStore.getDirectByApplicationId(id === "1402418491272986635" ? "356875570916753438" : id);
			const isNewNews = NewsStore.isNewsInDate(presentNews?.news);
			titleNews.push(isNewNews && presentNews);
			playerList.push(betterdiscord.ReactUtils.wrapInHooks(await RecentlyPlayedByApplicationId)(id));
		}
		lastPlayedCards = g.map((id, index) => {
			return {
				application: NewGameStore.getGame(id) ?? ApplicationStore.getApplication(id),
				players: playerList[index].map((player) => {
					return {
						user: UserStore.getUser(player.author_id),
						endedAt: player.ended_at ? player.ended_at : player.traits.find((trait) => trait?.is_live === true) ? void 0 : player.expires_at,
						startedAt: player.started_at,
						status: PresenceStore.getStatus(player.author_id)
					};
				}),
				titleNews: titleNews[index]
			};
		});
		dispatchMethods.emitChange();
	}
	function handleMount() {
		shouldPersistentlyFetch = true, fetchLastPlayed();
		dispatchMethods.emitChange();
	}
	function handleUnmount() {
		shouldPersistentlyFetch = false;
	}
	function handleLogout() {
		shouldPersistentlyFetch = false;
		lastPlayedCards = [];
	}
	class LastPlayedStore2 extends Common.FluxStore.Ay.Store {
		static displayName = "LastPlayedStore";
		get lastPlayedCards() {
			return lastPlayedCards;
		}
		get isMounted() {
			return shouldPersistentlyFetch;
		}
		getLastPlayed() {
			fetchLastPlayed();
			return lastPlayedCards;
		}
		get lastFetched() {
			return lastFetched;
		}
	}
	let dispatchMethods = new LastPlayedStore2(Common.FluxDispatcher, {
		"LAST_PLAYED_MOUNTED": handleMount,
		"LAST_PLAYED_UNMOUNTED": handleUnmount,
		"LOGOUT": handleLogout
	});
	return dispatchMethods;
};
const LastPlayedStore$1 = LastPlayedStore();

// activity_feed/components/now_playing/BaseBuilder.tsx
function NowPlayingColumnBuilder({ nowPlayingCards, type }) {
	return type === "NOW_PLAYING" ? nowPlayingCards.map((card) => [
		BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") ?? settings.default.v2Cards, key: card.party.priorityMembers[0].user.id }),
		betterdiscord.Data.load("cardTypeDebug") && BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: false, key: `${card.party.priorityMembers[0].user.id}-debug` })
	]) : type === "WHATS_NEW" ? nowPlayingCards.map((card) => [
		BdApi.React.createElement(WhatsNewCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") ?? settings.default.v2Cards, key: card.application.id }),
		betterdiscord.Data.load("cardTypeDebug") && BdApi.React.createElement(WhatsNewCardBuilder, { card, v2Enabled: false, key: `${card.application.id}-index` })
	]) : console.warn("Invalid card type passed to ColumnBuilder");
}
function NowPlayingBuilder(props) {
	react.useEffect(() => void Common.FluxDispatcher.dispatch({ type: "NOW_PLAYING_MOUNTED" }), []);
	const [width, height] = useWindowSize();
	const nowPlayingCards = useStateFromStores([NowPlayingViewStore], () => NowPlayingViewStore.nowPlayingCards);
	const numColumns = Math.min(Math.max(Math.floor(width / 600), 1), 2);
	const cardColumns = chunkArray(nowPlayingCards, numColumns);
	const spacer = 20 - 20 / cardColumns.length;
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: locale.Strings.NOW_PLAYING() }), nowPlayingCards.length === 0 || (betterdiscord.Data.load("freezeCards") ?? settings.default.freezeCards) ? BdApi.React.createElement("div", { className: MainClasses.emptyState }, BdApi.React.createElement("div", { className: MainClasses.emptyTitle }, locale.Strings.NOW_PLAYING_EMPTY_TITLE()), BdApi.React.createElement("div", { className: MainClasses.emptySubtitle }, locale.Strings.NOW_PLAYING_EMPTY_SUBTITLE())) : BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingContainer }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingColumn, style: { width: nowPlayingCards.length !== 1 && `calc(${100 / cardColumns.length}% - ${spacer}px)` } }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column, type: "NOW_PLAYING" })))));
}
function WhatsNewBuilder(props) {
	react.useEffect(() => void Common.FluxDispatcher.dispatch({ type: "LAST_PLAYED_MOUNTED" }), []);
	const [width, height] = useWindowSize();
	const lastPlayedCards = useStateFromStores([LastPlayedStore$1], () => LastPlayedStore$1.lastPlayedCards);
	const _lastPlayedCards = lastPlayedCards.filter((card) => card.players.length > 0);
	const numColumns = Math.min(Math.max(Math.floor(width / 600), 1), 2);
	const cardColumns = chunkArray(_lastPlayedCards, numColumns);
	const spacer = 20 - 20 / cardColumns.length;
	if (lastPlayedCards.length) {
		return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: locale.Strings.WHATS_NEW() }), BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingContainer }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingColumn, style: { width: _lastPlayedCards.length !== 1 && `calc(${100 / cardColumns.length}% - ${spacer}px)` } }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column, type: "WHATS_NEW" })))));
	}
	return;
}

// activity_feed/base.tsx
function TabBaseBuilder() {
	react.useEffect(() => void Common.FluxDispatcher.dispatch({ type: "APP_VIEW_SET_HOME_LINK", link: "/activity" }), []);
	const refDOM = react.useRef(null);
	const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "< boy i really ate my words with that one", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.14 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 8000 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time", "so sorry !", "where's kinger", "i only upload high quality discord client plugins", "losing my damn mind bruh"];
	return [
		BdApi.React.createElement(Title.WindowTitle, { location: locale.Strings.ACTIVITY() }),
		BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2Frame") ?? settings.default.v2Frame) && MainClasses.activityFeedV2, MainClasses.activityFeed) }, BdApi.React.createElement(Common.HeaderBar, { className: MainClasses.headerBar, "aria-label": locale.Strings.ACTIVITY() }, BdApi.React.createElement("div", { className: MainClasses.iconWrapper }, BdApi.React.createElement(Common.GameControllerIcon, null)), BdApi.React.createElement("div", { className: MainClasses.titleWrapper }, BdApi.React.createElement("div", { className: MainClasses.title }, locale.Strings.ACTIVITY()))), BdApi.React.createElement(Scroller, { className: MainClasses.scrollerBase, ref: refDOM, fade: true, type: "auto" }, BdApi.React.createElement("div", { className: MainClasses.centerContainer }, BdApi.React.createElement(NewsFeedBuilder, null), BdApi.React.createElement(QuickLauncherBuilder, { className: QuickLauncherClasses.quickLauncher, style: { position: "relative", padding: "0 20px 0 20px", paddingRight: "4px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: NowPlayingClasses.nowPlaying, style: { position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" } }), BdApi.React.createElement(WhatsNewBuilder, { className: NowPlayingClasses.whatsNew, style: { position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" } }), betterdiscord.Plugins.get("ActivityFeed").version.includes("dev") && BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))))
	];
}

// activity_feed/components/coachmark/IntroCoachmark.module.css
const css$1 = `
.coachmark_a64822 {
		display: flex;
		flex-direction: column;
		padding: var(--space-16);
		text-align: center;
		position: relative;
		width: 220px;
		background-color: var(--background-surface-higher);
}

.image_a64822 {
		max-height: 100%;
		max-width: 100%;
}

.body_a64822 {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-20);
		position: relative;
		z-index: 1;
}

.bodyHeader_a64822 {}

.title_a64822 {
		margin: 0;
		text-align: center;
		color: var(--text-strong);
		font-size: 16px;
		font-weight: 600;
		line-height: 1.25;
}

.bodyContent_a64822 {
		color: var(--text-subtle);
		font-size: 14px;
		font-weight: 400;
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin: 0;
}

.content_a64822 {}

.actions_a64822 {
		color: var(--text-subtle);
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0; 
}

.closeButton_a64822, .primaryButton_a64822 {
		width: 100%;
}

.buttonContent_a64822 {}`;
_loadStyle("IntroCoachmark.module.css", css$1);
const modules_95b05254 = {
	"coachmark": "coachmark_a64822",
	"image": "image_a64822",
	"body": "body_a64822",
	"bodyHeader": "bodyHeader_a64822",
	"title": "title_a64822",
	"bodyContent": "bodyContent_a64822",
	"content": "content_a64822",
	"actions": "actions_a64822",
	"closeButton": "closeButton_a64822",
	"primaryButton": "primaryButton_a64822",
	"buttonContent": "buttonContent_a64822"
};
const CoachmarkClasses = modules_95b05254;

// activity_feed/components/coachmark/IntroCoachmark.tsx
function IntroCoachmark({ close }) {
	return BdApi.React.createElement("div", { className: `${CoachmarkClasses.coachmark} ${Common.PopoverClasses.popover}` }, BdApi.React.createElement("div", { className: Common.PopoverClasses.graphic }, BdApi.React.createElement("img", { className: CoachmarkClasses.image, alt: "", draggable: "false", src: "https://static.discord.com/assets/de14fab6de78b0fc2f679eb74b735151.svg" })), BdApi.React.createElement("div", { className: CoachmarkClasses.body }, BdApi.React.createElement("div", { className: CoachmarkClasses.bodyHeader }, BdApi.React.createElement("div", { className: CoachmarkClasses.title }, locale.Strings.ACTIVITY_FEED())), BdApi.React.createElement("div", { className: CoachmarkClasses.bodyContent }, BdApi.React.createElement("div", { className: CoachmarkClasses.content }, locale.Strings.ACTIVITY_FEED_COACHMARK_CONTENT_BODY()))), BdApi.React.createElement("div", { className: CoachmarkClasses.actions }, BdApi.React.createElement("button", { className: `${Common.ButtonManaClasses.button} ${Common.ButtonManaClasses.sm} ${Common.ButtonManaClasses.primary} ${CoachmarkClasses.primaryButton}`, type: "button", onClick: () => {
		ActivityFeedSettingsCoachmarkStore.setHasDismissedSettingsCoachmark(true);
		Common.OpenUserSettings.openUserSettings("activity_feed_panel", { section: "activity_feed_sidebar_item" });
	} }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildrenWrapper}` }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildren}` }, BdApi.React.createElement("span", { className: CoachmarkClasses.buttonContent }, `${locale.Strings.TAKE_ME_THERE()}!`)))), BdApi.React.createElement("button", { className: `${Common.ButtonManaClasses.button} ${Common.ButtonManaClasses.sm} ${Common.ButtonManaClasses.secondary} ${CoachmarkClasses.closeButton}`, type: "button", onClick: () => {
		ActivityFeedSettingsCoachmarkStore.setHasDismissedSettingsCoachmark(true);
	} }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildrenWrapper}` }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildren}` }, BdApi.React.createElement("span", { className: CoachmarkClasses.buttonContent }, locale.Strings.CLOSE()))))), BdApi.React.createElement("div", { className: `${Common.CaretClasses.caret} ${Common.CaretClasses["caret--bottom"]} ${Common.CaretClasses["caret--start"]}` }, BdApi.React.createElement("svg", { width: "22", height: "14", viewBox: "0 0 22 14", fill: "none", className: Common.PopoverClasses.caretIcon }, BdApi.React.createElement("path", { className: Common.PopoverClasses.caretFill, d: "M14.0535 9.39127C12.4557 11.2796 9.54425 11.2796 7.94646 9.39127L1 1Q0 0 1 0L21 0Q22 0 21 1L14.0535 9.39127Z" }), BdApi.React.createElement("mask", { id: "mask0_caret", maskUnits: "userSpaceOnUse", x: "0", y: "0", width: "22", height: "11", style: { maskType: "alpha" } }, BdApi.React.createElement("path", { className: Common.PopoverClasses.caretFill, d: "M14.0535 9.39126C12.4557 11.2796 9.54425 11.2796 7.94646 9.39126L1 1Q0 0 1 0L21 0Q22 0 21 1L14.0535 9.39126Z" })), BdApi.React.createElement("g", { mask: "url(mask0_caret)" }, BdApi.React.createElement("path", { className: Common.PopoverClasses.caretStroke, d: "M13.6572 9.13184C12.2604 10.761 9.73957 10.761 8.34277 9.13184L1.0869141 0.5Q0.0869141 -0.5 1.0869141 -0.5L20.9131 -0.5Q21.9131 -0.5 20.9131 0.5L13.6572 9.13184Z" })))));
}
function IntroCoachmarkPopout({ button }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const isShouldShow = betterdiscord.Hooks.useStateFromStores(ActivityFeedSettingsCoachmarkStore, () => ActivityFeedSettingsCoachmarkStore.hasDismissedSettingsCoachmark);
	const refDOM = react.useRef(null);
	react.useEffect(() => {
		setShowPopout(!isShouldShow);
	});
	return BdApi.React.createElement("div", { ref: refDOM }, BdApi.React.createElement(
		Common.Popout,
		{
			shouldShow: showPopout,
			position: "top",
			targetElementRef: refDOM,
			onRequestClose: () => {
				setShowPopout(false);
				ActivityFeedSettingsCoachmarkStore.setHasDismissedSettingsCoachmark(true);
			},
			renderPopout: () => BdApi.React.createElement(IntroCoachmark, { close: () => setShowPopout(false) }),
			children: () => BdApi.React.createElement("div", null, button)
		}
	));
}

// settings/ActivityFeedSettings.module.css
const css = `
.container__97b5e {
		display: flex;
		flex-direction: column;
		gap: 8px;
}

.external__97b5e {
		margin-bottom: var(--space-20);
}

.settingsDivider__97b5e {
		margin-bottom: var(--space-12) !important;
}

.subtitleContainer__97b5e {
		color: var(--text-muted);
		font-size: 14px;
}

.itemContainer__97b5e {
		display: flex;
}

.itemContainer__97b5e .itemIcon__97b5e {
		border-radius: 8px;
		height: 32px;
		width: 32px;
}

.itemContainer__97b5e .itemName__97b5e, .itemContainer__97b5e .itemTextContainer__97b5e {
		margin-left: 20px;
		margin-bottom: 0;
		min-width: 0;
		font-weight: 500;
		align-content: center;
		flex: 1;
		font-size: 14px;
		line-height: 18px;
}

.itemContainer__97b5e .itemTextContainer__97b5e > .itemName__97b5e {
		margin-left: 0;
}

.itemContainer__97b5e .itemDescription__97b5e {}

.unfollowButton__97b5e {
		flex: 0 1 auto;
		font-weight: 400;
		align-self: center;
		width: auto;
		margin-left: 20px;
		border-radius: var(--radius-xs);
		color: var(--text-subtle) !important;
}

.search__97b5e {
		padding: 12px;
		margin: 5px 0 20px 0;
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

.toggleStack__97b5e {
		display: flex;
		flex-direction: column;
		padding: var(--space-16) 0 var(--space-16) 0;
		gap: 20px;
}

.buttonItem__97b5e {
		display: flex;
}

.radioItem__97b5e {
		display: flex;
		flex-direction: column;
}

.emptyApplications__97b5e {
		-webkit-box-align: center;
		-webkit-box-direction: normal;
		-webkit-box-orient: vertical;
		align-items: center;
		background-color: var(--background-base-lowest);
		border: 1px solid var(--primary-700);
		border-radius: var(--radius-xs);
		display: flex;
		flex-direction: column;
		margin-top: 16px;
		position: relative;

}

.emptyApplicationsImage__97b5e {
		background-image: url('https://static.discord.com/assets/323ba4bf50c8a669daa085cea17561cb.svg');
		height: 80px;
		margin-top: 32px;
		width: 195px;
}

.emptyApplicationsTitle__97b5e {
		font-size: 16px;
		line-height: 20px;
		margin-top: 16px;
}

.emptyApplicationsBody__97b5e {
		color: var(--text-subtle);
		font-size: 14px;
		line-height: 18px;
		margin-bottom: 32px;
		margin-top: 8px;
		padding: 0 80px;
		text-align: center;
}

.newspaperIcon__97b5e {}`;
_loadStyle("ActivityFeedSettings.module.css", css);
const modules_a52d5642 = {
	"container": "container__97b5e",
	"external": "external__97b5e",
	"settingsDivider": "settingsDivider__97b5e",
	"subtitleContainer": "subtitleContainer__97b5e",
	"itemContainer": "itemContainer__97b5e",
	"itemIcon": "itemIcon__97b5e",
	"itemName": "itemName__97b5e",
	"itemTextContainer": "itemTextContainer__97b5e",
	"itemDescription": "itemDescription__97b5e",
	"unfollowButton": "unfollowButton__97b5e",
	"search": "search__97b5e",
	"toggleStack": "toggleStack__97b5e",
	"buttonItem": "buttonItem__97b5e",
	"radioItem": "radioItem__97b5e",
	"emptyApplications": "emptyApplications__97b5e",
	"emptyApplicationsImage": "emptyApplicationsImage__97b5e",
	"emptyApplicationsTitle": "emptyApplicationsTitle__97b5e",
	"emptyApplicationsBody": "emptyApplicationsBody__97b5e",
	"newspaperIcon": "newspaperIcon__97b5e"
};
const SettingsClasses = modules_a52d5642;

// activity_feed/extra.js
const styles = Object.assign(
	{
		wrapper: betterdiscord.Webpack.getByKeys("wrapper", "svg", "mask").wrapper,
		customButtons: betterdiscord.Webpack.getByKeys("customButtons", "absolute").customButtons,
		hasText: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).hasText,
		sm: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).sm,
		interactiveSelected: betterdiscord.Webpack.getByKeys("icon", "upperContainer").interactiveSelected,
		lookFilled: betterdiscord.Webpack.getByKeys("colorPrimary", "grow").lookFilled,
		colorPrimary: betterdiscord.Webpack.getByKeys("colorPrimary", "grow").colorPrimary,
		contents: betterdiscord.Webpack.getByKeys("colorPrimary", "grow").contents,
		popoutContentWrapper: betterdiscord.Webpack.getByKeys("popoutContentWrapper").popoutContentWrapper
	},
	Object.getOwnPropertyDescriptors(betterdiscord.Webpack.getByKeys("tabularNumbers")),
	MainClasses,
	FeedClasses,
	NowPlayingClasses,
	QuickLauncherClasses,
	SettingsClasses
);
const extraCSS = webpackify(`\n  	.nowPlayingColumn .tabularNumbers {\n  			color: var(--text-default) !important;\n  	}\n\n  	.nowPlayingColumn :is(.actionsActivity, .customButtons) {\n  			gap: 8px;\n  	}\n\n  	.customButtons {\n  			display: flex;\n  			flex-direction: column;\n  	}\n\n  	.activityContainer:last-child:not(:only-child, :nth-child(1 of .activityContainer)) .sectionDivider {\n  			display: none;\n  	}\n\n  	.nowPlaying .sectionDivider:last-child {\n  			display: none;\n  	}\n\n  	.activity .serviceButtonWrapper .sm:not(.hasText) {\n  			padding: 0;\n  			width: calc(var(--custom-button-button-sm-height) + 4px);\n  	}\n\n  	.content [role="progressbar"] {\n  			background-color: var(--opacity-white-24);\n  	}\n\n  	.partyStatusWrapper .disabledButtonWrapper {\n  			flex: 1;\n  	}\n\n  	.partyStatusWrapper .disabledButtonOverlay {\n  			height: 24px;\n  			width: 100%;\n  	}\n\n  	.cardV2 {\n  			.headerActions :is([data-mana-component="button"], .button.lookFilled), .cardBody button {\n  					color: var(--white);\n  					background: var(--opacity-white-24) !important;\n  					&:hover {\n  							background: var(--opacity-white-36) !important;\n  					}\n  					&:active {\n  							background: var(--opacity-white-32) !important;\n  					}\n  			}\n  			.tabularNumbers {\n  					color: var(--app-message-embed-secondary-text) !important;\n  			}\n  			[role="progressbar"] {\n  					background-color: var(--opacity-white-24);\n  			}\n  			.sectionDivider {\n  					border-color: var(--opacity-white-12) !important;\n  					border-width: 1px;\n  					margin: 12px 0 12px 0;\n  			}\n  			.news {\n  					background-color: hsl(var(--black-hsl) / .7);\n  					border-radius: var(--radius-sm);\n  					margin-top: var(--space-sm);\n  					outline: 1px solid var(--border-muted);\n  					outline-offset: -1px;\n  					padding: var(--space-lg);\n  					z-index: 0;\n  					.background {\n  							mask: linear-gradient(0deg, transparent 10%, #000);\n  							z-index: -1;\n  					}\n  					.${FeedClasses.body} {\n  							display: flex;\n  							flex-direction: column;\n  							gap: var(--space-xs);\n  					}\n  					.title {\n  							color: var(--white);\n  					}\n  					.description {\n  							color: var(--white);\n  							font-size: 14px;\n  							font-weight: 400;\n  							line-height: 1.2857142857142858;\n  							margin: 0;\n  					}\n  					.timestamp {\n  							color: var(--app-message-embed-secondary-text);\n  							font-size: 12px;\n  							font-weight: 400;\n  							margin: 0;\n  							text-transform: unset;\n  					}\n  			} \n  	}\n\n  	.activityFeedV2 {\n  			.nowPlaying .emptyState {\n  					background-color: var(--background-mod-normal) !important;\n  					border-color: var(--border-normal) !important;\n  			}\n  	}\n\n  	.dockV2 {\n  			&:is(.emptyState) {\n  					background: var(--background-feedback-info);\n  					border: 1px solid var(--icon-feedback-info) !important;\n  					border-radius: var(--radius-sm);\n  					color: var(--text-feedback-info) !important;\n  					padding: 8px !important;\n  					margin-bottom: var(--space-lg);\n  			}\n  	}\n\n  	.feedCarouselV2 {\n  			.arrowContainer .contents {\n  					display: contents;\n  			}\n  	}\n\n  	.nowPlaying .emptyState {\n  			border: 1px solid;\n  			border-radius: 5px;\n  			box-sizing: border-box;\n  			margin-top: 20px;\n  			padding: 20px;\n  			width: 100%;\n  	}\n\n  	.theme-light .nowPlaying .emptyState {\n  			background-color: #fff;\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlaying .emptyState {\n  			background-color: rgba(79, 84, 92, .3);\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .quickLauncher .emptyState, .theme-light .container.emptyState {\n  			border-color: rgba(220,221,222,.6);\n  			color: #b9bbbe;\n  	}\n\n  	.theme-dark .quickLauncher .emptyState, .theme-dark .container.emptyState {\n  			border-color: rgba(47,49,54,.6);\n  			color: #72767d;\n  	}\n\n  	.theme-light .nowPlayingColumn .sectionDivider {\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlayingColumn .sectionDivider {\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-dark .voiceSectionIconWrapper {\n  			background-color: var(--primary-800);\n  	}\n\n  	.theme-light .voiceSectionIconWrapper {\n  			background: var(--primary-300);\n  	}\n\n  	.quickLauncher .emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  			align-items: center;\n  	}\n\n  	.container.emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			margin-bottom: 20px;\n  			justify-content: flex-start;\n  	}\n\n  	.container .emptyState {\n  			position: relative;\n  			padding: 0;\n  			border-bottom: unset; \n  			line-height: 1.60;\n  	}\n\n  	.container .sectionDivider, .settingsDivider {\n  			display: flex;\n  			width: 100%;\n  			border-bottom: 2px solid;\n  			margin: 4px 0 4px 0;\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.container .sectionDivider:last-child {\n  			display: none;\n  	}\n\n  	.overflowUserOverflow .wrapper {\n  			width: 30px !important;\n  			height: 30px !important;\n  	}\n\n  	[data-mana-component="layer-modal"] .followGameButtonActivityFeed {\n  			background-color: var(--control-overlay-secondary-background-default);\n  			border-color: var(--control-overlay-secondary-border-default);\n  			color: var(--control-overlay-secondary-text-default);\n  			&:hover {\n  					background-color: var(--control-overlay-secondary-background-hover) !important;\n  			}\n  			&:active {\n  					background-color: var(--control-overlay-secondary-background-active) !important; \n  			}\n  	}\n`);
function webpackify(css) {
	for (const key in styles) {
		let regex = new RegExp(`\\.${key}([\\s,.):>])`, "g");
		css = styles[key]?.value ? css.replace(regex, `.${styles[key].value}$1`) : css.replace(regex, `.${styles[key]}$1`);
	}
	return css;
}

// settings/components/sections/RefreshSection.tsx
function RefreshSection() {
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
	})));
}

// settings/components/common/ActivityFeedSettingsButton.tsx
function ActivityFeedSettingsButton({ color, onClick, text }) {
	return BdApi.React.createElement(Common.Flex, { grow: true }, BdApi.React.createElement(
		"button",
		{
			className: `${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${MainClasses.button} ${SettingsClasses.unfollowButton}`,
			onClick,
			style: { color: `var(--${color})` }
		},
		text
	));
}

// settings/components/common/ButtonItem.tsx
function ButtonItem({ label, description, innerText, onClick }) {
	return BdApi.React.createElement("div", { className: SettingsClasses.buttonItem }, BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1 } }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`, style: { fontWeight: 500, fontSize: "16px", color: "var(--text-strong)" } }, label), description && BdApi.React.createElement("div", { className: NowPlayingClasses.textRow }, description)), BdApi.React.createElement(ActivityFeedSettingsButton, { color: "text-subtle", onClick, text: innerText }));
}

// settings/components/common/RadioItem.tsx
function RadioItem({ optionKey, label, description, options, setting, setState }) {
	return BdApi.React.createElement("div", { className: SettingsClasses.radioItem }, BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1, marginBottom: "var(--space-10)" } }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`, style: { fontWeight: 500, fontSize: "16px", color: "var(--text-strong)" } }, label), description && BdApi.React.createElement("div", { className: NowPlayingClasses.textRow }, description)), BdApi.React.createElement(
		betterdiscord.Components.RadioInput,
		{
			value: setting,
			options,
			onChange: (v) => {
				betterdiscord.Data.save(optionKey, v);
				setState(v);
			}
		}
	));
}

// settings/components/sections/AdvancedSection.tsx
function AdvancedSection() {
	return BdApi.React.createElement("div", { className: SettingsClasses.toggleStack }, Object.keys(settings.debug).map((key) => {
		const { name, note, innerText, initial, type, changed, options, onClick } = settings.debug[key];
		const [state, setState] = react.useState(betterdiscord.Data.load(key));
		switch (type) {
			case "switch":
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
			case "radio":
				return BdApi.React.createElement(
					RadioItem,
					{
						optionKey: key,
						label: name,
						description: note,
						options,
						setting: state ?? initial,
						setState: () => setState
					}
				);
			case "button":
				return BdApi.React.createElement(
					ButtonItem,
					{
						label: name,
						description: note,
						innerText,
						onClick
					}
				);
			default:
				return;
		}
	}));
}

// settings/components/sections/followed_games/ExternalSources.tsx
function ExternalItemBuilder({ service }) {
	const item = settings.external[service];
	const [state, setState] = react.useState(betterdiscord.Data.load("external")?.[service] || item.enabled);
	const handleSubscribe = (props) => BdApi.React.createElement(
		Common.ModalRoot.Modal,
		{
			...props,
			title: locale.Strings.ARE_YOU_SURE(),
			actions: [
				{ text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
				{ text: locale.Strings.YES(), fullWidth: 1, onClick: () => {
					betterdiscord.Data.save("external", { ...betterdiscord.Data.load("external"), [service]: true });
					setState(true);
					props.onClose();
				} }
			]
		},
		BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_SUBSCRIBE_TO_EXTERNAL()), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()))
	);
	const handleUnsubscribe = (props) => BdApi.React.createElement(
		Common.ModalRoot.Modal,
		{
			...props,
			title: locale.Strings.ARE_YOU_SURE(),
			actions: [
				{ text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
				{ text: locale.Strings.YES(), fullWidth: 1, onClick: () => {
					betterdiscord.Data.save("external", { ...betterdiscord.Data.load("external"), [service]: false });
					setState(false);
					props.onClose();
				} }
			]
		},
		BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_EXTERNAL()), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()))
	);
	return BdApi.React.createElement("div", { className: SettingsClasses.itemContainer, style: { display: "flex" } }, BdApi.React.createElement(item.icon, { className: SettingsClasses.itemIcon, color: "WHITE", style: { backgroundColor: item.color, padding: "5px" } }), BdApi.React.createElement("div", { className: SettingsClasses.itemTextContainer }, BdApi.React.createElement("div", { className: SettingsClasses.itemName }, item.name || "Unknown Source"), item.note && BdApi.React.createElement("div", { className: `${SettingsClasses.itemDescription} ${MainClasses.emptySubtitle}` }, item.note)), !state ? BdApi.React.createElement(ActivityFeedSettingsButton, { text: locale.Strings.FOLLOW(), color: "text-subtle", onClick: () => Common.ModalSystem.openModal((props) => handleSubscribe(props)) }) : BdApi.React.createElement(ActivityFeedSettingsButton, { text: locale.Strings.UNFOLLOW(), color: "text-subtle", onClick: () => Common.ModalSystem.openModal((props) => handleUnsubscribe(props)) }));
}
function ExternalSourcesListBuilder() {
	return BdApi.React.createElement("div", { className: SettingsClasses.container }, Object.keys(settings.external).map((key) => {
		return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(ExternalItemBuilder, { service: key, key }), BdApi.React.createElement("div", { className: MainClasses.sectionDivider }));
	}));
}

// settings/components/sections/followed_games/FollowedGames.tsx
function FollowedGameEmptyBuilder() {
	return BdApi.React.createElement("div", { className: SettingsClasses.emptyApplications }, BdApi.React.createElement("div", { className: SettingsClasses.emptyApplicationsImage }), BdApi.React.createElement("div", { className: `${Common.TextFormatClasses.defaultColor} ${SettingsClasses.emptyApplicationsTitle}` }, locale.Strings.ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_TITLE()), BdApi.React.createElement("div", { className: `${SettingsClasses.emptyApplicationsBody}` }, locale.Strings.ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_SUBTITLE()));
}
function FollowedGameItemBuilder({ game, gameList, updateGameList }) {
	const [shouldFallback, setShouldFallback] = react.useState(false);
	const isFollowed = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(game?.applicationId));
	const isWhitelisted = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameWhitelisted(game?.applicationId));
	const application = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplication(game.applicationId));
	const handleUnsubscribe = (props) => BdApi.React.createElement(
		Common.ModalRoot.Modal,
		{
			...props,
			title: locale.Strings.ARE_YOU_SURE(),
			actions: [
				{ text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
				{ text: locale.Strings.YES(), fullWidth: 1, onClick: () => {
					isFollowed && updateGameList(gameList.filter((item) => item.applicationId !== game.applicationId));
					NewsStore.blacklistGame(application, game?.gameId);
					props.onClose();
				} }
			]
		},
		BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME()), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()))
	);
	const handleSubscribe = (props) => BdApi.React.createElement(
		Common.ModalRoot.Modal,
		{
			...props,
			title: locale.Strings.ARE_YOU_SURE(),
			actions: [
				{ text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose() },
				{ text: locale.Strings.YES(), fullWidth: 1, onClick: () => {
					NewsStore.whitelistGame(game.gameId);
					props.onClose();
				} }
			]
		},
		BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_SUBSCRIBE_TO_GAME()), BdApi.React.createElement("div", { className: MainClasses.emptyText, style: { fontWeight: 600 } }, locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()))
	);
	return BdApi.React.createElement("div", { className: SettingsClasses.itemContainer, style: { display: "flex" } }, shouldFallback && !application ? BdApi.React.createElement(FallbackAsset, { className: SettingsClasses.itemIcon }) : BdApi.React.createElement(
		"img",
		{
			className: SettingsClasses.itemIcon,
			src: application?.getIconURL(64, "webp"),
			onError: () => setShouldFallback(true)
		}
	), BdApi.React.createElement("div", { className: SettingsClasses.itemName }, application?.name || "Unknown Game"), isFollowed || isWhitelisted ? BdApi.React.createElement(ActivityFeedSettingsButton, { text: locale.Strings.UNFOLLOW(), color: "text-subtle", onClick: () => Common.ModalSystem.openModal((props) => handleUnsubscribe(props)) }) : BdApi.React.createElement(ActivityFeedSettingsButton, { text: locale.Strings.FOLLOW(), color: "text-subtle", onClick: () => Common.ModalSystem.openModal((props) => handleSubscribe(props)) }));
}
function FollowedGameListBuilder() {
	const whitelist = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getWhitelist());
	const followedGames = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.getManuallyFollowedGames());
	const areGamesLoaded = betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.haveSettingsBeenOpened());
	const [allGames, updateAllGames] = react.useState(whitelist.concat(followedGames));
	const [query, setQuery] = react.useState("");
	react.useEffect(() => {
		(async () => {
			const gameIds = allGames.map((game) => game.applicationId);
			let idOverflow = [];
			if (gameIds.length > 112) {
				for (let i = 0; i < gameIds.length; i++) {
					if (i % 112 === 0) {
						idOverflow.push(gameIds.splice(0, 112));
					}
				}
				await Common.FetchApplications.fetchApplications(gameIds);
				idOverflow.map(async (idSplit) => {
					return await Common.FetchApplications.fetchApplications(idSplit);
				});
			} else {
				await Common.FetchApplications.fetchApplications(gameIds);
			}
			NewsStore.setHaveSettingsBeenOpened(true);
		})();
	}, [allGames]);
	const filtered = react.useMemo(() => {
		const _query = query.toLowerCase();
		return allGames?.filter((item) => item?.name?.toLowerCase().includes(_query));
	}, [allGames, query]);
	if (!allGames || !allGames.length || !areGamesLoaded) return BdApi.React.createElement(FollowedGameEmptyBuilder, null);
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(betterdiscord.Components.SearchInput, { className: SettingsClasses.search, onChange: (e) => setQuery(e.target.value.toLowerCase()), placeholder: locale.Strings.SEARCH_FOR_GAMES() }), filtered?.length ? BdApi.React.createElement("div", { className: SettingsClasses.container }, filtered.sort((a, b) => a.name.localeCompare(b.name)).map(
		(game) => BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(FollowedGameItemBuilder, { game, gameList: allGames, updateGameList: updateAllGames, key: game.applicationId }), BdApi.React.createElement("div", { className: MainClasses.sectionDivider }))
	)) : BdApi.React.createElement("div", { className: `${SettingsClasses.container} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.NO_RESULTS_FOUND())));
}

// settings/components/common/SidebarItemIcon.tsx
function NewspaperIcon() {
	return BdApi.React.createElement(
		"svg",
		{
			className: SettingsClasses.newspaperIcon,
			role: "img",
			width: "20",
			height: "20",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		},
		BdApi.React.createElement("defs", null, BdApi.React.createElement("mask", { id: "newspaper-mask" }, BdApi.React.createElement("rect", { width: "24", height: "24", fill: "#fff", stroke: "none" }), BdApi.React.createElement("g", { stroke: "#000" }, BdApi.React.createElement("path", { d: "M15 18h-5" }), BdApi.React.createElement("path", { d: "M18 14h-8" }), BdApi.React.createElement("path", { d: "M10 6h8v4h-8V6Z" })))),
		BdApi.React.createElement("path", { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z", fill: "currentColor", mask: "url(#newspaper-mask)" }),
		BdApi.React.createElement("path", { d: "M4 22a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" })
	);
}

// settings/components/PanelBuilder.tsx
let LayoutTypes = {
	SECTION: 1,
	SIDEBAR_ITEM: 2,
	PANEL: 3,
	CATEGORY: 5,
	ACCORDION: 6,
	CUSTOM: 19
};
const SettingsItem = async () => {
	const result = await betterdiscord.Utils.forceLoad(betterdiscord.Webpack.getBySource("USER_SETTINGS_MODAL_KEY", "openModalLazy", '"replaceAll"', { raw: true }).id);
	if (result) {
		const layoutUtils = betterdiscord.Webpack.getMangled(
			betterdiscord.Webpack.Filters.bySource("$Root", ".ACCORDION"),
			{
				Panel: (x) => String(x).includes(".PANEL,"),
				Button: (x) => String(x).includes(".BUTTON,"),
				SidebarItem: (x) => String(x).includes(".SIDEBAR_ITEM,"),
				Category: (x) => String(x).includes(".CATEGORY,"),
				Custom: (x) => String(x).includes(".CUSTOM,"),
				Accordion: (x) => String(x).includes(".ACCORDION,")
			}
		);
		const refreshObj = layoutUtils.Custom(
			"activity_feed_visual_refresh",
			{
				Component: () => BdApi.React.createElement(RefreshSection, null),
				key: "activity_feed_visual_refresh_setting",
				type: LayoutTypes.CUSTOM
			}
		);
		const gamesFollowedObj = layoutUtils.Custom(
			"activity_feed_games_you_follow",
			{
				Component: () => BdApi.React.createElement(FollowedGameListBuilder, null),
				key: "activity_feed_games_you_follow_setting",
				type: LayoutTypes.CUSTOM
			}
		);
		const externalNewsObj = layoutUtils.Custom(
			"activitry_feed_external_news",
			{
				Component: () => BdApi.React.createElement(ExternalSourcesListBuilder, null),
				key: "activity_feed_external_news_setting",
				type: LayoutTypes.CUSTOM
			}
		);
		const advancedObj = layoutUtils.Accordion(
			"activity_feed_advanced_accordion",
			{
				buildLayout: () => [
					layoutUtils.Custom(
						"activity_feed_advanced",
						{
							Component: () => BdApi.React.createElement(AdvancedSection, null),
							key: "activity_feed_advanced_setting",
							type: LayoutTypes.CUSTOM
						}
					)
				],
				key: "activity_feed_advanced_accordion",
				type: LayoutTypes.ACCORDION,
				useTitle: (opened) => opened ? locale.Strings.ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_OPEN() : locale.Strings.ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_CLOSED(),
				useCollapsedSubtitle: () => locale.Strings.ACTIVITY_FEED_SETTINGS_ADVANCED_DESCRIPTION()
			}
		);
		const categoryObjs = [
			layoutUtils.Category(
				"activity_feed_visual_refresh_category",
				{
					buildLayout: () => [refreshObj],
					type: LayoutTypes.CATEGORY,
					useTitle: () => locale.Strings.VISUAL_REFRESH(),
					useSubtitle: () => BdApi.React.createElement("div", { className: `${SettingsClasses.subtitleContainer}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_HEADER_DESCRIPTION_VISUAL_REFRESH()))
				}
			),
			layoutUtils.Category(
				"activity_feed_games_you_follow_category",
				{
					buildLayout: () => [gamesFollowedObj],
					type: LayoutTypes.CATEGORY,
					useTitle: () => locale.Strings.GAMES_YOU_FOLLOW(),
					useSubtitle: () => BdApi.React.createElement("div", { className: `${SettingsClasses.subtitleContainer}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_HEADER_DESCRIPTION_GAMES_YOU_FOLLOW()))
				}
			),
			layoutUtils.Category(
				"activity_feed_external_news_category",
				{
					buildLayout: () => [externalNewsObj],
					type: LayoutTypes.CATEGORY,
					useTitle: () => locale.Strings.EXTERNAL_NEWS(),
					useSubtitle: () => BdApi.React.createElement("div", { className: `${SettingsClasses.external} ${SettingsClasses.subtitleContainer}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, locale.Strings.ACTIVITY_FEED_HEADER_DESCRIPTION_EXTERNAL_SOURCES()))
				}
			),
			layoutUtils.Category(
				"activity_feed_advanced_category",
				{
					buildLayout: () => [advancedObj],
					type: LayoutTypes.CATEGORY,
					useTitle: () => locale.Strings.ADVANCED()
				}
			)
		];
		const panelObj = layoutUtils.Panel(
			"activity_feed_panel",
			{
				buildLayout: () => categoryObjs,
				key: "activity_feed_panel",
				type: LayoutTypes.PANEL,
				useTitle: () => "Activity Feed"
			}
		);
		const sidebarItem = layoutUtils.SidebarItem(
			"activity_feed_sidebar_item",
			{
				buildLayout: () => [panelObj],
				icon: () => BdApi.React.createElement(NewspaperIcon, null),
				key: "activity_feed_sidebar_item",
				getLegacySearchKey: () => "ACTIVITY_FEED",
				useTitle: () => "Activity Feed",
				type: LayoutTypes.SIDEBAR_ITEM
			}
		);
		return sidebarItem;
	}
};

// index.ts
function useSelectedState() {
	return Router.useLocation().pathname.startsWith("/activity");
}
function NavigatorButton() {
	return react.createElement(
		Common.LinkButton,
		{
			selected: useSelectedState(),
			route: "/activity",
			text: locale.Strings.ACTIVITY(),
			icon: () => {
				return react.createElement(Common.GameControllerIcon, { color: "currentColor", className: Common.LinkButtonClasses.linkButtonIcon });
			}
		}
	);
}
function CoachmarkWrapper({ button }) {
	if (useSelectedState() && !ActivityFeedSettingsCoachmarkStore.hasDismissedSettingsCoachmark) {
		return react.createElement(IntroCoachmarkPopout, { button });
	}
	return button;
}
class ActivityFeed {
	GameNewsStore = NewsStore;
	NewsArticle = NewsArticle;
	LastPlayedStore = LastPlayedStore$1;
	ActivityFeedSettingsCoachmarkStore = ActivityFeedSettingsCoachmarkStore;
	PresenceTypeStore = PresenceTypeStore;
	FollowButton = FollowButton;
	NewsCard = CardMiniNews;
	i18n = locale;
	async start() {
		const settingsItem = await SettingsItem();
		NewsStore.whitelist = betterdiscord.Data.load("whitelist");
		NewsStore.blacklist = betterdiscord.Data.load("blacklist") || [];
		setInterval(async () => {
			if (NewsStore.shouldFetch() === true) await NewsStore.fetchFeeds();
		}, 100);
		let ContentInventoryCard = betterdiscord.Webpack.getMangled(betterdiscord.Webpack.Filters.bySource("disableGameProfileLinks", "ANDROID"), {
			ContentInventoryCardHeader: (x) => String(x).includes('"ContentPopout"')
		}, { mapDeclarations: true });
		let GameProfileModal;
		const [appContentModule, appContentKey] = betterdiscord.Webpack.getWithKey(betterdiscord.Webpack.Filters.byStrings("GUILD_MEMBER_VERIFICATION"), {
			target: betterdiscord.Webpack.getBySource("hasNotice", "AppView", { raw: true }).declarations
		});
		if (appContentModule) {
			betterdiscord.Patcher.after(appContentModule, appContentKey, (that, args, ret) => {
				const { children } = betterdiscord.Utils.findInTree(ret, (node) => node && node.children?.length > 5 && node.children.some((c) => c?.props?.path), { walkable: ["children", "props"] }) ?? {};
				children[0].props = {
					disableTrack: true,
					path: "/activity",
					render: () => react.createElement(TabBaseBuilder),
					exact: true
				};
			});
			const patchedFn = appContentModule[appContentKey];
			const inst = betterdiscord.ReactUtils.getOwnerInstance(document.querySelector(`.${container}`));
			if (inst) {
				betterdiscord.Patcher.after(inst, "render", (that, args, res) => {
					if (res?.props?.children) {
						res.props.children = { ...res.props.children, type: patchedFn };
					}
				});
				inst.forceUpdate();
			}
		}
		betterdiscord.DOM.addStyle("activityFeedCSS", styles$1());
		betterdiscord.DOM.addStyle("activityFeedSupplementalCSS", extraCSS);
		betterdiscord.Patcher.after(betterdiscord.Webpack.getBySource(".A.CONTACTS_LIST"), "A", (that, [props], res) => {
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
			const index = panel.children.findIndex((m) => m?.key === "activity");
			if (index !== -1) return;
			panel.children.unshift(
				react.createElement(NavigatorButton, { key: "activity" })
			);
		});
		betterdiscord.Patcher.before(Common.GameFetchModule, "E", (thisObj, args) => {
			const filtered = args[0].filter((x) => !isNaN(x));
			args[0] = filtered;
			return args;
		});
		await SettingsRoot.then((e) => betterdiscord.Patcher.after(e, "buildLayout", (that, [props], res) => {
			let index = res.findIndex((layout) => layout.key === "activity_section");
			betterdiscord.Patcher.after(res[index], "buildLayout", (that2, [props2], res2) => {
				if (!betterdiscord.Utils.findInTree(res2, (tree) => Object.values(tree).includes("activity_feed_sidebar_item", { walkable: ["props", "children"] }))) {
					res2.push(settingsItem);
				}
				return res2;
			});
		}));
		betterdiscord.Patcher.after(SettingsButton, "Button", (that, [props], res) => {
			return react.createElement(CoachmarkWrapper, { button: res });
		});
		betterdiscord.Patcher.after(ContentInventoryCard, "ContentInventoryCardHeader", (that, [props], res) => {
			const hero = betterdiscord.Utils.findInTree(res, (tree) => tree && tree.backgroundImgSrc);
			const entry = props.entry;
			const application = ApplicationStore.getApplication(entry.extra.application_id);
			entry.extra.type === "played_game_extra" && hero.children.push(react.createElement(FollowButton, { application, fullWidth: true }));
		});
		await betterdiscord.Webpack.waitForModule(betterdiscord.Webpack.Filters.bySource('"game_profile"', ".DISCORD")).then((e) => {
			GameProfileModal = betterdiscord.Webpack.getMangled(betterdiscord.Webpack.Filters.bySource('"game_profile"', ".DISCORD"), {
				GameProfileV2Trailing: (x) => String(x).includes('"game-profile-add-favorite-game"')
			}, { mapDeclarations: true });
			betterdiscord.Patcher.after(GameProfileModal, "GameProfileV2Trailing", (that, [props], res) => {
				const game = props.game;
				const application = ApplicationStore.getApplication(game.id) ?? ApplicationStore.getApplicationByName(game.name);
				res.props.children.splice(0, 0, react.createElement(FollowButton, { application, fullWidth: true }));
			});
		});
	}
	stop() {
		Common.FluxDispatcher.dispatch({ type: "NOW_PLAYING_UNMOUNTED" });
		Common.FluxDispatcher.dispatch({ type: "LAST_PLAYED_UNMOUNTED" });
		betterdiscord.Patcher.unpatchAll("ActivityFeed");
		betterdiscord.DOM.removeStyle("activityFeedCSS");
		betterdiscord.DOM.removeStyle("activityFeedSupplementalCSS");
		betterdiscord.ReactUtils.getOwnerInstance(document.querySelector(`.${container}`)).forceUpdate();
	}
}

module.exports = ActivityFeed;

/*@end@*/