import { ContextMenu } from "betterdiscord";
import { RichActivityBuilder, RegularActivityBuilder } from "./InnerBuilder";
import { ActivityCardContextMenu } from "./common/ActivityCardContextMenu";
import { PartyFooter } from "./common/CardTrailing";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function ActivityCard({user, activities, activityProperties, currentActivity, currentGame, players, server, v2Enabled}) {
    if (currentActivity.type == 1) return;

    return (
        <>
            <div className={NowPlayingClasses.activityContainer} onContextMenu={e => ContextMenu.open(e, (props) => <ActivityCardContextMenu {...props} user={user} currentActivity={currentActivity} currentGame={currentGame} />)}>
                <RegularActivityBuilder user={user} activity={currentActivity} activityProperties={activityProperties} game={currentGame} players={players} server={server} v2Enabled={v2Enabled} />
                {currentActivity?.assets && currentActivity?.assets.large_image && <RichActivityBuilder user={user} activity={currentActivity} activityProperties={activityProperties} v2Enabled={v2Enabled} />}
            </div>
            {v2Enabled && currentActivity?.party && currentActivity?.party.size && <PartyFooter party={currentActivity.party} players={players} user={user} activity={currentActivity} />}
            {activities.length > 1 && activities.pop() !== currentActivity && <div className={MainClasses.sectionDivider} />}
        </>
    )
}