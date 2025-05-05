import { useState } from 'react';
import { Typography, Container, Box, Card, CardContent, CardActionArea, Grid, Chip, Avatar, Divider, Button, TextField, InputAdornment, CardMedia } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../lib/routes';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../lib/routes';

// Моковые данные для материалов
const mockMaterials = [
  {
    id: 1,
    title: 'Введение в React',
    description: 'Базовые концепции React и как начать с ним работать',
    author: 'Иван Петров',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    date: '2023-05-15',
    tags: ['React', 'JavaScript', 'Frontend'],
    image: 'https://picsum.photos/seed/react/800/400'
  },
  {
    id: 2,
    title: 'Продвинутое использование TypeScript',
    description: 'Углубленное изучение TypeScript для веб-разработчиков',
    author: 'Мария Сидорова',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    date: '2023-05-10',
    tags: ['TypeScript', 'JavaScript'],
    image: 'https://picsum.photos/seed/typescript/800/400'
  },
  {
    id: 3,
    title: 'Оптимизация производительности React-приложений',
    description: 'Способы улучшить скорость и отзывчивость ваших React-приложений',
    author: 'Алексей Смирнов',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    date: '2023-05-05',
    tags: ['React', 'Performance', 'Optimization'],
    image: 'https://picsum.photos/seed/performance/800/400'
  },
  {
    id: 4,
    title: 'GraphQL и Apollo: базовый обзор',
    description: 'Начало работы с GraphQL и Apollo Client в современных приложениях',
    author: 'Елена Кузнецова',
    authorAvatar: 'https://i.pravatar.cc/150?img=4',
    date: '2023-04-28',
    tags: ['GraphQL', 'Apollo', 'API'],
    image: 'https://picsum.photos/seed/graphql/800/400'
  },
  {
    id: 5,
    title: 'Микросервисная архитектура',
    description: 'Принципы построения микросервисной архитектуры и ее преимущества',
    author: 'Дмитрий Волков',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    date: '2023-04-20',
    tags: ['Microservices', 'Architecture', 'Backend'],
    image: 'https://picsum.photos/seed/microservices/800/400'
  }
];

const Materials = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [materials] = useState(mockMaterials);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Обработчик ошибки загрузки изображения
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Заменяем на резервное изображение при ошибке загрузки
    event.currentTarget.src = 'https://via.placeholder.com/800x400?text=Материалы';
  };

  // Функция форматирования даты
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Переход на страницу создания материала
  const goToCreateMaterial = () => {
    navigate(AppRoutes.createMaterial());
  };

  // Фильтрация материалов по поисковому запросу
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Материалы
        </Typography>
        {isAuth && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={goToCreateMaterial}
          >
            Добавить материал
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Поиск по материалам..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredMaterials.map((material) => (
          <Grid item xs={12} key={material.id}>
            <Card sx={{ mb: 2 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={material.image}
                  alt={material.title}
                  sx={{ objectFit: 'cover' }}
                  onError={handleImageError}
                />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {material.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {material.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {material.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" clickable />
                    ))}
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={material.authorAvatar} 
                        alt={material.author}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {material.author}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(material.date)}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Materials; 