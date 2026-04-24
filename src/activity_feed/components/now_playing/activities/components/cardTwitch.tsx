import { RegularTwitchActivityBuilder, RichTwitchActivityBuilder } from "./InnerBuilder";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import PresenceTypeStore from "../../PresenceTypeStore";

export function TwitchCard({user, activity}) {
    const currentActivity = activity?.activity;
    const activityProperties = PresenceTypeStore.getActivityProperties(currentActivity);
    if (!currentActivity || !activityProperties?.type === "STREAMING") return;
    const currentGame = activity?.game;

    return (
        <>
            <RegularTwitchActivityBuilder user={user} activity={currentActivity} game={currentGame} />
            <RichTwitchActivityBuilder activity={currentActivity} />
            <div className={MainClasses.sectionDivider} />
        </>
    )
}