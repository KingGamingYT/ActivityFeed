import { Webpack, Data, Patcher, DOM, Utils, ReactUtils } from "betterdiscord";
import { createElement, useState, useEffect } from "react";
import { container, Common, NavigationUtils, SettingsRoot, Router } from "./modules/common";
import { ApplicationStore } from "./modules/stores";
import { TabBaseBuilder } from "./activity_feed/base.js";
import { IntroCoachmarkPopout } from "@coachmark/IntroCoachmark";
import { RecentNews } from "@activity_feed/components/application_news/components/GameProfileRecentNews";
import FollowButton from "@now_playing/activities/components/common/FollowButton";
import { extraCSS } from "./activity_feed/extra";
import styles from "styles";
import settingsItem from "@settings/components/PanelBuilder";
import NewsStore from "./activity_feed/Store";
import NewsArticle from "@application_news/Article";
import LastPlayedStore from "@now_playing/LastPlayedStore";
import ActivityFeedSettingsCoachmarkStore from "@coachmark/ActivityFeedSettingsCoachmarkStore";
import PresenceTypeStore from "@activity_feed/components/now_playing/PresenceTypeStore";


function useSelectedState() {
    return Router.useLocation().pathname.startsWith("/activity-feed");
}

function NavigatorButton() {
    
    return createElement(Common.LinkButton, 
        { 
            selected: useSelectedState(), 
            route: "/activity-feed", 
            text: "Activity", 
            icon: () => { return createElement(Common.GameControllerIcon, { color: "currentColor", className: Common.LinkButtonClasses.linkButtonIcon }) }
        }
    )
}

function CoachmarkWrapper({button})
{
    if (useSelectedState() && !ActivityFeedSettingsCoachmarkStore.hasDismissedSettingsCoachmark) {
        return createElement(IntroCoachmarkPopout, {button})
    }
    return button;
}

export default class ActivityFeed {
    GameNewsStore = NewsStore;
    NewsArticle = NewsArticle;
    LastPlayedStore = LastPlayedStore;
    ActivityFeedSettingsCoachmarkStore = ActivityFeedSettingsCoachmarkStore;
    PresenceTypeStore = PresenceTypeStore;
    async start() {
        if (window.document.location.pathname === "/app" ) {
            requestAnimationFrame(() => NavigationUtils.transitionTo('/activity-feed'));
        }
        await Utils.forceLoad(Webpack.getBySource('openNativeAppModal', 'fingerprint', 'AGE_GATE_FAILURE_MODAL_OPEN', {raw: true}).id)
        await Utils.forceLoad(Webpack.getBySource('handleUserContextMenu', {raw: true}).id);
        NewsStore.whitelist = Data.load('whitelist');
        NewsStore.blacklist = Data.load('blacklist') || [];
        setInterval(async () => {
            if ( NewsStore.shouldFetch() === true ) await NewsStore.fetchFeeds();
        }, 100)

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

        Patcher.after(Webpack.getBySource(".A.CONTACTS_LIST"), "A", (that, [props], res) => {
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

        Patcher.after(await SettingsRoot, "buildLayout", (that, [props], res) => {
            console.log(res)
            let index = res.findIndex((layout) => layout.key === "activity_section");
            console.log(index)
            Patcher.after(res[index], "buildLayout", (that, [props], res) => {
                if (!Utils.findInTree(res, (tree) => Object.values(tree).includes('activity_feed_sidebar_item', { walkable: ['props', 'children'] } ))) {
                    res.push(settingsItem);
                }
                return res;
            })
        })

        Patcher.after(Common.SettingsButton, "A", (that, [props], res) => {
            return createElement(CoachmarkWrapper, {button: res})
        })

        Patcher.after(Webpack.getBySource('disableGameProfileLinks', 'ANDROID'), 'A', (that, [props], res) => {
            const application = ApplicationStore.getApplication(res.props.children[0].props.entry.extra.application_id) ?? ApplicationStore.getApplicationByName(res.props.children[0].props.entry.extra.game_name);
            Patcher.after(res.props.children[0], 'type', (that, [props], res) => {
                res.props.children.push(createElement(FollowButton, { application, fullWidth: true }))
            })
        })

        function fu() {
            const appI = ReactUtils.getOwnerInstance(document.querySelector("div[class^=app_] > div[class^=app_]"), {
                filter: m => typeof m.ensureChannelMatchesGuild === "function"
            });
            
            if (appI) {
                appI.forceUpdate(() => {
                    const inst = ReactUtils.getOwnerInstance(document.querySelector(`.${container}`));

                    Patcher.after(inst, "render", (that, args, res) => {
                        NewType._ ??= res.props.children.type;

                        res.props.children.type = NewType;
                    });

                    inst?.forceUpdate(() => {
                        
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

        Patcher.after(await Webpack.waitForModule(Webpack.Filters.bySource('"GameProfileModal"', 'forceV2')), "default", (that, [props], res) => { 
            Patcher.after(res, "type", (that, [props], res) => { 
                const options = {
                    walkable: [
                        'props',
                        'children'
                    ],
                    ignore: []
                };
                const v1Data = Utils.findInTree(res, (tree) => tree?.className?.includes("mainContent"), options); 
                const v2Data = Utils.findInTree(res, (tree) => tree?.className?.includes("twoColumnMainContent"), options);
                v1Data ? Patcher.after(v1Data.children[0], "type", (that, [props], res) => { 
                    const game = res.props.children[1].props.game;

                    res.props.children.push(
                        createElement(RecentNews, { applicationId: game.id, type: "GAME_PROFILE" })
                    )
                }) : Patcher.after(v2Data.children[0], "type", (that, [props], res) => {
                    const game = Utils.findInTree(res, (tree) => tree && Object.hasOwn(tree, "game"), options).game;

                    res.props.children.push(
                        createElement(RecentNews, { applicationId: game.id, type: "GAME_PROFILE_V2" })
                    )
                })
            }) 
        })
    }
    stop() {
        Common.FluxDispatcher.dispatch({type: 'NOW_PLAYING_UNMOUNTED'});
        Common.FluxDispatcher.dispatch({type: 'LAST_PLAYED_UNMOUNTED'});
        Patcher.unpatchAll('ActivityFeed');
        DOM.removeStyle('activityFeedCSS');
        ReactUtils.getOwnerInstance(document.querySelector(`.${container}`)).forceUpdate();
    }
}