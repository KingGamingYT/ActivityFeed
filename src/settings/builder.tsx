import { useState } from 'react';
import { Components, Data } from "betterdiscord";
import { Common } from "@modules/common";
import { FollowedGameListBuilder, ExternalSourcesListBuilder } from "./followed_games";
import { ButtonItem, RadioItem } from './components';
import settings from "./settings"; 
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "../settings/ActivityFeedSettings.module.css";

export function SettingsPanelBuilder() {
    return (
        <>
            <Common.ManaSwitch checked={false} />
            <Components.SettingGroup name="Visual Refresh" collapsible={false} shown={true}>
                <div className={`${SettingsClasses.blacklist} ${MainClasses.emptyState}`}>
                    <div className={MainClasses.emptyText}>Modern styling toggles for each part of the Activity Feed.</div>
                </div>
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
            </Components.SettingGroup>
            <div className={`${SettingsClasses.settingsDivider} ${MainClasses.sectionDivider}`} />
            <Components.SettingGroup name="Games You Follow" collapsible={false} shown={true}>
                <div className={`${SettingsClasses.blacklist} ${MainClasses.emptyState}`}>
                    <div className={MainClasses.emptyText}>Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.</div>
                </div>
                <FollowedGameListBuilder />
            </Components.SettingGroup>
            <Components.SettingGroup name="External News" collapsible={false} shown={true}>
                <div className={`${SettingsClasses.external} ${SettingsClasses.blacklist} ${MainClasses.emptyState}`}>
                    <div className={MainClasses.emptyText}>News from external sources outside of your game library.</div>
                </div>
                <ExternalSourcesListBuilder />
            </Components.SettingGroup>
            <Components.SettingGroup name="Advanced/Debug" collapsible={true} shown={false}>
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
            </Components.SettingGroup>
        </>
    )
}