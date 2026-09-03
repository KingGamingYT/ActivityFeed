import { Hooks } from "betterdiscord";
import { RegularActivityBuilder, RichTwitchActivityBuilder } from "./InnerBuilder";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import PresenceTypeStore from "../../PresenceTypeStore";

export function TwitchCard({user, activity}) {
    const currentActivity = activity?.activity;
    const activityProperties = Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getActivityProperties(currentActivity));
    const currentGame = activity?.application;

    return ((!currentActivity || !activityProperties?.type === "STREAMING") ?
        <>
            <RegularActivityBuilder user={user} activity={currentActivity} activityProperties={activityProperties} game={currentGame} />
            <RichTwitchActivityBuilder activity={currentActivity} />
            <div className={MainClasses.sectionDivider} />
        </>
    : null)
}