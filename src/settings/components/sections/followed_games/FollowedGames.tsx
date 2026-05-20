import { Components } from "betterdiscord";
import { useState, useMemo } from "react";
import { Common, ModalSystem } from "@modules/common";
import { ApplicationStore, GameStore } from "@modules/stores";
import { FallbackAsset } from "@now_playing/activities/components/common/ActivityAssets";
import locale from "@activity_feed/common/methods/locale";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
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

function FollowedGameItemBuilder({game, blacklist, updateBlacklist}) {
    const [shouldFallback, setShouldFallback] = useState(false);
    const application = GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0]) ?? GameStore.getDetectableGame(game.applicationId) ?? ApplicationStore.getApplication(game.applicationId);
    const isUnfollowed = Boolean(NewsStore.getBlacklistedGameByGameId(game.gameId));

    return (
        <div className={SettingsClasses.blacklistItem} style={{ display: "flex" }}>
            { shouldFallback ? ( <FallbackAsset className={SettingsClasses.blacklistItemIcon} /> ) : <img 
                className={SettingsClasses.blacklistItemIcon} 
                src={`https://cdn.discordapp.com/app-icons/${application?.id}/${application?.icon}.webp?size=32&keep_aspect_ratio=false`}
                onError={() => setShouldFallback(true)}
            />}
            <div className={`${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`}>{application?.name || "Unknown Game"}</div>
            {isUnfollowed ? 
                <button
                    className={`${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                    onClick={() => ModalSystem.openModal(props => 
                        <Common.ModalRoot.Modal 
                            {...props}
                            title={locale.Strings.ARE_YOU_SURE()}
                            actions={[
                                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { NewsStore.whitelistGame(game.gameId); updateBlacklist(blacklist.filter(item => item.applicationId !== game.applicationId)); props.onClose(); }}
                            ]}
                        >
                            <>
                                <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_SUBSCRIBE_TO_GAME()}</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
                            </> 
                        </Common.ModalRoot.Modal>
                    )}
                >{locale.Strings.FOLLOW()}</button>
            :
                <button
                    className={`${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                    onClick={() => ModalSystem.openModal(props => 
                        <Common.ModalRoot.Modal 
                            {...props}
                            title={locale.Strings.ARE_YOU_SURE()}
                            actions={[
                                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { NewsStore.blacklistGame(application, game?.gameId); updateBlacklist(blacklist.filter(item => item.applicationId !== game.applicationId)); props.onClose() }}
                            ]}
                        >
                            <>
                                <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME()}</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
                            </> 
                        </Common.ModalRoot.Modal>
                    )}
                >{locale.Strings.UNFOLLOW()}</button>
            }
        </div>
    )
}

export function FollowedGameListBuilder() {
    const whitelist = NewsStore.getWhitelist();
    const followedGames = NewsStore.getManuallyFollowedGames();
    const allGames = whitelist.concat(followedGames);
    const [blacklist, updateBlacklist] = useState(NewsStore.getBlacklist());
    const [query, setQuery] = useState("");

    if (!allGames || !allGames.length) return <FollowedGameEmptyBuilder />

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return allGames?.filter(item => item?.name?.toLowerCase().includes(_query));
    }, [allGames, query]);

    return (
        <>
            <Components.SearchInput className={SettingsClasses.search} onChange={(e) => setQuery(e.target.value.toLowerCase())} placeholder={locale.Strings.SEARCH_FOR_GAMES()} />
            {filtered?.length ? <div className={SettingsClasses.blacklist}>{
                filtered.sort((a, b) => a.name.localeCompare(b.name)).map(game => 
                    <>
                        <FollowedGameItemBuilder game={game} blacklist={blacklist} updateBlacklist={updateBlacklist} />
                        <div className={MainClasses.sectionDivider} />
                    </>
                )
            }</div>
            :
            <div className={`${SettingsClasses.blacklist} ${MainClasses.emptyState}`}>
                <div className={MainClasses.emptyText}>{locale.Strings.NO_RESULTS_FOUND()}</div>
            </div>}
        </>
    )
}