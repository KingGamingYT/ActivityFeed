import { Common } from "@modules/common";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

interface ActivityFeedSettingsButton {
    color: String,
    text: String,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function ({color, onClick, text}: ActivityFeedSettingsButton) {
    return (
        <Common.Flex grow={true}> 
            <button
                className={`${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${MainClasses.button} ${SettingsClasses.unfollowButton}`}
                onClick={onClick}
                style={{color: `var(--${color})`}}
            >{text}</button>
        </Common.Flex>
    )
}