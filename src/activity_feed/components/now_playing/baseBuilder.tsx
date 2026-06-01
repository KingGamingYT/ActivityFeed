import { Data, Hooks } from 'betterdiscord';
import { useEffect } from 'react';
import { Common } from "@modules/common";
import { NowPlayingViewStore, useStateFromStores } from "@modules/stores";
import { chunkArray, useWindowSize } from "@common/methods/common";
import { NowPlayingCardBuilder, WhatsNewCardBuilder } from "./CardBuilder";
import SectionHeader from "@activity_feed/common/components/SectionHeader";
import locale from "@activity_feed/common/methods/locale";
import settings from "@settings/settings";
import LastPlayedStore from './LastPlayedStore';
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "./NowPlaying.module.css";

function NowPlayingColumnBuilder({nowPlayingCards, type}) {
    return (
        type === "NOW_PLAYING" ? nowPlayingCards.map(card => ([
            <NowPlayingCardBuilder card={card} v2Enabled={Data.load('v2Cards') ?? settings.default.v2Cards} key={card.party.priorityMembers[0].user.id} />,
            Data.load('cardTypeDebug') && <NowPlayingCardBuilder card={card} v2Enabled={false} key={`${card.party.priorityMembers[0].user.id}-debug`} />
        ]))
        : type === "WHATS_NEW" ? nowPlayingCards.map(card => ([
            <WhatsNewCardBuilder card={card} v2Enabled={Data.load('v2Cards') ?? settings.default.v2Cards} key={card.application.id} />,
            Data.load('cardTypeDebug') && <WhatsNewCardBuilder card={card} v2Enabled={false} key={`${card.application.id}-index`} />
        ]))
        : console.warn('Invalid card type passed to ColumnBuilder')

    )
}

function CardCombinator({nowPlayingCards}) {
    const hasGame = (card) => { return card.party && card.party.currentActivities && card.party.currentActivities[0] && card.party.currentActivities[0].application.thirdPartySkus.length };
    const isSpotify = (card) => { return card.party.isSpotifyActivity };
    const hasVoiceChannel = (card) => { return card.party.voiceChannels.length };
    const cards = nowPlayingCards.slice();
    const _cards = nowPlayingCards.filter(card => hasGame(card) && !hasVoiceChannel(card) && !isSpotify(card));
    const applicationIds = _cards.map(card => card.party.currentActivities[0].application?.id);
    const count = ids => ids.reduce((result, value) => ({ ...result, [value]: (result[value] || 0) + 1 }), {});
    const findDuplicates = dict => Object.keys(dict).filter((a) => dict[a] > 1);
    console.log(applicationIds);
    const duplicates = findDuplicates(count(applicationIds));
    console.log(duplicates)
    if (duplicates.length === 0) return nowPlayingCards;
    const indexes = duplicates.map(dupe => {let ids = []; for (let id = 0; id < applicationIds.length; id++) { if (applicationIds[id] === dupe) { ids.push(id) }} return ids});
    console.log(indexes[0])
    const duplicateCards = indexes[0].map(index => _cards[index]);
    console.log(duplicateCards)
    //for (let i = duplicateCards.length - 1; i >= 0; i--) cards.splice(duplicateCards[i],1);
    const __cards = cards.filter((card, index) => index === indexes[0][index])
    console.log(indexes[0][0])
    __cards.splice(indexes[0][0], 0, duplicateCards);
    console.log(__cards)
    return __cards;
}

export function NowPlayingBuilder(props) {
    useEffect(() => void Common.FluxDispatcher.dispatch({type: 'NOW_PLAYING_MOUNTED'}), []);
    const [width, height] = useWindowSize();
    const nowPlayingCards = useStateFromStores([ NowPlayingViewStore ], () => NowPlayingViewStore.nowPlayingCards);
    //const groupedCards = CardCombinator({nowPlayingCards})
    const numColumns = Math.min(Math.max(Math.floor(width / 600), 1), 2);
    const cardColumns = chunkArray(nowPlayingCards, numColumns);
    const spacer = 20 - 20 / cardColumns.length;

    return (
        <div {...props}>
            <SectionHeader label={locale.Strings.NOW_PLAYING()} />
            {
                nowPlayingCards.length === 0 || (Data.load('freezeCards') ?? settings.default.freezeCards) ?
                    <div className={MainClasses.emptyState}>
                        <div className={MainClasses.emptyTitle}>{locale.Strings.NOW_PLAYING_EMPTY_TITLE()}</div>
                        <div className={MainClasses.emptySubtitle}>{locale.Strings.NOW_PLAYING_EMPTY_SUBTITLE()}</div>
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
                <SectionHeader label={locale.Strings.WHATS_NEW()} />
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