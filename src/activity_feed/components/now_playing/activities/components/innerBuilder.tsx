import { ReactUtils } from "betterdiscord";
import { Common } from "@modules/common";
import { UserStore } from "@modules/stores";
import { FlexInfo } from "./common/FlexInfo";
import { RichCardTrailing, RegularCardTrailing } from "./common/CardTrailing";
import { RichImageAsset, SpotifyAsset, GameIconAsset, XboxImageAsset, TwitchImageAsset } from "./common/ActivityAssets";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import PresenceTypeStore from "../../PresenceTypeStore";

export function RegularActivityBuilder({activity, user, game, players, server, check, v2Enabled}) {
    return (
        <div className={`${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter} ${Common.PositionClasses.flex} ${NowPlayingClasses.activity}`} style={{ flex: "1 1 auto" }}>
            {(() => {
                switch (true) {
                    case !! check?.spotify: return <SpotifyAsset activity={activity} user={user} />
                    case !! activity?.platform?.includes('xbox'): return <XboxImageAsset url={'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'}/>
                    default: return <GameIconAsset url={`https://cdn.discordapp.com/app-icons/${game?.id}/${game.icon}.webp?size=64&keep_aspect_ratio=false`} id={activity?.application_id} name={game?.name} />
                }
            })()}
            <FlexInfo className={NowPlayingClasses.gameInfo} activity={activity} game={game} type="REGULAR" />
            <RegularCardTrailing activity={activity} user={user} server={server} players={players} check={check} v2Enabled={v2Enabled} />
        </div>
    )
}

export function RegularTwitchActivityBuilder({user, activity, game}) {
    return (
        <div className={`${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter} ${Common.PositionClasses.flex} ${NowPlayingClasses.twitchActivity}`} style={{ flex: "1 1 auto" }}>
            <GameIconAsset url={ activity.name.toLowerCase().includes("youtube") ? `https://discord.com/assets/0fa530ba9c04ac32.svg` : `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`} id={activity?.application_id} name={game?.name} />
            <FlexInfo className={`${NowPlayingClasses.gameInfoRich} ${NowPlayingClasses.gameInfo}`} activity={activity} game={game} type="TWITCH" />
            <RichCardTrailing activity={activity} user={user} />
        </div>
    )
}

export function RichActivityBuilder({user, activity, v2Enabled}) {
    const activityProperties = PresenceTypeStore.getActivityProperties(activity);

    return (
        <div className={`${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignStretch} ${Common.PositionClasses.flex} ${NowPlayingClasses.richActivity}`} style={{ flex: "1 1 auto" }}>
            <div className={`${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}`}>
                <div className={`${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common.PositionClasses.flex}`}>
                    <div className={`${NowPlayingClasses.assets}`} >
                        <RichImageAsset
                            url={(() => {
                                switch (true) {
                                    case !! activity?.assets?.large_image?.includes('spotify'): return `https://i.scdn.co/image/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`;
                                    case !! activity?.assets?.large_image?.includes('external'): return `https://media.discordapp.net/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`;
                                    default: return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                                }
                            })()}
                            tooltipText={activity.assets.large_text}
                            onClick={() => {switch(activityProperties?.platform) {
                                case "SPOTIFY": case "YT_MUSIC": return Common.OpenTrack(activity)
                                case "CRUNCHYROLL": return ReactUtils.wrapInHooks(Common.OpenLink)({user, currentUser: UserStore.getCurrentUser(), activity})()
                            }}}
                            onMouseOver={(e) => ["SPOTIFY", "CRUNCHYROLL", "YT_MUSIC"].includes(activityProperties?.platform) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableIcon}`)}
                            onMouseLeave={(e) => ["SPOTIFY", "CRUNCHYROLL", "YT_MUSIC"].includes(activityProperties?.platform) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableIcon}`)}
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
                    <FlexInfo className={`${NowPlayingClasses.contentImagesActivityFeed} ${NowPlayingClasses.content}`} activity={activity} user={user} type="RICH" />
                    <RichCardTrailing activity={activity} user={user} v2Enabled={v2Enabled} />
                </div>
            </div>
        </div>
    )
}

export function RichTwitchActivityBuilder({activity}) {
    return (
        <div className={`${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignStretch} ${Common.PositionClasses.flex} ${NowPlayingClasses.richActivity}`} style={{ flex: "1 1 auto" }}>
            <div className={`${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}`}>
                <div className={`${NowPlayingClasses.bodyNormal} ${NowPlayingClasses.body} ${Common.PositionClasses.flex}`}>
                    <div className={NowPlayingClasses.assets}>
                        <div className={NowPlayingClasses.twitchImageContainer}>
                            <FlexInfo className={NowPlayingClasses.twitchImageOverlay} activity={activity} type="TWITCH_OVERLAY" />
                            <TwitchImageAsset
                                url={
                                    activity.name.includes('YouTube') ? `https://i.ytimg.com/vi/${activity.assets?.large_image.substring(activity.assets?.large_image.indexOf(':')+1)}/hqdefault_live.jpg`
                                    : `https://static-cdn.jtvnw.net/previews-ttv/live_user_${activity.assets?.large_image.substring(activity.assets?.large_image.indexOf(':')+1)}-900x500.jpg`
                                }
                                imageId={activity.assets?.large_image}
                                streamUrl={activity.url}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}