import { Common } from "@modules/common";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function MiniSubpagination({article, currentArticle}) {
    return (
        <div
            className={article.index === currentArticle.index ? `${FeedClasses.dotSelected} ${FeedClasses.dot}` : `${FeedClasses.dotNormal} ${FeedClasses.dot}`}
            onClick={() => NewsStore.setCurrentArticle(article.index)}
        />
    )
}

export function FeedMiniPaginationBuilder({articleSet, currentArticle}) {
    return (
        <div className={FeedClasses.paginationSmall}>
            <button 
                type="button"
                className={`${FeedClasses.prevButtonContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`}
                onClick={() => NewsStore.setCurrentArticle(currentArticle.index - 1)}
                disabled={currentArticle.index === 0 && true}
            >
                <div className={Common.ButtonVoidClasses.contents}>
                    <svg width="24" height="24" className={`${FeedClasses.arrow} ${FeedClasses.left}`}>
                        <polygon fill="currentColor" fillRule="nonzero" points="13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8" />
                    </svg>
                </div>
            </button>
            <div className={FeedClasses.scrollerWrap}>
                <div className={`${FeedClasses.scroller} ${FeedClasses.horizontalPaginationItemContainer} ${Common.PositionClasses.alignCenter}`}>{
                    articleSet.map(article => {
                        if (!article) return;

                        return <MiniSubpagination article={article} currentArticle={currentArticle} />
                    })
                }</div>
            </div>
            <button 
                type="button"
                className={`${FeedClasses.nextButtonContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`}
                onClick={() => NewsStore.setCurrentArticle(currentArticle.index + 1)}
                disabled={currentArticle.index === 3 && true}
            >
                <div className={Common.ButtonVoidClasses.contents}>
                    <svg width="24" height="24" className={`${FeedClasses.arrow} ${FeedClasses.right}`}>
                        <polygon fill="currentColor" fillRule="nonzero" points="13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8" />
                    </svg>
                </div>
            </button>
        </div>
    )
}