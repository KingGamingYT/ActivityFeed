import { Hooks } from "betterdiscord";
import { Common } from "@modules/common";
import { useStateFromStores, UserStore } from "@modules/stores";
import { TimeClock, InactiveTimeClock } from "@common/methods/common";
import { handleApplicationClick } from "./ActivityButtons";
import locale from "@common/methods/locale";
import DiscordTag from "./DiscordTag";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import PresenceTypeStore from "@now_playing/PresenceTypeStore";

function ActivityType(props: any) {
    const { activity, user, game, channel, stream, streamUser, server, type } = props
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: game?.id});
    const currentUser = useStateFromStores([ UserStore ], () => UserStore.getCurrentUser());
    const activityProperties = Hooks.useStateFromStores([ PresenceTypeStore ], () => PresenceTypeStore.getActivityProperties(activity));

    switch (type) {
        case "REGULAR": const handleClick = handleApplicationClick({user, currentUser, activity, application: game}); return (
            <>
                <div className={NowPlayingClasses.gameNameWrapper}>
                    <div 
                        className={NowPlayingClasses.gameName}
                        onClick={handleClick ?? useGameProfile}
                        onMouseOver={(e) => Boolean(handleClick ?? useGameProfile) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                        onMouseLeave={(e) => Boolean(handleClick ?? useGameProfile) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                    >{game?.name}</div>
                </div>
                {!activity?.assets?.large_image && <div className={NowPlayingClasses.playTime}>
                    <TimeClock timestamp={ activity?.timestamps?.start || activity.created_at } />
                </div>}
            </>
        )
        case "RICH": return (
            <>
                {activityProperties?.platform === "YT_MUSIC" ?
                    <>
                        <Common.Link href={activity?.details_url}>
                            <div 
                                className={`${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}
                                onMouseOver={(e) => e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                                onMouseLeave={(e) => e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                                >{activity.details || activity?.state}
                            </div>
                        </Common.Link>
                        {activity?.details && <Common.Link href={activity?.state_url}>
                            <div 
                                className={`${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}
                                onMouseOver={(e) => e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                                onMouseLeave={(e) => e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                                >{activity?.state}
                            </div>
                        </Common.Link>}
                    </>
                :
                    <>
                        <div 
                            className={`${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}
                            onClick={() => {switch(activityProperties?.platform) {
                                case "SPOTIFY": return Common.OpenTrack(activity)
                                case "CRUNCHYROLL": return handleApplicationClick({user, currentUser, activity})()
                            }}}
                            onMouseOver={(e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                            onMouseLeave={(e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                            >{activity.details || activity?.state}
                        </div>
                        {activity?.details && <div 
                            className={`${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}
                            onClick={() => activityProperties?.platform === "SPOTIFY" && Common.OpenArtist(activity, user.id, 0)}
                            onMouseOver={(e) => activityProperties?.platform === "SPOTIFY" && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                            onMouseLeave={(e) => activityProperties?.platform === "SPOTIFY" && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                            >{activity?.state}
                        </div>}
                    </>
                }
                {
                    activity?.timestamps?.end ? <div className="mediaProgressBarContainer">
                        <Common.MediaProgressBar start={activity?.timestamps?.start || activity?.created_at} end={activity?.timestamps?.end} />
                    </div>
                        : <Common.ActivityTimer activity={activity} />
                }
            </>
        );
        case "TWITCH": return (
            <div className={NowPlayingClasses.streamInfo}>
                <div className={NowPlayingClasses.gameName}>{activity?.name.toLowerCase().includes('twitch') ? game?.name : game?.name.substring(0, 13) + activity?.name}</div>
                <a
                    className={`${Common.ButtonVoidClasses.lookLink} ${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover} ${NowPlayingClasses.playTime}`}
                    href={activity.url}
                    rel="noreferrer nopener"
                    target="_blank"
                    role="button">
                    {activity.url}
                </a>
            </div>
        )
        case "TWITCH_OVERLAY": return (
            <>
                <div className={NowPlayingClasses.streamName}>{activity.details}</div>
                {activity.state && <div className={NowPlayingClasses.streamGame}>{locale.Strings.PLAYING_GAME({gameName: activity.state})}</div>}
            </>
        )
        case "VOICE": return (
            <>
                <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}`}>{server?.name || channel?.name || Common.UsernameUtils.getName(streamUser)}</div>
                {server && <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}`}>{channel?.name}</div>}
            </>
        )
        case "STREAM": return (
            <>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}`}>{Common.UsernameUtils.getName(streamUser)}</div>
                    <Common.LiveBadge style={{ marginLeft: "5px" }} />
                </div>
               <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}`}>{
                    activity ? Common.intl.intl.format(Common.intl.t['0wJXSh'], {name: <strong>{stream.name}</strong>}) 
                    : locale.Strings.STREAMING()
                }</div>
            </>
        )
        case "LAST_PLAYED": return (
            <>
                <DiscordTag user={streamUser} />
                <div className={NowPlayingClasses.playTime}>
                    {
                        activity.endedAt ? <InactiveTimeClock timestamp={ activity?.endedAt } />
                        : locale.Strings.NOW_PLAYING()
                    }
                </div>
            </>
        )
    }
}

export function FlexInfo(props: any) {
    const { className, style, onClick } = props

    return (
        <div className={className} style={style} onClick={onClick}>
            <ActivityType {...props} />
        </div>
    )
}