import { ContextMenu, Data, Hooks } from "betterdiscord";
import { useState, useRef } from "react";
import { Common, ModalSystem } from "@modules/common";
import { UserSettingsProtoStore } from "@modules/stores";
import locale from "@activity_feed/common/methods/locale";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import FeedClasses from "@application_news/ApplicationNews.module.css";
import Tooltip from "@common/components/TooltipBuilder";

export function FeedPopout({application, gameId, articleUrl, close}) {
    const article = Hooks.useStateFromStores([NewsStore], () => NewsStore.getByGameId(gameId));

    if (isNaN(application.id)) {
        return (
            <ContextMenu.Menu navId="feed-overflow" onClose={close ?? ((e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e))}>
                <ContextMenu.Item id="copy-article-link" label={locale.Strings.COPY_ARTICLE_LINK()} action={() => Common.Clipboard(articleUrl)} />
                {!Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && Data.load('lockingInArticles') && <ContextMenu.Item 
                    id="lock-in-article" 
                    label="Lock In Article" 
                    action={() => NewsStore.lockInArticle(article)}
                />}
                {Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && Data.load('lockingInArticles') && <ContextMenu.Item 
                    id="unlock-article" 
                    label="Unlock Article" 
                    action={() => NewsStore.releaseLockedArticle(article)}
                />}
            </ContextMenu.Menu>
        )
    }

    return (
        <ContextMenu.Menu navId="feed-overflow" onClose={close ?? ((e) => Common.FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }).finally(e))}>
            {UserSettingsProtoStore.settings.appearance.developerMode && <ContextMenu.Item id="copy-app-id" label={locale.Strings.COPY_APPLICATION_ID()} action={() => Common.Clipboard(application.id)} />}
            <ContextMenu.Item id="copy-article-link" label={locale.Strings.COPY_ARTICLE_LINK()} action={() => Common.Clipboard(articleUrl)} />
            <ContextMenu.Item 
                id="unfollow-game" 
                label="Unfollow Game" 
                action={() => ModalSystem.openModal(props => 
                    <Common.ModalRoot.Modal 
                        {...props} 
                        title={locale.Strings.ARE_YOU_SURE()}
                        actions={[
                            {text: locale.Strings.CANCEL(), variant: "secondary", fullWidth: 0, onClick: () => props.onClose()}, 
                            {text: locale.Strings.YES(), fullWidth: 1, onClick: () => { NewsStore.blacklistGame(application, gameId); props.onClose() }}
                        ]}><>
                            <div className={MainClasses.emptyText}>{locale.Strings.ACTIVITY_FEED_UNSUBSCRIBE_FROM_GAME()}</div>
                            <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>{locale.Strings.ACTIVITY_FEED_ACTION_RESTART_REQUIRED()}</div>
                        </>    
                    </Common.ModalRoot.Modal>
            )} />
            {!Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && Data.load('lockedInArticles') && <ContextMenu.Item 
                id="lock-in-article" 
                label="Lock In Article" 
                action={() => NewsStore.lockInArticle(article)}
            />}
            {Hooks.useStateFromStores([NewsStore], () => NewsStore.isArticleLockedIn(article)) && Data.load('lockedInArticles') && <ContextMenu.Item 
                id="unlock-article" 
                label="Unlock Article" 
                action={() => NewsStore.releaseLockedArticle(article)}
            />}
        </ContextMenu.Menu>
    )
}

export function FeedOverflowBuilder({application, gameId, articleUrl, position}) {
    const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);

    return (
        <Common.Popout 
            targetElementRef={refDOM}
            clickTrap={true}
            onRequestClose={() => setShowPopout(false)}
            renderPopout={() => 
                <FeedPopout application={application} gameId={gameId} articleUrl={articleUrl} close={() => setShowPopout(false) } />
            }
            position={position}
            shouldShow={showPopout}
        >{(props) => <div
            {...props}
            ref={refDOM}
            onClick={() => setShowPopout(true)}
            style={{ position: "absolute", zIndex: 3, top: "0", right: "0" }}
            >
                <Tooltip note="More">
                    <div className={FeedClasses.feedOverflowMenu}>
                        <svg width="24" height="24">
                            <path d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" fill="white" />
                        </svg>
                    </div>
                </Tooltip>
            </div>
        }</Common.Popout>   
    )
}