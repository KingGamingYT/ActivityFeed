import { VoiceBox, CallButtons } from '@modules/common';
import { ChannelStore, useStateFromStores } from '@modules/stores';
import { FlexInfo } from './common/FlexInfo';
import { getVoiceParticipants } from '../methods/getVoiceParticipants';

export function VoiceCard({voice, stream}) {
    const channel = useStateFromStores([ ChannelStore ], () => ChannelStore.getChannel(voice));
    return;
    if (stream || !channel) return;
    return (
        <div className="activityProfile activity">
            <div className="activityProfileContainerVoice">
                <div className="bodyNormal" style={{ display: "flex", alignItems: "center", width: "auto" }}>
                    <VoiceBox users={getVoiceParticipants({voice})} channel={channel} themeType="MODAL" />
                    <FlexInfo className="contentImagesProfile content" channel={channel} type="VOICE" />
                    <div className="buttonsWrapper actionsProfile">
                        <CallButtons channel={channel} />
                    </div>
                </div>
            </div>
        </div>
    )
}