import { Data, Utils, Net } from "betterdiscord";
import { useState, useEffect } from "react";
import { Common } from "@./modules/common";
import { ApplicationStore, GameStore, RunningGameStore, WindowStore } from "@modules/stores";

class GameNewsStore extends Utils.Store {
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
        this.article = {}
        this.blacklist = [];
        this.lastTimeFetched;
        this.idling = true;

        window.addEventListener("resize", this.listener)
    }

    listener = () => {
        this.state = { size: [window.innerWidth, window.innerHeight] };
        this.emitChange();
    }

    componentDidMount() { window.addEventListener("resize", this.listener); }
    componentWillUnmount() { window.removeEventListener("resize", this.listener); }

    setDebugFeeds() {
        BdApi.Webpack.getByKeys("fetchApplications").fetchApplication('1402418491272986635');
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

    getFeeds() {
        return this.dataSet;
    }

    setFeeds() {
        this.dataSet = Object.assign(this.dataSet, Data.load('dataSet'));
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

    getBlacklist() {
        return this.blacklist;
    }

    getBlacklistedGame(gameId) {
        let b = this.blacklist;

        return b?.find(e => e.game_id === gameId);
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

    async #fetchDiscordFeeds() {}

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
        const rssFeed = await Promise.all([ Net.fetch(`https://rssjson.vercel.app/api?url=https://store.steampowered.com/feeds/news/app/${gameId}`).then(r => r.ok ? r.json() : null) ])
        const article = this.getRSSItem(rssFeed)
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

    async fetchFeeds() {
        const gameData = await this.getFeedGameData();
        for (const gameId of Object.keys(gameData)) {
            (async (gameId) => {
                let feeds;
                switch (gameId) {
                    case "Minecraft": feeds = await this.#fetchMinecraftFeeds(gameData[gameId]); break;
                    case "Fortnite": feeds = await this.#fetchFortniteFeeds(gameData[gameId]); break;
                    default: feeds = await this.#fetchSteamFeeds(gameId, gameData[gameId]);
                }
                if (this.filterFeeds(feeds, gameId)) {
                    this.dataSet[gameId] = {
                        id: gameId,
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
                    Data.save('dataSet', this.dataSet);
                }
            })(gameId)
        }

        this.lastTimeFetched = Date.now();
        
        Data.save('lastTimeFetched', this.lastTimeFetched);
    }

    async getFeedGameData() {
        const gameData = {}
        const gameList = RunningGameStore.getGamesSeen().filter(game => GameStore.getGameByName(game.name));
        const gameIds = gameList.filter(game => game.id || game.name === "Minecraft").map(game => game.name === "Minecraft" ? GameStore.getGameByName(game.name).id : game.id);
        let applicationList;

        await Common.FetchApplications.fetchApplications(gameIds).then(
            applicationList = gameList.map(game => ApplicationStore.getApplicationByName(game.name)).filter(game => game && game.thirdPartySkus.length > 0 && game.thirdPartySkus.some(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"))
        )

        const feedIds = applicationList.map(game => { const steamSku = game.thirdPartySkus.find(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"); return steamSku?.sku || game.name });

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
        let p = Object.values(this.getFeeds()).length;
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
        let t = [];
        let keys = Object.keys(feeds);

        if (keys.length < 5) return; 
        for (let g = 0; g < 4; g++) {
            let rand = keys.length * Math.random() << 0;
            t.push(feeds[keys[rand]]);
            keys.splice(rand, 1)
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
        this.article = this.displaySet[i];
        this.emitChange();
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