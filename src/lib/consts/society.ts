interface SocietyOption {
    value: number;
    label: string;
}

export const POST_PERMISSIONS: SocietyOption[] = [
    {
        value: 1,
        label: "Модераторы • комментарии выкл."
    },
    {
        value: 2,
        label: "Все • комментарии выкл."
    },
    {
        value: 3,
        label: "Модераторы • комментарии вкл."
    },
    {
        value: 4,
        label: "Все • комментарии вкл."
    }
];

export const SOCIETY_FORMATS: SocietyOption[] = [
    {
        value: 1,
        label: "Открытое"
    },
    {
        value: 2,
        label: "Закрытое"
    },
    {
        value: 3,
        label: "Платное"
    }
]; 