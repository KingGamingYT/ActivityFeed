import { useState, useRef } from "react";
import { Common, ContextMenus } from "@modules/common";
import { ChannelStore, UserStore, useStateFromStores } from "@modules/stores";
import { FlexInfo } from "@now_playing/activities/components/common/FlexInfo";
import { InactiveTimeClock } from "@common/methods/common";
import locale from "@activity_feed/common/methods/locale";
import MessageButton from "@now_playing/activities/components/common/MessageButton";
import AvatarWithPopoutWrapper from "./common/AvatarWithPopoutWrapper";
import Tooltip from "@common/components/TooltipBuilder";
import Scroller from "@common/components/Scroller";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

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

function WhatsNewOverflowExtraPopout({players}) {
	const [showPopout, setShowPopout] = useState(false);
	const scrollerRef = useRef(null);
	const popoutRef = useRef(null);
	const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());

	return (
		<Scroller className={Common.ScrollerOverflowPopoutClasses.scroller} ref={scrollerRef} type="thin">
			<div className={NowPlayingClasses.popoutContainer}>{
				players.map(player => {
					const user = player.user;
					return (
						<Common.Popout
							shouldShow={showPopout}
							clickTrap={true}
							position="top"
							targetElementRef={popoutRef}
							onRequestClose={() => setShowPopout(false)}
							renderPopout={() => <Common.UserProfileWrapperComponent currentUser={currentUser} user={user} />}>
							{(props) => <div {...props} ref={popoutRef} className={NowPlayingClasses.userListItem}>
								<Common.AvatarFetch imageClassName={`${NowPlayingClasses.lastPlayedAvatar} ${NowPlayingClasses.avatar}`} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`} size={"SIZE_32"} />
								<FlexInfo className={`${NowPlayingClasses.details} ${NowPlayingClasses.lastPlayedDetails}`} type="LAST_PLAYED" activity={player} streamUser={user} />
							</div>}
						</Common.Popout>
					)
				})
			}</div>
		</Scroller>
	)
}

function WhatsNewOverflowExtra({players}) {
	const [showPopout, setShowPopout] = useState(false);
	const refDOM = useRef(null);

	return (
		<Common.Popout
			shouldShow={showPopout}
			clickTrap={true}
			position="top"
			targetElementRef={refDOM}
			onRequestClose={() => setShowPopout(false)}
			renderPopout={() => <WhatsNewOverflowExtraPopout players={players} />}>
			{(props) => <div {...props} ref={refDOM} className={`${NowPlayingClasses.overflowUserOverflow} ${NowPlayingClasses.overflowExtraOverflow}`} onClick={() => {setShowPopout(true)}}>
				<div className={`${NowPlayingClasses.soloAvatar} ${NowPlayingClasses.avatarEmpty}`}>
					<div className={NowPlayingClasses.overflowExtraText}>{players.length > 99 ? ">99" : `+${players.length}`}</div>
				</div>
			</div>}
		</Common.Popout>
	)
}

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

export function WhatsNewListOverflow({players, overflowPlayerCount, extras, v2Enabled}) {
	return (
		<>
			<div className={NowPlayingClasses.sectionTitleWrapper}>
				<div className={NowPlayingClasses.sectionTitle}>{locale.Strings.MORE_RECENT_PLAYERS_SECTION_TITLE({playerCount: overflowPlayerCount})}</div>
				{!v2Enabled && <div className={`${NowPlayingClasses.sectionLine} ${MainClasses.sectionDivider}`}></div>}
			</div>
			<div className={NowPlayingClasses.overflownPlayers}>
				{players.map((player, index) => { 
					return (extras?.length && index === players.length - 1) ? <WhatsNewOverflowExtra players={extras} /> : <WhatsNewOverflowUser player={player} /> 
				})}
			</div>
		</>
	)
}