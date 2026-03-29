import { Data, Utils } from "betterdiscord";
import { Common, FetchGameUtils } from "@modules/common";
import { ApplicationStore, ContentInventoryStore, PresenceStore, NewGameStore, UserStore } from "@modules/stores";
import NewsStore from "@activity_feed/Store";


const LastPlayedStore = (() => {
    let lastPlayedCards = [];
    let gameIds = [];
    let lastFetched;
    let shouldPersistentlyFetch = false;

    async function fetchLastPlayed() {
        let seenGames = await Common.RestAPI.get(Common.Endpoints.ACTIVITIES);
        const recentlySeenGames = seenGames.body.filter(activity => new Date(activity.updated_at) > new Date(Date.now() - 4.32e8))
        const recentlySeenGameIds = recentlySeenGames.map(activity => activity.application_id);
        const _recentlySeenGameIds = Array.from(new Set(recentlySeenGameIds.map(id => id)));
        for (const id of _recentlySeenGameIds) {
            if (!ApplicationStore.getApplication(id)) {
                await Common.FetchApplications.fetchApplications([id]);
            }
        }

        const __recentlySeenGameIds = _recentlySeenGameIds.filter(item => ApplicationStore.getApplication(item));

        FetchGameUtils.fetchMultipleGames.fetchMany([_recentlySeenGameIds]);

        const ___recentlySeenGameIds = __recentlySeenGameIds.filter(item => NewGameStore.getGame(item));
        Data.save('gameIds', gameIds);
        lastFetched = Date.now();
        Data.save('lastFetched', lastFetched);
        setLastPlayed(___recentlySeenGameIds);
        Data.save('lastPlayedCards', lastPlayedCards);
        return;
    }

    async function setLastPlayed(g) {
        let titleNews = [];
        let playerList = [];
        for (let id of g) {
            const presentNews = await NewsStore.getDirectByApplicationId(id === "1402418491272986635" ? "356875570916753438" : id);
            const isNewNews = NewsStore.filterFeeds(presentNews?.news);
            titleNews.push(isNewNews && presentNews);
            playerList.push(ContentInventoryStore.getFeeds().get("global feed").unranked_game_entries.filter(entry => entry.content?.extra?.application_id?.includes(id)).map(item => item.content));
        }
        lastPlayedCards = g.map((id, index) => { return {
            application: NewGameStore.getGame(id),
            players: playerList[index].map(player => { return {
                user: UserStore.getUser(player.author_id),
                endedAt: player.ended_at ? player.ended_at : player.traits.find(trait => trait?.is_live === true) ? undefined : player.expires_at,
                startedAt: player.started_at,
                status: PresenceStore.getStatus(player.author_id)
            }}),
            titleNews: titleNews[index]
        }})
    }

    function initialize() {
        lastPlayedCards = Data.load('lastPlayedCards') ?? [];
        gameIds = Data.load('gameIds') ?? [];
        lastFetched = Data.load('lastFetched');
    }

    async function handleMount() {
        shouldPersistentlyFetch = true,
        await fetchLastPlayed();
        LastPlayedStore.emitChange();  
    }

    function handleUnmount() {
        shouldPersistentlyFetch = false;
    }

    return new class LastPlayedStore extends Common.FluxStore.Ay.Store {
        static displayName = "LastPlayedStore";
        gameIds = [];

        initialize() {
            initialize();
        }

        get lastPlayedCards() {
            return lastPlayedCards;
        }

        get isMounted() {
            return shouldPersistentlyFetch;
        }

        async getLastPlayed() {
            await fetchLastPlayed();
            return lastPlayedCards;
        }

        get lastFetched() {
            return lastFetched;
        }

    }(Common.FluxDispatcher, {
        "LAST_PLAYED_MOUNTED": handleMount,
        "LAST_PLAYED_UNMOUNTED": handleUnmount
    })
})
export default LastPlayedStore();