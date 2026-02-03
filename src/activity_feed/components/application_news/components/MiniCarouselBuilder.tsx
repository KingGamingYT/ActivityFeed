import { FeedOverflowBuilder } from "./OverflowBuilder";
import NewsStore from "@activity_feed/Store";
import FeedClasses from "@application_news/ApplicationNews.module.css";

export function FeedMiniCarouselBuilder({currentArticle}) {
    return (
        <span className={FeedClasses.smallCarousel}>
            <FeedOverflowBuilder applicationId={currentArticle.article.application.id} gameId={currentArticle.id} position="right" />
        </span>
    )
}

/*
createElement('span', { className: "smallCarousel_267ac" }, [
                    createElement(NewsFeedOverflowBuilder, { application_id: currentItem.application.id, game_id: currentItem.id, position: "bottom" }),
                    createElement(NewsFeedMiniCarouselBuilder, { currentItem: currentItem, article: article })
                ]),
function NewsFeedMiniCarouselBuilder({currentItem, article}) {
    return (
        createElement('a', { 
            "tabindex": article.index, 
            className: `${anchorClasses.anchor} ${anchorClasses.anchorUnderlineOnHover}`,
            href: currentItem.news?.url || "#",
            rel: "noreferrer nopener", 
            target: "_blank", 
            role: "button"
        },
            createElement('div', { className: "articleSimple_267ac article_267ac" }, [
                createElement('div', { className: "background_267ac" },
                    createElement('div', { 
                        className: "backgroundImage_267ac", 
                        style: { backgroundImage: currentItem.news?.thumbnail 
                        ? `url(${currentItem.news?.thumbnail})` 
                        : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.id}/capsule_616x353.jpg)` } 
                    })
                ),
                createElement('div', { className: "detailsContainer_267ac", style: { opacity: 1, zIndex: 1, marginBottom: "40px" } }, [
                    createElement('div', { className: "applicationArea_267ac" },
                        createElement('img', { 
                            className: "gameIcon_267ac", 
                            src: currentItem.news?.application_id && currentItem.application?.icon
                            ? `https://cdn.discordapp.com/app-icons/${currentItem.news?.application_id}/${currentItem.application?.icon}.webp?size=64&keep_aspect_ratio=false`
                            : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentItem.id}/capsule_231x87.jpg`
                        })
                    ),
                    createElement('div', { className: "titleRowSimple_267ac" },
                        createElement('div', {className: "titleStandard_267ac title_267ac"}, currentItem.news?.title || "No Title")
                    )
                ])
            ])
        )
    )
}
*/