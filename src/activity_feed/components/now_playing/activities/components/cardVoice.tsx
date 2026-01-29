import { Common } from '@modules/common';
import { ChannelStore, useStateFromStores } from '@modules/stores';
import { FlexInfo } from './common/FlexInfo';
import { VoiceGuildAsset } from "./common/ActivityAssets";
import { getVoiceParticipants } from '../methods/getVoiceParticipants';
import NowPlayingClasses from "@now_playing/NowPlayingClasses.module.css";

export function nVoiceCard({voice, stream}) {
    const channel = useStateFromStores([ ChannelStore ], () => ChannelStore.getChannel(voice));
    return;
    if (stream || !channel) return;
    return (
        <div className="activityProfile activity">
            <div className="activityProfileContainerVoice">
                <div className="bodyNormal" style={{ display: "flex", alignItems: "center", width: "auto" }}>
                    <Common.VoiceBox users={getVoiceParticipants({voice})} channel={channel} themeType="MODAL" />
                    <FlexInfo className="contentImagesProfile content" channel={channel} type="VOICE" />
                    <div className="buttonsWrapper actionsProfile">
                        <Common.CallButtons channel={channel} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function VoiceCard({activities, voice, streams}) {
    if (!voice.length && !streams.length) return;

    const [width, height] = useWindowSize();
    const stream = streams[0]?.stream;
    const streamUser = streams[0]?.streamUser;
    const channel = stream && !channel ? ChannelStore.getChannel(stream.channelId) : voice[0]?.channel;
    const members = stream && !channel ? getVoiceParticipants({voice: stream.channelId}) : voice[0]?.members;
    const server = voice[0]?.guild;

    return (
        <div className={NowPlayingClasses.voiceSection}>
            <div className={NowPlayingClasses.voiceSectionAssets}>
                < 
            </div>
        </div>
    )
}

function VoiceCards({activities, voice, streams}) {
    if (!voice.length && !streams.length) return;

    const [width, height] = useWindowSize();
    const channel = voice[0]?.channel;
    const server = voice[0]?.guild;
    const members = voice[0]?.members;
    const stream = streams[0]?.stream
    const streamUser = streams[0]?.streamUser

    if (stream && !channel) {
        const channel = ChannelStore.getChannel(stream.channelId);
        console.log(channel)
        const members = getVoiceParticipants({voice: stream.channelId})
        console.log(members)
        return ([
            createElement('div', { className: "voiceSection_267ac" }, [
                createElement('div', { className: "voiceSectionAssets_267ac" }, [
                    createElement('img', { className: "voiceSectionGuildImage_267ac", src: channel?.icon ? `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=40` : `https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=40` }),
                    createElement('div', { className: "voiceSectionIconWrapper_267ac" },
                        createElement('svg', { className: "voiceSectionIcon_267ac", width: 24, height: 24, viewBox: "0 0 24 24" },
                            createElement('path', { fill: "currentColor", d: "M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" })
                        )
                    )
                ]),
                createElement('div', { className: "details_267ac", onClick: () => openVoiceChannel.selectVoiceChannel(channel.id) },
                    createElement('div', { className: "voiceSectionDetails_267ac" }, [
                        createElement('div', { className: "ellipsis_267ac voiceSectionText_267ac" }, channel?.name || streamUser?.globalName),
                    ])
                ),
                width > 1240 && [
                    createElement(VoiceList, {
                        className: "userList_267ac",
                        users: members,
                        maxUsers: 5,
                        channelId: channel.id,
                        size: "SIZE_32",
                    }),
                    createElement(CallButtons, { channel: channel })
                ],
            ]),
            activities.length ? createElement('div', { className: "sectionDivider_267ac" }) : null
        ]);
    }
    return ([
        createElement('div', { className: "voiceSection_267ac" }, [
            createElement('div', { className: "voiceSectionAssets_267ac" }, [
                createElement('img', { className: "voiceSectionGuildImage_267ac", src: `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=40` }),
                createElement('div', { className: "voiceSectionIconWrapper_267ac" },
                    createElement('svg', { className: "voiceSectionIcon_267ac", width: 24, height: 24, viewBox: "0 0 24 24" },
                        createElement('path', { fill: "currentColor", d: "M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" })
                    )
                )
            ]),
            createElement('div', { className: "details_267ac", onClick: () => openVoiceChannel.selectVoiceChannel(channel.id) },
                createElement('div', { className: "voiceSectionDetails_267ac" }, [
                    createElement('div', { className: "ellipsis_267ac voiceSectionText_267ac" }, server?.name || channel?.name),
                    createElement('div', { className: "ellipsis_267ac voiceSectionSubtext_267ac" }, channel?.name)
                ])
            ),
            width > 1240 && ([
                createElement(VoiceList, {
                    className: "userList_267ac",
                    users: members,
                    maxUsers: 5,
                    guildId: server?.id,
                    channelId: channel.id,
                    size: "SIZE_32",
                }),
                createElement(CallButtons, { channel: channel })
            ])
        ]),
        activities.length ? createElement('div', { className: "sectionDivider_267ac" }) : null
    ])
}