import React, { useState, useEffect, useCallback, useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";

export interface SelectorOption {
  id: number;
  label: string;
}

interface SelectorWithSearchProps {
  url: string;
  value?: SelectorOption | null;
  onChange: (selectedOption: SelectorOption | null) => void;
}

export const SelectorWithSearch: React.FC<SelectorWithSearchProps> = ({
  url,
  value = null,
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [defaultOptions, setDefaultOptions] = useState<SelectorOption[]>([]);
  const [options, setOptions] = useState<SelectorOption[]>([]);
  const [loading, setLoading] = useState(false);

  const initialLoadComplete = useRef(false); // нужно для проверки, если установлено значение по умолчанию
  const currentRequestId = useRef(0); // уникальный идентификатор запроса

  const fetchData = useCallback(
    async (query = "") => {
      const requestId = ++currentRequestId.current; // уникальный id запроса
      try {
        setLoading(true);
        const response = await fetch(
          query.length >= 3 ? `${url}?name=${query}` : url
        );
        const data = await response.json();

        // обработка только актуальных запросов
        if (currentRequestId.current === requestId) {
          setOptions(data.options);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        if (currentRequestId.current === requestId) {
          setLoading(false);
        }
      }
    },
    [url]
  );

  useEffect(() => {
    const loadDefaultOptions = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDefaultOptions(data.options);
        setOptions(data.options);
        initialLoadComplete.current = true;
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    // Загрузка дефолтных опций при первом рендере
    if (!initialLoadComplete.current) {
      loadDefaultOptions();
    }
  }, [url]);

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: SelectorOption | null) => {
      setCurrentValue(newValue);
      onChange(newValue);

      // если пусто - показываем  дефолтный набор опций
      if (!newValue) {
        setOptions(defaultOptions);
      }
    },
    [onChange, defaultOptions]
  );

  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string) => {
    if (!initialLoadComplete.current) return;

    // если строка пустая, показываем дефолтные опции и отменяем активные запросы
    if (newInputValue.trim() === "") {
      setOptions(defaultOptions);
      currentRequestId.current++; // отмена активных запросов
      return;
    }

    // запрос только в случае ввода больше 3 символов
    if (newInputValue.length >= 3) {
      fetchData(newInputValue);
    } else {
      setOptions(defaultOptions);
    }
  };

  return (
    <Autocomplete
      value={currentValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      filterOptions={(options) => options || []}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      loading={loading}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Выберите значение"
        />
      )}
    />
  );
};
