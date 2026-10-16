import { Components, Data, Hooks } from "betterdiscord";
import { useState, useEffect, useMemo, SetStateAction } from "react";
import { Common } from "@modules/common";
import { ApplicationStore, useStateFromStores } from "@modules/stores";
import { FallbackAsset } from "@now_playing/activities/components/common/ActivityAssets";
import { chunkArrayBySize } from "@activity_feed/common/methods/common";
import locale from "@activity_feed/common/methods/locale";
import settings from "@settings/settings";
import ActivityFeedSettingsButton from "@settings/components/common/ActivityFeedSettingsButton";
import NewsStore from "@activity_feed/GameNewsStore";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

interface FeedItemSubscribeModal {
    game?: any;
    service?: string;
    transitionState: boolean;
    dismissable: boolean;
    onClose: any;
}

interface FeedItemUnsubscribeModal {
    game?: any,
    gameList?: Array<any>;
    updateGameList?: any;
    service?: string
    transitionState: boolean;
    dismissable: boolean;
    onClose: any;
}

interface FeedItem {
    game?: any;
    gameList?: Array<any>;
    updateGameList?: any;
    service?: string;
}

function UserSettingsActivityFeedItemSubscribeModal({game, service, ...props}: FeedItemSubscribeModal) {
    const application = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplication(game?.applicationId));
    return (
        <Common.Modal 
            {...props}
            title={locale.Strings.ARE_YOU_SURE()}
            actions={[
                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { 
                    if (game) NewsStore.followGame(application);
                    else if (service) Data.save("external", {...Data.load("external"), [service]: true});
                    props.onClose(); 
                }}
            ]}
        >
            <>
                <div className={MainClasses.emptyText}>{service ? locale.Strings.ACTIVITY_FEED_SUBSCRIBE_TO_EXTERNAL() : locale.Strings.ACTIVITY_FEED_SUBSCRIBE_TO_GAME()}</div>
                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
            </> 
        </Common.Modal>
    )
}

function UserSettingsActivityFeedItemUnsubscribeModal({game, gameList, updateGameList, service, ...props}: FeedItemUnsubscribeModal) {
    const application = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplication(game?.applicationId));
    const manuallyFollowed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameManuallyFollowed(application?.id ?? game?.applicationId));
    return (
        <Common.Modal 
            {...props}
            title={locale.Strings.ARE_YOU_SURE()}
            actions={[
                {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { 
                    if (game) {
                        manuallyFollowed && updateGameList(gameList.filter((item: any) => item.applicationId !== game.applicationId)); 
                        NewsStore.unfollowGame(application);
                    }
                    else if (service) Data.save("external", {...Data.load("external"), [service]: false});
                    props.onClose(); 
                }}
            ]}
        >
            <>
                <div className={MainClasses.emptyText}>{service ? locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_EXTERNAL() : locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME()}</div>
                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
            </> 
        </Common.Modal>
    )
}

function UserSettingsActivityFeedEmptyApplications() {
    return (
        <div className={SettingsClasses.emptyApplications}>
            <div className={SettingsClasses.emptyApplicationsImage} />
            <div className={`${Common.TextFormatClasses.defaultColor} ${SettingsClasses.emptyApplicationsTitle}`}>{locale.Strings.ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_TITLE()}</div>
            <div className={SettingsClasses.emptyApplicationsBody}>{locale.Strings.ACTIVITY_FEED_FOLLOWED_GAMES_EMPTY_SUBTITLE()}</div>
        </div>
    )
}

