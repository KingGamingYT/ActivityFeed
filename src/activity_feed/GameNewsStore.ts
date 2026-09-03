import { Data, Utils, Net } from "betterdiscord";
import { XMLParser } from "fast-xml-parser";
import { Common } from "@modules/common";
import { ApplicationStore, LibraryApplicationStatisticsStore, WindowStore } from "@modules/stores";
import { chunkArrayBySize } from "@common/methods/common";
import settings from "@settings/settings";
import HtmlSanitizer from "@jitbit/htmlsanitizer";

export interface Article {
    application: any,
    id: number | string,
    index?: number,
    news: {
        application_id?: number,
        description?: string,
        thumbnail?: string,
        timestamp: EpochTimeStamp,
        title: string,
        url?: string, 
    }
    type: "application_news",
}

interface FeedItemData {
    application: any,
    appId?: number,
    description?: string,
    thumbnail?: string,
    timestamp: EpochTimeStamp,
    title: string,
    url?: string
}

interface ListItem {
    applicationId: number,
    gameId: number | string,
    name: string,
}

let article: Article;
let dataSet: Record<Article["id"], any> = {};
let displaySet: Article[] = [];
let lockSet: Article[] = [];
let blacklist: ListItem[] = [];
let whitelist: ListItem[] = [];
let followedGames: ListItem[] = [];
let settingsOpened = false;
let lastTimeFetched: number;
let direction = 1;
let idling = true;

function sanitize(content: string) {
    const ignore = ['IMG', 'VIDEO', 'A'];
    for (let i = 0; i < ignore.length; i++) {
        delete HtmlSanitizer.AllowedTags[ignore[i]];
    }
    return HtmlSanitizer.SanitizeHtml(content);
}

function getAllPresentGames() {
    return whitelist.concat(followedGames);
}

function getWhitelistedGameByApplicationId(applicationId: number)  {
    return whitelist.find(item => item.applicationId === applicationId);
}

function getWhitelistedGameBySkuId(applicationSku: number | string) {
    return getAllPresentGames().find(item => item.gameId == applicationSku);
}

function getBlacklistedGameByApplicationId(applicationId: number)  {
    return blacklist.find(item => item.applicationId === applicationId);
}

function getBlacklistedGameBySkuId(applicationSku: number | string) {
    return blacklist.find(item => item.gameId === applicationSku);
}

function getManuallyFollowedGameByApplicationId(applicationId: number) {
    return followedGames.find(item => item.applicationId == applicationId);
}

function getFollowedGameByApplicationId(applicationId: number) {
    return getAllPresentGames().find(item => item.applicationId === applicationId);
}

function getFollowedGameBySkuId(applicationSku: number | string) {
    return getAllPresentGames().find(item => item.gameId === applicationSku);
}

function getLockedInArticle(article: Article) {
    return article?.id ? lockSet.find(item => item.id === article.id) : lockSet.find(item => item.application.id === article.application.id);
}

function whitelistGame(applicationId: number) {
    let blacklistedItem = getBlacklistedGameByApplicationId(applicationId);
    blacklistedItem ? blacklist.splice(blacklist.indexOf(blacklistedItem), 1) : null;
    Data.save('blacklist', blacklist);
    return;
}

function blacklistGame(applicationId: number) {
    let item = getWhitelistedGameByApplicationId(applicationId);

    if (item && !getBlacklistedGameByApplicationId(applicationId)) {
        blacklist.push({applicationId, gameId: item.gameId, name: item.name});
        Data.save('blacklist', blacklist);
    }
    return;
}

