import { Common } from "@modules/common";
import NewsStore from "@activity_feed/Store";

export default {
    main: {
        v2Frame: {
            name: "Refreshed Activity Feed",
            note: "Enables basic modern styling for the Activity Feed. Below options are highly recommended.",
            initial: true
        },
        v2News: {
            name: "Refreshed Application News",
            note: "Enables modern styling for news articles. Recommended.",
            initial: true
        },
        v2Dock: {
            name: "Refreshed Quick Launcher",
            note: "Enables modern styling for the quick launcher. Recommended.",
            initial: true
        },
        v2Cards: {
            name: "Refreshed Activity Cards",
            note: "Enables the colorful visual refresh-inspired activity card designs. Recommended.",
            initial: true,
        }
    },
    debug: {
        forceRefreshFeed: {
            name: "Force refresh the news article feed",
            note: "Re-roll currently displayed articles. Will not fetch new ones.",
            innerText: "Reroll",
            type: "button",
            onClick: () => NewsStore.rerollFeeds()
        },
        resetCoachmark: {
            name: "Reset Settings Coachmark",
            note: "Settings coachmark will reappear again after having previously been dismissed.",
            innerText: "Reset",
            type: "button",
            onClick: () => NewsStore.setHasDismissedSettingsCoachmark(false)
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
            note: "News from Discord's blog.",
            icon: Common.Icons.ClydeIcon,
            color: "var(--background-brand)",
            enabled: true
        },
        nintendo: {
            name: "Nintendo",
            note: "Nintendo news sourced from nintendoeverything.com.",
            icon: Common.Icons.NintendoSwitchNeutralIcon,
            color: "rgba(230, 0, 18, 1)",
            enabled: false
        },
        xbox: {
            name: "Xbox",
            note: "News from Xbox's blog.",
            icon: Common.Icons.XboxNeutralIcon,
            color: "var(--xbox)",
            enabled: false
        }
    }
};