import { Common } from "@modules/common";
import { ActivityCard } from "./cardActivity";
interface CardWrapper {
    user: Object,
    activities: Object,
    voice?: Object,
    streams?: Object,
    check: Object,
    v2Enabled: boolean
}

export function ActivityCardWrapper({user, activities, voice, streams, check, v2Enabled}: CardWrapper) {
    if (!activities) return;

    return activities.map(activity => {
        const currentActivity = activity?.activity || streams[0].activity;
        const currentGame = activity?.game || Common.GameStore.getGameByName(streams[0].activity.name);
        const players = activity.playingMembers;
        const server = voice[0]?.guild;

        return (
            <ActivityCard user={user} activities={activities} currentActivity={currentActivity} currentGame={currentGame} players={players} server={server} check={check} v2Enabled={v2Enabled} />
        )
    })
}