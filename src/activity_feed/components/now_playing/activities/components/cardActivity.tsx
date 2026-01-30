import { useEffect } from 'react';
import { Common } from '@modules/common';
import { ApplicationStore, DetectableGameSupplementalStore } from '@modules/stores';
import { GameProfileOpen } from '../methods/GameProfileOpen';
import { ConsoleImageAsset, FallbackAsset, GameIconAsset, RichImageAsset } from './common/ActivityAssets';
import { FlexInfo } from './common/FlexInfo';
import { RichActivityBuilder, RegularActivityBuilder } from "./InnerBuilder";
import { PartyFooter } from "./common/CardTrailing";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function ActivityCard({user, activities, currentActivity, currentGame, players, server, check, v2Enabled}) {
    const gameId = currentActivity?.application_id;

    useEffect(() => { 
        (async () => {
            await Common.FetchGames.getDetectableGamesSupplemental([gameId]);
        })()
    }, [gameId]);

    return (
        <>
            <div className={NowPlayingClasses.activityContainer}>
                <RegularActivityBuilder user={user} activity={currentActivity} game={currentGame} check={check} v2Enabled={v2Enabled} />
                {currentActivity?.assets && currentActivity?.assets.large_image && <RichActivityBuilder user={user} activity={currentActivity} v2Enabled={v2Enabled} />}
            </div>
            {v2Enabled && currentActivity?.party && currentActivity?.party.size && <PartyFooter party={currentActivity.party} players={players} user={user} activity={currentActivity} />}
            {activities.length > 1 && <div className={NowPlayingClasses.sectionDivider} />}
        </>
    )
}

function nActivityCard({user, activities, currentActivity, currentGame, players, server, check, v2Enabled}) {
    const gameId = currentActivity?.application_id;

    useEffect(() => { 
        (async () => {
            await FetchGames.getDetectableGamesSupplemental([gameId]);
        })()
    }, [gameId]);
        
    return ([
        createElement('div', { className: "activityContainer_267ac" }, [
            currentActivity?.assets && currentActivity?.assets.large_image ? [ 
                createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, check, v2Enabled }),
                createElement(RichActivityBuilder, { user, activity: currentActivity, v2Enabled })
            ] 
            : createElement(RegularActivityBuilder, { user, activity: currentActivity, game: currentGame, players, server, check, v2Enabled }),
            v2Enabled && currentActivity?.party && currentActivity?.party.size && [
                createElement('div', { className: "sectionDivider_267ac", style: { margin: "8px 0 8px 0" } }),
                createElement('div', { className: "partyStatusWrapper_267ac" }, [
                    createElement(PartyMemberListBuilder, {
                        activity: currentActivity,
                        users: players
                    }),
                    createElement('div', { className: "partyPlayerCount_267ac", style: { flex: "1 1 100%" } }, intl.intl.formatToPlainString(intl.t['gLu7NU'], { partySize: currentActivity.party?.size[0], maxPartySize: currentActivity.party?.size[1] })),
                    createElement(JoinButton, { user: user, activity: currentActivity })
                ])
            ],
            activities.length > 1 && createElement('div', { className: "sectionDivider_267ac" }),
        ])
    ])
}