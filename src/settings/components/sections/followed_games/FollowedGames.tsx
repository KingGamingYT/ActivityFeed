import { Components, Hooks } from "betterdiscord";
import { useState, useEffect, useMemo } from "react";
import { Common } from "@modules/common";
import { ApplicationStore, GameStore } from "@modules/stores";
import { FallbackAsset } from "@now_playing/activities/components/common/ActivityAssets";
import locale from "@activity_feed/common/methods/locale";
import ActivityFeedSettingsButton from "@settings/components/common/ActivityFeedSettingsButton";
import NewsStore from "@activity_feed/Store";
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
    let application;
    useEffect(() => {
        (async () => {
            await Common.FetchApplications.fetchApplication(game?.applicationId).then(r => application = r).catch(
                e => console.log("%c[FetchApplication]", "color: #800080; font-weight: 700;", `Failed to fetch data for ${game?.name ?? game?.applicationId}`, e)
            )
        })
    }, [game]);
    const isFollowed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(game?.applicationId));
    const isWhitelisted = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameWhitelisted(game?.applicationId));

    const handleUnsubscribe = (props) =>
        <Common.ModalRoot.Modal 
            {...props}
            title={locale.Strings.ARE_YOU_SURE()}
            actions={[
                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { isFollowed && updateGameList(gameList.filter(item => item.applicationId !== game.applicationId)); NewsStore.blacklistGame(application, game?.gameId); props.onClose() }}
            ]}
        >
            <>
                <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME()}</div>
                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
            </> 
        </Common.ModalRoot.Modal>

    const handleSubscribe = (props) =>  
        <Common.ModalRoot.Modal 
            {...props}
            title={locale.Strings.ARE_YOU_SURE()}
            actions={[
                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { NewsStore.whitelistGame(game.gameId); props.onClose(); }}
            ]}
        >
            <>
                <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_SUBSCRIBE_TO_GAME()}</div>
                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
            </> 
        </Common.ModalRoot.Modal>

    return (
        <div className={SettingsClasses.itemContainer} style={{ display: "flex" }}>
            { shouldFallback ? ( <FallbackAsset className={SettingsClasses.itemIcon} /> ) : <img 
                className={SettingsClasses.itemIcon} 
                src={`https://cdn.discordapp.com/app-icons/${application?.id}/${application?.icon}.webp?size=64&keep_aspect_ratio=false`}
                onError={() => setShouldFallback(true)}
            />}
            <div className={SettingsClasses.itemName}>{application?.name || "Unknown Game"}</div>
            {(isFollowed || isWhitelisted) 
                ? <ActivityFeedSettingsButton text={locale.Strings.UNFOLLOW()} color="text-subtle" onClick={() => Common.ModalSystem.openModal(props => handleUnsubscribe(props))} />
                : <ActivityFeedSettingsButton text={locale.Strings.FOLLOW()} color="text-subtle" onClick={() => Common.ModalSystem.openModal(props => handleSubscribe(props))} />
            }
        </div>
    )
}

export function FollowedGameListBuilder() {
    const whitelist = Hooks.useStateFromStores([NewsStore], () => NewsStore.getWhitelist());
    const followedGames = Hooks.useStateFromStores([NewsStore], () => NewsStore.getManuallyFollowedGames());
    const [allGames, updateAllGames] = useState(whitelist.concat(followedGames));
    const [query, setQuery] = useState("");

    if (!allGames || !allGames.length) return <FollowedGameEmptyBuilder />

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return allGames?.filter(item => item?.name?.toLowerCase().includes(_query));
    }, [allGames, query]);

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