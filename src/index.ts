import { Webpack, Data, Patcher, DOM, Utils, Components, ReactUtils } from "betterdiscord";
import { createElement, useState } from "react";
import settings from "./settings/settings.js";
import { container, Common, ControllerIcon, layoutUtils, NavigationUtils, Router } from "./modules/common.js";
import NewsStore from "./activity_feed/Store.js";
import { activityPanelCSS } from "./activity_feed/styles.js";
import { TabBaseBuilder } from "./activity_feed/base.js";
import { SettingsPanelBuilder } from "./settings/builder.js";
import styleModule, { css } from "./activity_feed/ActivityFeed.module.css"; 
import styles from "styles";
import { extraCSS } from "./activity_feed/extra";

function useSelectedState() {
    return Router.useLocation().pathname.startsWith("/activity-feed");
}

function NavigatorButton() {
    
    return createElement(Common.LinkButton, 
        { 
            selected: useSelectedState(), 
            route: "/activity-feed", 
            text: "Activity", 
            icon: () => { return createElement(Common.Icons.GameControllerIcon, { color: "currentColor", className: Common.LinkButtonClasses.linkButtonIcon }) }
        }
    )
}

const panelObj =
layoutUtils.Panel("activity_feed_panel",
    {
        buildLayout: () => [],
        key: "activity_feed_panel",
        StronglyDiscouragedCustomComponent: () => createElement(SettingsPanelBuilder),
        type: 3,
        useTitle: () => "Activity Feed",
    }
);

