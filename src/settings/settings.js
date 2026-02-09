import { Common } from "@modules/common";

export default {
    main: {
        v2Cards: {
            name: "Activity Cards V2",
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
        v2Cards: true,
        cardTypeDebug: false,
    },
    external: {
        discord: {
            name: "Discord",
            note: "News from Discord's blog.",
            icon: Common.Icons.ClydeIcon,
            color: "var(--blurple)",
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
        },
        playstation: {
            name: "PlayStation",
            note: "News from PlayStation's blog.",
            icon: Common.Icons.PlaystationNeutralIcon,
            color: "var(--playstation)",
            enabled: false
        }
    }
};