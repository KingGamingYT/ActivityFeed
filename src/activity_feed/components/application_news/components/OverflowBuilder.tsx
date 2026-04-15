import { ContextMenu, Data } from "betterdiscord";
import { useState, useRef } from "react";
import { Common, ModalSystem } from "@modules/common";
import { UserSettingsProtoStore } from "@modules/stores";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import FeedClasses from "@application_news/ApplicationNews.module.css";
import Tooltip from "@common/components/TooltipBuilder";

export function FeedPopout({application, gameId, articleUrl, close}) {
    const article = NewsStore.getByGameId(gameId);
    const confirmOptions = ["Be rid of it", "Yes", "Proceed"];
    const confirmText = confirmOptions[Math.floor(Math.random() * confirmOptions.length)];

    if (isNaN(application.id)) {
        return (
            <ContextMenu.Menu navId="feed-overflow" onClose={close}>
                <ContextMenu.Item id="copy-article-link" label="Copy Article Link" action={() => Common.Clipboard(articleUrl)} />
                {!NewsStore.isArticleLockedIn(article) && Data.load('lockingInArticles') && <ContextMenu.Item 
                    id="lock-in-article" 
                    label="Lock In Article" 
                    action={() => NewsStore.lockInArticle(article)}
                />}
                {NewsStore.isArticleLockedIn(article) && Data.load('lockingInArticles') && <ContextMenu.Item 
                    id="unlock-article" 
                    label="Unlock Article" 
                    action={() => NewsStore.releaseLockedArticle(article)}
                />}
            </ContextMenu.Menu>
        )
    }

    return (
        <ContextMenu.Menu navId="feed-overflow" onClose={close}>
            {UserSettingsProtoStore.settings.appearance.developerMode && <ContextMenu.Item id="copy-app-id" label="Copy Application ID" action={() => Common.Clipboard(applicationId)} />}
            <ContextMenu.Item id="copy-article-link" label="Copy Article Link" action={() => Common.Clipboard(articleUrl)} />
            <ContextMenu.Item 
                id="unfollow-game" 
                label="Unfollow Game" 
                action={() => ModalSystem.openModal(props => 
                    <Common.ModalRoot.Modal 
                        {...props} 
                        title="Are you sure?"
                        actions={[
                            {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()}, 
                            {text: confirmText, fullWidth: 1, onClick: () => { NewsStore.blacklistGame(application, gameId); props.onClose() }}
                        ]}><>
                            <div className={MainClasses.emptyText}>Do you want to hide this game from appearing in your Activity Feed? You can re-enable its visibility at any time in settings.</div>
                            <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>This action will require you to restart Discord in order to see changes.</div>
                        </>    
                    </Common.ModalRoot.Modal>
            )} />
            {!NewsStore.isArticleLockedIn(article) && Data.load('lockedInArticles') && <ContextMenu.Item 
                id="lock-in-article" 
                label="Lock In Article" 
                action={() => NewsStore.lockInArticle(article)}
            />}
            {NewsStore.isArticleLockedIn(article) && Data.load('lockedInArticles') && <ContextMenu.Item 
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
            renderPopout={() => <Common.PopoutContainer position={position}>
                <FeedPopout application={application} gameId={gameId} articleUrl={articleUrl} close={() => setShowPopout(false) } />
            </Common.PopoutContainer>}
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