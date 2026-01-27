import { useWindowSize } from "@common/methods/common";
import { Common } from "@modules/common";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

interface RichButtons {
    activity: Object,
    user: Object,
    v2Enabled?: boolean
}

interface RichButtons {
    activity: Object,
    user: Object,
    players: Object,
    v2Enabled?: boolean
}

export function RegularCardButtons({activity, user, players, v2Enabled}: Buttons) {
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

export function RichCardButtons({activity, user, v2Enabled}: RichButtons) {
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