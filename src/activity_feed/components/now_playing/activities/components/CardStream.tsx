import { useRef, useEffect } from "react"; 
import { Common } from "@modules/common";
import { ApplicationStreamPreviewStore, useStateFromStores } from "@modules/stores";
import { FlexInfo } from './common/FlexInfo';
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function StreamFallback() {
    return (
        <div className={`${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap}${Common.PositionClasses.alignCenter} ${Common.PositionClasses.justifyCenter} ${NowPlayingClasses.emptyPreviewContainer} ${NowPlayingClasses.applicationStreamingPreviewSize}`} 
            style={{ flex: "1 1 auto"}}>
            <div className={NowPlayingClasses.emptyPreviewImage} style={{ backgroundImage: "url(https://static.discord.com/assets/b93ef52d62a513a4f2127a6ca0c3208c.svg)" }}></div>
            <div className={NowPlayingClasses.emptyPreviewText}>{Common.intl.intl.formatToPlainString(Common.intl.t["uQZTBV"])}</div>
        </div>
    )
}

function StreamPreview({stream}) {
    const preview = useStateFromStores([ ApplicationStreamPreviewStore ], () => ApplicationStreamPreviewStore.getPreviewURL(stream.guildId, stream.channelId, stream.ownerId));

    return (
        <div className={NowPlayingClasses.applicationStreamingPreviewSize} role="button">
            {!preview ? 
                <StreamFallback />
            :
                <div className={NowPlayingClasses.applicationStreamingPreviewSize} style={{ position: "relative" }}>
                    <img className={NowPlayingClasses.applicationStreamingPreview} src={preview} />
                </div>
            }
            <div className={NowPlayingClasses.applicationStreamingHoverWrapper} onClick={() => {return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream) }}>
                <div className={NowPlayingClasses.applicationStreamingHoverText}>{Common.intl.intl.formatToPlainString(Common.intl.t["7Xq/nV"])}</div>
            </div>
        </div>
    )
}

export function StreamCard({stream, streamUser, streamActivity}) {
    return (
        <div className={NowPlayingClasses.streamSection}>
            <div className={NowPlayingClasses.applicationStreamingSection}>
                <Common.AvatarFetch imageClassName="applicationStreamingAvatar" src={`https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=48`} size="SIZE_40" />
                <FlexInfo className={`${NowPlayingClasses.details} ${NowPlayingClasses.applicationStreamingDetails}`} type="STREAM" stream={streamActivity} streamUser={streamUser} />
            </div>
            <div className={NowPlayingClasses.applicationStreamingPreviewWrapper} style={{ paddingTop: "54.25%" }}>
                <div className={NowPlayingClasses.inner}>
                    <div className={NowPlayingClasses.applicationStreamingPreviewSize} role="button">
                        <StreamPreview stream={stream} />
                    </div>
                </div>
            </div>
        </div>
    )
}