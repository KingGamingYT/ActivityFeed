import { Common } from "@modules/common";
import { RichImageAsset } from "./common/ActivityAssets";
import { FlexInfo } from "./common/FlexInfo";
import { RichCardTrailing, RegularCardTrailing } from "./common/CardTrailing";
import { FallbackAsset, SpotifyAsset, GameIconAsset, XboxImageAsset } from "./common/index";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function RegularActivityBuilder({activity, user, game, players, server, check, v2Enabled}) {

    return (
        <div className={`${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter} ${Common.PositionClasses.flex} ${NowPlayingClasses.activity}`} style={{ flex: "1 1 auto" }}>
            {() => {
                switch (true) {
                    case !! check.spotify: return <SpotifyAsset activity={activity} user={user} />
                    case !! activity?.platform?.includes('xbox'): return <XboxImageAsset  url={'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'}/>
                    default: return <GameIconAsset url={game?.id && `https://cdn.discordapp.com/app-icons/${game?.id}/${game.icon}.webp?size=64&keep_aspect_ratio=false`} id={activity?.application_id} name={game?.name} />
                }
            }}
        </div>
    )
}

/*
function RegularActivityBuilder({user, activity, game, players, server, check, v2Enabled}) {
    const [width, height] = useWindowSize();
    const [shouldGameFallback, setShouldGameFallback] = useState(false);
    const gameId = activity?.application_id;
    const useGameProfile = GameProfileCheck({trackEntryPointImpression: false, applicationId: gameId});

    return (
        createElement('div', { 
            className: `${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignCenter} ${positionClasses.flex} activity_267ac`, style: { flex: "1 1 auto" } }, [
            shouldGameFallback ? createElement(FallbackAsset, { className: "smallEmptyIcon_267ac" })
            : check.spotify ? 
                createElement('svg', { 
                    className: "gameIcon_267ac", 
                    "aria-hidden": true, 
                    role: "image", 
                    width: 16, 
                    height: 16, 
                    viewBox: "0 0 16 16",
                    onClick: () => openSpotifyAlbumFromStatus(activity, user.id) },
                    createElement('g', { fill: "none", fillRule: "evenodd"}, [
                        createElement('path', { 
                            fill: "var(--spotify)",
                            d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
                        }),
                        createElement('rect', { width: 16, height: 16 })
                    ])
                )
            : activity?.platform?.includes('xbox') ? 
                createElement('img', {
                    className: "gameIcon_267ac",
                    style: { width: "60px", height: "60px", pointerEvents: "none" },
                    src: 'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'
                })
            : createElement('img', { 
                className: "gameIcon_267ac",
                src: game?.id && `https://cdn.discordapp.com/app-icons/${game?.id}/${game.icon}.webp?size=64&keep_aspect_ratio=false`,
                style: { pointerEvents: !useGameProfile && "none" },
                onError: () => { setShouldGameFallback(true) },
                onClick: useGameProfile
            }),
            createElement('div', { className: "gameInfo_267ac" }, [
                createElement('div', { className: "gameNameWrapper_267ac" }, 
                    createElement('div', { className: "gameName_267ac" }, game?.name)
                ),
                !activity?.assets?.large_image && createElement('div', { className: "playTime_267ac" }, 
                    createElement(TimeClock, { timestamp: activity.created_at })
                )
            ]),
            width > 1240 && ([
                server && createElement(VoiceList, {
                    className: "userList_267ac",
                    users: players,
                    maxUsers: players.length,
                    guildId: server?.id,
                    size: "SIZE_32"
                }),
                check.spotify !== 0 && createElement('div', { className: "serviceButtonWrapper_267ac" }, 
                    createElement(SpotifyButtons, { user: user, activity: activity }) 
                ),
                (!activity?.name.includes("YouTube Music") && activity?.assets) ? null : createElement('div', {
                    className: `button_267ac actionsActivity_267ac ${buttonClasses.lookFilled} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                    style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}, 
                    v2Enabled && activity?.party && activity?.party?.size ? null : createElement(ActivityButtons, {user: user, activity: activity})
                )
            ])
        ])
    )
}
*/

export function RichActivityBuilder({user, activity, v2Enabled}) {
    return (
        <div className={`${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignStretch} ${Common.PositionClasses.flex} ${NowPlayingClasses.richActivity}`} style={{ flex: "1 1 auto" }}>
            <div className={`${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}`}>
                <div className={`${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common.PositionClasses.flex}`}>
                    <div className={`${NowPlayingClasses.assets}`} >
                        <RichImageAsset
                            url={() => {
                                switch (true) {
                                    case !! activity?.assets?.large_image?.includes('spotify'): return `https://i.scdn.co/image/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`;
                                    case !! activity?.assets?.large_image?.includes('external'): return `https://media.discordapp.net/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`;
                                    default: return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                                }
                            }}
                            tooltipText={activity.assets.large_text}
                            type="Large"
                        />
                        {activity?.assets && activity?.assets.small_image && <RichImageAsset
                            url={
                                activity?.assets?.small_image?.includes('external') ? `https://media.discordapp.net/${activity.assets.small_image?.substring(activity.assets.small_image.indexOf(':')+1)}`
                                : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
                            }
                            tooltipText={activity.assets.small_text}
                            type="Small"
                        />}
                    </div>
                    <FlexInfo className={`${NowPlayingClasses.contentImagesActivityFeed} ${NowPlayingClasses.content}`} activity={activity} />
                    <RichCardTrailing activity={activity} user={user} v2Enabled={v2Enabled} />
                </div>
            </div>
        </div>
    )
}

function nRichActivityBuilder({user, activity, v2Enabled}) {
    const [width, height] = useWindowSize();
    const [shouldLargeFallback, setShouldLargeFallback] = useState(false);
    const [shouldSmallFallback, setShouldSmallFallback] = useState(false);

    return (

                    createElement('div', { className: "contentImagesActivityFeed_267ac content_267ac" }, [
                        createElement('div', { className: "details_267ac ellipsis_267ac textRow_267ac"}, activity?.details ? activity?.details : activity?.state),
                        activity?.details && createElement('div', { className: "state_267ac ellipsis_267ac textRow_267ac"}, activity?.state),
                        activity?.timestamps?.start && activity?.timestamps?.end ? createElement(MediaProgressBar, { start: activity?.timestamps?.start, end: activity?.timestamps?.end }) 
                        : createElement(ActivityTimer, { activity: activity })
                    ]),
                    (width > 1240 && !activity?.name.includes("YouTube Music")) && createElement('div', {
                        className: `button_267ac actionsActivity_267ac ${ButtonVoidClasses.lookFilled} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                        style: { flex: "0 1 auto", flexDirection: "column", alignItems: "flex-end", marginLeft: "20px" }}, 
                        v2Enabled && activity?.party && activity?.party?.size ? null : createElement(ActivityButtons, {user: user, activity: activity})
                    )
                ])
            )
        ])
    )
}