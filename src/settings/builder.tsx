import { useState } from 'react';
import { Components, Data } from "betterdiscord";
import { Common } from "@modules/common";
import { BlacklistBuilder } from "./followed_games/FollowBuilder";
import settings from "./settings"; 
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "@./settings/ActivityFeedSettings.module.css";

export function SettingsPanelBuilder() {
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
            <div className={`${SettingsClasses.settingsDivider} ${MainClasses.sectionDivider}`} />
            <Components.SettingGroup name="Games You Follow" collapsible={false} shown={true}>
                <div className={`${SettingsClasses.blackList} ${SettingsClasses.emptyState}`}>
                    <div className={MainClasses.emptyText}>Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.</div>
                </div>
                <BlacklistBuilder />
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
                                onClick={() => NewsStore.displaySet = NewsStore.getRandomFeeds(NewsStore.dataSet)} // needs to be fixed    
                            >Reroll</button>
                        </div>
                        return;
                    })}
                </div>
            </Components.SettingGroup>
        </>
    )
}
/*
function NotSettingsPanelBuilder() {
    return [
        createElement('div', { className: "toggleStack_267ac", style: { padding: "var(--space-16) 0 var(--space-16) 0" }},
            createElement(() => Object.keys(settings.main).map((key) => {
                const { name, note, initial, changed } = settings.main[key];
                const [state, setState] = useState(Data.load('ACTest', key));

                return createElement(FormSwitch, {
                    label: name,
                    description: note,
                    checked: state ?? initial,
                    onChange: (v) => {
                        Data.save('ACTest', key, v);
                        setState(v);
                        if (changed)
                            changed(v);
                    }
                });
            }))
        ),
        createElement('div', { className: "settingsDivider_267ac sectionDivider_267ac", style: { marginBottom: "var(--space-12)" } }),
        createElement(Components.SettingGroup, {
            name: "Games You've Hidden",
            collapsible: false,
            shown: true,
            children: [
                createElement('div', { className: "blacklist_267ac emptyState_267ac", style: { padding: 0, borderBottom: "unset", lineHeight: "1.60" }}, 
                    createElement('div', { className: "emptyText_267ac" }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Below are the games you have hidden.")
                ),
                createElement(BlacklistBuilder) 
            ]
        }),
        createElement(Components.SettingGroup, {
            name: "Advanced/Debug",
            collapsible: true,
            shown: false,
            children: 
                createElement('div', { className: "toggleStack_267ac", style: { padding: "var(--space-16) 0 var(--space-16) 0" }},
                    createElement(() => Object.keys(settings.debug).map((key) => {
                        const { name, note, initial, type, changed } = settings.debug[key];
                        const [state, setState] = useState(Data.load('ACTest', key));

                        if (type === "switch") {
                            return createElement(FormSwitch, {
                                label: name,
                                description: note,
                                checked: state ?? initial,
                                onChange: (v) => {
                                    Data.save('ACTest', key, v);
                                    setState(v);
                                    if (changed)
                                        changed(v);
                                }
                            });
                        }
                        return (
                            createElement('div', { className: "buttonItem_267ac", style: { display: "flex" }}, [
                                createElement('div', { style: { display: "flex", flexDirection: "column", flex: 1 }}, [
                                    createElement('div', { className: "blacklistItemName_267ac textRow_267ac", style: { fontWeight: 500, fontSize: "16px", color: "var(--text-primary)" } }, name),
                                    createElement('div', { className: "textRow_267ac" }, note)
                                ]),
                                createElement('button', { 
                                    className: `button_267ac unhideBlacklisted_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.colorPrimary} ${ButtonVoidClasses.sizeTiny} ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, 
                                    onClick: () => NewsStore.displaySet = NewsStore.getRandomFeeds(NewsStore.dataSet)},
                                    "Reroll"
                                )
                            ])
                        )
                    }))
                ),
        })
    ]
}
*/