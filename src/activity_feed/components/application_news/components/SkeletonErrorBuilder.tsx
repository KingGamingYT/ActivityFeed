import { Hooks } from 'betterdiscord';
import { ThemeStore } from "@modules/stores";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function FeedSkeletonErrorBuilder({errorText, errorDescription}) {
	const type = Hooks.useStateFromStores([NewsStore], () => NewsStore.getOrientation());

	if (type === "vertical") {
		return (
			<span className={FeedClasses.carousel}>
				<div className={`${FeedClasses.unavailable} ${FeedClasses.articleSkeleton} ${FeedClasses.article}`}>
					<div className={FeedClasses.background}>
						<div
							className={FeedClasses.backgroundImage}
							style={{ backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" }}
						/>
					</div>
					<div className={FeedClasses.detailsContainer}>
						<div className={FeedClasses.details}>
							<div className={`${FeedClasses.titleStandard} ${FeedClasses.title}`}>{errorText}</div>
							{errorDescription && <div className={FeedClasses.description}>{errorDescription}</div>}
						</div>
					</div>
				</div>
			</span>
		)
	} 
	else if (type === "horizontal") {
		return (
			<span className={FeedClasses.smallCarousel}>
				<div className={`${FeedClasses.articleSkeleton} ${FeedClasses.articleSimple} ${FeedClasses.article}`}>
					<div className={FeedClasses.background}>
						<div
							className={FeedClasses.backgroundImage}
							style={{ backgroundImage: ThemeStore.theme === "light" ? "url(https://discord.com/assets/645df33d735507f39c78ce0cac7437f0.svg)" : "url(https://discord.com/assets/8c998f8fb62016fcfb4901e424ff378b.svg)" }}
						/>
					</div>
					<div className={FeedClasses.detailsContainer} style={{ marginBottom: "40px" }}>
						<div className={FeedClasses.titleRowSimple}>
							<div className={`${FeedClasses.titleStandard} ${FeedClasses.title}`}>{errorText}</div>
						</div>
					</div>
				</div>
			</span>
		)
	}
	else console.log(`Failed to get correct orientation! Here is the current value: ${type}`);
	return;
}