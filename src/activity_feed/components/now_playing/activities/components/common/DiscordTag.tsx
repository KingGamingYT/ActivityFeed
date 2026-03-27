import { Common } from "@modules/common";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
export default function ({user, voice}) {
    let outputtedUsername;
    switch (true) {
        case !! (voice && voice[0]?.members.length > 2): outputtedUsername = `${user.globalName || user.username}, ${Common.intl.intl.formatToPlainString(Common.intl.t['zRRd8G'], { count: voice[0]?.members.length - 2, name: (voice[0]?.members[voice[0]?.members.length - 1].globalName ||  voice[0]?.members[voice[0]?.members.length - 1].username) })}`; break;
        case !! (voice && voice[0]?.members.length > 1): outputtedUsername = Common.intl.intl.formatToPlainString(Common.intl.t['4SM/RX'], { user1: (user.globalName || user.username || voice[0]?.members[1].username), user2: (voice[0]?.members[1].globalName || voice[0]?.members[1].username) }); break;
        default: outputtedUsername = user.globalName || user.username;
    }

    return (
        <div className={NowPlayingClasses.nameTag} style={{ flex: 1 }}>
            <span className={`${NowPlayingClasses.username} username`} onClick={() => Common.ModalAccessUtils.openUserProfileModal({ userId: user.id })}>{outputtedUsername}</span>
        </div>
    )
}