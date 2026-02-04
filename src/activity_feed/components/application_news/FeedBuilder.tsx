import { Hooks } from "betterdiscord";
import { useState, useEffect } from "react";
import { FeedCarouselBuilder, FeedMiniCarouselBuilder, FeedMiniPaginationBuilder, FeedOverflowBuilder, FeedPaginationBuilder, FeedSkeletonErrorBuilder } from "./components";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function NewsFeedBuilder() {
	if ( NewsStore.shouldFetch() === true ) NewsStore.fetchFeeds();
	const articles = Hooks.useStateFromStores([NewsStore], () => NewsStore.getFeedsForDisplay());
    const currentArticle = Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle());
    const orientation = Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
    const isIdling = Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling())
    const [time, setTime] = useState<Date>(new Date());
    const direction = Hooks.useStateFromStores([NewsStore], () => NewsStore.getDirection(currentArticle.index - NewsStore.getCurrentArticle().index))


    useEffect(() => {
    console.log(currentArticle)
        const inv = setInterval(() => {
            const newTime = Math.round((new Date().getTime() - time.getTime()) / 1000)
            if (newTime > 5)
            {
                if (Math.round(newTime) % 8 == 0)
                {
                    NewsStore.setCurrentArticle(currentArticle.index === 3 ? currentArticle.index - 3 : currentArticle.index + 1, direction, isIdling);
                }
            }
        }, 8000);

        return () => clearInterval(inv)
    })

    if (Object.keys(articles).length) return (
        <div className={FeedClasses.feedCarousel} onMouseOver={() => {
            NewsStore.setIdling(false)
            setTime(new Date())
        }} onMouseLeave={() => {
            NewsStore.setIdling(true)
            setTime(new Date())
        }}>{
            orientation === "vertical" ? 
                <>
                    <FeedCarouselBuilder currentArticle={currentArticle} />
                    <FeedPaginationBuilder articleSet={articles} />
                </>
            : orientation === "horizontal" ?
                <>
                    <FeedMiniCarouselBuilder currentArticle={currentArticle} />
                    <FeedMiniPaginationBuilder articleSet={articles} article={currentArticle} />
                </>
            :
                <FeedSkeletonErrorBuilder 
                    errorText="Activity Feed Unavailable"
                    errorDescription="You've reached an ultra rare error! Reload Discord to try again. Error: orientation-match-failed"
                />
        }</div>
    )  

    return <FeedSkeletonErrorBuilder 
        errorText="Activity Feed Unavailable"
        errorDescription="You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again."
    />
}

