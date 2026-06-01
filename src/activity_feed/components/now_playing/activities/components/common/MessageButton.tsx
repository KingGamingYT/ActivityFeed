import { Common, ManaButtons } from "@modules/common";
import locale from "@common/methods/locale";

export default function ({user}) {
    return (
        <ManaButtons.PrimaryButtonWithIcon 
            text={locale.Strings.MESSAGE()}
            onClick={() => Common.OpenDM.openPrivateChannel({recipientIds: user.id})}
        />
    )
}