import { RegularTwitchActivityBuilder, RichTwitchActivityBuilder } from "./InnerBuilder";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

export function TwitchCard({user, activity, check}) {
    if (!check?.streaming) return;
    const currentGame = activity?.game;
    const currentActivity = activity?.activity;

    return (
        <>
            <RegularTwitchActivityBuilder user={user} activity={currentActivity} game={currentGame} />
            <RichTwitchActivityBuilder activity={currentActivity} />
            <div className={MainClasses.sectionDivider} />
        </>
    )
}