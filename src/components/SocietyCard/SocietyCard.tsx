import { 
    Box, 
    Button, 
    Card, 
    CardContent, 
    Grid, 
    Typography, 
    useTheme 
} from "@mui/material";
import { Link } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';

interface SocietyCardProps {
    uuid: string;
    name: string;
    description: string;
    is_private: boolean;
}

export const SocietyCard = ({ uuid, name, description, is_private }: SocietyCardProps) => {
    const theme = useTheme();
    
    return (
        <Card 
            elevation={1}
            sx={{ 
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
            <CardContent sx={{ display: 'flex', width: '100%', p: 2, '&:last-child': { pb: 2 } }}>
                <Grid container>
                    <Grid item xs={12} sm={8}>
                        <Link to={`/society/${uuid}`} style={{ textDecoration: 'none' }}>
                            <Box>
                                <Typography 
                                    variant="h6" 
                                    color="text.primary" 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1, 
                                        fontWeight: '600',
                                        mb: 1
                                    }}
                                >
                                    {name}
                                    {is_private && <LockIcon fontSize="small" color="action" />}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ 
                                        mb: 2,
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2
                                    }}
                                >
                                    {description}
                                </Typography>
                            </Box>
                        </Link>
                    </Grid>
                    
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, mt: { xs: 2, sm: 0 } }}>
                        <Button 
                            variant="contained" 
                            color="secondary"
                            startIcon={<GroupIcon />}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                textTransform: 'none',
                                minWidth: '140px'
                            }}
                        >
                            Присоединиться
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}; 