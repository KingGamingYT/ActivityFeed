import { Utils, Data, ContextMenu, ReactUtils } from 'betterdiscord';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Common, shell } from '@modules/common';
import { ApplicationStore, ConnectedAppsStore, DispatchApplicationStore, GameStore, LaunchableGameStore, LibraryApplicationStore, RunningGameStore, UserSettingsProtoStore, useStateFromStores } from '@modules/stores';
import SectionHeader from '@activity_feed/common/components/SectionHeader';
import locale from "@activity_feed/common/methods/locale";
import settings from "@settings/settings";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import QuickLauncherClasses from "./QuickLauncher.module.css";

function openApplication(application: any, libraryApplication: any, gameEntry: any) {
        console.log(application, gameEntry)
        const skus = application.thirdPartySkus;
        const isSteam = Object.values(skus).find((x: any) => x.distributor.toLowerCase().includes('steam'));
        const canPlay = Common.IsGameLaunchable({LibraryApplicationStore, LaunchableGameStore, DispatchApplicationStore, ConnectedAppsStore, applicationId: application?.id});
        const items = gameEntry.exePath.split('/');
        switch(true) {
            case !! canPlay: Common.LibraryApplicationUtils.playApplication(application?.id, libraryApplication, {}); break;
            case !! !!isSteam && ["steamapps", "steamlibrary"].some(item => items.includes(item)): shell.openExternal(`steam://run/${isSteam.id}`); break;
            default: shell.openExternal(gameEntry.exePath);
        }
    }

function DockApplicationContextMenu({application, libraryApplication, gameEntry, state}) {
    const setDisable = state;
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: application?.id});
    return (
        <ContextMenu.Menu navId="launcher-context-menu" onClose={() => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" })}>
            <ContextMenu.Item id="play-game" label={locale.Strings.PLAY_GAME()} action={() => { setDisable(true); openApplication(application, libraryApplication, gameEntry); }} />
            <ContextMenu.Item id="open-game-profile" label={locale.Strings.OPEN_GAME_PROFILE()} action={useGameProfile} disabled={!useGameProfile} />
            {UserSettingsProtoStore.settings.appearance.developerMode && <ContextMenu.Item id="copy-app-id" label={locale.Strings.COPY_APPLICATION_ID()} action={() => Common.Clipboard(application.id)} />}
        </ContextMenu.Menu>
    )
}

export function ApplicationDock({applications, gameHistoryEntries, storedGameEntries, runningGames}: {applications: any, gameHistoryEntries: any, storedGameEntries: any, runningGames: any}) {
    const handleApplicationClick = useCallback((e, application) => {
        const useGameProfile = ReactUtils.wrapInHooks(Common.GameProfileCheck)({trackEntryPointImpression: false, applicationId: application.id});

        return useGameProfile();
    }, []);

    const handleApplicationContextMenu = useCallback((e, application, libraryApplication, gameEntry, state) => { 
        ContextMenu.open(e, (props) => <DockApplicationContextMenu {...props} application={application} libraryApplication={libraryApplication} gameEntry={gameEntry} state={state} />) 
    }, []);

    return applications.map((application, index) => {
        const gameHistoryEntry = gameHistoryEntries[index];
        const storedGameEntry = storedGameEntries[index];
        const [shouldDisable, setDisabled] = useState(false);
        const disableCheck = useMemo(() => runningGames.findIndex(m => m.name === gameHistoryEntry.name) != -1 || shouldDisable, [runningGames, shouldDisable]);
        const refDOM = useRef(null);
        const libraryApplication = new Common.BasicLibraryApplication({application});

        useEffect(() => {
            const delay = setTimeout(() => setDisabled(false), 1e4);
            return () => clearTimeout(delay)
        }, []);

        return (
            <Common.Flex align={Common.Flex.Align.CENTER} className={QuickLauncherClasses.dockItem} direction={Common.Flex.Direction.VERTICAL} onClick={e => e.shiftKey && !disableCheck && handleApplicationContextMenu(e, application, libraryApplication, gameHistoryEntry, setDisabled)} ref={refDOM} style={{ flex: "0 0 auto" }} key={storedGameEntry.id}>
                <div className={Utils.className(QuickLauncherClasses.dockIcon, disableCheck && QuickLauncherClasses.dockIconDisabled)} style={{ backgroundImage: `url(${Common.AvatarUtils.getApplicationIconURL({id: application?.id, icon: application?.icon, size: 64})})` }} onClick={e => e.shiftKey && !disableCheck ? handleApplicationContextMenu(e, application, libraryApplication, gameHistoryEntry, setDisabled) : handleApplicationClick(e, application)} />
                <div className={QuickLauncherClasses.dockItemText}>{gameHistoryEntry.name}</div>
                <button 
                    className={`${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`} 
                    disabled={disableCheck}
                    onClick={() => { setDisabled(true); openApplication(application, libraryApplication, gameHistoryEntry); }}>
                    <div className={`${Common.ButtonVoidClasses.contents}`}>{locale.Strings.PLAY()}</div>
                </button>
            </Common.Flex>
        )
    });
}