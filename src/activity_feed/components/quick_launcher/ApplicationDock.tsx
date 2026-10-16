import { Utils, Data, ContextMenu, ReactUtils } from 'betterdiscord';
import { useCallback } from 'react';
import { Common, shell } from '@modules/common';
import { ConnectedAppsStore, DispatchApplicationStore, LaunchableGameStore, LibraryApplicationStore, UserSettingsProtoStore } from '@modules/stores';
import locale from "@activity_feed/common/methods/locale";
import settings from "@settings/settings";
import QuickLauncherClasses from "@quick_launcher/QuickLauncher.module.css";

function openApplication(application: any, libraryApplication: any) {
        const skus = application.thirdPartySkus;
        const isSteam = Object.values(skus).find((x: any) => x.distributor.toLowerCase().includes('steam'));
        const canPlay = Common.IsGameLaunchable({LibraryApplicationStore, LaunchableGameStore, DispatchApplicationStore, ConnectedAppsStore, applicationId: application?.id});
        switch(true) {
            case !! canPlay: Common.LibraryApplicationUtils.playApplication(application?.id, libraryApplication, {}); break;
            case !! !!isSteam && ["steamapps", "steamlibrary"].some(item => items.includes(item)): shell.openExternal(`steam://run/${isSteam.id}`); break;
            default: return;
        }
    }

function DockApplicationContextMenu({application, libraryApplication}) {
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: application?.id});
    return (
        <ContextMenu.Menu navId="launcher-context-menu" onClose={() => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" })}>
            <ContextMenu.Item id="play-game" label={locale.Strings.PLAY_GAME()} action={() => { openApplication(application.application, libraryApplication); }} />
            <ContextMenu.Item id="open-game-profile" label={locale.Strings.OPEN_GAME_PROFILE()} action={useGameProfile} disabled={!useGameProfile} />
            {UserSettingsProtoStore.settings.appearance.developerMode && <ContextMenu.Item id="copy-app-id" label={locale.Strings.COPY_APPLICATION_ID()} action={() => Common.Clipboard(application.id)} />}
        </ContextMenu.Menu>
    )
}

function DockFlexItem({application}: {application: any}) {
    const handleApplicationContextMenu = useCallback((e, application, libraryApplication) => { 
        ContextMenu.open(e, (props) => <DockApplicationContextMenu {...props} application={application} libraryApplication={libraryApplication} />) 
    }, []);
    const handleGameProfileOpen = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: application?.id});
    return (
        <Common.Flex align={Common.Flex.Align.CENTER} className={QuickLauncherClasses.dockItem} direction={Common.Flex.Direction.VERTICAL} onClick={e => e.shiftKey && !application.disabled && handleApplicationContextMenu(e, application.application, application.libraryApplication)} style={{ flex: "0 0 auto" }} key={application.id}>
            <div className={Utils.className(QuickLauncherClasses.dockIcon, application.disabled && QuickLauncherClasses.dockIconDisabled)} style={{ backgroundImage: `url(${application.iconSrc})` }} onClick={e => e.shiftKey && !application.disabled ? handleApplicationContextMenu(e, application.application, application.libraryApplication) : handleGameProfileOpen()} />
            <div className={QuickLauncherClasses.dockItemText}>{application.name}</div>
            <button 
                className={`${QuickLauncherClasses.dockItemPlay} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorGreen} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.fullWidth} ${Common.ButtonVoidClasses.grow}`} 
                disabled={application.disabled}
                onClick={() => { openApplication(application.application, application.libraryApplication); }}>
                <div className={`${Common.ButtonVoidClasses.contents}`}>{locale.Strings.PLAY()}</div>
            </button>
        </Common.Flex>
    )
}

export function ApplicationDock({applications}: {applications: any}) {
    return (
        <div className={Utils.className((Data.load('v2Dock') ?? settings.default.v2Dock) && QuickLauncherClasses.dockV2, QuickLauncherClasses.dock)}>{applications.map((application) => 
            <DockFlexItem application={application} />
        )}</div>
    );
}