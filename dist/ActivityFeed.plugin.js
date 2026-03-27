/**
 * @name ActivityFeed
 * @author KingGamingYT
 * @description A from-the-ground-up recreation of Discord's Activity Feed tab circa late 2018-early 2019, featuring game news, a quick launcher, and friend activity with modern touches.
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
	{ name: "ActivitySectionModule", filter: (x) => x.key === "activity_section", searchExports: true },
	{ name: "ActivityTimer", filter: betterdiscord.Webpack.Filters.byStrings("timestamps", ".TEXT_FEEDBACK_POSITIVE"), searchExports: true },
	{ name: "AnchorClasses", filter: betterdiscord.Webpack.Filters.byKeys("anchor", "anchorUnderlineOnHover"), searchExports: true },
	{ name: "Animated", filter: (x) => x.Easing && x.accelerate },
	{ name: "AvatarFetch", filter: betterdiscord.Webpack.Filters.byStrings("src", "statusColor", "size", "isMobile"), searchExports: true },
	{ name: "ButtonVoidClasses", filter: betterdiscord.Webpack.Filters.byKeys("lookFilled", "button") },
	{ name: "ButtonManaClasses", filter: (x) => x.primary && x.hasText && !x.hasTrailing },
	{ name: "CallButtons", filter: betterdiscord.Webpack.Filters.byStrings("PRESS_JOIN_CALL_BUTTON") },
	{ name: "CaretClasses", filter: betterdiscord.Webpack.Filters.byKeys("caret", "caret--center") },
	{ name: "CardPopout", filter: betterdiscord.Webpack.Filters.byStrings("party", "close", "onSelect"), searchExports: true },
	{ name: "Clipboard", filter: betterdiscord.Webpack.Filters.byStrings("navigator.clipboard.write"), searchExports: true },
	{ name: "DMSidebar", filter: betterdiscord.Webpack.Filters.bySource(".A.CONTACTS_LIST") },
	{ name: "Endpoints", filter: betterdiscord.Webpack.Filters.byKeys("GUILD_EMOJI", "GUILD_EMOJIS"), searchExports: true },
	{ name: "FetchApplications", filter: betterdiscord.Webpack.Filters.byKeys("fetchApplication") },
	{ name: "FetchGames", filter: betterdiscord.Webpack.Filters.bySource(".GAME", "fetchMany"), searchExports: true },
	{ name: "FetchUtils", filter: (x) => typeof x === "object" && x.del && x.put, searchExports: true },
	{ name: "FluxDispatcher", filter: betterdiscord.Webpack.Filters.byKeys("dispatch", "subscribe", "register"), searchExports: true },
	{ name: "FormSwitch", filter: betterdiscord.Webpack.Filters.byStrings('"data-toggleable-component":"switch"', 'layout:"horizontal"'), searchExports: true },
	{ name: "GameFetchModule", filter: betterdiscord.Webpack.Filters.bySource('type:"GAME_FETCH_SUCCESS",gameIds:') },
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
	{ name: "OpenUserSettings", filter: (x) => x.openUserSettings },
	{ name: "Popout", filter: betterdiscord.Webpack.Filters.byStrings("Unsupported animation config:"), searchExports: true },
	{ name: "PopoutContainer", filter: betterdiscord.Webpack.Filters.byStrings("type", "position", "data-popout-animating"), searchExports: true },
	{ name: "PopoverClasses", filter: (x) => x.graphic && x.closeButton },
	{ name: "PositionClasses", filter: betterdiscord.Webpack.Filters.byKeys("noWrap") },
	{ name: "ReactSpring", filter: betterdiscord.Webpack.Filters.byKeys("useSpring", "a") },
	{ name: "RestAPI", filter: (x) => typeof x === "object" && x.del && x.put, searchExports: true },
	{ name: "RootSectionModule", filter: (x) => x?.key === "$Root", searchExports: true },
	{ name: "SettingsButton", filter: betterdiscord.Webpack.Filters.bySource("webBuildOverride") },
	{ name: "Spinner", filter: betterdiscord.Webpack.Filters.byStrings('="wanderingCubes'), searchExports: true },
	{ name: "SpotifyButtons", filter: betterdiscord.Webpack.Filters.byStrings("activity", "PRESS_PLAY_ON_SPOTIFY_BUTTON") },
	{ name: "Tooltip", filter: betterdiscord.Webpack.Filters.byPrototypeKeys("renderTooltip"), searchExports: true },
	{ name: "TransitionGroup", filter: betterdiscord.Webpack.Filters.byStrings("transitionAppear"), searchExports: true },
	{ name: "UpperIconClasses", filter: betterdiscord.Webpack.Filters.byKeys("icon", "upperContainer") },
	{ name: "UseStreamPreviewURL", filter: betterdiscord.Webpack.Filters.byStrings(".canBasicChannel", "previewUrl:", ".CONNECT", "getVoiceChannelId") },
	{ name: "VoiceList", filter: betterdiscord.Webpack.Filters.byStrings("maxUsers", "guildId", "getNickname") },
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
const layoutUtils = betterdiscord.Webpack.getMangled(
	betterdiscord.Webpack.Filters.bySource("$Root", ".ACCORDION"),
	{
		Panel: (x) => String(x).includes(".PANEL,"),
		Button: (x) => String(x).includes(".BUTTON,"),
		SidebarItem: (x) => String(x).includes(".SIDEBAR_ITEM,"),
		Category: (x) => String(x).includes(".CATEGORY,"),
		Custom: (x) => String(x).includes(".CUSTOM,")
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

// styles
let _styles = "";
function _loadStyle(path, css) {
	_styles += "/*" + path + "*/\n" + css + "\n";
}
function styles$1() {
	return _styles;
}

// settings/ActivityFeedSettings.module.css
const css$5 = `
.blacklist__97b5e {
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

.blacklistItem__97b5e {
		display: flex;
}

.blacklistItem__97b5e .blacklistItemIcon__97b5e {
		border-radius: 8px;
		height: 32px;
		width: 32px;
}

.blacklistItem__97b5e .blacklistItemName__97b5e, .blacklistItem__97b5e .blacklistItemTextContainer__97b5e {
		margin-left: 20px;
		margin-bottom: 0;
		min-width: 0;
		font-weight: 500;
		align-content: center;
		flex: 1;
}

.blacklistItem__97b5e .blacklistItemTextContainer__97b5e > .blacklistItemName__97b5e {
		margin-left: 0;
}

.blacklistItem__97b5e .blacklistItemDescription__97b5e {}

.blacklistItem__97b5e button {
		flex: 0 1 auto;
		align-self: center;
		width: auto;
		margin-left: 20px;
}

.search__97b5e {
		padding: 12px;
		margin: 20px 0;
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

.newspaperIcon__97b5e {}`;
_loadStyle("ActivityFeedSettings.module.css", css$5);
const modules_a52d5642 = {
	"blacklist": "blacklist__97b5e",
	"external": "external__97b5e",
	"settingsDivider": "settingsDivider__97b5e",
	"blacklistItem": "blacklistItem__97b5e",
	"blacklistItemIcon": "blacklistItemIcon__97b5e",
	"blacklistItemName": "blacklistItemName__97b5e",
	"blacklistItemTextContainer": "blacklistItemTextContainer__97b5e",
	"blacklistItemDescription": "blacklistItemDescription__97b5e",
	"search": "search__97b5e",
	"toggleStack": "toggleStack__97b5e",
	"buttonItem": "buttonItem__97b5e",
	"radioItem": "radioItem__97b5e",
	"newspaperIcon": "newspaperIcon__97b5e"
};
const SettingsClasses = modules_a52d5642;

// settings/components/SidebarItemIcon.tsx
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

