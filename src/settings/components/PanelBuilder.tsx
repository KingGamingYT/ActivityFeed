import { layoutUtils } from "@modules/common";
import { RefreshSection, AdvancedSection } from "./sections";
import { FollowedGameListBuilder, ExternalSourcesListBuilder } from "./sections/followed_games";
import { NewspaperIcon } from "./common/SidebarItemIcon";
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
        useTitle: (opened) =>  opened ? "Hide Advanced & Debug Settings for Activity Feed" : "View Advanced & Debug Settings for Activity Feed",
        useCollapsedSubtitle: () => "Developer options only! Don't touch these unless you want to break the activity feed in some way."
    }
)

const categoryObjs = ([
    layoutUtils.Category("activity_feed_visual_refresh_category",
        {
            buildLayout: () => [refreshObj],
            type: LayoutTypes.CATEGORY,
            useTitle: () => "Visual Refresh",
            useSubtitle: () => (
                <div className={`${SettingsClasses.subtitleContainer}`}>
                    <div className={MainClasses.emptyText}>Modern styling toggles for each part of the Activity Feed.</div>
                </div>
            )
        }
    ),
    layoutUtils.Category("activity_feed_games_you_follow_category",
        {
            buildLayout: () => [gamesFollowedObj],
            type: LayoutTypes.CATEGORY,
            useTitle: () => "Games You Follow",
            useSubtitle: () => (
                <div className={`${SettingsClasses.subtitleContainer}`}>
                    <div className={MainClasses.emptyText}>Discord will automatically fetch the latest news for games you've recently played and display them on the Activity Feed. Follow more games to get more cool news.</div>
                </div>
            )
        }
    ),
    layoutUtils.Category("activity_feed_external_news_category",
        {
            buildLayout: () => [externalNewsObj],
            type: LayoutTypes.CATEGORY,
            useTitle: () => "External News",
            useSubtitle: () => (
                <div className={`${SettingsClasses.external} ${SettingsClasses.subtitleContainer}`}>
                    <div className={MainClasses.emptyText}>News from external sources outside of your game library.</div>
                </div>
            )
        }
    ),
    layoutUtils.Category("activity_feed_advanced_category",
        {
            buildLayout: () => [advancedObj],
            type: LayoutTypes.CATEGORY,
            useTitle: () => "Advanced"
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

export default layoutUtils.SidebarItem("activity_feed_sidebar_item", 
    {
        buildLayout: () => [panelObj],
        icon: () => <NewspaperIcon />,
        key: "activity_feed_sidebar_item",
        getLegacySearchKey: () => "ACTIVITY_FEED",
        useTitle: () => "Activity Feed",
        type: LayoutTypes.SIDEBAR_ITEM
    }
);