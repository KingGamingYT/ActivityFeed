import { Common } from '@modules/common';
import { ChannelStore } from '@modules/stores';
import { StreamCard } from "./CardStream";
import { FlexInfo } from './common/FlexInfo';
import { VoiceGuildAsset } from "./common/ActivityAssets";
import { VoiceCardTrailing } from "./common/CardTrailing";
import { getVoiceParticipants } from '../methods/getVoiceParticipants';
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function VoiceCard({activities, voice, streams}) {
    if (!voice.length && !streams.length) return;

    const stream = streams[0]?.stream;
    const streamsInfo = streams.map(item => item.stream);
    const streamUsers = streams.map(item => item.streamUser);
    const channel = stream ? ChannelStore.getChannel(stream.channelId) : voice[0]?.channel;
    const members = stream ? getVoiceParticipants({voice: stream.channelId}) : voice[0]?.members;
    const server = voice[0]?.guild;

    return (
            <>
                <div className={NowPlayingClasses.voiceSection}>
                    <div className={NowPlayingClasses.voiceSectionAssets}>
                        <VoiceGuildAsset channel={channel} streamUser={streamUsers[0]} server={server} />
                    </div>
                    <FlexInfo 
                        className={`${NowPlayingClasses.details} ${NowPlayingClasses.voiceSectionDetails}`} 
                        onClick={() => Common.OpenVoiceChannel.selectVoiceChannel(channel.id)} 
                        channel={channel} 
                        streamUser={streamUsers[0]} 
                        server={server} 
                        type="VOICE" 
                    />
                    <VoiceCardTrailing members={members} server={server} channel={channel} />
                </div>
                {stream && streams.map((stream, index) =>
                        <>
                            <div className={MainClasses.sectionDivider} />
                            <StreamCard stream={streamsInfo[index]} streamUser={streamUsers[index]} streamActivity={streams[index]?.activity} />
                        </>
                    )
                }
                {activities.length ? <div className={MainClasses.sectionDivider} /> : null}
            </>
    )
}