import { 
    Avatar, 
    Box, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    useTheme, 
    Grid 
} from "@mui/material";
import { Link } from "react-router-dom";
import { PeerData } from "../PeerSearch/PeerSearch";
import PeerSubscriptionButton from "../PeerSubscriptionButton/PeerSubscriptionButton";
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

type PeerCardProps = PeerData;

export const PeerCard = ({ uuid, nickname, name, surname, avatar_link, is_friend }: PeerCardProps) => {
    const theme = useTheme();
    
    return (
        <Card 
            elevation={1} 
            sx={{ 
                p: 2, 
                display: 'flex',
                borderRadius: 2,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                }
            }}
        >
            <CardContent sx={{ display: 'flex', width: '100%', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Link to={`/peer/${uuid}`} style={{ textDecoration: 'none' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar 
                                    src={avatar_link} 
                                    sx={{ 
                                        width: 70, 
                                        height: 70,
                                        mb: 1,
                                        border: `2px solid ${theme.palette.primary.main}`,
                                    }} 
                                />
                                <Typography variant="subtitle1" color="text.primary" align="center" sx={{ fontWeight: 'bold' }}>
                                    {nickname}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    {name} {surname}
                                </Typography>
                            </Box>
                        </Link>
                    </Grid>
                    
                    <Grid item xs container direction="column" justifyContent="flex-end" spacing={1} sx={{ ml: 'auto' }}>
                        <Grid item>
                            <Button 
                                fullWidth
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => window.alert("В разработке!")}
                                disabled
                                startIcon={<MessageIcon />}
                                sx={{ mb: 1 }}
                            >
                                Написать
                            </Button>
                        </Grid>
                        <Grid item>
                            <PeerSubscriptionButton isActive={is_friend} peerId={uuid} />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PeerCard;
