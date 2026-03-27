import { useEffect } from "react";
import { Common } from "@modules/common";
import { activityCheck, GradGen, SplashGen } from "@common/methods/common";
import { ApplicationStore, ContentInventoryStore, NewGameStore, GameStore, useStateFromStores } from "@modules/stores";
import { NowPlayingCardHeader, NowPlayingCardBody, WhatsNewCardHeader, WhatsNewCardBody } from "./card_shop/index";
import NowPlayingClasses from "./NowPlaying.module.css";

export function NowPlayingCardBuilder({card, v2Enabled}) {
    const user = card.party.priorityMembers[0].user;
    const activities = card.party.currentActivities;
    const currentGame = card.party.currentActivities[0]?.game;
    const voice = card.party.voiceChannels;
    const streams = card.party.applicationStreams;
    const isSpotify = card.party.isSpotifyActivity;
    const filterCheck = activityCheck(activities, isSpotify);
    const cardGrad = GradGen({check: filterCheck, isSpotify, activity: activities[0]?.activity, game: currentGame, voice, stream: streams[0]?.stream});

    (async () => {
        if (!NewGameStore.getGame(currentGame?.id)) {
            Common.FetchGames?.k(currentGame?.id)
        }
    })
    
    const game = NewGameStore.getGame(currentGame?.id) || (ApplicationStore.getApplication(currentGame?.id) && NewGameStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id));
    const splash = SplashGen({isSpotify, activity: activities[0]?.activity, game: {currentGame: currentGame, data: game}, voice, stream: streams[0]?.stream, check: filterCheck});

    return (
        <div className={v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card} style={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` }}>
            <NowPlayingCardHeader card={card} activities={activities} game={currentGame} splash={splash} user={user} voice={voice} isSpotify={isSpotify} />
            <NowPlayingCardBody activities={activities} user={user} voice={voice} streams={streams} check={filterCheck} isSpotify={isSpotify} v2Enabled={v2Enabled} />
        </div>
    )
}

export function WhatsNewCardBuilder({card, v2Enabled}) {
    const players = useStateFromStores([ContentInventoryStore], () => ContentInventoryStore.getFeeds()).get("global feed").unranked_game_entries.filter(entry => entry.content?.extra?.application_id?.includes(card));

    if (!NewGameStore.getGame(card)) {
        Common.FetchGames?.k(card)
    }

    if (!NewGameStore.getGame(card) || !ApplicationStore.getApplication(card)) return;

    const game = NewGameStore.getGame(card);
    const currentGame = NewGameStore.getGame(card) ? GameStore.getGameByApplication(ApplicationStore.getApplication(card)) : null;
    const cardGrad = GradGen({game: currentGame});
    const splash = SplashGen({game: {currentGame: currentGame, data: game}});

    return (
        <div className={v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card} style={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` }}>
            <WhatsNewCardHeader game={currentGame} splash={splash} />
        </div>
    )
}