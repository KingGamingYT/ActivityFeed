import { Common } from "@modules/common";
import { ApplicationStreamPreviewStore, useStateFromStores } from "@modules/stores";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function StreamCard({stream, streamUser, streamActivity}) {
    const preview = useStateFromStores([ ApplicationStreamPreviewStore ], () => ApplicationStreamPreviewStore.getPreviewURLForStreamKey(`${stream.streamType}:${stream.guildId}:${stream.channelId}:${stream.ownerId}`));

    return (
        <div className={NowPlayingClasses.streamSection}>
            <div className={NowPlayingClasses.applicationStreamingSection}>
                <Common.AvatarFetch imageClassName="applicationStreamingAvatar" src={`https://cdn.discordapp.com/avatars/${streamUser.id}/${streamUser.avatar}.webp?size=48`} size="SIZE_40" />
                <div className={`${NowPlayingClasses.details} ${NowPlayingClasses.applicationStreamingDetails}`}>
                    <div style={{ display: "flex", alignItems: "flex-end" }} >
                        <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}`}>{streamUser.globalName || streamUser.username}</div>
                        <Common.LiveBadge style={{ marginLeft: "5px" }}/>
                    </div>
                    <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}`}>{Common.intl.intl.format(Common.intl.t['0wJXSh'],  {name: <strong>{streamActivity.name}</strong>})}</div>
                </div>
            </div>
            <div className={NowPlayingClasses.applicationStreamingPreviewWrapper} style={{ paddingTop: "54.25%" }}>
                <div className={NowPlayingClasses.inner}>
                    <div className={NowPlayingClasses.applicationStreamingPreviewSize} role="button">
                        {preview ? 
                            <div className={NowPlayingClasses.applicationStreamingPreviewSize} style={{ position: "relative" }}>
                                <img className={NowPlayingClasses.applicationStreamingPreview} src={preview} />
                            </div>
                        :
                            <div className={`${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap}${Common.PositionClasses.alignCenter} ${Common.PositionClasses.justifyCenter} ${NowPlayingClasses.emptyPreviewContainer} ${NowPlayingClasses.applicationStreamingPreviewSize}`} 
                                style={{ flex: "1 1 auto"}}>
                                <div className={NowPlayingClasses.emptyPreviewImage} style={{ backgroundImage: "url(https://static.discord.com/assets/b93ef52d62a513a4f2127a6ca0c3208c.svg)" }}></div>
                                <div className={NowPlayingClasses.emptyPreviewText}>{Common.intl.intl.formatToPlainString(Common.intl.t["uQZTBV"])}</div>
                            </div>
                        }
                        <div className={NowPlayingClasses.applicationStreamingHoverWrapper} onClick={() => {return Common.OpenVoiceChannel.selectVoiceChannel(stream.channelId), Common.OpenStream(stream) }}>
                            <div className={NowPlayingClasses.applicationStreamingHoverText}>{Common.intl.intl.formatToPlainString(Common.intl.t["7Xq/nV"])}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}