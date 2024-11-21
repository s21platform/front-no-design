import {useEffect, useState} from "react";
import {FilterParams} from "./types";
import './style.css'

type FiltersProps = {
    type?: string;
    onFilterChange: (filters: Partial<FilterParams>) => void;
};

const Filters: React.FC<FiltersProps> = ({ type, onFilterChange }) => {
    const [name, setName] = useState('');
    const [direction, setDirection] = useState('');
    const [hobbies, setHobbies] = useState<string[]>([]);

    useEffect(() => {
        // Отправляем изменения фильтров при вводе данных
        onFilterChange({ name, direction, hobbies });
    }, [name, direction, hobbies]);

    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {type === 'society' && (
                <input
                    type="text"
                    placeholder="Direction"
                    className="input-field"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                />
            )}
            {type === 'user' && (
                <input
                    type="text"
                    placeholder="Hobbies (comma separated)"
                    className="input-field"
                    value={hobbies.join(',')}
                    onChange={(e) => setHobbies(e.target.value.split(','))}
                />
            )}
        </div>
    );
};

export default Filters;