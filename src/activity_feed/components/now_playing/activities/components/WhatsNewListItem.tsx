import { Common } from "@modules/common";
import { FlexInfo } from "@now_playing/activities/components/common/FlexInfo";
import { InactiveTimeClock } from "@common/methods/common";
import AvatarWithPopoutWrapper from "./common/AvatarWithPopoutWrapper";
import Tooltip from "@common/components/TooltipBuilder";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

function WhatsNewOverflowUserTooltip({player}) {
	return (
		<div className={NowPlayingClasses.soloAvatarTooltip}>
			<div className={MainClasses.emptyText}>{player.user.globalName || player.user.username}</div>
			<div className={NowPlayingClasses.soloAvatarTooltipTimestamp}>{
				player.endedAt ? <InactiveTimeClock timestamp={ player?.endedAt } />
                : Common.intl.intl.formatToPlainString(Common.intl.t['3elwAB'])	
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
				<div className={NowPlayingClasses.sectionTitle}>{`+${players.length} more recent players`}</div>
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
	return (
		<div className={NowPlayingClasses.lastPlayedPlayer}>
            <AvatarWithPopoutWrapper className={NowPlayingClasses.lastPlayedAvatar} user={user} status={status} size="SIZE_40" />
            <FlexInfo className={`${NowPlayingClasses.details} ${NowPlayingClasses.lastPlayedDetails}`} type="LAST_PLAYED" activity={player} streamUser={user} />
        </div>
	)
}