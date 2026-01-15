import { Common } from "@./modules/common";
import styleModule from "@./activity_feed/ActivityFeed.module.css";

export function SectionHeader({ label }) {
	return (
		<div className={`${styleModule.headerContainer} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`} style={{ flex: "1 1 auto"}}>
	        <div className={styleModule.headerText}>{label}</div>
	    </div>
	)
}