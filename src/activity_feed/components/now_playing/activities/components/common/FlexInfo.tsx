import { Common } from '@modules/common';
import { GuildStore, useStateFromStores } from '@modules/stores';
import { activityCheck, TimeClock } from '@common/methods/common';
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

/*function Header({ activity, channel, type }) {
    const guildChannel = useStateFromStores([ GuildStore ], () => GuildStore.getGuild(channel?.guild_id));
    if (channel) {
        const nickname = useStateFromStores([ RelationshipStore ], () => RelationshipStore.getNickname(guildChannel?.ownerId || channel.getRecipientId()))
        return (
            <h3 className="textRow" style={{ display: "flex", alignItems: "center" }}>
                {Common.VoiceIcon({ channel: channel })}
                <h3 className="nameWrap nameNormal textRow" style={{ fontWeight: "600" }}>{channel.name || nickname}</h3>
            </h3>
        )
    }
    if (!activity) return;
    let result = activity.name;
    if ([1, 2, 3].includes(activity?.type)) result = activity.details;
    return (
        <div className="nameNormal textRow ellipsis" style={{ fontWeight: "600" }}>{result}</div>
    )
}*/

function ActivityType({ type, activity, game, channel, server, stream, streamUser }) {
    const guildChannel = useStateFromStores([ GuildStore ], () => GuildStore.getGuild(channel?.guild_id));
    switch (type) {
        case "REGULAR": return (
            <>
                <div className={NowPlayingClasses.gameNameWrapper}>
                    <div className={NowPlayingClasses.gameName}>{game?.name}</div>
                </div>
                {!activity?.assets?.large_image && <div className={NowPlayingClasses.playTime}>
                    <TimeClock timestamp={ activity.created_at } />
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
            <>
                {activity.state && <div className="state textRow ellipsis">{`${Common.intl.intl.formatToPlainString(Common.intl.t[`BMTj28`])} ${activity.state}`}</div>}
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
                <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}`}>{Common.intl.intl.format(Common.intl.t['0wJXSh'],  {name: <strong>{stream.name}</strong>})}</div>
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