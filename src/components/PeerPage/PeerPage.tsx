import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProfileProps } from "../Profile/types";
import ProfileSkeleton from "../Skeletons/ProfileSkeleton/ProfileSkeleton";
import AvatarPeerBlock from "../Avatar/AvatarPeerBlock";
import PeerSubscriptionButton from "../PeerSubscriptionButton/PeerSubscriptionButton";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Divider,
    Link as MuiLink,
    useTheme
} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import api from "../../lib/api/api";

export const PeerPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const theme = useTheme();
    const pathParams = useParams();

    const [profileData, setProfileData] = useState<ProfileProps>({
        avatar: "",
    })
    const [loading, setLoading] = useState<boolean>(true);

    const [loadingSubscription, setLoadingSubscription] = useState<boolean>(true);
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

    useEffect(() => {
        api.get(ApiRoutes.peer(pathParams.uuid), {
            withCredentials: true,
        }).then(data => {
            setProfileData(data.data)
            setLoading(false);
        }).catch(err => {
            if (err.status === 401) {
                setAuth(false);
                navigate(AppRoutes.profile());
            }
            console.warn(err)
        })

        api.get(ApiRoutes.checkFriendship(), {
            params: {
                peer: pathParams.uuid,
            },
            withCredentials: true,
        }).then(data => {
            setIsSubscribed(data.data.exist)
            console.log("api friends check", data.data)
        }).finally(() => {
            setLoadingSubscription(false)
        })
    }, []);

    return (
        <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
                {loading ? (
                    <ProfileSkeleton />
                ) : (
                    <Box sx={{ mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm="auto">
                                <AvatarPeerBlock initialAvatarUrl={profileData.avatar} />
                            </Grid>
                            <Grid item xs={12} sm>
                                <Box>
                                    {profileData.nickname && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Ник:</strong> {profileData.nickname}
                                            </Typography>
                                        </Box>
                                    )}

                                    {profileData.name && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Имя:</strong> {profileData.name}
                                            </Typography>
                                        </Box>
                                    )}

                                    {profileData.birthdate && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1">
                                                <strong>Дата рождения:</strong> {profileData.birthdate}
                                            </Typography>
                                        </Box>
                                    )}

                                    {profileData.telegram && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <TelegramIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Telegram:</strong>{' '}
                                                <MuiLink
                                                    href={`https://t.me/${profileData.telegram?.substring(1)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    color="secondary"
                                                >
                                                    {profileData.telegram}
                                                </MuiLink>
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 2 }}>
                                        {!loadingSubscription && pathParams.uuid && (
                                            <PeerSubscriptionButton
                                                isActive={isSubscribed}
                                                peerId={pathParams.uuid}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {loading ? (
                    <ProfileSkeleton />
                ) : (
                    <Box sx={{ mb: 4 }}>
                        {Object.keys(profileData).length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Дополнительная информация
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    {profileData.git && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>GitHub:</strong>{' '}
                                                <MuiLink
                                                    href={`https://github.com/${profileData.git}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    color="secondary"
                                                >
                                                    {profileData.git}
                                                </MuiLink>
                                            </Typography>
                                        </Box>
                                    )}

                                    {profileData.os && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <ComputerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Операционная система:</strong> {profileData.os.label ?? "Отсутсвует"}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default PeerPage;
