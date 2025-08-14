export interface Material {
  id: string;
  title: string;
  description: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  readingTime: number; // в минутах
}

// Моковые данные для материалов
export const mockMaterials: Material[] = [
  {
    id: "1",
    title: "Введение в TypeScript: основы типизации",
    description: "Базовые концепции TypeScript и как начать использовать типизацию в своих проектах",
    content: `TypeScript становится всё более популярным в мире веб-разработки. В этой статье мы рассмотрим основные концепции TypeScript и как они помогают писать более надёжный код.

Что такое TypeScript?
TypeScript - это язык программирования, разработанный Microsoft, который добавляет статическую типизацию к JavaScript. Он является надмножеством JavaScript, что означает, что любой валидный JavaScript код также является валидным TypeScript кодом.

Основные преимущества:
1. Статическая типизация
2. Улучшенная поддержка IDE
3. Ранее обнаружение ошибок
4. Лучшая документация кода

[Продолжение следует...]`,
    author: {
      id: "auth1",
      name: "Александр Петров",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    createdAt: "2024-03-14T10:00:00Z",
    updatedAt: "2024-03-14T10:00:00Z",
    readingTime: 5
  },
  {
    id: "2",
    title: "React Hooks: лучшие практики и типичные ошибки",
    description: "Разбор популярных хуков React и как избежать распространенных ошибок при их использовании",
    content: `React Hooks изменили то, как мы пишем компоненты React. В этой статье мы рассмотрим лучшие практики использования хуков и разберем типичные ошибки.

useState и useEffect
Это два самых базовых и часто используемых хука. Давайте разберем их особенности и типичные ошибки:

1. useState:
- Не используйте useState для производных данных
- Используйте функциональное обновление для зависимых состояний

2. useEffect:
- Не забывайте про массив зависимостей
- Избегайте бесконечных циклов

[Продолжение следует...]`,
    author: {
      id: "auth2",
      name: "Мария Иванова",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    createdAt: "2024-03-13T15:30:00Z",
    updatedAt: "2024-03-13T16:45:00Z",
    readingTime: 7
  },
  {
    id: "3",
    title: "Docker для фронтенд-разработчиков",
    description: "Практическое руководство по использованию Docker в фронтенд-разработке",
    content: `Docker стал неотъемлемой частью современной разработки. Давайте разберемся, как использовать его в фронтенд-проектах.

Зачем Docker фронтенду?
1. Одинаковое окружение для всей команды
2. Простой запуск нескольких версий приложения
3. Изоляция зависимостей

Базовый Dockerfile для React-приложения:
\`\`\`dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
\`\`\`

[Продолжение следует...]`,
    author: {
      id: "auth3",
      name: "Дмитрий Сидоров",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    createdAt: "2024-03-12T09:15:00Z",
    updatedAt: "2024-03-12T11:20:00Z",
    readingTime: 6
  },
  {
    id: "4",
    title: "CSS Grid: продвинутые техники",
    description: "Глубокое погружение в возможности CSS Grid для создания сложных layouts",
    content: `CSS Grid революционизировал то, как мы создаем layouts в web. Давайте рассмотрим продвинутые техники и паттерны.

Области и именованные линии
Grid Areas позволяют создавать сложные макеты с помощью понятных имен:

.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

Автоматическое размещение
Grid умеет автоматически размещать элементы по заданным правилам...

[Продолжение следует...]`,
    author: {
      id: "auth4",
      name: "Елена Козлова",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    createdAt: "2024-03-11T14:20:00Z",
    updatedAt: "2024-03-11T14:20:00Z",
    readingTime: 8
  },
  {
    id: "5",
    title: "Оптимизация производительности React-приложений",
    description: "Практические советы по улучшению производительности React-приложений",
    content: `Производительность - критически важный аспект пользовательского опыта. Рассмотрим основные техники оптимизации React-приложений.

1. Мемоизация
React.memo, useMemo и useCallback - мощные инструменты для оптимизации:

const MemoizedComponent = React.memo(({ data }) => {
  // Компонент перерендерится только при изменении data
});

2. Виртуализация списков
Для больших списков используйте виртуализацию...

[Продолжение следует...]`,
    author: {
      id: "auth5",
      name: "Игорь Волков",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    createdAt: "2024-03-10T16:45:00Z",
    updatedAt: "2024-03-10T18:30:00Z",
    readingTime: 10
  },
  {
    id: "6",
    title: "WebAssembly и будущее веб-разработки",
    description: "Обзор возможностей WebAssembly и его влияния на современную веб-разработку",
    content: `WebAssembly (Wasm) открывает новые горизонты для веб-приложений. Давайте разберемся, что это такое и какие возможности он предоставляет.

Что такое WebAssembly?
WebAssembly - это бинарный формат инструкций для стековой виртуальной машины. Он был разработан как низкоуровневый язык для веб-платформы.

Преимущества использования:
1. Высокая производительность
2. Поддержка языков программирования высокого уровня
3. Безопасность выполнения

[Продолжение следует...]`,
    author: {
      id: "auth6",
      name: "Анна Соколова",
      avatar: "https://i.pravatar.cc/150?img=6"
    },
    createdAt: "2024-03-09T11:30:00Z",
    updatedAt: "2024-03-09T13:15:00Z",
    readingTime: 12
  }
];

// Место для будущего API
/*
export const getMaterials = async (page: number, limit: number, sort: string) => {
  const response = await fetch(`/api/materials?page=${page}&limit=${limit}&sort=${sort}`);
  return response.json();
};

export const getMaterialById = async (id: string) => {
  const response = await fetch(`/api/materials/${id}`);
  return response.json();
};

export const createMaterial = async (material: Omit<Material, 'id' | 'author' | 'createdAt' | 'updatedAt'>) => {
  const response = await fetch('/api/materials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(material),
  });
  return response.json();
};
*/
