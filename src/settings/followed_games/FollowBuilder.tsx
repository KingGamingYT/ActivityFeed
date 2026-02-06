import { Components } from "betterdiscord";
import { useState, useMemo } from "react";
import { Common, ModalSystem } from "@modules/common";
import { ApplicationStore, GameStore } from "@modules/stores";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "../ActivityFeedSettings.module.css";

function FollowedGameItemBuilder({game, whitelist, blacklist, updateBlacklist, key}) {
    const application = GameStore.getDetectableGame(game.applicationId) || GameStore.getGameByApplication(ApplicationStore.getApplication(game.applicationId));
    const isUnfollowed = Boolean(NewsStore.getBlacklistedGame(game.gameId));

    return (
        <div className={SettingsClasses.blacklistItem} style={{ display: "flex" }}>
            <img 
                className={SettingsClasses.blacklistItemIcon} 
                src={`https://cdn.discordapp.com/app-icons/${application?.id}/${application.icon}.webp?size=32&keep_aspect_ratio=false`}
            />
            <div className={`${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`}>{application.name || "Unknown Game"}</div>
            {isUnfollowed ? 
                <button
                    className={`${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                    onClick={() => ModalSystem.openModal(props => 
                        <Common.ModalRoot.Modal 
                            {...props}
                            title="Are you sure?"
                            actions={[
                                {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                                {text: "Yes", fullWidth: 1, onClick: () => { NewsStore.whitelistGame(game.gameId); updateBlacklist(blacklist.filter(item => item.gameId !== game.gameId)); console.log(blacklist); props.onClose(); }}
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
                                {text: "Yes", fullWidth: 1, onClick: () => { NewsStore.blacklistGame(application.id, game.gameId); updateBlacklist(blacklist.filter(item => item.gameId !== game.gameId)); props.onClose() }}
                            ]}
                        >
                            <>
                                <div className={MainClasses.emptyText}>Do you want to unfollow this game? Its announcements will be hidden from your Activity Feed.</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>This action will require you to restart Discord in order to see changes.</div>
                            </> 
                        </Common.ModalRoot.Modal>
                    )}
                >Unfollow</button>
            }
        </div>
    )
}

/*function BlacklistItemBuilder({game, blacklist, updateBlacklist, key}) {
    const application = GameStore.getDetectableGame(game.application_id);

    return (
        createElement('div', { className: "blacklistItem_267ac", style: { display: "flex" }}, [
            createElement('img', { className: "blacklistItemIcon_267ac", src: `https://cdn.discordapp.com/app-icons/${application?.id}/${application.icon}.webp?size=32&keep_aspect_ratio=false` }),
            createElement('div', { className: "blacklistItemName_267ac textRow_267ac" }, application.name || "Unknown Game"),
            createElement('button', { 
                className: `button_267ac unhideBlacklisted_267ac ${buttonClasses.lookFilled} ${buttonClasses.colorPrimary} ${buttonClasses.sizeTiny} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                onClick: () => ModalSystem.openModal((props) => 
                    createElement(ModalRoot.Modal, {
                        ...props,
                        title: "Are you sure?", 
                        actions: [
                            {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()}, 
                            {text: "Yes", fullWidth: 1, onClick: () => { NewsStore.whitelistGame(game.game_id); updateBlacklist(blacklist.filter(item => item.game_id !== game.game_id)); console.log(blacklist); props.onClose() }}
                        ]
                    }, [
                        createElement('div', { className: "emptyText_267ac" }, "Do you want to unhide this game? Its announcements will appear in your Activity Feed."),
                        createElement('div', { className: "emptyText_267ac", style: { fontWeight: 600 }}, "This action will require you to restart Discord in order to see changes.")
                    ])
                )},
                "Unhide"
            )
        ])
    )
}*/

export function FollowedGameListBuilder() {
    const whitelist = NewsStore.getWhitelist();
    const [blacklist, updateBlacklist] = useState(NewsStore.getBlacklist());
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return whitelist?.filter(item => (GameStore.getDetectableGame(item.applicationId) || GameStore.getGameByApplication(ApplicationStore.getApplication(item.applicationId))).name.toLowerCase().includes(_query));
    }, [whitelist, query]);
    console.log(filtered, query)

    return (
        <>
            <Components.SearchInput className={SettingsClasses.search} onChange={(e) => setQuery(e.target.value.toLowerCase())} placeholder="Search for Games" />
            {filtered?.length ? <div className={SettingsClasses.blacklist}>{
                filtered.map(game => 
                    <>
                        <FollowedGameItemBuilder game={game} whitelist={whitelist} blacklist={blacklist} updateBlacklist={updateBlacklist} key={game.applicationId} />
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

/*function BlacklistBuilder() {
    const [blacklist, updateBlacklist] = useState(NewsStore.getBlacklist());
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return blacklist?.filter(item => GameStore.getDetectableGame(item.application_id).name.toLowerCase().includes(_query));
    }, [blacklist, query]);


    return ([
        createElement(Components.SearchInput, {
            className: "search_267ac",
            onChange: (e) => { setQuery(e.target.value.toLowerCase()); },
            placeholder: "Search for Games"
        }),
        filtered?.length ? createElement('div', { className: "blacklist_267ac" },
            filtered.map(game => [
                createElement(BlacklistItemBuilder, { game, blacklist, updateBlacklist, key: game.application_id }),
                createElement('div', { className: "sectionDivider_267ac" })
            ])
        )
        : createElement('div', { className: "blacklist_267ac emptyState_267ac" },
            createElement('div', { className: "emptyText_267ac" }, "You haven't hidden any games from your Activity Feed! When you do, they'll appear here.")
        )
    ]);
}*/