import { Data, Utils } from "betterdiscord";

export default new class ActivityFeedSettingsCoachmarkStore extends Utils.Store {
    static displayName = "ActivityFeedSettingsCoachmarkStore";
    hasDismissedSettingsCoachmark;
    constructor() {
        super();
        this.hasDismissedSettingsCoachmark = Data.load("hasDismissedSettingsCoachmark") ?? false;
    }

    setHasDismissedSettingsCoachmark(v) {
        this.hasDismissedSettingsCoachmark = v;
        Data.save("hasDismissedSettingsCoachmark", v);
        this.emitChange();
        return;
    }
}