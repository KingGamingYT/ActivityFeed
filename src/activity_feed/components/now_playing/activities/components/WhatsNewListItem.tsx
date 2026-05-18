import { ContextMenu } from "betterdiscord";
import { Common, ContextMenus } from "@modules/common";
import { ChannelStore } from "@modules/stores";
import { FlexInfo } from "@now_playing/activities/components/common/FlexInfo";
import { InactiveTimeClock } from "@common/methods/common";
import locale from "@activity_feed/common/methods/locale";
import MessageButton from "@now_playing/activities/components/common/MessageButton";
import AvatarWithPopoutWrapper from "./common/AvatarWithPopoutWrapper";
import Tooltip from "@common/components/TooltipBuilder";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function WhatsNewOverflowUserTooltip({player}) {
	return (
		<div className={NowPlayingClasses.soloAvatarTooltip}>
			<div className={MainClasses.emptyText}>{Common.UsernameUtils.getName(player.user)}</div>
			<div className={NowPlayingClasses.soloAvatarTooltipTimestamp}>{
				player.endedAt ? <InactiveTimeClock timestamp={ player?.endedAt } />
                : locale.Strings.NOW_PLAYING()	
			}</div>
		</div>
	)
}

function WhatsNewOverflowUser({player}) {
	const user = player.user;
	return (
		<Tooltip note={<WhatsNewOverflowUserTooltip player={player} />}>
			<div className={NowPlayingClasses.overflowUserOverflow}>
				<AvatarWithPopoutWrapper className={NowPlayingClasses.soloAvatar} user={user} size="SIZE_32" />
			</div>
		</Tooltip>
	)
}

export function WhatsNewListOverflow({players, v2Enabled}) {
	return (
		<>
			<div className={NowPlayingClasses.sectionTitleWrapper}>
				<div className={NowPlayingClasses.sectionTitle}>{locale.Strings.MORE_RECENT_PLAYERS_SECTION_TITLE({playerCount: players.length})}</div>
				{!v2Enabled && <div className={`${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}`}></div>}
			</div>
			<div className={NowPlayingClasses.overflownPlayers}>
				{players.map(player => { return <WhatsNewOverflowUser player={player} /> })}
			</div>
		</>
	)
}

export function WhatsNewListItem({player}) {
	const user = player.user;
	const status = player.status;
	const channel = ChannelStore.getDMChannelFromUserId(user.id);

	return (
		<div className={NowPlayingClasses.lastPlayedPlayer} onContextMenu={e => {let Menus = ContextMenus(); return Menus.ContextMenuUser(e, user, channel)}}>
            <AvatarWithPopoutWrapper className={`${NowPlayingClasses.lastPlayedAvatar} ${NowPlayingClasses.avatar}`} user={user} status={status} size="SIZE_40" />
            <FlexInfo className={`${NowPlayingClasses.details} ${NowPlayingClasses.lastPlayedDetails}`} type="LAST_PLAYED" activity={player} streamUser={user} />
			<MessageButton user={user} />
        </div>
	)
}