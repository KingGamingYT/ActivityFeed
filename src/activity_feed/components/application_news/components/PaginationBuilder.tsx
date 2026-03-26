import { Hooks } from "betterdiscord";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

function Subpagination({article}) {
    const currentArticle = Hooks.useStateFromStores([NewsStore], () => NewsStore.getCurrentArticle())
    const isIdling = Hooks.useStateFromStores([NewsStore], () => NewsStore.isIdling())
    return (
        <div 
            className={article.index === NewsStore.getCurrentArticle().index ? `${FeedClasses.paginationItem} ${FeedClasses.selectedPage}` : FeedClasses.paginationItem}
            onClick={() => { NewsStore.setCurrentArticle(article.index); NewsStore.setIdling(false); NewsStore.setDirection(article.index - currentArticle.index) }}
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
                <div className={`${FeedClasses.paginationSubtitle} ${FeedClasses.paginationContent}`}>{article.application?.name || "Unknown Game"}</div>
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

                        return <Subpagination article={article} />
                    })
                }</div>
            </div>
        </div>
    )
}