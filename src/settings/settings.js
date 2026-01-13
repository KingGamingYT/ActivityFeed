export const settings = {
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
    }
};