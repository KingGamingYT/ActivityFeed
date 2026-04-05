import { Common } from "@modules/common";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

export default function ({user}) {
    return (
        <button 
            type="button" 
            className={`${MainClasses.button} ${Common.ButtonVoidClasses.button} ${Common.ButtonVoidClasses.sizeSmall} ${Common.ButtonVoidClasses.lookFilled}`} 
            onClick={() => Common.OpenDM.openPrivateChannel({recipientIds: user.id})}
        >{Common.intl.intl.formatToPlainString(Common.intl.t['zROXEV'])}</button>
    )
}