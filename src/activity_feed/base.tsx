import { Common, ControllerIcon } from "@./modules/common";
import { UserStore } from "@./modules/stores";
import { QuickLauncherBuilder } from "./components/quick_launcher/launcher";
import { NowPlayingBuilder } from "./components/now_playing/baseBuilder";
import MainClasses from "./ActivityFeed.module.css";
import QuickLauncherClasses from "./components/quick_launcher/QuickLauncher.module.css"
import NowPlayingClasses from "./components/now_playing/NowPlaying.module.css"

function Scroller({ children, padding }) {
    return <div className={MainClasses.scrollerBase}style={{ overflow: "hidden scroll", paddingRight: `${padding}px` || "0px" }}>{children}</div>
}

/*
function NotTabBaseBuilder() {
    document.title = "Activity";
    const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"]
    return createElement("div", {
        className: "activityCenter_267ac",
        children: [
            createElement(HeaderBar, {
            className: "headerBar_267ac",
            "aria-label": "Activity",
            children: [
                    createElement('div', { className: "iconWrapper_267ac" }, 
                        createElement('svg', {style: {width: "24", height: "24"}, viewBox: "0 0 24 24", fill: "none"},
                            createElement('path', {d: ControllerIcon, fill: "#B9BBBE", transform: "scale(0.4)"})
                        )
                    ),
                    createElement('div', { className: "titleWrapper_267ac" },
                        createElement('div', {className: "title_267ac"}, "Activity")
                    )
                ]
            }),
            createElement('div', {className: "scrollerBase_267ac", style: { overflow: "hidden scroll", paddingRight: "0px" } },
                createElement('div', { className: "centerContainer_267ac" }, [
                    createElement(NewsFeedBuilder),
                    createElement(QuickLauncherBuilder, { className: "quickLauncher_267ac", style: { position: "relative", padding: "0 20px 0 20px" } }),
                    createElement(NowPlayingBuilder, { props: { className: "nowPlaying_267ac", style: { position: "relative", padding: "0 20px 20px 20px" } }}),
                    createElement('div', {style: { color: "red" }}, `Activity Center Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`)
                ])
            )
        ]
    })
}
*/

export function TabBaseBuilder() {
    document.title = "Activity";
    const gags = ["Don't have a cow, man", "1, 2, and 4", "typescript sux", "a lot of people were a big help on this project, thanks to 11pixels, davart, arven, doggysbootsy, and others", "267 tealwood drive coppell texas", "discord is lazy", "1.13 is a myth", `the current user is ${UserStore.getCurrentUser()?.globalName}. hello!`, "hat kid fav protag", "over 3300 lines of code and counting!", "saleem, i know what you did", "Tread lightly young traveler, instability ahead", "vorapis.pages.dev", "who cares about game news anymore anyway", "Madman Certified!", "happy birthday nedyak", "milbits has rabies", "i'm really gonna do it this time"]
    return (
        <div className={MainClasses.activityFeed}>
            <Common.HeaderBar className={MainClasses.headerBar} aria-label="Activity">
                <div className={MainClasses.iconWrapper}>
                    <svg className={Common.UpperIconClasses.icon} style={{  width: 24, height: 24 }} viewBox="0 0 24 24" fill="none">
                        <path d={ControllerIcon} fill="var(--channel-icon)" /*transform="transform(0.4)"*/ />
                    </svg>
                </div>
                <div className={MainClasses.titleWrapper}>
                    <div className={MainClasses.title}>Activity</div>
                </div>
            </Common.HeaderBar>
            <Scroller>
                <div className={MainClasses.centerContainer}>
                    <QuickLauncherBuilder className={QuickLauncherClasses.quickLauncher} style={{ position: "relative", padding: "0 20px 0 20px" }} />
                    <NowPlayingBuilder className={NowPlayingClasses.nowPlaying} style={{ position: "relative", padding: "0 20px 20px 20px" }} />
                    <div style={{ color: "red" }}>{`Activity Feed Test Build - ${gags[Math.floor(Math.random() * gags.length)]}`}</div>
                </div>
            </Scroller>
        </div>
    )
}