import { Common, ManaButtons } from "@modules/common";

export default function ({user}) {
    return (
        <ManaButtons.PrimaryButtonWithIcon 
            text={Common.intl.intl.formatToPlainString(Common.intl.t['zROXEV'])}
            onClick={() => Common.OpenDM.openPrivateChannel({recipientIds: user.id})}
        />
    )
}