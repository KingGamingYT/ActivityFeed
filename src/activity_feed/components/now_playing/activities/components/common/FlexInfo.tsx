import { ReactUtils } from "betterdiscord";
import { Common } from '@modules/common';
import { GuildStore, UserStore, useStateFromStores } from '@modules/stores';
import { TimeClock, InactiveTimeClock } from '@common/methods/common';
import DiscordTag from "./DiscordTag";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import PresenceTypeStore from "@now_playing/PresenceTypeStore";

function ActivityType(props) {
    const { activity, user, game, channel, stream, streamUser, server, type } = props
    const guildChannel = useStateFromStores([ GuildStore ], () => GuildStore.getGuild(channel?.guild_id));
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: game?.id});
    const activityProperties = PresenceTypeStore.getActivityProperties(activity);

    switch (type) {
        case "REGULAR": return (
            <>
                <div className={NowPlayingClasses.gameNameWrapper}>
                    <div 
                        className={NowPlayingClasses.gameName}
                        onClick={useGameProfile}
                        onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                        onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                    >{game?.name}</div>
                </div>
                {!activity?.assets?.large_image && <div className={NowPlayingClasses.playTime}>
                    <TimeClock timestamp={ activity?.timestamps?.start || activity.created_at } />
                </div>}
            </>
        )
        case "RICH": return (
            <>
                <div 
                    className={`${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}
                    onClick={() => {switch(activityProperties?.platform) {
                        case "SPOTIFY": case "YT_MUSIC": return Common.OpenTrack(activity)
                        case "CRUNCHYROLL": return ReactUtils.wrapInHooks(Common.OpenLink)({user, currentUser: UserStore.getCurrentUser(), activity})()
                    }}}
                    onMouseOver={(e) => ["SPOTIFY", "CRUNCHYROLL", "YT_MUSIC"].includes(activityProperties?.platform) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                    onMouseLeave={(e) => ["SPOTIFY", "CRUNCHYROLL", "YT_MUSIC"].includes(activityProperties?.platform) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                    >{activity.details || activity?.state}
                </div>
                {activity?.details && <div 
                    className={`${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}
                    onClick={() => activityProperties?.platform === "SPOTIFY" && Common.OpenArtist(activity, user.id, 0)}
                    onMouseOver={(e) => activityProperties?.platform === "SPOTIFY" && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                    onMouseLeave={(e) => activityProperties?.platform === "SPOTIFY" && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                    >{activity?.state}
                </div>}
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
                {activity.state && <div className={NowPlayingClasses.streamGame}>{Common.intl.intl.formatToPlainString(Common.intl.t['IGYgjl'], {gameName: activity.state})}</div>}
            </>
        )
        case "VOICE": return (
            <>
                <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}`}>{server?.name || channel?.name || streamUser?.globalName}</div>
                {server && <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}`}>{channel?.name}</div>}
            </>
        )
        case "STREAM": return (
            <>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}`}>{streamUser.globalName || streamUser.username}</div>
                    <Common.LiveBadge style={{ marginLeft: "5px" }} />
                </div>
               <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}`}>{
                    activity ? Common.intl.intl.format(Common.intl.t['0wJXSh'], {name: <strong>{stream.name}</strong>}) 
                    : Common.intl.intl.formatToPlainString(Common.intl.t['KDdjou'])
                }</div>
            </>
        )
        case "LAST_PLAYED": return (
            <>
                <DiscordTag user={streamUser} />
                <div className={NowPlayingClasses.playTime}>
                    {
                        activity.endedAt ? <InactiveTimeClock timestamp={ activity?.endedAt } />
                        : Common.intl.intl.formatToPlainString(Common.intl.t['3elwAB'])
                    }
                </div>
            </>
        )
    }
}

export function FlexInfo(props) {
    const { className, style, onClick } = props

    return (
        <div className={className} style={style} onClick={onClick}>
            <ActivityType {...props} />
        </div>
    )
}