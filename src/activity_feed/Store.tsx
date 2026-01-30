import { Webpack, Data, Utils } from "betterdiscord";
import { Common } from "@./modules/common";

class GameNewsStore extends Utils.Store {
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
        const val  = ((window?.size?.[0] > 1200 || window?.size?.[1] < 600) && (window?.size[0] < 1200 || window?.size?.[1] > 600)) ? "vertical" : "horizontal";
        this.emitChange();
        return val;
    }

    getDirection(e) {
        return e > 0 ? 1 : -1;
    }
}
export const NewsStore = new GameNewsStore();