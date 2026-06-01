import { Utils, Webpack } from "betterdiscord";
import { RefreshSection, AdvancedSection } from "./sections";
import { FollowedGameListBuilder, ExternalSourcesListBuilder } from "./sections/followed_games";
import { NewspaperIcon } from "./common/SidebarItemIcon";
import locale from "@common/methods/locale";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

let LayoutTypes = {
    SECTION: 1,
    SIDEBAR_ITEM: 2,
    PANEL: 3,
    CATEGORY: 5,
    ACCORDION: 6,
    CUSTOM: 19,
};

export default async () => {
    const result = await Utils.forceLoad(Webpack.getBySource('USER_SETTINGS_MODAL_KEY', 'openModalLazy', '"replaceAll"', {raw: true}).id);
    if (result) {
        const layoutUtils = Webpack.getMangled(Webpack.Filters.bySource('$Root', '.ACCORDION'),
            {
                Panel: x => String(x).includes('.PANEL,'),
                Button: x => String(x).includes('.BUTTON,'),
                SidebarItem: x => String(x).includes('.SIDEBAR_ITEM,'),
                Category: x => String(x).includes('.CATEGORY,'),
                Custom: x => String(x).includes('.CUSTOM,'),
                Accordion: x => String(x).includes('.ACCORDION,')
            }
        )

        const refreshObj = 
        layoutUtils.Custom("activity_feed_visual_refresh", 
            {
                Component: () => <RefreshSection />,
                key: "activity_feed_visual_refresh_setting",
                type: LayoutTypes.CUSTOM
            }
        )

        const gamesFollowedObj = 
        layoutUtils.Custom("activity_feed_games_you_follow", 
            {
                Component: () => <FollowedGameListBuilder />,
                key: "activity_feed_games_you_follow_setting",
                type: LayoutTypes.CUSTOM
            }
        )

        const externalNewsObj = 
        layoutUtils.Custom("activitry_feed_external_news",
            {
                Component: () => <ExternalSourcesListBuilder />,
                key: "activity_feed_external_news_setting",
                type: LayoutTypes.CUSTOM
            }
        )

        const advancedObj = 
        layoutUtils.Accordion("activity_feed_advanced_accordion",
            {
                buildLayout: () => [
                    layoutUtils.Custom("activity_feed_advanced", 
                        {
                            Component: () => <AdvancedSection />,
                            key: "activity_feed_advanced_setting",
                            type: LayoutTypes.CUSTOM
                        }
                    )
                ],
                key: "activity_feed_advanced_accordion",
                type: LayoutTypes.ACCORDION,
                useTitle: (opened) =>  opened ? locale.Strings.ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_OPEN() : locale.Strings.ACTIVITY_FEED_SETTINGS_ADVANCED_TITLE_CLOSED(),
                useCollapsedSubtitle: () => locale.Strings.ACTIVITY_FEED_SETTINGS_ADVANCED_DESCRIPTION()
            }
        )

        const categoryObjs = ([
            layoutUtils.Category("activity_feed_visual_refresh_category",
                {
                    buildLayout: () => [refreshObj],
                    type: LayoutTypes.CATEGORY,
                    useTitle: () => locale.Strings.VISUAL_REFRESH(),
                    useSubtitle: () => (
                        <div className={`${SettingsClasses.subtitleContainer}`}>
                            <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_HEADER_DESCRIPTION_VISUAL_REFRESH()}</div>
                        </div>
                    )
                }
            ),
            layoutUtils.Category("activity_feed_games_you_follow_category",
                {
                    buildLayout: () => [gamesFollowedObj],
                    type: LayoutTypes.CATEGORY,
                    useTitle: () => locale.Strings.GAMES_YOU_FOLLOW(),
                    useSubtitle: () => (
                        <div className={`${SettingsClasses.subtitleContainer}`}>
                            <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_HEADER_DESCRIPTION_GAMES_YOU_FOLLOW()}</div>
                        </div>
                    )
                }
            ),
            layoutUtils.Category("activity_feed_external_news_category",
                {
                    buildLayout: () => [externalNewsObj],
                    type: LayoutTypes.CATEGORY,
                    useTitle: () => locale.Strings.EXTERNAL_NEWS(),
                    useSubtitle: () => (
                        <div className={`${SettingsClasses.external} ${SettingsClasses.subtitleContainer}`}>
                            <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_HEADER_DESCRIPTION_EXTERNAL_SOURCES()}</div>
                        </div>
                    )
                }
            ),
            layoutUtils.Category("activity_feed_advanced_category",
                {
                    buildLayout: () => [advancedObj],
                    type: LayoutTypes.CATEGORY,
                    useTitle: () => locale.Strings.ADVANCED()
                }
            )
        ])

        const panelObj =
        layoutUtils.Panel("activity_feed_panel",
            {
                buildLayout: () => categoryObjs,
                key: "activity_feed_panel",
                type: LayoutTypes.PANEL,
                useTitle: () => "Activity Feed",
            }
        );

        const sidebarItem = layoutUtils.SidebarItem("activity_feed_sidebar_item", 
            {
                buildLayout: () => [panelObj],
                icon: () => <NewspaperIcon />,
                key: "activity_feed_sidebar_item",
                getLegacySearchKey: () => "ACTIVITY_FEED",
                useTitle: () => "Activity Feed",
                type: LayoutTypes.SIDEBAR_ITEM
            }
        );
        return sidebarItem;
    }
}