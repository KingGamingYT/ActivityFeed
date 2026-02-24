import { useState } from 'react';
import { Components, Data } from "betterdiscord";
import { Common } from "@modules/common";
import { FollowedGameListBuilder, ExternalSourcesListBuilder } from "./followed_games";
import settings from "./settings"; 
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "../settings/ActivityFeedSettings.module.css";

export function SettingsPanelBuilder() {
    return (
        <>
            <Common.ManaSwitch checked={false} />
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
            <div className={`${SettingsClasses.settingsDivider} ${MainClasses.sectionDivider}`} />
            <Components.SettingGroup name="Games You Follow" collapsible={false} shown={true}>
                <div className={`${SettingsClasses.blacklist} ${MainClasses.emptyState}`}>
                    <div className={MainClasses.emptyText}>Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.</div>
                </div>
                <FollowedGameListBuilder />
            </Components.SettingGroup>
            <Components.SettingGroup name="External News" collapsible={false} shown={true}>
                <div className={`${SettingsClasses.blacklist} ${MainClasses.emptyState}`}>
                    <div className={MainClasses.emptyText}>News from external sources outside of your game library.</div>
                </div>
                <ExternalSourcesListBuilder />
            </Components.SettingGroup>
            <Components.SettingGroup name="Advanced/Debug" collapsible={true} shown={false}>
                <div className={SettingsClasses.toggleStack}>
                    {Object.keys(settings.debug).map((key) => {
                        const { name, note, initial, type, changed } = settings.debug[key];
                        const [state, setState] = useState(Data.load(key));

                        if (type === "switch") return <Common.FormSwitch
                            label={name}
                            description={note}
                            checked={state ?? initial}
                            onChange={(v) => {
                                Data.save(key, v);
                                setState(v);
                                if (changed) changed(v);
                            }}
                        />
                        if (type === "button") return <div className={SettingsClasses.buttonItem}>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <div className={`${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`} style={{ fontWeight: 500, fontSize: "16px", color: "var(--text-default)" }}>{name}</div>
                                <div className={NowPlayingClasses.textRow}>{note}</div>
                            </div>
                            <button
                                className={`${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${MainClasses.button} ${SettingsClasses.unhideBlacklisted}`}
                                onClick={() => NewsStore.rerollFeeds()} // needs to be fixed    
                            >Reroll</button>
                        </div>
                        return;
                    })}
                </div>
            </Components.SettingGroup>
        </>
    )
}