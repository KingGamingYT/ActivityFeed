import { Components } from "betterdiscord";
import { useState, useMemo } from "react";
import { Common } from "@modules/common";
import { GameStore } from "@modules/stores";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import FeedClasses from "@application_news/ApplicationNews.module.css";

function FollowedGameItemBuilder({game, gameList, whitelist, updateWhitelist, key}) {
    const application = GameStore.getDetectableGame(key);
    const isFollowed = gameList[game]

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

export function FollowedGameListBuilder({}) {
    return;
    const games = NewsStore.getFeeds();
    const [whitelist, updateWhitelist] = useState(NewsStore.getBlacklist());
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return whitelist?.filter(item => GameStore.getDetectableGame(item.application_id).name.toLowerCase().includes(_query));
    }, [whitelist, query]);

    return (
        <Components.SearchInput className={FeedClasses.search} onChange={(e) => setQuery(e.target.value.toLowerCase())} placeholder="Search for Games">{
            filtered?.length ? <div className={FeedClasses.blacklist}>{
                filtered.map(game => 
                    <>
                        <FollowedGameItemBuilder game={game} gameList={games} whitelist={whitelist} updateWhitelist={updateWhitelist} key={game.application_id} />
                    </>
                )
            }</div>
            :
            <div></div>
        }</Components.SearchInput>
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