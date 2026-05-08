import { Webpack, Data, Patcher, DOM, Utils, ReactUtils } from "betterdiscord";
import { createElement, useState, useEffect } from "react";
import { container, Common, NavigationUtils, SettingsRoot, Router } from "./modules/common";
import { ApplicationStore } from "./modules/stores";
import { TabBaseBuilder } from "./activity_feed/base.js";
import { IntroCoachmarkPopout } from "@coachmark/IntroCoachmark";
import { RecentNews } from "@application_news/components/GameProfileRecentNews";
import FollowButton from "@now_playing/activities/components/common/FollowButton";
import { extraCSS } from "./activity_feed/extra";
import styles from "styles";
import SettingsItem from "@settings/components/PanelBuilder";
import NewsStore from "./activity_feed/Store";
import NewsArticle from "@application_news/Article";
import LastPlayedStore from "@now_playing/LastPlayedStore";
import ActivityFeedSettingsCoachmarkStore from "@coachmark/ActivityFeedSettingsCoachmarkStore";
import PresenceTypeStore from "@now_playing/PresenceTypeStore";


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
    FollowButton = FollowButton;
    RecentNews = RecentNews;
    async start() {
        if (window.document.location.pathname === "/app" ) {
            requestAnimationFrame(() => NavigationUtils.transitionTo('/activity-feed'));
        }
        const patcher = ReactUtils.createNodePatcher();
        const settingsItem = await SettingsItem();
        //await Utils.forceLoad(Webpack.getBySource('openNativeAppModal', 'fingerprint', 'AGE_GATE_FAILURE_MODAL_OPEN', {raw: true}).id)
        //await Utils.forceLoad(Webpack.getBySource('handleUserContextMenu', {raw: true}).id);
        NewsStore.whitelist = Data.load('whitelist');
        NewsStore.blacklist = Data.load('blacklist') || [];
        setInterval(async () => {
            if ( NewsStore.shouldFetch() === true ) await NewsStore.fetchFeeds();
        }, 100)

        const Route = Webpack.getByStrings('disableTrack', 'impressionName');
        let ContentInventoryCard = Webpack.getMangled(Webpack.Filters.bySource('disableGameProfileLinks', 'ANDROID'), {
            ContentInventoryCardHeader: x => String(x).includes('"ContentPopout"')
        }, {mapDeclarations: true});
        let GameProfileModal;
        const [appContentModule, appContentKey] = Webpack.getWithKey(Webpack.Filters.byStrings("GUILD_MEMBER_VERIFICATION"), {
            target: Webpack.getBySource("hasNotice", "AppView", {raw: true}).declarations
        })
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

        Patcher.after(Object.values(Webpack.getBySource("handleHistoryChange", "ensureChannelMatchesGuild", {raw: true}).declarations).find(Webpack.Filters.byPrototypeKeys("handleHistoryChange", "ensureChannelMatchesGuild")).prototype, "render", (that, args, res) => {
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

        Patcher.after(ContentInventoryCard, 'ContentInventoryCardHeader', (that, [props], res) => {
            const entry = props.entry;
            const application = ApplicationStore.getApplication(entry.extra.application_id) ?? ApplicationStore.getApplicationByName(entry.extra.application_id);
            entry.extra.type === "played_game_extra" && res.props.children.push(createElement(FollowButton, { application, fullWidth: true }));
        })

        await Webpack.waitForModule(Webpack.Filters.bySource('"GameProfileModal"', 'forceV2')).then((e) => {
            GameProfileModal = Webpack.getMangled(Webpack.Filters.bySource('"GameProfileModal"', 'forceV2'), {
                GameProfileV1Sidebar: x => String(x).includes('onSetInvite'),
                GameProfileV2Trailing: x => String(x).includes('"game-profile-add-favorite-game"')
            }, {mapDeclarations: true})

            Patcher.after(GameProfileModal, 'GameProfileV1Sidebar', (that, [props], res) => {
            const game = props.game;
            const application = ApplicationStore.getApplication(game.id) ?? ApplicationStore.getApplicationByName(game.name);
            res.props.children[0].props.children.splice(0, 0, createElement(FollowButton, { application, fullWidth: true }));
            })

            Patcher.after(GameProfileModal, "GameProfileV2Trailing", (that, [props], res) => {
                const game = props.game;
                const application = ApplicationStore.getApplication(game.id) ?? ApplicationStore.getApplicationByName(game.name);
                res.props.children.splice(0, 0, createElement(FollowButton, { application, fullWidth: true }));
            })
        });

        /*Patcher.after(await Webpack.waitForModule(Webpack.Filters.bySource('"GameProfileModal"', 'forceV2')), "default", (that, [props], res) => { 
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
        })*/
    }
    stop() {
        Common.FluxDispatcher.dispatch({type: 'NOW_PLAYING_UNMOUNTED'});
        Common.FluxDispatcher.dispatch({type: 'LAST_PLAYED_UNMOUNTED'});
        Patcher.unpatchAll('ActivityFeed');
        DOM.removeStyle('activityFeedCSS');
        ReactUtils.getOwnerInstance(document.querySelector(`.${container}`)).forceUpdate();
    }
}