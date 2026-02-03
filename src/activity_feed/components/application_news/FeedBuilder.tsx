import { FeedSkeletonErrorBuilder } from "./components";
import NewsStore from "@activity_feed/Store";

export function NewsFeedBuilder() {
	if ( NewsStore.shouldFetch() === true ) NewsStore.fetchFeeds();
	const articles = NewsStore.getFeedsForDisplay();
	if (!Object.keys(articles).length) {
        return <FeedSkeletonErrorBuilder 
            errorText="Activity Feed Unavailable"
            errorDescription="You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again."
        />
    }
}

/*function NewsFeedBuilder() {
    //const [width, height] = useWindowSize();
    const width = useStateFromStores([ WindowStore ], ()  => WindowStore.windowSize().width)
    const height = useStateFromStores([ WindowStore ], ()  => WindowStore.windowSize().height)
    const [timeout, setTime] = useState(true);

    const [applicationList, setApplicationList] = useState([]);
    const [steamIds, setSteamIds] = useState([]);
    const gameList = RunningGameStore.getGamesSeen().filter(game => GameStore.getGameByName(game.name));

    if (!gameList.length) return createElement(NewsFeedSkeletonErrorBuilder, { errorText: "Activity Feed Unavailable", errorDescription: "You may not have enough game history to create an Activity Feed. If you believe this isn't the case, reload Discord to try again." });
    
    const gameIds = gameList.filter(game => game.id || game.name === "Minecraft").map(game => game.name === "Minecraft" ? GameStore.getGameByName(game.name).id : game.id);

    useEffect(() => {
        (async () => {
            const response = await FetchApplication.fetchApplications(gameIds);
            const applicationList = gameList.map(game => BdApi.Webpack.getStore("ApplicationStore").getApplicationByName(game.name)).filter(game => game && game.thirdPartySkus.length > 0 && game.thirdPartySkus.some(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"))
            const steamIds = applicationList.map(game => { const steamSku = game.thirdPartySkus.find(sku => ["steam", "microsoft"].includes(sku.distributor) || sku.sku === "Fortnite"); return steamSku?.sku || game.name })
            setApplicationList(applicationList);
            setSteamIds(steamIds);
        })()
    },[gameIds, applicationList, steamIds]);

    if ( NewsStore.shouldFetch() === true && steamIds.length > 0 ) NewsStore.fetchFeeds(steamIds, applicationList);
    const feeds = useStateFromStores([ NewsStore ], () => NewsStore.getFeeds());
    
    const randomGames = NewsStore.getFeedsForDisplay();
    const handleOrientation = () => {
        return ((width > 1200 || height < 600) && (width < 1200 || height > 600)) ? "vertical" : "horizontal";
    }
    const handleDirection = (e) => {
        return e > 0 ? 1 : -1;
    };
    const handleSwitch = (cur) => {
        if (article.idling) {
            setArticle({index: cur.index === 3 ? article.index - 3 : article.index + 1, direction: cur.index === 3 ? -1 : 1, idling: true, orientation: handleOrientation()});
        }
        return;
    };
    const [article, setArticle] = useState({index: 0, direction: 1, idling: true, orientation: handleOrientation()});
    //console.log(NewsStore.getCurrentArticle())

    useEffect(() => {
        const interval = setInterval(() => {
            handleSwitch(article)
        }, 8e3);

        return () => clearInterval(interval);
    }, [article]);

    const getRootStyle = function(value) {
        var e = article.orientation === "horizontal" ? {
          translateX: value.interpolate({
            inputRange: [0, 1],
            outputRange: ["0px", "-15px"]
          })
        } : {
          translateY: value.interpolate({
            inputRange: [0, 1],
            outputRange: ["0px", "15px"]
          })
        };
        console.log(Animated.accelerate({     
        transform: [{
            scale: value.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [1.015, 1, 1.015]
            })
        }, e],
            opacity: value.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
                easing: Animated.Easing.out(Animated.Easing.ease)
            }),
        }))
        return Animated.accelerate({     
            transform: [{
                scale: value.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1.015, 1, 1.015]
                })
            }, e],
            opacity: value.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
                easing: Animated.Easing.out(Animated.Easing.ease)
            }),
            zIndex: 1
        })
    }
    //console.log(getRootStyle())

    if (feeds && randomGames.length > 0 && article.index < randomGames.length) {
        const currentItem = randomGames[article.index];
        //console.log([currentItem, article])
        //console.log(currentItem)
        //const [notTransitioning, setTransition] = useState(true);

        //const opacitySpring = useTransition(notTransitioning, {
        //    from: {
        //        opacity: Number(notTransitioning),
        //        zIndex: Number(notTransitioning)
        //    },
        ///    enter: {
        //        opacity: Number(notTransitioning),
        //        zIndex: Number(notTransitioning)    
        //    },
        //    leave: {
        //        opacity: Number(notTransitioning),
        //        zIndex: Number(notTransitioning)
        //    },
        //    onRest: () =>  setTransition(true)
        //})

        //const value = useRef(new Animated.Value(1)).current;
        if (!currentItem) {
            return createElement(NewsFeedSkeletonErrorBuilder, { errorText: "Failed to fetch news.", errorDescription: "Reload Discord to try again." });
        }
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