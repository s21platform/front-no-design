import axios from "axios";
import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { ApiRoutes } from "../../lib";

interface PeerSubscriptionButtonProps {
	isActive: boolean;
	peerId: string;
}

const PeerSubscriptionButton = ({ isActive, peerId }: PeerSubscriptionButtonProps) => {

	const [loadingSubscription, setLoadingSubscription] = useState<boolean>(false);
	const [isSubscribed, setIsSubscribed] = useState<boolean>(isActive);

	const subscribe = () => {
		setLoadingSubscription(true)
		axios.post(ApiRoutes.friends(), {
			peer: peerId,
		}, {
			withCredentials: true
		})
			.then(data => {
				if (data.data.success) {
					setIsSubscribed(true)
				}
			})
			.finally(() => {
				setLoadingSubscription(false)
			})
	}

	const unsubscribe = () => {
		setLoadingSubscription(true)
		axios.delete(ApiRoutes.friends(), {
			params: {
				peer: peerId,
			},
			withCredentials: true
		})
			.then(data => {
				if (data.data.success) {
					setIsSubscribed(false)
				}
			})
			.finally(() => {
				setLoadingSubscription(false)
			})
	}

	const buttonText = isSubscribed ? "Отписаться" : "Подписаться";
	const buttonVariant = isSubscribed ? "outlined" : "contained";
	const handleClick = isSubscribed ? unsubscribe : subscribe;

	return (
		<Button
			style={{ minWidth: '140px', minHeight: '32px' }}
			size="small"
			variant={buttonVariant}
			onClick={handleClick}
			disabled={loadingSubscription}
			endIcon={
				loadingSubscription && <CircularProgress size={15} color="inherit" />
			}
		>
			{buttonText}
		</Button>
	)
}

export default PeerSubscriptionButton;
