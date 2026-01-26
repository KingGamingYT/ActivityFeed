import { Common } from '@modules/common';
import Tooltip from '@activity_feed/TooltipBuilder';
import NowPlayingClasses from '@now_playing/NowPlaying.module.css';

export function RichActivityBuilder({user, activity, v2Enabled}) {
	<div className={`${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignStretch} ${Common.PositionClasses.flex} ${NowPlayingClasses.richActivity}`} style={{ flex: "1 1 auto" }}>
		<div className={`${NowPlayingClasses.activityActivityFeed} ${NowPlayingClasses.activityFeed}`}>
			<div className={`${NowPlayingClasses.bodyNormal} ${NowPlayingCLasses.body} ${Common.PositionClasses.flex}`}>
				<div className={`${NowPlayingClasses.assets}`}
			</div>
		</div>
	</div>
}

function RichActivityBuilder({user, activity, v2Enabled}) {
    const [width, height] = useWindowSize();
    const [shouldLargeFallback, setShouldLargeFallback] = useState(false);
    const [shouldSmallFallback, setShouldSmallFallback] = useState(false);

    return (
        createElement('div', { 
            className: `${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignStretch} ${positionClasses.flex} richActivity_267ac`, style: { flex: "1 1 auto" } }, [
            createElement('div', { className: "activityActivityFeed_267ac activityFeed_267ac" },
                createElement('div', { className: `bodyNormal_267ac body_267ac ${positionClasses.flex}`}, [
                    createElement('div', { className: "assets_267ac" }, [
                            createElement(TooltipBuilder, { note: activity.assets.large_text || activity?.details },
                                shouldLargeFallback ? createElement(FallbackAsset, { className: "largeEmptyIcon_267ac" })
                                : createElement('img', { 
                                    className: "assetsLargeImageActivityFeed_267ac assetsLargeImage_267ac",
                                    "aria-label": activity.assets.large_text,
                                    alt: activity.assets.large_text,
                                    src: activity?.assets?.large_image?.includes('spotify') ? `https://i.scdn.co/image/${activity.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}` 
                                    : activity?.assets?.large_image?.includes('external') ? `https://media.discordapp.net/external${activity.assets.large_image?.substring(activity.assets.large_image.indexOf('/'))}`
                                    :  `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`,
                                    onError: () => { setShouldLargeFallback(true) }
                                })
                            ),
                            activity?.assets && activity?.assets.small_image && createElement(TooltipBuilder, { note: activity.assets.small_text || activity?.details }, 
                                shouldSmallFallback ? createElement(FallbackAsset, { className: "smallEmptyIcon_267ac" }) 
                                : createElement('img', {
                                    className: "assetsSmallImageActivityFeed_267ac assetsSmallImage_267ac",
                                    "aria-label": activity.assets.small_text,
                                    alt: activity.assets.small_text,
                                    src: activity?.assets?.small_image?.includes('external') ? `https://media.discordapp.net/external${activity.assets.small_image?.substring(activity.assets.small_image.indexOf('/'))}`
                                    :   `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`,
                                    onError: () => { setShouldSmallFallback(true) }
                                })
                            )
                        ]
                    ),
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