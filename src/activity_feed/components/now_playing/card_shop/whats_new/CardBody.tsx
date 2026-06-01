import { WhatsNewListItem, WhatsNewListOverflow } from "@now_playing/activities/components/WhatsNewListItem";
import { CardMiniNews } from "@now_playing/activities/components/CardMiniNews";
import { UserStore } from "@modules/stores";
import locale from "@activity_feed/common/methods/locale";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

export function WhatsNewCardBody({players, news, v2Enabled}) {
    let slicedPlayers = players;
    let overflowPlayers = [];
    let extraPlayers = [];
    if (players.length > 4) {
        slicedPlayers = players.slice(0, 3);
        overflowPlayers = players.slice(3);
    }
    const overflowPlayerCount = overflowPlayers.length;
    const areExtraPlayers = players.length > 14;
    if (areExtraPlayers) {
        extraPlayers = overflowPlayers.slice(v2Enabled ? 15 : 11);
        overflowPlayers.splice(v2Enabled ? 16 : 12);
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
                </div>
                {overflowPlayers.length > 1 && <div className={NowPlayingClasses.lastPlayedSection}>
                    <WhatsNewListOverflow players={overflowPlayers} overflowPlayerCount={overflowPlayerCount} extras={extraPlayers} v2Enabled={v2Enabled} />
                </div>}
            </div>
            {news && <div className={NowPlayingClasses.section}>
                    <div className={NowPlayingClasses.sectionTitleWrapper}>
                        <div className={NowPlayingClasses.sectionTitle}>{locale.Strings.NEWS()}</div>
                        {!v2Enabled && <div className={`${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}`}></div>}
                    </div>
                    <CardMiniNews currentArticle={news} className={NowPlayingClasses.news} />
            </div>}
        </div>
    )
}