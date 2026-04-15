import { Hooks, Utils, Data } from "betterdiscord";
import { useState, useEffect } from "react";
import { Common } from "@modules/common";
import { FeedCarouselBuilder, FeedMiniCarouselBuilder, FeedMiniPaginationBuilder, FeedPaginationBuilder, FeedSkeletonBuilder, FeedSkeletonErrorBuilder } from "./components";
import FeedArticle from "./Article";
import settings from "@settings/settings";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function NewsFeedBuilder() {
	const articles = Hooks.useStateFromStores([NewsStore], () => NewsStore.getFeedsForDisplay());
    const currentArticle = Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle());
    const orientation = Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
    const isIdling = Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling())
    const [time, setTime] = useState<Date>(new Date());
    const [waitTime, setWaitTime] = useState(true);


    useEffect(() => {
        const inv = setInterval(() => {
            const newTime = Math.floor((Math.floor(new Date().getTime()) - Math.floor(time.getTime())) / 1000)
            if (newTime > 0 && articles)
            {
                if (Math.floor(newTime) % 8 == 0 && isIdling)
                {
                    NewsStore.setCurrentArticle(currentArticle.index === 3 ? currentArticle.index - 3 : currentArticle.index + 1);
                }
            }
        }, 8e3);

        return () => clearInterval(inv)
    })

    switch(Data.load("freezeNews") ?? Number(settings.default.freezeNews)) {
        case 0: break;
        case 1: return <div className={Utils.className((Data.load('v2News') ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel)}><FeedSkeletonErrorBuilder 
            errorText="Activity Feed Unavailable"
            errorDescription="If you're seeing this, you've manually triggered this error. Welcome to the club!"
        /></div>
        case 2: return <FeedSkeletonBuilder />
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
                            <FeedArticle article={currentArticle} key={`${currentArticle.index}`} />
                        </Common.TransitionGroup>
                        <FeedPaginationBuilder articleSet={articles} />
                    </>
                : orientation === "horizontal" ?
                    <>
                        <Common.TransitionGroup component="span" className={FeedClasses.smallCarousel} transitionEnter={true} transitionAppear={true} transitionLeave={true}>
                            <FeedArticle article={currentArticle} key={`${currentArticle.index}`} />
                        </Common.TransitionGroup>
                        <FeedMiniPaginationBuilder articleSet={articles} currentArticle={currentArticle} />
                    </>
                :
                    <FeedSkeletonErrorBuilder 
                        errorText="Activity Feed Unavailable"
                        errorDescription="You've reached an ultra rare error! Reload Discord to try again. Error: orientation-match-failed"
                    />
            }</div>
        </>
    )
    
    setTimeout(() => setWaitTime(false), 10000);
    if ( waitTime && !Object.keys(articles).length ) {
        return <FeedSkeletonBuilder />
    }

    return <div className={Utils.className((Data.load('v2News') ?? settings.default.v2News) && FeedClasses.feedCarouselV2, FeedClasses.feedCarousel)}>
        <FeedSkeletonErrorBuilder 
            errorText="Activity Feed Unavailable"
            errorDescription="You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again."
        />
    </div>
}