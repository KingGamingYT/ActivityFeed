import { Common } from '@modules/common';

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
                children.props = {
                    ...props,
                    ...children.props
                };
                return children;
            }}
        </Common.Tooltip>
    )
}