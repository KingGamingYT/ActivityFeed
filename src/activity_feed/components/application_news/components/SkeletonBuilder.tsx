import { Hooks } from "betterdiscord";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function FeedSkeletonBuilder() {
    const type = Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());
    
    if (type === "vertical") {
		return (
			<div className={FeedClasses.feedCarousel}>
				<span className={FeedClasses.carousel}>
					<div className={`${FeedClasses.articleSkeleton} ${FeedClasses.article}`} />
				</span>
                <div className={FeedClasses.pagination}>
                    <div className={FeedClasses.scrollerWrap}>
                        <div className={`${FeedClasses.scroller} ${FeedClasses.verticalPaginationItemContainer}`}>
                            <div className={`${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}`} />
                            <div className={`${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}`} />
                            <div className={`${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}`} />
                            <div className={`${FeedClasses.paginationSkeleton} ${FeedClasses.paginationItem}`} />
                        </div>
                    </div>
                </div>
			</div>
		)
	} 
	else if (type === "horizontal") {
		return (
			<div className={FeedClasses.feedCarousel}>
				<span className={FeedClasses.smallCarousel}>
					<div className={`${FeedClasses.articleSkeleton} ${FeedClasses.articleSimple} ${FeedClasses.article}`} />
				</span>
			</div>
		)
	}
	else console.log(`Failed to get correct orientation! Here is the current value: ${type}`);
	return;
}