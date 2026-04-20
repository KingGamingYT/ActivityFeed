import { Data, Hooks } from 'betterdiscord';
import { useEffect } from 'react';
import { Common } from "@modules/common";
import { NowPlayingViewStore, useStateFromStores } from "@modules/stores";
import { chunkArray, useWindowSize } from "@common/methods/common";
import { NowPlayingCardBuilder, WhatsNewCardBuilder } from "./CardBuilder";
import SectionHeader from "@activity_feed/common/components/SectionHeader";
import settings from "@settings/settings";
import LastPlayedStore from './LastPlayedStore';
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "./NowPlaying.module.css";

function NowPlayingColumnBuilder({nowPlayingCards, type}) {
    return (
        type === "NOW_PLAYING" ? nowPlayingCards.map(card => ([
            <NowPlayingCardBuilder card={card} v2Enabled={Data.load('v2Cards') ?? settings.default.v2Cards} />,
            Data.load('cardTypeDebug') && <NowPlayingCardBuilder card={card} v2Enabled={false} />
        ]))
        : type === "WHATS_NEW" ? nowPlayingCards.map(card => ([
            <WhatsNewCardBuilder card={card} v2Enabled={Data.load('v2Cards') ?? settings.default.v2Cards} />,
            Data.load('cardTypeDebug') && <WhatsNewCardBuilder card={card} v2Enabled={false} />
        ]))
        : console.warn('Invalid card type passed to ColumnBuilder')

    )
}

export function NowPlayingBuilder(props) {
    useEffect(() => void Common.FluxDispatcher.dispatch({type: 'NOW_PLAYING_MOUNTED'}), []);
    const [width, height] = useWindowSize();
    const nowPlayingCards = useStateFromStores([ NowPlayingViewStore ], () => NowPlayingViewStore.nowPlayingCards);
    const numColumns = Math.min(Math.max(Math.floor(width / 600), 1), 2);
    const cardColumns = chunkArray(nowPlayingCards, numColumns);
    const spacer = 20 - 20 / cardColumns.length;

    return (
        <div {...props}>
            <SectionHeader label="Now Playing" />
            {
                nowPlayingCards.length === 0 || (Data.load('freezeCards') ?? settings.default.freezeCards) ?
                    <div className={MainClasses.emptyState}>
                        <div className={MainClasses.emptyTitle}>Nobody is playing anything right now...</div>
                        <div className={MainClasses.emptySubtitle}>When someone starts playing a game we'll show it here!</div>
                    </div>
                :
                    <div className={NowPlayingClasses.nowPlayingContainer}>
                        {cardColumns.map((column, index) => <div className={NowPlayingClasses.nowPlayingColumn} style={{ width: nowPlayingCards.length !== 1 && `calc(${100 / cardColumns.length}% - ${spacer}px)`}}>
                            <NowPlayingColumnBuilder nowPlayingCards={column} type="NOW_PLAYING" />
                        </div>)}
                    </div>
            }
        </div>
    )
}

export function WhatsNewBuilder(props) {
    useEffect(() => void Common.FluxDispatcher.dispatch({type: 'LAST_PLAYED_MOUNTED'}), []);
    const [width, height] = useWindowSize();
    const lastPlayedCards = useStateFromStores([ LastPlayedStore ], () => LastPlayedStore.lastPlayedCards);
    const _lastPlayedCards = lastPlayedCards.filter(card => card.players.length > 0)
    
    const numColumns = Math.min(Math.max(Math.floor(width / 600), 1), 2);
    const cardColumns = chunkArray(_lastPlayedCards, numColumns);
    const spacer = 20 - 20 / cardColumns.length;

    if (lastPlayedCards.length) {
        return (
            <div {...props}>
                <SectionHeader label="What's New" />
                <div className={NowPlayingClasses.nowPlayingContainer}>
                    {cardColumns.map((column, index) => <div className={NowPlayingClasses.nowPlayingColumn} style={{ width: _lastPlayedCards.length !== 1 && `calc(${100 / cardColumns.length}% - ${spacer}px)`}}>
                        <NowPlayingColumnBuilder nowPlayingCards={column} type="WHATS_NEW" />
                    </div>)}
                </div>
            </div>
        )
    }
    return;
}