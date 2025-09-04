import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Stack
} from '@mui/material';
import { ProfileItem } from './types';

interface ProfileItemRendererProps {
    item: ProfileItem;
}

const ProfileItemRenderer: React.FC<ProfileItemRendererProps> = ({ item }) => {
    console.log("item", item)
    const renderValue = () => {
        switch (item.type) {
            case 'STRING':
            case 'NUMBER':
            case 'DATE':
                return (
                    <Typography variant="body1">
                        <strong>{item.title}:</strong> {item.value || 'Не указано'}
                    </Typography>
                );

            case 'ENUM':
            case 'multi_select':
                if (!item.enum_values || item.enum_values.length === 0) {
                    return (
                        <Typography variant="body1">
                            <strong>{item.title}:</strong> Не указано
                        </Typography>
                    );
                }
                return (
                    <Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>{item.title}:</strong>
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {item.enum_values.map((value, index) => (
                                <Chip
                                    key={index}
                                    label={value}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                );

            case 'BOOL':
                return (
                    <Typography variant="body1">
                        <strong>{item.title}:</strong> {item.value === 'true' ? 'Да' : 'Нет'}
                    </Typography>
                );

            default:
                return (
                    <Typography variant="body1">
                        <strong>{item.title}:</strong> {item.value || 'Не указано'}
                    </Typography>
                );
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            {renderValue()}
        </Box>
    );
};

export default ProfileItemRenderer;


