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
                        <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionText}`}>{streamUser.globalName}</div>
                        <Common.LiveBadge style={{ marginLeft: "5px" }}/>
                    </div>
                    <div className={`${NowPlayingClasses.ellipsis} ${NowPlayingClasses.voiceSectionSubtext}`}>{Common.intl.intl.format(Common.intl.t['0wJXSh'],  {name: <strong>{streamActivity.name}</strong>})}</div>
                </div>
            </div>
            <div className={NowPlayingClasses.applicationStreamingPreviewWrapper} style={{ paddingTop: "54.25%" }}>
                <div className={NowPlayingClasses.inner}>
                    <div className={NowPlayingClasses.applicationStreamingPreviewSize} role="button">
                        <div className={NowPlayingClasses.applicationStreamingPreviewSize} style={{ position: "relative" }}>
                            <img className={NowPlayingClasses.applicationStreamingPreview} src={preview} />
                        </div>
                        <div className={NowPlayingClasses.applicationStreamingHoverWrapper} ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}