import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { ProfileBlock } from './types';
import ProfileItemRenderer from './ProfileItemRenderer';

interface ProfileBlockRendererProps {
    block: ProfileBlock;
    elevation?: number;
}

const ProfileBlockRenderer: React.FC<ProfileBlockRendererProps> = ({
    block,
    elevation = 1
}) => {
    console.log("block", block)
    if (!block.items || block.items.length === 0) {
        return null;
    }

    return (
        <Card elevation={elevation} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                        color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
                        fontWeight: 600,
                        opacity: (theme) => theme.palette.mode === 'dark' ? 0.9 : 1
                    }}
                >
                    {block.title}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box>
                    {block.items.map((item, index) => (
                        <ProfileItemRenderer
                            key={`${item.title}-${index}`}
                            item={item}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProfileBlockRenderer;