function getRSSItem(feed: any, itemIndex = 0) {
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

function isExternalArticleSourceEnabled(entry: Article) {
    return settings.external[entry.id];
}

function isGameFollowed(entry: Article) {
    if (isExternalArticleSourceEnabled(entry)) return true;
    // if the game was manually followed at some point and then unfollowed, isFollowed should return false because it no longer exists in the array
    const isFollowed = getFollowedGameByApplicationId(entry.application.id) || getFollowedGameBySkuId(entry.id);
    const isBlacklisted = getBlacklistedGameByApplicationId(entry.application.id) || getBlacklistedGameBySkuId(entry.id);
    return isBlacklisted ? false : isFollowed;
}

function isNewsInDate(news: Article["news"] | FeedItemData) {
    if (!news) return;
    const expiry = new Date(Date.now() - 12096e5);
    return new Date(news.timestamp) > expiry;
}

function isArticleLockedIn(article: Article) {
    return Boolean(getLockedInArticle(article));
}

function sortArticles(articleKeys: Array<number | string>) {
    // sorts timestamps in provided articles keys from newest to oldest 
    const sortedDates = articleKeys.map((key: any) => dataSet[key].news.timestamp).sort((n, o) => new Date(n).getTime() - new Date(o).getTime()).reverse(); 
    const set = new Set();
    // use a set to discard duplicate dates while normalizing them
    for (let date of sortedDates) {
        set.add(new Date(date).toDateString());
    }
    
    return Array.from(set);
}

function getRandomArticles(numArticles: number) {
    let articles: Article[] = [];
    articles.concat(lockSet);
    // filter out articles which are blacklisted, too old, or locked in
    const keys = Object.keys(dataSet).filter((key: any) => isGameFollowed(dataSet[key]) && !isArticleLockedIn(dataSet[key]) && isNewsInDate(dataSet[key].news));
    const totalKeys = keys.length;
    const sortedDates = sortArticles(keys);

    if (totalKeys === 0) return;
    dateLoop: for (let date of sortedDates) {
        // filter through only article keys with matching date
        let sortedKeys = keys.filter((key: any) => new Date(dataSet[key].news.timestamp).toDateString() === date);
        //console.log(date, sortedKeys)
        // randomly select from remaining article keys
        for (let finalizedArticles = 0; finalizedArticles <= numArticles - lockSet.length; finalizedArticles++) {
            const rand = sortedKeys.length * Math.random() << 0;

            if (finalizedArticles > sortedKeys.length) break;
            // break out of both loops if we're out of new articles or if the article length matches the requested number of articles
            if (finalizedArticles > (totalKeys - 1) || articles.length > (numArticles - 1)) break dateLoop;
            
            articles.push(dataSet[sortedKeys[rand]]);
            // remove key to prevent duplicate articles
            sortedKeys.splice(rand, 1);
        }
    }

    return articles;
}

function setDisplayedArticles() {
    console.log("setDisplayedArticles")
    const randomArticles = getRandomArticles(4);
    console.log("got random articles")
    if (randomArticles && randomArticles !== null) {
        // clear displayed articles in case this ends up running multiple times, for whatever reason
        console.log("pre-reset", displaySet)
        displaySet = [];
        console.log("post-reset", displaySet)
        displaySet.push.apply(displaySet, randomArticles);
        for (let i = 0; i < displaySet.length; i++) {
            displaySet[i] = {
                ...displaySet[i],
                index: i
            };
        }
        console.log("post-loop", displaySet)
        article = displaySet[0];
    }
    return;
}

async function parseXML(xml: Promise<string | void | null> | undefined) {
    let body = await xml;
    let result;
    const entities = [{key: "#8211", value: "–"}, {key: "#8217", value: "'"}, {key: "#39", value: "'"}, {key: "#8220", value: "“" }, {key: "#8221", value: "”" }];
    const parser = new XMLParser({ processEntities: true, htmlEntities: true, ignoreDeclaration: true, ignoreAttributes: false, attributeNamePrefix: "_", numberParseOptions: { leadingZeros: false, hex: true } });
    for (let e in entities) { parser.addEntity(entities[e].key, entities[e].value) };
    try {
        result = await parser.parse(body);
    } catch (e) {
        return null;
    }
    return result
}

async function fetchDiscordFeed() {
        const rssFeed = await Promise.resolve(parseXML(Net.fetch(`https://discord.com/blog/rss.xml`).then(r => r.ok ? r.text() : null).catch(e => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for Discord`, e))));
        if (!rssFeed) return;
        const article = getRSSItem(rssFeed);
        return {
            application: {
                name: rssFeed?.rss?.channel?.title,
                id: "Discord"
            },
            description: article?.description,
            thumbnail: article?.["media:thumbnail"]?._url, 
            timestamp: article?.pubDate, 
            title: article?.title, 
            url: article?.link
        }
    }

async function fetchNintendoFeed() {
    const rssFeed = await Promise.resolve(parseXML(Net.fetch(`https://nintendoeverything.com/feed/`).then(r => r.ok ? r.text() : null).catch(e => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for Nintendo`, e))));
    if (!rssFeed) return;
    const article = getRSSItem(rssFeed);
    return {
        application: {
            name: rssFeed?.rss?.channel?.title,
            id: "Nintendo"
        },
        description: article?.description,
        thumbnail: article?.["media:content"]?._url, 
        timestamp: article?.pubDate, 
        title: article?.title, 
        url: article?.link
    }
}

async function fetchXboxFeed() {
    const rssFeed = await Promise.resolve(parseXML(Net.fetch(`https://news.xbox.com/en-us/feed/`, {headers: {"User-Agent": "activity"}}).then(r => r.ok ? r.text() : null)).catch(e => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for Xbox`, e)));
    if (!rssFeed) return;
    const article = getRSSItem(rssFeed);
    return {
        application: {
            name: rssFeed?.rss?.channel?.title,
            id: "Xbox"
        },
        description: article?.description,
        thumbnail: article?.["content:encoded"]?.match(/\"(https:\/\/xboxwire.thesourcemediaassets.com\/sites\/\d+\/\d+\/\d+\/.*(?=).(jpg|jpeg|png))\"/)[1],
        timestamp: article?.pubDate,
        title: article?.title,
        url: article?.link
    }
}

async function fetchSubnauticaFeed(application: any) {
    const rssFeed = await Promise.resolve(Net.fetch(`https://unknownworlds-strapi.live.kraftonamericas.com/api/articles?sort[0]=published_date%3Adesc&sort[1]=id%3Adesc&sort[2]=published_date%3Adesc&start=0&limit=4`).then(r => r.ok ? r.json() : null).catch(e => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? "game"}`, e)));
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
    }
}

async function fetchMinecraftFeed(application: any) {
    const rssFeed = await Promise.resolve(Net.fetch(`https://net-secondary.web.minecraft-services.net/api/v1.0/en-us/search?pageSize=24&sortType=Recent&category=News&newsOnly=true`).then(r => r.ok ? r.json() : null).catch(e => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? "game"}`, e)));
    if (!rssFeed) return;
    const article = rssFeed.result.results[0];
    return {
        application, 
        appId: application.id, 
        description: article?.description && new DOMParser().parseFromString(article?.description, 'text/html').body.innerText, 
        thumbnail: article?.image, 
        timestamp: article?.time * 1000, 
        title: article?.title && new DOMParser().parseFromString(article?.title, 'text/html').body.innerText,
        url: article?.url
    }
}

async function fetchFortniteFeed(application: any) {
    const rssFeed = await Promise.resolve(Net.fetch(`https://fortnite-api.com/v2/news`).then(r => r.ok ? r.json() : null).catch(e => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? "game"}`, e)));
    if (!rssFeed) return;
    const article = rssFeed.data.br.motds[0]
    return {
        application,
        appId: application.id,
        description: article?.body,
        thumbnail: article?.image,
        timestamp: rssFeed.data.br.date,
        title: article?.title
    }
}

async function fetchSteamFeeds(gameId: number | string, application: any) {
    const rssFeed = await Promise.all([ parseXML(Net.fetch(`https://store.steampowered.com/feeds/news/app/${gameId}`).then(r => r.ok ? r.text() : null).catch(e => console.log("%c[GameNewsStore]", "color: #800080; font-weight: 700;", `Failed to fetch news for ${application?.name ?? gameId}`, e))) ]);
    if (!rssFeed) return;
    const splash = application.getSplashURL('2048', 'png');
    const backupThumbnail = await Promise.resolve(Net.fetch(`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${gameId}/capsule_616x353.jpg`).then(r => r.ok ? r.url : null));
    const article = getRSSItem(rssFeed);
    // sanitize description html before converting to plaintext
    const sanitizedDescription = article?.description && sanitize(article.description);
    // first regex deals with periods, the second deals with most other punctuation (commas, semicolons, exclamation points, etc)
    return {
        application, 
        appId: application.id, 
        description: sanitizedDescription && new DOMParser().parseFromString(sanitizedDescription, 'text/html').body.innerText.replaceAll(/(^| )([^. ]+)\.([^. ]+)(?= |$)/g, "$1$2. $3").replaceAll(/([,!?;:])([^ ])/g, "$1 $2"),
        thumbnail: article?.enclosure?._url || splash || backupThumbnail, 
        timestamp: article?.pubDate, 
        title: article?.title, 
        url: article?.link
    }
}

async function getFeedGameData() {
    const gameData: Record<number | string, any> = {};
    let analyticData;
    // load user application statistics, then fetch them
    await Common.FetchUserApplicationStatistics().then(analyticData = LibraryApplicationStatisticsStore.applicationStatistics);

    const gameIds = Object.values(analyticData).map((app: any) => app?.application_id).concat(Object.values(followedGames).map((app: any) => app.applicationId));
    // only 112 applications can be fetched at one time, so the ids are split into 112-item chunks
    for (const batch of chunkArrayBySize(gameIds, 112)) {
        await Common.FetchApplications.fetchApplications(batch);
    }
    // get all applications and filter all which don't match criteria  
    const applicationList = Object.values(analyticData).flatMap((app: any) => { 
        const application = ApplicationStore.getApplication(app.application_id);
        return application && application.thirdPartySkus.length > 0 && application.thirdPartySkus.some((sku: any) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite") ? application : []
    })
    // grab game steam skus or, if it isn't applicable to the game, use the name of the game instead 
    const skuIds: number[] = applicationList.map((app: any) => {
        const appSku = app.thirdPartySkus.find((sku: any) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"); 
        return appSku?.sku || app.name; 
    })

    // add applications to final return object at key of game sku and also populate whitelist with auto-fetched games
    for (let i = 0; i < skuIds.length; i++) {
        gameData[skuIds[i]] = applicationList[i];
        whitelist[i] = {
            applicationId: applicationList[i].id,
            gameId: skuIds[i],
            name: applicationList[i].name
        }
    }

    // prevent duplicates
    whitelist = whitelist.filter((item, index, array) => { return array.findIndex(x => x?.gameId === item.gameId) === index; });

    // specify external news sources
    for (let setting in settings.external) {
        if (((Data.load("external") && (Data.load("external")[setting])) || settings.external[setting]) === true) {
            gameData[setting] = "External Source";
        }
    }

    Data.save('whitelist', whitelist);
    return gameData;
}

async function feedSelector(gameId: number | string, application: any) {
    let article: FeedItemData | undefined;
    switch (gameId) {
        case "Minecraft": article = await fetchMinecraftFeed(application); break;
        case "Fortnite": article = await fetchFortniteFeed(application); break;
        case "264710": case "848450": case "1962700": article = await fetchSubnauticaFeed(application); break;
        case "discord": article = await fetchDiscordFeed(); break;
        case "nintendo": article = await fetchNintendoFeed(); break;
        case "xbox": article = await fetchXboxFeed(); break;
        default: article = await fetchSteamFeeds(gameId, application);
    }
    return article;
}

export default new class GameNewsStore extends Utils.Store {
    static displayName = "GameNewsStore";
    state: {size?: number[], isFetching?: boolean} = {
        size: [],
        isFetching: false
    };
    whitelist = whitelist;
    blacklist = blacklist;
    dataSet = dataSet;
    displaySet = displaySet;
    followedGames = followedGames;
    constructor() {
        super();
        window.addEventListener("resize", this.listener);
    }

    listener = () => {
        this.state = {...this.state, size: [window.innerWidth, window.innerHeight] };
        this.emitChange();
    }

    componentDidMount() { window.addEventListener("resize", this.listener); }
    componentWillUnmount() { window.removeEventListener("resize", this.listener); }

    initialize() {
        dataSet = Data.load('dataSet') ? Object.assign(dataSet, Data.load('dataSet')) : {};
        lockSet = Data.load('lockSet') || [];
        whitelist = Data.load('whitelist') || [];
        blacklist = Data.load('blacklist') || [];
        followedGames = Data.load('followedGames') || [];
        lastTimeFetched = Data.load('lastTimeFetched');
        setDisplayedArticles();
        this.emitChange();
    }

    setDebugFeed(num: number) {
        if (num < 1) { console.warn("Invalid article input."); return; }
        const testImages = ["https://files.catbox.moe/mfrfxj.png", "https://static.wikia.nocookie.net/silly-cat/images/4/4f/Wire_Cat.png", "https://github.com/Moder112/HWCInternalDatabase/blob/master/static/img/Main.jpg?raw=true", "https://github.com/Moder112/HWCInternalDatabase/blob/master/static/img/him.jpg?raw=true"];
        displaySet = [];
        for (let i = 0; i < num; i++) {
            displaySet.push({
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
                    title: `Test Article ${i+1}`,
                    url: "https://example.com"
                },
                type: "application_news"
            })
        }
        article = displaySet[0];
    }

    rerollFeed() {
        setDisplayedArticles();
    }

    refreshFeed() {
        lastTimeFetched = 0;
    } 

    getWhitelistedGames() {
        return whitelist;
    }

    getBlacklistedGames() {
        return blacklist;
    }

    getAllFollowedGames() {
        return whitelist.concat(followedGames);
    }

    clearBlacklist() {
        blacklist.length = 0;
    }

    clearLockedArticles() {
        lockSet.length = 0;
    }

    getCurrentArticle() {
        return article;
    }

    setCurrentArticle(index: number) {
        if (displaySet[index]) {
            article = displaySet[index]
        }
        else {
            article = displaySet[0]
        }
        this.emitChange();
    }

    lockInArticle(article: Article) {
        if (!this.isArticleLockedIn(article) || lockSet.length < 4) {
            lockSet.push(article);
            Data.save("lockSet", lockSet);
        }
        return;
    }

    releaseLockedArticle(article: Article) {
        if (this.isArticleLockedIn(article)) {
            lockSet.splice(lockSet.indexOf(article), 1);
            Data.save('lockSet', lockSet)
        }
        return;
    }

    isArticleLockedIn(article: Article) {
        return isArticleLockedIn(article);
    }

    getArticleByApplicationId(applicationId: number) {
        for (let article of Object.keys(dataSet)) {
            if (dataSet[article].news.application_id === applicationId) {
                return dataSet[article];
            }
        }
    }

    isGameBlacklisted(applicationId: number)  {
        return Boolean(getBlacklistedGameByApplicationId(applicationId));
    }

    isGameFollowed(applicationId: number) {
        if (this.isGameBlacklisted(applicationId)) return false;
        return Boolean(getFollowedGameByApplicationId(applicationId));
    }

    isGameManuallyFollowed(applicationId: number) {
        return Boolean(getManuallyFollowedGameByApplicationId(applicationId));
    }

    followGame(application: any) {
        let id = application?.linkedApplications?.[0]?.id ?? application.id;
        if (getBlacklistedGameByApplicationId(id)) {
            whitelistGame(id);
            this.emitChange();
            return;
        }
        if (getFollowedGameByApplicationId(id)) return;
        let sku = application.thirdPartySkus.find((sku: any) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite")?.id || application.name;
        followedGames.push({applicationId: id, gameId: sku, name: application.name});
        Data.save('followedGames', followedGames);
        this.emitChange();
        return;
    }

    unfollowGame(application: any) {
        let id = application?.linkedApplications?.[0]?.id ?? application.id;
        const whitelisted = getWhitelistedGameByApplicationId(id);
        const manuallyFollowed = getManuallyFollowedGameByApplicationId(id);
        if (whitelisted) {
            blacklistGame(id);
            this.emitChange();
            return;
        }
        if (manuallyFollowed) {
            followedGames.splice(followedGames.indexOf(manuallyFollowed), 1);
            Data.save('followedGames', followedGames);
        }
        this.emitChange();
        return;
    }

    isNewsInDate(article: Article["news"]) {
        return isNewsInDate(article);
    }

    getOrientation() {
        const [width, height] = this.state.size?.length ? this.state.size : [WindowStore.windowSize().width, WindowStore.windowSize().height];
        return ((width > 1200 || height < 600) && (width < 1200 || height > 600)) ? "vertical" : "horizontal";
    }

    setDirection(e: number) {
        direction = e >= 0 ? 1 : -1;
        this.emitChange();
    }

    getDirection() {
        return direction;
    }

    setIdling(e: boolean) {
        idling = e;
        this.emitChange();
    }

    isFetched() {
        return Object.values(dataSet).length > 5;
    }

    haveSettingsBeenOpened() {
        return settingsOpened;
    }

    setHaveSettingsBeenOpened(e: boolean) {
        settingsOpened = e;
        this.emitChange();
    }

    getArticlesForDisplay() {
        return displaySet;
    }

    shouldFetch() {
        if (Object.keys(dataSet).length === 0) {
            this.initialize();
        }

        return lastTimeFetched == null || Date.now() - lastTimeFetched > 216e5;
    }

    async fetchArticleByApplicationId(applicationId: number, shouldSave?: boolean) {
        const application = ApplicationStore.getApplication(applicationId);
        const articleId = application?.thirdPartySkus?.find((sku: any) => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite")?.id || application.name;
        const article = await feedSelector(articleId, application);

        if (!article) return;
        const news = {
            id: articleId,
                application: article.application,
            news: {
                application_id: article.appId,
                description: article.description && sanitize(article.description),
                thumbnail: article.thumbnail,
                timestamp: article.timestamp,
                title: article.title,
                url: article?.url
            },
            type: "application_news"
        }
        if (isNewsInDate(article)) {
            if (shouldSave) {
                Object.assign(dataSet[articleId], news);
                whitelist.push({applicationId, gameId: articleId, name: application.name});
                Data.save('dataSet', dataSet);
                Data.save('whitelist', whitelist);
            }
            return news;
        }
        return;
    }

    async fetchAnyFeed(url: string, options: any) {
        const rssFeed = await Promise.resolve(Net.fetch(`${url}`, options).then(r => r.ok ? r : null));
        const feedClone = rssFeed?.clone();
        const result = rssFeed?.json().catch(e => parseXML(feedClone?.text())) ;

        return result;
    }

    async fetchFeeds() {
        this.state = {...this.state, isFetching: true};
        lastTimeFetched = Date.now();
        Data.save('lastTimeFetched', lastTimeFetched);
        // get game ids and application entries of games to fetch news for
        const gameData = await getFeedGameData();
        for (const [index, gameId] of Object.keys(gameData).entries()) {
            (async (gameId) => {
                const article = await feedSelector(gameId, gameData[gameId]);
                if (article && isNewsInDate(article)) {
                    dataSet[gameId] = {
                        id: gameId,
                        application: article.application,
                        news: {
                            application_id: article?.appId,
                            description: article.description && sanitize(article.description),
                            thumbnail: article.thumbnail,
                            timestamp: article.timestamp,
                            title: article.title,
                            url: article.url
                        },
                        type: "application_news"
                    }
                    Data.save('dataSet', dataSet);
                }
            })(gameId)
            if (index === Object.keys(gameData).length - 1) this.state = {...this.state, isFetching: false};
        }
        console.log("fetch loop finished")
        if (this.state.isFetching === false) setDisplayedArticles();
    }

    get lastFetched() {
        return lastTimeFetched;
    }

    get idling() {
        return idling;
    }

    get articles() {
        return dataSet;
    }
}