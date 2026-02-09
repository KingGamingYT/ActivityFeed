import { Data } from 'betterdiscord';
import { Common } from "@./modules/common";
import { NowPlayingViewStore, useStateFromStores } from "@./modules/stores";
import { chunkArray } from "../common/methods/common";
import { SectionHeader } from "../common/components/SectionHeader";
import { NowPlayingCardBuilder } from "./CardBuilder";
import settings from "@./settings/settings";
import MainClasses from "@./activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "./NowPlaying.module.css";

function NowPlayingColumnBuilder({nowPlayingCards}) {
    return (
        nowPlayingCards.map(card => ([
            <NowPlayingCardBuilder card={card} v2Enabled={Data.load('v2Cards') || settings.default.v2Cards} />,
            Data.load('cardTypeDebug') && <NowPlayingCardBuilder card={card} v2Enabled={false} />
        ]))
    )
}

export function NowPlayingBuilder(props) {
    Common.FluxDispatcher.dispatch({type: 'NOW_PLAYING_MOUNTED'});
    const nowPlayingCards = useStateFromStores([ NowPlayingViewStore ], () => NowPlayingViewStore.nowPlayingCards);
    const cardColumns = chunkArray(nowPlayingCards, 2);

    return (
        <div {...props}>
            <SectionHeader label="Now Playing" />
            {
                nowPlayingCards.length === 0 ?
                    <div className={MainClasses.emptyState}>
                        <div className={MainClasses.emptyTitle}>Nobody is playing anything right now...</div>
                        <div className={MainClasses.emptySubtitle}>When someone starts playing a game we'll show it here!</div>
                    </div>
                :
                    <div className={NowPlayingClasses.nowPlayingContainer}>
                        {cardColumns.map((column, index) => <div className={NowPlayingClasses.nowPlayingColumn}>
                            <NowPlayingColumnBuilder nowPlayingCards={column} />
                        </div>)}
                    </div>
            }
        </div>
    )
}