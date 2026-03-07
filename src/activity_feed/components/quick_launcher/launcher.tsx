import { Utils, Data, ContextMenu } from 'betterdiscord';
import { useState, useMemo } from 'react';
import { Common, shell } from '@modules/common';
import { GameStore, RunningGameStore, useStateFromStores } from '@modules/stores';
import { SectionHeader } from '../common/components/SectionHeader';
import settings from "@settings/settings";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import QuickLauncherClasses from "./QuickLauncher.module.css";

export function LauncherGameBuilder({game, runningGames}) {
    const [shouldDisable, setDisable] = useState(false);
    const timer = setTimeout(() => setDisable(false), 10000);
    const disableCheck = useMemo(() => ~runningGames.findIndex(m => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
    const fullGame = GameStore.getDetectableGame(GameStore.searchGamesByName(game.name)[0])
    const skuViaGame = fullGame.thirdPartySkus

    const isSteam = Object.values(skuViaGame).find(x => x.distributor.toLowerCase().includes('steam'))

    function openGame()
    {
        shell.openExternal(!!isSteam ? `steam://run/${isSteam.id}` : game.exepath)
    }

    return (
        <div className={`${QuickLauncherClasses.dockItem} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`} style={{ flex: "0 0 auto"}}>
            <div className={QuickLauncherClasses.dockIcon} style={{ backgroundImage: `url(${'https://cdn.discordapp.com/app-icons/' + fullGame.id + '/' + fullGame.icon + '.webp'})` }} />
            <div className={QuickLauncherClasses.dockItemText}>{game.name}</div>
            <button 
                className={`${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`} 
                disabled={disableCheck}
                onClick={() => { setDisable(true); openGame(); timer }}>
                <div className={`${Common.ButtonVoidClasses.contents}`}>Play</div>
            </button>
        </div>
    )
}

export function LauncherEmptyBuilder() {
    return (
        <div className={`${QuickLauncherClasses.dock} ${MainClasses.emptyState}`}>
            <svg className={QuickLauncherClasses.emptyIcon} name="OpenExternal" width={16} height={16} viewBox="0 0 24 24">
                <path fill="currentColor" transform="translate(3, 4)" d="M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" />
            </svg>
            <div className={MainClasses.emptyText}>Discord can quickly launch most games you’ve recently played on this computer. Go ahead and launch one to see it appear here!</div>
        </div>
    )
}

export function QuickLauncherBuilder(props) {
    const runningGames = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getRunningGames());
    const gameList = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getGamesSeen());
    const _gameList = gameList.filter(game => GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0])).slice(0, 12);

    return (
        <div {...props}>
            <SectionHeader label="Quick Launcher" />
            {   
                gameList.length === 0 || (Data.load('freezeDock') ?? settings.default.freezeDock)
                ?
                    <LauncherEmptyBuilder />
                : 
                    <div className={Utils.className((Data.load('v2Dock') ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock)}>{_gameList.map(game => <LauncherGameBuilder game={game} runningGames={runningGames} />)}</div>
            }
        </div>
    )
}