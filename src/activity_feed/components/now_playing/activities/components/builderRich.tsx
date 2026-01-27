import { Common } from "@modules/common";
import { RichImageAsset } from "./common/ActivityAssets";
import { FlexInfo } from "./common/FlexInfo";
import { CardButtons } from "./common/CardButtons";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

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
                    <CardButtons activity={activity} user={user} v2Enabled={v2Enabled} />
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