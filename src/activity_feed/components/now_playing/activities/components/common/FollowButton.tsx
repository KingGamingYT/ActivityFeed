import { Utils } from "betterdiscord";
import { useState } from "react";
import { Common } from "@modules/common";
import { ApplicationStore } from "@modules/stores";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import NewsStore from "@activity_feed/Store";

export default function ({application, fullWidth=false}) {
    const [followedGames, updateFollowStatus] = useState(NewsStore.getManuallyFollowedGames());
    const isFollowed = NewsStore.isGameFollowed(ApplicationStore.getApplicationByName(application.name)?.id ?? application.id);

    return (
        (isFollowed || NewsStore.isGameWhitelisted(ApplicationStore.getApplicationByName(application.name)?.id ?? application.id)) ? <button 
            type="button" 
            className={Utils.className(NowPlayingClasses.followGameButtonActivityFeed, MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled, Common.ButtonVoidClasses.grow )}
            disabled
        ><div className={NowPlayingClasses.contents}>{Common.intl.intl.formatToPlainString(Common.intl.t['w1IVQk'])}</div></button>
        : <button 
            type="button" 
            className={Utils.className(NowPlayingClasses.followGameButtonActivityFeed, MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled, Common.ButtonVoidClasses.grow )}
            onClick={() => {NewsStore.followGame(application); updateFollowStatus(followedGames.filter(item => item.applicationId !== application.id))}}
        ><div className={NowPlayingClasses.contents}>{Common.intl.intl.formatToPlainString(Common.intl.t['3aOv+h'])}</div></button>
    )
}