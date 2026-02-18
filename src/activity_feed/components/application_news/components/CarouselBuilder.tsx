import { useRef } from "react";
import { Common } from "@modules/common";
import { FeedOverflowBuilder } from "./OverflowBuilder";
import settings from "@settings/settings";
import FeedClasses from "@application_news/ApplicationNews.module.css";
import NewsStore from "@activity_feed/Store.js";

export function FeedCarouselBuilder({currentArticle}) {
    const External = settings.external[currentArticle.id];
    /*const getRootStyle = function(value) {
        var e = article.orientation === "horizontal" ? {
          translateX: value.interpolate({
            inputRange: [0, 1],
            outputRange: ["0px", "-15px"]
          })
        } : {
          translateY: value.interpolate({
            inputRange: [0, 1],
            outputRange: ["0px", "15px"]
          })
        };
        return Animated.accelerate({     
            transform: [{
                scale: value.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1.015, 1, 1.015]
                })
            }, e],
            opacity: value.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
                easing: Animated.Easing.out(Animated.Easing.ease)
            }),
            zIndex: 1
        })
    }*/
    const [springs, control] = Common.ReactSpring.useSpring(() =>
        (NewsStore.getOrientation() === "horizontal" ? {
            from: { x: 0, y: 0 },
            to: { x: 15, y: 15 },
        }
        : {
            from: { x: 0, y: 0 },
            to: { x: 15, y: 15 },
        })
    )

    return (
        <span className={FeedClasses.carousel}>
            <FeedOverflowBuilder applicationId={currentArticle.application.id} gameId={currentArticle.id} articleUrl={currentArticle.news?.url} position="right" />
            <a
                tabindex={currentArticle.index}
                className={`${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`}
                href={currentArticle.news?.url || "#"}
                rel="noreferrer nopener"
                target="_blank"
                role="button"
            >
                <Common.ReactSpring.animated.div className={`${FeedClasses.articleStandard} ${FeedClasses.article}`} style={{ opacity: 1, zIndex: 1 }}>
                    <div className={FeedClasses.background}>
                        <div 
                            className={FeedClasses.backgroundImage}
                            style={{ 
                                backgroundImage: currentArticle.news?.thumbnail ? `url(${currentArticle.news?.thumbnail})`
                                : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg)`
                            }}
                        />
                    </div>
                    <div className={FeedClasses.detailsContainer} style={{ opacity: 1, zIndex: 1 }}>
                        <div className={FeedClasses.applicationArea}>
                            {isNaN(currentArticle.news?.application_id) ?
                                <External.icon className={FeedClasses.gameIcon} color="WHITE" style={{ backgroundColor: External.color, padding: "5px", width: "30px", height: "30px" }} />
                                :
                                <img
                                    className={FeedClasses.gameIcon}
                                    src={currentArticle.news?.application_id && currentArticle.application?.icon
                                        ? `https://cdn.discordapp.com/app-icons/${currentArticle.news.application_id}/${currentArticle.application?.icon}.webp?size=64&keep_aspect_ratio=false`
                                        : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.news.application_id}/capsule_231x87.jpg`
                                    }
                                />
                            }
                            <div className={FeedClasses.details}>
                                <div className={`${FeedClasses.titleStandard} ${FeedClasses.title}`}>{currentArticle.news?.title || "No Title"}</div>
                                <div className={FeedClasses.description} dangerouslySetInnerHTML={{__html: currentArticle.news?.description || "No description available."}} />
                                <div className={FeedClasses.timestamp}>{Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), {dateStyle: "long"})}</div>
                            </div>
                        </div>
                    </div>
                </Common.ReactSpring.animated.div>
            </a>
        </span>
    )
}