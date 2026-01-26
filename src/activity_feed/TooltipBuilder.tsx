import { Common } from '@modules/common';

export default TooltipBuilder = ({ note, position, children }) => {
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