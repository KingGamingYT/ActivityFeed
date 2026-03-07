import { Hooks } from "betterdiscord"
import { useState, useRef, useEffect } from "react";
import { Common } from "@modules/common";
import NewsStore from "@activity_feed/Store";
import CoachmarkClasses from "./IntroCoachmark.module.css";

export function IntroCoachmark({close}) {
    return (
        <div className={`${CoachmarkClasses.coachmark} ${Common.PopoverClasses.popover}`}>
            <div className={Common.PopoverClasses.graphic}>
                <img className={CoachmarkClasses.image} alt="" draggable="false" src="https://static.discord.com/assets/de14fab6de78b0fc2f679eb74b735151.svg" />
            </div>
            <div className={CoachmarkClasses.body}>
                <div className={CoachmarkClasses.bodyHeader}>
                    <div className={CoachmarkClasses.title}>Activity Feed</div>
                </div>
                <div className={CoachmarkClasses.bodyContent}>
                    <div className={CoachmarkClasses.content}>You can customize which games appear on the Activity Feed and other fun toggles in settings. Look for the tab!</div>
                </div>
            </div>
            <div className={CoachmarkClasses.actions}>
                <button className={`${Common.ButtonManaClasses.button} ${Common.ButtonManaClasses.sm} ${Common.ButtonManaClasses.primary} ${CoachmarkClasses.closeButton}`} type={"button"} onClick={() => {NewsStore.setHasDismissedSettingsCoachmark(true); close}}>
                    <div className={`${Common.ButtonManaClasses.buttonChildrenWrapper}`}>
                        <div className={`${Common.ButtonManaClasses.buttonChildren}`}>
                            <span className={CoachmarkClasses.buttonContent}>Close</span>
                        </div>
                    </div>
                </button>
            </div>
            <div className={`${Common.CaretClasses.caret} ${Common.CaretClasses["caret--bottom"]} ${Common.CaretClasses["caret--start"]}`}>
                <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className={Common.PopoverClasses.caretIcon}>
                    <path className={Common.PopoverClasses.caretFill} d="M14.0535 9.39127C12.4557 11.2796 9.54425 11.2796 7.94646 9.39127L1 1Q0 0 1 0L21 0Q22 0 21 1L14.0535 9.39127Z" />
                    <mask id="mask0_caret" maskUnits="userSpaceOnUse" x="0" y="0" width="22" height="11" style={{ maskType: "alpha" }}>
                        <path className={Common.PopoverClasses.caretFill} d="M14.0535 9.39126C12.4557 11.2796 9.54425 11.2796 7.94646 9.39126L1 1Q0 0 1 0L21 0Q22 0 21 1L14.0535 9.39126Z" />
                    </mask>
                    <g mask="url(mask0_caret)">
                        <path className={Common.PopoverClasses.caretStroke} d="M13.6572 9.13184C12.2604 10.761 9.73957 10.761 8.34277 9.13184L1.0869141 0.5Q0.0869141 -0.5 1.0869141 -0.5L20.9131 -0.5Q21.9131 -0.5 20.9131 0.5L13.6572 9.13184Z" />
                    </g>
                </svg>
            </div>
        </div>
    )
}

export function IntroCoachmarkPopout({button}) {
    const [showPopout, setShowPopout] = useState(false);
    const isShouldShow = Hooks.useStateFromStores(NewsStore, () => NewsStore.hasDismissedSettingsCoachmark)

    const refDOM = useRef(null)

    useEffect(() => {
        setShowPopout(!isShouldShow)
    })

    return (
        <div ref={refDOM}>
            <Common.Popout
                shouldShow={showPopout}
                position="top"
                targetElementRef={refDOM}
                onRequestClose={() => {setShowPopout(false); NewsStore.setHasDismissedSettingsCoachmark(true)}}
                renderPopout={() => {
                    return <Common.PopoutContainer>
                        <IntroCoachmark close={() => setShowPopout(false)} />
                    </Common.PopoutContainer>
                }}
                children={() => <div>
                    {button}
                </div>}
            />
        </div>
    )
}