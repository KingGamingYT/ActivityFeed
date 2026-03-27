import { WhatsNewListItemBuilder } from "@now_playing/activities/components/WhatsNewListItem";
import { CardMiniNews } from "@now_playing/activities/components/CardMiniNews";
import NewsStore from "@activity_feed/Store";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

export function WhatsNewCardBody({game, players}) {
    const titleNews = NewsStore.getByApplicationId(game.id);

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
            {titleNews && <div className={NowPlayingClasses.section}>
                    <div className={NowPlayingClasses.sectionTitleWrapper}>
                        <div className={NowPlayingClasses.sectionTitle}>News</div>
                        <div className={`${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}`}></div>
                    </div>
                    <CardMiniNews currentArticle={titleNews} />
            </div>}
        </div>
    )
}