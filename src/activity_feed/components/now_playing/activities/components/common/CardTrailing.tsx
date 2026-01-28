import { useWindowSize } from "@common/methods/common";
import { Common } from "@modules/common";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

interface RegularButtons {
    activity: Object,
    user: Object,
    server?: Object,
    players?: Object,
    check: Object,
    v2Enabled?: boolean
}

interface RichButtons {
    activity: Object,
    user: Object,
    players: Object,
    v2Enabled?: boolean
}

export function RegularCardTrailing({activity, user, server, players, check, v2Enabled}: RegularButtons) {
    const [width, height] = useWindowSize();

    if (width < 1240) return;

    return (
        <>
            {server && <VoiceList
                className={`${NowPlayingClasses.userList}`}
                users={players}
                maxUsers={players.length}
                guildId={server?.id}
                size="SIZE_32"
            />}
            {check.spotify !== 0 && <div className={`${NowPlayingClasses.serviceButtonWrapper}`}>
                <SpotifyButtons user={user} activity={activity} />
            </div>}
            {!activity?.name.includes("YouTube Music") && activity?.assets ? null : <div 
                className={`${MainClasses.button} ${NowPlayingClasses.actionsActivity} ${Common.ButtonVoidClasses.lookFilled} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                style={{ flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}>
                {v2Enabled && activity?.party && activity?.party?.size ? null : <Common.ActivityButtons user={user} activity={activity} />}
            </div>}
        </>
    )
}

export function RichCardTrailing({activity, user, v2Enabled}: RichButtons) {
    const [width, height] = useWindowSize();
    return (
        <>
            {width > 1240 && !activity?.name.includes("YouTube Music") && <div 
                className={`${MainClasses.button} ${NowPlayingClasses.actionsActivity} ${Common.ButtonVoidClasses.lookFilled} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                style={{ flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}>
                {v2Enabled && activity?.party && activity?.party?.size ? null : <Common.ActivityButtons user={user} activity={activity} />}
            </div>}
        </>
    )
}