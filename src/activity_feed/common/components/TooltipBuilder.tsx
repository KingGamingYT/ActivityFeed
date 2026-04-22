import { cloneElement, Children } from "react";
import { Common } from "@modules/common";

interface TooltipBuilder {
    note: string | React.DetailedReactHTMLElement<any, any>,
    position?: string,
    children: any;
    forceOpen?: boolean;
}

export default ({ note, position, children, forceOpen }: TooltipBuilder) => {
    return (
        <Common.Tooltip text={note} forceOpen={forceOpen} position={position || "top"}>
            {props => {
                const child = Children.only(children);

                return cloneElement(child, Object.entries(props).reduce((pre, [key, value]) => {
                    pre[key] = key in props ? (...args) => {
                        child.props[key]?.(...args);
                        return value(...args);
                    } : value;
                    return pre;
                }, {}))
            }}
        </Common.Tooltip>
    )
}