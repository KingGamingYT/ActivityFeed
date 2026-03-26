import { Data } from "betterdiscord";
import { Common } from "@modules/common";
import settings from "@settings/settings";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function ArrowIcon({type}: {type: "left" | "right"}) {
    return (
        <svg width="24" height="24" className={`${FeedClasses.arrow} ${FeedClasses[type]}`}>
            <path 
                fill="currentColor" 
                fillRule="nonzero" 
                d={
                    (Data.load('v2News') ?? settings.default.v2News) ? "M12.7004 3.30002C12.5135 3.11679 12.2621 3.01416 12.0004 3.01416C11.7386 3.01416 11.4873 3.11679 11.3004 3.30002L3.30039 11.3C3.18577 11.386 3.09097 11.4956 3.02239 11.6214C2.95381 11.7472 2.91306 11.8862 2.90291 12.0291C2.89275 12.172 2.91342 12.3155 2.96352 12.4497C3.01362 12.5839 3.09198 12.7058 3.19328 12.8071C3.29459 12.9084 3.41649 12.9868 3.55072 13.0369C3.68494 13.087 3.82837 13.1077 3.97128 13.0975C4.11419 13.0873 4.25325 13.0466 4.37905 12.978C4.50484 12.9094 4.61443 12.8146 4.70039 12.7L11.0004 6.42002V20C11.0004 20.2652 11.1057 20.5196 11.2933 20.7071C11.4808 20.8947 11.7352 21 12.0004 21C12.2656 21 12.52 20.8947 12.7075 20.7071C12.895 20.5196 13.0004 20.2652 13.0004 20V6.41002L19.3004 12.71C19.4928 12.8726 19.7396 12.9565 19.9912 12.9451C20.2429 12.9336 20.4809 12.8276 20.6578 12.6482C20.8347 12.4688 20.9373 12.2292 20.9452 11.9774C20.9531 11.7256 20.8657 11.4801 20.7004 11.29L12.7004 3.29002V3.30002Z"
                    : "M13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"
                } />
        </svg>
    )
}

export function MiniSubpagination({article, currentArticle}) {
    return (
        <div
            className={article.index === currentArticle.index ? `${FeedClasses.dotSelected} ${FeedClasses.dot}` : `${FeedClasses.dotNormal} ${FeedClasses.dot}`}
            onClick={() => { NewsStore.setCurrentArticle(article.index); NewsStore.setIdling(false); NewsStore.setDirection(article.index - currentArticle.index) }}
        />
    )
}

export function FeedMiniPaginationBuilder({articleSet, currentArticle}) {
    return (
        <div className={FeedClasses.paginationSmall}>
            <button 
                type="button"
                className={`${FeedClasses.prevButtonContainer} ${FeedClasses.arrowContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`}
                onClick={() => { NewsStore.setCurrentArticle(currentArticle.index === 0 ? 3 : currentArticle.index - 1); NewsStore.setIdling(false); NewsStore.setDirection(-1) }}
            >
                <div className={Common.ButtonVoidClasses.contents}>
                    <ArrowIcon type={"left"} />
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
            className={`${FeedClasses.nextButtonContainer} ${FeedClasses.arrowContainer} ${FeedClasses.arrow} ${MainClasses.button} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.grow}`}
                onClick={() => { NewsStore.setCurrentArticle(currentArticle.index === 3 ? 0 : currentArticle.index + 1); NewsStore.setIdling(false); NewsStore.setDirection(1) }}
            >
                <div className={Common.ButtonVoidClasses.contents}>
                    <ArrowIcon type={"right"} />
                </div>
            </button>
        </div>
    )
}