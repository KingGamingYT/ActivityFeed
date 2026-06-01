import { Utils } from "betterdiscord";
import { useRef } from "react";
import { Common } from "@modules/common";

interface Scroller {
    children: any,
    className?: string,
    dir?: string,
    orientation?: string,
    paddingFix?: Boolean,
    fade?: Boolean,
    ref: React.RefObject<any>,
    style?: Object,
    type: 'auto' | 'none' | 'thin'
}

export default function ({children, className, dir="ltr", orientation="vertical", paddingFix=true, fade=false, ref, style, type}: Scroller) {
    const scrollerClass = type === 'auto' ? Common.ScrollerClasses.auto : type === "none" ? Common.ScrollerClasses.none : type === 'thin' && Common.ScrollerClasses.thin;
    const classSpec = Common.ScrollerSpecHandler(scrollerClass);
    const refDOM = useRef(null);
    const handler = Common.ScrollerHandler({paddingFix, orientation, dir, className, scrollerRef: refDOM, spec: classSpec});

    return (
        <div 
            ref={() => {typeof ref == "function" ? ref(scrollerClass) : !ref && (ref.current = scrollerClass); refDOM.current = scrollerClass}} 
            className={Utils.className(className, scrollerClass, fade && Common.ScrollerClasses.fade)}
            style={Common.ScrollerStyleHandler(style, orientation)}
            dir={dir}
        ><Common.ContainerRefProvider containerRef={refDOM}>{[children, handler]}</Common.ContainerRefProvider></div>
    )
}