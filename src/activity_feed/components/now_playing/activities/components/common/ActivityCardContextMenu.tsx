import { ContextMenu, Hooks } from "betterdiscord";
import { Common } from "@modules/common";
import { ApplicationStore, useStateFromStores } from "@modules/stores";
import { handleApplicationClick } from "./ActivityButtons";
import locale from "@activity_feed/common/methods/locale";
import NewsStore from "@activity_feed/Store";

export function ActivityCardContextMenu({user, currentActivity, currentGame}) {
    switch(currentActivity.type) {
        case 0: {
            let id = currentActivity?.application_id ?? currentGame?.id;
            if (isNaN(id)) id = undefined; 
            const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: id});
            let application = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplicationByName(currentGame.name));
            if (application.type == null) application = ApplicationStore.getApplication(id);
            const handleClick = handleApplicationClick({user, activity: currentActivity, application: currentGame});

            const isFollowed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(application.id ?? currentActivity?.application_id));
            const isWhitelisted = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameWhitelisted(application.id ?? currentActivity?.application_id));

            return (
                <ContextMenu.Menu navId="activity-context" onClose={(e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e)}>
                    <ContextMenu.Item id="open-game-profile" label={locale.Strings.OPEN_GAME_PROFILE()} action={handleClick ?? useGameProfile} disabled={!handleClick || !useGameProfile} />
                    <ContextMenu.CheckboxItem 
                        id="follow-game" 
                        label={locale.Strings.SHOW_ON_ACTIVITY_FEED()} 
                        checked={isFollowed || isWhitelisted} 
                        disabled={!currentGame || application.type == null}
                        action={
                            (isFollowed || isWhitelisted) ? () => NewsStore.blacklistGame(application ?? {id: currentActivity?.application_id})
                            : () => NewsStore.followGame(application ?? currentGame)
                        } 
                    />
                </ContextMenu.Menu>
            )
        }
        default: Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }); return;
    }
}