import { Utils, Data, ContextMenu } from 'betterdiscord';
import { useState, useRef, useMemo } from 'react';
import { Common, shell, fs } from '@modules/common';
import { ConnectedAppsStore, DispatchApplicationStore, GameStore, LaunchableGameStore, LibraryApplicationStore, RunningGameStore, UserSettingsProtoStore, useStateFromStores } from '@modules/stores';
import SectionHeader from '@activity_feed/common/components/SectionHeader';
import locale from "@activity_feed/common/methods/locale";
import settings from "@settings/settings";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import QuickLauncherClasses from "./QuickLauncher.module.css";

export function LauncherGameBuilder({game, runningGames}) {
    const [shouldDisable, setDisable] = useState(false);
    const timer = setTimeout(() => setDisable(false), 10000);
    const disableCheck = useMemo(() => ~runningGames.findIndex(m => m.name === game.name) || shouldDisable, [runningGames, shouldDisable]);
    const fullGame = GameStore.getDetectableGame(GameStore.searchGamesByName(game.name)[0]);
    const skuViaGame = fullGame.thirdPartySkus;
    const isSteam = Object.values(skuViaGame).find(x => x.distributor.toLowerCase().includes('steam'));
    const steamLibraryPaths = fs.readFile("C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf",'utf8', (error, data) => {
        const dataA = String(data);
        const found = [...dataA.matchAll(/"path"\s+"(.*?)"/g)].map(x => x[1].replaceAll('\\\\',"\\"));
        return found;
    })
    const canPlay = Common.IsGameLaunchable({LibraryApplicationStore, LaunchableGameStore, DispatchApplicationStore, ConnectedAppsStore, applicationId: fullGame.id});
    const libraryApplication = new Common.BasicLibraryApplication({fullGame});
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: game?.id});
    const refDOM = useRef(null)
    const [showPopout, setShowPopout] = useState(false);
    //console.log(steamLibraryPaths)

    function openGame() {
        const items = game.exePath.split('/');
        /*const args = game.cmdLine.substring(game.cmdLine.indexOf('exe')+3);*/
        switch(true) {
            case !! canPlay: Common.LibraryApplicationUtils.playApplication(game?.id, libraryApplication, {}); break;
            case !! !!isSteam && ["steamapps", "steamlibrary"].some(item => items.includes(item)): shell.openExternal(`steam://run/${isSteam.id}`); break;
            default: shell.openExternal(game.exepath);
        }
    }

    function PlayPopout({close}) {
        return (
            <ContextMenu.Menu navId="launcher-context-menu" onClose={close}>
                <ContextMenu.Item id="play-game" label={locale.Strings.PLAY_GAME()} action={() => { setDisable(true); openGame(); timer }} />
                {UserSettingsProtoStore.settings.appearance.developerMode && <ContextMenu.Item id="copy-app-id" label={locale.Strings.COPY_APPLICATION_ID()} action={() => Common.Clipboard(fullGame.id)} />}
            </ContextMenu.Menu>
        )
    }

    return (
        <Common.Popout 
            targetElementRef={refDOM}
            clickTrap={true}
            onRequestClose={() => setShowPopout(false)}
            renderPopout={() => <PlayPopout close={() => setShowPopout(false) } />}
            position={"right"}
            shouldShow={showPopout}
        >{(props) => <div
            {...props}
            ref={refDOM}
            onClick={(e) => e.shiftKey && !disableCheck && setShowPopout(true)}
            >
                <div className={`${QuickLauncherClasses.dockItem} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}, ${Common.PositionClasses.alignCenter}`} style={{ flex: "0 0 auto"}}>
                    <div className={QuickLauncherClasses.dockIcon} style={{ backgroundImage: `url(${'https://cdn.discordapp.com/app-icons/' + fullGame.id + '/' + fullGame.icon + '.webp'})` }} onClick={useGameProfile} />
                    <div className={QuickLauncherClasses.dockItemText}>{game.name}</div>
                    <button 
                        className={`${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`} 
                        disabled={disableCheck}
                        onClick={() => { setDisable(true); openGame(); timer }}>
                        <div className={`${Common.ButtonVoidClasses.contents}`}>{locale.Strings.PLAY()}</div>
                    </button>
                </div>
            </div>
        }</Common.Popout>
    )
}

export function LauncherEmptyBuilder() {
    return (
        <div className={Utils.className((Data.load('v2Dock') ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock, MainClasses.emptyState)}>
            <svg className={QuickLauncherClasses.emptyIcon} name="OpenExternal" width={16} height={16} viewBox="0 0 24 24">
                <path fill="currentColor" transform="translate(3, 4)" d="M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" />
            </svg>
            <div className={MainClasses.emptyText}>{locale.Strings.QUICK_LAUNCHER_EMPTY()}</div>
        </div>
    )
}

export function QuickLauncherBuilder(props) {
    const runningGames = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getRunningGames());
    const gameList = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getGamesSeen());
    const _gameList = gameList.filter(game => GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0])).slice(0, 12);

    return (
        <div {...props}>
            <SectionHeader label={locale.Strings.QUICK_LAUNCHER()} />
            {   
                gameList.length === 0 || (Data.load('freezeDock') ?? settings.default.freezeDock)
                ?
                    <LauncherEmptyBuilder />
                : 
                    <div className={Utils.className((Data.load('v2Dock') ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock)}>
                        {_gameList.map(game => <LauncherGameBuilder game={game} runningGames={runningGames} />)}
                    </div>
            }
        </div>
    )
}