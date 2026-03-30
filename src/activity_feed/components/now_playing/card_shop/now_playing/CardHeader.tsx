import { Utils } from "betterdiscord";
import { useState, useRef } from "react";
import { Common } from "@modules/common";
import Tooltip from "@common/components/TooltipBuilder";
import DiscordTag from "@now_playing/activities/components/common/DiscordTag";
import Splash from "@now_playing/activities/components/common/Splash";
import AvatarWithPopoutWrapper from "@now_playing/activities/components/common/AvatarWithPopoutWrapper";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function HeaderActions({card, user}) {
    const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);

    return (
        <div className={`${NowPlayingClasses.headerActions} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`} style={{ flex: "0" }} aria-expanded={showPopout}>
            <button type="button" className={`${MainClasses.button} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.lookFilled}`} onClick={() => Common.OpenDM.openPrivateChannel({recipientIds: user.id})}>Message</button>
            <Common.Popout
                targetElementRef={refDOM}
                clickTrap={true}
                onRequestClose={() => setShowPopout(false)}
                renderPopout={() => <Common.PopoutContainer position="left"><Common.CardPopout party={card.party} close={() => setShowPopout(false)} /></Common.PopoutContainer>}
                position="left"
                shouldShow={showPopout}>
                {(props) => <span
                    {...props}
                    ref={refDOM}
                    onClick={() => { setShowPopout(true) }}>
                    <Tooltip note={"More"}>
                        <button className={`${MainClasses.button} ${Common.ButtonVoidClasses.lookBlank} ${Common.ButtonVoidClasses.grow}`} type={"button"}>
                            <svg className={`${NowPlayingClasses.overflowMenu}`} role="img" width="16" height="16" viewBox="0 0 24 24">
                                <g fill="none" fillRule="evenodd">
                                    <path d="M24 0v24H0V0z" />
                                    <path d="M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z" fill="currentColor" />
                                </g>
                            </svg>
                        </button>
                    </Tooltip>
                </span>}
            </Common.Popout>
        </div>
    )
}

function HeaderIcon({activities, isSpotify, currentGame}) {
    return (
        <>{ 
            isSpotify ? <svg className={`${NowPlayingClasses.headerIcon}`} aria-hidden={true} role="image" width="16" height="16" viewBox="0 0 16 16">
                <g fill="none" fillRule="evenodd">
                    <path fill="var(--spotify)" d="M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z" />
                    <rect width="16" height="16" />
                </g>
            </svg>
            : activities.length !== 0 && <img className={`${NowPlayingClasses.headerIcon}`} alt="" src={`https://cdn.discordapp.com/app-icons/${currentGame?.id}/${currentGame?.icon}.png?size=64&keep_aspect_ratio=false`} />
        }</>
    )
}

export function NowPlayingCardHeader({card, activities, game, splash, user, voice, isSpotify}) {
    const status = card.party.priorityMembers[0].status;

    return (
        <div className={`${NowPlayingClasses.cardHeader} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`} style={{ flex: "1 1 auto"}}>
            <Splash splash={splash} className={Utils.className(NowPlayingClasses.splashArt, voice && activities.length === 0 && NowPlayingClasses.server)} />
            <div className={NowPlayingClasses.header}>
                <AvatarWithPopoutWrapper className="avatar" user={user} status={status} size="SIZE_40" />
                <DiscordTag user={user} voice={voice} />
                <HeaderActions card={card} user={user} />
                <HeaderIcon activities={activities} isSpotify={isSpotify} currentGame={game} />
            </div>
        </div>
    )
}