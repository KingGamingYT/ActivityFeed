import { Utils } from "betterdiscord";
import { useState } from "react";
import { Common } from "@modules/common";
import { ApplicationStore } from "@modules/stores";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NewsStore from "@activity_feed/Store";

export default function ({application, fullWidth}) {
    const [followedGames, updateFollowStatus] = useState(NewsStore.getManuallyFollowedGames());
    const isFollowed = NewsStore.isGameFollowed(ApplicationStore.getApplicationByName(application.name) ?? application.id);

    return (
        (isFollowed || NewsStore.isGameWhitelisted(ApplicationStore.getApplicationByName(application.name)?.id ?? application.id)) ? <button 
            type="button" 
            className={Utils.className(MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled )}
            disabled
        >Followed</button>
        : <button 
            type="button" 
            className={Utils.className(MainClasses.button, Common.ButtonVoidClasses.button, Common.ButtonVoidClasses.sizeSmall, fullWidth && Common.ButtonVoidClasses.fullWidth, Common.ButtonVoidClasses.lookFilled )}
            onClick={() => {NewsStore.followGame(application); updateFollowStatus(followedGames.filter(item => item.applicationId !== application.id))}}
        >{Common.intl.intl.formatToPlainString(Common.intl.t['3aOv+h'])}</button>
    )
}