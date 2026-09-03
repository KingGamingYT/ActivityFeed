import { Common } from "@modules/common";
import locale from "@common/methods/locale";
import NewsStore from "@activity_feed/GameNewsStore";
import ActivityFeedSettingsCoachmarkStore from "@coachmark/ActivityFeedSettingsCoachmarkStore";

export default {
    main: {
        v2Frame: {
            name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_TITLE(),
            note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_FEED_DESCRIPTION(),
            initial: true
        },
        v2News: {
            name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_TITLE(),
            note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_APPLICATION_NEWS_DESCRIPTION(),
            initial: true,
            parent: 'v2Frame'
        },
        v2Dock: {
            name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_TITLE(),
            note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_QUICK_LAUNCHER_DESCRIPTION(),
            initial: true,
            parent: 'v2Frame'
        },
        v2Cards: {
            name: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_TITLE(),
            note: locale.Strings.ACTIVITY_FEED_SETTINGS_REFRESHED_ACTIVITY_CARDS_DESCRIPTION(),
            initial: true,
            parent: 'v2Frame'
        }
    },
    debug: {
        forceRerollFeed: {
            name: "Re-roll the news article feed",
            note: "Re-roll currently displayed articles. Will not fetch new ones.",
            innerText: "Reroll",
            type: "button",
            onClick: () => NewsStore.rerollFeed()
        },
        forceRefreshFeed: {
            name: "Refresh the news article feed",
            note: <>Re-fetch news. WILL fetch new articles if they are available. <strong>Do NOT spam this! You will likely be rate limited by one of many services if not multiple!</strong></>,
            innerText: "Refresh",
            type: "button",
            onClick: () => NewsStore.refreshFeed()
        },
        resetCoachmark: {
            name: "Reset Settings Coachmark",
            note: "Settings coachmark will reappear again after having previously been dismissed.",
            innerText: "Reset",
            type: "button",
            onClick: () => ActivityFeedSettingsCoachmarkStore.setHasDismissedSettingsCoachmark(false)
        },
        clearLockedInArticles: {
            name: "Clear locked in articles",
            note: "Wipes articles that have been locked in.",
            innerText: "Wipe",
            type: "button",
            onClick: () => NewsStore.clearLockedArticles()
        },
        lockedInArticles: {
            name: "Lock in articles",
            note: "Add up to four articles which will always be displayed no matter what. #11p4tw",
            initial: false,
            type: "switch"
        },
        cardTypeDebug: {
            name: "Show both card types at once",
            note: "Show both types of activity cards under each other in the same list. Only enable if Activity Cards V2 is also enabled.",
            initial: false,
            type: "switch"
        },
        freezeDock: {
            name: "Force empty quick launcher",
            note: "Always make the quick launcher act as if it is empty.",
            type: "switch"
        },
        freezeCards: {
            name: "Force empty activity cards",
            note: "Always make the now playing section act as if it is empty.",
            type: "switch"
        },
        freezeNews: {
            name: "Force news feed state",
            initial: 0,
            type: "radio",
            options: [
                {
                    name: "Off",
                    description: "Feed will load normally.",
                    value: 0
                },
                {
                    name: "Always fail",
                    description: "Feed will always fail to load, displaying the article fallback.",
                    value: 1
                },
                {
                    name: "Always continuously load",
                    description: "Feed will always display the feed skeleton.",
                    value: 2
                }
            ]
        }
    },
    default:  {
        v2Frame: true,
        v2News: true,
        v2Dock: true,
        v2Cards: true,
        cardTypeDebug: false,
        freezeDock: false,
        freezeCards: false,
        freezeNews: false
    },
    external: {
        discord: {
            name: "Discord",
            note: locale.Strings.ACTIVITY_FEED_SETTINGS_EXTERNAL_DISCORD_BLOG_DESCRIPTION(),
            icon: Common.ClydeIcon,
            color: "var(--background-brand)",
            enabled: true
        },
        nintendo: {
            name: "Nintendo",
            note: locale.Strings.ACTIVITY_FEED_SETTINGS_EXTERNAL_NINTENDO_BLOG_DESCRIPTION(),
            icon: Common.NintendoSwitchNeutralIcon,
            color: "rgba(230, 0, 18, 1)",
            enabled: false
        },
        xbox: {
            name: "Xbox",
            note: locale.Strings.ACTIVITY_FEED_SETTINGS_EXTERNAL_XBOX_BLOG_DESCRIPTION(),
            icon: Common.XboxNeutralIcon,
            color: "var(--platform-xbox)",
            enabled: false
        }
    }
};