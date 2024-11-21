export type FilterParams = {
    name?: string;
    direction?: string;
    hobbies?: string[];
    type?: string[]; // Для поиска по нескольким типам
};

export type ResultsListProps = {
    results: any[];
};