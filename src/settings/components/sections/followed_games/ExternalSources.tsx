import { Data } from "betterdiscord";
import { useState } from "react";
import { Common, ModalSystem } from "@modules/common";
import settings from "@settings/settings";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";
import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

// const DataStore = new class DB extends BdApi.Utils.Store {

// }

function ExternalItemBuilder({service}) {
    //const ext = BdApi.Hooks.useStateFromStore(DataStore, () => DataStore.getExternal())
    const item = settings.external[service];
    const [state, setState] = useState(Data.load("external")?.[service] || item.enabled);

    return (
        <div className={SettingsClasses.blacklistItem} style={{ display: "flex" }}>
            <item.icon className={SettingsClasses.blacklistItemIcon} color="WHITE" style={{ backgroundColor: item.color, padding: "5px" }} />
            <div className={SettingsClasses.blacklistItemTextContainer}>
                <div className={`${SettingsClasses.blacklistItemName} ${NowPlayingClasses.textRow}`}>{item.name || "Unknown Source"}</div>
                {item.note && <div className={`${SettingsClasses.blacklistItemDescription} ${MainClasses.emptySubtitle}`}>{item.note}</div>}
            </div>
            {!state ? 
                <button
                    className={`${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                    onClick={() => ModalSystem.openModal(props => 
                        <Common.ModalRoot.Modal 
                            {...props}
                            title="Are you sure?"
                            actions={[
                                {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                                {text: "Yes", fullWidth: 1, onClick: () => { Data.save("external", {...Data.load("external"), [service]: true}); setState(true); props.onClose(); }}
                            ]}
                        >
                            <>
                                <div className={MainClasses.emptyText}>Do you want to follow this source? Its announcements will appear in your Activity Feed.</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>This action will require you to restart Discord in order to see changes.</div>
                            </> 
                        </Common.ModalRoot.Modal>
                    )}
                >Follow</button>
            :
                <button
                    className={`${MainClasses.button} ${SettingsClasses.unhideBlacklisted} ${Common.ButtonVoidClasses.lookFilled} ${Common.ButtonVoidClasses.colorPrimary} ${Common.ButtonVoidClasses.sizeTiny} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyStart}`}
                    onClick={() => ModalSystem.openModal(props => 
                        <Common.ModalRoot.Modal 
                            {...props}
                            title="Are you sure?"
                            actions={[
                                {text: "Cancel", variant: "secondary", fullWidth: 0, onClick: () => props.onClose()},
                                {text: "Yes", fullWidth: 1, onClick: () => { Data.save("external", {...Data.load("external"), [service]: false}); setState(false); props.onClose(); }}
                            ]}
                        >
                            <>
                                <div className={MainClasses.emptyText}>Do you want to unfollow this source? Its announcements will be hidden from your Activity Feed.</div>
                                <div className={MainClasses.emptyText} style={{ fontWeight: 600 }}>This action will require you to restart Discord in order to see changes.</div>
                            </> 
                        </Common.ModalRoot.Modal>
                    )}
                >Unfollow</button>
            }
        </div>
    )
}

export function ExternalSourcesListBuilder() {
    return (
        <div className={SettingsClasses.blacklist}>{
            Object.keys(settings.external).map((key) => {
                return (
                    <>
                        <ExternalItemBuilder service={key} />
                        <div className={MainClasses.sectionDivider} />
                    </>
                )
            })
        }</div>
    )
}