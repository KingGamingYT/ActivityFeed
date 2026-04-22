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

    getAllActivityProperties(activities: Array<Object>) {
        let d = []
        for (let a of activities) {
            if (!a) return;
            d.push(this.getActivityProperties(a))
        }
        return d;
    }

    getActivityType(activity: Object) {
        return this.types[activity.type as keyof Object];
    }

    getActivityPlatform(activity: Object, isSpotify?: Boolean) {
        switch(true) {
            case !! (isSpotify || activity?.name?.toLowerCase()?.includes("spotify")): return "SPOTIFY";
            case !! activity?.platform?.includes("xbox"): return "XBOX";
            case !! (activity?.platform?.includes("playstation") || activity?.platform?.includes("ps5")): return "PLAYSTATION";
        }
    }

    getActivityProperties(activity: Object) {
        return {type: this.getActivityType(activity), platform: this.getActivityPlatform(activity)}
    }
}
export default new PresenceTypeStore();