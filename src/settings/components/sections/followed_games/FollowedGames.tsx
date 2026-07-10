import { Components, Hooks } from "betterdiscord";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Common } from "@modules/common";
import { ApplicationStore, useStateFromStores } from "@modules/stores";
import { FallbackAsset } from "@now_playing/activities/components/common/ActivityAssets";
import locale from "@activity_feed/common/methods/locale";
import ActivityFeedSettingsButton from "@settings/components/common/ActivityFeedSettingsButton";
import NewsStore from "@activity_feed/GameNewsStore";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

function FollowedGameEmptyBuilder() {
    return (
        <div className={SettingsClasses.emptyApplications}>
            <div className={SettingsClasses.emptyApplicationsImage} />
            <div className={`${Common.TextFormatClasses.defaultColor} ${SettingsClasses.emptyApplicationsTitle}`}>{locale.Strings.ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_TITLE()}</div>
            <div className={`${SettingsClasses.emptyApplicationsBody}`}>{locale.Strings.ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_SUBTITLE()}</div>
        </div>
    )
}

function FollowedGameItemBuilder({game, gameList, updateGameList}) {
    const [shouldFallback, setShouldFallback] = useState(false);
    const application = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplication(game.applicationId));
    const followed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(application?.id ?? game?.application_id));
    const manuallyFollowed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameManuallyFollowed(application?.id ?? game?.application_id));

    const handleUnsubscribe = (props: any) => (
        <Common.ModalRoot.Modal 
            {...props}
            title={locale.Strings.ARE_YOU_SURE()}
            actions={[
                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { manuallyFollowed && updateGameList(gameList.filter(item => item.applicationId !== game.applicationId)); NewsStore.unfollowGame(application); props.onClose() }}
            ]}
        >
            <>
                <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME()}</div>
                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
            </> 
        </Common.ModalRoot.Modal>
    )

    const handleSubscribe = (props: any) => ( 
        <Common.ModalRoot.Modal 
            {...props}
            title={locale.Strings.ARE_YOU_SURE()}
            actions={[
                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { NewsStore.followGame(application); props.onClose(); }}
            ]}
        >
            <>
                <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_SUBSCRIBE_TO_GAME()}</div>
                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
            </> 
        </Common.ModalRoot.Modal>
    )

    return (
        <div className={SettingsClasses.itemContainer} style={{ display: "flex" }}>
            { shouldFallback && !application ? ( <FallbackAsset className={SettingsClasses.itemIcon} /> ) : <img 
                className={SettingsClasses.itemIcon} 
                src={application?.getIconURL(64, 'webp')}
                onError={() => setShouldFallback(true)}
            />}
            <div className={SettingsClasses.itemName}>{application?.name || "Unknown Game"}</div>
            { followed 
                ? <ActivityFeedSettingsButton text={locale.Strings.UNFOLLOW()} color="text-subtle" onClick={() => Common.ModalSystem.openModal(props => handleUnsubscribe(props))} />
                : <ActivityFeedSettingsButton text={locale.Strings.FOLLOW()} color="text-subtle" onClick={() => Common.ModalSystem.openModal(props => handleSubscribe(props))} />
            }
        </div>
    )
}

export function FollowedGameListBuilder() {
    const followedGames = Hooks.useStateFromStores([NewsStore], () => NewsStore.getAllFollowedGames());
    const areGamesLoaded = Hooks.useStateFromStores([NewsStore], () => NewsStore.haveSettingsBeenOpened());
    const [allGames, updateAllGames] = useState(followedGames);
    const [query, setQuery] = useState("");
    useEffect(() => {
        (async () => {
            const gameIds = allGames.map(game => game.applicationId)
            let idOverflow = []
            if (gameIds.length  > 112) {
                for (let i = 0; i < gameIds.length; i++) {
                    if (i % 112 === 0) {
                        idOverflow.push(gameIds.splice(0, 112));
                    }
                }
                await Common.FetchApplications.fetchApplications(gameIds);
                idOverflow.map(async idSplit => {return await Common.FetchApplications.fetchApplications(idSplit)});
            }
            else { await Common.FetchApplications.fetchApplications(gameIds); }
            NewsStore.setHaveSettingsBeenOpened(true);
        })()
    }, [allGames]);

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return allGames?.filter(item => item?.name?.toLowerCase().includes(_query));
    }, [allGames, query]);

    if (!allGames || !allGames.length || !areGamesLoaded) return <FollowedGameEmptyBuilder />

    return (
        <>
            <Components.SearchInput className={SettingsClasses.search} onChange={(e) => setQuery(e.target.value.toLowerCase())} placeholder={locale.Strings.SEARCH_FOR_GAMES()} />
            {filtered?.length ? <div className={SettingsClasses.container}>{
                filtered.sort((a, b) => a.name.localeCompare(b.name)).map(game => 
                    <>
                        <FollowedGameItemBuilder game={game} gameList={allGames} updateGameList={updateAllGames} key={game.applicationId} />
                        <div className={MainClasses.sectionDivider} />
                    </>
                )
            }</div>
            :
            <div className={`${SettingsClasses.container} ${MainClasses.emptyState}`}>
                <div className={MainClasses.emptyText}>{locale.Strings.NO_RESULTS_FOUND()}</div>
            </div>}
        </>
    )
}