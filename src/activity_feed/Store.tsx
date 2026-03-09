import { Data, Utils, Net } from "betterdiscord";
import { parseXML } from "@activity_feed/components/common/methods/common";
import { Common, ModalSystem } from "@modules/common";
import { ApplicationStore, GameStore, RunningGameStore, WindowStore } from "@modules/stores";
import settings from "@settings/settings";
import HtmlSanitizer from "@jitbit/htmlsanitizer";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

class GameNewsStore extends Utils.Store {
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
    hasDismissedSettingsCoachmark;
    constructor() {
        super();
        this.dataSet = {};
        this.displaySet = [];
        this.lockSet = [];
        this.article = {}
        this.blacklist = [];
        this.whitelist = [];
        this.lastTimeFetched;
        this.idling = true;
        this.hasDismissedSettingsCoachmark = Data.load("hasDismissedSettingsCoachmark") ?? false;

        window.addEventListener("resize", this.listener)
    }

    listener = () => {
        this.state = { size: [window.innerWidth, window.innerHeight] };
        this.emitChange();
    }

    // clean all of this shit UP ↓↓↓↓↓↓↓↓↓

    /*const [springs, control] = Common.ReactSpring.useSpring(() =>
        (NewsStore.getOrientation() === "horizontal" ? {
            from: { x: 0, y: 0 },
            to: { x: 15, y: 15 },
        }
        : {
            from: { x: 0, y: 0 },
            to: { x: 15, y: 15 },
        })
    )*/

    getRootStyle = (props) => {
        let anim = this.getOrientation() === "horizontal" ?
            props.x
            .to([0, 1], ["0px", "-15px"])
            .to(value => `translateX(${value})`)
        : 
            props.y
            .to([0, 1], ["0px", "15px"])
            .to(value => `translateY(${value})`)
        
        return Common.ReactSpring.useSpring({
            transform: [
                props.scale
                .to([-1, 0, 1], [1.015, 1, 1.015])
                .to(value => `scale(${value})`),
                anim
            ],
            opacity: props.opacity
            .to([-1, 0, 1], [0, 1, 0])
            .to(value => value)
        })
    }

    /*oldgetRootStyle = () => {
        var e = this.getOrientation() === "horizontal" ? {
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
    }*/

    componentDidMount() { window.addEventListener("resize", this.listener); }
    componentWillUnmount() { window.removeEventListener("resize", this.listener); }

    setDebugFeeds() {
        const application = ApplicationStore.getApplicationByName('Minecraft');
        this.displaySet = [
            {
                index: 0,
                id: "TEST",
                application: application,
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
                application: application,
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
                application: application,
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
            application: application,
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
        ]
        this.article = this.displaySet[0]
    }

    setHasDismissedSettingsCoachmark(v) {
        this.hasDismissedSettingsCoachmark = v;
        Data.save("hasDismissedSettingsCoachmark", v);
        this.emitChange();
        return;
    }

    getFeeds() {
        return this.dataSet;
    }

    setFeeds() {
        this.dataSet = Data.load('dataSet') ? Object.assign(this.dataSet, Data.load('dataSet')) : {};
        this.lockSet = Data.load('lockSet') || [];
        this.whitelist = Data.load('whitelist') || [];
        this.blacklist = Data.load('blacklist') || [];
        this.lastTimeFetched = Data.load('lastTimeFetched');
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

        return b?.find(e => e.gameId === gameId);
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
            b.push({applicationId: applicationId, gameId: gameId});
            this.emitChange();
            Data.save('blacklist', this.blacklist);
        }
        return;
    }

    whitelistGame(gameId) {
        let b = this.blacklist;
        const g = this.getBlacklistedGame(gameId);

        console.log(b)
        b.splice(b.indexOf(g), 1);
        this.emitChange();
        console.log(b)
        Data.save('blacklist', this.blacklist);
        return this.blacklist;
    }

    async fetchAnyFeed(url) {
        const rssFeed = await Promise.all([ parseXML(Net.fetch(`${url}`).then(r => r.ok ? r.text() : null)) ]);
        return rssFeed;
    }

