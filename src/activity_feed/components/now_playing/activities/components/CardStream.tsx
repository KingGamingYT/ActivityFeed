import { ContextMenu } from "betterdiscord";
import { Common } from "@modules/common";
import { FlexInfo } from "./common/FlexInfo";
import AvatarWithPopoutWrapper from "./common/AvatarWithPopoutWrapper";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function StreamContextMenu({stream}) {
    return (
        <ContextMenu.Menu navId="watch-stream-context" onClose={(e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e)}>
            <ContextMenu.Item id="watch-stream" label={Common.intl.intl.formatToPlainString(Common.intl.t["7Xq/nV"])} action={() => {return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream) }} />
        </ContextMenu.Menu>
    )
}

function StreamFallback() {
    return (
        <div className={`${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap}${Common.PositionClasses.alignCenter} ${Common.PositionClasses.justifyCenter} ${NowPlayingClasses.emptyPreviewContainer} ${NowPlayingClasses.applicationStreamingPreviewSize}`} 
            style={{ flex: "1 1 auto"}}>
            <Common.Spinner />
        </div>
    )
}

function StreamPlaceholder() {
    return (
        <div className={`${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap}${Common.PositionClasses.alignCenter} ${Common.PositionClasses.justifyCenter} ${NowPlayingClasses.emptyPreviewContainer} ${NowPlayingClasses.applicationStreamingPreviewSize}`} 
            style={{ flex: "1 1 auto"}}>
            <div className={NowPlayingClasses.emptyPreviewImage} style={{ backgroundImage: "url(https://static.discord.com/assets/b93ef52d62a513a4f2127a6ca0c3208c.svg)" }}></div>
            <div className={NowPlayingClasses.emptyPreviewText}>{Common.intl.intl.formatToPlainString(Common.intl.t["uQZTBV"])}</div>
        </div>
    )
}

function StreamPreview({stream}) {
    const {previewUrl, isLoading} = Common.UseStreamPreviewURL(stream.guildId, stream.channelId, stream.ownerId);
    
    return (
        <div className={NowPlayingClasses.applicationStreamingPreviewSize} role="button">
            {isLoading ? 
                <StreamFallback />
            :
            !previewUrl ? 
                <StreamPlaceholder />
            :    
                <div className={NowPlayingClasses.applicationStreamingPreviewSize} style={{ position: "relative" }}>
                    <img className={NowPlayingClasses.applicationStreamingPreview} src={previewUrl} />
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
        <div className={NowPlayingClasses.streamSection} onContextMenu={e => ContextMenu.open(e, (props) => <StreamContextMenu {...props} stream={stream} />)}>
            <div className={NowPlayingClasses.applicationStreamingSection}>
                <AvatarWithPopoutWrapper className="applicationStreamingAvatar" user={streamUser} size="SIZE_40" />
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