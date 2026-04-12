import { Data } from "betterdiscord";
import { useState } from "react";
import { Common } from "@modules/common";
import { ButtonItem, RadioItem } from '../common';
import settings from "@settings/settings";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

export function AdvancedSection() {
    return (
        <div className={SettingsClasses.toggleStack}>
            {Object.keys(settings.debug).map((key) => {
                const { name, note, innerText, initial, type, changed, options, onClick } = settings.debug[key];
                const [state, setState] = useState(Data.load(key));

                switch(type) {
                    case "switch": return <Common.FormSwitch
                        label={name}
                        description={note}
                        checked={state ?? initial}
                        onChange={(v) => {
                            Data.save(key, v);
                            setState(v);
                            if (changed) changed(v);
                        }}
                    />
                    case "radio": return <RadioItem 
                        optionKey={key}
                        label={name}
                        description={note}
                        options={options}
                        setting={state ?? initial}
                        setState={() => setState}
                    />
                    case "button": return <ButtonItem 
                        label={name}
                        description={note}
                        innerText={innerText}
                        onClick={onClick}
                    />
                    default: return;
                }
            })}
        </div>
    )
}