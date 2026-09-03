import { ContextMenu, Utils } from "betterdiscord";
import { Common } from "@modules/common";
import { FeedCarouselItemPopout } from "@application_news/components/FeedCarouselItemOverflow";
import type { Article } from "@activity_feed/GameNewsStore";
import FeedClasses from "@application_news/ApplicationNews.module.css";

interface CardMiniNews {
    currentArticle: Article,
    className?: string
}

export function CardMiniNews({currentArticle, className}: CardMiniNews) {
    const thumbnail = currentArticle.news?.thumbnail?.replace(/\s/g, "%20"); // fix for urls that have spaces in them thanks to lacking URI encoding

	return (
		<Common.Anchor
            tabIndex={currentArticle.index}
            className={Utils.className(FeedClasses.newsLink, FeedClasses.news, className)}
            href={currentArticle.news?.url || undefined}
            onContextMenu={(e: React.MouseEvent) => ContextMenu.open(e, (props) => <FeedCarouselItemPopout {...props} application={currentArticle.application} gameId={currentArticle.id} articleUrl={currentArticle.news?.url} /> )}
            target="_blank"
            useDefaultUnderlineStyles={false}
        >
            <div className={FeedClasses.background}>
                <div 
                    className={Utils.className(FeedClasses.backgroundImage, !thumbnail && FeedClasses.backgroundBackup)}
                    style={{ backgroundImage: thumbnail && `url(${thumbnail})` }}
                />
            </div>
            <div className={FeedClasses.body}>
                <div className={FeedClasses.title}>{currentArticle.news?.title || "No Title"}</div>
                <div className={FeedClasses.description} dangerouslySetInnerHTML={{__html: currentArticle.news?.description || "No description available."}} />
                <div className={FeedClasses.timestamp}>{Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), {dateStyle: "long"})}</div>
            </div>
        </Common.Anchor>
	)
}