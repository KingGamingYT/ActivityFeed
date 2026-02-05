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

/*return (
        createElement('div', { className: "paginationSmall_267ac" }, [
            createElement('button', { 
                type: "button", 
                className: `prevButtonContainer_267ac arrow_267ac button_267ac ${buttonClasses.lookFilled} ${buttonClasses.grow}`,
                onClick: () => { setArticle({index: article.index - 1, direction: -1, idling: false, orientation: handleOrientation()}) },
                disabled: article.index !== 0 ? false : true },
                createElement('div', { className: `${buttonClasses.contents}`},
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
                className: `nextButtonContainer_267ac arrow_267ac button_267ac ${buttonClasses.lookFilled} ${buttonClasses.grow}`,
                onClick: () => { setArticle({index: article.index + 1, direction: 1, idling: false, orientation: handleOrientation()}) },
                disabled: article.index !== 3 ? false : true },
                createElement('div', { className: `${buttonClasses.contents}`},
                    createElement('svg', { width: 24, height: 24, className: "arrow_267ac right_267ac"},
                        createElement('polygon', { fill: "currentColor", fillRule: "nonzero", points: "13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"})
                    )
                )
            )    
        ])
    )
*/