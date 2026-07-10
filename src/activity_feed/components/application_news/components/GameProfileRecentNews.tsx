import { useState, useEffect } from 'react';
import { Common, GameProfileClasses } from "@modules/common";
import { useStateFromStores } from "@modules/stores";
import { CardMiniNews } from "@activity_feed/components/now_playing/activities/components/CardMiniNews";
import locale from "@activity_feed/common/methods/locale";
import NewsStore from "@activity_feed/GameNewsStore";

const GameProfileTypes = {
    GAME_PROFILE: 0,
    GAME_PROFILE_V2: 1,
    GAME_PROFILE_CLASSIC: 2
}

export function RecentNews({applicationId, type}) {
    const [article, setArticle] = useState({});

    useEffect(() => {
        (async () => {
            const pendingArticle = await useStateFromStores([NewsStore], () => NewsStore.fetchArticleByApplicationId(applicationId, false));
            setArticle(pendingArticle)
        })()
    }, [applicationId])

    if (type === GameProfileTypes.GAME_PROFILE) return (
        article && Object.keys(article).length !== 0 && <div>
            <Common.UIModule.Heading className={GameProfileClasses().sectionHeader} variant="text-md/semibold" color="text-strong">{locale.Strings.RECENT_NEWS()}</Common.UIModule.Heading>
            {Object.keys(article).length !== 0 && <CardMiniNews currentArticle={article} />}
        </div>
    )
    else if (type === GameProfileTypes.GAME_PROFILE_V2) return (
        article && Object.keys(article).length !== 0 && <div>
            <Common.UIModule.Heading variant="heading-lg/medium" color="text-strong">{locale.Strings.RECENT_NEWS()}</Common.UIModule.Heading>
            {Object.keys(article).length !== 0 && <CardMiniNews currentArticle={article} />}
        </div>
    )
    else if (type === GameProfileTypes.GAME_PROFILE_CLASSIC) return Object.keys(article).length !== 0 && <CardMiniNews currentArticle={article} />
    else throw Error(`Invalid GameProfileType passed: ${type}`);
}