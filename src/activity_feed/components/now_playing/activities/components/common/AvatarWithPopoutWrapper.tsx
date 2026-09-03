import { useState, useRef } from "react";
import { Common, AvatarUtils } from "@modules/common";
import { UserProfileStore, UserStore, useStateFromStores } from "@modules/stores"

interface AvatarWithPopoutWrapper {
	className: string,
	user: any,
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
    			onClick={async () => {	
					if (!UserProfileStore.getUserProfile(user.id)) {
						await Common.FetchUserProfile(user.id, { withMutualGuilds: true, withMutualFriends: true });
					} 
					setShowPopout(true); 
				}}
    			className={className}>
    			<Common.AvatarFetch imageClassName={className} src={AvatarUtils.getUserAvatarURL({id: user.id, avatar: user.avatar})} status={status} size={size} />
    		</div>}
    	</Common.Popout>
	)
}
