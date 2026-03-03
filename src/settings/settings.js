import { Common } from "@modules/common";

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
        cardTypeDebug: {
            name: "Show both card types at once",
            note: "Show both types of activity cards under each other in the same list. Only enable if Activity Cards V2 is also enabled.",
            initial: false,
            type: "switch"
        },
        forceRefreshFeed: {
            name: "Force refresh the news article feed",
            note: "Re-roll currently displayed articles. Will not fetch new ones.",
            type: "button"
        }
    },
    default:  {
        v2Frame: true,
        v2News: true,
        v2Dock: true,
        v2Cards: true,
        cardTypeDebug: false,
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