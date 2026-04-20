import { useState, useEffect } from 'react';
import { Common, GameProfileClasses } from "@modules/common";
import { CardMiniNews } from "@activity_feed/components/now_playing/activities/components/CardMiniNews";
import NewsStore from "@activity_feed/Store";

export function RecentNews({applicationId, type}) {
    const [article, setArticle] = useState({});

    useEffect(() => {
        (async () => {
            const pendingArticle = await NewsStore.getDirectByApplicationId(applicationId, false);
            setArticle(pendingArticle)
        })()
    }, [applicationId])

    if (type === "GAME_PROFILE") return (
        article && Object.keys(article).length !== 0 && <div>
            <Common.UIModule.Heading className={GameProfileClasses().sectionHeader} variant="text-md/semibold" color="text-strong">Recent News</Common.UIModule.Heading>
            {Object.keys(article).length !== 0 && <CardMiniNews currentArticle={article} />}
        </div>
    )
    else if (type === "GAME_PROFILE_V2") return (
        article && Object.keys(article).length !== 0 && <div>
            <Common.UIModule.Heading variant="heading-lg/medium" color="text-strong">Recent News</Common.UIModule.Heading>
            {Object.keys(article).length !== 0 && <CardMiniNews currentArticle={article} />}
        </div>
    )
    return;
}