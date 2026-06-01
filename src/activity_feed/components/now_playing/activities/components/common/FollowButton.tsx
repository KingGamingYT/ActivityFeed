import { Utils, Hooks } from "betterdiscord";
import { Common } from "@modules/common";
import { ApplicationStore, useStateFromStores } from "@modules/stores";
import locale from "@common/methods/locale";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import NewsStore from "@activity_feed/Store";

export default function ({application, fullWidth=false}) {
    const originalApplication = useStateFromStores([ApplicationStore], () => ApplicationStore.getApplicationByName(application.name));
    const isFollowed = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameFollowed(originalApplication?.id ?? application.id));
    const isWhitelisted = Hooks.useStateFromStores([NewsStore], () => NewsStore.isGameWhitelisted(originalApplication?.id ?? application.id));

    return (
        (isFollowed || isWhitelisted) ? <button 
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