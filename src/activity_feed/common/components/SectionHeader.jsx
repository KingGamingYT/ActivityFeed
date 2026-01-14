import { Common } from "@./modules/common";

export function SectionHeader({ label }) {
	return (
		<div className={`_2cbe2fbfe32e4150-headerContainer ${Common.PositionClasses.flex} ${Common.PositionClasses.noWrap} ${Common.PositionClasses.justifyBetween} ${Common.PositionClasses.alignCenter}`} style={{ flex: "1 1 auto"}}>
	        <div className="_2cbe2fbfe32e4150-headerText">{label}</div>
	    </div>
	)
}