import { Hooks } from "betterdiscord";
import { Common } from "@modules/common";
import { GradGen, SplashGen } from "@common/methods/common";
import { ApplicationStore, NewGameStore, GameStore } from "@modules/stores";
import { NowPlayingCardHeader, NowPlayingCardBody, WhatsNewCardHeader, WhatsNewCardBody } from "./card_shop/index";
import NowPlayingClasses from "./NowPlaying.module.css";
import PresenceTypeStore from "./PresenceTypeStore";

export interface ActivityProperties {
    type: String,
    playing?: String | undefined
}

export function NowPlayingCardBuilder({card, v2Enabled}) {
    /*if (card instanceof Array) {
        const players = card.map(card => {
            const priorityMembers = card.party.priorityMembers;
            const activity = card.party.currentActivities[0].activity;
            return {
                user: priorityMembers[0].user,
                status: priorityMembers[0].status,
                createdAt: activity?.timestamps.start ?? activity.created_at
            }
        })
        console.log(players)
        return;
    }*/
    const priorityMembers = card.party.priorityMembers;
    const partiedMembers = card.party.partiedMembers;
    const activities = card.party.currentActivities;
    const currentGame = card.party.currentActivities[0]?.application;
    const voice = card.party.voiceChannels;
    const streams = card.party.applicationStreams;
    const isSpotify = card.party.isSpotifyActivity;
    const user = priorityMembers[0].user;
    const activityProperties = Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getAllActivityProperties(activities, isSpotify));
    const cardGrad = GradGen(currentGame, activityProperties, isSpotify, activities[0]?.activity, voice, streams[0]?.stream);

    (async () => {
        if (!NewGameStore.getGame(currentGame?.id)) {
            Common.FetchGames?.k(currentGame?.id)
        }
    })
    
    const game = NewGameStore.getGame(currentGame?.id) || (ApplicationStore.getApplication(currentGame?.id) && NewGameStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id));
    const splash = SplashGen({currentGame: currentGame, data: game}, isSpotify, activities[0]?.activity, voice, streams[0]?.stream, activityProperties);

    return (
        <div className={v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card} style={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` }}>
            <NowPlayingCardHeader card={card} activities={activities} game={currentGame} splash={splash} user={user} priorityMembers={priorityMembers} partiedMembers={partiedMembers} voice={voice} isSpotify={isSpotify} />
            <NowPlayingCardBody activities={activities} user={user} voice={voice} streams={streams} isSpotify={isSpotify} v2Enabled={v2Enabled} />
        </div>
    )
}

export function WhatsNewCardBuilder({card, v2Enabled}) {
    const players = card.players;
    const game = card.application;
    const titleNews = card.titleNews;
    const currentGame = GameStore.getGameByApplication(ApplicationStore.getApplication(card.application?.id) ?? card.application.id);
    const cardGrad = GradGen(currentGame ?? game);
    const splash = SplashGen({currentGame: currentGame, data: game});

    return (
        <div className={v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card} style={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` }}>
            <WhatsNewCardHeader game={game} splash={splash} />
            <WhatsNewCardBody players={players} news={titleNews} v2Enabled={v2Enabled} />
        </div>
    )
}