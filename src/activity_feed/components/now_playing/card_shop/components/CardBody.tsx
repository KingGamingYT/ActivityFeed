import { Common } from "@./modules/common";
import { ActivityCardWrapper, VoiceCard, TwitchCard } from "@now_playing/activities/index";

import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function CardBody({activities, user, voice, streams, check, isSpotify, v2Enabled}) {
    return (
        <div className={NowPlayingClasses.cardBody}>
            <div className={NowPlayingClasses.section}>
                <div className={NowPlayingClasses.game}>
                    <div className={`${NowPlayingClasses.gameBody} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`} style={{ flex: "1 1 auto" }}>
                        <VoiceCard activities={activities} voice={voice} streams={streams} />
                        {(() => {
                            switch(true) {
                                case !! check?.streaming: return <TwitchCard user={user} activity={activities[0]} />
                                default: return <ActivityCardWrapper user={user} activities={activities} voice={voice} streams={streams} check={check} v2Enabled={v2Enabled} />
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}