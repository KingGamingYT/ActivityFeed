/**
 * @name ACTest
 * @author KingGamingYT
 * @description Actvitity tab revival
 * @version 0.0.1
 */ 

const { Data, Webpack, React, ReactUtils, Patcher, DOM, UI, Utils, Components, Net, ContextMenu } = BdApi;
const { createElement, useState, useLayoutEffect, useEffect, useRef, useMemo, useMeasure, Component } = React;
const { useSpring, useTransition, a } = Webpack.getByKeys('useSpring', 'a');

const { shell } = require('electron');
const { app } = Webpack.getModule(m => m.app && m.layers);
const { container } = Webpack.getModule(m => m.container && m.panels);

const Animated = Webpack.getModule(x=> x.Easing && x.accelerate);
const RootSectionModule = Webpack.getModule(x => x?.key === "$Root", { searchExports: true })
const layoutUtils = Webpack.getMangled(Webpack.Filters.bySource('$Root', '.ACCORDION'),
    {
        Panel: x => String(x).includes('.PANEL,'),
        Button: x => String(x).includes('.BUTTON,')
    }
)
const positionClasses = Webpack.getByKeys('noWrap');
const ButtonVoidClasses = Webpack.getByKeys('lookFilled', 'button');
const anchorClasses = Webpack.getByKeys('anchor', 'anchorUnderlineOnHover');
const FluxStore = Webpack.getModule(x => typeof x.ZP?.Store === 'function', {searchExports: false, searchDefault: false}).ZP
const ApplicationStore = Webpack.getStore("ApplicationStore");
const ChannelStore = Webpack.getStore("ChannelStore");
const DetectableGameSupplementalStore = Webpack.getStore("DetectableGameSupplementalStore");
const UserStore = Webpack.getStore("UserStore");
const RelationshipStore = Webpack.getStore("RelationshipStore");
const GameStore = Webpack.getStore("GameStore");
const RunningGameStore = Webpack.getStore("RunningGameStore");
const NowPlayingViewStore = Webpack.getStore("NowPlayingViewStore");
const ThemeStore = Webpack.getStore("ThemeStore");
const UserAffinitiesV2Store = Webpack.getStore("UserAffinitiesV2Store");
const VoiceStateStore = Webpack.getStore("VoiceStateStore");
const { useStateFromStores } = Webpack.getMangled(m => m.Store, {
        useStateFromStores: Webpack.Filters.byStrings("useStateFromStores")
        }, { raw: true });
const WindowStore = Webpack.getStore("WindowStore");
const AvatarFetch = Webpack.getBySource('src', 'statusColor', 'size', 'isMobile').qE;
const ActivityTimer = Webpack.getByStrings('timestamps', '.TEXT_FEEDBACK_POSITIVE', {searchExports: true});
const ActivityButtons = Webpack.getByStrings('activity', 'USER_PROFILE_ACTIVITY_BUTTONS');
const CallButtons = Webpack.getByStrings('PRESS_JOIN_CALL_BUTTON');
const JoinButton = Webpack.getByStrings('user', 'activity', 'onAction', 'onClose', 'themeType', 'embeddedActivity'); 
const SpotifyButtons = Webpack.getByStrings('activity', 'PRESS_PLAY_ON_SPOTIFY_BUTTON');;
const MediaProgressBar = Webpack.getByStrings('start', 'end', 'duration', 'percentage');
const FetchApplication = Webpack.getByKeys("fetchApplication");
const dmSidebar = Webpack.getBySource(".Z.CONTACTS_LIST");
const LinkButton = Webpack.getByStrings('route', 'iconClassName', {searchExports: true});
const dispatch = Webpack.getModule(x=>x._dispatch);
const FluxDispatcher = Webpack.getByKeys('dispatch', 'subscribe', 'register');
const ControllerIcon = "M15.1604 13.735H46.836C50.7677 13.735 54.0322 16.7112 54.3162 20.555L55.981 43.0836C56.1692 45.6297 54.2157 47.8431 51.6182 48.0276C51.5047 48.0357 51.3912 48.0397 51.2775 48.0397C48.2957 48.0397 45.6945 46.0559 44.962 43.2228L43.6727 38.2383H18.3236L17.0344 43.2228C16.3018 46.0559 13.7006 48.0397 10.7189 48.0397C8.11433 48.0397 6.00293 45.9701 6.00293 43.4173C6.00293 43.3061 6.00705 43.1946 6.01525 43.0836L7.67998 20.555C7.964 16.7112 11.2285 13.735 15.1604 13.735ZM37.2482 25.9867C39.3192 25.9867 40.9982 24.3411 40.9982 22.3112C40.9982 20.2812 39.3192 18.6357 37.2482 18.6357C35.1772 18.6357 33.4982 20.2812 33.4982 22.3112C33.4982 24.3411 35.1772 25.9867 37.2482 25.9867ZM47.2482 33.3377C49.3192 33.3377 50.9982 31.692 50.9982 29.6622C50.9982 27.6323 49.3192 25.9867 47.2482 25.9867C45.1772 25.9867 43.4982 27.6323 43.4982 29.6622C43.4982 31.692 45.1772 33.3377 47.2482 33.3377ZM15.9982 23.5363H10.9982V28.437H15.9982V33.3377H20.9982V28.437H25.9982V23.5363H20.9982V18.6357H15.9982V23.5363Z";
const HeaderBar = Webpack.getByKeys("Icon", "Divider");
const Popout = Webpack.getByStrings("Unsupported animation config:", {searchExports: true});
const PopoutContainer = Webpack.getByStrings('type', 'position', 'data-popout-animating', {searchExports: true});
const CardPopout = Webpack.getByStrings('party', 'close', 'onSelect', {searchExports: true});
const VoiceList = Webpack.getByStrings('maxUsers', 'guildId');
const useLocation = Object.values(Webpack.getBySource(".location", "withRouter")).find(m => m.length === 0 && String(m).includes(".location"));
const Route = Webpack.getByStrings('["impressionName","impressionProperties","disableTrack"]');
const OpenDM = Webpack.getModule(x => x.openPrivateChannel);
const ModalAccessUtils = Webpack.getModule(x=>x.openUserProfileModal);
const openVoiceChannel = Webpack.getModule(x=>x.selectVoiceChannel);
const GradientComponent = Webpack.getByStrings('darken', 's.Bd');
const NavigationUtils = Webpack.getMangled("transitionTo - Transitioning to", {
    transitionTo: Webpack.Filters.byStrings("\"transitionTo - Transitioning to \""),
    replace: Webpack.Filters.byStrings("\"Replacing route with \""),
    goBack: Webpack.Filters.byStrings(".goBack()"),
    goForward: Webpack.Filters.byStrings(".goForward()"),
    transitionToGuild: Webpack.Filters.byStrings("\"transitionToGuild - Transitioning to \"")
});
const FetchUtils = Webpack.getModule(x => typeof x === "object" && x.del && x.put, {searchExports: true});
const FetchGames = Webpack.getByKeys("getDetectableGamesSupplemental");
const GameProfile = Webpack.getModule(x => x.openGameProfileModal);
const GameProfileCheck = Webpack.getByStrings('gameProfileModalChecks',  'onOpened');
const intl = Webpack.getModule(x=>x.t && x.t.formatToMarkdownString);
const openSpotifyAlbumFromStatus = BdApi.Webpack.getByStrings(".metadata)?void", ".EPISODE?", {searchExports: true});
const trans = Webpack.getByKeys('Easing', 'accelerate');
const Tooltip = BdApi.Webpack.getModule(Webpack.Filters.byPrototypeKeys("renderTooltip"), { searchExports: true });
const Clipboard = Webpack.getByStrings('navigator.clipboard.write', { searchExports:true });
const ModalRoot = Webpack.getModule(x => x.Modal);
const ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
const FormSwitch = Webpack.getByStrings('"data-toggleable-component":"switch"', 'layout:"horizontal"', { searchExports: true });

const TooltipBuilder = ({ note, position, children }) => {
    return (
        createElement(Tooltip, {
            text: note,
            position: position || "top",
        }, props => {
            children.props = {
                ...props,
                ...children.props
            };
            return children;
        })
    );
};

const interpolate = (e) => {
    return new require(115199).create(e)
}

const settings = {
    main: {
        v2Cards: {
            name: "Activity Cards V2",
            note: "Enables the colorful visual refresh-inspired activity card designs. Recommended.",
            initial: true,
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

class GameNewsStore extends FluxStore.Store {
    static displayName = "GameNewsStore";
    dataSet = {};
    blacklist = [];
    lastTimeFetched;
    constructor() {
        super(FluxDispatcher);
        this.dataSet = {};
        this.displaySet = [];
        this.article = {index: 0, direction: 1, idling: true, orientation: this.getOrientation()},
        this.blacklist = [];
        this.lastTimeFetched;
        this.state = { size: [window.innerWidth, window.innerHeight] };

        window.addEventListener("resize", this.listener)
    }

    listener = () => {
        this.state = { size: [window.innerWidth, window.innerHeight] };
        this.emitChange();
    }

    componentDidMount() { window.addEventListener("resize", this.listener); }
    componentWillUnmount() { window.removeEventListener("resize", this.listener); }

    getFeeds() {
        return this.dataSet;
    }

    setFeeds() {
        this.dataSet = Object.assign(this.dataSet, Data.load('ACTest', 'dataSet'));
        this.blacklist = Data.load('ACTest', 'blacklist') || [];
        this.lastTimeFetched = Data.load('ACTest', 'lastTimeFetched');
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

        return b.find(e => e.game_id === gameId);
    }

    clearBlacklist() {
        let b = this.blacklist;
        
        b.length = 0;
        this.emitChange();
        return;
    }

    blacklistGame(applicationId, gameId) {
        let b = this.blacklist;
        console.log(b)

        if (!b.find(e => e.game_id === gameId)) {
            b.push({application_id: applicationId, game_id: gameId});
            console.log(this.blacklist)
            this.emitChange();
            Data.save('ACTest', 'blacklist', this.blacklist);
        }
        return;
    }

    whitelistGame(gameId) {
        let b = this.blacklist;
        const g = b.find(e => e.game_id === gameId);

        b.splice(b.indexOf(g), 1);
        this.emitChange();
        Data.save('ACTest', 'blacklist', this.blacklist);
        return this.blacklist;
    }

    async #fetchMinecraftFeeds(id, applicationList) {
        const rssFeed = await Promise.all([ Net.fetch(`https://net-secondary.web.minecraft-services.net/api/v1.0/en-us/search?pageSize=24&sortType=Recent&category=News&newsOnly=true`).then(r => r.ok ? r.json() : null) ])
        const article = rssFeed[0].result.results[0]
        const application = this.getApplicationByGameId(id, applicationList)
        return {
            application, 
            appId: application.id, 
            description: article?.description, 
            thumbnail: article?.image, 
            timestamp: article?.time * 1000, 
            title: article?.title, 
            url: article?.url
        }
    }

    async #fetchFortniteFeeds(steamId, applicationList) {
        const rssFeed = await Promise.all([ Net.fetch(`https://fortnite-api.com/v2/news`).then(r => r.ok ? r.json() : null) ])
        const article = rssFeed[0].data.br.motds[0]
        const application = this.getApplicationByGameId(steamId, applicationList)
        return {
            application,
            appId: application.id,
            description: article?.body,
            thumbnail: article?.image,
            timestamp: rssFeed[0].data.br.date,
            title: article?.title
        }
    }

    async #fetchSteamFeeds(steamId, applicationList) {
        const rssFeed = await Promise.all([ Net.fetch(`https://rssjson.vercel.app/api?url=https://store.steampowered.com/feeds/news/app/${steamId}`).then(r => r.ok ? r.json() : null) ])
        const article = this.getRSSItem(rssFeed)
        const application = this.getApplicationByGameId(steamId, applicationList)
        return {
            application, 
            appId: application.id, 
            description: article?.description?.[0],
            thumbnail: article?.enclosure?.[0]?.$?.url, 
            timestamp: article?.pubDate?.[0], 
            title: article?.title?.[0], 
            url: article?.link?.[0]
        }
    }

    async fetchFeeds(steamIds, applicationList) {
        for (const steamId of steamIds) {
            (async (steamId) => {
                let feeds;
                switch (steamId) {
                    case "Minecraft": feeds = await this.#fetchMinecraftFeeds(steamId, applicationList); break;
                    case "Fortnite": feeds = await this.#fetchFortniteFeeds(steamId, applicationList); break;
                    default: feeds = await this.#fetchSteamFeeds(steamId, applicationList);
                }
                this.dataSet[steamId] = {
                    id: steamId,
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
                }
                Data.save('ACTest', 'dataSet', this.dataSet);
            })(steamId)
        }
        this.lastTimeFetched = Date.now();
        
        Data.save('ACTest', 'lastTimeFetched', this.lastTimeFetched);
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
        if (isNaN(id)) { r = applicationList.find(game => game.name === id) }
        else { r = applicationList.find(game => game.thirdPartySkus.find(sku => sku.sku === id)) }
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
        //console.log(feeds)
        let _keys = keys.filter((key) => new Date(feeds[key].news.timestamp) > oW && !this.getBlacklistedGame(feeds[key].id))

        if (_keys.length < 5) return; 
        for (let g = 0; g < 4; g++) {
            let rand = _keys.length * Math.random() << 0;
            t.push(feeds[_keys[rand]]);
            _keys.splice(rand, 1)
        }
        return t;
    }

    getFeedsForDisplay() {
        const rG = this.displaySet;

        const r = this.getRandomFeeds(this.getFeeds());
        if (!this.shouldFetch() && !this.displaySet.length && r !== undefined) {
            rG.push.apply(rG, r);
        }
        return rG;
    }

    getCurrentArticle() {
        return this.article;
    }

    setCurrentArticle({index, direction, idling}) {
        let a = this.getCurrentArticle();

        return ({
            ...a, 
            index,
            direction: this.getDirection(direction),
            idling
        })
    }

    getOrientation() {
        let article = this.article;
        let window = this.state;
        console.log(window?.size)
        const val  = ((window?.size[0] > 1200 || window?.size[1] < 600) && (window?.size[0] < 1200 || window?.size[1] > 600)) ? "vertical" : "horizontal";
        this.emitChange();
        return val;
    }

    getDirection(e) {
        return e > 0 ? 1 : -1;
    }
}
const NewsStore = new GameNewsStore;
NewsStore === Webpack.getStore("GameNewsStore");

