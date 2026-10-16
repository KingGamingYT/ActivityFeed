import { Components, Data } from "betterdiscord";
import { Common } from "@modules/common";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

export default function RadioItem({optionKey, label, description, options, setting, setState}) {
    return (
        <div className={SettingsClasses.radioItem}>
            <Common.Flex direction={Common.Flex.Direction.VERTICAL}>
                <div className={SettingsClasses.itemSettingLabel}>{Common.SimpleMarkdownWrapper.parse(label)}</div>
                {description && <div className={SettingsClasses.itemSettingLabel}>{Common.SimpleMarkdownWrapper.parse(description)}</div>}
            </Common.Flex>
            <Components.RadioInput 
                value={setting}
                options={options}
                onChange={(v) => {
                    Data.save(optionKey, v);
                    setState(v);                                            
                }}
            />
        </div>
    )
}