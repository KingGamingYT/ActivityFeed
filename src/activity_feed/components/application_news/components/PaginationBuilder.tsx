import { Hooks } from "betterdiscord";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

function Subpagination({article, articleSet}) {
    const isIdling = Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling())
    const direction = Hooks.useStateFromStores([NewsStore], () => NewsStore.getDirection(article.index - NewsStore.getCurrentArticle().index))
    return (
        <div 
            className={article.index === NewsStore.getCurrentArticle().index ? `${FeedClasses.paginationItem} ${FeedClasses.selectedPage}` : FeedClasses.paginationItem}
            onClick={() => { NewsStore.setCurrentArticle(article.index); NewsStore.setIdling(false)}}
            key={article}>
            <div 
                className={FeedClasses.splashArt}
                style={{ 
                    backgroundImage: article.news?.thumbnail ? `url(${article.news?.thumbnail})`
                    : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${article.id}/capsule_616x353.jpg)`
                }}
            />
            <div className={FeedClasses.paginationText}>
                <div className={`${FeedClasses.paginationTitle} ${FeedClasses.paginationContent}`}>{article.news?.title || "No Title"}</div>
                <div className={`${FeedClasses.paginationSubtitle} ${FeedClasses.paginationContent}`}>{article.application.name || "Unknown Game"}</div>
            </div>
        </div>
    )
}

export function FeedPaginationBuilder({articleSet}) {

    return (
        <div className={FeedClasses.pagination}>
            <div className={FeedClasses.scrollerWrap}>
                <div className={`${FeedClasses.scroller} ${FeedClasses.verticalPaginationItemContainer}`}>{
                    articleSet.map(article => {
                        if (!article) return;

                        return (
                           <Subpagination article={article} articleSet={articleSet} />
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