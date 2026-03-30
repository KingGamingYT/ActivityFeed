import { ContextMenu } from "betterdiscord";
import { useState, useRef } from "react";
import { Common } from "@modules/common";
import { UserStore } from "@modules/stores"

interface AvatarWithPopoutWrapper {
	className: string,
	user: Object,
	status?: string,
	size: string;
}

export default function ({className, user, status, size}: AvatarWithPopoutWrapper) {
	const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);

	return (
		<Common.Popout
    		targetElementRef={refDOM}
    		clickTrap={true}
    		onRequestClose={() => setShowPopout(false)}
    		renderPopout={() => <Common.UserProfileWrapperComponent currentUser={UserStore.getCurrentUser()} user={user} />}
    		position="left"
    		shouldShow={showPopout}>
    		{(props) => <div
    			{...props}
    			ref={refDOM}
    			onClick={() => { setShowPopout(true); console.log(user) } }
    			className={className}>
    			<Common.AvatarFetch imageClassName={className} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`} status={status} size={size} />
    		</div>}
    	</Common.Popout>
	)
}