// modules/stores.js
const ApplicationStore = betterdiscord.Webpack.getStore("ApplicationStore");
const ChannelStore = betterdiscord.Webpack.getStore("ChannelStore");
const ContentInventoryStore = betterdiscord.Webpack.getStore("ContentInventoryStore");
const GameStore = betterdiscord.Webpack.getStore("GameStore");
const GuildStore = betterdiscord.Webpack.getStore("GuildStore");
const NewGameStore = betterdiscord.Webpack.getStore("NewGameStore");
const NowPlayingViewStore = betterdiscord.Webpack.getStore("NowPlayingViewStore");
const PresenceStore = betterdiscord.Webpack.getStore("PresenceStore");
const RunningGameStore = betterdiscord.Webpack.getStore("RunningGameStore");
const ThemeStore = betterdiscord.Webpack.getStore("ThemeStore");
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
		if (xmlData[i] === '<' && xmlData[i+1] === '?') {
			i+=2;
			i = readPI(xmlData,i);
			if (i.err) return i;
		}else if (xmlData[i] === '<') {
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
						msg = "Tag '"+tagName+"' is an invalid name.";
					}
					return getErrorObject('InvalidTag', msg, getLineNumberForPosition(xmlData, i));
				}
				const result = readAttributeStr(xmlData, i);
				if (result === false) {
					return getErrorObject('InvalidAttr', "Attributes for '"+tagName+"' have open quote.", getLineNumberForPosition(xmlData, i));
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
						return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
					} else if (attrStr.trim().length > 0) {
						return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
					} else if (tags.length === 0) {
						return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
					} else {
						const otg = tags.pop();
						if (tagName !== otg.tagName) {
							let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
							return getErrorObject('InvalidTag',
								"Expected closing tag '"+otg.tagName+"' (opened in line "+openPos.line+", col "+openPos.col+") instead of closing tag '"+tagName+"'.",
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
					} else if(options.unpairedTags.indexOf(tagName) !== -1); else {
						tags.push({tagName, tagStartPos});
					}
					tagFound = true;
				}
				for (i++; i < xmlData.length; i++) {
					if (xmlData[i] === '<') {
						if (xmlData[i + 1] === '!') {
							i++;
							i = readCommentAndCDATA(xmlData, i);
							continue;
						} else if (xmlData[i+1] === '?') {
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
					}else {
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
			if ( isWhiteSpace(xmlData[i])) {
				continue;
			}
			return getErrorObject('InvalidChar', "char '"+xmlData[i]+"' is not expected.", getLineNumberForPosition(xmlData, i));
		}
	}
	if (!tagFound) {
		return getErrorObject('InvalidXml', 'Start tag expected.', 1);
	}else if (tags.length == 1) {
			return getErrorObject('InvalidTag', "Unclosed tag '"+tags[0].tagName+"'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
	}else if (tags.length > 0) {
			return getErrorObject('InvalidXml', "Invalid '"+
					JSON.stringify(tags.map(t => t.tagName), null, 4).replace(/\r?\n/g, '')+
					"' found.", {line: 1, col: 1});
	}
	return true;
}function isWhiteSpace(char){
	return char === ' ' || char === '\t' || char === '\n'  || char === '\r';
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
			return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' has no space in starting.", getPositionFromMatch(matches[i]))
		} else if (matches[i][3] !== undefined && matches[i][4] === undefined) {
			return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' is without value.", getPositionFromMatch(matches[i]));
		} else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
			return getErrorObject('InvalidAttr', "boolean attribute '"+matches[i][2]+"' is not allowed.", getPositionFromMatch(matches[i]));
		}
		const attrName = matches[i][2];
		if (!validateAttrName(attrName)) {
			return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is an invalid name.", getPositionFromMatch(matches[i]));
		}
		if (!attrNames.hasOwnProperty(attrName)) {
			attrNames[attrName] = 1;
		} else {
			return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is repeated.", getPositionFromMatch(matches[i]));
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
};
function normalizeProcessEntities(value) {
	if (typeof value === 'boolean') {
		return {
			enabled: value,
			maxEntitySize: 10000,
			maxExpansionDepth: 10,
			maxTotalExpansions: 1000,
			maxExpandedLength: 100000,
			allowedTags: null,
			tagFilter: null
		};
	}
	if (typeof value === 'object' && value !== null) {
		return {
			enabled: value.enabled !== false,
			maxEntitySize: value.maxEntitySize ?? 10000,
			maxExpansionDepth: value.maxExpansionDepth ?? 10,
			maxTotalExpansions: value.maxTotalExpansions ?? 1000,
			maxExpandedLength: value.maxExpandedLength ?? 100000,
			allowedTags: value.allowedTags ?? null,
			tagFilter: value.tagFilter ?? null
		};
	}
	return normalizeProcessEntities(true);
}
const buildOptions = function (options) {
	const built = Object.assign({}, defaultOptions, options);
	built.processEntities = normalizeProcessEntities(built.processEntities);
	return built;
};

// fast-xml-parser
let METADATA_SYMBOL$1;
if (typeof Symbol !== "function") {
	METADATA_SYMBOL$1 = "@@xmlMetadata";
} else {
	METADATA_SYMBOL$1 = Symbol("XML Node Metadata");
}
class XmlNode{
	constructor(tagname) {
		this.tagname = tagname;
		this.child = [];
		this[":@"] = {};
	}
	add(key,val){
		if(key === "__proto__") key = "#__proto__";
		this.child.push( {[key]: val });
	}
	addChild(node, startIndex) {
		if(node.tagname === "__proto__") node.tagname = "#__proto__";
		if(node[":@"] && Object.keys(node[":@"]).length > 0){
			this.child.push( { [node.tagname]: node.child, [":@"]: node[":@"] });
		}else {
			this.child.push( { [node.tagname]: node.child });
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
				const entities = {};
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
														const escaped = entityName.replace(/[.\-+*:]/g, '\\.');
														entities[entityName] = {
																regx: RegExp(`&${escaped};`, "g"),
																val: val
														};
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
				let entityName = "";
				while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
						entityName += xmlData[i];
						i++;
				}
				validateEntityName(entityName);
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
						this.options.maxEntitySize &&
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
				let notationName = "";
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						notationName += xmlData[i];
						i++;
				}
				!this.suppressValidationErr && validateEntityName(notationName);
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
				while (i < xmlData.length && xmlData[i] !== startChar) {
						identifierVal += xmlData[i];
						i++;
				}
				if (xmlData[i] !== startChar) {
						throw new Error(`Unterminated ${type} value`);
				}
				i++;
				return [i, identifierVal];
		}
		readElementExp(xmlData, i) {
				i = skipWhitespace(xmlData, i);
				let elementName = "";
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						elementName += xmlData[i];
						i++;
				}
				if (!this.suppressValidationErr && !isName(elementName)) {
						throw new Error(`Invalid element name: "${elementName}"`);
				}
				i = skipWhitespace(xmlData, i);
				let contentModel = "";
				if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) i += 4;
				else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) i += 2;
				else if (xmlData[i] === "(") {
						i++;
						while (i < xmlData.length && xmlData[i] !== ")") {
								contentModel += xmlData[i];
								i++;
						}
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
				let elementName = "";
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						elementName += xmlData[i];
						i++;
				}
				validateEntityName(elementName);
				i = skipWhitespace(xmlData, i);
				let attributeName = "";
				while (i < xmlData.length && !/\s/.test(xmlData[i])) {
						attributeName += xmlData[i];
						i++;
				}
				if (!validateEntityName(attributeName)) {
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
								let notation = "";
								while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") {
										notation += xmlData[i];
										i++;
								}
								notation = notation.trim();
								if (!validateEntityName(notation)) {
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
						while (i < xmlData.length && !/\s/.test(xmlData[i])) {
								attributeType += xmlData[i];
								i++;
						}
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
function validateEntityName(name) {
		if (isName(name))
				return name;
		else
				throw new Error(`Invalid entity name ${name}`);
}

// strnum
const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
const numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
const consider = {
		hex :  true,
		leadingZeros: true,
		decimalPoint: "\.",
		eNotation: true,
};
function toNumber(str, options = {}){
		options = Object.assign({}, consider, options );
		if(!str || typeof str !== "string" ) return str;
		let trimmedStr  = str.trim();
		if(options.skipLike !== undefined && options.skipLike.test(trimmedStr)) return str;
		else if(str==="0") return 0;
		else if (options.hex && hexRegex.test(trimmedStr)) {
				return parse_int(trimmedStr, 16);
		}else if (trimmedStr.includes('e') || trimmedStr.includes('E')) {
				return resolveEnotation(str,trimmedStr,options);
		}else {
				const match = numRegex.exec(trimmedStr);
				if(match){
						const sign = match[1] || "";
						const leadingZeros = match[2];
						let numTrimmedByZeros = trimZeros(match[3]);
						const decimalAdjacentToLeadingZeros = sign ?
								str[leadingZeros.length+1] === "."
								: str[leadingZeros.length] === ".";
						if(!options.leadingZeros
								&& (leadingZeros.length > 1
										|| (leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros))){
								return str;
						}
						else {
								const num = Number(trimmedStr);
								const parsedStr = String(num);
								if( num === 0) return num;
								if(parsedStr.search(/[eE]/) !== -1){
										if(options.eNotation) return num;
										else return str;
								}else if(trimmedStr.indexOf(".") !== -1){
										if(parsedStr === "0") return num;
										else if(parsedStr === numTrimmedByZeros) return num;
										else if( parsedStr === `${sign}${numTrimmedByZeros}`) return num;
										else return str;
								}
								let n = leadingZeros? numTrimmedByZeros : trimmedStr;
								if(leadingZeros){
										return (n === parsedStr) || (sign+n === parsedStr) ? num : str
								}else  {
										return (n === parsedStr) || (n === sign+parsedStr) ? num : str
								}
						}
				}else {
						return str;
				}
		}
}
const eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function resolveEnotation(str,trimmedStr,options){
		if(!options.eNotation) return str;
		const notation = trimmedStr.match(eNotationRegx);
		if(notation){
				let sign = notation[1] || "";
				const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
				const leadingZeros = notation[2];
				const eAdjacentToLeadingZeros = sign ?
						str[leadingZeros.length+1] === eChar
						: str[leadingZeros.length] === eChar;
				if(leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
				else if(leadingZeros.length === 1
						&& (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)){
								return Number(trimmedStr);
				}else if(options.leadingZeros && !eAdjacentToLeadingZeros){
						trimmedStr = (notation[1] || "") + notation[3];
						return Number(trimmedStr);
				}else return str;
		}else {
				return str;
		}
}
function trimZeros(numStr){
		if(numStr && numStr.indexOf(".") !== -1){
				numStr = numStr.replace(/0+$/, "");
				if(numStr === ".")  numStr = "0";
				else if(numStr[0] === ".")  numStr = "0"+numStr;
				else if(numStr[numStr.length-1] === ".")  numStr = numStr.substring(0,numStr.length-1);
				return numStr;
		}
		return numStr;
}
function parse_int(numStr, base){
		if(parseInt) return parseInt(numStr, base);
		else if(Number.parseInt) return Number.parseInt(numStr, base);
		else if(window && window.parseInt) return window.parseInt(numStr, base);
		else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported")
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

// fast-xml-parser
class OrderedObjParser {
	constructor(options) {
		this.options = options;
		this.currentNode = null;
		this.tagsNodeStack = [];
		this.docTypeEntities = {};
		this.lastEntities = {
			"apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
			"gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
			"lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
			"quot": { regex: /&(quot|#34|#x22);/g, val: "\"" },
		};
		this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
		this.htmlEntities = {
			"space": { regex: /&(nbsp|#160);/g, val: " " },
			"cent": { regex: /&(cent|#162);/g, val: "¢" },
			"pound": { regex: /&(pound|#163);/g, val: "£" },
			"yen": { regex: /&(yen|#165);/g, val: "¥" },
			"euro": { regex: /&(euro|#8364);/g, val: "€" },
			"copyright": { regex: /&(copy|#169);/g, val: "©" },
			"reg": { regex: /&(reg|#174);/g, val: "®" },
			"inr": { regex: /&(inr|#8377);/g, val: "₹" },
			"num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str) => fromCodePoint(str, 10, "&#") },
			"num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str) => fromCodePoint(str, 16, "&#x") },
		};
		this.addExternalEntities = addExternalEntities;
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
		if (this.options.stopNodes && this.options.stopNodes.length > 0) {
			this.stopNodesExact = new Set();
			this.stopNodesWildcard = new Set();
			for (let i = 0; i < this.options.stopNodes.length; i++) {
				const stopNodeExp = this.options.stopNodes[i];
				if (typeof stopNodeExp !== 'string') continue;
				if (stopNodeExp.startsWith("*.")) {
					this.stopNodesWildcard.add(stopNodeExp.substring(2));
				} else {
					this.stopNodesExact.add(stopNodeExp);
				}
			}
		}
	}
}
function addExternalEntities(externalEntities) {
	const entKeys = Object.keys(externalEntities);
	for (let i = 0; i < entKeys.length; i++) {
		const ent = entKeys[i];
		const escaped = ent.replace(/[.\-+*:]/g, '\\.');
		this.lastEntities[ent] = {
			regex: new RegExp("&" + escaped + ";", "g"),
			val: externalEntities[ent]
		};
	}
}
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
	if (val !== undefined) {
		if (this.options.trimValues && !dontTrim) {
			val = val.trim();
		}
		if (val.length > 0) {
			if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
			const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
			if (newval === null || newval === undefined) {
				return val;
			} else if (typeof newval !== typeof val || newval !== val) {
				return newval;
			} else if (this.options.trimValues) {
				return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
			} else {
				const trimmedVal = val.trim();
				if (trimmedVal === val) {
					return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
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
	if (this.options.ignoreAttributes !== true && typeof attrStr === 'string') {
		const matches = getAllMatches(attrStr, attrsRegx);
		const len = matches.length;
		const attrs = {};
		for (let i = 0; i < len; i++) {
			const attrName = this.resolveNameSpace(matches[i][1]);
			if (this.ignoreAttributesFn(attrName, jPath)) {
				continue
			}
			let oldVal = matches[i][4];
			let aName = this.options.attributeNamePrefix + attrName;
			if (attrName.length) {
				if (this.options.transformAttributeName) {
					aName = this.options.transformAttributeName(aName);
				}
				if (aName === "__proto__") aName = "#__proto__";
				if (oldVal !== undefined) {
					if (this.options.trimValues) {
						oldVal = oldVal.trim();
					}
					oldVal = this.replaceEntitiesValue(oldVal, tagName, jPath);
					const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
					if (newVal === null || newVal === undefined) {
						attrs[aName] = oldVal;
					} else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
						attrs[aName] = newVal;
					} else {
						attrs[aName] = parseValue(
							oldVal,
							this.options.parseAttributeValue,
							this.options.numberParseOptions
						);
					}
				} else if (this.options.allowBooleanAttributes) {
					attrs[aName] = true;
				}
			}
		}
		if (!Object.keys(attrs).length) {
			return;
		}
		if (this.options.attributesGroupName) {
			const attrCollection = {};
			attrCollection[this.options.attributesGroupName] = attrs;
			return attrCollection;
		}
		return attrs
	}
}
const parseXml = function (xmlData) {
	xmlData = xmlData.replace(/\r\n?/g, "\n");
	const xmlObj = new XmlNode('!xml');
	let currentNode = xmlObj;
	let textData = "";
	let jPath = "";
	this.entityExpansionCount = 0;
	this.currentExpandedLength = 0;
	const docTypeReader = new DocTypeReader(this.options.processEntities);
	for (let i = 0; i < xmlData.length; i++) {
		const ch = xmlData[i];
		if (ch === '<') {
			if (xmlData[i + 1] === '/') {
				const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
				let tagName = xmlData.substring(i + 2, closeIndex).trim();
				if (this.options.removeNSPrefix) {
					const colonIndex = tagName.indexOf(":");
					if (colonIndex !== -1) {
						tagName = tagName.substr(colonIndex + 1);
					}
				}
				if (this.options.transformTagName) {
					tagName = this.options.transformTagName(tagName);
				}
				if (currentNode) {
					textData = this.saveTextToParentTag(textData, currentNode, jPath);
				}
				const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
				if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
					throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
				}
				let propIndex = 0;
				if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
					propIndex = jPath.lastIndexOf('.', jPath.lastIndexOf('.') - 1);
					this.tagsNodeStack.pop();
				} else {
					propIndex = jPath.lastIndexOf(".");
				}
				jPath = jPath.substring(0, propIndex);
				currentNode = this.tagsNodeStack.pop();
				textData = "";
				i = closeIndex;
			} else if (xmlData[i + 1] === '?') {
				let tagData = readTagExp(xmlData, i, false, "?>");
				if (!tagData) throw new Error("Pi Tag is not closed.");
				textData = this.saveTextToParentTag(textData, currentNode, jPath);
				if ((this.options.ignoreDeclaration && tagData.tagName === "?xml") || this.options.ignorePiTags) ; else {
					const childNode = new XmlNode(tagData.tagName);
					childNode.add(this.options.textNodeName, "");
					if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
						childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
					}
					this.addChild(currentNode, childNode, jPath, i);
				}
				i = tagData.closeIndex + 1;
			} else if (xmlData.substr(i + 1, 3) === '!--') {
				const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
				if (this.options.commentPropName) {
					const comment = xmlData.substring(i + 4, endIndex - 2);
					textData = this.saveTextToParentTag(textData, currentNode, jPath);
					currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
				}
				i = endIndex;
			} else if (xmlData.substr(i + 1, 2) === '!D') {
				const result = docTypeReader.readDocType(xmlData, i);
				this.docTypeEntities = result.entities;
				i = result.i;
			} else if (xmlData.substr(i + 1, 2) === '![') {
				const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
				const tagExp = xmlData.substring(i + 9, closeIndex);
				textData = this.saveTextToParentTag(textData, currentNode, jPath);
				let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
				if (val == undefined) val = "";
				if (this.options.cdataPropName) {
					currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
				} else {
					currentNode.add(this.options.textNodeName, val);
				}
				i = closeIndex + 2;
			} else {
				let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
				let tagName = result.tagName;
				const rawTagName = result.rawTagName;
				let tagExp = result.tagExp;
				let attrExpPresent = result.attrExpPresent;
				let closeIndex = result.closeIndex;
				if (this.options.transformTagName) {
					const newTagName = this.options.transformTagName(tagName);
					if (tagExp === tagName) {
						tagExp = newTagName;
					}
					tagName = newTagName;
				}
				if (currentNode && textData) {
					if (currentNode.tagname !== '!xml') {
						textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
					}
				}
				const lastTag = currentNode;
				if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
					currentNode = this.tagsNodeStack.pop();
					jPath = jPath.substring(0, jPath.lastIndexOf("."));
				}
				if (tagName !== xmlObj.tagname) {
					jPath += jPath ? "." + tagName : tagName;
				}
				const startIndex = i;
				if (this.isItStopNode(this.stopNodesExact, this.stopNodesWildcard, jPath, tagName)) {
					let tagContent = "";
					if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
						if (tagName[tagName.length - 1] === "/") {
							tagName = tagName.substr(0, tagName.length - 1);
							jPath = jPath.substr(0, jPath.length - 1);
							tagExp = tagName;
						} else {
							tagExp = tagExp.substr(0, tagExp.length - 1);
						}
						i = result.closeIndex;
					}
					else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
						i = result.closeIndex;
					}
					else {
						const result = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
						if (!result) throw new Error(`Unexpected end of ${rawTagName}`);
						i = result.i;
						tagContent = result.tagContent;
					}
					const childNode = new XmlNode(tagName);
					if (tagName !== tagExp && attrExpPresent) {
						childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
					}
					if (tagContent) {
						tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
					}
					jPath = jPath.substr(0, jPath.lastIndexOf("."));
					childNode.add(this.options.textNodeName, tagContent);
					this.addChild(currentNode, childNode, jPath, startIndex);
				} else {
					if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
						if (tagName[tagName.length - 1] === "/") {
							tagName = tagName.substr(0, tagName.length - 1);
							jPath = jPath.substr(0, jPath.length - 1);
							tagExp = tagName;
						} else {
							tagExp = tagExp.substr(0, tagExp.length - 1);
						}
						if (this.options.transformTagName) {
							const newTagName = this.options.transformTagName(tagName);
							if (tagExp === tagName) {
								tagExp = newTagName;
							}
							tagName = newTagName;
						}
						const childNode = new XmlNode(tagName);
						if (tagName !== tagExp && attrExpPresent) {
							childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
						}
						this.addChild(currentNode, childNode, jPath, startIndex);
						jPath = jPath.substr(0, jPath.lastIndexOf("."));
					}
					else {
						const childNode = new XmlNode(tagName);
						this.tagsNodeStack.push(currentNode);
						if (tagName !== tagExp && attrExpPresent) {
							childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
						}
						this.addChild(currentNode, childNode, jPath, startIndex);
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
function addChild(currentNode, childNode, jPath, startIndex) {
	if (!this.options.captureMetaData) startIndex = undefined;
	const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
	if (result === false) ; else if (typeof result === "string") {
		childNode.tagname = result;
		currentNode.addChild(childNode, startIndex);
	} else {
		currentNode.addChild(childNode, startIndex);
	}
}
const replaceEntitiesValue = function (val, tagName, jPath) {
	if (val.indexOf('&') === -1) {
		return val;
	}
	const entityConfig = this.options.processEntities;
	if (!entityConfig.enabled) {
		return val;
	}
	if (entityConfig.allowedTags) {
		if (!entityConfig.allowedTags.includes(tagName)) {
			return val;
		}
	}
	if (entityConfig.tagFilter) {
		if (!entityConfig.tagFilter(tagName, jPath)) {
			return val;
		}
	}
	for (let entityName in this.docTypeEntities) {
		const entity = this.docTypeEntities[entityName];
		const matches = val.match(entity.regx);
		if (matches) {
			this.entityExpansionCount += matches.length;
			if (entityConfig.maxTotalExpansions &&
				this.entityExpansionCount > entityConfig.maxTotalExpansions) {
				throw new Error(
					`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
				);
			}
			const lengthBefore = val.length;
			val = val.replace(entity.regx, entity.val);
			if (entityConfig.maxExpandedLength) {
				this.currentExpandedLength += (val.length - lengthBefore);
				if (this.currentExpandedLength > entityConfig.maxExpandedLength) {
					throw new Error(
						`Total expanded content size exceeded: ${this.currentExpandedLength} > ${entityConfig.maxExpandedLength}`
					);
				}
			}
		}
	}
	if (val.indexOf('&') === -1) return val;
	for (let entityName in this.lastEntities) {
		const entity = this.lastEntities[entityName];
		val = val.replace(entity.regex, entity.val);
	}
	if (val.indexOf('&') === -1) return val;
	if (this.options.htmlEntities) {
		for (let entityName in this.htmlEntities) {
			const entity = this.htmlEntities[entityName];
			val = val.replace(entity.regex, entity.val);
		}
	}
	val = val.replace(this.ampEntity.regex, this.ampEntity.val);
	return val;
};
function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
	if (textData) {
		if (isLeafNode === undefined) isLeafNode = currentNode.child.length === 0;
		textData = this.parseTextData(textData,
			currentNode.tagname,
			jPath,
			false,
			currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
			isLeafNode);
		if (textData !== undefined && textData !== "")
			currentNode.add(this.options.textNodeName, textData);
		textData = "";
	}
	return textData;
}
function isItStopNode(stopNodesExact, stopNodesWildcard, jPath, currentTagName) {
	if (stopNodesWildcard && stopNodesWildcard.has(currentTagName)) return true;
	if (stopNodesExact && stopNodesExact.has(jPath)) return true;
	return false;
}
function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
	let attrBoundary;
	let tagExp = "";
	for (let index = i; index < xmlData.length; index++) {
		let ch = xmlData[index];
		if (attrBoundary) {
			if (ch === attrBoundary) attrBoundary = "";
		} else if (ch === '"' || ch === "'") {
			attrBoundary = ch;
		} else if (ch === closingChar[0]) {
			if (closingChar[1]) {
				if (xmlData[index + 1] === closingChar[1]) {
					return {
						data: tagExp,
						index: index
					}
				}
			} else {
				return {
					data: tagExp,
					index: index
				}
			}
		} else if (ch === '\t') {
			ch = " ";
		}
		tagExp += ch;
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
	for (; i < xmlData.length; i++) {
		if (xmlData[i] === "<") {
			if (xmlData[i + 1] === "/") {
				const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
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
			} else if (xmlData[i + 1] === '?') {
				const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
				i = closeIndex;
			} else if (xmlData.substr(i + 1, 3) === '!--') {
				const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
				i = closeIndex;
			} else if (xmlData.substr(i + 1, 2) === '![') {
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
function fromCodePoint(str, base, prefix) {
	const codePoint = Number.parseInt(str, base);
	if (codePoint >= 0 && codePoint <= 0x10FFFF) {
		return String.fromCodePoint(codePoint);
	} else {
		return prefix + str + ";";
	}
}

// fast-xml-parser
const METADATA_SYMBOL = XmlNode.getMetaDataSymbol();
function prettify(node, options){
	return compress( node, options);
}
function compress(arr, options, jPath){
	let text;
	const compressedObj = {};
	for (let i = 0; i < arr.length; i++) {
		const tagObj = arr[i];
		const property = propName(tagObj);
		let newJpath = "";
		if(jPath === undefined) newJpath = property;
		else newJpath = jPath + "." + property;
		if(property === options.textNodeName){
			if(text === undefined) text = tagObj[property];
			else text += "" + tagObj[property];
		}else if(property === undefined){
			continue;
		}else if(tagObj[property]){
			let val = compress(tagObj[property], options, newJpath);
			const isLeaf = isLeafTag(val, options);
			if (tagObj[METADATA_SYMBOL] !== undefined) {
				val[METADATA_SYMBOL] = tagObj[METADATA_SYMBOL];
			}
			if(tagObj[":@"]){
				assignAttributes( val, tagObj[":@"], newJpath, options);
			}else if(Object.keys(val).length === 1 && val[options.textNodeName] !== undefined && !options.alwaysCreateTextNode){
				val = val[options.textNodeName];
			}else if(Object.keys(val).length === 0){
				if(options.alwaysCreateTextNode) val[options.textNodeName] = "";
				else val = "";
			}
			if(compressedObj[property] !== undefined && compressedObj.hasOwnProperty(property)) {
				if(!Array.isArray(compressedObj[property])) {
						compressedObj[property] = [ compressedObj[property] ];
				}
				compressedObj[property].push(val);
			}else {
				if (options.isArray(property, newJpath, isLeaf )) {
					compressedObj[property] = [val];
				}else {
					compressedObj[property] = val;
				}
			}
		}
	}
	if(typeof text === "string"){
		if(text.length > 0) compressedObj[options.textNodeName] = text;
	}else if(text !== undefined) compressedObj[options.textNodeName] = text;
	return compressedObj;
}
function propName(obj){
	const keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if(key !== ":@") return key;
	}
}
function assignAttributes(obj, attrMap, jpath, options){
	if (attrMap) {
		const keys = Object.keys(attrMap);
		const len = keys.length;
		for (let i = 0; i < len; i++) {
			const atrrName = keys[i];
			if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
				obj[atrrName] = [ attrMap[atrrName] ];
			} else {
				obj[atrrName] = attrMap[atrrName];
			}
		}
	}
}
function isLeafTag(obj, options){
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
class XMLParser{
		constructor(options){
				this.externalEntities = {};
				this.options = buildOptions(options);
		}
		parse(xmlData,validationOption){
				if(typeof xmlData !== "string" && xmlData.toString){
						xmlData = xmlData.toString();
				}else if(typeof xmlData !== "string"){
						throw new Error("XML data is accepted in String or Bytes[] form.")
				}
				if( validationOption){
						if(validationOption === true) validationOption = {};
						const result = validate(xmlData, validationOption);
						if (result !== true) {
							throw Error( `${result.err.msg}:${result.err.line}:${result.err.col}` )
						}
					}
				const orderedObjParser = new OrderedObjParser(this.options);
				orderedObjParser.addExternalEntities(this.externalEntities);
				const orderedResult = orderedObjParser.parseXml(xmlData);
				if(this.options.preserveOrder || orderedResult === undefined) return orderedResult;
				else return prettify(orderedResult, this.options);
		}
		addEntity(key, value){
				if(value.indexOf("&") !== -1){
						throw new Error("Entity value can't have '&'")
				}else if(key.indexOf("&") !== -1 || key.indexOf(";") !== -1){
						throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'")
				}else if(value === "&"){
						throw new Error("An entity with value '&' is not permitted");
				}else {
						this.externalEntities[key] = value;
				}
		}
		static getMetaDataSymbol() {
				return XmlNode.getMetaDataSymbol();
		}
}

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
			return Common.intl.intl.formatToPlainString(Common.intl.t["2rUo/p"], { time: Math.floor(time / 86400) });
		case !!(time / 3600 > 1):
			return Common.intl.intl.formatToPlainString(Common.intl.t["eNoooU"], { time: Math.floor(time / 3600) });
		case !!(time / 60 > 1):
			return Common.intl.intl.formatToPlainString(Common.intl.t["03mIHW"], { time: Math.floor(time / 60) });
		case !!(time % 60 < 60):
			return Common.intl.intl.formatToPlainString(Common.intl.t["ahzZr+"]);
	}
}
function InactiveTimeClock({ timestamp }) {
	const time = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1e3);
	switch (true) {
		case !!(time / 86400 > 1):
			return Common.intl.intl.formatToPlainString(Common.intl.t["yP1T84"], { time: Math.floor(time / 86400) });
		case !!(time / 3600 > 1):
			return Common.intl.intl.formatToPlainString(Common.intl.t["cRMUpw"], { time: Math.floor(time / 3600) });
		case !!(time / 60 > 1):
			return Common.intl.intl.formatToPlainString(Common.intl.t["BZxG8Z"], { time: Math.floor(time / 60) });
		case !!isNaN(time):
			return TimeClock({ timestamp });
	}
}
function GradGen(game, check, isSpotify, activity, voice, stream) {
	let input;
	switch (true) {
		case !!check?.streaming:
			activity.name.toLowerCase().includes("youtube") ? input = "https://discord.com/assets/ff3516ac66b71ef616b1df63e20fee65.png" : input = "https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg";
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
		case !!game?.currentGame?.splash?.length:
			input = `https://cdn.discordapp.com/app-icons/${game?.currentGame?.id}/${game?.currentGame?.splash}.png?size=1024&keep_aspect_ratio=true`;
			break;
		case !!isSpotify:
			input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(":") + 1)}`;
			break;
		case !!activity?.platform?.includes("xbox"):
			input = "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png";
			break;
		case !!["YouTube Music", "Crunchyroll"].includes(activity?.name):
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
		case !!check?.streaming:
			activity.name.toLowerCase().endsWith("youtube") ? input = `https://discord.com/assets/0fa530ba9c04ac32.svg` : input = `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`;
			break;
		case !!!game?.data?.supplementalData:
			input = `https://cdn.discordapp.com/app-icons/${game.currentGame?.id}/${game?.currentGame?.icon}.png?size=1024&keep_aspect_ratio=true`;
			break;
		default:
			input = game?.data?.supplementalData?.artwork[0];
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
async function parseXML(xml) {
	let body = await xml;
	let result;
	const entities = [{ key: "#8211", value: "\u2013" }, { key: "#8217", value: "'" }];
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

// settings/settings.js
const settings = {
	main: {
		v2Frame: {
			name: "Refreshed Activity Feed",
			note: "Enables basic modern styling for the Activity Feed. Below options are highly recommended.",
			initial: true
		},
		v2News: {
			name: "Refreshed Application News",
			note: "Enables modern styling for news articles. Recommended.",
			initial: true
		},
		v2Dock: {
			name: "Refreshed Quick Launcher",
			note: "Enables modern styling for the quick launcher. Recommended.",
			initial: true
		},
		v2Cards: {
			name: "Refreshed Activity Cards",
			note: "Enables the colorful visual refresh-inspired activity card designs. Recommended.",
			initial: true
		}
	},
	debug: {
		forceRefreshFeed: {
			name: "Force refresh the news article feed",
			note: "Re-roll currently displayed articles. Will not fetch new ones.",
			innerText: "Reroll",
			type: "button",
			onClick: () => NewsStore.rerollFeeds()
		},
		resetCoachmark: {
			name: "Reset Settings Coachmark",
			note: "Settings coachmark will reappear again after having previously been dismissed.",
			innerText: "Reset",
			type: "button",
			onClick: () => NewsStore.setHasDismissedSettingsCoachmark(false)
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

// activity_feed/ActivityFeed.module.css
const css$4 = `
.activityFeed__2cbe2 {
		background: var(--background-gradient-chat, var(--background-base-lower));
		border-top: 1px solid var(--app-frame-border);
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
}

.scrollerBase__2cbe2 {
		contain: layout size;
		height: 100%;
		background: no-repeat bottom;
		background-size: 100%;
		background-image: url(https://discord.com/assets/c486dc65ce2877eeb18e4c39bb49507a.svg);
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
				background-color: var(--scrollbar-auto-thumb);
		}
}

.centerContainer__2cbe2 {
		display: flex;
		flex-direction: column;
		width: 1280px;
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
_loadStyle("ActivityFeed.module.css", css$4);
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
class GameNewsStore extends betterdiscord.Utils.Store {
	static displayName = "GameNewsStore";
	article = {};
	dataSet = {};
	displaySet = [];
	lockSet = [];
	blacklist = [];
	whitelist = [];
	state = [];
	lastTimeFetched;
	idling;
	direction;
	hasDismissedSettingsCoachmark;
	constructor() {
		super();
		this.dataSet = {};
		this.displaySet = [];
		this.lockSet = [];
		this.article = {};
		this.blacklist = [];
		this.whitelist = [];
		this.lastTimeFetched;
		this.direction = 1;
		this.idling = true;
		this.hasDismissedSettingsCoachmark = betterdiscord.Data.load("hasDismissedSettingsCoachmark") ?? false;
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
	setHasDismissedSettingsCoachmark(v) {
		this.hasDismissedSettingsCoachmark = v;
		betterdiscord.Data.save("hasDismissedSettingsCoachmark", v);
		this.emitChange();
		return;
	}
	getFeeds() {
		return this.dataSet;
	}
	setFeeds() {
		this.dataSet = betterdiscord.Data.load("dataSet") ? Object.assign(this.dataSet, betterdiscord.Data.load("dataSet")) : {};
		this.lockSet = betterdiscord.Data.load("lockSet") || [];
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
	async fetchAnyFeed(url, options) {
		const rssFeed = await Promise.all([parseXML(betterdiscord.Net.fetch(`${url}`, options).then((r) => r.ok ? r.text() : null))]);
		return rssFeed;
	}
	async #fetchDiscordFeeds() {
		const rssFeed = await Promise.all([parseXML(betterdiscord.Net.fetch(`https://discord.com/blog/rss.xml`).then((r) => r.ok ? r.text() : null))]);
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed[0]?.rss?.channel?.title,
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
		const rssFeed = await Promise.all([parseXML(betterdiscord.Net.fetch(`https://nintendoeverything.com/feed/`).then((r) => r.ok ? r.text() : null))]);
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed[0]?.rss?.channel?.title,
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
		const rssFeed = await Promise.all([parseXML(betterdiscord.Net.fetch(`https://news.xbox.com/en-us/feed/`, { headers: { "User-Agent": "activity" } }).then((r) => r.ok ? r.text() : null))]);
		const article = this.getRSSItem(rssFeed);
		return {
			application: {
				name: rssFeed[0]?.rss?.channel?.title,
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
		const rssFeed = await Promise.all([parseXML(betterdiscord.Net.fetch(`https://store.steampowered.com/feeds/news/app/${gameId}`).then((r) => r.ok ? r.text() : null))]);
		const article = this.getRSSItem(rssFeed);
		return {
			application,
			appId: application.id,
			description: article?.description,
			thumbnail: article?.enclosure?._url,
			timestamp: article?.pubDate,
			title: article?.title,
			url: article?.link
		};
	}
	async fetchFeeds() {
		const gameData = await this.getFeedGameData();
		const ignore = ["IMG", "VIDEO", "LI", "DIV", "A"];
		for (let i = 0; i < ignore.length; i++) {
			delete HtmlSanitizer.AllowedTags[ignore[i]];
		}
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
							description: HtmlSanitizer.SanitizeHtml(feeds.description),
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
		const gameList = RunningGameStore.getGamesSeen().filter((game) => GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0]));
		const gameIds = gameList.filter((game) => game.id || game.name === "Minecraft").map((game) => game.name === "Minecraft" ? GameStore.searchGamesByName(game.name)[0] : game.id);
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
		for (let i in settings.external) {
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
	sortFeeds(f) {
		let a = this.getFeeds();
		let da = f.map((k) => a[k].news.timestamp).sort((n, o) => new Date(n) - new Date(o)).reverse();
		let d = new Set();
		for (let k in da) {
			d.add(new Date(da[k]).toDateString());
		}
		return Array.from(d);
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
	getRSSItem(feed, itemIndex = 0) {
		try {
			return feed[0]?.rss?.channel?.item[itemIndex];
		} catch (e) {
			return null;
		}
	}
	getRandomFeeds(feeds) {
		let t = [];
		let s = this.lockSet;
		t = t.concat(s);
		let keys = Object.keys(feeds);
		let _keys = keys.filter((key) => !this.getBlacklistedGame(feeds[key].id) && !this.isArticleLockedIn(feeds[key]) && this.filterFeeds(feeds[key].news));
		let total = _keys.length;
		let sorted = this.sortFeeds(_keys);
		if (!_keys.length) return;
		ld: for (let d in sorted) {
			let f = _keys.filter((k) => new Date(feeds[k].news.timestamp).toDateString() === sorted[d]);
			for (let g = 0; g < 4 - s.length; g++) {
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
			return ModalSystem.openModal(
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
			return ModalSystem.openModal(
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
}
const NewsStore = new GameNewsStore();

// activity_feed/components/application_news/ApplicationNews.module.css
const css$3 = `
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
		background-color: var(--background-secondary-alt);
		border-radius: 3px;
		box-sizing: border-box;
		display: flex;
		overflow: hidden;
		padding: 20px;
		position: relative;
		height: 270px;
		margin-top: 20px;
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
_loadStyle("ApplicationNews.module.css", css$3);
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
	"feedOverflowMenu": "feedOverflowMenu__94d97",
	"applicationArea": "applicationArea__94d97",
	"detailsContainer": "detailsContainer__94d97",
	"details": "details__94d97",
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
	"splashArt": "splashArt__94d97",
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
		children.props = {
			...props,
			...children.props
		};
		return children;
	});
};

// activity_feed/components/application_news/components/OverflowBuilder.tsx
function FeedPopout({ applicationId, gameId, articleUrl, close }) {
	const article = NewsStore.getByGameId(gameId);
	const confirmOptions = ["Be rid of it", "Yes", "Proceed"];
	const confirmText = confirmOptions[Math.floor(Math.random() * confirmOptions.length)];
	if (isNaN(applicationId)) {
		return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed-overflow", onClose: close }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: "Copy Article Link", action: () => Common.Clipboard(articleUrl) }), !NewsStore.isArticleLockedIn(article) && betterdiscord.Data.load("lockingInArticles") && BdApi.React.createElement(
			betterdiscord.ContextMenu.Item,
			{
				id: "lock-in-article",
				label: "Lock In Article",
				action: () => NewsStore.lockInArticle(article)
			}
		), NewsStore.isArticleLockedIn(article) && betterdiscord.Data.load("lockingInArticles") && BdApi.React.createElement(
			betterdiscord.ContextMenu.Item,
			{
				id: "unlock-article",
				label: "Unlock Article",
				action: () => NewsStore.releaseLockedArticle(article)
			}
		));
	}
	return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "feed-overflow", onClose: close }, UserSettingsProtoStore.settings.appearance.developerMode && BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-app-id", label: "Copy Application ID", action: () => Common.Clipboard(applicationId) }), BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-article-link", label: "Copy Article Link", action: () => Common.Clipboard(articleUrl) }), BdApi.React.createElement(
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
	), !NewsStore.isArticleLockedIn(article) && betterdiscord.Data.load("lockedInArticles") && BdApi.React.createElement(
		betterdiscord.ContextMenu.Item,
		{
			id: "lock-in-article",
			label: "Lock In Article",
			action: () => NewsStore.lockInArticle(article)
		}
	), NewsStore.isArticleLockedIn(article) && betterdiscord.Data.load("lockedInArticles") && BdApi.React.createElement(
		betterdiscord.ContextMenu.Item,
		{
			id: "unlock-article",
			label: "Unlock Article",
			action: () => NewsStore.releaseLockedArticle(article)
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
	), BdApi.React.createElement("div", { className: FeedClasses.scrollerWrap }, BdApi.React.createElement("div", { className: `${FeedClasses.scroller} ${FeedClasses.horizontalPaginationItemContainer} ${Common.PositionClasses.alignCenter}` }, articleSet.map((article) => {
		if (!article) return;
		return BdApi.React.createElement(MiniSubpagination, { article, currentArticle });
	}))), BdApi.React.createElement(
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
	betterdiscord.Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling());
	return BdApi.React.createElement(
		"div",
		{
			className: article.index === NewsStore.getCurrentArticle().index ? `${FeedClasses.paginationItem} ${FeedClasses.selectedPage}` : FeedClasses.paginationItem,
			onClick: () => {
				NewsStore.setCurrentArticle(article.index);
				NewsStore.setIdling(false);
				NewsStore.setDirection(article.index - currentArticle.index);
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
		BdApi.React.createElement("div", { className: FeedClasses.paginationText }, BdApi.React.createElement("div", { className: `${FeedClasses.paginationTitle} ${FeedClasses.paginationContent}` }, article.news?.title || "No Title"), BdApi.React.createElement("div", { className: `${FeedClasses.paginationSubtitle} ${FeedClasses.paginationContent}` }, article.application?.name || "Unknown Game"))
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

// activity_feed/components/application_news/Article.tsx
function FeedArticle(Article2) {
	return function WrappedComponent(props) {
		const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: props.article.application.id });
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
	renderBackground() {
		let currentArticle = this.props.article;
		return BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: {
					backgroundImage: currentArticle.news?.thumbnail ? `url(${currentArticle.news?.thumbnail})` : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg)`
				}
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
				onMouseOver: (e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${FeedClasses.clickableIcon}`),
				onMouseLeave: (e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${FeedClasses.clickableIcon}`),
				src: currentArticle.news?.application_id && currentArticle.application?.icon ? `https://cdn.discordapp.com/app-icons/${currentArticle.news.application_id}/${currentArticle.application?.icon}.webp?size=64&keep_aspect_ratio=false` : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.news.application_id}/capsule_231x87.jpg`
			}
		);
	}
	render() {
		if (!this) return;
		let currentArticle = this.props.article;
		const simple = this.props.orientation === "horizontal";
		return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(FeedOverflowBuilder, { applicationId: currentArticle.application.id, gameId: currentArticle.id, articleUrl: currentArticle.news?.url, position: "right" }), BdApi.React.createElement(
			"a",
			{
				tabindex: currentArticle.index,
				className: `${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`,
				href: currentArticle.news?.url || "#",
				rel: "noreferrer nopener",
				target: "_blank",
				role: "button"
			},
			BdApi.React.createElement(Common.Animated.div, { className: betterdiscord.Utils.className(simple ? FeedClasses.articleSimple : FeedClasses.articleStandard, FeedClasses.article), style: this.getRootStyle() }, this.renderBackground(), BdApi.React.createElement(Common.Animated.div, { className: FeedClasses.detailsContainer, style: this.getTextStyle() }, BdApi.React.createElement("div", { className: FeedClasses.applicationArea }, this.renderApplicationIcon(), BdApi.React.createElement("div", { className: simple ? FeedClasses.titleRowSimple : FeedClasses.details }, BdApi.React.createElement("div", { className: `${FeedClasses.titleStandard} ${FeedClasses.title}` }, currentArticle.news?.title || "No Title"), !simple && BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: FeedClasses.description, dangerouslySetInnerHTML: { __html: currentArticle.news?.description || "No description available." } }), BdApi.React.createElement("div", { className: FeedClasses.timestamp }, Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), { dateStyle: "long" })))))))
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
		const inv = setInterval(() => {
			const newTime = Math.floor((Math.floor((new Date()).getTime()) - Math.floor(time.getTime())) / 1e3);
			if (newTime > 0 && articles) {
				if (Math.floor(newTime) % 8 == 0 && isIdling) {
					NewsStore.setCurrentArticle(currentArticle.index === 3 ? currentArticle.index - 3 : currentArticle.index + 1);
				}
			}
		}, 8e3);
		return () => clearInterval(inv);
	});
	switch (betterdiscord.Data.load("freezeNews") ?? Number(settings.default.freezeNews)) {
		case 0:
			break;
		case 1:
			return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2News") ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel) }, BdApi.React.createElement(
				FeedSkeletonErrorBuilder,
				{
					errorText: "Activity Feed Unavailable",
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
			errorText: "Activity Feed Unavailable",
			errorDescription: "You've reached an ultra rare error! Reload Discord to try again. Error: orientation-match-failed"
		}
	)));
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

// activity_feed/common/components/SectionHeader.tsx
const SectionHeader = ({ label }) => {
	return BdApi.React.createElement("div", { className: `${MainClasses.headerContainer} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: MainClasses.headerText }, label));
};

// activity_feed/components/quick_launcher/QuickLauncher.module.css
const css$2 = `
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
		flex-direction: column;
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
_loadStyle("QuickLauncher.module.css", css$2);
const modules_1116a9ae = {
	"quickLauncher": "quickLauncher__1ffe5",
	"dock": "dock__1ffe5",
	"dockItem": "dockItem__1ffe5",
	"dockIcon": "dockIcon__1ffe5",
	"dockItemText": "dockItemText__1ffe5",
	"dockItemPlay": "dockItemPlay__1ffe5",
	"emptyIcon": "emptyIcon__1ffe5",
	"dockV2": "dockV2__1ffe5"
};
const QuickLauncherClasses = modules_1116a9ae;

// activity_feed/components/quick_launcher/launcher.tsx
function LauncherGameBuilder({ game, runningGames }) {
	const [shouldDisable, setDisable] = react.useState(false);
	setTimeout(() => setDisable(false), 1e4);
	const disableCheck = react.useMemo(() => ~runningGames.findIndex((m) => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
	const fullGame = GameStore.getDetectableGame(GameStore.searchGamesByName(game.name)[0]);
	const skuViaGame = fullGame.thirdPartySkus;
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: game?.id });
	const refDOM = react.useRef(null);
	const [showPopout, setShowPopout] = react.useState(false);
	const isSteam = Object.values(skuViaGame).find((x) => x.distributor.toLowerCase().includes("steam"));
	function PlayPopout({ close }) {
		return BdApi.React.createElement(betterdiscord.ContextMenu.Menu, { navId: "launcher-context-menu", onClose: close }, BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "play-game", label: "Play Game", action: () => {
			setDisable(true);
			openGame();
		} }), UserSettingsProtoStore.settings.appearance.developerMode && BdApi.React.createElement(betterdiscord.ContextMenu.Item, { id: "copy-app-id", label: "Copy Application ID", action: () => Common.Clipboard(fullGame.id) }));
	}
	function openGame() {
		const items = game.exePath.split("/");
		shell.openExternal(!!isSteam && ["steamapps", "steamlibrary"].some((item) => items.includes(item)) ? `steam://run/${isSteam.id}` : game.exePath);
	}
	return BdApi.React.createElement(
		Common.Popout,
		{
			targetElementRef: refDOM,
			clickTrap: true,
			onRequestClose: () => setShowPopout(false),
			renderPopout: () => BdApi.React.createElement(Common.PopoutContainer, { position: "right" }, BdApi.React.createElement(PlayPopout, { close: () => setShowPopout(false) })),
			position: "right",
			shouldShow: showPopout
		},
		(props) => BdApi.React.createElement(
			"div",
			{
				...props,
				ref: refDOM,
				onClick: (e) => e.shiftKey && !disableCheck && setShowPopout(true)
			},
			BdApi.React.createElement("div", { className: `${QuickLauncherClasses.dockItem} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, BdApi.React.createElement("div", { className: QuickLauncherClasses.dockIcon, style: { backgroundImage: `url(${"https://cdn.discordapp.com/app-icons/" + fullGame.id + "/" + fullGame.icon + ".webp"})` }, onClick: useGameProfile }), BdApi.React.createElement("div", { className: QuickLauncherClasses.dockItemText }, game.name), BdApi.React.createElement(
				"button",
				{
					className: `${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`,
					disabled: disableCheck,
					onClick: () => {
						setDisable(true);
						openGame();
					}
				},
				BdApi.React.createElement("div", { className: `${Common.ButtonVoidClasses.contents}` }, "Play")
			))
		)
	);
}
function LauncherEmptyBuilder() {
	return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2Dock") ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock, MainClasses.emptyState) }, BdApi.React.createElement("svg", { className: QuickLauncherClasses.emptyIcon, name: "OpenExternal", width: 16, height: 16, viewBox: "0 0 24 24" }, BdApi.React.createElement("path", { fill: "currentColor", transform: "translate(3, 4)", d: "M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" })), BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Discord can quickly launch most games you\u2019ve recently played on this computer. Go ahead and launch one to see it appear here!"));
}
function QuickLauncherBuilder(props) {
	const runningGames = useStateFromStores([RunningGameStore], () => RunningGameStore.getRunningGames());
	const gameList = useStateFromStores([RunningGameStore], () => RunningGameStore.getGamesSeen());
	const _gameList = gameList.filter((game) => GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0])).slice(0, 12);
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Quick Launcher" }), gameList.length === 0 || (betterdiscord.Data.load("freezeDock") ?? settings.default.freezeDock) ? BdApi.React.createElement(LauncherEmptyBuilder, null) : BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2Dock") ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock) }, _gameList.map((game) => BdApi.React.createElement(LauncherGameBuilder, { game, runningGames }))));
}

// activity_feed/components/now_playing/NowPlaying.module.css
const css$1 = `
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

.section__93528 {
		-webkit-box-flex: 1;
		flex: 1 0 calc(50% - 20px);
}

.section__93528:last-child {
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

.details__93528 {
		font-weight: 600;
}

.ellipsis__93528 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}

.textRow__93528 {
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

.applicationStreamingAvatar__93528 {
		cursor: pointer;
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

.actionsActivity__93528 .buttonContainer__93528 {
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

.player__93528:first-of-type:not(:only-of-type) {
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
}

.lastPlayedPlayer__93528:not(:only-child, :last-child) {
		padding-bottom: 20px;
}

.lastPlayedDetails__93528 {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		margin-left: 20px;
		min-width: 0;
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
		.clickableIcon__93528 {
				opacity: 0.8;
				cursor: pointer;
		}
		.clickableText__93528 {
				text-decoration: underline;
				cursor: pointer;
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
}`;
_loadStyle("NowPlaying.module.css", css$1);
const modules_7260a078 = {
	"nowPlaying": "nowPlaying__93528",
	"whatsNew": "whatsNew__93528",
	"nowPlayingContainer": "nowPlayingContainer__93528",
	"nowPlayingColumn": "nowPlayingColumn__93528",
	"itemCard": "itemCard__93528",
	"card": "card__93528",
	"cardHeader": "cardHeader__93528",
	"header": "header__93528",
	"nameTag": "nameTag__93528",
	"username": "username__93528",
	"headerTitle": "headerTitle__93528",
	"headerIcon": "headerIcon__93528",
	"headerActions": "headerActions__93528",
	"overflowMenu": "overflowMenu__93528",
	"splashArt": "splashArt__93528",
	"server": "server__93528",
	"cardBody": "cardBody__93528",
	"section": "section__93528",
	"sectionTitleWrapper": "sectionTitleWrapper__93528",
	"sectionTitle": "sectionTitle__93528",
	"sectionLine": "sectionLine__93528",
	"game": "game__93528",
	"gameBody": "gameBody__93528",
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
	"applicationStreamingAvatar": "applicationStreamingAvatar__93528",
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
	"actionsActivity": "actionsActivity__93528",
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
	"cardV2": "cardV2__93528",
	"gameIcon": "gameIcon__93528",
	"clickableIcon": "clickableIcon__93528",
	"clickableText": "clickableText__93528",
	"state": "state__93528"
};
const NowPlayingClasses = modules_7260a078;

// activity_feed/components/now_playing/activities/components/common/DiscordTag.tsx
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

// activity_feed/components/now_playing/activities/components/common/FlexInfo.tsx
function ActivityType({ type, activity, game, channel, server, stream, streamUser }) {
	useStateFromStores([GuildStore], () => GuildStore.getGuild(channel?.guild_id));
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: game?.id });
	switch (type) {
		case "REGULAR":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.gameNameWrapper }, BdApi.React.createElement(
				"div",
				{
					className: NowPlayingClasses.gameName,
					onClick: useGameProfile,
					onMouseOver: (e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`),
					onMouseLeave: (e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)
				},
				game?.name
			)), !activity?.assets?.large_image && BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, BdApi.React.createElement(TimeClock, { timestamp: activity?.timestamps.start || activity.created_at })));
		case "RICH":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity.details || activity?.state), activity?.details && BdApi.React.createElement("div", { className: `${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}` }, activity?.state), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(Common.MediaProgressBar, { start: activity?.timestamps?.start || activity?.created_at, end: activity?.timestamps?.end })) : BdApi.React.createElement(Common.ActivityTimer, { activity }));
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
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.streamName }, activity.details), activity.state && BdApi.React.createElement("div", { className: NowPlayingClasses.streamGame }, Common.intl.intl.formatToPlainString(Common.intl.t["IGYgjl"], { gameName: activity.state })));
		case "VOICE":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, server?.name || channel?.name || streamUser?.globalName), server && BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, channel?.name));
		case "STREAM":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { style: { display: "flex", alignItems: "flex-end" } }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}` }, streamUser.globalName || streamUser.username), BdApi.React.createElement(Common.LiveBadge, { style: { marginLeft: "5px" } })), BdApi.React.createElement("div", { className: `${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}` }, activity ? Common.intl.intl.format(Common.intl.t["0wJXSh"], { name: BdApi.React.createElement("strong", null, stream.name) }) : Common.intl.intl.formatToPlainString(Common.intl.t["KDdjou"])));
		case "LAST_PLAYED":
			return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(DiscordTag, { user: streamUser }), BdApi.React.createElement("div", { className: NowPlayingClasses.playTime }, activity.content?.ended_at ? BdApi.React.createElement(InactiveTimeClock, { timestamp: activity.content?.ended_at }) : Common.intl.intl.formatToPlainString(Common.intl.t["3elwAB"])));
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
	), totalCount > 10 && BdApi.React.createElement("div", { className: `${NowPlayingClasses.emptyUser} ${NowPlayingClasses.userOverflow}`, style: { width: userOverflowCount > 9 ? "22px" : "19px", borderRadius: userOverflowCount > 9 && "16px" } }, `+${userOverflowCount}`));
}
function RegularCardTrailing({ activity, user, server, players, check, v2Enabled }) {
	const [width, height] = useWindowSize();
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
	return BdApi.React.createElement(BdApi.React.Fragment, null, width <= 1240 && width >= 1200 && !activity?.name.includes("YouTube Music") && BdApi.React.createElement(
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
			style: { width: "40px", height: "40px" },
			"aria-label": Common.intl.intl.formatToPlainString(Common.intl.t["nh+jWk"], { game: name }),
			src: url,
			onClick: useGameProfile,
			onMouseOver: (e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableIcon}`),
			onMouseLeave: (e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableIcon}`),
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
	return BdApi.React.createElement("div", { className: `${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter} ${Common.PositionClasses.flex} ${NowPlayingClasses.twitchActivity}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(GameIconAsset, { url: activity.name.toLowerCase().includes("youtube") ? `https://discord.com/assets/0fa530ba9c04ac32.svg` : `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`, id: activity?.application_id, name: game?.name }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.gameInfoRich} ${NowPlayingClasses.gameInfo}`, activity, game, type: "TWITCH" }), BdApi.React.createElement(RichCardTrailing, { activity, user }));
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
	currentActivity?.application_id;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: NowPlayingClasses.activityContainer }, BdApi.React.createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, players, server, check, v2Enabled }), currentActivity?.assets && currentActivity?.assets.large_image && BdApi.React.createElement(RichActivityBuilder, { user, activity: currentActivity, v2Enabled })), v2Enabled && currentActivity?.party && currentActivity?.party.size && BdApi.React.createElement(PartyFooter, { party: currentActivity.party, players, user, activity: currentActivity }), activities.length > 1 && activities.pop() !== currentActivity && BdApi.React.createElement("div", { className: MainClasses.sectionDivider }));
}

// activity_feed/components/now_playing/activities/components/CardActivityWrapper.tsx
function ActivityCardWrapper({ user, activities, voice, streams, check, v2Enabled }) {
	if (!activities) return;
	return activities.map((activity) => {
		const currentActivity = activity?.activity || streams[0].activity;
		const currentGame = activity?.game || GameStore.getDetectableGame(GameStore.searchGamesByName(streams[0].activity.name)[0]);
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
	return BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, isLoading ? BdApi.React.createElement(StreamFallback, null) : !previewUrl ? BdApi.React.createElement(StreamPlaceholder, null) : BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, style: { position: "relative" } }, BdApi.React.createElement("img", { className: NowPlayingClasses.applicationStreamingPreview, src: previewUrl })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverWrapper, onClick: () => {
		return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream);
	} }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingHoverText }, Common.intl.intl.formatToPlainString(Common.intl.t["7Xq/nV"]))));
}
function StreamCard({ stream, streamUser, streamActivity }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.streamSection }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingSection }, BdApi.React.createElement(Common.AvatarFetch, { imageClassName: "applicationStreamingAvatar", src: `https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=48`, size: "SIZE_40" }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.details} ${NowPlayingClasses.applicationStreamingDetails}`, type: "STREAM", stream: streamActivity, streamUser })), BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewWrapper, style: { paddingTop: "54.25%" } }, BdApi.React.createElement("div", { className: NowPlayingClasses.inner }, BdApi.React.createElement("div", { className: NowPlayingClasses.applicationStreamingPreviewSize, role: "button" }, BdApi.React.createElement(StreamPreview, { stream })))));
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
	), BdApi.React.createElement(VoiceCardTrailing, { members, server, channel })), stream && streams.map(
		(stream2, index) => BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: MainClasses.sectionDivider }), BdApi.React.createElement(StreamCard, { stream: streamsInfo[index], streamUser: streamUsers[index], streamActivity: streams[index]?.activity }))
	), activities.length ? BdApi.React.createElement("div", { className: MainClasses.sectionDivider }) : null);
}

// activity_feed/components/now_playing/card_shop/now_playing/CardBody.tsx
function NowPlayingCardBody({ activities, user, voice, streams, check, isSpotify, v2Enabled }) {
	return BdApi.React.createElement("div", { className: NowPlayingClasses.cardBody }, BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.game }, BdApi.React.createElement("div", { className: `${NowPlayingClasses.gameBody} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(VoiceCard, { activities, voice, streams }), BdApi.React.createElement(TwitchCard, { user, activity: activities.find((entry) => entry.activity?.type == 1) || streams.find((entry) => entry.activity?.type == 1), check }), BdApi.React.createElement(ActivityCardWrapper, { user, activities, voice, streams, check, v2Enabled })))));
}

// activity_feed/components/now_playing/activities/components/common/Splash.tsx
function Splash({ splash, className }) {
	if (!splash) return;
	return BdApi.React.createElement("div", { className, style: { backgroundImage: `url(${splash})` } });
}

// activity_feed/components/now_playing/card_shop/now_playing/CardHeader.tsx
function HeaderActions({ card, user }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.headerActions} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`, style: { flex: "0" }, "aria-expanded": showPopout }, BdApi.React.createElement("button", { type: "button", className: `${MainClasses.button} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.lookFilled}`, onClick: () => Common.OpenDM.openPrivateChannel({ recipientIds: user.id }) }, "Message"), BdApi.React.createElement(
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
function NowPlayingCardHeader({ card, activities, game, splash, user, voice, isSpotify }) {
	const status = card.party.priorityMembers[0].status;
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.cardHeader} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(Splash, { splash, className: betterdiscord.Utils.className(NowPlayingClasses.splashArt, voice && activities.length === 0 && NowPlayingClasses.server) }), BdApi.React.createElement("div", { className: NowPlayingClasses.header }, BdApi.React.createElement(Common.AvatarFetch, { imageClassName: "avatar", src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`, status, size: "SIZE_40" }), BdApi.React.createElement(DiscordTag, { user, voice }), BdApi.React.createElement(HeaderActions, { card, user }), BdApi.React.createElement(HeaderIcon, { activities, isSpotify, currentGame: game })));
}

// activity_feed/components/now_playing/activities/components/WhatsNewListItem.tsx
function WhatsNewListItemBuilder({ player }) {
	const user = UserStore.getUser(player.content.author_id);
	const status = PresenceStore.getStatus(player.content.author_id);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.lastPlayedPlayer }, BdApi.React.createElement(Common.AvatarFetch, { imageClassName: "lastPlayedAvatar", src: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.webp?size=48`, status, size: "SIZE_40" }), BdApi.React.createElement(FlexInfo, { className: `${NowPlayingClasses.details} ${NowPlayingClasses.lastPlayedDetails}`, type: "LAST_PLAYED", activity: player, streamUser: user }));
}

// activity_feed/components/now_playing/activities/components/CardMiniNews.tsx
function CardMiniNews({ currentArticle }) {
	return BdApi.React.createElement(
		"a",
		{
			tabindex: currentArticle.index,
			className: `${Common.AnchorClasses.anchor} ${FeedClasses.newsLink} ${FeedClasses.news}`,
			href: currentArticle.news?.url || "#",
			rel: "noreferrer nopener",
			target: "_blank",
			role: "button"
		},
		BdApi.React.createElement("div", { className: FeedClasses.background }, BdApi.React.createElement(
			"div",
			{
				className: FeedClasses.backgroundImage,
				style: {
					backgroundImage: currentArticle.news?.thumbnail ? `url(${currentArticle.news?.thumbnail})` : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg)`
				}
			}
		)),
		BdApi.React.createElement("div", { className: FeedClasses.details }, BdApi.React.createElement("div", { className: FeedClasses.title }, currentArticle.news?.title || "No Title"), BdApi.React.createElement("div", { className: FeedClasses.description, dangerouslySetInnerHTML: { __html: currentArticle.news?.description || "No description available." } }), BdApi.React.createElement("div", { className: FeedClasses.timestamp }, Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), { dateStyle: "long" })))
	);
}

// activity_feed/components/now_playing/card_shop/whats_new/CardBody.tsx
function WhatsNewCardBody({ game, players }) {
	const titleNews = NewsStore.getByApplicationId(game.id);
	return BdApi.React.createElement("div", { className: NowPlayingClasses.cardBody }, BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.lastPlayedSection }, players.map((player) => {
		if (!player) return;
		return BdApi.React.createElement(WhatsNewListItemBuilder, { player });
	}))), titleNews && BdApi.React.createElement("div", { className: NowPlayingClasses.section }, BdApi.React.createElement("div", { className: NowPlayingClasses.sectionTitleWrapper }, BdApi.React.createElement("div", { className: NowPlayingClasses.sectionTitle }, "News"), BdApi.React.createElement("div", { className: `${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}` })), BdApi.React.createElement(CardMiniNews, { currentArticle: titleNews })));
}

// activity_feed/components/now_playing/card_shop/whats_new/CardHeader.tsx
function WhatsNewCardHeader({ game, splash }) {
	const useGameProfile = Common.GameProfileCheck({ trackEntryPointImpression: false, applicationId: game?.id });
	return BdApi.React.createElement("div", { className: `${NowPlayingClasses.cardHeader} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, BdApi.React.createElement(Splash, { splash, className: NowPlayingClasses.splashArt }), BdApi.React.createElement("div", { className: NowPlayingClasses.header }, BdApi.React.createElement(GameIconAsset, { url: `https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon}.webp?size=64&keep_aspect_ratio=false`, id: game?.id, name: game?.name }), BdApi.React.createElement("div", { className: NowPlayingClasses.nameTag, style: { flex: 1 } }, BdApi.React.createElement(
		"div",
		{
			className: NowPlayingClasses.headerTitle,
			onMouseOver: (e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`),
			onMouseLeave: (e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`),
			onClick: useGameProfile
		},
		game?.name
	))));
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
	const cardGrad = GradGen(currentGame, filterCheck, isSpotify, activities[0]?.activity, voice, streams[0]?.stream);
	const game = NewGameStore.getGame(currentGame?.id) || ApplicationStore.getApplication(currentGame?.id) && NewGameStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id);
	const splash = SplashGen({ currentGame, data: game }, isSpotify, activities[0]?.activity, voice, streams[0]?.stream, filterCheck);
	return BdApi.React.createElement("div", { className: v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } }, BdApi.React.createElement(NowPlayingCardHeader, { card, activities, game: currentGame, splash, user, voice, isSpotify }), BdApi.React.createElement(NowPlayingCardBody, { activities, user, voice, streams, check: filterCheck, isSpotify, v2Enabled }));
}
function WhatsNewCardBuilder({ card, v2Enabled }) {
	const players = useStateFromStores([ContentInventoryStore], () => ContentInventoryStore.getFeeds()).get("global feed").unranked_game_entries.filter((entry) => entry.content?.extra?.application_id?.includes(card));
	if (!players.length) return;
	if (!NewGameStore.getGame(card)) {
		Common.FetchGames?.k(card);
	}
	if (!ApplicationStore.getApplication(card)) return;
	const game = NewGameStore.getGame(card);
	const currentGame = NewGameStore.getGame(card) ? GameStore.getGameByApplication(ApplicationStore.getApplication(card)) : null;
	const cardGrad = GradGen(currentGame);
	const splash = SplashGen({ currentGame, data: game });
	return BdApi.React.createElement("div", { className: v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card, style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` } }, BdApi.React.createElement(WhatsNewCardHeader, { game: currentGame, splash }), BdApi.React.createElement(WhatsNewCardBody, { game: currentGame, players, v2Enabled }));
}

// activity_feed/components/now_playing/BaseBuilder.tsx
function NowPlayingColumnBuilder({ nowPlayingCards, type }) {
	return type === "NOW_PLAYING" ? nowPlayingCards.map((card) => [
		BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") ?? settings.default.v2Cards }),
		betterdiscord.Data.load("cardTypeDebug") && BdApi.React.createElement(NowPlayingCardBuilder, { card, v2Enabled: false })
	]) : type === "WHATS_NEW" ? nowPlayingCards.map((card) => [
		BdApi.React.createElement(WhatsNewCardBuilder, { card, v2Enabled: betterdiscord.Data.load("v2Cards") ?? settings.default.v2Cards }),
		betterdiscord.Data.load("cardTypeDebug") && BdApi.React.createElement(WhatsNewCardBuilder, { card, v2Enabled: false })
	]) : console.warn("Invalid card type passed to ColumnBuilder");
}
function NowPlayingBuilder(props) {
	Common.FluxDispatcher.dispatch({ type: "NOW_PLAYING_MOUNTED" });
	const [width, height] = useWindowSize();
	const nowPlayingCards = useStateFromStores([NowPlayingViewStore], () => NowPlayingViewStore.nowPlayingCards);
	const numColumns = Math.min(Math.max(Math.floor(width / 600), 1), 2);
	const cardColumns = chunkArray(nowPlayingCards, numColumns);
	const spacer = 20 - 20 / cardColumns.length;
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "Now Playing" }), nowPlayingCards.length === 0 || (betterdiscord.Data.load("freezeCards") ?? settings.default.freezeCards) ? BdApi.React.createElement("div", { className: MainClasses.emptyState }, BdApi.React.createElement("div", { className: MainClasses.emptyTitle }, "Nobody is playing anything right now..."), BdApi.React.createElement("div", { className: MainClasses.emptySubtitle }, "When someone starts playing a game we'll show it here!")) : BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingContainer }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingColumn, style: { width: nowPlayingCards.length !== 1 && `calc(${100 / cardColumns.length}% - ${spacer}px)` } }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column, type: "NOW_PLAYING" })))));
}
function WhatsNewBuilder(props) {
	const [width, height] = useWindowSize();
	const [recentlySeenGameIds, setRecentlySeenGameIds] = react.useState([]);
	react.useEffect(() => {
		(async () => {
			let seenGames = await Common.RestAPI.get(Common.Endpoints.ACTIVITIES);
			let idSet = new Set();
			const recentlySeenGames = seenGames.body.filter((activity) => new Date(activity.updated_at) > new Date(Date.now() - 864e5));
			const recentlySeenGameIds2 = recentlySeenGames.map((activity) => activity.application_id);
			for (let x in recentlySeenGameIds2) {
				idSet.add(recentlySeenGameIds2[x]);
			}
			setRecentlySeenGameIds(Array.from(idSet));
		})();
	}, [recentlySeenGameIds]);
	const numColumns = Math.min(Math.max(Math.floor(width / 600), 1), 2);
	const cardColumns = chunkArray(recentlySeenGameIds, numColumns);
	const spacer = 20 - 20 / cardColumns.length;
	if (!recentlySeenGameIds.length) return;
	return BdApi.React.createElement("div", { ...props }, BdApi.React.createElement(SectionHeader, { label: "What's New" }), BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingContainer }, cardColumns.map((column, index) => BdApi.React.createElement("div", { className: NowPlayingClasses.nowPlayingColumn, style: { width: recentlySeenGameIds.length !== 1 && `calc(${100 / cardColumns.length}% - ${spacer}px)` } }, BdApi.React.createElement(NowPlayingColumnBuilder, { nowPlayingCards: column, type: "WHATS_NEW" })))));
}

// activity_feed/base.tsx
function Scroller({ children, padding }) {
	return BdApi.React.createElement("div", { className: MainClasses.scrollerBase, style: { overflow: "hidden scroll", paddingRight: `${padding}px` || "0px" } }, children);
}
function TabBaseBuilder() {
	const recoverOnReload = (e) => {
		if ((e.key == "r" || e.key == "R") && e.ctrlKey) {
			NavigationUtils.transitionTo("/channels/@me");
		}
	};
	react.useEffect(() => {
		window.addEventListener("keydown", recoverOnReload);
		return () => window.removeEventListener("keydown", recoverOnReload);
	});
	document.title = "Activity";
	const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"];
	return BdApi.React.createElement("div", { className: betterdiscord.Utils.className((betterdiscord.Data.load("v2Frame") ?? settings.default.v2Frame) && MainClasses.activityFeedV2, MainClasses.activityFeed) }, BdApi.React.createElement(Common.HeaderBar, { className: MainClasses.headerBar, "aria-label": "Activity" }, BdApi.React.createElement("div", { className: MainClasses.iconWrapper }, BdApi.React.createElement(Common.Icons.GameControllerIcon, null)), BdApi.React.createElement("div", { className: MainClasses.titleWrapper }, BdApi.React.createElement("div", { className: MainClasses.title }, "Activity"))), BdApi.React.createElement(Scroller, null, BdApi.React.createElement("div", { className: MainClasses.centerContainer }, BdApi.React.createElement(NewsFeedBuilder, null), BdApi.React.createElement(QuickLauncherBuilder, { className: QuickLauncherClasses.quickLauncher, style: { position: "relative", padding: "0 20px 0 20px", paddingRight: "4px" } }), BdApi.React.createElement(NowPlayingBuilder, { className: NowPlayingClasses.nowPlaying, style: { position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" } }), BdApi.React.createElement(WhatsNewBuilder, { className: NowPlayingClasses.whatsNew, style: { position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" } }), BdApi.React.createElement("div", { style: { color: "red" } }, `Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`))));
}

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
function FollowedGameItemBuilder({ game, blacklist, updateBlacklist }) {
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
		(game) => BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(FollowedGameItemBuilder, { game, blacklist, updateBlacklist }), BdApi.React.createElement("div", { className: MainClasses.sectionDivider }))
	)) : BdApi.React.createElement("div", { className: `${SettingsClasses.blacklist} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "No results.")));
}

// settings/components/ButtonItem.tsx
function ButtonItem({ label, description, innerText, onClick }) {
	return BdApi.React.createElement("div", { className: SettingsClasses.buttonItem }, BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1 } }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`, style: { fontWeight: 500, fontSize: "16px", color: "var(--text-strong)" } }, label), description && BdApi.React.createElement("div", { className: NowPlayingClasses.textRow }, description)), BdApi.React.createElement(
		"button",
		{
			className: `${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${MainClasses.button} ${SettingsClasses.unhideBlacklisted}`,
			onClick
		},
		innerText
	));
}

// settings/components/RadioItem.tsx
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

// settings/builder.tsx
function SettingsPanelBuilder() {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(Common.ManaSwitch, { checked: false }), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "Visual Refresh", collapsible: false, shown: true }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklist} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Modern styling toggles for each part of the Activity Feed.")), BdApi.React.createElement("div", { className: SettingsClasses.toggleStack }, Object.keys(settings.main).map((key) => {
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
	}))), BdApi.React.createElement("div", { className: `${SettingsClasses.settingsDivider} ${MainClasses.sectionDivider}` }), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "Games You Follow", collapsible: false, shown: true }, BdApi.React.createElement("div", { className: `${SettingsClasses.blacklist} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.")), BdApi.React.createElement(FollowedGameListBuilder, null)), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "External News", collapsible: false, shown: true }, BdApi.React.createElement("div", { className: `${SettingsClasses.external} ${SettingsClasses.blacklist} ${MainClasses.emptyState}` }, BdApi.React.createElement("div", { className: MainClasses.emptyText }, "News from external sources outside of your game library.")), BdApi.React.createElement(ExternalSourcesListBuilder, null)), BdApi.React.createElement(betterdiscord.Components.SettingGroup, { name: "Advanced/Debug", collapsible: true, shown: false }, BdApi.React.createElement("div", { className: SettingsClasses.toggleStack }, Object.keys(settings.debug).map((key) => {
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
	}))));
}

// activity_feed/components/coachmark/IntroCoachmark.module.css
const css = `
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
_loadStyle("IntroCoachmark.module.css", css);
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
	return BdApi.React.createElement("div", { className: `${CoachmarkClasses.coachmark} ${Common.PopoverClasses.popover}` }, BdApi.React.createElement("div", { className: Common.PopoverClasses.graphic }, BdApi.React.createElement("img", { className: CoachmarkClasses.image, alt: "", draggable: "false", src: "https://static.discord.com/assets/de14fab6de78b0fc2f679eb74b735151.svg" })), BdApi.React.createElement("div", { className: CoachmarkClasses.body }, BdApi.React.createElement("div", { className: CoachmarkClasses.bodyHeader }, BdApi.React.createElement("div", { className: CoachmarkClasses.title }, "Activity Feed")), BdApi.React.createElement("div", { className: CoachmarkClasses.bodyContent }, BdApi.React.createElement("div", { className: CoachmarkClasses.content }, "You can customize which games appear on the Activity Feed and other fun toggles in settings. Look for the tab!"))), BdApi.React.createElement("div", { className: CoachmarkClasses.actions }, BdApi.React.createElement("button", { className: `${Common.ButtonManaClasses.button} ${Common.ButtonManaClasses.sm} ${Common.ButtonManaClasses.primary} ${CoachmarkClasses.primaryButton}`, type: "button", onClick: () => {
		NewsStore.setHasDismissedSettingsCoachmark(true);
		Common.OpenUserSettings.openUserSettings("activity_feed_panel", { section: "activity_feed_sidebar_item" });
	} }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildrenWrapper}` }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildren}` }, BdApi.React.createElement("span", { className: CoachmarkClasses.buttonContent }, "Take me there!")))), BdApi.React.createElement("button", { className: `${Common.ButtonManaClasses.button} ${Common.ButtonManaClasses.sm} ${Common.ButtonManaClasses.secondary} ${CoachmarkClasses.closeButton}`, type: "button", onClick: () => {
		NewsStore.setHasDismissedSettingsCoachmark(true);
	} }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildrenWrapper}` }, BdApi.React.createElement("div", { className: `${Common.ButtonManaClasses.buttonChildren}` }, BdApi.React.createElement("span", { className: CoachmarkClasses.buttonContent }, "Close"))))), BdApi.React.createElement("div", { className: `${Common.CaretClasses.caret} ${Common.CaretClasses["caret--bottom"]} ${Common.CaretClasses["caret--start"]}` }, BdApi.React.createElement("svg", { width: "22", height: "14", viewBox: "0 0 22 14", fill: "none", className: Common.PopoverClasses.caretIcon }, BdApi.React.createElement("path", { className: Common.PopoverClasses.caretFill, d: "M14.0535 9.39127C12.4557 11.2796 9.54425 11.2796 7.94646 9.39127L1 1Q0 0 1 0L21 0Q22 0 21 1L14.0535 9.39127Z" }), BdApi.React.createElement("mask", { id: "mask0_caret", maskUnits: "userSpaceOnUse", x: "0", y: "0", width: "22", height: "11", style: { maskType: "alpha" } }, BdApi.React.createElement("path", { className: Common.PopoverClasses.caretFill, d: "M14.0535 9.39126C12.4557 11.2796 9.54425 11.2796 7.94646 9.39126L1 1Q0 0 1 0L21 0Q22 0 21 1L14.0535 9.39126Z" })), BdApi.React.createElement("g", { mask: "url(mask0_caret)" }, BdApi.React.createElement("path", { className: Common.PopoverClasses.caretStroke, d: "M13.6572 9.13184C12.2604 10.761 9.73957 10.761 8.34277 9.13184L1.0869141 0.5Q0.0869141 -0.5 1.0869141 -0.5L20.9131 -0.5Q21.9131 -0.5 20.9131 0.5L13.6572 9.13184Z" })))));
}
function IntroCoachmarkPopout({ button }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const isShouldShow = betterdiscord.Hooks.useStateFromStores(NewsStore, () => NewsStore.hasDismissedSettingsCoachmark);
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
				NewsStore.setHasDismissedSettingsCoachmark(true);
			},
			renderPopout: () => {
				return BdApi.React.createElement(Common.PopoutContainer, null, BdApi.React.createElement(IntroCoachmark, { close: () => setShowPopout(false) }));
			},
			children: () => BdApi.React.createElement("div", null, button)
		}
	));
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
		colorPrimary: betterdiscord.Webpack.getByKeys("colorPrimary", "grow").colorPrimary,
		contents: betterdiscord.Webpack.getByKeys("colorPrimary", "grow").contents
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
const extraCSS = webpackify(`\n  	.nowPlayingColumn .tabularNumbers {\n  			color: var(--text-default) !important;\n  	}\n\n  	.nowPlayingColumn :is(.actionsActivity, .customButtons) {\n  			gap: 8px;\n  	}\n\n  	.nowPlayingColumn .header > :is(.wrapper, .gameIcon) {\n  			display: flex;\n  			margin-right: 20px;\n  			transition: opacity .2s ease;\n  	}\n\n  	.customButtons {\n  			display: flex;\n  			flex-direction: column;\n  	}\n\n  	.headerActions {\n  			.button.lookFilled {\n  					background: var(--control-secondary-background-default);\n  					border: unset;\n  					color: var(--white);\n  					padding: 2px 16px;\n  					width: unset;\n  					svg {\n  							display: none;\n  					} \n  			}\n  			.button.lookFilled:hover {\n  					background-color: var(--control-secondary-background-hover) !important;\n  			}\n  			.button.lookFilled:active {\n  					background-color: var(--control-secondary-background-active) !important; \n  			}\n  			.lookFilled.colorPrimary {\n  					background: unset !important;\n  					border: unset !important;\n  			}\n  			.lookFilled.colorPrimary:hover {\n  					color: var(--interactive-background-hover);\n  					svg {\n  							stroke: var(--interactive-background-hover);\n  					}\n  			}\n  			.lookFilled.colorPrimary:active {\n  					color: var(--interactive-background-active);\n  					svg {\n  							stroke: var(--interactive-background-active);\n  					}\n  			}\n  	}\n\n  	.activityContainer:last-child:not(:only-child, :nth-child(1 of .activityContainer)) .sectionDivider {\n  			display: none;\n  	}\n\n  	.nowPlaying .sectionDivider:last-child {\n  			display: none;\n  	}\n\n  	.activity .serviceButtonWrapper .sm:not(.hasText) {\n  			padding: 0;\n  			width: calc(var(--custom-button-button-sm-height) + 4px);\n  	}\n\n  	.content .bar {\n  			background-color: var(--opacity-white-24);\n  	}\n\n  	.partyStatusWrapper .disabledButtonWrapper {\n  			flex: 1;\n  	}\n\n  	.partyStatusWrapper .disabledButtonOverlay {\n  			height: 24px;\n  			width: 100%;\n  	}\n\n  	.cardV2 {\n  			.headerActions .button.lookFilled, .cardBody button {\n  					color: var(--white);\n  					background: var(--opacity-white-24) !important;\n  					&:hover {\n  							background: var(--opacity-white-36) !important;\n  					}\n  					&:active {\n  							background: var(--opacity-white-32) !important;\n  					}\n  			}\n  			.tabularNumbers {\n  					color: var(--app-message-embed-secondary-text) !important;\n  			}\n  			.bar {\n  					background-color: var(--opacity-white-24);\n  			}\n  			.progress {\n  					background-color: var(--white);\n  			}\n  			.sectionDivider {\n  					border-color: var(--opacity-white-12) !important;\n  					border-width: 1px;\n  					margin: 12px 0 12px 0;\n  			} \n  	}\n\n  	.activityFeedV2 {\n  			.nowPlaying .emptyState {\n  					background-color: var(--background-mod-normal) !important;\n  					border-color: var(--border-normal) !important;\n  			}\n  	}\n\n  	.dockV2 {\n  			&:is(.emptyState) {\n  					background: var(--background-feedback-info);\n  					border: 1px solid var(--icon-feedback-info) !important;\n  					border-radius: var(--radius-sm);\n  					color: var(--text-feedback-info) !important;\n  					padding: 8px !important;\n  					margin-bottom: var(--space-lg);\n  			}\n  	}\n\n  	.feedCarouselV2 {\n  			.arrowContainer .contents {\n  					display: contents;\n  			}\n  	}\n\n  	.nowPlaying .emptyState {\n  			border: 1px solid;\n  			border-radius: 5px;\n  			box-sizing: border-box;\n  			margin-top: 20px;\n  			padding: 20px;\n  			width: 100%;\n  	}\n\n  	.theme-light .nowPlaying .emptyState {\n  			background-color: #fff;\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlaying .emptyState {\n  			background-color: rgba(79, 84, 92, .3);\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-light .quickLauncher .emptyState, .theme-light .blacklist.emptyState {\n  			border-color: rgba(220,221,222,.6);\n  			color: #b9bbbe;\n  	}\n\n  	.theme-dark .quickLauncher .emptyState, .theme-dark .blacklist.emptyState {\n  			border-color: rgba(47,49,54,.6);\n  			color: #72767d;\n  	}\n\n  	.theme-light .nowPlayingColumn .sectionDivider {\n  			border-color: var(--interactive-background-hover);\n  	}\n\n  	.theme-dark .nowPlayingColumn .sectionDivider {\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.theme-dark .voiceSectionIconWrapper {\n  			background-color: var(--primary-800);\n  	}\n\n  	.theme-light .voiceSectionIconWrapper {\n  			background: var(--primary-300);\n  	}\n\n  	.quickLauncher .emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			padding: 20px 0;\n  			justify-content: flex-start;\n  			align-items: center;\n  	}\n\n  	.blacklist.emptyState {\n  			border-bottom: 1px solid;\n  			font-size: 14px;\n  			margin-bottom: 20px;\n  			justify-content: flex-start;\n  	}\n\n  	.blackList .emptyState {\n  			position: relative;\n  			padding: 0;\n  			border-bottom: unset; \n  			line-height: 1.60;\n  	}\n\n  	.blacklist .sectionDivider, .settingsDivider {\n  			display: flex;\n  			width: 100%;\n  			border-bottom: 2px solid;\n  			margin: 4px 0 4px 0;\n  			border-color: var(--background-mod-strong);\n  	}\n\n  	.blacklist .sectionDivider:last-child {\n  			display: none;\n  	}\n\n  	// news feed transitions\n\n  	.slide-up-enter  { transform: translateY(100%); opacity: 0; }\n  	.slide-up-enter-active { transform: translateY(0); opacity: 1; transition: all 350ms ease; }\n  	.slide-up-exit  { transform: translateY(0); opacity: 1; }\n  	.slide-up-exit-active { transform: translateY(-100%); opacity: 0; transition: all 350ms ease; }\n\n  	.slide-down-enter  { transform: translateY(-100%); opacity: 0; }\n  	.slide-down-enter-active { transform: translateY(0); opacity: 1; transition: all 350ms ease; }\n  	.slide-down-exit  { transform: translateY(0); opacity: 1; }\n  	.slide-down-exit-active { transform: translateY(100%); opacity: 0; transition: all 350ms ease; }\n`);
function webpackify(css) {
	for (const key in styles) {
		let regex = new RegExp(`\\.${key}([\\s,.):>])`, "g");
		css = styles[key]?.value ? css.replace(regex, `.${styles[key].value}$1`) : css.replace(regex, `.${styles[key]}$1`);
	}
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
function CoachmarkWrapper({ button }) {
	if (useSelectedState() && !NewsStore.hasDismissedSettingsCoachmark) {
		return react.createElement(IntroCoachmarkPopout, { button });
	}
	return button;
}
let LayoutTypes = {
	SECTION: 1,
	SIDEBAR_ITEM: 2,
	PANEL: 3,
	CATEGORY: 5,
	CUSTOM: 19
};
const customObj = layoutUtils.Custom(
	"activity_feed_custom",
	{
		Component: () => react.createElement(SettingsPanelBuilder),
		key: "activity_feed_custom",
		type: LayoutTypes.CUSTOM
	}
);
const categoryObj = layoutUtils.Category(
	"activity_feed_category",
	{
		buildLayout: () => [customObj],
		key: "activity_feed_sidebar_item",
		type: LayoutTypes.CATEGORY
	}
);
const panelObj = layoutUtils.Panel(
	"activity_feed_panel",
	{
		buildLayout: () => [categoryObj],
		key: "activity_feed_panel",
		type: LayoutTypes.PANEL,
		useTitle: () => "Activity Feed"
	}
);
const sidebarItem = layoutUtils.SidebarItem(
	"activity_feed_sidebar_item",
	{
		buildLayout: () => [panelObj],
		icon: () => react.createElement(NewspaperIcon),
		key: "activity_feed_sidebar_item",
		getLegacySearchKey: () => "ACTIVITY_FEED",
		useTitle: () => "Activity Feed",
		type: LayoutTypes.SIDEBAR_ITEM
	}
);
class ActivityFeed {
	GameNewsStore = NewsStore;
	NewsArticle = NewsArticle;
	load() {
		if (window.location.href.endsWith("/channels/@me")) {
			NavigationUtils.transitionTo("/activity-feed");
		}
	}
	async start() {
		NewsStore.whitelist = betterdiscord.Data.load("whitelist");
		NewsStore.blacklist = betterdiscord.Data.load("blacklist") || [];
		if (NewsStore.shouldFetch() === true) await NewsStore.fetchFeeds();
		const Route = betterdiscord.Webpack.getByStrings("disableTrack", "impressionName");
		const [appContentModule, appContentKey] = betterdiscord.Webpack.getWithKey(betterdiscord.Webpack.Filters.byStrings("hasNotice", "AppView"));
		if (appContentModule) {
			betterdiscord.Patcher.after(appContentModule, appContentKey, (that, args, ret) => {
				const { children } = betterdiscord.Utils.findInTree(ret, (node) => node && node.children?.length > 5 && node.children.some((c) => c?.props?.path), { walkable: ["children", "props"] }) ?? {};
				if (!children) return;
				const index = children.findIndex((m) => m.key === "activity-feed");
				if (~index) {
					children.splice(index, 1);
				}
				children.push(
					react.createElement(Route, {
						disableTrack: true,
						path: "/activity-feed",
						render: () => react.createElement(TabBaseBuilder),
						exact: true,
						key: "activity-feed"
					})
				);
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
			const index = panel.children.findIndex((m) => m?.key === "activityFeed_button");
			if (index !== -1) return;
			panel.children.unshift(
				react.createElement(NavigatorButton, { key: "activityFeed_button" })
			);
		});
		betterdiscord.Patcher.before(Common.GameFetchModule, "E", (thisObj, args) => {
			const filtered = args[0].filter((x) => !isNaN(x));
			args[0] = filtered;
			return args;
		});
		betterdiscord.Patcher.after(betterdiscord.Webpack.getByPrototypeKeys("handleHistoryChange", "ensureChannelMatchesGuild").prototype, "render", (that, args, res) => {
			const channelRouteProps = betterdiscord.Utils.findInTree(res, (node) => node && node.path?.length > 5, { walkable: ["children", "props"] });
			channelRouteProps.path = [
				...channelRouteProps.path.filter((m) => m !== "/activity-feed"),
				"/activity-feed"
			];
			return res;
		});
		betterdiscord.Patcher.after(Common.ActivitySectionModule, "buildLayout", (that, [props], res) => {
			if (!betterdiscord.Utils.findInTree(res, (tree) => Object.values(tree).includes("activity_feed_sidebar_item", { walkable: ["props", "children"] }))) {
				res.push(sidebarItem);
			}
			return res;
		});
		betterdiscord.Patcher.after(Common.SettingsButton, "A", (that, [props], res) => {
			return react.createElement(CoachmarkWrapper, { button: res });
		});
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