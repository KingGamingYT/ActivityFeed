import { ContextMenu } from 'betterdiscord';
import { Common } from '@modules/common';
import { RichActivityBuilder, RegularActivityBuilder } from "./InnerBuilder";
import { PartyFooter } from "./common/CardTrailing";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function ActivityCardContextMenu({shouldUseGameProfile}) {
    return (
        <ContextMenu.Menu navId="activity-context" onClose={(e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e)}>
            <ContextMenu.Item id="open-game-profile" label={"Open Game Profile"} action={shouldUseGameProfile} disabled={!shouldUseGameProfile}/>
        </ContextMenu.Menu>
    )
}

export function ActivityCard({user, activities, currentActivity, currentGame, players, server, check, v2Enabled}) {
    if (currentActivity.type == 1) return;
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: currentActivity?.application_id});

    return (
        <>
            <div className={NowPlayingClasses.activityContainer} onContextMenu={e => ContextMenu.open(e, (props) => <ActivityCardContextMenu {...props} shouldUseGameProfile={useGameProfile} />)}>
                <RegularActivityBuilder user={user} activity={currentActivity} game={currentGame} players={players} server={server} check={check} v2Enabled={v2Enabled} />
                {currentActivity?.assets && currentActivity?.assets.large_image && <RichActivityBuilder user={user} activity={currentActivity} v2Enabled={v2Enabled} />}
            </div>
            {v2Enabled && currentActivity?.party && currentActivity?.party.size && <PartyFooter party={currentActivity.party} players={players} user={user} activity={currentActivity} />}
            {activities.length > 1 && activities.pop() !== currentActivity && <div className={MainClasses.sectionDivider} />}
        </>
    )
}