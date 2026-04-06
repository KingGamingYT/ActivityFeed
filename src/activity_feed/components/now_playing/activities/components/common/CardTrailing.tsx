import { useWindowSize } from "@common/methods/common";
import { Common } from "@modules/common";
import AvatarWithPopoutWrapper from "./AvatarWithPopoutWrapper";
import Tooltip from "@activity_feed/common/components/TooltipBuilder";
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
    players?: Object,
    v2Enabled?: boolean
}

function PartyMemberListBuilder({activity, users}) {
    const emptyNum = activity?.party?.size[1] - activity?.party?.size[0];
    const anonNum = activity?.party?.size[0] - 1;
    const anonUsers = [];
    const emptyUsers = [];
    for (let i = 0; i < (anonNum); i++ ) {
        anonUsers.push("anon");
        emptyUsers.push("anon");
    }
    for (let i = 0; i < (emptyNum); i++ ) {
        emptyUsers.push(null);
    }
    const totalCount = users.length + anonNum;
    const userOverflowCount = totalCount - 10;
    const playerFill = users.concat(emptyUsers);

    return (
        <div className={NowPlayingClasses.partyList}>
            {playerFill.splice(0, 10).map(player =>
                {
                    switch(player) {
                        case "anon": return <div className={NowPlayingClasses.emptyUser}>
                            <svg width="10" height="10">
                                <path fill="rgba(255, 255, 255, 0.7)" d="M4.99967 4.16671C5.4417 4.16671 5.86563 3.99111 6.17819 3.67855C6.49075 3.36599 6.66634 2.94207 6.66634 2.50004C6.66634 2.05801 6.49075 1.63409 6.17819 1.32153C5.86563 1.00897 5.4417 0.833374 4.99967 0.833374C4.55765 0.833374 4.13372 1.00897 3.82116 1.32153C3.5086 1.63409 3.33301 2.05801 3.33301 2.50004C3.33301 2.94207 3.5086 3.36599 3.82116 3.67855C4.13372 3.99111 4.55765 4.16671 4.99967 4.16671ZM4.80384 4.58337C3.75071 4.58337 2.74071 5.00173 1.99604 5.7464C1.25136 6.49108 0.833008 7.50108 0.833008 8.55421C0.833008 8.89171 1.10801 9.16671 1.44551 9.16671H1.53717C1.63717 9.16671 1.72051 9.09587 1.74551 9.00004C1.86634 8.53337 2.09551 8.09587 2.29551 7.78754C2.35384 7.70004 2.47467 7.74587 2.46217 7.85004L2.35384 8.93754C2.34551 9.06254 2.43717 9.16671 2.56217 9.16671H7.43717C7.46638 9.16685 7.49529 9.16086 7.52202 9.14911C7.54876 9.13736 7.57273 9.12013 7.59237 9.09852C7.61202 9.07691 7.6269 9.05141 7.63605 9.02368C7.64521 8.99595 7.64843 8.9666 7.64551 8.93754L7.53301 7.85421C7.52467 7.74587 7.64551 7.70004 7.70384 7.78754C7.90384 8.09587 8.13301 8.53754 8.25384 8.99587C8.27884 9.09587 8.36217 9.16671 8.46217 9.16671H8.55384C8.89134 9.16671 9.16634 8.89171 9.16634 8.55421C9.16634 7.50108 8.74799 6.49108 8.00331 5.7464C7.25863 5.00173 6.24864 4.58337 5.19551 4.58337H4.80384Z" />
                            </svg>
                        </div>
                        case null: return <div className={NowPlayingClasses.emptyUser} />
                        default: return <Tooltip note={player.globalName || player.username}>
                            <div>
                                <AvatarWithPopoutWrapper 
                                    className={NowPlayingClasses.player} 
                                    user={player} 
                                    size="SIZE_16" 
                                />
                            </div>
                        </Tooltip>
                    }
                }
            )}
            {totalCount > 10 && <div className={`${NowPlayingClasses.emptyUser} ${NowPlayingClasses.userOverflow}`} style={{ width: (userOverflowCount > 9) ? "22px" : "19px", borderRadius: (userOverflowCount > 9) && "16px" }}>{`+${userOverflowCount}`}</div>}
        </div>
    )
}

export function RegularCardTrailing({activity, user, server, players, check, v2Enabled}: RegularButtons) {
    const [width, height] = useWindowSize();

    if (width <= 1240 && width >= 1200) return;

    return (
        <>
            {server && <Common.VoiceList
                className={`${NowPlayingClasses.userList}`}
                users={players}
                maxUsers={players.length}
                guildId={server?.id}
                size="SIZE_32"
            />}
            {check?.spotify !== 0 && <div className={`${NowPlayingClasses.serviceButtonWrapper}`}>
                <Common.SpotifyButtons user={user} activity={activity} />
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
            {(width <= 1240 && width >= 1200) && !activity?.name.includes("YouTube Music") && <div 
                className={`${MainClasses.button} ${NowPlayingClasses.actionsActivity} ${Common.ButtonVoidClasses.lookFilled} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                style={{ flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}>
                {v2Enabled && activity?.party && activity?.party?.size ? null : <Common.ActivityButtons user={user} activity={activity} />}
            </div>}
        </>
    )
}

export function VoiceCardTrailing({members, server, channel}) {
    const [width, height] = useWindowSize();
    
    if (width <= 1240 && width >= 1200) return;
    return (
        <>
            <Common.VoiceList 
                className={NowPlayingClasses.userList} 
                users={members} 
                maxUsers={(width >= 1420 || width < 1200) ? 5 : width >= 1380 ? 4 : width >= 1300 ? 3 : 2} 
                guildId={server?.id}
                channelId={channel.id}
                size="SIZE_32"
            />
            <Common.CallButtons channel={channel} />
        </>
    )

}

export function PartyFooter({party, players, user, activity}) {
    return (
        <>
            <div className={MainClasses.sectionDivider} style={{ margin: "8px 0 8px 0" }} />
            <div className={NowPlayingClasses.partyStatusWrapper}>
                <PartyMemberListBuilder activity={activity} users={players} />
                <div 
                    className={NowPlayingClasses.partyPlayerCount} 
                    style={{ flex: "1 1 100%" }}>
                    {Common.intl.intl.formatToPlainString(Common.intl.t['gLu7NU'], { partySize: party.size[0], maxPartySize: party.size[1]})}
                </div>
                <Common.JoinButton user={user} activity={activity} />
            </div>
        </>
    )
}