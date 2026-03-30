import { WhatsNewListItem, WhatsNewListOverflow } from "@now_playing/activities/components/WhatsNewListItem";
import { CardMiniNews } from "@now_playing/activities/components/CardMiniNews";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

export function WhatsNewCardBody({players, news, v2Enabled}) {
    let slicedPlayers = players;
    let overflowPlayers = [];
    if (players.length > 4) {
        slicedPlayers = players.slice(0, 3);
        overflowPlayers = players.slice(3);
    }
    
    return (
        <div className={NowPlayingClasses.cardBody}>
            <div className={NowPlayingClasses.section}>
                <div className={NowPlayingClasses.lastPlayedSection}>{
                    slicedPlayers.map(player => {
                        if (!player) return;

                        return <WhatsNewListItem player={player} />
                    })
                }
                {overflowPlayers.length > 1 && <WhatsNewListOverflow players={overflowPlayers} v2Enabled={v2Enabled} />}
                </div>
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