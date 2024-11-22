export type ProfileProps = {
    avatar: string;
    name?: string;
    birthdate?: string;
    telegram?: string;
    git?: string;
    os?: {
        id: number;
        name: string;
    };
}

export type SubscriptionCount = {
    followersCount: number,
    followingCount: number,
}