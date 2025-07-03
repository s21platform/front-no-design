import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { ApiRoutes } from "../../lib/routes";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import api from "../../lib/api/api";

interface PeerSubscriptionButtonProps {
	isActive: boolean;
	peerId: string;
}

const PeerSubscriptionButton = ({ isActive, peerId }: PeerSubscriptionButtonProps) => {
	const [loadingSubscription, setLoadingSubscription] = useState<boolean>(false);
	const [isSubscribed, setIsSubscribed] = useState<boolean>(isActive);

	const subscribe = () => {
		setLoadingSubscription(true)
		api.post(ApiRoutes.friends(), {
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
		api.delete(ApiRoutes.friends(), {
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
	const buttonColor = isSubscribed ? "error" : "secondary";
	const buttonIcon = isSubscribed ? <PersonRemoveIcon /> : <PersonAddIcon />;
	const handleClick = isSubscribed ? unsubscribe : subscribe;

	return (
		<Button
			fullWidth
			size="small"
			variant={buttonVariant}
			color={buttonColor}
			onClick={handleClick}
			disabled={loadingSubscription}
			startIcon={loadingSubscription ? <CircularProgress size={16} color="inherit" /> : buttonIcon}
			sx={{
				borderRadius: 1.5,
				textTransform: 'none',
				fontSize: '0.85rem',
				padding: '6px 16px',
				minHeight: '36px',
			}}
		>
			{buttonText}
		</Button>
	)
}

export default PeerSubscriptionButton;
