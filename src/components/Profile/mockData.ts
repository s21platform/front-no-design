import { ProfileBlock } from './types';

export const mockContactsBlock: ProfileBlock = {
    title: 'Контакты (HARDCODE)',
    items: [
        {
            title: 'Email',
            type: 'text',
            value: 'user@example.com'
        },
        {
            title: 'Telegram',
            type: 'text',
            value: '@username'
        },
        {
            title: 'GitHub',
            type: 'text',
            value: 'github_username'
        },
        {
            title: 'LinkedIn',
            type: 'text',
            value: 'linkedin_profile'
        }
    ]
};

export const mockAboutBlock: ProfileBlock = {
    title: 'О себе  (HARDCODE)',
    items: [
        {
            title: 'Университет',
            type: 'text',
            value: 'МГУ им. М.В. Ломоносова'
        },
        {
            title: 'Работа',
            type: 'text',
            value: 'Senior Developer'
        },
        {
            title: 'Операционная система',
            type: 'text',
            value: 'macOS'
        },
        {
            title: 'Дата рождения',
            type: 'date',
            value: '15.03.1990'
        },
        {
            title: 'Языки программирования',
            type: 'enum',
            enum_values: ['JavaScript', 'TypeScript', 'Python', 'Go']
        },
        {
            title: 'Навыки',
            type: 'enum',
            enum_values: ['React', 'Node.js', 'Docker', 'Kubernetes', 'PostgreSQL']
        }
    ]
};

