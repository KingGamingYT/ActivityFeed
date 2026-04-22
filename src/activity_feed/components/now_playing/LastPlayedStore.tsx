import { Data, ReactUtils } from "betterdiscord";
import { Common, FetchGameUtils } from "@modules/common";
import { ApplicationStore, ContentInventoryStore, PresenceStore, NewGameStore, UserStore } from "@modules/stores";
import NewsStore from "@activity_feed/Store";

const LastPlayedStore = (() => {
    let lastPlayedCards = [];
    let gameIds = Data.load('gameIds') ?? [];
    let lastFetched = Data.load('lastFetched') ?? undefined;
    let shouldPersistentlyFetch = false;

    function fetchLastPlayed() {
        let seenGames = ContentInventoryStore.getFeeds().get("global feed").unranked_game_entries;
        const recentlySeenGames = seenGames.filter(entry => new Date(entry.content?.started_at) > new Date(Date.now() - 4.32e8)).map(item => item.content);
        const recentlySeenGameIds = recentlySeenGames.map(entry => entry?.extra?.application_id);
        const _recentlySeenGameIds = Array.from(new Set(recentlySeenGameIds.map(id => id)));


        FetchGameUtils.fetchMultipleGames.fetchMany(_recentlySeenGameIds);

        Data.save('gameIds', gameIds);
        lastFetched = Date.now();
        Data.save('lastFetched', lastFetched);
        setLastPlayed(_recentlySeenGameIds);
        return;
    }

    async function setLastPlayed(g) {
        await Common.FetchApplications.fetchApplications(g);
        let titleNews = [];
        let playerList = [];
        for (let id of g) {
            const presentNews = await NewsStore.getDirectByApplicationId(id === "1402418491272986635" ? "356875570916753438" : id);
            const isNewNews = NewsStore.filterFeeds(presentNews?.news);
            titleNews.push(isNewNews && presentNews);
            playerList.push(ReactUtils.wrapInHooks(Common.RecentlyPlayedByApplicationId)(id));
        }
        lastPlayedCards = g.map((id, index) => { return {
            application: NewGameStore.getGame(id) ?? ApplicationStore.getApplication(id),
            players: playerList[index].map(player => { return {
                user: UserStore.getUser(player.author_id),
                endedAt: player.ended_at ? player.ended_at : player.traits.find(trait => trait?.is_live === true) ? undefined : player.expires_at,
                startedAt: player.started_at,
                status: PresenceStore.getStatus(player.author_id)
            }}),
            titleNews: titleNews[index]
        }})
        dispatchMethods.emitChange()
        //Data.save('lastPlayedCards', lastPlayedCards);
    }

    function handleMount() {
        shouldPersistentlyFetch = true,
        fetchLastPlayed();
        dispatchMethods.emitChange(); 
    }

    function handleUnmount() {
        shouldPersistentlyFetch = false;
    }

    function handleLogout() {
        shouldPersistentlyFetch = false;
        lastPlayedCards = [];
    }

    class LastPlayedStore extends Common.FluxStore.Ay.Store {
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
    let dispatchMethods = new LastPlayedStore(Common.FluxDispatcher, {
        "LAST_PLAYED_MOUNTED": handleMount,
        "LAST_PLAYED_UNMOUNTED": handleUnmount,
        "LOGOUT": handleLogout
    });

    return dispatchMethods;
})
export default LastPlayedStore();