    async #fetchDiscordFeeds() {
        const rssFeed = await Promise.all([ parseXML(Net.fetch(`https://discord.com/blog/rss.xml`).then(r => r.ok ? r.text() : null)) ]);
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
        }
    }

    async #fetchNintendoFeeds() {
        const rssFeed = await Promise.all([ parseXML(Net.fetch(`https://nintendoeverything.com/feed/`).then(r => r.ok ? r.text() : null)) ])
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
        }
    }

    async #fetchXboxFeeds() {
        const rssFeed = await Promise.all([ BdApi.Net.fetch(`https://rssjson.vercel.app/api?url=https://news.xbox.com/en-us/feed/`).then(r => r.ok ? r.json() : null) ])
        const article = this.getRSSItemLegacy(rssFeed);
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
        }
    }

    async #fetchMinecraftFeeds(application) {
        const rssFeed = await Promise.all([ Net.fetch(`https://net-secondary.web.minecraft-services.net/api/v1.0/en-us/search?pageSize=24&sortType=Recent&category=News&newsOnly=true`).then(r => r.ok ? r.json() : null) ])
        const article = rssFeed[0].result.results[0]
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

    async #fetchFortniteFeeds(application) {
        const rssFeed = await Promise.all([ Net.fetch(`https://fortnite-api.com/v2/news`).then(r => r.ok ? r.json() : null) ])
        const article = rssFeed[0].data.br.motds[0]
        return {
            application,
            appId: application.id,
            description: article?.body,
            thumbnail: article?.image,
            timestamp: rssFeed[0].data.br.date,
            title: article?.title
        }
    }

    async #fetchSteamFeeds(gameId, application) {
        const rssFeed = await Promise.all([ parseXML(Net.fetch(`https://store.steampowered.com/feeds/news/app/${gameId}`).then(r => r.ok ? r.text() : null)) ])
        const article = this.getRSSItem(rssFeed)
        return {
            application, 
            appId: application.id, 
            description: article?.description,
            thumbnail: article?.enclosure?._url, 
            timestamp: article?.pubDate, 
            title: article?.title, 
            url: article?.link
        }
    }

    async fetchFeeds() {
        const gameData = await this.getFeedGameData();
        const ignore = ['IMG', 'VIDEO', 'LI']
        for (let i = 0; i < ignore.length; i++) {
            delete HtmlSanitizer.AllowedTags[ignore[i]];
        }
        for (const gameId of Object.keys(gameData)) {
            (async (gameId) => {
                let feeds;
                switch (gameId) {
                    case "Minecraft": feeds = await this.#fetchMinecraftFeeds(gameData[gameId]); break;
                    case "Fortnite": feeds = await this.#fetchFortniteFeeds(gameData[gameId]); break;
                    case "discord": feeds = await this.#fetchDiscordFeeds(); break;
                    case "nintendo": feeds = await this.#fetchNintendoFeeds(); break;
                    case "xbox": feeds = await this.#fetchXboxFeeds(); break;
                    default: feeds = await this.#fetchSteamFeeds(gameId, gameData[gameId]);
                }
                if (this.filterFeeds(feeds)) {
                    this.dataSet[gameId] = {
                        id: gameId,
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
                    }
                    Data.save('dataSet', this.dataSet);
                }
            })(gameId)
        }

        this.lastTimeFetched = Date.now();
        
        Data.save('lastTimeFetched', this.lastTimeFetched);
    }

    async getFeedGameData() {
        const gameData = {}
        const gameList = RunningGameStore.getGamesSeen().filter(game => GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0]));
        const gameIds = gameList.filter(game => game.id || game.name === "Minecraft").map(game => game.name === "Minecraft" ? GameStore.searchGamesByName(game.name)[0] : game.id);
        let applicationList;

        await Common.FetchApplications.fetchApplications(gameIds);
            
        applicationList = gameList.map(game => ApplicationStore.getApplicationByName(game.name)).filter(game => game && game.thirdPartySkus.length > 0 && game.thirdPartySkus.some(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"))

        const feedIds = applicationList.map(game => { const steamSku = game.thirdPartySkus.find(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"); return steamSku?.sku || game.name });

        for (let i = 0; i < feedIds.length; i++) {
            gameData[feedIds[i]] = applicationList[i];
            this.whitelist[i] = {applicationId: applicationList[i].id, gameId: feedIds[i]};
        }

        for (let i in settings.external) {
            if (((Data.load("external") && (Data.load("external")[i])) || settings.external[i].enabled) === true) {
                gameData[i] = "External Source";
            }
        }

        Data.save('whitelist', this.whitelist);
        return gameData;
    }

    shouldFetch() {
        if (Object.keys(this.getFeeds()).length === 0) {
            this.setFeeds();
        }
        let t = this.lastTimeFetched;
        let p = Object.values(this.getFeeds()).length;
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
        if (isNaN(id)) { r = applicationList.find(game => game.name === id) }
        else { r = applicationList.find(game => game.thirdPartySkus.find(sku => sku.sku === id)) }
        return r;
    }

    getRSSItem(feed, itemIndex = 0) {
        try {
            return feed[0]?.rss?.channel?.item[itemIndex];
        } catch (e) {
            return null;
        }
    }

    getRSSItemLegacy(feed, itemIndex = 0) {
        try {
            return feed?.[0]?.rss?.channel?.[0]?.item?.[itemIndex];
        } catch (e) {
            return null;
        }
    }

    getRandomFeeds(feeds) {
        let t = [];
        let s = this.lockSet;
        t = t.concat(s);
        let keys = Object.keys(feeds);
        let _keys = keys.filter((key) => !this.getBlacklistedGame(feeds[key].id) && !this.isArticleLockedIn(feeds[key]) && this.filterFeeds(feeds[key].news))
        let total = _keys.length;

        if (!_keys.length) return; 
        for (let g = 0; g < 3 - s.length; g++) {
            if (g > total) break;
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
            for (let i = 0; i < rG.length; i++) {
                rG[i] = {
                    ...rG[i],
                    index: i,
                };
            }
            this.article = rG[0];
        }

        return rG;
    }

    getCurrentArticle() {
        return this.article
    }

    setCurrentArticle(i) {
        if (this.displaySet[i]) {
            this.article = this.displaySet[i]
        }
        else {
            this.article = this.displaySet[0];
        }
        this.emitChange();
    }

    lockInArticle(article) {
        let l = this.lockSet;

        if (!this.isArticleLockedIn(article) || l.length < 4) {
            l.push(article)
            Data.save("lockSet", l);
            this.emitChange();
        }
        else {
            return (
                ModalSystem.openModal(props => 
                    <Common.ModalRoot.Modal 
                        {...props} 
                        title="That didn't work"
                        actions={[
                            {text: "Ok", variant: "primary", fullWidth: 0, onClick: () => props.onClose()}, 
                        ]}><>
                            <div className={MainClasses.emptyText}>{"Article is already locked in, or you've reached the maximum number (4)."}</div>
                        </>    
                    </Common.ModalRoot.Modal>
                )
            )
        }
        return;
    }

    isArticleLockedIn(article) {
        let s = this.lockSet;
        return Boolean(s.find(entry => entry.id === article.id));
    }

    releaseLockedArticle(article) {
        let l = this.lockSet;

        if (this.isArticleLockedIn(article)) {
            l.splice(l.indexOf(article), 1);
            this.emitChange();
            Data.save('lockList', l);
        }
        else {
            return (
                ModalSystem.openModal(props => 
                    <Common.ModalRoot.Modal 
                        {...props} 
                        title="That didn't work"
                        actions={[
                            {text: "Ok", variant: "primary", fullWidth: 0, onClick: () => props.onClose()}, 
                        ]}><>
                            <div className={MainClasses.emptyText}>{"Article is not locked in."}</div>
                        </>    
                    </Common.ModalRoot.Modal>
                )
            )
        }
        return;
    }

    clearLockedArticles() {
        this.lockSet = [];
        return;
    }

    getOrientation() {
        const [width, height] = this.state.size?.length ? this.state.size : [WindowStore.windowSize().width, WindowStore.windowSize().height];
        return ((width > 1200 || height < 600) && (width < 1200 || height > 600)) ? "vertical" : "horizontal";
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
export default new GameNewsStore();