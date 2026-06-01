import { Common } from "@modules/common";
import MainClasses from "@activity_feed/ActivityFeed.module.css";

interface SectionHeader {
	label: string;
}

export default ({ label }: SectionHeader) => {
	return (
		<Common.Flex align={Common.Flex.Align.CENTER} className={MainClasses.headerContainer} justify={Common.Flex.Justify.BETWEEN}>
			<div className={MainClasses.headerText}>{label}</div>
		</Common.Flex>
	)
}