import { Data } from 'betterdiscord';
import { useEffect } from 'react';
import { Common } from '@modules/common';
import { ApplicationViewStore, GameStore, RunningGameStore, useStateFromStores } from '@modules/stores';
import SectionHeader from '@activity_feed/common/components/SectionHeader';
import { ApplicationDock } from '@quick_launcher/ApplicationDock';
import locale from "@activity_feed/common/methods/locale";
import settings from "@settings/settings";
import MainClasses from "@activity_feed/ActivityFeed.module.css";
import QuickLauncherClasses from "@quick_launcher/QuickLauncher.module.css";

export function QuickLauncher(props) {
	const seenGames = useStateFromStores([ RunningGameStore ], () => RunningGameStore.getGamesSeen());
	const validGames = seenGames.filter(game => GameStore.getDetectableGame([...GameStore.searchGamesByName(game.name)].reverse()[0]));
	const storedGames = validGames.flatMap(item => {
		const game = GameStore.getDetectableGame(GameStore.searchGamesByName(item.name)[0]);
		return item.name && game ? game : [];
	}).slice(0, 112);

	useEffect(() => {
		(async () => {
			const gameIds = storedGames.map(game => game.id);
			await Common.FetchApplications.fetchApplications(gameIds); 
		})()
	}, [storedGames]);

	const applicationItems = useStateFromStores([ ApplicationViewStore ], () => ApplicationViewStore.applicationViewItems).sort((a, b) => b.lastPlayed - a.lastPlayed).flatMap(item => {
        if (item.isLaunchable) {
            const application = item.application;
            const isLaunching = item.isLaunching;
            const isRunning = item.isRunning;
            return ({
                application,
                id: application.id,
                name: application.name,
                libraryApplication: new Common.BasicLibraryApplication({application}),
                iconSrc: application.getIconURL(60),
                disabled: isLaunching || isRunning
            })
        } else { 
            return [];
        }
	}).slice(0, 14) || [];

	const isEmpty = applicationItems.length === 0 || (Data.load('freezeDock') ?? settings.default.freezeDock);
	return (
		<div className={QuickLauncherClasses.quickLauncher}>
			<SectionHeader label={locale.Strings.QUICK_LAUNCHER()} />
			{isEmpty ? <Common.Flex align={Common.Flex.Align.CENTER} className={MainClasses.emptyState} direction={Common.Flex.Direction.HORIZONTAL}>
				<svg className={QuickLauncherClasses.emptyIcon} name="OpenExternal" width={16} height={16} viewBox="0 0 24 24">
					<path fill="currentColor" transform="translate(3, 4)" d="M16 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H2V4h14v10h-4v2h4c1.1 0 2-.9 2-2V2a2 2 0 0 0-2-2zM9 6l-4 4h3v6h2v-6h3L9 6z" />
				</svg>
				<div className={MainClasses.emptyText}>{locale.Strings.QUICK_LAUNCHER_EMPTY()}</div>
			</Common.Flex> : <ApplicationDock applications={applicationItems} />}
		</div>
	)
}