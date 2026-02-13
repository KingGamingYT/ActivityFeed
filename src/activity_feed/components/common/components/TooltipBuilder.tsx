import { Common } from '@modules/common';

interface TooltipBuilder {
    note: string,
    position?: string,
    children: any
}

export default ({ note, position, children }: TooltipBuilder) => {
    return (
        <Common.Tooltip text={note} position={position || "top"}>
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