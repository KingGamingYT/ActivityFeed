import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function FeedPaginationBuilder({articleSet}) {
    return (
        <div className={FeedClasses.pagination}>
            <div className={FeedClasses.scrollerWrap}>
                <div className={`${FeedClasses.scroller} ${FeedClasses.verticalPaginationItemContainer}`}>{
                    Object.keys(articleSet).map(article => {
                        if (!articleSet[article]) return;

                        return (
                            <div 
                                className={articleSet[article].index === NewsStore.getCurrentArticle().index ? 
                                `${FeedClasses.paginationItem} ${FeedClasses.selectedPage}`
                                : FeedClasses.paginationItem}
                                onClick={() => NewsStore.setCurrentArticle(article)}
                                key={article}>
                                <div 
                                    className={FeedClasses.splashArt}
                                    style={{ 
                                        backgroundImage: articleSet[article].article.news?.thumbnail ? `url(${articleSet[article].article.news?.thumbnail})`
                                        : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${articleSet[article].article.id}/capsule_616x353.jpg)`
                                    }}
                                />
                            </div>
                        )
                    })
                }</div>
            </div>
        </div>
    )
}

/*

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