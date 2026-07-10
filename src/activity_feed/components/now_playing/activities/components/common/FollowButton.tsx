import { Utils, Hooks } from "betterdiscord";
import { Common } from "@modules/common";
import { ApplicationStore, useStateFromStores } from "@modules/stores";
import locale from "@common/methods/locale";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import NewsStore from "@activity_feed/GameNewsStore";

interface FollowButton {
    application: any,
    fullWidth?: boolean
}

export default function ({application, fullWidth=false}: FollowButton) {
    const originalApplication = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplicationByName(application.name));
    const followed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(originalApplication?.id ?? application?.id));

    return (
        followed ? <button 
            type="button" 
            className={Utils.className(NowPlayingClasses.followGameButtonActivityFeed, MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled, Common.ButtonVoidClasses.grow )}
            disabled
        ><div className={NowPlayingClasses.contents}>{locale.Strings.FOLLOWING()}</div></button>
        : <button 
            type="button" 
            className={Utils.className(NowPlayingClasses.followGameButtonActivityFeed, MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled, Common.ButtonVoidClasses.grow )}
            onClick={() => NewsStore.followGame(application)}
        ><div className={NowPlayingClasses.contents}>{locale.Strings.FOLLOW()}</div></button>
    )
}