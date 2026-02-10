import { Common } from "@modules/common";
import { FeedOverflowBuilder } from "./OverflowBuilder";
import settings from "@./settings/settings";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function FeedCarouselBuilder({currentArticle}) {
    const External = settings.external[currentArticle.id];

    return (
        <span className={FeedClasses.carousel}>
            <FeedOverflowBuilder applicationId={currentArticle.application.id} gameId={currentArticle.id} articleUrl={currentArticle.news?.url} position="right" />
            <a
                tabindex={currentArticle.index}
                className={`${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`}
                href={currentArticle.news?.url || "#"}
                rel="noreferrer nopener"
                target="_blank"
                role="button"
            >
                <div className={`${FeedClasses.articleStandard} ${FeedClasses.article}`} style={{ opacity: 1, zIndex: 1 }}>
                    <div className={FeedClasses.background}>
                        <div 
                            className={FeedClasses.backgroundImage}
                            style={{ 
                                backgroundImage: currentArticle.news?.thumbnail ? `url(${currentArticle.news?.thumbnail})`
                                : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg)`
                            }}
                        />
                    </div>
                    <div className={FeedClasses.detailsContainer} style={{ opacity: 1, zIndex: 1 }}>
                        <div className={FeedClasses.applicationArea}>
                            {isNaN(currentArticle.news?.application_id) ?
                                <External.icon className={FeedClasses.gameIcon} color="WHITE" style={{ backgroundColor: External.color, padding: "5px", width: "30px", height: "30px" }} />
                                :
                                <img
                                    className={FeedClasses.gameIcon}
                                    src={currentArticle.news?.application_id && currentArticle.application?.icon
                                        ? `https://cdn.discordapp.com/app-icons/${currentArticle.news.application_id}/${currentArticle.application?.icon}.webp?size=64&keep_aspect_ratio=false`
                                        : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.news.application_id}/capsule_231x87.jpg`
                                    }
                                />
                            }
                            <div className={FeedClasses.details}>
                                <div className={`${FeedClasses.titleStandard} ${FeedClasses.title}`}>{currentArticle.news?.title || "No Title"}</div>
                                <div className={FeedClasses.description} dangerouslySetInnerHTML={{__html: currentArticle.news?.description || "No description available."}} />
                                <div className={FeedClasses.timestamp}>{Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), {dateStyle: "long"})}</div>
                            </div>
                        </div>
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