const sidebarItem =
layoutUtils.Button("activity_feed_sidebar_item", 
    {
        buildLayout: () => [panelObj],
        icon: () => createElement('svg', {
            className: "newspaperIcon_267ac", 
            role: "img", 
            width: "20", 
            height: "20", 
            fill: "none", 
            viewBox: "0 0 24 24", 
            stroke: "currentColor", 
            strokeWidth: "2", 
            strokeLinecap: "round", 
            strokeLinejoin: "round" 
        }, [
            createElement('defs', {},
                createElement('mask', { id: "newspaper-mask" }, [
                    createElement('rect', { width: 24, height: 24, fill: "#fff", stroke: "none" }),
                    createElement('g', {stroke: "#000"}, [
                        createElement('path', { d: "M15 18h-5" }),
                        createElement('path', { d: "M18 14h-8" }),
                        createElement('path', { d: "M10 6h8v4h-8V6Z" })
                    ])
                ])
            ),
            createElement('path', { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z", fill: "currentColor", mask: "url(#newspaper-mask)" }),
            createElement('path', { d: "M4 22a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" }),
        ]),
        key: "activity_feed_sidebar_item",
        legacySearchKey: "ACTIVITY_FEED",
        type: 2,
        useTitle: () => "Activity Feed"
    }
);

export default class ActivityFeed {
    GameNewsStore = NewsStore
    async start() {
        //Patcher.after("ActivityFeed", FluxDispatcher, "dispatch", (that, props, res) => console.log(props))
        NewsStore.blacklist = Data.load('whitelist');
        NewsStore.blacklist = Data.load('blacklist');
        if ( NewsStore.shouldFetch() === true ) await NewsStore.fetchFeeds();

        const Route = Webpack.getByStrings('disableTrack', 'impressionName');
        if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
            NavigationUtils.transitionTo('/channels/@me')
        }

        function NewType(props) {
            const ret = NewType._(props);

            const { children } = Utils.findInTree(ret, (node) => node && node.children?.length > 5, { walkable: [ "children", "props" ] });
            
            const index = children.findIndex(m => m.key === "activity-feed");
            if (~index) { children.splice(index, 1); }            

            children.push(
                createElement(Route, {
                    disableTrack: true,
                    path: "/activity-feed",
                    render: () => TabBaseBuilder(),
                    exact: true,
                    key: "activity-feed"
                })
            )
            
            return ret;
        }

        //console.log(activityPanelCSS)
        DOM.addStyle('activityPanelCSS', styles());
        DOM.addStyle('activityPanelSupplementalCSS', extraCSS)

        Patcher.after(Common.DMSidebar, "A", (that, [props], res) => {
            const panel = Utils.findInTree(res, m => m?.homeLink, { walkable: [ "props", "children" ] });
            const selected = useSelectedState();

            if (selected) {
                for (const child of panel.children) {
                    const link = Utils.findInTree(child, m => m && typeof m === "object" && "selected" in m, { walkable: [ "props", "children" ] });
                    if (link) {
                        link.selected = false;
                    }
                }
            }

            const index = panel.children.findIndex(m => m?.key === "activityCenter_button");
            if (index !== -1) return;

            panel.children.unshift(
                createElement(NavigatorButton, {key: "activityCenter_button"})
            );
        });

        Patcher.after(Webpack.getByPrototypeKeys("handleHistoryChange", "ensureChannelMatchesGuild").prototype, "render", (that, args, res) => {
            const channelRouteProps = Utils.findInTree(res, (node) => node && node.path?.length > 5, { walkable: [ "children", "props" ] });
            //console.log(res)

            channelRouteProps.path = [
                ...channelRouteProps.path.filter(m => m !== "/activity-feed"),
                "/activity-feed"
            ]
        });

        Patcher.after(Common.RootSectionModule, "buildLayout", (that, [props], res) => {
            const section = Utils.findInTree(res, (tree) => Object.values(tree).includes('activity_section'), { walkable: ['props', 'children'] })
            Patcher.after(section, "buildLayout", (that, [props], res) => {
                if (!Utils.findInTree(res, (tree) => Object.values(tree).includes('activity_feed_sidebar_item', { walkable: ['props', 'children'] } ))) {
                    res.push(sidebarItem);
                }
                return res;
            })
        })
        
        function fu() {
            const appI = ReactUtils.getOwnerInstance(document.querySelector("div[class^=app_] > div[class^=app_]"), {
                filter: m => typeof m.ensureChannelMatchesGuild === "function"
            });
            
            console.log("fu()");
            if (appI) {
                appI.forceUpdate(() => {
                    const inst = ReactUtils.getOwnerInstance(document.querySelector(`.${container}`));

                    Patcher.after(inst, "render", (that, args, res) => {
                        NewType._ ??= res.props.children.type;

                        res.props.children.type = NewType;
                    });

                    inst?.forceUpdate(() => {
                        console.log("inst.forceUpdate");
                        
                        appI.forceUpdate();
                        inst.forceUpdate();
                    });
                });
            };
        }

        fu();

        {
            const appMount = document.getElementById("app-mount");

            const reactContainerKey = Object.keys(appMount).find(m => m.startsWith("__reactContainer$"));

            let container = appMount[reactContainerKey];

            while (!container.stateNode?.isReactComponent) {
                container = container.child;
            }

            container = container.child;

            while (!container.stateNode?.isReactComponent) {
                container = container.child;
            }

            Patcher.after(container.stateNode, "render", fu);

            const undo = Patcher.after(container.stateNode, "render", () => {
                undo();
                fu();
            });
        }
    }
    stop() {
        Patcher.unpatchAll('ActivityFeed');
        DOM.removeStyle('activityFeedCSS');
        ReactUtils.getOwnerInstance(document.querySelector(`.${container}`)).forceUpdate();
    }

    getSettingsPanel() {
        return [
            createElement(() => Object.keys(settings.main).map((key) => {
                const { name, note, initial, changed } = settings.main[key];
                const [state, setState] = useState(Data.load(key));

                return createElement(Common.FormSwitch, {
                    label: name,
                    description: note,
                    checked: state ?? initial,
                    onChange: (v) => {
                        Data.save(key, v);
                        setState(v);
                        if (changed)
                            changed(v);
                    }
                });
            }
        )),
        createElement(Components.Text, {size: Components.Text.Sizes.SIZE_16, strong: true, style: { borderTop: "thin solid var(--border-subtle)", paddingTop: "var(--space-12)", paddingBottom: "var(--space-12)"}}, "Activity Feed"),
        createElement(Components.SettingGroup, {
            name: "Games You've Hidden",
            collapsible: true,
            shown: false,
            children: [
                createElement('div', { className: "blacklist_267ac emptyState_267ac", style: { padding: 0, borderBottom: "unset" }}, 
                    createElement('div', { className: "emptyText_267ac" }, "Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Below are the games you have hidden.")
                )/*),
                createElement(BlacklistBuilder) 
                */
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
                        const [state, setState] = useState(Data.load(key));

                        if (type === "switch") {
                            return createElement(Common.FormSwitch, {
                                label: name,
                                description: note,
                                checked: state ?? initial,
                                onChange: (v) => {
                                    Data.save(key, v);
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
                                    className: `button_267ac unhideBlacklisted_267ac ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`, 
                                    onClick: () => NewsStore.displaySet = NewsStore.getRandomFeeds(NewsStore.dataSet)},
                                    "Reroll"
                                )
                            ])
                        )
                    }))
                ),
        })]
    }
}