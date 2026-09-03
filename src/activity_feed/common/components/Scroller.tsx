import { Utils } from "betterdiscord";
import { useImperativeHandle } from "react";
import { Common } from "@modules/common";

interface Scroller {
    children: any,
    className?: string,
    dir?: string,
    orientation?: string,
    overflow?: string,
    fade?: Boolean,
    customTheme?: Boolean,
    scrollbarGutter?: string,
    ref: React.RefObject<any>,
    style?: Object,
    type: 'auto' | 'none' | 'thin',
    disableFocusRingScope?: Boolean
}

export default function({children, className, dir="ltr", orientation="vertical", overflow="scroll", fade=false, customTheme=false, scrollbarGutter="stable", ref, style, type, disableFocusRingScope=false, ...other}: Scroller) {
    const scrollerClass = type === 'auto' ? Common.ScrollerClasses.auto : type === "none" ? Common.ScrollerClasses.none : type === 'thin' && Common.ScrollerClasses.thin;
    const {scrollerRef, getScrollerState} = Common.ScrollerRefHandler();
    const scrollHandler = Common.ScrollerScrollHandler(scrollerRef, orientation);

    useImperativeHandle(ref, () => ({
        getScrollerNode: () => scrollerRef.current,
        getScrollerState: getScrollerState,
        ...Common.ScrollerAnimationHandler(scrollerRef, getScrollerState, scrollHandler, orientation)
    }), [scrollerRef, getScrollerState, scrollHandler, orientation]);

    const gutter = Common.ScrollerGutterHandler({scrollbarGutter, orientation, className, scrollerRef: scrollerRef});
    const gutterClass = !scrollbarGutter || orientation !== "vertical" ? void 0 : scrollbarGutter === "stable" ? Common.ScrollerClasses.scrollbarGutterStable : Common.ScrollerClasses.scrollbarGutter;

    return (
        <div
            ref={scrollerRef}
            className={Utils.className(
                className, 
                gutterClass, 
                scrollerClass,
                fade && Common.ScrollerClasses.fade, 
                customTheme && Common.ScrollerClasses.customTheme
            )}
            style={Common.ScrollerStyleHandler(style, orientation, overflow)}
            dir={dir}
            {...other}
            ><Common.ContainerRefProvider disableFocusRingScope={disableFocusRingScope} containerRef={scrollerRef}>{[children, gutter]}</Common.ContainerRefProvider>
        </div>
    )
}