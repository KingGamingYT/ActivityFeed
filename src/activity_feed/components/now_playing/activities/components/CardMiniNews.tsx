import { Common } from "@modules/common";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function CardMiniNews({currentArticle}) {
	return (
		<a
            tabindex={currentArticle.index}
            className={`${Common.AnchorClasses.anchor} ${FeedClasses.newsLink} ${FeedClasses.news}`}
            href={currentArticle.news?.url || "#"}
            rel="noreferrer nopener"
            target="_blank"
            role="button"
        >
            <div className={FeedClasses.background}>
                <div 
                    className={FeedClasses.backgroundImage}
                    style={{ 
                        backgroundImage: `url(${currentArticle.news?.thumbnail}), 
                        url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg),
                        url(https://static.discord.com/assets/6a0d045ec452de05f71ee63fece2327f.svg)`
                    }}
                />
            </div>
            <div className={FeedClasses.details}>
                <div className={FeedClasses.title}>{currentArticle.news?.title || "No Title"}</div>
                <div className={FeedClasses.description} dangerouslySetInnerHTML={{__html: currentArticle.news?.description || "No description available."}} />
                <div className={FeedClasses.timestamp}>{Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), {dateStyle: "long"})}</div>
            </div>
        </a>
	)
}