function useSelectedState() {
    return useLocation().pathname.startsWith("/activity-center");
}

function NavigatorButton() {
    
    return createElement(LinkButton, 
        { 
            selected: useSelectedState(), 
            route: "/activity-center", 
            text: "Activity", 
            icon: () => { return createElement('svg', {style: {width: "20", height: "20"}, viewBox: "0 0 20 20", fill: "none"},
                    createElement('path', {d: ControllerIcon, fill: "#B9BBBE", transform: "scale(0.35)"})
                )
            }
        }
    )
}

function SettingsPanelBuilder() {
    return [
        createElement('div', { className: "toggleStack_267ac", style: { padding: "var(--space-16) 0 var(--space-16) 0" }},
            createElement(() => Object.keys(settings.main).map((key) => {
                const { name, note, initial, changed } = settings.main[key];
                const [state, setState] = useState(Data.load('ACTest', key));

                return createElement(FormSwitch, {
                    label: name,
                    description: note,
                    checked: state ?? initial,
                    onChange: (v) => {
                        Data.save('ACTest', key, v);
                        setState(v);
                        if (changed)
                            changed(v);
                    }
                });
            }))
        ),
        createElement('div', { className: "settingsDivider_267ac sectionDivider_267ac", style: { marginBottom: "var(--space-12)" } }),
        createElement(Components.SettingGroup, {
            name: "Games You've Hidden",
            collapsible: false,
            shown: true,
            children: [
                createElement('div', { className: "blacklist_267ac emptyState_267ac", style: { padding: 0, borderBottom: "unset", lineHeight: "1.60" }}, 
                    createElement('div', { className: "emptyText_267ac" }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Below are the games you have hidden.")
                ),
                createElement(BlacklistBuilder) 
            ]
        }),
        createElement(Components.SettingGroup, {
            name: "Advanced/Debug",
            collapsible: true,
            shown: false,
            children: 
                createElement('div', { className: "toggleStack_267ac", style: { padding: "var(--space-16) 0 var(--space-16) 0" }},
                    createElement(() => Object.keys(settings.debug).map((key) => {
                        const { name, note, initial, type, changed } = settings.debug[key];
                        const [state, setState] = useState(Data.load('ACTest', key));

                        if (type === "switch") {
                            return createElement(FormSwitch, {
                                label: name,
                                description: note,
                                checked: state ?? initial,
                                onChange: (v) => {
                                    Data.save('ACTest', key, v);
                                    setState(v);
                                    if (changed)
                                        changed(v);
                                }
                            });
                        }
                        return (
                            createElement('div', { className: "buttonItem_267ac", style: { display: "flex" }}, [
                                createElement('div', { style: { display: "flex", flexDirection: "column", flex: 1 }}, [
                                    createElement('div', { className: "blacklistItemName_267ac textRow_267ac", style: { fontWeight: 500, fontSize: "16px", color: "var(--text-primary)" } }, name),
                                    createElement('div', { className: "textRow_267ac" }, note)
                                ]),
                                createElement('button', { 
                                    className: `button_267ac unhideBlacklisted_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.colorPrimary} ${ButtonVoidClasses.sizeTiny} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                                    onClick: () => NewsStore.displaySet = NewsStore.getRandomFeeds(NewsStore.dataSet)},
                                    "Reroll"
                                )
                            ])
                        )
                    }))
                ),
        })
    ]
}

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

function useElementSize(ref) {
    const [rect, setRect] = BdApi.React.useState(() => new DOMRectReadOnly());

    useLayoutEffect(() => {
        if (!ref.current) return;
        
        const observer = new ResizeObserver(([entry]) => {
            setRect(entry.contentRect);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);
    
    return rect;
}

function BlacklistItemBuilder({game, blacklist, updateBlacklist, key}) {
    const application = GameStore.getDetectableGame(game.application_id);

    return (
        createElement('div', { className: "blacklistItem_267ac", style: { display: "flex" }}, [
            createElement('img', { className: "blacklistItemIcon_267ac", src: `https://cdn.discordapp.com/app-icons/${application?.id}/${application.icon}.webp?size=32&keep_aspect_ratio=false` }),
            createElement('div', { className: "blacklistItemName_267ac textRow_267ac" }, application.name || "Unknown Game"),
            createElement('button', { 
                className: `button_267ac unhideBlacklisted_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.colorPrimary} ${ButtonVoidClasses.sizeTiny} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                onClick: () => ModalSystem.openModal((props) => 
                    createElement(ModalRoot.Modal, {
                        ...props,
                        title: "Are you sure?", 
                        actions: [
                            {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()}, 
                            {text: "Yes", fullWidth: 1, onClick: () => { NewsStore.whitelistGame(game.game_id); updateBlacklist(blacklist.filter(item => item.game_id !== game.game_id)); console.log(blacklist); props.onClose() }}
                        ]
                    }, [
                        createElement('div', { className: "emptyText_267ac" }, "Do you want to unhide this game? Its announcements will appear in your Activity Feed."),
                        createElement('div', { className: "emptyText_267ac", style: { fontWeight: 600 }}, "This action will require you to restart Discord in order to see changes.")
                    ])
                )},
                "Unhide"
            )
        ])
    )
}

function BlacklistBuilder() {
    const [blacklist, updateBlacklist] = useState(NewsStore.getBlacklist());
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return blacklist?.filter(item => GameStore.getDetectableGame(item.application_id).name.toLowerCase().includes(_query));
    }, [blacklist, query]);


    return ([
        createElement(Components.SearchInput, {
            className: "search_267ac",
            onChange: (e) => { setQuery(e.target.value.toLowerCase()); },
            placeholder: "Search for Games"
        }),
        filtered?.length ? createElement('div', { className: "blacklist_267ac" },
            filtered.map(game => [
                createElement(BlacklistItemBuilder, { game, blacklist, updateBlacklist, key: game.application_id }),
                createElement('div', { className: "sectionDivider_267ac" })
            ])
        )
        : createElement('div', { className: "blacklist_267ac emptyState_267ac" },
            createElement('div', { className: "emptyText_267ac" }, "You haven't hidden any games from your Activity Feed! When you do, they'll appear here.")
        )
    ]);
}

function chunkArray(cards, num){
    let chunkLength = Math.max(cards.length / num , 1);
    const chunks = [];
    for (let i = 0; i < num; i++) {
        if(chunkLength*(i+1)<=cards.length)chunks.push(cards.slice(chunkLength*i, chunkLength*(i+1)));
    }
    return chunks.reverse(); 
}

function DateGen(date) {
    const gdate = new Date(date);
    return ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][gdate.getMonth()] + " " + gdate.getDate() + ", " + gdate.getFullYear();
}

function GradGen(check, isSpotify, activity, game, voice, stream) {
    let input;
    switch (true) {
        case !! check.streaming: input = 'https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg'; break;
        case !! isSpotify: input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`; break;
        case !! activity?.name.includes("YouTube Music"): input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf('/'))}`; break;
        case !! game?.icon: input = `https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon}.png?size=1024&keep_aspect_ratio=true`; break;
        case !! activity?.platform?.includes("xbox"): input = 'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'; break;
        case !! activity?.assets && activity?.assets.large_image?.includes('external'): input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf('/'))}`; break;
        case !! activity: input = `https://cdn.discordapp.com/app-assets/${activity?.application_id}/${activity?.assets?.large_image}.png`; break;
        case !! voice[0]?.guild: input = `https://cdn.discordapp.com/icons/${voice[0]?.guild.id}/${voice[0]?.guild.icon}.png?size=1024`; break; 
        case !! voice && stream: input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`; break;
    }
    return GradientComponent(input || null);
}

function SplashGen(isSpotify, activity, game, voice, stream) {
    let input;
    switch (true) {
        case !! game?.currentGame?.splash?.length: input = `https://cdn.discordapp.com/app-icons/${game?.currentGame?.id}/${game?.currentGame?.splash}.png?size=1024&keep_aspect_ratio=true`; break;
        case !! isSpotify: input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`; break;
        case !! ["YouTube Music", "Crunchyroll"].includes(activity?.name): input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf('/'))}`; break;
        case !! voice && !activity: input = 'https://cdn.discordapp.com/banners/' + voice[0]?.guild?.id + '/' + voice[0]?.guild?.banner + '.webp?size=1024&keep_aspect_ratio=true'; break;
        case !! voice && stream: input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`; break;
        default: input = game?.data?.artwork[0];
    }
    return input || null;
}

function activityCheck({activities, spotify}) {
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

function FallbackAsset(props) {
    return (
        createElement('svg', { ...props },
            createElement('path', {
                style: { transform: "scale(1.65)" },
                fill: "white", 
                d: "M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
            })
        )
    )
}

function PartyMemberListBuilder({activity, users}) {
    const emptyNum = activity?.party?.size[1] - activity?.party?.size[0];
    const anonNum = activity?.party?.size[0] - 1;
    const emptyUsers = [];
    for (let i = 0; i < (anonNum); i++ ) {
        emptyUsers.push("anon");
    }
    for (let i = 0; i < (emptyNum); i++ ) {
        emptyUsers.push(null);
    }
    //console.log(users)
    const playerFill = users.concat(emptyUsers);
    //console.log(playerFill)
    return (
        createElement('div', { className: "partyList_267ac" }, [
            playerFill.splice(0, 10).map(player => { return (
                player === "anon" ? createElement('div', { className: "emptyUser_267ac", style: { background: "var(--experimental-avatar-embed-bg)" }},
                    createElement('svg', { width: 10, height: 10 },
                        createElement('path', { 
                            fill: "rgba(255, 255, 255, 0.7)", 
                            d: "M4.99967 4.16671C5.4417 4.16671 5.86563 3.99111 6.17819 3.67855C6.49075 3.36599 6.66634 2.94207 6.66634 2.50004C6.66634 2.05801 6.49075 1.63409 6.17819 1.32153C5.86563 1.00897 5.4417 0.833374 4.99967 0.833374C4.55765 0.833374 4.13372 1.00897 3.82116 1.32153C3.5086 1.63409 3.33301 2.05801 3.33301 2.50004C3.33301 2.94207 3.5086 3.36599 3.82116 3.67855C4.13372 3.99111 4.55765 4.16671 4.99967 4.16671ZM4.80384 4.58337C3.75071 4.58337 2.74071 5.00173 1.99604 5.7464C1.25136 6.49108 0.833008 7.50108 0.833008 8.55421C0.833008 8.89171 1.10801 9.16671 1.44551 9.16671H1.53717C1.63717 9.16671 1.72051 9.09587 1.74551 9.00004C1.86634 8.53337 2.09551 8.09587 2.29551 7.78754C2.35384 7.70004 2.47467 7.74587 2.46217 7.85004L2.35384 8.93754C2.34551 9.06254 2.43717 9.16671 2.56217 9.16671H7.43717C7.46638 9.16685 7.49529 9.16086 7.52202 9.14911C7.54876 9.13736 7.57273 9.12013 7.59237 9.09852C7.61202 9.07691 7.6269 9.05141 7.63605 9.02368C7.64521 8.99595 7.64843 8.9666 7.64551 8.93754L7.53301 7.85421C7.52467 7.74587 7.64551 7.70004 7.70384 7.78754C7.90384 8.09587 8.13301 8.53754 8.25384 8.99587C8.27884 9.09587 8.36217 9.16671 8.46217 9.16671H8.55384C8.89134 9.16671 9.16634 8.89171 9.16634 8.55421C9.16634 7.50108 8.74799 6.49108 8.00331 5.7464C7.25863 5.00173 6.24864 4.58337 5.19551 4.58337H4.80384Z"
                        })
                    )
                )
                : player === null ? createElement('div', { className: "emptyUser_267ac", style: { background: "var(--experimental-avatar-embed-bg)" }})
                : createElement(AvatarFetch, {
                    src: `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.webp?size=16`,
                    size: "SIZE_16",
                    imageClassName: "player_267ac"
                })
            )}),
            playerFill.length > 10 && createElement('div', { className: "emptyUser_267ac userOverflow_267ac" }, `+${(users.length + anonNum) - 10}`)
        ])
    )

}

function TimeClock({timestamp}) {
    const time = Math.floor((Date.now() - new Date(parseInt(timestamp)))/1000)

    if ( (time / 86400) > 1 ) {
        return intl.intl.formatToPlainString(intl.t['2rUo/p'], { time: Math.floor(time / 86400) });
    }
    else if ( (time / 3600) > 1 ) {
        return intl.intl.formatToPlainString(intl.t['eNoooU'], { time: Math.floor(time / 3600) });
    }
    else if ( (time / 60) > 1 ) {
        return intl.intl.formatToPlainString(intl.t['03mIHW'], { time: Math.floor(time / 60) });
    }
    else if ( (time % 60) < 60 ) {
        return intl.intl.formatToPlainString(intl.t['ahzZr+']);
    }
}

function userVoice({voice}) {
    let participants = [];
    const channelParticipants = Object.keys(VoiceStateStore.getVoiceStatesForChannel(voice));
    //console.log(channelParticipants)
    for (let i = 0; i < channelParticipants.length; i++) {
        participants.push(UserStore.getUser(channelParticipants[i]))
    }
    return participants;
}

function RegularActivityBuilder({user, activity, game, players, server, check, v2Enabled}) {
    const [width, height] = useWindowSize();
    const [shouldGameFallback, setShouldGameFallback] = useState(false);
    const gameId = activity?.application_id;
    const useGameProfile = GameProfileCheck({trackEntryPointImpression: false, applicationId: gameId});

    return (
        createElement('div', { 
            className: `${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignCenter} ${positionClasses.flex} activity_267ac`, style: { flex: "1 1 auto" } }, [
            shouldGameFallback ? createElement(FallbackAsset, { className: "smallEmptyIcon_267ac" })
            : check.spotify ? 
                createElement('svg', { 
                    className: "gameIcon_267ac", 
                    "aria-hidden": true, 
                    role: "image", 
                    width: 16, 
                    height: 16, 
                    viewBox: "0 0 16 16",
                    onClick: () => openSpotifyAlbumFromStatus(activity, user.id) },
                    createElement('g', { fill: "none", fillRule: "evenodd"}, [
                        createElement('path', { 
                            fill: "var(--spotify)",
                            d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
                        }),
                        createElement('rect', { width: 16, height: 16 })
                    ])
                )
            : activity?.platform?.includes('xbox') ? 
                createElement('img', {
                    className: "gameIcon_267ac",
                    style: { width: "60px", height: "60px", pointerEvents: "none" },
                    src: 'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'
                })
            : createElement('img', { 
                className: "gameIcon_267ac",
                src: game?.id && `https://cdn.discordapp.com/app-icons/${game?.id}/${game.icon}.webp?size=64&keep_aspect_ratio=false`,
                style: { pointerEvents: !useGameProfile && "none" },
                onError: () => { setShouldGameFallback(true) },
                onClick: useGameProfile
            }),
            createElement('div', { className: "gameInfo_267ac" }, [
                createElement('div', { className: "gameNameWrapper_267ac" }, 
                    createElement('div', { className: "gameName_267ac" }, game?.name)
                ),
                !activity?.assets?.large_image && createElement('div', { className: "playTime_267ac" }, 
                    createElement(TimeClock, { timestamp: activity.created_at })
                )
            ]),
            width > 1240 && ([
                server && createElement(VoiceList, {
                    className: "userList_267ac",
                    users: players,
                    maxUsers: players.length,
                    guildId: server?.id,
                    size: "SIZE_32"
                }),
                check.spotify !== 0 && createElement('div', { className: "serviceButtonWrapper_267ac" }, 
                    createElement(SpotifyButtons, { user: user, activity: activity }) 
                ),
                (!activity?.name.includes("YouTube Music") && activity?.assets) ? null : createElement('div', {
                    className: `button_267ac actionsActivity_267ac ${ButtonVoidClasses.lookFilled} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                    style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}, 
                    v2Enabled && activity?.party && activity?.party?.size ? null : createElement(ActivityButtons, {user: user, activity: activity})
                )
            ])
        ])
    )
}

function RichActivityBuilder({user, activity, v2Enabled}) {
    const [width, height] = useWindowSize();
    const [shouldLargeFallback, setShouldLargeFallback] = useState(false);
    const [shouldSmallFallback, setShouldSmallFallback] = useState(false);

    return (
        createElement('div', { 
            className: `${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignStretch} ${positionClasses.flex} richActivity_267ac`, style: { flex: "1 1 auto" } }, [
            createElement('div', { className: "activityActivityFeed_267ac activityFeed_267ac" },
                createElement('div', { className: `bodyNormal_267ac body_267ac ${positionClasses.flex}`}, [
                    createElement('div', { className: "assets_267ac" }, [
                            createElement(TooltipBuilder, { note: activity.assets.large_text || activity?.details },
                                shouldLargeFallback ? createElement(FallbackAsset, { className: "largeEmptyIcon_267ac" })
                                : createElement('img', { 
                                    className: "assetsLargeImageActivityFeed_267ac assetsLargeImage_267ac",
                                    "aria-label": activity.assets.large_text,
                                    alt: activity.assets.large_text,
                                    src: activity?.assets?.large_image?.includes('spotify') ? `https://i.scdn.co/image/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}` 
                                    : activity?.assets?.large_image?.includes('external') ? `https://media.discordapp.net/external${activity.assets.large_image?.substring(activity.assets.large_image.indexOf('/'))}`
                                    :  `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`,
                                    onError: () => { setShouldLargeFallback(true) }
                                })
                            ),
                            activity?.assets && activity?.assets.small_image && createElement(TooltipBuilder, { note: activity.assets.small_text || activity?.details }, 
                                shouldSmallFallback ? createElement(FallbackAsset, { className: "smallEmptyIcon_267ac" }) 
                                : createElement('img', {
                                    className: "assetsSmallImageActivityFeed_267ac assetsSmallImage_267ac",
                                    "aria-label": activity.assets.small_text,
                                    alt: activity.assets.small_text,
                                    src: activity?.assets?.small_image?.includes('external') ? `https://media.discordapp.net/external${activity.assets.small_image?.substring(activity.assets.small_image.indexOf('/'))}`
                                    :   `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`,
                                    onError: () => { setShouldSmallFallback(true) }
                                })
                            )
                        ]
                    ),
                    createElement('div', { className: "contentImagesActivityFeed_267ac content_267ac" }, [
                        createElement('div', { className: "details_267ac ellipsis_267ac textRow_267ac"}, activity?.details ? activity?.details : activity?.state),
                        activity?.details && createElement('div', { className: "state_267ac ellipsis_267ac textRow_267ac"}, activity?.state),
                        activity?.timestamps?.start && activity?.timestamps?.end ? createElement(MediaProgressBar, { start: activity?.timestamps?.start, end: activity?.timestamps?.end }) 
                        : createElement(ActivityTimer, { activity: activity })
                    ]),
                    (width > 1240 && !activity?.name.includes("YouTube Music")) && createElement('div', {
                        className: `button_267ac actionsActivity_267ac ${ButtonVoidClasses.lookFilled} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                        style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}, 
                        v2Enabled && activity?.party && activity?.party?.size ? null : createElement(ActivityButtons, {user: user, activity: activity})
                    )
                ])
            )
        ])
    )
}

function ActivityCard({user, activities, currentActivity, currentGame, players, server, check, v2Enabled}) {
    const gameId = currentActivity?.application_id;

    useEffect(() => { 
        (async () => {
            await FetchGames.getDetectableGamesSupplemental([gameId]);
        })()
    }, [gameId]);
        
    return ([
        createElement('div', { className: "activityContainer_267ac" }, [
            currentActivity?.assets && currentActivity?.assets.large_image ? [ 
                createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, check, v2Enabled }),
                createElement(RichActivityBuilder, { user, activity: currentActivity, v2Enabled })
            ] 
            : createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, players, server, check, v2Enabled }),
            v2Enabled && currentActivity?.party && currentActivity?.party.size && [
                createElement('div', { className: "sectionDivider_267ac", style: { margin: "8px 0 8px 0" } }),
                createElement('div', { className: "partyStatusWrapper_267ac" }, [
                    createElement(PartyMemberListBuilder, {
                        activity: currentActivity,
                        users: players
                    }),
                    createElement('div', { className: "partyPlayerCount_267ac", style: { flex: "1 1 100%" } }, intl.intl.formatToPlainString(intl.t['gLu7NU'], { partySize: currentActivity.party?.size[0], maxPartySize: currentActivity.party?.size[1] })),
                    createElement(JoinButton, { user: user, activity: currentActivity })
                ])
            ],
            activities.length > 1 && createElement('div', { className: "sectionDivider_267ac" }),
        ])
    ])
}
function ActivityCards({user, activities, voice, streams, check, v2Enabled}) {
    //console.log(size)

    if (!activities) return;
    
    return activities.map(activity => {
        const currentActivity = activity?.activity || streams[0].activity;
        const currentGame = activity?.game || GameStore.getGameByName(streams[0].activity.name);
        const players = activity.playingMembers;
        const server = voice[0]?.guild;

        return [ActivityCard({user: user, activities: activities, currentActivity: currentActivity, currentGame: currentGame, players: players, server: server, check: check, v2Enabled: v2Enabled})]
    })
}

function TwitchCards({user, activity}) {
    const [width, height] = useWindowSize();
    const currentGame = activity?.game;
    const currentActivity = activity?.activity;

    return ([
        createElement('div', { className: `${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignCenter} ${positionClasses.flex} twitchActivity_267ac`, style: { flex: "1 1 auto" } }, [
            createElement('img', { 
                className: "gameIcon_267ac",
                src: `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`,
                onError: () => { setShouldGameFallback(true) },
            }),
            createElement('div', { className: "gameInfoRich_267ac gameInfo_267ac" },
                createElement('div', { className: "streamInfo_267ac" }, [
                    createElement('div', { className: "gameName_267ac" }, currentGame?.name),
                    createElement('a', { 
                        className: `${ButtonVoidClasses.lookLink} ${anchorClasses.anchor} ${anchorClasses.anchorUnderlineOnHover} playTime_267ac`, 
                        href: currentActivity.url, 
                        rel: "noreferrer nopener", 
                        target: "_blank", 
                        role: "button"
                    }, currentActivity.url)
                ])
            ),
            width > 1240 && createElement('div', {
                className: `button_267ac actionsActivity_267ac ${ButtonVoidClasses.lookFilled} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}, 
                createElement(ActivityButtons, {user: user, activity: currentActivity})
            ),
        ]),
        createElement('div', { 
            className: `${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignStretch} ${positionClasses.flex} richActivity_267ac`, style: { flex: "1 1 auto" } }, [
            createElement('div', { className: "activityActivityFeed_267ac activityFeed_267ac" },
                createElement('div', { className: `bodyNormal_267ac body_267ac ${positionClasses.flex}`},
                    createElement('div', { className: "assets_267ac" }, [
                        createElement('div', { className: "twitchImageContainer_267ac" }, [
                            createElement('div', { className: "twitchImageOverlay_267ac"}, [
                                createElement('h3', { className: "streamName_267ac" }, currentActivity.details),
                                createElement('div', { className: "streamGame_267ac" }, `${intl.intl.formatToPlainString(intl.t['BMTj29'])} ${currentActivity.state}`)
                            ]),
                            createElement('a', {
                                className: `${anchorClasses.anchor} ${anchorClasses.anchorUnderlineOnHover} twitchBackgroundImage_267ac`,
                                href: currentActivity.url, 
                                rel: "noreferrer nopener", 
                                target: "_blank",
                                }, createElement('img', {
                                    className: "assetsLargeImageActivityFeedTwitch_267ac assetsLargeImage_267ac", 
                                    alt: null, 
                                    src: currentActivity.name.includes('YouTube') ? 
                                        'https://i.ytimg.com/vi/' + currentActivity.assets.large_image.substring(currentActivity.assets.large_image.indexOf(':')+1) + '/hqdefault_live.jpg'
                                        : 'https://static-cdn.jtvnw.net/previews-ttv/live_user_' + currentActivity.assets.large_image.substring(currentActivity.assets.large_image.indexOf(':')+1) + '-900x500.jpg',
                                    onError: (e) => e.currentTarget.src = 'https://static-cdn.jtvnw.net/ttv-static/404_preview-900x500.jpg'
                                })
                            )
                        ])    
                    ])
                )
            )
        ]),
    ])
}

function VoiceCards({activities, voice, streams}) {
    if (!voice.length && !streams.length) return;

    const [width, height] = useWindowSize();
    const channel = voice[0]?.channel;
    const server = voice[0]?.guild;
    const members = voice[0]?.members;
    const stream = streams[0]?.stream
    const streamUser = streams[0]?.streamUser

    if (stream && !channel) {
        const channel = ChannelStore.getChannel(stream.channelId);
        console.log(channel)
        const members = userVoice({voice: stream.channelId})
        console.log(members)
        return ([
            createElement('div', { className: "voiceSection_267ac" }, [
                createElement('div', { className: "voiceSectionAssets_267ac" }, [
                    createElement('img', { className: "voiceSectionGuildImage_267ac", src: channel?.icon ? `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=40` : `https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=40` }),
                    createElement('div', { className: "voiceSectionIconWrapper_267ac" },
                        createElement('svg', { className: "voiceSectionIcon_267ac", width: 24, height: 24, viewBox: "0 0 24 24" },
                            createElement('path', { fill: "currentColor", d: "M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" })
                        )
                    )
                ]),
                createElement('div', { className: "details_267ac", onClick: () => openVoiceChannel.selectVoiceChannel(channel.id) },
                    createElement('div', { className: "voiceSectionDetails_267ac" }, [
                        createElement('div', { className: "ellipsis_267ac voiceSectionText_267ac" }, channel?.name || streamUser?.globalName),
                    ])
                ),
                width > 1240 && [
                    createElement(VoiceList, {
                        className: "userList_267ac",
                        users: members,
                        maxUsers: 5,
                        channelId: channel.id,
                        size: "SIZE_32",
                    }),
                    createElement(CallButtons, { channel: channel })
                ],
            ]),
            activities.length ? createElement('div', { className: "sectionDivider_267ac" }) : null
        ]);
    }
    return ([
        createElement('div', { className: "voiceSection_267ac" }, [
            createElement('div', { className: "voiceSectionAssets_267ac" }, [
                createElement('img', { className: "voiceSectionGuildImage_267ac", src: `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=40` }),
                createElement('div', { className: "voiceSectionIconWrapper_267ac" },
                    createElement('svg', { className: "voiceSectionIcon_267ac", width: 24, height: 24, viewBox: "0 0 24 24" },
                        createElement('path', { fill: "currentColor", d: "M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" })
                    )
                )
            ]),
            createElement('div', { className: "details_267ac", onClick: () => openVoiceChannel.selectVoiceChannel(channel.id) },
                createElement('div', { className: "voiceSectionDetails_267ac" }, [
                    createElement('div', { className: "ellipsis_267ac voiceSectionText_267ac" }, server?.name || channel?.name),
                    createElement('div', { className: "ellipsis_267ac voiceSectionSubtext_267ac" }, channel?.name)
                ])
            ),
            width > 1240 && ([
                createElement(VoiceList, {
                    className: "userList_267ac",
                    users: members,
                    maxUsers: 5,
                    guildId: server?.id,
                    channelId: channel.id,
                    size: "SIZE_32",
                }),
                createElement(CallButtons, { channel: channel })
            ])
        ]),
        activities.length ? createElement('div', { className: "sectionDivider_267ac" }) : null
    ])
}



function StreamCards({user, voice, streams}) {
    
    const channel = voice[0]?.channel;
    const stream = streams[0]?.stream
    return;
} 

function AffinityFetch() {
    let e = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
    return (
        FetchUtils.get({
            url: `/users/@me/affinities/v2/users`,
            retries: 3 * !!e,
            oldFormErrors: !0,
            rejectWithError: !1
        }).then(e => {
            let { body: t } = e;
            FluxDispatcher.dispatch({
                type: "LOAD_USER_AFFINITIES_V2_SUCCESS",
                affineUsers: t.user_affinities.map(e => {
                    var t, n, r, i, a, o, s, l;
                    return {
                        otherUserId: e.other_user_id,
                        userSegment: e.user_segment,
                        otherUserSegment: e.other_user_segment,
                        isFriend: e.is_friend,
                        dmProbability: null != (t = e.dm_probability) ? t : 0,
                        dmRank: null != (n = e.dm_rank) ? n : 0,
                        vcProbability: null != (r = e.vc_probability) ? r : 0,
                        vcRank: null != (i = e.vc_rank) ? i : 0,
                        serverMessageProbability: null != (a = e.server_message_probability) ? a : 0,
                        serverMessageRank: null != (o = e.server_message_rank) ? o : 0,
                        communicationProbability: null != (s = e.communication_probability) ? s : 0,
                        communicationRank: null != (l = e.communication_rank) ? l : 0
                    }
                })
            })
        })
    )
}

function FeedPopout({application_id, game_id, close}) {
    const confirmOptions = ["Be rid of it", "Yes", "Proceed"];
    const confirmText = confirmOptions[Math.floor(Math.random() * confirmOptions.length)];

    return (
        createElement(ContextMenu.Menu, {
            navId: "feed-overflow",
            onClose: close,
            children: [
                createElement(ContextMenu.Item, {
                    id: "copy-app-id",
                    label: "Copy Application ID",
                    action: () => Clipboard(application_id),
                }),
                createElement(ContextMenu.Item, {
                    id: "blacklist-game",
                    label: "Don't show news for this game",
                    action: () => ModalSystem.openModal((props) => 
                        createElement(ModalRoot.Modal, {
                            ...props,
                            title: "Are you sure?", 
                            actions: [
                                {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()}, 
                                {text: confirmText, fullWidth: 1, onClick: () => { NewsStore.blacklistGame(application_id, game_id); props.onClose() }}
                            ]
                        }, [
                            createElement('div', { className: "emptyText_267ac" }, "Do you want to hide this game from appearing in your Activity Feed? You can re-enable its visibility at any time in settings."),
                            createElement('div', { className: "emptyText_267ac", style: { fontWeight: 600 }}, "This action will require you to restart Discord in order to see changes.")
                        ])
                    )
                })
            ]
        })
    )
}

function NewsFeedSkeletonErrorBuilder({errorText, errorDescription}) {
    const [width, height] = useWindowSize();
    if (width > 1200 && height > 600) {
        return createElement('div', { className: "feedCarousel_267ac", style: { margin: "20px" } }, [
            createElement('span', { className: "carousel_267ac" },
                createElement('div', { className: "articleSkeleton_267ac article_267ac" },
                    createElement('div', { className: "background_267ac" },
                        createElement('div', { 
                            className: "backgroundImage_267ac", 
                            style: { backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" } 
                        })
                    ),
                    createElement('div', { className: "detailsContainer_267ac" }, [
                        createElement('div', { className: "details_267ac" }, [
                            createElement('div', { className: "titleStandard_267ac title_267ac" }, errorText),
                            errorDescription && createElement('div', { className: "description_267ac" }, errorDescription),
                        ])
                    ])
                )
            )
        ])
    }
    else {
        return createElement('div', { className: "feedCarousel_267ac", style: { margin: "20px" } },
            createElement('span', { className: "smallCarousel_267ac" },
                createElement('div', { className: "articleSkeleton_267ac articleSimple_267ac article_267ac" },
                    createElement('div', { className: "background_267ac" },
                        createElement('div', { 
                            className: "backgroundImage_267ac", 
                            style: { backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" } 
                        })
                    ),
                    createElement('div', { className: "detailsContainer_267ac", style: { marginBottom: "40px" } }, [
                        createElement('div', { className: "titleRowSimple_267ac" },
                            createElement('div', {className: "titleStandard_267ac title_267ac"}, errorText)
                        )
                    ])
                )
            )
        )
    }
}

function NewsFeedSkeletonBuilder() {
    const [width, height] = useWindowSize();
    if (width > 1200 && height > 600) {
        return createElement('div', { className: "feedCarousel_267ac", style: { margin: "20px" } }, [
            createElement('span', { className: "carousel_267ac" },
                createElement('div', { className: "articleSkeleton_267ac article_267ac" })
            ),
            createElement('div', { className: "pagination_267ac" },
                createElement('div', { className: "scrollerWrap_267ac" },
                    createElement('div', { className: "scroller_267ac verticalPaginationItemContainer_267ac" }, [
                        createElement('div', { className: "paginationSkeleton_267ac paginationItem_267ac" }),
                        createElement('div', { className: "paginationSkeleton_267ac paginationItem_267ac" }),
                        createElement('div', { className: "paginationSkeleton_267ac paginationItem_267ac" }),
                        createElement('div', { className: "paginationSkeleton_267ac paginationItem_267ac" })
                    ])
                )
            )
        ])
    }
    else {
        return createElement('div', { className: "feedCarousel_267ac", style: { margin: "20px" } },
            createElement('span', { className: "smallCarousel_267ac" },
                createElement('div', { className: "articleSkeleton_267ac articleSimple_267ac article_267ac" })
            )
        )
    }
}

function NewsFeedCarouselBuilder(currentItem, article) {
    
}

function NewsFeedMiniCarouselBuilder({currentItem, article}) {
    return (
        createElement('a', { 
            "tabindex": article.index, 
            className: `${anchorClasses.anchor} ${anchorClasses.anchorUnderlineOnHover}`,
            href: currentItem.news?.url || "#",
            rel: "noreferrer nopener", 
            target: "_blank", 
            role: "button"
        },
            createElement('div', { className: "articleSimple_267ac article_267ac" }, [
                createElement('div', { className: "background_267ac" },
                    createElement('div', { 
                        className: "backgroundImage_267ac", 
                        style: { backgroundImage: currentItem.news?.thumbnail 
                        ? `url(${currentItem.news?.thumbnail})` 
                        : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.id}/capsule_616x353.jpg)` } 
                    })
                ),
                createElement('div', { className: "detailsContainer_267ac", style: { opacity: 1, zIndex: 1, marginBottom: "40px" } }, [
                    createElement('div', { className: "applicationArea_267ac" },
                        createElement('img', { 
                            className: "gameIcon_267ac", 
                            src: currentItem.news?.application_id && currentItem.application?.icon
                            ? `https://cdn.discordapp.com/app-icons/${currentItem.news?.application_id}/${currentItem.application?.icon}.webp?size=64&keep_aspect_ratio=false`
                            : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.id}/capsule_231x87.jpg`
                        })
                    ),
                    createElement('div', { className: "titleRowSimple_267ac" },
                        createElement('div', {className: "titleStandard_267ac title_267ac"}, currentItem.news?.title || "No Title")
                    )
                ])
            ])
        )
    )
}

function NewsFeedMiniPaginationBuilder({article, handleDirection}) {
    return (
        createElement('div', { className: "paginationSmall_267ac" }, [
            createElement('button', { 
                type: "button", 
                className: `prevButtonContainer_267ac arrow_267ac button_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.grow}`,
                onClick: () => { setArticle({index: article.index - 1, direction: -1, idling: false, orientation: handleOrientation()}) },
                disabled: article.index !== 0 ? false : true },
                createElement('div', { className: `${ButtonVoidClasses.contents}`},
                    createElement('svg', { width: 24, height: 24, className: "arrow_267ac left_267ac"},
                        createElement('polygon', { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"})
                    )
                )
            ),
            createElement('div', { className: "scrollerWrap_267ac"},
                createElement('div', { className: `scroller_267ac horizontalPaginationItemContainer_267ac ${positionClasses.alignCenter}` },
                    randomGames.map((button, index) => {
                        return createElement('div', { 
                            className: article.index === index ? "dotSelected_267ac dot_267ac" : "dotNormal_267ac dot_267ac",
                            onClick: () => setArticle({index: index, direction: handleDirection(index - article.index), idling: false, orientation: handleOrientation()})
                        })
                    })
                )
            ),
            createElement('button', { 
                type: "button", 
                className: `nextButtonContainer_267ac arrow_267ac button_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.grow}`,
                onClick: () => { setArticle({index: article.index + 1, direction: 1, idling: false, orientation: handleOrientation()}) },
                disabled: article.index !== 3 ? false : true },
                createElement('div', { className: `${ButtonVoidClasses.contents}`},
                    createElement('svg', { width: 24, height: 24, className: "arrow_267ac right_267ac"},
                        createElement('polygon', { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"})
                    )
                )
            )    
        ])
    )
}

function NewsFeedOverflowBuilder({application_id, game_id, position}) {
    const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);

    return (
        createElement(Popout, {
            targetElementRef: refDOM,
            clickTrap: true,
            onRequestClose: () => setShowPopout(false),
            renderPopout: () => createElement(PopoutContainer, { position },
                createElement(FeedPopout, { application_id, game_id, close: () => setShowPopout(false) })),
                position,
                shouldShow: showPopout
            }, (props) => createElement('div',
                {
                    ...props,
                    ref: refDOM,
                    onClick: () => setShowPopout(true),
                    style: { position: "absolute", zIndex: 2, top: "0", right: "0" }
                },
                createElement(TooltipBuilder, { note: "More" },
                    createElement('div', { className: "feedOverflowMenu_267ac" }, 
                        createElement('svg', { width: 24, height: 24 }, 
                            createElement('path', { d: "M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z", fill: "white" })
                        )
                    )
                )
            )
        )
    )
}

function NewsFeedBuilder() {
    //const [width, height] = useWindowSize();
    const width = useStateFromStores([ WindowStore ], ()  => WindowStore.windowSize().width)
    const height = useStateFromStores([ WindowStore ], ()  => WindowStore.windowSize().height)
    const [timeout, setTime] = useState(true);

    const [applicationList, setApplicationList] = useState([]);
    const [steamIds, setSteamIds] = useState([]);
    const gameList = RunningGameStore.getGamesSeen().filter(game => GameStore.getGameByName(game.name));

    if (!gameList.length) return createElement(NewsFeedSkeletonErrorBuilder, { errorText: "Activity Feed Unavailable", errorDescription: "You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again." });
    
    const gameIds = gameList.filter(game => game.id || game.name === "Minecraft").map(game => game.name === "Minecraft" ? GameStore.getGameByName(game.name).id : game.id);

    useEffect(() => {
        (async () => {
            const response = await FetchApplication.fetchApplications(gameIds);
            const applicationList = gameList.map(game => BdApi.Webpack.getStore("ApplicationStore").getApplicationByName(game.name)).filter(game => game && game.thirdPartySkus.length > 0 && game.thirdPartySkus.some(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"))
            const steamIds = applicationList.map(game => { const steamSku = game.thirdPartySkus.find(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"); return steamSku?.sku || game.name })
            setApplicationList(applicationList);
            setSteamIds(steamIds);
        })()
    },[gameIds, applicationList, steamIds]);

    if ( NewsStore.shouldFetch() === true && steamIds.length > 0 ) NewsStore.fetchFeeds(steamIds, applicationList);
    const feeds = useStateFromStores([ NewsStore ], () => NewsStore.getFeeds());
    
    const randomGames = NewsStore.getFeedsForDisplay();
    const handleOrientation = () => {
        return ((width > 1200 || height < 600) && (width < 1200 || height > 600)) ? "vertical" : "horizontal";
    }
    const handleDirection = (e) => {
        return e > 0 ? 1 : -1;
    };
    const handleSwitch = (cur) => {
        if (article.idling) {
            setArticle({index: cur.index === 3 ? article.index - 3 : article.index + 1, direction: cur.index === 3 ? -1 : 1, idling: true, orientation: handleOrientation()});
        }
        return;
    };
    const [article, setArticle] = useState({index: 0, direction: 1, idling: true, orientation: handleOrientation()});
    //console.log(NewsStore.getCurrentArticle())

    useEffect(() => {
        const interval = setInterval(() => {
            handleSwitch(article)
        }, 8e3);

        return () => clearInterval(interval);
    }, [article]);

    const getRootStyle = function(value) {
        var e = article.orientation === "horizontal" ? {
          translateX: value.interpolate({
            inputRange: [0, 1],
            outputRange: ["0px", "-15px"]
          })
        } : {
          translateY: value.interpolate({
            inputRange: [0, 1],
            outputRange: ["0px", "15px"]
          })
        };
        console.log(Animated.accelerate({     
        transform: [{
            scale: value.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [1.015, 1, 1.015]
            })
        }, e],
            opacity: value.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
                easing: Animated.Easing.out(Animated.Easing.ease)
            }),
        }))
        return Animated.accelerate({     
            transform: [{
                scale: value.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1.015, 1, 1.015]
                })
            }, e],
            opacity: value.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
                easing: Animated.Easing.out(Animated.Easing.ease)
            }),
            zIndex: 1
        })
    }
    //console.log(getRootStyle())

    if (feeds && randomGames.length > 0 && article.index < randomGames.length) {
        const currentItem = randomGames[article.index];
        //console.log([currentItem, article])
        //console.log(currentItem)
        //const [notTransitioning, setTransition] = useState(true);

        //const opacitySpring = useTransition(notTransitioning, {
        //    from: {
        //        opacity: Number(notTransitioning),
        //        zIndex: Number(notTransitioning)
        //    },
        ///    enter: {
        //        opacity: Number(notTransitioning),
        //        zIndex: Number(notTransitioning)    
        //    },
        //    leave: {
        //        opacity: Number(notTransitioning),
        //        zIndex: Number(notTransitioning)
        //    },
        //    onRest: () =>  setTransition(true)
        //})

        //const value = useRef(new Animated.Value(1)).current;
        if (!currentItem) {
            return createElement(NewsFeedSkeletonErrorBuilder, { errorText: "Failed to fetch news.", errorDescription: "Reload Discord to try again." });
        }
        if (width > 1200 && height > 600) {
            return createElement('div', { 
                className: "feedCarousel_267ac", 
                style: { margin: "20px" }, 
                onMouseOver: () => setArticle({index: article.index, direction: article.direction, idling: false, orientation: handleOrientation()}),
                onMouseLeave: () => setArticle({index: article.index, direction: article.direction, idling: true, orientation: handleOrientation()}) }, [
                createElement('span', { className: "carousel_267ac" }, [
                    createElement(NewsFeedOverflowBuilder, { application_id: currentItem.application.id, game_id: currentItem.id, position: "right" }),
                    createElement('a', { 
                            "tabindex": article.index, 
                            className: `${anchorClasses.anchor} ${anchorClasses.anchorUnderlineOnHover}`,
                            href: currentItem.news?.url || "#",
                            rel: "noreferrer nopener", 
                            target: "_blank", 
                            role: "button"
                        },
                        createElement('div', { className: "articleStandard_267ac article_267ac", style: { opactiy: 1, zIndex: 1 } }, [
                            createElement('div', { className: "background_267ac" },
                                createElement('div', { 
                                    className: "backgroundImage_267ac", 
                                    style: { backgroundImage: currentItem.news?.thumbnail 
                                    ? `url(${currentItem.news?.thumbnail})` 
                                    : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.id}/capsule_616x353.jpg)` } 
                                })
                            ),
                            createElement('div', { className: "detailsContainer_267ac", style: { opacity: 1, zIndex: 1 } }, [
                                createElement('div', { className: "applicationArea_267ac"}, 
                                    createElement('img', { 
                                        className: "gameIcon_267ac", 
                                        src: currentItem.news?.application_id && currentItem.application?.icon
                                        ? `https://cdn.discordapp.com/app-icons/${currentItem.news.application_id}/${currentItem.application?.icon}.webp?size=64&keep_aspect_ratio=false`
                                        : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.news.application_id}/capsule_231x87.jpg`
                                    })
                                ),
                                createElement('div', { className: "details_267ac" }, [
                                    createElement('div', { className: "titleStandard_267ac title_267ac" }, currentItem.news?.title || "No Title"),
                                    createElement('div', { className: "description_267ac", dangerouslySetInnerHTML: {__html: currentItem.news?.description || "No description available."}}),
                                    createElement('div', { className: "timestamp_267ac" }, DateGen(currentItem.news?.timestamp))
                                ])
                            ])
                        ])
                    )
            ]),
                createElement('div', { className: "pagination_267ac" },
                    createElement('div', { className: "scrollerWrap_267ac" },
                        createElement('div', { className: "scroller_267ac verticalPaginationItemContainer_267ac" },
                            randomGames.map((game, index) => {
                                if (!game) return null;

                                return createElement('div', { 
                                    className: article.index === index ? "paginationItem_267ac selectedPage_267ac" : "paginationItem_267ac", 
                                    onClick: () => { setArticle({index: index, direction: handleDirection(index - article.index)}) },
                                    key: index
                                }, [
                                    createElement('div', { 
                                        className: "splashArt_267ac", 
                                        style: { backgroundImage: game.news?.thumbnail 
                                            ? `url(${game.news?.thumbnail})` 
                                            : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.id}/capsule_231x87.jpg)` }
                                        }),
                                    createElement('div', { className: "paginationText_267ac" }, [
                                        createElement('div', { className: "paginationTitle_267ac paginationContent_267ac"}, game.news?.title || "No Title"),
                                        createElement('div', { className: "paginationSubtitle_267ac paginationContent_267ac"}, game.application.name || "Unknown Game")
                                    ]
                                )
                            ]);
                        }).filter(Boolean)
                    )
                )
            )]);
        }
        else {
            return createElement('div', { 
                className: "feedCarousel_267ac", 
                style: { margin: "20px" },
                onMouseEnter: () => setArticle({index: article.index, direction: article.direction, idling: false, orientation: handleOrientation()}),
                onMouseLeave: () => setArticle({index: article.index, direction: article.direction, idling: true, orientation: handleOrientation()}) }, [
                createElement('span', { className: "smallCarousel_267ac" }, [
                    createElement(NewsFeedOverflowBuilder, { application_id: currentItem.application.id, game_id: currentItem.id, position: "bottom" }),
                    createElement(NewsFeedMiniCarouselBuilder, { currentItem: currentItem, article: article })
                ]),
                createElement('div', { className: "paginationSmall_267ac" }, [
                    createElement('button', { 
                        type: "button", 
                        className: `prevButtonContainer_267ac arrow_267ac button_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.grow}`,
                        onClick: () => { setArticle({index: article.index - 1, direction: -1, idling: false, orientation: handleOrientation()}) },
                        disabled: article.index !== 0 ? false : true },
                        createElement('div', { className: `${ButtonVoidClasses.contents}`},
                            createElement('svg', { width: 24, height: 24, className: "arrow_267ac left_267ac"},
                                createElement('polygon', { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"})
                            )
                        )
                    ),
                    createElement('div', { className: "scrollerWrap_267ac"},
                        createElement('div', { className: `scroller_267ac horizontalPaginationItemContainer_267ac ${positionClasses.alignCenter}` },
                            randomGames.map((button, index) => {
                                return createElement('div', { 
                                    className: article.index === index ? "dotSelected_267ac dot_267ac" : "dotNormal_267ac dot_267ac",
                                    onClick: () => setArticle({index: index, direction: handleDirection(index - article.index), idling: false, orientation: handleOrientation()})
                                })
                            })
                        )
                    ),
                    createElement('button', { 
                        type: "button", 
                        className: `nextButtonContainer_267ac arrow_267ac button_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.grow}`,
                        onClick: () => { setArticle({index: article.index + 1, direction: 1, idling: false}) },
                        disabled: article.index !== 3 ? false : true },
                        createElement('div', { className: `${ButtonVoidClasses.contents}`},
                            createElement('svg', { width: 24, height: 24, className: "arrow_267ac right_267ac"},
                                createElement('polygon', { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"})
                            )
                        )
                    )    
                ])
            ])
        }
    }

    setTimeout(() => setTime(false), 10000);
    if ( timeout ) {
        return createElement(NewsFeedSkeletonBuilder)
    }
    
    return createElement(NewsFeedSkeletonErrorBuilder, { errorText: "Activity Feed Unavailable", errorDescription: "You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again." });
}
function LauncherGameBuilder({game, runningGames}) {
    const [shouldDisable, setDisable] = useState(false);
    //console.log(runningGames);
    const timer = setTimeout(() => setDisable(false), 10000);

    const disableCheck = useMemo(() => ~runningGames.findIndex(m => m.name === game.name) || shouldDisable, [ runningGames, shouldDisable ])
    
    return createElement('div', { className: `dockItem_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}, ${positionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, [
            createElement('div', { className: "dockIcon_267ac", style: { backgroundImage: `url(${'https://cdn.discordapp.com/app-icons/' + GameStore.getGameByName(game.name).id + '/' + GameStore.getGameByName(game.name).icon + '.webp'})` } }),
            createElement('div', { className: "dockItemText_267ac" }, game.name),
            createElement('button', { className: `dockItemPlay_267ac ${ButtonVoidClasses.button} ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.colorGreen} ${ButtonVoidClasses.sizeSmall} ${ButtonVoidClasses.fullWidth} ${ButtonVoidClasses.grow}`, 
                disabled: disableCheck,
                onClick: () => { setDisable(true); shell.openExternal(game.exePath); timer }},  
                createElement('div', { className: `${ButtonVoidClasses.contents}`}, "Play")
            )
        ]
    )
}

function QuickLauncherBuilder(props) {
    const runningGames = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getRunningGames());
    const gameList = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getGamesSeen());
    const _gameList = gameList.filter(game => GameStore.getGameByName(game.name)).slice(0, 12);
    //console.log(_gameList);

    if (gameList.length === 0) {
        return createElement('div', {...props}, [
                createElement('div', { className: `headerContainer_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyBetween} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                    createElement('div', { className: "headerText_267ac" }, "Quick Launcher")
                ),
                createElement('div', { className: "dock_267ac emptyState_267ac"}, [
                        createElement('svg', { className: "emptyIcon_267ac", name: "OpenExternal", width: 16, height: 16, viewBox: "0 0 24 24"},
                            createElement('path', { fill: "currentColor", transform: "translate(3, 4)", d: "M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z"})
                        ),
                        createElement('div', { className: "emptyText_267ac"}, "Discord can quickly launch most games you’ve recently played on this computer. Go ahead and launch one to see it appear here!")
                    ]
                )
            ]
        )
    }

    return createElement('div', {...props}, [
            createElement('div', { className: `headerContainer_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyBetween} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                createElement('div', { className: "headerText_267ac" }, "Quick Launcher")
            ),
            createElement('div', { className: "dock_267ac"},
                _gameList.map(game => createElement(LauncherGameBuilder, { game, runningGames }))
            )
        ]
    )
}

function NowPlayingCardBuilder({card, v2Enabled}) {
    const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);

    const user = card.party.priorityMembers[0].user;
    const status = card.party.priorityMembers[0].status;
    const activities = card.party.currentActivities;
    const currentGame = card.party.currentActivities[0]?.game
    const voice = card.party.voiceChannels;
    const streams = card.party.applicationStreams;
    const isSpotify = card.party.isSpotifyActivity;
    const filterCheck = activityCheck({activities: activities, spotify: isSpotify});
    const cardGrad = GradGen(filterCheck, isSpotify, activities[0]?.activity, currentGame, voice, streams[0]?.stream);

    useEffect(() => { 
        (async () => {
            await FetchGames.getDetectableGamesSupplemental([currentGame?.id]);
        })()
    }, [currentGame?.id]);
    
    const game = DetectableGameSupplementalStore.getGame(currentGame?.id) || (ApplicationStore.getApplication(currentGame?.id) && DetectableGameSupplementalStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id));
    const splash = SplashGen(isSpotify, activities[0]?.activity, {currentGame: currentGame, data: game}, voice, streams[0]?.stream);
    //console.log(activities);

    return createElement('div', { className: v2Enabled ? "cardV2_267ac" : "card_267ac", style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})`} }, [
        createElement('div', { className: `cardHeader_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, [
            voice && activities.length === 0 ? 
            createElement('div', { className: "server_267ac splashArt_267ac", style: { backgroundImage: `url(${splash})` } }) 
            : createElement('div', { className: "splashArt_267ac", style: { backgroundImage: `url(${splash})` } }),
            createElement('div', { className: "header_267ac"}, [ 
                createElement(AvatarFetch, { imageClassName: "avatar", src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`, status: status, size: "SIZE_40" }),
                createElement('div', { className: "nameTag_267ac", style: { flex: 1 } },
                    createElement('span', {className: "username", onClick: () => ModalAccessUtils.openUserProfileModal({ userId: user.id }) },
                    voice[0]?.members.length > 2 
                    ? `${user.globalName}, ${intl.intl.formatToPlainString(intl.t['zRRd8G'], { count: voice[0]?.members.length - 2, name: (voice[0]?.members[voice[0]?.members.length - 1].globalName ||  voice[0]?.members[voice[0]?.members.length - 1].username) })}`
                    : voice[0]?.members.length > 1 
                        ? intl.intl.formatToPlainString(intl.t['4SM/RX'], { user1: (user.globalName || voice[0]?.members[1].username), user2: (voice[0]?.members[1].globalName || voice[0]?.members[1].username) })
                        : (user.globalName || user.username)
                    )
                ),
                createElement('div', { 
                    className: `headerActions_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyEnd} ${positionClasses.alignCenter}`, 
                    style: { flex: "0" }}, [
                    createElement('button', { 
                        type: "button", 
                        className: `button_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.sizeSmall}`, 
                        onClick: () => OpenDM.openPrivateChannel({recipientIds: user.id})
                    }, "Message"),
                    createElement('div', {}, 
                        createElement(Popout, { 
                            targetElementRef: refDOM,
                            clickTrap: true,
                            onRequestClose: () => setShowPopout(false),
                            renderPopout: () => createElement(PopoutContainer, { position: "left" }, 
                                createElement(CardPopout, { party: card.party, close: () => setShowPopout(false) })),
                            position: "left",
                            shouldShow: showPopout
                        }, (props) => createElement('div', 
                            { 
                                ...props,
                                ref: refDOM,
                                onClick: () => setShowPopout(true)
                            },
                            createElement('button', {
                                type: "button",
                                className: `button_267ac ${ButtonVoidClasses.lookBlank} ${ButtonVoidClasses.grow}`,
                            }, createElement('svg', { 
                                width: 24, 
                                height: 24, 
                                viewBox: "0 0 24 24",
                                className: "overflowMenu_267ac" },
                                createElement('g', { fill: "none", fillRule: "evenodd"}, [
                                    createElement('path', { d: "M24 0v24H0V0z" }),
                                    createElement('path', { 
                                        fill: "currentColor", 
                                        fillRule: "evenodd", 
                                        d: "M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z" }
                                    )
                                ])
                            ))
                        ))
                    )
                ]),
                isSpotify ? createElement('svg', { 
                    className: "headerIcon_267ac", 
                    "aria-hidden": true, 
                    role: "image",
                    width: 16, 
                    height: 16, 
                    viewBox: "0 0 16 16" },
                    createElement('g', { fill: "none", fillRule: "evenodd"}, [
                        createElement('path', { 
                            fill: "var(--spotify)",
                            d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
                        }),
                        createElement('rect', { width: 16, height: 16 })
                    ])
                )
                : activities.length !== 0 && createElement('img', { 
                    className: "headerIcon_267ac", 
                    alt: "",
                    src: `https://cdn.discordapp.com/app-icons/${currentGame?.id}/${currentGame?.icon}.png?size=64&keep_aspect_ratio=false` 
                })
            ])
        ]),
        createElement('div', { className: "cardBody_267ac" },
            createElement('div', { className: "section_267ac" },
                createElement('div', { className: "game_267ac" },
                    createElement('div', { className: `gameBody_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, style: { flex: "1 1 auto" } }, [
                        //!streams.length ? createElement(VoiceCards, { activities: activities, voice: voice, streams: streams }) : createElement(StreamCards, { user: user, voice: voice, streams: streams }),
                        createElement(VoiceCards, { activities: activities, voice: voice, streams: streams }),
                        filterCheck.streaming ? createElement(TwitchCards, { user: user, activity: activities[0] }) : createElement(ActivityCards, { user: user, activities: activities, voice: voice, streams: streams, check: filterCheck, v2Enabled: v2Enabled })
                    ])
                )
            )
        )
    ])
}

function NowPlayingColumnBuilder({nowPlayingCards, currentUser}) {

    return (
        nowPlayingCards.map(card => ([
            createElement(NowPlayingCardBuilder, { card: card, v2Enabled: Data.load('ACTest', 'v2Cards') }),
            Data.load('ACTest', 'cardTypeDebug') && createElement(NowPlayingCardBuilder, { card: card, v2Enabled: false })
        ]))
    )
}

function NowPlayingBuilder({props}) {
    FluxDispatcher.dispatch({type: 'NOW_PLAYING_MOUNTED'});
    const nowPlayingCards = useStateFromStores([ NowPlayingViewStore ], () => NowPlayingViewStore.nowPlayingCards);
    const cardColumns = chunkArray(nowPlayingCards, 2);
    //console.log(nowPlayingCards);

    if (!nowPlayingCards.length) {
        return createElement('div', {...props}, [
            createElement('div', { className: `headerContainer_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyBetween} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                createElement('div', { className: "headerText_267ac" }, "Now Playing")
            ),
            createElement('div', { className: "emptyState_267ac" }, [
                createElement('div', { className: "emptyTitle_267ac" }, "Nobody is playing anything right now..."),
                createElement('div', { className: "emptySubtitle_267ac" }, "When someone starts playing a game we'll show it here!")
            ])
        ])
    }

    //AffinityFetch()

    //console.log(GameSearchFetch())

    return createElement('div', {...props}, [
            createElement('div', { className: `headerContainer_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyBetween} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                createElement('div', { className: "headerText_267ac" }, "Now Playing")
            ),
            createElement('div', { className: "nowPlayingContainer_267ac"},
                cardColumns.map((column, index) => createElement('div', { className: "nowPlayingColumn_267ac" }, 
                    createElement(NowPlayingColumnBuilder, {nowPlayingCards: column, currentUser: UserStore.getCurrentUser()})
                )
            )) 
        ]
    )
}

function TabBaseBuilder() {
    document.title = "Activity";
    const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"]
    return createElement("div", {
        className: "activityCenter_267ac",
        children: [
            createElement(HeaderBar, {
            className: "headerBar_267ac",
            "aria-label": "Activity",
            children: [
                    createElement('div', { className: "iconWrapper_267ac" }, 
                        createElement('svg', {style: {width: "24", height: "24"}, viewBox: "0 0 24 24", fill: "none"},
                            createElement('path', {d: ControllerIcon, fill: "#B9BBBE", transform: "scale(0.4)"})
                        )
                    ),
                    createElement('div', { className: "titleWrapper_267ac" },
                        createElement('div', {className: "title_267ac"}, "Activity")
                    )
                ]
            }),
            createElement('div', {className: "scrollerBase_267ac", style: { overflow: "hidden scroll", paddingRight: "0px" } },
                createElement('div', { className: "centerContainer_267ac" }, [
                    createElement(NewsFeedBuilder),
                    createElement(QuickLauncherBuilder, { className: "quickLauncher_267ac", style: { position: "relative", padding: "0 20px 0 20px" } }),
                    createElement(NowPlayingBuilder, { props: { className: "nowPlaying_267ac", style: { position: "relative", padding: "0 20px 20px 20px" } }}),
                    createElement('div', {style: { color: "red" }}, `Activity Center Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`)
                ])
            )
        ]
    })
}

const styles = Object.assign({
        wrapper: Webpack.getByKeys('wrapper', 'svg', 'mask').wrapper,
        customButtons: Webpack.getByKeys('customButtons', 'absolute').customButtons,
        hasText: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).hasText,
        sm: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).sm
    },
    Webpack.getByKeys('itemCard'),
    Webpack.getByKeys('tabularNumbers'),
    Webpack.getByKeys('colorPrimary', 'grow'),
    Webpack.getByKeys('bar', 'container', 'progress'),
    Webpack.getModule(x=>x.buttonContainer && Object.keys(x).length === 1)
);

const activityPanelCSS = webpackify(
    `
        .activityCenter_267ac {
            background: var(--background-gradient-chat, var(--background-base-lower));
            border-top: 1px solid var(--app-border-frame);
            display: flex;
            flex-direction: column;
            width: 100%;
            overflow: hidden;
        }

        .scrollerBase_267ac {
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

        .centerContainer_267ac {
            display: flex;
            flex-direction: column;
            width: 1280px;
            max-width: 100%;
            min-width: 480px;
            margin: 0 auto;
        }

        .title_267ac {
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

        .titleWrapper_267ac {
            flex: 0 0 auto;
            margin: 0 8px 0 0;
            min-width: auto;
        }

        .iconWrapper_267ac {
            align-items: center;
            display: flex;
            flex: 0 0 auto;
            height: var(--space-32);
            justify-content: center;
            margin: 0;
            position: relative;
            width: var(--space-32);
        }

        .headerBar_267ac {
            height: calc(var(--custom-channel-header-height) - 1px);
            min-height: calc(var(--custom-channel-header-height) - 1px);
        }

        .headerContainer_267ac {
            flex-direction: row;
        }
        
        .headerText_267ac {
            display: flex;
            flex: 1;
            font-size: 18px;
            font-weight: 500;
            line-height: 22px;
            margin-top: 20px;
            width: 100%;
            color: var(--text-default);
        }

        .feedCarousel_267ac {
            display: flex;
            position: relative;
        }

        .carousel_267ac {
            background-color: var(--background-secondary-alt);
            border-radius: 5px;
            flex: 1 1 75%;
            min-height: 388px;
            margin-right: 20px;
            overflow: hidden;
            position: relative;
            transform: translateZ(0);
        }

        .article_267ac {
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

        .background_267ac {
            background-repeat: no-repeat;
            background-size: cover;
            bottom: 7.5%;
            mask: linear-gradient(0deg, transparent, #000);
            min-width: 300px;
            background-position: top;
        }

        .backgroundImage_267ac {
            background-position: top;
            background-repeat: no-repeat;
            background-size: cover;
            bottom: 0;
        }

        .background_267ac, .backgroundImage_267ac {
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
        }

        .feedOverflowMenu_267ac {
            position: absolute;
            top: 0;
            right: 0;
            padding: 8px 12px;
        }

        .applicationArea_267ac {
            color: var(--text-default);
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
        }

        .details_267ac {
            position: relative;
        }

        .titleStandard_267ac {
            margin-top: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 24px;
            line-height: 28px;
        }

        .title_267ac {
            color: var(--header-primary);
            display: block;
            font-weight: 500;
        }

        .description_267ac {
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
            .sharedFilePreviewYouTubeVideo {
                display: none;
            }
        }

        .timestamp_267ac {
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
            text-transform: uppercase;
        }

        .gameIcon_267ac {
            position: relative;
            pointer-events: auto;
            cursor: pointer;
            height: 40px;
            width: 40px;
            flex-shrink: 0;
            border-radius: 3px;
        }

        .pagination_267ac {
            -webkit-box-flex: 1;
            flex: 1 1 25%;
            min-width: 0;
        }

        .verticalPaginationItemContainer_267ac {
            margin: 0;
            overflow: hidden;
        }

        .scrollerWrap_267ac {
            -webkit-box-flex: 1;
            display: flex;
            flex: 1;
            height: 100%;
            min-height: 1px;
            position: relative;
        }

        .scroller_267ac {
            -webkit-box-flex: 1;
            contain: layout;
            flex: 1;
            min-height: 1px;
        }
            
        .paginationItem_267ac, .paginationItem_267ac:before {
            transition: all .2s ease;
        }

        .paginationItem_267ac:first-child {
            margin-top: 0;
        }

        .paginationItem_267ac {
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

        .paginationItem_267ac:before {
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

        .paginationItem_267ac:after {
            background-blend-mode: color;
            border-radius: 5px;
            bottom: 0;
            content: "";
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
        }

        .splashArt_267ac {
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

        .paginationSubtitle_267ac, .paginationTitle_267ac {
            font-weight: 600;
        }

        .paginationText_267ac {
            overflow: hidden;
        }

        .paginationContent_267ac {
            overflow: hidden;
            position: relative;
            z-index: 1;
        }

        .paginationTitle_267ac {
            color: var(--header-primary);
            font-size: 16px;
            line-height: 1.25;
            max-height: 40px;
        }

        .paginationSubtitle_267ac {
            color: var(--text-muted);
            font-size: 12px;
            margin-top: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .selectedPage_267ac {
            background: var(--background-surface-higher);
            cursor: default;
        }

        .selectedPage_267ac:before {
            transform: translateY(-50%) translateX(0);
        }

        .selectedPage_267ac .splashArt_267ac {
            filter: grayscale(0);
        }

        .smallCarousel_267ac {
            -webkit-box-flex: 1;
            border-radius: 5px;
            flex: 1;
            height: 220px;
            overflow: hidden;
            position: relative;
            transform: translateZ(0);
        }

        .titleRowSimple_267ac {
            -webkit-box-align: center;
            -webkit-box-pack: justify;
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .paginationSmall_267ac {
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

        .arrow_267ac {
            color: var(--text-muted);
            z-index: 2;
        }

        svg.arrow_267ac {
            height: 26px;
            width: 26px;
        }

        .arrowContainer_267ac {
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

        .arrow_267ac, .arrowContainer_267ac {
            box-sizing: border-box;
            pointer-events: all;
        }

        .button_267ac {
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

        .prevButtonContainer_267ac {
            left: 6px;
        }

        .nextButtonContainer_267ac {
            right: 6px;
        }

        .left_267ac {
            transform: rotate(-90deg);
        }

        .right_267ac {
            transform: rotate(90deg);
        }

        .horizontalPaginationItemContainer_267ac {
            -webkit-box-align: center;
            -webkit-box-flex: initial;
            align-items: center;
            display: flex;
            flex: initial;
            margin: 0 auto;
            overflow-y: hidden;
        }

        .dot_267ac {
            background-color: #fff;
            border-radius: 2px;
            cursor: pointer;
            height: 8px;
            margin-right: 8px;
            pointer-events: all;
            transform: translateZ(0);
            width: 8px;
        }

        .dotNormal_267ac {
            opacity: 0.2;
        }

        .dotSelected_267ac {
            opacity: 0.6;
        }

        .dock_267ac {
            margin-top: 10px;
            display: flex;
            overflow: hidden;
            flex-wrap: nowrap;
            max-width: 1280px;
        }

        .dockItem_267ac {
            border-radius: 5px;
            box-sizing: border-box;
            cursor: pointer;
            height: 100px;
            padding: 10px;
            width: 90px;
            flex-direction: column;
        }

        .dockIcon_267ac:first-child {
            margin-left: 0;
        }

        .dockIcon_267ac {
            background-size: 100%;
            border-radius: 3px;
            height: 40px;
            margin-bottom: 8px;
            transition: opacity .2s ease-in-out;
            width: 40px;
        }

        .dockItemText_267ac {
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
        
        .dockItemPlay_267ac {
            display: none;
            z-index: 9999;
        }

        .dockItemPlay_267ac:disabled, .dockItemPlay_267ac[aria-disabled=true] {
            background-color: var(--green-active, var(--button-positive-background-active)) !important;
        }

        .dockItem_267ac:hover {
            background: var(--background-base-lowest);
        }

        .dockItem_267ac:hover .dockItemText_267ac {
            display: none;
        }

        .dockItem_267ac:hover .dockItemPlay_267ac {
            display: flex;
        }

        .nowPlayingContainer_267ac {
            display: flex;
            margin-top: var(--space-lg);
            gap: var(--space-lg);
        }

        .nowPlayingColumn_267ac {
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
            width: calc(50% - (var(--space-lg) / 2))
        }

        .nowPlayingContainer_267ac .itemCard {
            flex: 1 0 0;
            margin: 16px 16px 0 0;
        }

        .nowPlayingColumn_267ac .card_267ac {
            border-radius: 5px;
            box-sizing: border-box;
            cursor: default;
            overflow: hidden;
            transform: translateZ(0);
        }
            
        .nowPlayingColumn_267ac .cardHeader_267ac {
            padding: 20px;
            position: relative;
            flex-direction: row;
            background: var(--background-base-lowest);
        }

        .nowPlayingColumn_267ac .header_267ac {
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
        }

        .nowPlayingColumn_267ac .header_267ac > .wrapper {
            display: flex;
            cursor: pointer;
            margin-right: 20px;
            transition: opacity .2s ease;
        }

        .nowPlayingColumn_267ac .nameTag_267ac {
            line-height: 17px;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
            white-space: nowrap;
            color: var(--text-default);
        }

        .nowPlayingColumn_267ac .username {
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
        }

        .nowPlayingColumn_267ac .username:hover {
            text-decoration: underline;
        }

        .nowPlayingColumn_267ac .card_267ac:hover .headerIcon_267ac {
            display: none;
        }

        .nowPlayingColumn_267ac .headerActions_267ac {
            display: none;
            margin-left: 8px;
        }

        .nowPlayingColumn_267ac .card_267ac:hover .headerActions_267ac {
            display: flex;
        }

        .nowPlayingColumn_267ac .headerActions_267ac > div[aria-expanded="false"] {
            display: none;
        }

        .nowPlayingColumn_267ac .headerActions_267ac {
            .button_267ac.lookFilled {
                background: var(--control-secondary-background-default);
                border: unset;
                color: var(--white);
                padding: 2px 16px;
                width: unset;
                svg {
                    display: none;
                } 
            }
            .button_267ac.lookFilled:hover {
                background-color: var(--control-secondary-background-hover) !important;
            }
            .button_267ac.lookFilled:active {
                background-color: var(--control-secondary-background-active) !important; 
            }
            .lookFilled.colorPrimary {
                background: unset !important;
                border: unset !important;
            }
            .lookFilled.colorPrimary:hover {
                color: var(--interactive-background-hover);
                svg {
                    stroke: var(--interactive-background-hover);
                }
            }
            .lookFilled.colorPrimary:active {
                color: var(--interactive-background-active);
                svg {
                    stroke: var(--interactive-background-active);
                }
            }
        }

        .nowPlayingColumn_267ac .overflowMenu_267ac {
            cursor: pointer;
            height: 24px;
            margin-left: 8px;
            transition: opacity .2s linear;
            width: 24px;
            color: var(--interactive-icon-hover);
        }

        .nowPlayingColumn_267ac .overflowMenu_267ac:hover {
            color: var(--interactive-icon-default);
        }

        .nowPlayingColumn_267ac .headerIcon_267ac {
            border-radius: 4px;
            display: block;
            height: 30px;
            justify-self: end;
            width: 30px;
        }

        .nowPlayingColumn_267ac .splashArt_267ac {
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

        .nowPlayingColumn_267ac .server_267ac {
            mask: radial-gradient(80% 100% at top right, hsla(0, 0%, 100%, .5) 0, hsla(0, 0%, 100%, 0) 100%);
            right: 0;
            left: unset;
        }

        .nowPlayingColumn_267ac .cardBody_267ac {
            display: flex;
            padding: 0 20px;
            background: var(--background-mod-strong)
        }

        .nowPlayingColumn_267ac .section_267ac {
            -webkit-box-flex: 1;
            flex: 1 0 calc(50% - 20px);
        }

        .nowPlayingColumn_267ac .game_267ac {
            padding: 20px 0;
        }

        .nowPlayingColumn_267ac .gameBody_267ac {
            flex-direction: column;
        }

        .nowPlayingColumn_267ac .activityContainer_267ac:last-child:not(:only-child, :nth-child(1 of .activityContainer_267ac)) .sectionDivider_267ac {
            display: none;
        }

        .nowPlayingColumn_267ac .activity_267ac {
            flex-direction: row;
        }

        .nowPlayingColumn_267ac .activity_267ac:last-child:not(:only-child) {
            margin-top: 20px;
        }

        .nowPlayingColumn_267ac .activity_267ac .serviceButtonWrapper_267ac {
            gap: 6px;
            display: flex;
            flex-direction: row;
            .sm:not(.hasText) {
                padding: 0;
                width: calc(var(--custom-button-button-sm-height) + 4px);
            }
        }

        .nowPlayingColumn_267ac .richActivity_267ac {
            margin-top: 20px;
        }

        .nowPlayingColumn_267ac .activityFeed_267ac {
            -webkit-box-flex: 1;
            flex: 1 1 50%;
            min-width: 0;
        }

        .nowPlayingColumn_267ac :is(.gameInfoRich_267ac, .gameNameWrapper_267ac) {
            -webkit-box-flex 1;
            display: flex;
            flex 1;
        }

        .nowPlayingColumn_267ac .gameInfoRich_267ac {
            align-items: center;
        }

        .nowPlayingColumn_267ac .gameInfo_267ac {
            margin-left: 20px;
            min-width: 0;
            color: var(--text-default);
            font-weight: 500;
            flex: 1;
        }

        .nowPlayingColumn_267ac :is(.gameName_267ac, .gameNameWrapper_267ac, .streamInfo_267ac) {
            overflow: hidden;
        }

        .nowPlayingColumn_267ac .gameName_267ac {
            font-size: 16px;
            line-height: 20px;
            margin-right: 10px;
            max-width: fit-content;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .nowPlayingColumn_267ac .gameName_267ac.clickable_267ac:hover {
            text-decoration: underline;
        }

        .nowPlayingColumn_267ac .playTime_267ac:not(a) {
            color: var(--text-muted);
        }
        .nowPlayingColumn_267ac .playTime_267ac {
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            margin-top: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .nowPlayingColumn_267ac .assets_267ac {
            position: relative;
        }

        .nowPlayingColumn_267ac .assetsLargeImageActivityFeed_267ac {
            width: 90px;
            height: 90px;
        }

        .nowPlayingColumn_267ac .assetsSmallImageActivityFeed_267ac {
            height: 30px;
            width: 30px;
        }

        .nowPlayingColumn_267ac .assets_267ac .assetsLargeImage_267ac {
            display: block;
            border-radius: 4px; 
            object-fit: cover;
        }

        .nowPlayingColumn_267ac .assets_267ac .assetsLargeImageActivityFeedTwitch_267ac {
            border-radius: 5px;
            height: 260px;
            mask: linear-gradient(0deg, transparent 10%, #000 80%);
            width: 100%;
        }

        .nowPlayingColumn_267ac .assets_267ac:has(.assetsSmallImage_267ac) .assetsLargeImage_267ac {
            mask: url('https://discord.com/assets/725244a8d98fc7f9f2c4a3b3257176e6.svg');
        }

        .nowPlayingColumn_267ac .richActivity_267ac .assetsSmallImage_267ac, .nowPlayingColumn_267ac .richActivity_267ac .smallEmptyIcon_267ac {
            border-radius: 50%;
            position: absolute;
            bottom: -4px;
            right: -4px; 
        }

        .nowPlayingColumn_267ac .activity_267ac .smallEmptyIcon_267ac {
            width: 40px;
            height: 40px;
        }

        .nowPlayingColumn_267ac .assets_267ac .largeEmptyIcon_267ac {
            width: 90px;
            height: 90px;
        }

        .nowPlayingColumn_267ac .assets_267ac .largeEmptyIcon_267ac path {
            transform: scale(3.65) !important;
        }

        .nowPlayingColumn_267ac .richActivity_267ac svg.assetsSmallImage {
            border-radius: unset !important;
        }   

        .nowPlayingColumn_267ac .richActivity_267ac .smallEmptyIcon_267ac path {
            transform: scale(1.3) !important;
        }

        .nowPlayingColumn_267ac .assets_267ac .twitchImageContainer_267ac {
            background: var(--background-secondary-alt);
            border-radius: 5px;
            position: relative;
        }

        .nowPlayingColumn_267ac .assets_267ac .twitchBackgroundImage_267ac {
            display: inline-block;
            min-height: 260px;
        }

        .nowPlayingColumn_267ac .assets_267ac .twitchImageOverlay_267ac {
            bottom: 0;
            left: 0;
            padding: 16px;
            position: absolute;
            right: 0;
        }

        .nowPlayingColumn_267ac .assets_267ac .streamName_267ac {
            color: var(--text-default);
            font-size: 14px;
            font-weight: 500;
            margin-top: 8px;
        }

        .nowPlayingColumn_267ac .assets_267ac .streamGame_267ac {
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
            text-transform: uppercase;
        }

        .nowPlayingColumn_267ac .contentImagesActivityFeed_267ac {
            margin-left: 20px;
            color: var(--text-default);
        }

        .nowPlayingColumn_267ac :is(.gameInfo_267ac, .contentImagesActivityFeed_267ac) {
            align-self: center;
            display: grid;
        }

        .nowPlayingColumn_267ac .content_267ac {
            flex: 1;
            overflow: hidden;
        }

        .nowPlayingColumn_267ac .details_267ac {
            font-weight: 600;
        }

        .nowPlayingColumn_267ac .ellipsis_267ac {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .textRow_267ac {
            display: block;
            font-size: 14px;
            line-height: 16px;
            margin-bottom: 4px;
        }

        .nowPlayingColumn_267ac .content_267ac .bar {
            background-color: var(--opacity-white-24);
        }

        .nowPlayingColumn_267ac .sectionDivider_267ac {
            display: flex;
            width: 100%;
            border-bottom: 2px solid;
            margin: 20px 0 20px 0;
        }

        .nowPlayingColumn_267ac .voiceSection_267ac {
            display: flex;
            flex: 1 1 auto;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
        }

        .nowPlayingColumn_267ac .voiceSectionAssets_267ac {
            align-items: center;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            position: relative;
        }

        .nowPlayingColumn_267ac .voiceSectionIconWrapper_267ac {
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

        .nowPlayingColumn_267ac .voiceSectionIcon_267ac {
            color: var(--header-secondary);
            height: 12px;
            width: 12px;
        }

        .nowPlayingColumn_267ac .voiceSectionGuildImage_267ac {
            border-radius: 50%;
            mask: url('https://discord.com/assets/a90b040155ee449f.svg');
            mask-size: 100%;
            mask-type: luminance;
        }

        .nowPlayingColumn_267ac .voiceSection_267ac .details_267ac {
            flex: 1;
        }

        .nowPlayingColumn_267ac .voiceSectionDetails_267ac {
            cursor: pointer;
            margin-left: 20px;
            min-width: 0;
        }

        .nowPlayingColumn_267ac .voiceSectionDetails_267ac:hover :is(.voiceSectionText_267ac, .voiceSectionSubtext_267ac) {
            text-decoration: underline;
        }

        .nowPlayingColumn_267ac .voiceSectionText_267ac {
            color: var(--text-default);
            font-size: 14px;
            font-weight: 600;
            line-height: 1.2857142857142858;
        }

        .nowPlayingColumn_267ac .voiceSectionSubtext_267ac {
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 400;
            line-height: 1.3333333333333333;
        }

        .nowPlayingColumn_267ac .userList_267ac {
            flex: 0 1 auto;
            justify-content: flex-end;
        }

        .nowPlayingColumn_267ac .voiceSection_267ac button {
            flex: 0 1 auto;
            width: auto;
            margin-left: 20px;
        }

        .nowPlayingColumn_267ac .actionsActivity_267ac .buttonContainer {
            flex-direction: inherit;
        }

        .nowPlayingColumn_267ac .partyStatusWrapper_267ac {
            display: flex;
            gap: 4px;
            align-items: center;
        }

        .nowPlayingColumn_267ac .partyStatusWrapper_267ac button {
            flex: 0 1 50%;
            max-height: 24px;
            min-height: 24px;
            width: auto !important;
            justify-self: flex-end;
        }

        .nowPlayingColumn_267ac .partyStatusWrapper_267ac .disabledButtonWrapper {
            flex: 1;
        }

        .nowPlayingColumn_267ac .partyStatusWrapper_267ac .disabledButtonOverlay {
            height: 24px;
            width: 100%;
        }

        .nowPlayingColumn_267ac .partyList_267ac {
            display: flex;
        }

        .nowPlayingColumn_267ac .player_267ac:first-of-type {
            mask: url(#svg-mask-voice-user-summary-item);
        }

        .nowPlayingColumn_267ac .emptyUser_267ac:not(:first-of-type), .nowPlayingColumn_267ac .player_267ac:not(:first-of-type) {
            margin-left: -4px;
        }

        .nowPlayingColumn_267ac .emptyUser_267ac:not(:last-of-type), .nowPlayingColumn_267ac .player_267ac:not(:last-of-type) {
            mask: url(#svg-mask-voice-user-summary-item);
        }

        .nowPlayingColumn_267ac .emptyUser_267ac, .nowPlayingColumn_267ac .player_267ac {
            width: 16px;
            height: 16px;
            border-radius: 50%;
        }

        .nowPlayingColumn_267ac .emptyUser_267ac svg {
            margin-left: 3px;
        }

        .nowPlayingColumn_267ac .partyPlayerCount_267ac {
            color: var(--app-message-embed-secondary-text);
            font-size: 12px;
            font-weight: 500;
            line-height: 1.3333333333333333;
        }

        .nowPlaying_267ac .emptyState_267ac {
            border: 1px solid;
            border-radius: 5px;
            box-sizing: border-box;
            margin-top: 20px;
            padding: 20px;
            width: 100%;
        }

        .quickLauncher_267ac .emptyState_267ac, .blacklist_267ac.emptyState_267ac {
            border-bottom: 1px solid;
            font-size: 14px;
            padding: 20px 0;
            justify-content: flex-start;
            align-items: center;
        }

        .emptyTitle_267ac {
            font-size: 16px;
            line-height: 20px;
            color: var(--text-default);
        }

        .emptySubtitle_267ac {
            font-size: 14px;
            color: var(--text-muted);
        }

        .theme-light .nowPlaying_267ac .emptyState_267ac {
            background-color: #fff;
            border-color: var(--interactive-background-hover);
        }

        .theme-dark .nowPlaying_267ac .emptyState_267ac {
            background-color: rgba(79, 84, 92, .3);
            border-color: var(--background-mod-strong);
        }

        .theme-light .quickLauncher_267ac .emptyState_267ac, .theme-light .blacklist_267ac.emptyState_267ac {
            border-color: rgba(220,221,222,.6);
            color: #b9bbbe;
        }

        .theme-dark .quickLauncher_267ac .emptyState_267ac, .theme-dark .blacklist_267ac.emptyState_267ac {
            border-color: rgba(47,49,54,.6);
            color: #72767d;
        }

        .theme-light .nowPlayingColumn_267ac .sectionDivider_267ac {
            border-color: var(--interactive-background-hover);
        }

        .theme-dark .nowPlayingColumn_267ac .sectionDivider_267ac {
            border-color: var(--background-mod-strong);
        }

        .theme-dark .voiceSectionIconWrapper_267ac {
            background-color: var(--primary-800);
        }

        .theme-light .voiceSectionIconWrapper_267ac {
            background: var(--primary-300);
        }

        .emptyIcon_267ac {
            height: 24px;
            margin-right: 8px;
            width: 24px;
        }

        .nowPlayingColumn_267ac .tabularNumbers {
            color: var(--text-default) !important;
        }

        .nowPlayingColumn_267ac :is(.actionsActivity_267ac, .customButtons) {
            gap: 8px;
        }

        .customButtons {
            display: flex;
            flex-direction: column;
        }

        .blacklist_267ac {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .blacklist_267ac .sectionDivider_267ac, .settingsDivider_267ac.sectionDivider_267ac {
            display: flex;
            width: 100%;
            border-bottom: 2px solid;
            margin: 4px 0 4px 0;
            border-color: var(--background-mod-strong);
        }

        .blacklist_267ac .sectionDivider_267ac:last-child {
            display: none;
        }

        .blacklistItem_267ac {
            display: flex;
        }

        .blacklistItem_267ac .blacklistItemIcon_267ac {
            border-radius: 8px;
            height: 32px;
            width: 32px;
        }

        .blacklistItem_267ac .blacklistItemName_267ac {
            margin-left: 20px;
            margin-bottom: 0;
            min-width: 0;
            font-weight: 500;
            align-content: center;
            flex: 1;
        }

        .blacklistItem_267ac button {
            flex: 0 1 auto;
            align-self: center;
            width: auto;
            margin-left: 20px;
        }

        .search_267ac {
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

        .cardV2_267ac {
            background: linear-gradient(45deg, var(--background-base-lowest), var(--background-base-low));
            border-radius: var(--radius-md);
            outline: 1px solid var(--border-normal);
            outline-offset: -1px;
            box-sizing: border-box;
            background-clip: border-box;
            overflow: hidden;
            transform: translateZ(0);

            .headerActions_267ac .button_267ac.lookFilled, .cardBody_267ac button {
                color: var(--white);
                background: var(--opacity-white-24);
                &:hover {
                    background: var(--opacity-white-36);
                }
                &:active {
                    background: var(--opacity-white-32);
                }
            }

            .cardHeader_267ac {
                padding: var(--space-lg);
                position: relative;
                flex-direction: row;
                background: unset;
            }
            .nameTag_267ac {
                color: var(--white);
            }
            .splashArt_267ac, .server_267ac {
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
                .headerIcon_267ac {
                    display: none;
                }
                .headerActions_267ac {
                    display: flex;
                }
            }
            .cardBody_267ac {
                display: flex;
                gap: var(--space-lg);
                padding: 0 var(--space-lg) var(--space-lg);
                background: unset;
            }
            .section_267ac {
                background: var(--background-mod-normal);
                border-radius: var(--radius-sm);
                padding: var(--space-sm);
            }
            .game_267ac {
                padding: 0;
            }
            .sectionDivider_267ac {
                border-color: var(--opacity-white-12) !important;
                border-width: 1px;
                margin: 12px 0 12px 0;
            }
            .voiceSectionText_267ac {
                color: var(--white);
            }
            .headerIcon_267ac, .gameIcon_267ac, .assetsLargeImage_267ac.assetsLargeImage_267ac {
                border-radius: var(--radius-sm);
            }
            .gameInfo_267ac {
                color: var(--white);
            }
            .playTime_267ac:not(a), .voiceSectionSubtext_267ac {
                color: var(--app-message-embed-secondary-text) !important;
            }
            .serviceButtonWrapper_267ac {
                gap: 8px !important;
            }
            .contentImagesActivityFeed_267ac {
                color: var(--white);
            }
            .textRow_267ac {
                font-size: 16px;
                line-height: 18px;
            }
            .state_267ac {
                color: var(--app-message-embed-secondary-text);
                font-size: 14px;
                line-height: 16px;
            }
            .tabularNumbers {
                color: var(--app-message-embed-secondary-text) !important;
            }
            .bar {
                background-color: var(--opacity-white-24);
            }
            .progress {
                background-color: var(--white);
            }
            .activity_267ac:last-child:not(:only-child) {
                margin-top: 12px;
            }
        }
    `
)

function webpackify(css) {
    for (const key in styles) {
        let regex = new RegExp(`\\.${key}([\\s,.):>])`, 'g');
        css = css.replace(regex, `.${styles[key]}$1`);
    }
    return css;
}

const panelObj =
layoutUtils.Panel("activity_feed_panel",
    {
        buildLayout: () => [],
        key: "activity_feed_panel",
        StronglyDiscouragedCustomComponent: () => createElement(SettingsPanelBuilder),
        type: 3,
        useTitle: () => "Activity Feed",
    }
);

const sidebarItem =
layoutUtils.Button("activity_feed_sidebar_item", 
    {
        buildLayout: () => [panelObj],
        icon: () => createElement('svg', {
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
            createElement('defs', {},
                createElement('mask', { id: "newspaper-mask" }, [
                    createElement('rect', { width: 24, height: 24, fill: "#fff", stroke: "none" }),
                    createElement('g', {stroke: "#000"}, [
                        createElement('path', { d: "M15 18h-5" }),
                        createElement('path', { d: "M18 14h-8" }),
                        createElement('path', { d: "M10 6h8v4h-8V6Z" })
                    ])
                ])
            ),
            createElement('path', { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z", fill: "currentColor", mask: "url(#newspaper-mask)" }),
            createElement('path', { d: "M4 22a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" }),
        ]),
        key: "activity_feed_sidebar_item",
        legacySearchKey: "ACTIVITY_FEED",
        type: 2,
        useTitle: () => "Activity Feed"
    }
);

module.exports = class ACTest {
    start() {
        //Patcher.after("ACTest", FluxDispatcher, "dispatch", (that, props, res) => console.log(props))
        NewsStore.blacklist = Data.load('ACTest', 'blacklist');
        const Route = Webpack.getByStrings('["impressionName","impressionProperties","disableTrack"]');
        if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
            NavigationUtils.transitionTo('/channels/@me')
        }

        function NewType(props) {
            const ret = NewType._(props);

            const { children } = Utils.findInTree(ret, (node) => node && node.children?.length > 5, { walkable: [ "children", "props" ] });
            
            const index = children.findIndex(m => m.key === "activity-center");
            if (~index) { children.splice(index, 1); }            

            children.push(
                createElement(Route, {
                    disableTrack: true,
                    path: "/activity-center",
                    render: () => TabBaseBuilder(),
                    exact: true,
                    key: "activity-center"
                })
            )
            
            return ret;
        }

        DOM.addStyle('activityPanelCSS', activityPanelCSS);

        Patcher.after("ACTest", dmSidebar, "Z", (that, [props], res) => {
            const panel = Utils.findInTree(res, m => m?.homeLink, { walkable: [ "props", "children" ] });
            const selected = useSelectedState();

            if (selected) {
                for (const child of panel.children) {
                    const link = Utils.findInTree(child, m => m && typeof m === "object" && "selected" in m, { walkable: [ "props", "children" ] });
                    if (link) {
                        link.selected = false;
                    }
                }
            }

            const index = panel.children.findIndex(m => m?.key === "activityCenter_button");
            if (index !== -1) return;

            panel.children.unshift(
                createElement(NavigatorButton, {key: "activityCenter_button"})
            );
        });

        Patcher.after("ACTest", Webpack.getByPrototypeKeys("handleHistoryChange", "ensureChannelMatchesGuild").prototype, "render", (that, args, res) => {
            const channelRouteProps = Utils.findInTree(res, (node) => node && node.path?.length > 5, { walkable: [ "children", "props" ] });
            //console.log(res)

            channelRouteProps.path = [
                ...channelRouteProps.path.filter(m => m !== "/activity-center"),
                "/activity-center"
            ]
        });

        Patcher.after("ACTest", RootSectionModule, "buildLayout", (that, [props], res) => {
            const section = Utils.findInTree(res, (tree) => Object.values(tree).includes('activity_section'), { walkable: ['props', 'children'] })
            Patcher.after("ACTest", section, "buildLayout", (that, [props], res) => {
                if (!Utils.findInTree(res, (tree) => Object.values(tree).includes('activity_feed_sidebar_item', { walkable: ['props', 'children'] } ))) {
                    res.push(sidebarItem);
                }
                return res;
            })
        })
        
        function fu() {
            const appI = ReactUtils.getOwnerInstance(document.querySelector("div[class$=-app] > div[class$=-app]"), {
                filter: m => typeof m.ensureChannelMatchesGuild === "function"
            });
            
            console.log("fu()");
            if (appI) {
                appI.forceUpdate(() => {
                    const inst = ReactUtils.getOwnerInstance(document.querySelector(`.${container}`));

                    Patcher.after("ACTest", inst, "render", (that, args, res) => {
                        NewType._ ??= res.props.children.type;

                        res.props.children.type = NewType;
                    });

                    inst?.forceUpdate(() => {
                        console.log("inst.forceUpdate");
                        
                        appI.forceUpdate();
                        inst.forceUpdate();
                    });
                });
            };
        }

        fu();

        {
            const appMount = document.getElementById("app-mount");

            const reactContainerKey = Object.keys(appMount).find(m => m.startsWith("__reactContainer$"));

            let container = appMount[reactContainerKey];

            while (!container.stateNode?.isReactComponent) {
                container = container.child;
            }

            container = container.child;

            while (!container.stateNode?.isReactComponent) {
                container = container.child;
            }

            Patcher.after("ACTest", container.stateNode, "render", fu);

            const undo = Patcher.after("ACTest", container.stateNode, "render", () => {
                undo();
                fu();
            });
        }
    }
    stop() {
        Patcher.unpatchAll('ACTest');
        ReactUtils.getOwnerInstance(document.querySelector(`.${container}`)).forceUpdate();
    }

    getSettingsPanel() {
        return [
            createElement(() => Object.keys(settings.main).map((key) => {
                const { name, note, initial, changed } = settings.main[key];
                const [state, setState] = useState(Data.load('ACTest', key));

                return createElement(FormSwitch, {
                    label: name,
                    description: note,
                    checked: state ?? initial,
                    onChange: (v) => {
                        Data.save('ACTest', key, v);
                        setState(v);
                        if (changed)
                            changed(v);
                    }
                });
            }
        )),
        createElement(Components.Text, {size: Components.Text.Sizes.SIZE_16, strong: true, style: { borderTop: "thin solid var(--border-subtle)", paddingTop: "var(--space-12)", paddingBottom: "var(--space-12)"}}, "Activity Feed"),
        createElement(Components.SettingGroup, {
            name: "Games You've Hidden",
            collapsible: true,
            shown: false,
            children: [
                createElement('div', { className: "blacklist_267ac emptyState_267ac", style: { padding: 0, borderBottom: "unset" }}, 
                    createElement('div', { className: "emptyText_267ac" }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Below are the games you have hidden.")
                ),
                createElement(BlacklistBuilder) 
            ]
        })]
    }
}