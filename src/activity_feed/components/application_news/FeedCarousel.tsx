import { Hooks, Utils, Data } from "betterdiscord";
import { useState, useEffect } from "react";
import { useEffectEvent } from "@common/methods/common";
import { Common } from "@modules/common";
import { HorizontalFeedPagination, VerticalFeedPagination, FeedSkeleton, FeedSkeletonError } from "./components";
import FeedCarouselItem from "./components/Article";
import locale from "@activity_feed/common/methods/locale";
import settings from "@settings/settings";
import NewsStore from "@activity_feed/GameNewsStore";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function FeedCarousel() {
	const articles = Hooks.useStateFromStores([NewsStore], () => NewsStore.getArticlesForDisplay());
    const currentArticle = Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle());
    const orientation = Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
    const isIdling = Hooks.useStateFromStores([NewsStore], () => NewsStore.idling);
    const [time, setTime] = useState<Date>(new Date());
    const [waitTime, setWaitTime] = useState(true);
    
    useEffect(() => {
        const delay = setTimeout(() => setWaitTime(false), 1e4);

        return clearTimeout.bind(null, delay);
    }, [setWaitTime]);

    const timerCallback = useEffectEvent(() => {
        const newTime = Math.floor((Math.floor(new Date().getTime()) - Math.floor(time.getTime())) / 1e3);
        if (newTime > 0 && articles)
        {
            if (Math.floor(newTime) % 8 == 0 && isIdling)
            {
                NewsStore.setCurrentArticle(currentArticle.index === 3 ? currentArticle.index - 3 : currentArticle.index + 1);
            }
        }
    })

    useEffect(() => clearInterval.bind(null, setInterval(timerCallback, 8e3)), [isIdling]);

    if ( waitTime && !Object.keys(articles).length ) {
        return <FeedSkeleton />
    }

    switch(Data.load("freezeNews") ?? Number(settings.default.freezeNews)) {
        case 0: break;
        case 1: return <div className={Utils.className((Data.load('v2News') ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel)}><FeedSkeletonError 
            errorText={locale.Strings.ACTIVITY_FEED_UNAVAILABLE()}
            errorDescription="If you're seeing this, you've manually triggered this error. Welcome to the club!"
        /></div>
        case 2: return <FeedSkeleton />
    }

    if (Object.keys(articles).length) return (
        <>
            <div className={Utils.className((Data.load('v2News') ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel)} onMouseOver={() => {
                NewsStore.setIdling(false)
                setTime(new Date())
            }} onMouseLeave={() => {
                NewsStore.setIdling(true)
                setTime(new Date())
            }}>{
                orientation === "vertical" ? 
                    <>
                        <Common.TransitionGroup component="span" className={FeedClasses.carousel} transitionEnter={true} transitionAppear={true} transitionLeave={true}>
                            <FeedCarouselItem article={currentArticle} key={`${currentArticle.index}`} />
                        </Common.TransitionGroup>
                        <VerticalFeedPagination articleSet={articles} />
                    </>
                : orientation === "horizontal" ?
                    <>
                        <Common.TransitionGroup component="span" className={FeedClasses.smallCarousel} transitionEnter={true} transitionAppear={true} transitionLeave={true}>
                            <FeedCarouselItem article={currentArticle} key={`${currentArticle.index}`} />
                        </Common.TransitionGroup>
                        <HorizontalFeedPagination articleSet={articles} currentArticle={currentArticle} />
                    </>
                :
                    <FeedSkeletonError
                        errorText={locale.Strings.ACTIVITY_FEED_UNAVAILABLE()}
                        errorDescription={locale.Strings.ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_GENERIC()}
                    />
            }</div>
        </>
    )

    return <div className={Utils.className((Data.load('v2News') ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel)}>
        <FeedSkeletonError 
            errorText={locale.Strings.ACTIVITY_FEED_UNAVAILABLE()}
            errorDescription={locale.Strings.ACTIVITY_FEED_UNAVAILABLE_DESCRIPTION_NO_DATA()}
        />
    </div>
}