import ActivityFeedSettingsButton from "./ActivityFeedSettingsButton";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

export default function ButtonItem({label, description, innerText, onClick}) {
    return (
        <div className={SettingsClasses.buttonItem}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className={`${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`} style={{ fontWeight: 500, fontSize: "16px", color: "var(--text-strong)" }}>{label}</div>
                {description && <div className={NowPlayingClasses.textRow}>{description}</div>}
            </div>
            <ActivityFeedSettingsButton color={"text-subtle"} onClick={onClick} text={innerText} />
        </div>
    )
}