import { createElement, useState, useMemo } from 'react';
import { Common, shell } from '@./modules/common';
import { GameStore, RunningGameStore, useStateFromStores } from '@./modules/stores';
import { SectionHeader } from '../common/SectionHeader';

/*function notLauncherGameBuilder({game, runningGames}) {
    const [shouldDisable, setDisable] = useState(false);
    //console.log(runningGames);
    const timer = setTimeout(() => setDisable(false), 10000);

    const disableCheck = useMemo(() => ~runningGames.findIndex(m => m.name === game.name) || shouldDisable, [ runningGames, shouldDisable ])
    
    return createElement('div', { className: `dockItem_267ac ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, [
            createElement('div', { className: "dockIcon_267ac", style: { backgroundImage: `url(${'https://cdn.discordapp.com/app-icons/' + GameStore.getGameByName(game.name).id + '/' + GameStore.getGameByName(game.name).icon + '.webp'})` } }),
            createElement('div', { className: "dockItemText_267ac" }, game.name),
            createElement('button', { className: `dockItemPlay_267ac ${Common.ButtonClasses.button} ${Common.ButtonClasses.lookFilled} ${Common.ButtonClasses.colorGreen} ${Common.ButtonClasses.sizeSmall} ${Common.ButtonClasses.fullWidth} ${Common.ButtonClasses.grow}`, 
                disabled: disableCheck,
                onClick: () => { setDisable(true); shell.openExternal(game.exePath); timer }},  
                createElement('div', { className: `${Common.ButtonClasses.contents}`}, "Play")
            )
        ]
    )
}
    */

export function LauncherGameBuilder({game, runningGames}) {
    const [shouldDisable, setDisable] = useState(false);
    const timer = setTimeout(() => setDisable(false), 10000);
    const disableCheck = useMemo(() => ~runningGames.findIndex(m => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);

    return (
        <div className={`_2cbe2fbfe32e4150-dockItem ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`} style={{ flex: "0 0 auto"}}>
            <div className="_2cbe2fbfe32e4150-dockIcon" style={{ backgroundImage: `url(${'https://cdn.discordapp.com/app-icons/' + GameStore.getGameByName(game.name).id + '/' + GameStore.getGameByName(game.name).icon + '.webp'})` }} />
            <div className="_2cbe2fbfe32e4150-dockItemText">{game.name}</div>
            <button 
                className={`_2cbe2fbfe32e4150-dockItemPlay ${Common.ButtonClasses.button} ${Common.ButtonClasses.lookFilled} ${Common.ButtonClasses.colorGreen} ${Common.ButtonClasses.sizeSmall} ${Common.ButtonClasses.fullWidth} ${Common.ButtonClasses.grow}`} 
                disabled={disableCheck}
                onClick={() => { setDisable(true); shell.openExternal(game.exePath); timer }}>
                <div className={`${Common.ButtonClasses.contents}`}>Play</div>
            </button>
        </div>
    )
}
/*
function notQuickLauncherBuilder(props) {
    const runningGames = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getRunningGames());
    const gameList = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getGamesSeen());
    const _gameList = gameList.filter(game => GameStore.getGameByName(game.name)).slice(0, 12);
    //console.log(_gameList);

    if (gameList.length === 0) {
        return createElement('div', {...props}, [
                createElement('div', { className: `headerContainer_267ac ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                    createElement('div', { className: "headerText_267ac" }, "Quick Launcher")
                ),
                createElement('div', { className: "dock_267ac emptyState_267ac"}, [
                        createElement('svg', { className: "emptyIcon_267ac", name: "OpenExternal", width: 16, height: 16, viewBox: "0 0 24 24"},
                            createElement('path', { fill: "currentColor", transform: "translate(3, 4)", d: "M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z"})
                        ),
                        createElement('div', { className: "emptyText_267ac"}, "Discord can quickly launch most games you’ve recently played on this computer. Go ahead and launch one to see it appear here!")
                    ]
                )
            ]
        )
    }

    return createElement('div', {...props}, [
            createElement('div', { className: `headerContainer_267ac ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`, style: { flex: "1 1 auto" } },
                createElement('div', { className: "headerText_267ac" }, "Quick Launcher")
            ),
            createElement('div', { className: "dock_267ac"},
                _gameList.map(game => createElement(LauncherGameBuilder, { game, runningGames }))
            )
        ]
    )
}
*/

export function QuickLauncherBuilder(props) {
    const runningGames = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getRunningGames());
    const gameList = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getGamesSeen());
    const _gameList = gameList.filter(game => GameStore.getGameByName(game.name)).slice(0, 12);

    return (
        <div {...props}>
            <SectionHeader label="Quick Launcher" />
            {   
                gameList.length === 0 
                ?
                    <div className="_2cbe2fbfe32e4150-dock _2cbe2fbfe32e4150-emptyState">
                        <svg className="_2cbe2fbfe32e4150-emptyIcon" name="OpenExternal" width={16} height={16} viewBox="0 0 24 24">
                            <path fill="currentColor" transform="translate(3, 4)" d="M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" />
                        </svg>
                        <div className="_2cbe2fbfe32e4150-emptyText">Discord can quickly launch most games you’ve recently played on this computer. Go ahead and launch one to see it appear here!</div>
                    </div>
                : 
                    <div className="_2cbe2fbfe32e4150-dock">{_gameList.map(game => <LauncherGameBuilder game={game} runningGames={runningGames} />)}</div>
            }
        </div>
    )
}