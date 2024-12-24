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
