import { Utils } from "betterdiscord";

class PresenceTypeStore extends Utils.Store {
    static displayName = "PresenceTypeStore";
    types = {}
    constructor() {
        super();
        this.types = {
            0: "PLAYING",
            1: "STREAMING",
            2: "LISTENING",
            3: "WATCHING",
            4: "CUSTOM",
            5: "COMPETING"
        }
    }

    getAllActivityTypes(activities: Array<Object>) {
        let f = []
        for (let a of activities) {
            if (!a) return;
            f.push(this.getActivityType(a))
        }
        return f;
    } 

    getAllActivityProperties(activities: Array<Object>, isSpotify?: Boolean) {
        let d = []
        for (let a of activities) {
            if (!a) return;
            d.push(this.getActivityProperties(a, isSpotify))
        }
        return d;
    }

    getActivityType(activity: Object) {
        if (activity?.activity) activity = activity?.activity;
        return this.types[activity?.type as keyof Object];
    }

    getActivityPlatform(activity: Object, isSpotify?: Boolean) {
        if (activity?.activity) activity = activity?.activity;
        switch(true) {
            case !! (isSpotify || activity?.name?.toLowerCase()?.includes("spotify")): return "SPOTIFY";
            case !! activity?.platform?.includes("xbox"): return "XBOX";
            case !! (activity?.platform?.includes("playstation") || activity?.platform?.includes("ps5")): return "PLAYSTATION";
            case !! (activity?.name?.toLowerCase().includes("youtube music")): return "YT_MUSIC";
            case !! (activity?.name?.toLowerCase().endsWith("youtube")): return "YOUTUBE";
            case !! (activity?.name?.toLowerCase().includes("twitch")): return "TWITCH";
            case !! (activity?.name?.toLowerCase().includes("crunchyroll")): return "CRUNCHYROLL";
        }
    }

    getActivityProperties(activity: Object, isSpotify?: Boolean) {
        return {type: this.getActivityType(activity), platform: this.getActivityPlatform(activity, isSpotify)}
    }
}
export default new PresenceTypeStore();