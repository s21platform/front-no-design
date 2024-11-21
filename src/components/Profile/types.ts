export type ProfileProps = {
    avatar: string;
    fullName?: string;
    birthDate?: string;
    telegram?: string;
    gitLink?: string;
    os?: {
        id: number;
        name: string;
    };
}

export type SubscriptionCount = {
    followersCount: number,
    followingCount: number,
}