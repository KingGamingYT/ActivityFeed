import { Common, ContextMenus } from "@modules/common";
import { ChannelStore, UserStore, VoiceStateStore } from "@modules/stores";
import { StreamCard } from "./CardStream";
import { FlexInfo } from "./common/FlexInfo";
import { VoiceGuildAsset } from "./common/ActivityAssets";
import { VoiceCardTrailing } from "./common/CardTrailing";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function getVoiceParticipants({voice}) {
    let participants = [];
    const channelParticipants = Object.keys(VoiceStateStore.getVoiceStatesForChannel(voice));
    for (let i = 0; i < channelParticipants.length; i++) {
        participants.push(UserStore.getUser(channelParticipants[i]))
    }
    return participants;
}

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
                <div className={NowPlayingClasses.voiceSection} onContextMenu={e => {let Menus = ContextMenus(); return Menus.ContextMenuActivityFeed(e, channel)}}>
                    <div className={NowPlayingClasses.voiceSectionAssets}>
                        <VoiceGuildAsset channel={channel} streamUser={streamUsers[0]} server={server} />
                    </div>
                    <FlexInfo 
                        className={`${NowPlayingClasses.details} ${NowPlayingClasses.voiceSectionDetails}`} 
                        onClick={() => Common.SelectedChannelActionCreators.selectVoiceChannel(channel.id)} 
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
                            <StreamCard stream={streamsInfo[index]} streamUser={streamUsers[index]} streamActivity={stream?.activity} key={`stream-${streamUsers[index].id}`} />
                        </>
                    )
                }
                {activities.length ? <div className={MainClasses.sectionDivider} /> : null}
            </>
    )
}