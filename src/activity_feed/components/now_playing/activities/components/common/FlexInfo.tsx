import { Common } from '@modules/common';
import { GuildStore, useStateFromStores } from '@modules/stores';
import { TimeClock, InactiveTimeClock } from '@common/methods/common';
import DiscordTag from "./DiscordTag";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function ActivityType({ type, activity, game, channel, server, stream, streamUser }) {
    const guildChannel = useStateFromStores([ GuildStore ], () => GuildStore.getGuild(channel?.guild_id));
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: game?.id});
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
                <div className={`${NowPlayingClasses.details} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}>{activity.details || activity?.state}</div>
                {activity?.details && <div className={`${NowPlayingClasses.state} ${NowPlayingClasses.textRow} ${NowPlayingClasses.ellipsis}`}>{activity?.state}</div>}
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
    const { className, style, onClick, activity, game, channel, stream, streamUser, server, type } = props

    return (
        <div className={className} style={style} onClick={onClick}>
            <ActivityType  
                activity={activity} 
                game={game} 
                channel={channel} 
                stream={stream} 
                streamUser={streamUser}
                server={server} 
                type={type} 
            />
        </div>
    )
}