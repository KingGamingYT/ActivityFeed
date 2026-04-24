import { GameStore } from "@modules/stores";
import { ActivityCard } from "./CardActivity";
import PresenceTypeStore from "../../PresenceTypeStore";

interface CardWrapper {
    user: Object,
    activities: Array<Object>,
    voice?: Object,
    streams?: Object,
    v2Enabled: boolean
}

export function ActivityCardWrapper({user, activities, voice, streams, v2Enabled}: CardWrapper) {
    if (!activities) return;

    return activities.map(activity => {
        const currentActivity = activity?.activity || streams[0].activity;
        const currentGame = activity?.game || GameStore.getDetectableGame(GameStore.searchGamesByName(streams[0].activity.name)[0]);
        const players = activity.playingMembers;
        const server = voice[0]?.guild;
        const activityProperties = PresenceTypeStore.getActivityProperties(currentActivity);

        return (
            <ActivityCard user={user} activities={activities} activityProperties={activityProperties} currentActivity={currentActivity} currentGame={currentGame} players={players} server={server} v2Enabled={v2Enabled} />
        )
    })
}