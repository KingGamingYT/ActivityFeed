import { createElement } from 'react';


export function SettingsPanelBuilder() {
    return;
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