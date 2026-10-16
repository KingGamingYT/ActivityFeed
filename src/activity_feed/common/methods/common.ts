import { useState, useLayoutEffect } from "react";
import locale from "./locale";

// splits arrays into the number of arrays specified by num
export function chunkArrayByNumber<T>(cards: T[], num: number) {
    let chunkLength = Math.max(cards.length / num, 1);
    const chunks: T[][] = [];
    for (let i = 0; i < num; i++) {
        if(chunkLength*(i+1) <= cards.length) chunks.push(cards.slice(Math.ceil(chunkLength*i), Math.ceil(chunkLength*(i+1))));
    }
    return chunks; 
}

// splits arrays into however many arrays of size length can contain the original array
export function chunkArrayBySize<T>(array: T[], size: number) {
    const result: T[][] = [];
    for(let i = 0; i < array.length; i += size)
    {
        // [1,99]
        // slice(i = 0,+112) [1,99]
        result.push(array.slice(i, i + size))
    }
    return result;
}

export function TimeClock(timestamp: EpochTimeStamp) {
    const parsedTimestamp = parseInt(String(timestamp));
    const time = Math.floor((Date.now() - new Date(parsedTimestamp).getTime())/1000)

    switch(true) {
        case !! ((time / 86400) > 1): return locale.Strings.PLAYING_FOR_DAY({ time: Math.floor(time / 86400) });
        case !! ((time / 3600) > 1): return locale.Strings.PLAYING_FOR_HOUR({ time: Math.floor(time / 3600) });
        case !! ((time / 60) > 1): return locale.Strings.PLAYING_FOR_MINUTE({ time: Math.floor(time / 60) });
        case !! ((time % 60 ) < 60): return locale.Strings.JUST_STARTED_PLAYING();
    }
}

export function InactiveTimeClock(timestamp: EpochTimeStamp) {
    const time = Math.floor((Date.now() - new Date(timestamp).getTime())/1000)

    switch(true) {
        case !! ((time / 86400) > 1): return locale.Strings.PLAYED_DAYS_AGO({ time: Math.floor(time / 86400) });
        case !! ((time / 3600) > 1): return locale.Strings.PLAYED_HOURS_AGO({ time: Math.floor(time / 3600) });
        case !! ((time / 60) > 1): return locale.Strings.PLAYED_MINUTES_AGO({ time: Math.floor(time / 60) });
        case !! ((time % 60 ) < 60): return locale.Strings.JUST_STOPPED_PLAYING();
        case !! (isNaN(time)): return TimeClock(timestamp);
    }
}

export function useWindowSize(): [number, number] {
    const [size, setSize] = useState<[number, number]>([0, 0]);
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