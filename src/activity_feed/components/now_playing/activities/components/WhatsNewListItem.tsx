import { Common } from "@modules/common";
import { FlexInfo } from "@now_playing/activities/components/common/FlexInfo";
import NowPlayingClasses from "@now_playing/NowPlaying.module.css";

export function WhatsNewListItemBuilder({player}) {
	const user = player.user;
	const status = player.status;
	return (
		<div className={NowPlayingClasses.lastPlayedPlayer}>
            <Common.AvatarFetch imageClassName="lastPlayedAvatar" src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.webp?size=48`} status={status} size="SIZE_40" />
            <FlexInfo className={`${NowPlayingClasses.details} ${NowPlayingClasses.lastPlayedDetails}`} type="LAST_PLAYED" activity={player} streamUser={user} />
        </div>
	)
}