/*function NewsFeedBuilder() {
    
        if (width > 1200 && height > 600) {
            return createElement('div', { 
                className: "feedCarousel_267ac", 
                style: { margin: "20px" }, 
                onMouseOver: () => setArticle({index: article.index, direction: article.direction, idling: false, orientation: handleOrientation()}),
                onMouseLeave: () => setArticle({index: article.index, direction: article.direction, idling: true, orientation: handleOrientation()}) }, [
                createElement('span', { className: "carousel_267ac" }, [
                    createElement(NewsFeedOverflowBuilder, { application_id: currentItem.application.id, game_id: currentItem.id, position: "right" }),
                    createElement('a', { 
                            "tabindex": article.index, 
                            className: `${anchorClasses.anchor} ${anchorClasses.anchorUnderlineOnHover}`,
                            href: currentItem.news?.url || "#",
                            rel: "noreferrer nopener", 
                            target: "_blank", 
                            role: "button"
                        },
                        createElement('div', { className: "articleStandard_267ac article_267ac", style: { opactiy: 1, zIndex: 1 } }, [
                            createElement('div', { className: "background_267ac" },
                                createElement('div', { 
                                    className: "backgroundImage_267ac", 
                                    style: { backgroundImage: currentItem.news?.thumbnail 
                                    ? `url(${currentItem.news?.thumbnail})` 
                                    : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.id}/capsule_616x353.jpg)` } 
                                })
                            ),
                            createElement('div', { className: "detailsContainer_267ac", style: { opacity: 1, zIndex: 1 } }, [
                                createElement('div', { className: "applicationArea_267ac"}, 
                                    createElement('img', { 
                                        className: "gameIcon_267ac", 
                                        src: currentItem.news?.application_id && currentItem.application?.icon
                                        ? `https://cdn.discordapp.com/app-icons/${currentItem.news.application_id}/${currentItem.application?.icon}.webp?size=64&keep_aspect_ratio=false`
                                        : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.news.application_id}/capsule_231x87.jpg`
                                    })
                                ),
                                createElement('div', { className: "details_267ac" }, [
                                    createElement('div', { className: "titleStandard_267ac title_267ac" }, currentItem.news?.title || "No Title"),
                                    createElement('div', { className: "description_267ac", dangerouslySetInnerHTML: {__html: currentItem.news?.description || "No description available."}}),
                                    createElement('div', { className: "timestamp_267ac" }, DateGen(currentItem.news?.timestamp))
                                ])
                            ])
                        ])
                    )
            ]),
                createElement('div', { className: "pagination_267ac" },
                    createElement('div', { className: "scrollerWrap_267ac" },
                        createElement('div', { className: "scroller_267ac verticalPaginationItemContainer_267ac" },
                            randomGames.map((game, index) => {
                                if (!game) return null;

                                return createElement('div', { 
                                    className: article.index === index ? "paginationItem_267ac selectedPage_267ac" : "paginationItem_267ac", 
                                    onClick: () => { setArticle({index: index, direction: handleDirection(index - article.index)}) },
                                    key: index
                                }, [
                                    createElement('div', { 
                                        className: "splashArt_267ac", 
                                        style: { backgroundImage: game.news?.thumbnail 
                                            ? `url(${game.news?.thumbnail})` 
                                            : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.id}/capsule_231x87.jpg)` }
                                        }),
                                    createElement('div', { className: "paginationText_267ac" }, [
                                        createElement('div', { className: "paginationTitle_267ac paginationContent_267ac"}, game.news?.title || "No Title"),
                                        createElement('div', { className: "paginationSubtitle_267ac paginationContent_267ac"}, game.application.name || "Unknown Game")
                                    ]
                                )
                            ]);
                        }).filter(Boolean)
                    )
                )
            )]);
        }
        else {
            return createElement('div', { 
                className: "feedCarousel_267ac", 
                style: { margin: "20px" },
                onMouseEnter: () => setArticle({index: article.index, direction: article.direction, idling: false, orientation: handleOrientation()}),
                onMouseLeave: () => setArticle({index: article.index, direction: article.direction, idling: true, orientation: handleOrientation()}) }, [
                createElement('span', { className: "smallCarousel_267ac" }, [
                    createElement(NewsFeedOverflowBuilder, { application_id: currentItem.application.id, game_id: currentItem.id, position: "bottom" }),
                    createElement(NewsFeedMiniCarouselBuilder, { currentItem: currentItem, article: article })
                ]),
                createElement('div', { className: "paginationSmall_267ac" }, [
                    createElement('button', { 
                        type: "button", 
                        className: `prevButtonContainer_267ac arrow_267ac button_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.grow}`,
                        onClick: () => { setArticle({index: article.index - 1, direction: -1, idling: false, orientation: handleOrientation()}) },
                        disabled: article.index !== 0 ? false : true },
                        createElement('div', { className: `${ButtonVoidClasses.contents}`},
                            createElement('svg', { width: 24, height: 24, className: "arrow_267ac left_267ac"},
                                createElement('polygon', { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"})
                            )
                        )
                    ),
                    createElement('div', { className: "scrollerWrap_267ac"},
                        createElement('div', { className: `scroller_267ac horizontalPaginationItemContainer_267ac ${positionClasses.alignCenter}` },
                            randomGames.map((button, index) => {
                                return createElement('div', { 
                                    className: article.index === index ? "dotSelected_267ac dot_267ac" : "dotNormal_267ac dot_267ac",
                                    onClick: () => setArticle({index: index, direction: handleDirection(index - article.index), idling: false, orientation: handleOrientation()})
                                })
                            })
                        )
                    ),
                    createElement('button', { 
                        type: "button", 
                        className: `nextButtonContainer_267ac arrow_267ac button_267ac ${ButtonVoidClasses.lookFilled} ${ButtonVoidClasses.grow}`,
                        onClick: () => { setArticle({index: article.index + 1, direction: 1, idling: false}) },
                        disabled: article.index !== 3 ? false : true },
                        createElement('div', { className: `${ButtonVoidClasses.contents}`},
                            createElement('svg', { width: 24, height: 24, className: "arrow_267ac right_267ac"},
                                createElement('polygon', { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"})
                            )
                        )
                    )    
                ])
            ])
        }
    }

    setTimeout(() => setTime(false), 10000);
    if ( timeout ) {
        return createElement(NewsFeedSkeletonBuilder)
    }
    
    return createElement(NewsFeedSkeletonErrorBuilder, { errorText: "Activity Feed Unavailable", errorDescription: "You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again." });
}
*/