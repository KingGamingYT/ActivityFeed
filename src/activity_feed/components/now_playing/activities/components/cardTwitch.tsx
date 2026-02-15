import { RegularTwitchActivityBuilder, RichTwitchActivityBuilder } from "./InnerBuilder";

export function TwitchCard({user, activity}) {
    const currentGame = activity?.game;
    const currentActivity = activity?.activity;

    return (
        <>
            <RegularTwitchActivityBuilder user={user} activity={currentActivity} game={currentGame} />
            <RichTwitchActivityBuilder activity={currentActivity} />
        </>
    )
}