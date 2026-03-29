import { WhatsNewListItemBuilder } from "@now_playing/activities/components/WhatsNewListItem";
import { CardMiniNews } from "@now_playing/activities/components/CardMiniNews";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

export function WhatsNewCardBody({players, news, v2Enabled}) {
    return (
        <div className={NowPlayingClasses.cardBody}>
            <div className={NowPlayingClasses.section}>
                <div className={NowPlayingClasses.lastPlayedSection}>{
                    players.map(player => {
                        if (!player) return;

                        return <WhatsNewListItemBuilder player={player} />
                    })
                }</div>
            </div>
            {news && <div className={NowPlayingClasses.section}>
                    <div className={NowPlayingClasses.sectionTitleWrapper}>
                        <div className={NowPlayingClasses.sectionTitle}>News</div>
                        {!v2Enabled && <div className={`${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}`}></div>}
                    </div>
                    <CardMiniNews currentArticle={news} />
            </div>}
        </div>
    )
}