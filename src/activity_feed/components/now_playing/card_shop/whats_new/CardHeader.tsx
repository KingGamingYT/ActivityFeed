import { ContextMenu } from "betterdiscord";
import { Common } from "@modules/common";
import { GameIconAsset } from "@now_playing/activities/components/common/ActivityAssets";
import { ActivityCardContextMenu } from "@now_playing/activities/components/common/ActivityCardContextMenu";
import FollowButton from "@now_playing/activities/components/common/FollowButton";
import Splash from "@now_playing/activities/components/common/Splash";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function HeaderActions({game}) {
    return (
        <Common.Flex align={Common.Flex.Align.CENTER} className={NowPlayingClasses.headerActions} grow={true}>
            <FollowButton application={game} />
        </Common.Flex>
    )
}

function GameTag({game}) {
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: game?.id});

    return (
        <div className={NowPlayingClasses.nameTag} style={{ flex: 1 }}>
            <div className={NowPlayingClasses.headerTitle} 
                onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(NowPlayingClasses.clickableText)}
                onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(NowPlayingClasses.clickableText)}
                onClick={useGameProfile}
            >{game?.name}</div>
        </div>
    )
}

export function WhatsNewCardHeader({game, splash}) {

    return (
        <Common.Flex align={Common.Flex.Align.CENTER} className={NowPlayingClasses.cardHeader} onContextMenu={e => ContextMenu.open(e, (props) => <ActivityCardContextMenu {...props} user={{id: 0}} currentActivity={{type: 0}} currentGame={game} />)}>
            <Splash splash={splash} className={NowPlayingClasses.splashArt} />
            <div className={NowPlayingClasses.header}>
                <GameIconAsset url={game?.getIconURL(64, 'webp')} id={game?.id} name={game?.name} />
                <GameTag game={game} />
                <HeaderActions game={game} />
            </div>
        </Common.Flex>
    )
}