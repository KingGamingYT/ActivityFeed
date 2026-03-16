import { Webpack, Data, Patcher, DOM, Utils, Components, ReactUtils } from "betterdiscord";
import { createElement, useState } from "react";
import { container, Common, ControllerIcon, layoutUtils, NavigationUtils, Router } from "./modules/common.js";
import { NewspaperIcon } from "./settings/components/SidebarItemIcon";
import { TabBaseBuilder } from "./activity_feed/base.js";
import { SettingsPanelBuilder } from "./settings/builder.js";
import { IntroCoachmarkPopout } from "@activity_feed/components/coachmark/IntroCoachmark";
import { extraCSS } from "./activity_feed/extra";
import styles from "styles";
import settings from "./settings/settings.js";
import NewsStore from "./activity_feed/Store.js";


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

function CoachmarkWrapper({button})
{
    if (useSelectedState() && !NewsStore.hasDismissedSettingsCoachmark) {
        return createElement(IntroCoachmarkPopout, {button})
    }
    return button;
}

let LayoutTypes = {
    SECTION: 1,
    SIDEBAR_ITEM: 2,
    PANEL: 3,
    CATEGORY: 5,
    CUSTOM: 19,
};

const customObj =
layoutUtils.Custom("activity_feed_custom",
    {
        Component: () => createElement(SettingsPanelBuilder),
        key: "activity_feed_custom",
        type: LayoutTypes.CUSTOM
    }
)

const categoryObj = 
layoutUtils.Category("activity_feed_category",
    {
        buildLayout: () => [customObj],
        key: "activity_feed_sidebar_item",
        type: LayoutTypes.CATEGORY
    }
)

const panelObj =
layoutUtils.Panel("activity_feed_panel",
    {
        buildLayout: () => [categoryObj],
        key: "activity_feed_panel",
        type: LayoutTypes.PANEL,
        useTitle: () => "Activity Feed",
    }
);

const sidebarItem =
layoutUtils.SidebarItem("activity_feed_sidebar_item", 
    {
        buildLayout: () => [panelObj],
        icon: () => createElement(NewspaperIcon),
        key: "activity_feed_sidebar_item",
        getLegacySearchKey: () => "ACTIVITY_FEED",
        useTitle: () => "Activity Feed",
        type: LayoutTypes.SIDEBAR_ITEM
    }
);

export default class ActivityFeed {
    GameNewsStore = NewsStore;
    load () {
        if (window.location.href.endsWith('/channels/@me')) {
            NavigationUtils.transitionTo('/activity-feed');
        }
    }
    async start() {
        NewsStore.whitelist = Data.load('whitelist');
        NewsStore.blacklist = Data.load('blacklist') || [];
        if ( NewsStore.shouldFetch() === true ) await NewsStore.fetchFeeds();

        const Route = Webpack.getByStrings('disableTrack', 'impressionName');

        function NewType(props) {
            const ret = NewType._(props);

            const { children } = Utils.findInTree(ret, (node) => node && node.children?.length > 5, { walkable: [ "children", "props" ] });
            
            const index = children.findIndex(m => m.key === "activity-feed");
            if (~index) { children.splice(index, 1); }            

            children.push(
                createElement(Route, {
                    disableTrack: true,
                    path: "/activity-feed",
                    render: () => createElement(TabBaseBuilder),
                    exact: true,
                    key: "activity-feed"
                })
            )
            
            return ret;
        }

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

            const index = panel.children.findIndex(m => m?.key === "activityFeed_button");
            if (index !== -1) return;

            panel.children.unshift(
                createElement(NavigatorButton, {key: "activityFeed_button"})
            );
        });

        Patcher.before(Common.GameFetchModule,'E', (thisObj, args) => {
            const filtered = args[0].filter(x => !isNaN(x))
            args[0] = filtered
            return args
        })

        Patcher.after(Webpack.getByPrototypeKeys("handleHistoryChange", "ensureChannelMatchesGuild").prototype, "render", (that, args, res) => {
            const channelRouteProps = Utils.findInTree(res, (node) => node && node.path?.length > 5, { walkable: [ "children", "props" ] });

            channelRouteProps.path = [
                ...channelRouteProps.path.filter(m => m !== "/activity-feed"),
                "/activity-feed"
            ]
            return res;
        });

        Patcher.after(Common.ActivitySectionModule, "buildLayout", (that, [props], res) => {
            if (!Utils.findInTree(res, (tree) => Object.values(tree).includes('activity_feed_sidebar_item', { walkable: ['props', 'children'] } ))) {
                res.push(sidebarItem);
            }
            return res;
        })

        Patcher.after(Common.SettingsButton, "A", (that, [props], res) => {
            return createElement(CoachmarkWrapper, {button: res})
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