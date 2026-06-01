import { ContextMenu, Utils } from "betterdiscord";
import { Common } from "@modules/common";
import { FlexInfo } from "./common/FlexInfo";
import locale from "@activity_feed/common/methods/locale";
import AvatarWithPopoutWrapper from "./common/AvatarWithPopoutWrapper";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function StreamContextMenu({stream}) {
    return (
        <ContextMenu.Menu navId="watch-stream-context" onClose={(e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e)}>
            <ContextMenu.Item id="watch-stream" label={locale.Strings.WATCH_STREAM()} action={() => {return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream) }} />
        </ContextMenu.Menu>
    )
}

function StreamFallback() {
    return (
        <Common.Flex align={Common.Flex.Align.CENTER} className={Utils.className(NowPlayingClasses.emptyPreviewContainer, NowPlayingClasses.applicationStreamingPreviewSize)} justify={Common.Flex.Justify.CENTER}>
            <Common.Spinner />
        </Common.Flex>
    )
}

function StreamPlaceholder() {
    return (
        <Common.Flex align={Common.Flex.Align.CENTER} className={Utils.className(NowPlayingClasses.emptyPreviewContainer, NowPlayingClasses.applicationStreamingPreviewSize)} justify={Common.Flex.Justify.CENTER}>
            <div className={NowPlayingClasses.emptyPreviewImage} style={{ backgroundImage: "url(https://static.discord.com/assets/b93ef52d62a513a4f2127a6ca0c3208c.svg)" }}></div>
            <div className={NowPlayingClasses.emptyPreviewText}>{locale.Strings.STREAM_JUST_STARTED_PROMPT()}</div>
        </Common.Flex>
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
                <div className={NowPlayingClasses.applicationStreamingHoverText}>{locale.Strings.WATCH_STREAM()}</div>
            </div>
        </div>
    )
}

export function StreamCard({stream, streamUser, streamActivity}) {
    return (
        <div className={NowPlayingClasses.streamSection} onContextMenu={e => ContextMenu.open(e, (props) => <StreamContextMenu {...props} stream={stream} />)}>
            <div className={NowPlayingClasses.applicationStreamingSection}>
                <AvatarWithPopoutWrapper className={`${NowPlayingClasses.applicationStreamingAvatar} ${NowPlayingClasses.avatar}`} user={streamUser} size="SIZE_40" />
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