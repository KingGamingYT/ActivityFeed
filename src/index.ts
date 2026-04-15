import { Webpack, Data, Patcher, DOM, Utils, ReactUtils } from "betterdiscord";
import { createElement } from "react";
import { container, Common, NavigationUtils, Router } from "./modules/common";
import { TabBaseBuilder } from "./activity_feed/base.js";
import { IntroCoachmarkPopout } from "@coachmark/IntroCoachmark";
import { extraCSS } from "./activity_feed/extra";
import styles from "styles";
import settingsItem from "@settings/components/PanelBuilder";
import NewsStore from "./activity_feed/Store";
import NewsArticle from "@application_news/Article";
import LastPlayedStore from "@now_playing/LastPlayedStore";


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

export default class ActivityFeed {
    GameNewsStore = NewsStore;
    NewsArticle = NewsArticle;
    LastPlayedStore = LastPlayedStore;
    async start() {
        if (window.document.location.pathname === "/app" ) {
            requestAnimationFrame(() => NavigationUtils.transitionTo('/activity-feed'));
        }
        await Utils.forceLoad(Webpack.getBySource('OPEN_DIRECT_MESSAGE', 'friends-popout', {raw: true}).id);
        NewsStore.whitelist = Data.load('whitelist');
        NewsStore.blacklist = Data.load('blacklist') || [];
        setInterval(async () => {
            if ( NewsStore.shouldFetch() === true ) await NewsStore.fetchFeeds();
        }, 100)

        const Route = Webpack.getByStrings('disableTrack', 'impressionName');
        const [appContentModule, appContentKey] = Webpack.getWithKey(Webpack.Filters.byStrings("hasNotice", "AppView"));
        if (appContentModule) {
            Patcher.after(appContentModule, appContentKey, (that, args, ret) => {
                const { children } = Utils.findInTree(ret, (node) => node && node.children?.length > 5 && node.children.some(c => c?.props?.path), { walkable: ["children", "props"] }) ?? {};
                if (!children) return;
                const index = children.findIndex((m) => m.key === "activity-feed");
                if (~index) {
                    children.splice(index, 1);
                }
                children.push(
                    createElement(Route, {
                        disableTrack: true,
                        path: "/activity-feed",
                        render: () => createElement(TabBaseBuilder),
                        exact: true,
                        key: "activity-feed"
                    })
                );
            });
            const patchedFn = appContentModule[appContentKey];
            const inst = ReactUtils.getOwnerInstance(document.querySelector(`.${container}`));
            if (inst) {
                Patcher.after(inst, "render", (that, args, res) => {
                    if (res?.props?.children) {
                        res.props.children = { ...res.props.children, type: patchedFn };
                    }
                });
                inst.forceUpdate();
            }
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
                res.push(settingsItem);
            }
            return res;
        })

        Patcher.after(Common.SettingsButton, "A", (that, [props], res) => {
            return createElement(CoachmarkWrapper, {button: res})
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