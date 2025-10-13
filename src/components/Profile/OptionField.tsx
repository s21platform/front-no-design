import React, { useEffect, useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
import { AttributeItem, OptionItem, OptionsResponse } from './types';
import { ApiRoutes } from '../../lib/routes';
import api from '../../lib/api/api';

interface OptionFieldProps {
    attribute: AttributeItem;
    value: any;
    onChange: (attributeId: number, value: any) => void;
}

const OptionField: React.FC<OptionFieldProps> = ({ 
    attribute, 
    value, 
    onChange 
}) => {
    const [options, setOptions] = useState<OptionItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await api.get(ApiRoutes.optionHubOptions(attribute.attribute_id), {
                    withCredentials: true,
                });
                
                const optionsData: OptionsResponse = response.data;
                setOptions(optionsData.data);
            } catch (err: any) {
                console.error('Ошибка загрузки опций:', err);
                setError('Не удалось загрузить опции');
            } finally {
                setLoading(false);
            }
        };

        loadOptions();
    }, [attribute.attribute_id]);

    const handleChange = (event: any) => {
        const selectedOptionId = event.target.value;
        onChange(attribute.attribute_id, selectedOptionId);
    };

    const getCurrentValue = () => {
        // Если value содержит ID опции, возвращаем его
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
        return '';
    };

    if (loading) {
        return (
            <FormControl fullWidth sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                        Загрузка опций...
                    </Typography>
                </Box>
            </FormControl>
        );
    }

    if (error) {
        return (
            <FormControl fullWidth sx={{ mb: 2 }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                </Box>
            </FormControl>
        );
    }

    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id={`option-label-${attribute.attribute_id}`}>
                {attribute.title}
            </InputLabel>
            <Select
                labelId={`option-label-${attribute.attribute_id}`}
                value={getCurrentValue()}
                onChange={handleChange}
                label={attribute.title}
                variant="outlined"
                margin="dense"
            >
                <MenuItem value="">
                    <em>Не выбрано</em>
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.option_id} value={option.option_id}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default OptionField;
