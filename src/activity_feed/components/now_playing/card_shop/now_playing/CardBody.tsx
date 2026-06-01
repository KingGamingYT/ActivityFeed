import { Common } from "@modules/common";
import { ActivityCardWrapper, VoiceCard, TwitchCard } from "@now_playing/activities/index";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function NowPlayingCardBody({activities, user, voice, streams, v2Enabled}) {
    const twitchActivity = activities.find(entry => entry.activity?.type == 1) || streams.find(entry => entry.activity?.type == 1);

    return (
        <div className={NowPlayingClasses.cardBody}>
            <div className={NowPlayingClasses.section}>
                <div className={NowPlayingClasses.game}>
                    <Common.Flex className={NowPlayingClasses.gameBody}>
                        {voice && <VoiceCard activities={activities} voice={voice} streams={streams} key={`voice-${voice[0]?.guild?.id || voice[0]?.channel?.id}`} />}
                        {twitchActivity && <TwitchCard user={user} activity={twitchActivity} key={`twitch-${user.id}`} />}
                        {activities && <ActivityCardWrapper user={user} activities={activities} voice={voice} streams={streams} v2Enabled={v2Enabled} />}
                    </Common.Flex>
                </div>
            </div>
        </div>
    )
}