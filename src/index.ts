import { Webpack, Patcher, DOM, Utils, ReactUtils } from "betterdiscord";
import { createElement } from "react";
import { container, AccountPanel, Common, SettingsRoot, Router } from "@modules/common";
import { ApplicationStore } from "@modules/stores";
import { TabBaseBuilder } from "@activity_feed/base";
import { IntroCoachmarkPopout } from "@coachmark/IntroCoachmark";
import { CardMiniNews } from "@now_playing/activities/components/CardMiniNews";
import { extraCSS } from "@activity_feed/extra";
import locale from "@common/methods/locale";
import FollowButton from "@now_playing/activities/components/common/FollowButton";
import styles from "styles";
import SettingsItem from "@settings/components/PanelBuilder";
import NewsStore from "@activity_feed/GameNewsStore";
import RecentNewsSection from "@application_news/components/GameProfileRecentNews";
import LastPlayedStore from "@now_playing/LastPlayedStore";
import ActivityFeedSettingsCoachmarkStore from "@coachmark/ActivityFeedSettingsCoachmarkStore";
import PresenceTypeStore from "@now_playing/PresenceTypeStore";

function useSelectedState() {
    return Router.useLocation().pathname.startsWith("/activity");
}

function NavigatorButton() {
    
    return createElement(Common.LinkButton, 
        {
            selected: useSelectedState(), 
            route: "/activity", 
            text: locale.Strings.ACTIVITY(), 
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
    LastPlayedStore = LastPlayedStore;
    ActivityFeedSettingsCoachmarkStore = ActivityFeedSettingsCoachmarkStore;
    PresenceTypeStore = PresenceTypeStore;
    FollowButton = FollowButton;
    NewsCard = CardMiniNews;
    async start() {
        const settingsItem = await SettingsItem();
        setInterval(async () => {
            if ( NewsStore.shouldFetch() === true ) await NewsStore.fetchFeeds();
        }, 100)

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
                children[0].props = {
                    disableTrack: true,
                    path: "/activity",
                    render: () => createElement(TabBaseBuilder),
                    exact: true,
                }
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

        DOM.addStyle('activityFeedCSS', styles());
        DOM.addStyle('activityFeedSupplementalCSS', extraCSS)

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

            const index = panel.children.findIndex(m => m?.key === "activity");
            if (index !== -1) return;

            panel.children.unshift(
                createElement(NavigatorButton, {key: "activity"})
            );
        });

        Patcher.before(Common.GameFetchModule,'E', (thisObj, args) => {
            const filtered = args[0].filter(x => !isNaN(x))
            args[0] = filtered
            return args
        })

        await SettingsRoot.then(e => Patcher.after(e, "buildLayout", (that, [props], res) => {
            let index = res.findIndex((layout) => layout.key === "games_and_apps_section");
            Patcher.after(res[index], "buildLayout", (that, [props], res) => {
                if (!Utils.findInTree(res, (tree) => Object.values(tree).includes('activity_feed_sidebar_item', { walkable: ['props', 'children'] } ))) {
                    res.splice(3, 0, (settingsItem));
                }
                return res;
            })
        }))
        
        Patcher.after(AccountPanel, "Settings", (that, [props], res) => {
            return createElement(CoachmarkWrapper, {button: res})
        })

        Patcher.after(ContentInventoryCard, 'ContentInventoryCardHeader', (that, [props], res) => {
            const hero = Utils.findInTree(res, (tree) => tree && tree.backgroundImgSrc);
            const entry = props.entry;
            const application = ApplicationStore.getApplication(entry.extra.application_id);
            entry.extra.type === "played_game_extra" && hero.children.push(createElement(FollowButton, { application, fullWidth: true }));
        })

        await Webpack.waitForModule(Webpack.Filters.bySource('"GAME_PROFILE_GET_SHOP_COLLECTION_START"')).then(() => {
            GameProfileModal = Webpack.getMangled(Webpack.Filters.bySource('"GAME_PROFILE_GET_SHOP_COLLECTION_START"'), {
                GameProfileV2Trailing: x => String(x).includes('"game-profile-add-favorite-game"'),
                GameProfileLeftColumn: x => Webpack.Filters.byRegex(/trackAction:.}\)/)(x.type)
            }, {mapDeclarations: true})

            Patcher.after(GameProfileModal, "GameProfileV2Trailing", (that, [props], res) => {
                console.log(props)
                const game = props.game;
                const application = ApplicationStore.getApplication(game.id) ?? ApplicationStore.getApplicationByName(game.name);
                !Object.values(res.props.children).find(x => String(x?.type)?.includes('follow')) && res.props.children.splice(0, 0, createElement(FollowButton, { application, fullWidth: true }));
            })

            Patcher.after(GameProfileModal.GameProfileLeftColumn, "type", (that, [props], res) => {
                const game = props.game;
                !Object.values(res.props.children).find(x => String(x?.type).includes('RECENT_NEWS')) && res.props.children.splice(1, 0,
                    createElement(RecentNewsSection, { applicationId: game.id, type: 0 })
                )
            })
        });
    }
    stop() {
        Common.FluxDispatcher.dispatch({type: 'NOW_PLAYING_UNMOUNTED'});
        Common.FluxDispatcher.dispatch({type: 'LAST_PLAYED_UNMOUNTED'});
        Patcher.unpatchAll('ActivityFeed');
        DOM.removeStyle('activityFeedCSS');
        DOM.removeStyle('activityFeedSupplementalCSS');
        ReactUtils.getOwnerInstance(document.querySelector(`.${container}`)).forceUpdate();
    }
}