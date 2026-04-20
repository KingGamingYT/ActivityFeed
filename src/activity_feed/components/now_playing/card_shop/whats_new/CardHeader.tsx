import { Common } from "@modules/common";
import { GameIconAsset } from "@now_playing/activities/components/common/ActivityAssets";
import FollowButton from "@now_playing/activities/components/common/FollowButton";
import Splash from "@now_playing/activities/components/common/Splash";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function HeaderActions({game}) {
    return (
        <div className={`${NowPlayingClasses.headerActions} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`} style={{ flex: "0" }}>
            <FollowButton application={game} />
        </div>
    )
}

function GameTag({game}) {
    const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: game?.id});

    return (
        <div className={NowPlayingClasses.nameTag} style={{ flex: 1 }}>
            <div className={NowPlayingClasses.headerTitle} 
                onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${NowPlayingClasses.clickableText}`)}
                onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${NowPlayingClasses.clickableText}`)}
                onClick={useGameProfile}>{game?.name}
            </div>
        </div>
    )
}

export function WhatsNewCardHeader({game, splash}) {

    return (
        <div className={`${NowPlayingClasses.cardHeader} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart} ${Common.PositionClasses.alignCenter}`} style={{ flex: "1 1 auto"}}>
            <Splash splash={splash} className={NowPlayingClasses.splashArt} />
            <div className={NowPlayingClasses.header}>
                <GameIconAsset url={`https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon ?? game?.iconHash}.webp?size=64&keep_aspect_ratio=false`} id={game?.id} name={game?.name} />
                <GameTag game={game} />
                <HeaderActions game={game} />
            </div>
        </div>
    )
}