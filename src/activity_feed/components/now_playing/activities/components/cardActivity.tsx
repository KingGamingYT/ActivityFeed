import { useEffect } from 'react';
import { Common } from '@modules/common';
import { ApplicationStore, DetectableGameSupplementalStore } from '@modules/stores';
import { GameProfileOpen } from '../methods/GameProfileOpen';
import { ConsoleImageAsset, FallbackAsset, GameIconAsset, RichImageAsset } from './common/ActivityAssets';
import { FlexInfo } from './common/FlexInfo';

function nActivityCard({user, activity, check}) {
    const gameId = activity?.application_id;

    useEffect(() => { 
        (async () => {
            if (!DetectableGameSupplementalStore.getGame(gameId)) {
                await Common.FetchGames.getDetectableGamesSupplemental([gameId]);
            }
        })()
    }, [gameId]);
          
    const game = DetectableGameSupplementalStore.getGame(gameId);
    const application = ApplicationStore.getApplication(activity?.application_id);

    return (
        <div className="activityProfile activity" id={`${activity.created_at}-${activity.type}`} key={`${activity.created_at}-${activity.type}`}>
            <div className="bodyNormal" style={{ display: "flex", alignItems: "center", width: "auto" }}>
                <div className="assets" style={{ position: "relative" }}
                    onMouseOver={(e) => game && e.currentTarget.classList.add(`${Common.ActivityCardClasses.clickableImage}`)}
                    onMouseLeave={(e) => game && e.currentTarget.classList.remove(`${Common.ActivityCardClasses.clickableImage}`)}
                    onClick={() => game && GameProfileOpen({gameId: gameId, userId: user.id})}>
                    { 
                        activity?.assets && activity?.assets.large_image && !activity?.platform?.includes('xbox') && (
                            <RichImageAsset 
                                url={
                                    isNaN(activity?.assets?.large_image) ? `https://media.discordapp.net/${activity.assets.large_image.substring(activity.assets.large_image.indexOf(':')+1)}`
                                    : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity?.assets.large_image}.png`
                                }
                                tooltipText={activity.assets.large_text || activity?.details}
                                type="Large"
                            />
                        ) 
                    }
                    {
                        activity?.platform?.includes('xbox') && (
                            <ConsoleImageAsset url={'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'} platform="XBOX" />
                        )
                    }
                    {
                        activity?.platform?.includes('ps5') && (
                            <ConsoleImageAsset url={`https://media.discordapp.net/external${activity.assets.small_image.substring(activity.assets.small_image.indexOf('/'))}`} platform="PLAYSTATION" />
                        )
                    }
                    {
                        activity?.application_id && (!activity?.assets || !activity?.assets.large_image) && !activity?.platform?.includes('xbox') && (
                            <GameIconAsset url={`https://cdn.discordapp.com/app-icons/${activity.application_id}/${application?.icon}.png`} name={activity.name} />
                        )   
                    }
                    {
                        !(user.bot || activity?.assets || activity?.application_id || application?.icon) && (
                            <FallbackAsset style={{ width: "40px", height: "40px" }} />
                        )
                    }
                    {
                        activity?.assets && activity?.assets?.large_image && activity?.assets?.small_image && (
                            <RichImageAsset 
                                url={
                                    isNaN(activity?.assets?.small_image) ? `https://media.discordapp.net/${activity.assets.small_image.substring(activity.assets.small_image.indexOf(':')+1)}`
                                    : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity?.assets.small_image}.png`
                                }
                                tooltipText={activity.assets.small_text || activity?.details}
                                type="Small"
                            />
                        )
                    }
                </div>
                <FlexInfo className="contentImagesProfile content" style={{ display: "grid", flex: "1", marginBottom: "3px" }} activity={activity} check={check} type="PLAYING" />
                <div className="buttonsWrapper actionsProfile">
                    <Common.ActivityButtons user={user} activity={activity} />
                </div>
            </div>
        </div>
    )
}

export function ActivityCard({user, activities, currentActivity})

function ActivityCard({user, activities, currentActivity, currentGame, players, server, check, v2Enabled}) {
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