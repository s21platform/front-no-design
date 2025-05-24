import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';

// Интерфейс для пользователя (пира)
interface Peer {
  uuid: string;
  full_name: string;
  avatar_url?: string;
}

interface ChatNewDialogProps {
  open: boolean;
  onClose: () => void;
  onChatCreated?: (chatUuid: string) => void;
}

const ChatNewDialog: React.FC<ChatNewDialogProps> = ({ open, onClose, onChatCreated }) => {
  const [search, setSearch] = useState<string>('');
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
  const [creatingChat, setCreatingChat] = useState<boolean>(false);

  // Имитация загрузки пиров при вводе поиска
  useEffect(() => {
    if (!search.trim()) {
      setPeers([]);
      return;
    }

    setLoading(true);
    
    // В реальном приложении здесь был бы запрос API для поиска пользователей
    // Например:
    // const fetchPeers = async () => {
    //   try {
    //     const response = await fetch(`/api/peers/search?query=${search}`);
    //     const data = await response.json();
    //     setPeers(data.peers || []);
    //   } catch (error) {
    //     console.error('Ошибка при поиске пользователей:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPeers();

    // Имитация загрузки для примера
    const timer = setTimeout(() => {
      // Мок данные для примера
      const mockPeers: Peer[] = [
        { uuid: '1', full_name: 'Иван Иванов', avatar_url: 'https://mui.com/static/images/avatar/1.jpg' },
        { uuid: '2', full_name: 'Петр Петров', avatar_url: 'https://mui.com/static/images/avatar/2.jpg' },
        { uuid: '3', full_name: 'Анна Сидорова', avatar_url: 'https://mui.com/static/images/avatar/3.jpg' }
      ].filter(peer => 
        peer.full_name.toLowerCase().includes(search.toLowerCase())
      );
      
      setPeers(mockPeers);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);

  // Создание нового чата
  const handleCreateChat = async () => {
    if (!selectedPeer) return;
    
    setCreatingChat(true);
    try {
      // В реальном приложении здесь был бы запрос API для создания чата
      const response = await fetch('/api/chat/private', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          companion_uuid: selectedPeer.uuid
        }),
      });
      
      if (!response.ok) {
        throw new Error('Не удалось создать чат');
      }
      
      const data = await response.json();
      
      // Закрыть диалог
      onClose();
      
      // Вызвать коллбэк создания чата, если он передан
      if (data.new_chat_uuid && onChatCreated) {
        onChatCreated(data.new_chat_uuid);
      }
    } catch (error) {
      console.error('Ошибка создания чата:', error);
      // В реальном приложении здесь можно добавить отображение ошибки пользователю
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать новый чат</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Поиск пользователя"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          margin="normal"
          placeholder="Введите имя для поиска"
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : peers.length > 0 ? (
          <List sx={{ width: '100%', mt: 2 }}>
            {peers.map((peer) => (
              <React.Fragment key={peer.uuid}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedPeer?.uuid === peer.uuid}
                    onClick={() => setSelectedPeer(peer)}
                  >
                    <ListItemAvatar>
                      <Avatar src={peer.avatar_url} alt={peer.full_name} />
                    </ListItemAvatar>
                    <ListItemText primary={peer.full_name} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : search.trim() !== '' && (
          <Box sx={{ p: 2, mt: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Пользователи не найдены
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
        <Button 
          onClick={handleCreateChat} 
          color="primary" 
          variant="contained"
          disabled={!selectedPeer || creatingChat}
        >
          {creatingChat ? <CircularProgress size={24} /> : 'Создать чат'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatNewDialog; 