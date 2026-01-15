import { Data } from 'betterdiscord';
import { Common } from "@./modules/common";
import { NowPlayingViewStore, useStateFromStores } from "@./modules/stores";
import { chunkArray } from "../common/methods/common";
import { SectionHeader } from "../common/components/SectionHeader";
import { NowPlayingCardBuilder } from "./cardBuilder";
import styleModule from "../ActivityFeed.module.css";

/*function notNowPlayingBuilder({props}) {
    FluxDispatcher.dispatch({type: 'NOW_PLAYING_MOUNTED'});
    const nowPlayingCards = useStateFromStores([ NowPlayingViewStore ], () => NowPlayingViewStore.nowPlayingCards);
    const cardColumns = chunkArray(nowPlayingCards, 2);
    //console.log(nowPlayingCards);

    if (!nowPlayingCards.length) {
        return createElement('div', {...props}, [
            createElement('div', { className: `headerContainer_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyBetween} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                createElement('div', { className: "headerText_267ac" }, "Now Playing")
            ),
            createElement('div', { className: "emptyState_267ac" }, [
                createElement('div', { className: "emptyTitle_267ac" }, "Nobody is playing anything right now..."),
                createElement('div', { className: "emptySubtitle_267ac" }, "When someone starts playing a game we'll show it here!")
            ])
        ])
    }

    //AffinityFetch()

    //console.log(GameSearchFetch())

    return createElement('div', {...props}, [
            createElement('div', { className: `headerContainer_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyBetween} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                createElement('div', { className: "headerText_267ac" }, "Now Playing")
            ),
            createElement('div', { className: "nowPlayingContainer_267ac"},
                cardColumns.map((column, index) => createElement('div', { className: "nowPlayingColumn_267ac" }, 
                    createElement(NowPlayingColumnBuilder, {nowPlayingCards: column, currentUser: UserStore.getCurrentUser()})
                )
            )) 
        ]
    )
}
*/

function NowPlayingColumnBuilder({nowPlayingCards}) {
    return (
        nowPlayingCards.map(card => ([
            <NowPlayingCardBuilder card={card} v2Enabled={Data.load('v2Cards')} />,
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
                    <div className={styleModule.emptyState}>
                        <div className={styleModule.emptyTitle}>Nobody is playing anything right now...</div>
                        <div className={styleModule.emptySubtitle}>When someone starts playing a game we'll show it here!</div>
                    </div>
                :
                    <div className={styleModule.nowPlayingContainer}>
                        {cardColumns.map((column, index) => <div className={styleModule.nowPlayingColumn}>
                            <NowPlayingColumnBuilder nowPlayingCards={column} />
                        </div>)}
                    </div>
            }
        </div>
    )
}