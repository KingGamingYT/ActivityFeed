import { Data, Plugins } from "betterdiscord";
import { useState } from "react";
import { Common } from "@modules/common";
import settings from "@settings/settings";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

export function RefreshSection() {
    return (
        <>
            <div className={SettingsClasses.toggleStack}>
                {Object.keys(settings.main).map((key) => {
                    const { name, note, initial, changed } = settings.main[key];
                    const [state, setState] = useState(Data.load(key));

                    return <Common.FormSwitch
                        label={name}
                        description={note}
                        checked={state ?? initial}
                        onChange={(v) => {
                            Data.save(key, v);
                            setState(v);
                            if (changed) changed(v);
                        }}
                    />
                })}
            </div>
        </>
    )
}