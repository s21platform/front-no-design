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
