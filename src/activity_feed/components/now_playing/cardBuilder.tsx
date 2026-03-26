import { Common } from "@modules/common";
import { activityCheck, GradGen, SplashGen } from "@common/methods/common";
import { ApplicationStore, NewGameStore, GameStore } from "@modules/stores";
import { CardHeader, CardBody } from "./card_shop/index";
import NowPlayingClasses from "./NowPlaying.module.css";

export function NowPlayingCardBuilder({card, v2Enabled}) {
    const user = card.party.priorityMembers[0].user;
    const activities = card.party.currentActivities;
    const currentGame = card.party.currentActivities[0]?.game;
    const voice = card.party.voiceChannels;
    const streams = card.party.applicationStreams;
    const isSpotify = card.party.isSpotifyActivity;
    const filterCheck = activityCheck(activities, isSpotify);
    const cardGrad = GradGen(filterCheck, isSpotify, activities[0]?.activity, currentGame, voice, streams[0]?.stream);

    (async () => {
        if (!NewGameStore.getGame(currentGame?.id)) {
            Common.FetchGames?.k(currentGame?.id)
        }
    })
    
    const game = NewGameStore.getGame(currentGame?.id) || (ApplicationStore.getApplication(currentGame?.id) && NewGameStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id));
    const splash = SplashGen(isSpotify, activities[0]?.activity, {currentGame: currentGame, data: game}, voice, streams[0]?.stream, filterCheck);

    return (
        <div className={v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card} style={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` }}>
            <CardHeader card={card} activities={activities} game={currentGame} splash={splash} user={user} voice={voice} isSpotify={isSpotify} />
            <CardBody activities={activities} user={user} voice={voice} streams={streams} check={filterCheck} isSpotify={isSpotify} v2Enabled={v2Enabled} />
        </div>
    )
}