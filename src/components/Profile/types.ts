export type ProfileProps = {
    avatar: string;
    nickname?: string;
    name?: string;
    university?: string;
    work?: string;
    birthdate?: string;
    telegram?: string;
    git?: string;
    os?: {
        id: number;
        label: string;
    } | null;
}

export type SubscriptionCount = {
    followersCount: number,
    followingCount: number,
}

// Новые типы для динамического профиля
export type ProfileItem = {
    title: string;
    type: string;
    value?: string;
    enum_values?: string[];
}

export type MyPersonality = {
    data: ProfileItem[];
}

export type ProfileBlock = {
    title: string;
    items: ProfileItem[];
}

// Типы для API атрибутов пользователя
export type AttributeItem = {
    title: string;
    attribute_id: number;
    type: string;
    value_string?: string;
    value_int?: number;
    value_date?: string;
}

export type UserAttributesResponse = {
    data: AttributeItem[];
}

// Константа с ID атрибутов для формы редактирования
export const PROFILE_ATTRIBUTE_IDS = [2, 3, 4, 5, 6];
