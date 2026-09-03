import { Hooks, ReactUtils } from "betterdiscord";
import { Common, ApplicationAssetUtils, AvatarUtils, FetchGameUtils } from "@modules/common";
import { ApplicationStore, ChannelStore } from "@modules/stores";
import { NowPlayingCardHeader, NowPlayingCardBody, WhatsNewCardHeader, WhatsNewCardBody } from "./card_shop/index";
import NowPlayingClasses from "./NowPlaying.module.css";
import PresenceTypeStore, { type ActivityProperties } from "./PresenceTypeStore";

function generateCardGradient(game: any, check?: ActivityProperties[], activity?: any, voice?: any, stream?: any) {
    let input;
    switch (true) {
        case !! check?.find(x => x.type === "STREAMING"): check?.find(x => x.platform === "YOUTUBE") ? input = 'https://discord.com/assets/ff3516ac66b71ef616b1df63e20fee65.png' : input = 'https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg'; break;
        case !! (voice && voice[0]?.guild): input = AvatarUtils.getGuildIconURL({id: voice[0]?.guild.id, icon: voice[0].guild.icon, size: 1024}); break; 
        case !! voice && stream: input = AvatarUtils.getChannelIconURL({id: stream.channelId, icon: ChannelStore.getChannel(stream.channelId)?.icon, size: 1024}); break;
        case !! (activity?.assets && activity?.assets.large_image): input = ApplicationAssetUtils.getAssetImage(activity?.application_id, activity?.assets?.large_image, 'png'); break;
        case !! (game?.icon || game?.iconHash): input = AvatarUtils.getApplicationIconURL({id: game?.id, icon: game?.icon || game?.supplementalData?.iconHash, size: 1024, keepAspectRatio: true}); break;
    }
    return Common.GradientComponent(input || null);
}

function generateCardSplash(game: any, isSpotify?: boolean, activity?: any, voice?: any, stream?: any, check?: ActivityProperties[]) {
    let input;
    switch (true) {
        case !! check?.find(x => x.type === "STREAMING"): check?.find(x => x.platform === "YOUTUBE") ? input = `https://discord.com/assets/0fa530ba9c04ac32.svg` : input = `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`; break;
        case !! (voice && voice[0]?.guild?.banner): input = AvatarUtils.getGuildBannerURL({id: voice[0]?.guild?.id, banner: voice[0]?.guild?.banner}); break;
        case !! (voice && stream): stream.guildId ? input = AvatarUtils.getGuildIconURL({id: stream.guildId, icon: voice[0]?.guild?.icon, size: 1024}) : input = AvatarUtils.getChannelIconURL({id: stream.channelId, icon: ChannelStore.getChannel(stream.channelId)?.icon, size: 1024}); break;
        case !! (voice && !activity): input = AvatarUtils.getGuildIconURL({id: voice[0]?.guild.id, icon: voice[0].guild.icon, size: 1024}); break;
        case !! game?.application?.splash: input = game.application.getSplashURL(2048, 'png'); break;
        case !! game?.data?.bannerHash?.length: input = game.data.getArtworkURLs()[0]; break;
        case !! (isSpotify || (activity?.details_url && activity?.state_url) || check?.find(x => x.platform === "CRUNCHYROLL")): input = ApplicationAssetUtils.getAssetImage(activity?.application_id, activity?.assets?.large_image, 'png'); break;
        case !! (!game?.data?.media?.artwork_urls && game?.data?.screenshotUrls): input = game?.data?.screenshotUrls[0]; break;
        case !! (!game?.data?.screenshotUrls): input = game?.application?.getIconURL(1024, 'webp'); break;
        default: input = game?.data?.media?.artwork_urls[0];
    }
    return input || null;
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
    const application = card.party.currentActivities[0]?.application;
    const voice = card.party.voiceChannels;
    const streams = card.party.applicationStreams;
    const isSpotify = card.party.isSpotifyActivity;
    const user = priorityMembers[0].user;
    const activityProperties = Hooks.useStateFromStores([PresenceTypeStore], () => PresenceTypeStore.getAllActivityProperties(activities, isSpotify));
    const cardGrad = generateCardGradient(application, activityProperties, activities[0]?.activity, voice, streams[0]?.stream);
    
    const {data, error, isLoading, refetch} = ReactUtils.wrapInHooks(FetchGameUtils.fetchGames)(application?.linkedGames?.[0]?.id || application?.id);
    const splash = generateCardSplash({application, data}, isSpotify, activities[0]?.activity, voice, streams[0]?.stream, activityProperties);

    return (
        <div className={v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card} style={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` }}>
            <NowPlayingCardHeader card={card} activities={activities} application={application} splash={splash} user={user} priorityMembers={priorityMembers} partiedMembers={partiedMembers} voice={voice} isSpotify={isSpotify} />
            <NowPlayingCardBody activities={activities} user={user} voice={voice} streams={streams} isSpotify={isSpotify} v2Enabled={v2Enabled} />
        </div>
    )
}

export function WhatsNewCardBuilder({card, v2Enabled}) {
    const players = card.players;
    const game = card.application;
    const titleNews = card.titleNews;
    const application = ApplicationStore.getApplication(game?.linkedApplications?.[0]?.id || game.id);
    const cardGrad = generateCardGradient(application ?? game);
    const splash = generateCardSplash({application, data: game});

    return (
        <div className={v2Enabled ? NowPlayingClasses.cardV2 : NowPlayingClasses.card} style={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})` }}>
            <WhatsNewCardHeader game={game} splash={splash} />
            <WhatsNewCardBody players={players} news={titleNews} v2Enabled={v2Enabled} />
        </div>
    )
}