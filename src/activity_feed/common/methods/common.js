import { useState, useLayoutEffect, useRef, useMemo } from "react";
import locale from "./locale";

// splits arrays into the number of arrays specified by num
export function chunkArrayByNumber(cards, num) {
    let chunkLength = Math.max(cards.length / num, 1);
    const chunks = [];
    for (let i = 0; i < num; i++) {
        if(chunkLength*(i+1) <= cards.length) chunks.push(cards.slice(Math.ceil(chunkLength*i), Math.ceil(chunkLength*(i+1))));
    }
    return chunks; 
}

// splits arrays into however many arrays of size length can contain the original array
export function chunkArrayBySize(array, size) {
    const result = [];
    for(let i = 0; i < array.length; i += size)
    {
        // [1,99]
        // slice(i = 0,+112) [1,99]
        result.push(array.slice(i, i + size))
    }
    return result;
}

export function TimeClock({timestamp}) {
    const time = Math.floor((Date.now() - new Date(parseInt(timestamp)))/1000)

    switch(true) {
        case !! ((time / 86400) > 1): return locale.Strings.PLAYING_FOR_DAY({ time: Math.floor(time / 86400) });
        case !! ((time / 3600) > 1): return locale.Strings.PLAYING_FOR_HOUR({ time: Math.floor(time / 3600) });
        case !! ((time / 60) > 1): return locale.Strings.PLAYING_FOR_MINUTE({ time: Math.floor(time / 60) });
        case !! ((time % 60 ) < 60): return locale.Strings.JUST_STARTED_PLAYING();
    }
}

export function InactiveTimeClock({timestamp}) {
    const time = Math.floor((Date.now() - new Date(timestamp).getTime())/1000)

    switch(true) {
        case !! ((time / 86400) > 1): return locale.Strings.PLAYED_DAYS_AGO({ time: Math.floor(time / 86400) });
        case !! ((time / 3600) > 1): return locale.Strings.PLAYED_HOURS_AGO({ time: Math.floor(time / 3600) });
        case !! ((time / 60) > 1): return locale.Strings.PLAYED_MINUTES_AGO({ time: Math.floor(time / 60) });
        case !! ((time % 60 ) < 60): return locale.Strings.JUST_STOPPED_PLAYING();
        case !! (isNaN(time)): return TimeClock({timestamp});
    }
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

export function useEffectEvent(callback) {
    const ref = useRef(callback);

    ref.current = callback;

    return useMemo(() => {            
        const handler = {
            get [Symbol.for("callback")]() {
                return ref.current;
            }
        };

        for (const key of Reflect.ownKeys(Reflect)) {
            if (typeof Reflect[key] !== "function") continue;

            handler[key] = (_, ...args) => (
                Reflect[key](ref.current, ...args)
            );
        }

        return new Proxy(ref.current, handler);
    }, []);
}