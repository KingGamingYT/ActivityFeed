import { Common } from "@modules/common";
import locale from "@activity_feed/common/methods/locale";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

interface DiscordTag {
    user: Object,
    partiedMembers?: Array<Object>,
    voice?: Array<Object>
}

export default function ({user, partiedMembers, voice}: DiscordTag) {
    let outputtedUsername;
    if (voice && voice[0]) {
        const user1 = Common.UsernameUtils.getName(partiedMembers?.[0]);
        const user2 = partiedMembers?.[1] && Common.UsernameUtils.getName(partiedMembers[1])
        switch(partiedMembers?.length) {
            case 1: outputtedUsername = user1; break;
            case 2: outputtedUsername = locale.Strings.USER_AND_USER({user1, user2}); break;
            default: outputtedUsername = locale.Strings.USER_AND_USER_AND_OTHERS({user1, user2, extras: partiedMembers.length - 2}); break;
        }
    }
    else {
        outputtedUsername = Common.UsernameUtils.getName(user);
    }

    return (
        <div className={NowPlayingClasses.nameTag} style={{ display: "flex", flex: 1 }}>
            <span className={`${NowPlayingClasses.username} username`} onClick={() => Common.ModalAccessUtils.openUserProfileModal({ userId: user.id })}>{outputtedUsername}</span>
        </div>
    )
}