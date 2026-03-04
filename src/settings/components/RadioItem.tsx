import { Components, Data } from "betterdiscord";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "../ActivityFeedSettings.module.css";

export default function RadioItem({optionKey, label, description, options, setting, setState}) {
    return (
        <div className={SettingsClasses.radioItem}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, marginBottom: "var(--space-10)" }}>
                <div className={`${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`} style={{ fontWeight: 500, fontSize: "16px", color: "var(--text-strong)" }}>{label}</div>
                {description && <div className={NowPlayingClasses.textRow}>{description}</div>}
            </div>
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