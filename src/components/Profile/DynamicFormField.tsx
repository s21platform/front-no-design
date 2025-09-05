import React from 'react';
import {
    TextField,
    FormControl,
    InputAdornment,
    FormControlLabel,
    Switch,
    Select,
    MenuItem,
    InputLabel,
    Box,
    Chip,
    Stack
} from '@mui/material';
import { AttributeItem } from './types';

interface DynamicFormFieldProps {
    attribute: AttributeItem;
    value: any;
    onChange: (attributeId: number, value: any) => void;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({ 
    attribute, 
    value, 
    onChange 
}) => {
    const handleChange = (event: any) => {
        let newValue = event.target.value;
        
        // Преобразуем значение в зависимости от типа
        switch (attribute.type) {
            case 'INTEGER':
                newValue = parseInt(newValue) || 0;
                break;
            case 'DATE':
                // Значение уже в правильном формате для input[type="date"]
                break;
            case 'BOOLEAN':
                newValue = event.target.checked;
                break;
            default:
                // STRING и другие типы остаются как есть
                break;
        }
        
        onChange(attribute.attribute_id, newValue);
    };

    const getCurrentValue = () => {
        switch (attribute.type) {
            case 'INTEGER':
                return attribute.value_int || '';
            case 'DATE':
                return attribute.value_date || '';
            case 'BOOLEAN':
                return attribute.value_string === 'true';
            default:
                return attribute.value_string || '';
        }
    };

    const renderField = () => {
        const currentValue = value !== undefined ? value : getCurrentValue();

        switch (attribute.type) {
            case 'STRING':
                return (
                    <TextField
                        fullWidth
                        label={attribute.title}
                        value={currentValue}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                    />
                );

            case 'INTEGER':
                return (
                    <TextField
                        fullWidth
                        type="number"
                        label={attribute.title}
                        value={currentValue}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                    />
                );

            case 'DATE':
                return (
                    <TextField
                        fullWidth
                        type="date"
                        label={attribute.title}
                        value={currentValue}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                );

            case 'BOOLEAN':
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={currentValue}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label={attribute.title}
                        sx={{ ml: 0 }}
                    />
                );

            default:
                return (
                    <TextField
                        fullWidth
                        label={attribute.title}
                        value={currentValue}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                    />
                );
        }
    };

    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            {renderField()}
        </FormControl>
    );
};

export default DynamicFormField;
