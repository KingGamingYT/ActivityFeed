import { Net } from 'betterdiscord';
import { useState, useLayoutEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import { Common } from '@modules/common';
import { ChannelStore, UserStore, VoiceStateStore } from "@modules/stores";

function checkImage(url) {
    let image = new Image();
    image.onload = function() {
        if (this.width > 0) {
            return true;
        }
    }
    image.onerror = function() {
        return false;
    }
    image.src = url;
}

export function chunkArray(cards, num) {
    let chunkLength = Math.max(cards.length / num, 1);
    const chunks = [];
    for (let i = 0; i < num; i++) {
        if(chunkLength*(i+1) <= cards.length) chunks.push(cards.slice(Math.ceil(chunkLength*i), Math.ceil(chunkLength*(i+1))));
    }
    return chunks; 
}

export function getVoiceParticipants({voice}) {
    let participants = [];
    const channelParticipants = Object.keys(VoiceStateStore.getVoiceStatesForChannel(voice));
    for (let i = 0; i < channelParticipants.length; i++) {
        participants.push(UserStore.getUser(channelParticipants[i]))
    }
    return participants;
}

export function TimeClock({timestamp}) {
    const time = Math.floor((Date.now() - new Date(parseInt(timestamp)))/1000)

    if ( (time / 86400) > 1 ) {
        return Common.intl.intl.formatToPlainString(Common.intl.t['2rUo/p'], { time: Math.floor(time / 86400) });
    }
    else if ( (time / 3600) > 1 ) {
        return Common.intl.intl.formatToPlainString(Common.intl.t['eNoooU'], { time: Math.floor(time / 3600) });
    }
    else if ( (time / 60) > 1 ) {
        return Common.intl.intl.formatToPlainString(Common.intl.t['03mIHW'], { time: Math.floor(time / 60) });
    }
    else if ( (time % 60) < 60 ) {
        return Common.intl.intl.formatToPlainString(Common.intl.t['ahzZr+']);
    }
}

export function GradGen(check, isSpotify, activity, game, voice, stream) {
    let input;
    switch (true) {
        case !! check?.streaming: activity.name.toLowerCase().includes("youtube") ? input = 'https://discord.com/assets/ff3516ac66b71ef616b1df63e20fee65.png' : input = 'https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg'; break;
        case !! isSpotify: input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`; break;
        case !! activity?.name.includes("YouTube Music"): input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf('/'))}`; break;
        case !! activity?.platform?.includes("xbox"): input = 'https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png'; break;
        case !! (activity?.assets && activity?.assets.large_image?.includes('external')): input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf('/'))}`; break;
        case !! (activity?.assets && activity?.assets.large_image): input = `https://cdn.discordapp.com/app-assets/${activity?.application_id}/${activity?.assets?.large_image}.png`; break;
        case !! game?.icon: input = `https://cdn.discordapp.com/app-icons/${game?.id}/${game?.icon}.png?size=1024&keep_aspect_ratio=true`; break;
        case !! voice[0]?.guild: input = `https://cdn.discordapp.com/icons/${voice[0]?.guild.id}/${voice[0]?.guild.icon}.png?size=1024`; break; 
        case !! voice && stream: input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`; break;
    }
    //if (!checkImage(input)) console.warn("[GradientComponent] Failed to load gradient for card", activity, game);
    return Common.GradientComponent(input || null);
}

export function SplashGen(isSpotify, activity, game, voice, stream, check) {
    let input;
    switch (true) {
        case !! game?.currentGame?.splash?.length: input = `https://cdn.discordapp.com/app-icons/${game?.currentGame?.id}/${game?.currentGame?.splash}.png?size=1024&keep_aspect_ratio=true`; break;
        case !! isSpotify: input = `https://i.scdn.co/image/${activity?.assets.large_image?.substring(activity.assets.large_image.indexOf(':')+1)}`; break;
        case !! ["YouTube Music", "Crunchyroll"].includes(activity?.name): input = `https://media.discordapp.net/external${activity?.assets.large_image.substring(activity?.assets.large_image.indexOf('/'))}`; break;
        case !! (voice && voice[0]?.guild?.banner && !activity): input = 'https://cdn.discordapp.com/banners/' + voice[0]?.guild?.id + '/' + voice[0]?.guild?.banner + '.webp?size=1024&keep_aspect_ratio=true'; break;
        case !! (voice && stream): stream.guildId ? input = `https://cdn.discordapp.com/icons/${stream.guildId}/${voice[0]?.guild?.icon}.png?size=1024` : input = `https://cdn.discordapp.com/channel-icons/${stream.channelId}/${ChannelStore.getChannel(stream.channelId)?.icon}.png?size=1024`; break;
        case !! (voice && !activity): input = `https://cdn.discordapp.com/icons/${voice[0]?.guild?.id}/${voice[0]?.guild?.icon}.png?size=1024`; break;
        case !! check?.streaming: activity.name.toLowerCase().endsWith('youtube') ? input = `https://discord.com/assets/0fa530ba9c04ac32.svg` : input = `https://discord.com/assets/d5c9d174036ef1b010d2812352393788.svg`; break;
        case !! (!game?.data?.supplementalData): input = `https://cdn.discordapp.com/app-icons/${game.currentGame?.id}/${game?.currentGame?.icon}.png?size=1024&keep_aspect_ratio=true`; break;
        default: input = game?.data?.supplementalData?.artwork[0];
    }
    return input || null;
}

export function activityCheck(activities, isSpotify) {
    if (!activities) return;
    let pass = {
        playing: 0,
        xbox: 0,
        playstation: 0,
        streaming: 0,
        listening: 0,
        spotify: 0,
        watching: 0,
        competing: 0,
        custom: 0
    };
    for (let i = 0; i < activities.length; i++) {
        if (!activities[i]) {
            return;
        }
        switch (activities[i]?.activity?.type) {
            case 0: pass.playing = 1; break;
            case 1: pass.streaming = 1; break;
            case 2: pass.listening = 1; break;
            case 3: pass.watching = 1; break;
            case 4: pass.custom = 1; break;
            case 5: pass.competing = 1; break;
        }
        if (activities[i]?.activity?.platform?.includes("xbox")) {
            pass.xbox = 1;
        }
        if (activities[i]?.activity?.platform?.includes("playstation") || activities[i]?.platform?.includes("ps5")) {
            pass.playstation = 1;
        }
        if (isSpotify) {
            pass.spotify = 1;
        }
    }
    return pass;
}

export function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export async function parseXML(xml) {
    let body = await xml;
    let result;
    const entities = [{key: "#8211", value: "–"}, {key: "#8217", value: "'"}];
    const parser = new XMLParser({ ignoreDeclaration: true, ignoreAttributes: false, attributeNamePrefix: "_", numberParseOptions: { leadingZeros: false, hex: true } });
    for (let e in entities) { parser.addEntity(entities[e].key, entities[e].value) };
    try {
        result = await parser.parse(body);
    } catch (e) {
        return null;
    }
    return result
}