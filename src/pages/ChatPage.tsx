import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  ListItemButton,
  Avatar, 
  Divider, 
  Paper, 
  TextField, 
  InputAdornment, 
  CircularProgress,
  Tooltip,
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';
import ChatNewDialog from '../components/ChatNewDialog/ChatNewDialog';

// Интерфейс для чата
interface Chat {
  last_message: string;
  chat_name: string;
  avatar_url: string;
  last_message_timestamp: string;
  chat_uuid: string;
}

// Интерфейс для сообщения
interface Message {
  uuid: string;
  content: string;
  sent_at: string;
  updated_at: string;
  root_uuid: string;
  parent_uuid: string;
  sender_uuid?: string; // Дополнительно, чтобы идентифицировать отправителя
}

// Добавляю интерфейс для кешированных сообщений
interface ChatMessages {
  [chatUuid: string]: {
    messages: Message[];
    lastFetchedAt: number;
  }
}

const ChatPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Состояние для списка чатов
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newChatDialogOpen, setNewChatDialogOpen] = useState<boolean>(false);
  
  // Состояние для сообщений выбранного чата
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [currentUserUuid, setCurrentUserUuid] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  
  // Кеш сообщений чатов
  const [cachedChatMessages, setCachedChatMessages] = useState<ChatMessages>({});
  
  // Время истечения кеша в миллисекундах (30 секунд для примера, можно увеличить)
  const CACHE_EXPIRATION_TIME = 30 * 1000;
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Загрузка списка чатов
  useEffect(() => {
    fetchChats();
  }, []);

  // Мемоизированная функция получения сообщений с учетом кеша
  const fetchMessages = useCallback(async (chatUuid: string) => {
    setLoadingMessages(true);
    
    // Проверяем, есть ли в кеше актуальные данные для этого чата
    const cachedData = cachedChatMessages[chatUuid];
    const now = Date.now();
    
    if (cachedData && (now - cachedData.lastFetchedAt < CACHE_EXPIRATION_TIME)) {
      // Используем кешированные данные
      console.log('Using cached messages for chat:', chatUuid);
      setMessages(cachedData.messages);
      setLoadingMessages(false);
      scrollToBottom();
      return;
    }
    
    // Если кеша нет или он устарел, загружаем данные с сервера
    try {
      console.log('Fetching fresh messages for chat:', chatUuid);
      const response = await fetch(`/api/chat/private/messages?uuid=${chatUuid}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить сообщения');
      }
      
      const data = await response.json();
      const fetchedMessages = data.messages || [];
      
      // Сохраняем данные в кеш
      setCachedChatMessages(prev => ({
        ...prev,
        [chatUuid]: {
          messages: fetchedMessages,
          lastFetchedAt: Date.now()
        }
      }));
      
      // Обновляем состояние
      setMessages(fetchedMessages);
      
      // Для примера - в реальном коде нужно получить UUID текущего пользователя
      if (data.current_user_uuid) {
        setCurrentUserUuid(data.current_user_uuid);
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      setLoadingMessages(false);
      scrollToBottom();
    }
  }, [cachedChatMessages]);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // При обновлении списка сообщений прокручиваем вниз
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      // Текущее сообщение для отправки
      const messageToSend = newMessage.trim();
      // Очищаем поле ввода сразу для лучшего UX
      setNewMessage('');

      // Создаем новое сообщение
      const newMsg: Message = {
        uuid: `temp-${Date.now()}`,
        content: messageToSend,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        root_uuid: '',
        parent_uuid: '',
        sender_uuid: currentUserUuid || 'current-user'
      };
      
      // В реальном приложении здесь был бы API запрос для отправки сообщения
      // const response = await fetch('/api/chat/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify({
      //     chat_uuid: selectedChat.chat_uuid,
      //     content: messageToSend
      //   }),
      // });
      
      // Обновляем локальные сообщения
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      
      // Обновляем кеш сообщений
      if (selectedChat) {
        setCachedChatMessages(prev => ({
          ...prev,
          [selectedChat.chat_uuid]: {
            messages: updatedMessages,
            lastFetchedAt: Date.now()
          }
        }));
      }
      
      // Обновляем последнее сообщение в списке чатов
      updateLastMessage(selectedChat.chat_uuid, messageToSend);
      
      // Прокрутить к новому сообщению
      setTimeout(scrollToBottom, 10);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  // Обновляет последнее сообщение в списке чатов
  const updateLastMessage = (chatUuid: string, messageContent: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.chat_uuid === chatUuid 
        ? {
            ...chat, 
            last_message: messageContent,
            last_message_timestamp: new Date().toISOString()
          }
        : chat
      )
    );
  };

  // Функция выбора чата
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.chat_uuid);
  };

  // Закрытие чата (на мобильных возвращает к списку)
  const handleCloseChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  // Обработчик успешного создания нового чата
  const handleChatCreated = (chatUuid: string) => {
    // Обновляем список чатов
    fetchChats();
    
    // Находим созданный чат и открываем его
    const chat = chats.find(c => c.chat_uuid === chatUuid);
    if (chat) {
      handleSelectChat(chat);
    }
  };

  // Функция обновления списка чатов
  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить чаты');
      }
      
      const data = await response.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция форматирования времени для списка чатов
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === now.toDateString()) {
        return format(date, 'HH:mm', { locale: ru });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Вчера';
      } else {
        return format(date, 'd MMM', { locale: ru });
      }
    } catch (error) {
      return '';
    }
  };

  // Форматирование даты сообщений
  const formatMessageDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return format(date, 'HH:mm', { locale: ru });
      } else if (isYesterday(date)) {
        return `Вчера, ${format(date, 'HH:mm', { locale: ru })}`;
      } else {
        return format(date, 'd MMM, HH:mm', { locale: ru });
      }
    } catch (error) {
      return '';
    }
  };

  // Проверка, является ли сообщение от текущего пользователя
  const isCurrentUserMessage = (message: Message) => {
    return message.sender_uuid === currentUserUuid || message.sender_uuid === 'current-user';
  };

  // Фильтрация чатов по поисковому запросу
  const filteredChats = chats.filter(chat => 
    chat.chat_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обновление кеша при получении новых сообщений через веб-сокет или push-уведомление
  const handleNewMessageReceived = (chatUuid: string, message: Message) => {
    // Если чат открыт, добавляем сообщение в текущий список
    if (selectedChat?.chat_uuid === chatUuid) {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    }
    
    // Обновляем кеш сообщений
    setCachedChatMessages(prev => {
      const chatCache = prev[chatUuid];
      if (chatCache) {
        return {
          ...prev,
          [chatUuid]: {
            messages: [...chatCache.messages, message],
            lastFetchedAt: Date.now()
          }
        };
      }
      return prev;
    });
    
    // Обновляем список чатов, чтобы отобразить последнее сообщение
    updateLastMessage(chatUuid, message.content);
  };

  // Функция для принудительного обновления сообщений (например, при пул-ту-рефреш)
  const refreshMessages = async () => {
    if (selectedChat) {
      // Сбрасываем кеш для текущего чата
      setCachedChatMessages(prev => {
        const newCache = { ...prev };
        delete newCache[selectedChat.chat_uuid];
        return newCache;
      });
      
      // Загружаем свежие данные
      await fetchMessages(selectedChat.chat_uuid);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 150px)', // Фиксированная высота с учётом заголовка и отступов
      minHeight: 500, // Минимальная высота
      maxWidth: '100%'
    }}>
      {/* Заголовок с кнопкой создания чата */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 3,
        flexShrink: 0 // Запрещаем сжиматься
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ mr: 2 }}>
            Чаты
          </Typography>
          <Tooltip title="Создать новый чат">
            <IconButton 
              color="primary" 
              onClick={() => setNewChatDialogOpen(true)}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                width: 40,
                height: 40
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Основной контейнер для чатов - фиксированной высоты */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        height: '100%',
        maxHeight: 'calc(100vh - 200px)', // Максимальная высота
        overflow: 'hidden' // Запрещаем внешнее переполнение
      }}>
        {/* Левая панель со списком чатов */}
        {(!isMobile || !selectedChat) && (
          <Box 
            sx={{ 
              width: isMobile ? '100%' : 350, 
              height: '100%',
              flexShrink: 0, // Запрещаем сжиматься
              mr: isMobile ? 0 : 2 
            }}
          >
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              {/* Поле поиска */}
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, flexShrink: 0 }}>
                <TextField
                  fullWidth
                  placeholder="Поиск по чатам"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              
              {/* Список чатов */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto', // Скролл только для списка чатов
                height: 'calc(100% - 70px)' // Высота за вычетом поиска
              }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredChats.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {filteredChats.map((chat, index) => (
                      <React.Fragment key={chat.chat_uuid}>
                        <ListItem 
                          alignItems="flex-start" 
                          disablePadding
                          sx={{ mb: 1 }}
                        >
                          <ListItemButton
                            onClick={() => handleSelectChat(chat)}
                            selected={selectedChat?.chat_uuid === chat.chat_uuid}
                            sx={{ 
                              bgcolor: selectedChat?.chat_uuid === chat.chat_uuid 
                                ? 'action.selected' 
                                : 'background.paper',
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                              '&.Mui-selected': {
                                bgcolor: 'action.selected',
                                '&:hover': {
                                  bgcolor: 'action.selected',
                                },
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar 
                                src={chat.avatar_url} 
                                alt={chat.chat_name}
                                sx={{ width: 50, height: 50 }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" component="span" sx={{ fontWeight: 500 }}>
                                    {chat.chat_name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatTimestamp(chat.last_message_timestamp)}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                  }}
                                >
                                  {chat.last_message}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                        {index < filteredChats.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'Чаты не найдены' : 'У вас пока нет чатов'}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Правая панель с сообщениями */}
        {(!isMobile || selectedChat) && (
          <Box sx={{ 
            flex: 1, 
            height: '100%', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {selectedChat ? (
              <Paper
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                {/* Шапка выбранного чата */}
                <Box 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    flexShrink: 0, // Запрещаем сжиматься
                    backgroundColor: theme.palette.background.paper
                  }}
                >
                  {isMobile && (
                    <IconButton 
                      edge="start" 
                      sx={{ mr: 2 }}
                      onClick={handleCloseChat}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  
                  <Avatar 
                    src={selectedChat.avatar_url}
                    alt={selectedChat.chat_name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {selectedChat.chat_name}
                  </Typography>
                  
                  {!isMobile && (
                    <IconButton onClick={handleCloseChat}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
                
                {/* Контейнер для сообщений с фиксированной высотой и скроллом */}
                <Box 
                  ref={messagesContainerRef}
                  sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto', // Принудительный скролл по Y
                    overflowX: 'hidden',
                    p: 2,
                    bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
                    height: 'calc(100% - 65px - 70px)' // 100% - шапка - поле ввода
                  }}
                >
                  {loadingMessages ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : messages.length > 0 ? (
                    <Stack spacing={1} sx={{ width: '100%', mb: 2 }}>
                      {messages.map((message) => (
                        <Box
                          key={message.uuid}
                          sx={{
                            display: 'flex',
                            justifyContent: isCurrentUserMessage(message) ? 'flex-end' : 'flex-start',
                            width: '100%'
                          }}
                        >
                          <Paper
                            elevation={1}
                            sx={{
                              p: 1.5,
                              px: 2,
                              maxWidth: '70%',
                              borderRadius: 2,
                              bgcolor: isCurrentUserMessage(message) 
                                ? 'primary.dark' 
                                : theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                              color: isCurrentUserMessage(message) 
                                ? 'white' 
                                : 'text.primary',
                              position: 'relative',
                              boxShadow: theme.shadows[1]
                            }}
                          >
                            <Typography variant="body1">{message.content}</Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                textAlign: 'right',
                                mt: 0.5,
                                opacity: 0.7
                              }}
                            >
                              {formatMessageDate(message.sent_at)}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                      <div ref={messagesEndRef} style={{ height: 1, width: '100%' }} />
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: 'center', p: 4, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary">
                        Нет сообщений
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Форма отправки сообщения */}
                <Box 
                  component="form"
                  onSubmit={(e: React.FormEvent) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  sx={{ 
                    p: 2, 
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexShrink: 0, // Запрещаем сжиматься
                    backgroundColor: theme.palette.background.paper,
                    height: 70 // Фиксированная высота
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Напишите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    variant="outlined"
                    size="small"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!newMessage.trim()}
                    endIcon={<SendIcon />}
                    sx={{ borderRadius: 2, px: 3, height: 40, flexShrink: 0 }}
                  >
                    Отправить
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Paper
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  p: 4,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Выберите чат для общения
                </Typography>
                <Typography color="text.secondary" textAlign="center">
                  Выберите существующий чат из списка или создайте новый, чтобы начать общение
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>
      
      {/* Диалог создания нового чата */}
      <ChatNewDialog 
        open={newChatDialogOpen} 
        onClose={() => setNewChatDialogOpen(false)}
        onChatCreated={handleChatCreated}
      />
    </Box>
  );
};

export default ChatPage; 