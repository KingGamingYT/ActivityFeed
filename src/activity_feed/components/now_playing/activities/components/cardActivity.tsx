import { ContextMenu } from "betterdiscord";
import { useState } from "react";
import { Common } from "@modules/common";
import { ApplicationStore } from "@modules/stores";
import { RichActivityBuilder, RegularActivityBuilder } from "./InnerBuilder";
import { PartyFooter } from "./common/CardTrailing";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function ActivityCardContextMenu({currentActivity, currentGame}) {
    switch(currentActivity.type) {
        case 0: {
            let id = currentActivity?.application_id;
            if (isNaN(id)) id = undefined; 
            const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: id});
            let application = ApplicationStore.getApplicationByName(currentGame.name);
            if (application.type == null) application = ApplicationStore.getApplication(currentActivity?.application_id);

            const [followedGames, updateFollowStatus] = useState(NewsStore.getManuallyFollowedGames());
            const [blacklist, updateBlacklist] = useState(NewsStore.getBlacklist());
            const isFollowed = NewsStore.isGameFollowed(application.id ?? currentActivity?.application_id);
            const isWhitelisted = NewsStore.isGameWhitelisted(application.id ?? currentActivity?.application_id);

            return (
                <ContextMenu.Menu navId="activity-context" onClose={(e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e)}>
                    <ContextMenu.Item id="open-game-profile" label={"Open Game Profile"} action={useGameProfile} disabled={!useGameProfile} />
                    <ContextMenu.CheckboxItem 
                        id="follow-game" 
                        label={"Show on Activity Feed"} 
                        checked={isFollowed || isWhitelisted} 
                        disabled={!currentGame || application.type == null}
                        action={
                            (isFollowed || isWhitelisted) ? () => {
                                NewsStore.blacklistGame(application ?? {id: currentActivity?.application_id}); 
                                isFollowed ? updateFollowStatus(followedGames.filter(item => item.applicationId !== (application.id ?? currentActivity?.application_id)))
                                : updateBlacklist(blacklist.filter(item => item.applicationId !== (application.id ?? currentActivity?.application_id)))
                            }
                            : () => {
                                NewsStore.followGame(application ?? currentGame); 
                                isFollowed ? updateFollowStatus(followedGames.filter(item => item.applicationId !== (application.id ?? currentActivity?.application_id)))
                                : updateBlacklist(blacklist.filter(item => item.applicationId !== (application.id ?? currentActivity?.application_id)))
                            }
                        } />
                </ContextMenu.Menu>
            )
        }
        case 1: return;
        case 2: return;
        case 3: return;
        case 4: return;
        case 5: return;
    }
}

export function ActivityCard({user, activities, activityProperties, currentActivity, currentGame, players, server, v2Enabled}) {
    if (currentActivity.type == 1) return;

    return (
        <>
            <div className={NowPlayingClasses.activityContainer} onContextMenu={e => ContextMenu.open(e, (props) => <ActivityCardContextMenu {...props} currentActivity={currentActivity} currentGame={currentGame} />)}>
                <RegularActivityBuilder user={user} activity={currentActivity} activityProperties={activityProperties} game={currentGame} players={players} server={server} v2Enabled={v2Enabled} />
                {currentActivity?.assets && currentActivity?.assets.large_image && <RichActivityBuilder user={user} activity={currentActivity} activityProperties={activityProperties} v2Enabled={v2Enabled} />}
            </div>
            {v2Enabled && currentActivity?.party && currentActivity?.party.size && <PartyFooter party={currentActivity.party} players={players} user={user} activity={currentActivity} />}
            {activities.length > 1 && activities.pop() !== currentActivity && <div className={MainClasses.sectionDivider} />}
        </>
    )
}