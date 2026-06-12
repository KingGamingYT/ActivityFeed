import { ReactUtils } from "betterdiscord";
import { Common } from "@modules/common";
import { UserStore, useStateFromStores } from "@modules/stores";
import { FlexInfo } from "./common/FlexInfo";
import { RichCardTrailing, RegularCardTrailing } from "./common/CardTrailing";
import { RichImageAsset, SpotifyAsset, GameIconAsset, XboxImageAsset, TwitchImageAsset } from "./common/ActivityAssets";
import { handleApplicationClick } from "./common/ActivityButtons";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function RegularActivityBuilder({activity, activityProperties, user, game, players, server, v2Enabled}) {
    const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
    const isTwitch = ["TWITCH", "YOUTUBE"].includes(activityProperties.platform);

    return (
        <Common.Flex align={Common.Flex.Align.CENTER} className={NowPlayingClasses.activity}>
            {(() => {
                switch (activityProperties.platform) {
                    case "SPOTIFY": return <SpotifyAsset activity={activity} user={user} />
                    case "XBOX": return <XboxImageAsset url={'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'}/>
                    case "TWITCH": case "YOUTUBE": return <GameIconAsset 
                        url={activity.name.toLowerCase().includes("youtube") ? `https://discord.com/assets/0fa530ba9c04ac32.svg` : `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`} 
                        id={activity?.application_id} 
                        name={activity?.name} 
                    />
                    default: return <GameIconAsset 
                        url={game?.getIconURL(64, 'webp')} 
                        id={activity?.application_id} 
                        name={game?.name} 
                        onClick={handleApplicationClick({user, currentUser, activity, application: game})}
                    />
                }
            })()}
            <FlexInfo className={NowPlayingClasses.gameInfo} user={user} activity={activity} game={game} type={isTwitch ? "TWITCH" : "REGULAR"} />
            <RegularCardTrailing activity={activity} user={user} server={server} players={players} v2Enabled={v2Enabled} />
        </Common.Flex>
    )
}

export function RichActivityBuilder({user, activity, activityProperties, v2Enabled}) {
    const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
    return (
        <Common.Flex className={NowPlayingClasses.richActivity}>
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
                                case "CRUNCHYROLL": return handleApplicationClick({user, currentUser, activity})()
                            }}}
                            onMouseOver={(e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableIcon}`)}
                            onMouseLeave={(e) => ["SPOTIFY", "CRUNCHYROLL"].includes(activityProperties?.platform) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableIcon}`)}
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
        </Common.Flex>
    )
}

export function RichTwitchActivityBuilder({activity}) {
    return (
        <Common.Flex className={NowPlayingClasses.richActivity}>
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
        </Common.Flex>
    )
}