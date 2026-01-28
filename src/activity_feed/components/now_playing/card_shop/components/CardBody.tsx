import { activityCheck } from "@common/modules/common";
import { Common } from "@./modules/common";

import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function CardBody({activities, user, voice, streams, check, v2Enabled}) {
    return (
        <div className={NowPlayingClasses.cardBody}>
            <div className={NowPlayingClasses.section}>
                <div className={NowPlayingClasses.game}>
                    <div className={`${NowPlayingClasses.gameBody} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`} style={{ flex: "1 1 auto" }}>
                        <VoiceCard activities={activities} voice={voice} streams={streams} />
                        {(() => {
                            switch(true) {
                                case !! filterCheck.streaming: <TwitchCard user={user} activity={activites[0]} />; break;
                                case !! isSpotify: <SpotifyCard user={user} activities={activites} />; break;
                                default: <ActivityCardWrapper user={user} activities={activites} voice={voice} streams={streams} check={filterCheck} v2Enabled={v2Enabled} />
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}

/*createElement('div', { className: "cardBody_267ac" },
            createElement('div', { className: "section_267ac" },
                createElement('div', { className: "game_267ac" },
                    createElement('div', { className: `gameBody_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, style: { flex: "1 1 auto" } }, [
                        //!streams.length ? createElement(VoiceCards, { activities: activities, voice: voice, streams: streams }) : createElement(StreamCards, { user: user, voice: voice, streams: streams }),
                        createElement(VoiceCards, { activities: activities, voice: voice, streams: streams }),
                        filterCheck.streaming ? createElement(TwitchCards, { user: user, activity: activities[0] }) : createElement(ActivityCards, { user: user, activities: activities, voice: voice, streams: streams, check: filterCheck, v2Enabled: v2Enabled })
                    ])
                )
            )
        )
*/