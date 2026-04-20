import { Components } from "betterdiscord";
import { useState, useMemo } from "react";
import { Common, ModalSystem } from "@modules/common";
import { ApplicationStore, GameStore } from "@modules/stores";
import { FallbackAsset } from "@now_playing/activities/components/common/ActivityAssets";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

function FollowedGameEmptyBuilder() {
    return (
        <div className={SettingsClasses.emptyApplications}>
            <div className={SettingsClasses.emptyApplicationsImage} />
            <div className={`${Common.TextFormatClasses.defaultColor} ${SettingsClasses.emptyApplicationsTitle}`}>You're not following any games</div>
            <div className={`${SettingsClasses.emptyApplicationsBody}`}>Discord will automatically follow games that you play, but you can unfollow anytime.</div>
        </div>
    )
}

function FollowedGameItemBuilder({game, blacklist, updateBlacklist}) {
    const [shouldFallback, setShouldFallback] = useState(false);
    const application = GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0]) ?? GameStore.getDetectableGame(game.applicationId) ?? ApplicationStore.getApplication(game.applicationId);
    const isUnfollowed = Boolean(NewsStore.getBlacklistedGame(game.gameId));

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
                            title="Are you sure?"
                            actions={[
                                {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                                {text: "Yes", fullWidth: 1, onClick: () => { NewsStore.whitelistGame(game.gameId); updateBlacklist(blacklist.filter(item => item.applicationId !== game.applicationId)); props.onClose(); }}
                            ]}
                        >
                            <>
                                <div className={MainClasses.emptyText}>Do you want to follow this game? Its announcements will appear in your Activity Feed.</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>This action will require you to restart Discord in order to see changes.</div>
                            </> 
                        </Common.ModalRoot.Modal>
                    )}
                >Follow</button>
            :
                <button
                    className={`${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                    onClick={() => ModalSystem.openModal(props => 
                        <Common.ModalRoot.Modal 
                            {...props}
                            title="Are you sure?"
                            actions={[
                                {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                                {text: "Yes", fullWidth: 1, onClick: () => { NewsStore.blacklistGame(application, game?.gameId); updateBlacklist(blacklist.filter(item => item.applicationId !== game.applicationId)); props.onClose() }}
                            ]}
                        >
                            <>
                                <div className={MainClasses.emptyText}>Do you want to unfollow this game? Its announcements will be removed from your Activity Feed.</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>This action will require you to restart Discord in order to see changes.</div>
                            </> 
                        </Common.ModalRoot.Modal>
                    )}
                >Unfollow</button>
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
            <Components.SearchInput className={SettingsClasses.search} onChange={(e) => setQuery(e.target.value.toLowerCase())} placeholder="Search for Games" />
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
                <div className={MainClasses.emptyText}>No results.</div>
            </div>}
        </>
    )
}