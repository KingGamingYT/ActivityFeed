import { useState, useMemo } from 'react';
import { Common, shell } from '@./modules/common';
import { GameStore, RunningGameStore, useStateFromStores } from '@./modules/stores';
import { SectionHeader } from '../common/components/SectionHeader';
import MainClasses from "@./activity_feed/ActivityFeed.module.css";
import QuickLauncherClasses from "./QuickLauncher.module.css";
/*function notLauncherGameBuilder({game, runningGames}) {
    const [shouldDisable, setDisable] = useState(false);
    //console.log(runningGames);
    const timer = setTimeout(() => setDisable(false), 10000);

    const disableCheck = useMemo(() => ~runningGames.findIndex(m => m.name === game.name) || shouldDisable, [ runningGames, shouldDisable ])
    
    return createElement('div', { className: `dockItem_267ac ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`, style: { flex: "0 0 auto" } }, [
            createElement('div', { className: "dockIcon_267ac", style: { backgroundImage: `url(${'https://cdn.discordapp.com/app-icons/' + GameStore.getGameByName(game.name).id + '/' + GameStore.getGameByName(game.name).icon + '.webp'})` } }),
            createElement('div', { className: "dockItemText_267ac" }, game.name),
            createElement('button', { className: `dockItemPlay_267ac ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`, 
                disabled: disableCheck,
                onClick: () => { setDisable(true); shell.openExternal(game.exePath); timer }},  
                createElement('div', { className: `${Common.ButtonVoidClasses.contents}`}, "Play")
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
        <div className={`${QuickLauncherClasses.dockItem} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`} style={{ flex: "0 0 auto"}}>
            <div className={QuickLauncherClasses.dockIcon} style={{ backgroundImage: `url(${'https://cdn.discordapp.com/app-icons/' + GameStore.getGameByName(game.name).id + '/' + GameStore.getGameByName(game.name).icon + '.webp'})` }} />
            <div className={QuickLauncherClasses.dockItemText}>{game.name}</div>
            <button 
                className={`${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`} 
                disabled={disableCheck}
                onClick={() => { setDisable(true); shell.openExternal(game.exePath); timer }}>
                <div className={`${Common.ButtonVoidClasses.contents}`}>Play</div>
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
                    <div className={`${QuickLauncherClasses.dock} ${QuickLauncherClasses.emptyState}`}>
                        <svg className={QuickLauncherClasses.emptyIcon} name="OpenExternal" width={16} height={16} viewBox="0 0 24 24">
                            <path fill="currentColor" transform="translate(3, 4)" d="M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" />
                        </svg>
                        <div className={MainClasses.emptyText}>Discord can quickly launch most games you’ve recently played on this computer. Go ahead and launch one to see it appear here!</div>
                    </div>
                : 
                    <div className={QuickLauncherClasses.dock}>{_gameList.map(game => <LauncherGameBuilder game={game} runningGames={runningGames} />)}</div>
            }
        </div>
    )
}