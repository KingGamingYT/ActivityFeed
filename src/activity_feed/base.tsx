import { Data, Plugins, Utils } from "betterdiscord";
import { useEffect, useRef } from "react";
import { Common, Title } from "@modules/common";
import { UserStore } from "@modules/stores";
import { NewsFeedBuilder } from "./components/application_news/FeedBuilder";
import { QuickLauncherBuilder } from "./components/quick_launcher/launcher";
import { NowPlayingBuilder, WhatsNewBuilder } from "./components/now_playing/BaseBuilder";
import settings from "@settings/settings";
import locale from "@activity_feed/common/methods/locale";
import MainClasses from "./ActivityFeed.module.css";
import QuickLauncherClasses from "./components/quick_launcher/QuickLauncher.module.css"
import NowPlayingClasses from "./components/now_playing/NowPlaying.module.css"
import Scroller from "@common/components/Scroller";

export function TabBaseBuilder() {

    useEffect(() => void Common.FluxDispatcher.dispatch({type: "APP_VIEW_SET_HOME_LINK", link: "/activity"}), []);

    const refDOM = useRef(null);
    const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "< boy i really ate my words with that one", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.14 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 8000 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time", "so sorry !", "where's kinger", "i only upload high quality discord client plugins", "losing my damn mind bruh"]
    return ([
        <Title.WindowTitle location={locale.Strings.ACTIVITY()} />,
        <div className={Utils.className((Data.load('v2Frame') ?? settings.default.v2Frame) && MainClasses.activityFeedV2, MainClasses.activityFeed)}>
            <Common.HeaderBar className={MainClasses.headerBar} aria-label={locale.Strings.ACTIVITY()}>
                <div className={MainClasses.iconWrapper}>
                    <Common.GameControllerIcon />
                </div>
                <div className={MainClasses.titleWrapper}>
                    <div className={MainClasses.title}>{locale.Strings.ACTIVITY()}</div>
                </div>
            </Common.HeaderBar>
            <Scroller className={MainClasses.scrollerBase} ref={refDOM} fade={true} type="auto">
                <div className={MainClasses.centerContainer}>
                    <NewsFeedBuilder />
                    <QuickLauncherBuilder className={QuickLauncherClasses.quickLauncher} style={{ position: "relative", padding: "0 20px 0 20px", paddingRight: "4px" }} />
                    <NowPlayingBuilder className={NowPlayingClasses.nowPlaying} style={{ position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" }} />
                    <WhatsNewBuilder className={NowPlayingClasses.whatsNew} style={{ position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" }} />
                    {Plugins.get("ActivityFeed").version.includes("dev") && <div style={{ color: "red" }}>{`Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`}</div>}
                </div>
            </Scroller>
        </div>
    ])
}