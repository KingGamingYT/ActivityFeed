import { Common } from "@modules/common";
import { FeedOverflowBuilder } from "./OverflowBuilder";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function FeedCarouselBuilder({currentArticle}) {

    return (
        <span className={FeedClasses.carousel}>
            <FeedOverflowBuilder applicationId={currentArticle.article.application.id} gameId={currentArticle.id} position="right" />
            <a
                tabindex={currentArticle.index}
                className={`${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`}
                href="noreferrer nopener"
                target="_blank"
                role="button"
            >
                <div className={`${FeedClasses.articleStandard} ${FeedClasses.article}`} style={{ opacity: 1, zIndex: 1 }}>
                    <div className={FeedClasses.background}>
                        <div 
                            className={FeedClasses.backgroundImage}
                            style={{ 
                                backgroundImage: currentArticle.article.news?.thumbnail ? `url(${currentArticle.article.news?.thumbnail})`
                                : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.article.id}/capsule_616x353.jpg)`
                            }}
                        />
                    </div>
                </div>
            </a>
        </span>
    )
}

/*
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
*/