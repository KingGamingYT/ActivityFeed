import { ContextMenu } from "betterdiscord";
import { useState, useRef } from "react";
import { Common } from "@modules/common";
import { UserStore, useStateFromStores } from "@modules/stores"

interface AvatarWithPopoutWrapper {
	className: string,
	user: Object,
	status?: string,
	size: string;
}

export default function ({className, user, status, size}: AvatarWithPopoutWrapper) {
	const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);
	const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());

	return (
		<Common.Popout
    		targetElementRef={refDOM}
    		clickTrap={true}
    		onRequestClose={() => setShowPopout(false)}
    		renderPopout={() => <Common.UserProfileWrapperComponent currentUser={currentUser} user={user} />}
    		position="right"
    		shouldShow={showPopout}>
    		{(props) => <div
    			{...props}
    			ref={refDOM}
    			onClick={() => { setShowPopout(true) } }
    			className={className}>
    			<Common.AvatarFetch imageClassName={className} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`} status={status} size={size} />
    		</div>}
    	</Common.Popout>
	)
}
