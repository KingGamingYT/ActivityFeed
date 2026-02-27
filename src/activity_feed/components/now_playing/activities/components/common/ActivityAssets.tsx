import { useState } from 'react';
import { Common } from "@modules/common";
import Tooltip from '@activity_feed/components/common/components/TooltipBuilder';
import NowPlayingClasses from '@now_playing/NowPlaying.module.css';
interface RichImageAsset {
    url: string | (() => string),
    tooltipText: string,
    onClick?: React.MouseEventHandler<HTMLImageElement>,
    type: "Large" | "Small"
}

export function XboxImageAsset({url}) {
    return (
        <img 
            className={`${NowPlayingClasses.gameIcon}`} 
            style={{ width: "60px", height: "60px", pointerEvents: "none" }}
            src={url}
        />
    )
}

export function FallbackAsset(props) {
    const { className, style, transform } = props;
    return (
        <svg className={className} style={style}>
            <path
                style={{ transform: transform }}
                fill="white" 
                fillRule="evenodd"
                d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
            />
        </svg> 
    )
}

export function SpotifyAsset({activity, user}) {
    const [shouldFallback, setShouldFallback] = useState(false);

    return (
        <>
            { shouldFallback ? ( <FallbackAsset className={NowPlayingClasses.smallEmptyIcon} style={{ width: "40px", height: "40px" }} transform="scale(1.65)" /> ) :
                <svg 
                    className={NowPlayingClasses.gameIcon} 
                    role="image" 
                    width="40" 
                    height="40" 
                    viewBox="0 0 16 16" 
                    onClick={() => Common.openSpotifyAlbumFromStatus(activity, user.id)}
                    onError={() => (setShouldFallback(true))}>
                    <g fill="none" fillRule="evenodd">
                        <path 
                            fill="var(--spotify)"
                            d="M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
                        />
                        <rect width="16" height="16" />
                    </g>
                </svg>
            }
        </>
    )
}

export function GameIconAsset({url, id, name}) {
    const [shouldFallback, setShouldFallback] = useState(false);
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: id});

    return (
        <>
            { shouldFallback ? ( <FallbackAsset className={NowPlayingClasses.gameIcon} style={{ width: "40px", height: "40px" }} transform="scale(1.65)" /> ) :
                <img 
                    className={NowPlayingClasses.gameIcon}
                    style={{ width: "40px", height: "40px" }}
                    aria-label={Common.intl.intl.formatToPlainString(Common.intl.t['nh+jWk'], {game: name})}
                    src={url}
                    onClick={useGameProfile}
                    onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableIcon}`)}
                    onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableIcon}`)}
                    onError={() => (setShouldFallback(true))}
                ></img>
            }
        </> 
    )
}

export function RichImageAsset({url, tooltipText, onClick, type}: RichImageAsset) {
    const [shouldFallback, setShouldFallback] = useState(false);

    return (
        <Tooltip note={tooltipText}>
            { shouldFallback ? ( <FallbackAsset className={`${NowPlayingClasses[`assets${type}Image`]} ${NowPlayingClasses[`assets${type}ImageActivityFeed`]}`} transform={type === "Large" ? "scale(3.65)" : "scale(1.30)"} /> ) :
                <img 
                    className={`${NowPlayingClasses[`assets${type}Image`]} ${NowPlayingClasses[`assets${type}ImageActivityFeed`]}`}
                    aria-label={tooltipText}
                    alt={tooltipText}
                    src={`${url}`}
                    onClick={onClick}
                    onError={() => (setShouldFallback(true))}
                ></img>
            }
        </Tooltip> 
    )
}

export function TwitchImageAsset({url, imageId, streamUrl}) {
    return (
        <a
            className={`${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover} ${NowPlayingClasses.twitchBackgroundImage}`}
            href={streamUrl}
            rel="noreferrer nopener"
            target="_blank"
            >
                { !imageId ? ( <FallbackAsset className={`${NowPlayingClasses.assetsLargeImageActivityFeedTwitch} ${NowPlayingClasses.assetsLargeImage}`} transform="scale(1.65)"/> ) :
                    <img 
                        className={`${NowPlayingClasses.assetsLargeImageActivityFeedTwitch} ${NowPlayingClasses.assetsLargeImage}`}
                        alt={null}
                        src={url}
                        onError={(e) => e.currentTarget.src = 'https://static-cdn.jtvnw.net/ttv-static/404_preview-900x500.jpg'}
                    ></img>
                }
        </a> 
    )
}   

export function VoiceGuildAsset({channel, server, streamUser}) {
    return (
        <>
            <img className={NowPlayingClasses.voiceSectionGuildImage} src=
                {(() => {
                    switch (true) {
                        case !! server: return `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=40`
                        case !! (channel && channel?.icon): return `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=40`
                        case !! streamUser: return `https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=40`
                    }
                })()} 
            />
            <div className={NowPlayingClasses.voiceSectionIconWrapper}>
                <svg className={NowPlayingClasses.voiceSectionIcon} width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" />
                </svg>
            </div>
        </>
    )
}