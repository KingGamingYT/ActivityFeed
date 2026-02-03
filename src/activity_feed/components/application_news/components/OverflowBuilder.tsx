import { ContextMenu } from "betterdiscord";
import { useState, useRef } from "react";
import { Common, ModalSystem } from "@modules/common";
import NewsStore from "@activity_feed/Store";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import FeedClasses from "@application_news/ApplicationNews.module.css";
import Tooltip from "@activity_feed/TooltipBuilder";

function FeedPopout({applicationId, gameId, close}) {
    const confirmOptions = ["Be rid of it", "Yes", "Proceed"];
    const confirmText = confirmOptions[Math.floor(Math.random() * confirmOptions.length)];

    return (
        <ContextMenu.Menu navId="feed=overflow" onClose={close}>
            <ContextMenu.Item id="copy-app-id" label="Copy Application ID" action={() => Common.Clipboard(applicationId)} />
            <ContextMenu.Item 
                id="unfollow-game" 
                label="Unfollow Game" 
                action={() => ModalSystem.openModal(props => 
                    <Common.ModalRoot.Modal 
                        {...props} 
                        title="Are you sure?"
                        actions={[
                            {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()}, 
                            {text: confirmText, fullWidth: 1, onClick: () => { NewsStore.blacklistGame(applicationId, gameId); props.onClose() }}
                        ]}>
                            <>
                                <div className={MainClasses.emptyText}>Do you want to hide this game from appearing in your Activity Feed? You can re-enable its visibility at any time in settings.</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>This action will require you to restart Discord in order to see changes.</div>
                            </>    
                    </Common.ModalRoot.Modal>
                )} />
        </ContextMenu.Menu>
    )
}

export function FeedOverflowBuilder({applicationId, gameId, position}) {
    const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);

    return (
        <Common.Popout 
            targetElementRef={refDOM}
            clickTrap={true}
            onRequestClose={() => setShowPopout(false)}
            renderPopout={() => <Common.PopoutContainer position={position}>
                <FeedPopout applicationId={applicationId} gameId={gameId} close={() => setShowPopout(false) } />
            </Common.PopoutContainer>}
            position={position}
            shouldShow={showPopout}
        >{(props) => <div
            {...props}
            ref={refDOM}
            onClick={() => setShowPopout(true)}
            style={{ position: "absolute", zIndex: 2, top: "0", right: "0" }}
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