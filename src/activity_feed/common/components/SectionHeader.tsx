import { Common } from "@modules/common";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

interface SectionHeader {
	label: string;
}

export default ({ label }: SectionHeader) => {
	return (
		<div className={`${MainClasses.headerContainer} ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`} style={{ flex: "1 1 auto"}}>
	        <div className={MainClasses.headerText}>{label}</div>
	    </div>
	)
}