function UserSettingsActivityFeedItem({game, gameList, updateGameList, service}: FeedItem) {
    if (game) {
        const [shouldFallback, setShouldFallback] = useState(false);
        const application = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplication(game.applicationId));
        const followed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(application?.id ?? game?.applicationId));
        const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: application?.id ?? game?.applicationId});

        return (
            <div className={SettingsClasses.itemContainer} style={{ display: "flex" }}>
                { shouldFallback && !application ? ( <FallbackAsset className={SettingsClasses.itemIcon} /> ) : <img 
                    className={SettingsClasses.itemIcon} 
                    src={application?.getIconURL(60)}
                    onClick={useGameProfile}
                    onError={() => setShouldFallback(true)}
                    onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(SettingsClasses.clickableIcon)}
                    onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(SettingsClasses.clickableIcon)}
                    
                />}
                <div 
                    className={SettingsClasses.itemName}
                    onClick={useGameProfile}
                    onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(SettingsClasses.clickableText)}
                    onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(SettingsClasses.clickableText)}
                >{application?.name || "Unknown Game"}</div>
                {followed 
                    ? <ActivityFeedSettingsButton 
                        text={locale.Strings.UNFOLLOW()} 
                        color="text-subtle" 
                        onClick={() => Common.ModalSystem.openModal((props: any) => <UserSettingsActivityFeedItemUnsubscribeModal {...props} game={game} gameList={gameList} updateGameList={updateGameList} /> )} 
                    />
                    : <ActivityFeedSettingsButton 
                        text={locale.Strings.FOLLOW()} 
                        color="text-subtle" 
                        onClick={() => Common.ModalSystem.openModal((props: any) => <UserSettingsActivityFeedItemSubscribeModal {...props} game={game} /> )} 
                    />
                }
            </div>
        )
    }
    else if (service) {
        const ExternalItem = settings?.external?.[service];
        const externalItemState = Hooks.useData<Record<string, any>>("external")?.[service] || ExternalItem.enabled;
        
        return (
            <div className={SettingsClasses.itemContainer} style={{ display: "flex" }}>
                <ExternalItem.icon className={SettingsClasses.itemIcon} color="WHITE" style={{ backgroundColor: ExternalItem.color, padding: "5px" }} />
                <div className={SettingsClasses.itemTextContainer}>
                    <div className={SettingsClasses.itemName}>{ExternalItem.name || "Unknown Source"}</div>
                    {ExternalItem.note && <div className={`${SettingsClasses.itemDescription} ${MainClasses.emptySubtitle}`}>{ExternalItem.note}</div>}
                </div>
                {!externalItemState 
                    ? <ActivityFeedSettingsButton 
                        text={locale.Strings.FOLLOW()} 
                        color="text-subtle" 
                        onClick={() => Common.ModalSystem.openModal((props: any) => <UserSettingsActivityFeedItemSubscribeModal {...props} service={service} /> )} 
                    />
                    : <ActivityFeedSettingsButton 
                        text={locale.Strings.UNFOLLOW()} 
                        color="text-subtle" 
                        onClick={() => Common.ModalSystem.openModal((props: any) => <UserSettingsActivityFeedItemUnsubscribeModal {...props} service={service} /> )} 
                    />
                }
            </div>
        )
    }

    console.warn("UserSettingsActivityFeedItem is not of type game or service");
    return;
}

export function UserSettingsActivityFeedFollowedItemList() {
    const followedGames = Hooks.useStateFromStores([NewsStore], () => NewsStore.getAllFollowedGames());
    const areGamesLoaded = Hooks.useStateFromStores([NewsStore], () => NewsStore.haveSettingsBeenOpened());
    const [allGames, updateAllGames] = useState(followedGames);
    const [query, setQuery] = useState("");
    useEffect(() => {
        (async () => {
            const gameIds = allGames.map(game => game.applicationId)
            for (const batch of chunkArrayBySize(gameIds, 112)) {
                await Common.FetchApplications.fetchApplications(batch);
            }
            NewsStore.setHaveSettingsBeenOpened(true);
        })()
    }, [allGames]);

    const filtered = useMemo(() => {
        const _query = query.toLowerCase();
        return allGames?.filter(item => item?.name?.toLowerCase().includes(_query));
    }, [allGames, query]);

    if (!allGames || !allGames.length || !areGamesLoaded) return <UserSettingsActivityFeedEmptyApplications />

    return (
        <>
            <Components.SearchInput className={SettingsClasses.search} defaultValue="" onChange={(e) => setQuery(e.toLowerCase())} placeholder={locale.Strings.SEARCH_FOR_GAMES()} />
            {filtered?.length ? <div className={SettingsClasses.container}>{
                filtered.sort((a, b) => a.name.localeCompare(b.name)).map(game => 
                    <>
                        <UserSettingsActivityFeedItem game={game} gameList={allGames} updateGameList={updateAllGames} key={game.applicationId} />
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

export function UserSettingsActivityFeedExternalItemList() {
    return (
        <div className={SettingsClasses.container}>{
            Object.keys(settings.external).map((key) => {
                return (
                    <>
                        <UserSettingsActivityFeedItem service={key} key={key} />
                        <div className={MainClasses.sectionDivider} />
                    </>
                )
            })
        }</div>
    )
}