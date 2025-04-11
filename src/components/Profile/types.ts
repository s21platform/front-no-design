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
    rocketChatIntegration?: {
        username: string;
        password: string;
        isConnected: boolean;
    };
    telegramIntegration?: {
        token: string;
        isConnected: boolean;
    };
}

export type SubscriptionCount = {
    followersCount: number,
    followingCount: number,
}

export type ChatIntegrationType = 'rocket' | 'telegram';
