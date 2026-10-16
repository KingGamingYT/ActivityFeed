import { Common } from "@modules/common";
import ActivityFeedSettingsButton from "./ActivityFeedSettingsButton";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

export default function ButtonItem({label, description, innerText, onClick}) {
    return (
        <div className={SettingsClasses.buttonItem}>
            <Common.Flex direction={Common.Flex.Direction.VERTICAL}>
                <div className={SettingsClasses.itemSettingLabel}>{Common.SimpleMarkdownWrapper.parse(label)}</div>
                {description && <div className={SettingsClasses.itemSettingDescription}>{Common.SimpleMarkdownWrapper.parse(description)}</div>}
            </Common.Flex>
            <ActivityFeedSettingsButton color={"text-subtle"} onClick={onClick} text={innerText} />
        </div>
    )
}