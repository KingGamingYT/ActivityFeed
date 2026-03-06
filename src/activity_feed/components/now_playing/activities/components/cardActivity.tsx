import { useEffect } from 'react';
import { Common } from '@modules/common';
import { RichActivityBuilder, RegularActivityBuilder } from "./InnerBuilder";
import { PartyFooter } from "./common/CardTrailing";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function ActivityCard({user, activities, currentActivity, currentGame, players, server, check, v2Enabled}) {
    if (currentActivity.type == 1) return;
    const gameId = currentActivity?.application_id;

    return (
        <>
            <div className={NowPlayingClasses.activityContainer}>
                <RegularActivityBuilder user={user} activity={currentActivity} game={currentGame} players={players} server={server} check={check} v2Enabled={v2Enabled} />
                {currentActivity?.assets && currentActivity?.assets.large_image && <RichActivityBuilder user={user} activity={currentActivity} v2Enabled={v2Enabled} />}
            </div>
            {v2Enabled && currentActivity?.party && currentActivity?.party.size && <PartyFooter party={currentActivity.party} players={players} user={user} activity={currentActivity} />}
            {activities.length > 1 && activities.pop() !== currentActivity && <div className={MainClasses.sectionDivider} />}
        </>
    )
}