import { useState, useEffect } from "react";
import { Common } from "@modules/common";
import { CardMiniNews } from "@now_playing/activities/components/CardMiniNews";
import locale from "@activity_feed/common/methods/locale";
import NewsStore from "@activity_feed/GameNewsStore";
import FeedClasses from "@application_news/ApplicationNews.module.css";

const GameProfileTypes = {
    GAME_PROFILE_V2: 0,
    GAME_PROFILE_CLASSIC: 1
}

interface GameProfileRecentNews {
    applicationId: number,
    type: number
}

export default function ({applicationId, type}: GameProfileRecentNews) {
    const [article, setArticle] = useState({});

    useEffect(() => {
        (async () => {
            const pendingArticle = await NewsStore.fetchArticleByApplicationId(applicationId, false);
            setArticle(pendingArticle)
        })()
    }, [applicationId])

    if (type === GameProfileTypes.GAME_PROFILE_V2) return (
        article && Object.keys(article).length !== 0 && <div className={FeedClasses.recentNewsContainer}>
            <Common.Text variant="heading-lg/medium" color="text-strong">{locale.Strings.RECENT_NEWS()}</Common.Text>
            {Object.keys(article).length !== 0 && <CardMiniNews currentArticle={article} />}
        </div>
    )
    else if (type === GameProfileTypes.GAME_PROFILE_CLASSIC) return Object.keys(article).length !== 0 && <CardMiniNews currentArticle={article} />
    else throw Error(`Invalid GameProfileType passed: ${type}`);
}