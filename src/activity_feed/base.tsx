import { Data, Plugins, Utils } from "betterdiscord";
import { useEffect } from "react";
import { Common, ControllerIcon, NavigationUtils, Title } from "@modules/common";
import { UserStore } from "@modules/stores";
import { NewsFeedBuilder } from "./components/application_news/FeedBuilder";
import { QuickLauncherBuilder } from "./components/quick_launcher/launcher";
import { NowPlayingBuilder, WhatsNewBuilder } from "./components/now_playing/BaseBuilder";
import settings from "@settings/settings";
import MainClasses from "./ActivityFeed.module.css";
import QuickLauncherClasses from "./components/quick_launcher/QuickLauncher.module.css"
import NowPlayingClasses from "./components/now_playing/NowPlaying.module.css"

function Scroller({ children, padding }: {children: any, padding?: number}) {
    return <div className={MainClasses.scrollerBase}style={{ overflow: "hidden scroll", paddingRight: `${padding}px` || "0px" }}>{children}</div>
}

export function TabBaseBuilder() {
    const recoverOnReload = (e: KeyboardEvent) => {
        if ((e.key == "r" || e.key == "R") && e.ctrlKey)
        {
            NavigationUtils.transitionTo('/channels/@me');
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", recoverOnReload);
        return () => window.removeEventListener("keydown", recoverOnReload);
    })

    const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"]
    
    return ([
        <Title.WindowTitle location="Activity" />,
        <div className={Utils.className((Data.load('v2Frame') ?? settings.default.v2Frame) && MainClasses.activityFeedV2, MainClasses.activityFeed)}>
            <Common.HeaderBar className={MainClasses.headerBar} aria-label="Activity">
                <div className={MainClasses.iconWrapper}>
                    <Common.GameControllerIcon />
                </div>
                <div className={MainClasses.titleWrapper}>
                    <div className={MainClasses.title}>Activity</div>
                </div>
            </Common.HeaderBar>
            <Scroller>
                <div className={MainClasses.centerContainer}>
                    <NewsFeedBuilder />
                    <QuickLauncherBuilder className={QuickLauncherClasses.quickLauncher} style={{ position: "relative", padding: "0 20px 0 20px", paddingRight: "4px" }} />
                    <NowPlayingBuilder className={NowPlayingClasses.nowPlaying} style={{ position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" }} />
                    {<WhatsNewBuilder className={NowPlayingClasses.whatsNew} style={{ position: "relative", padding: "0 20px 20px 20px", paddingRight: "4px" }} />}
                    {Plugins.get("ActivityFeed").version.includes("dev") && <div style={{ color: "red" }}>{`Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`}</div>}
                </div>
            </Scroller>
        </div>
    ])
}