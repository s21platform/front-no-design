import { useState, ChangeEvent, SyntheticEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Divider, 
  Autocomplete, 
  Chip,
  Alert,
  Snackbar,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  DialogActions,
  Tooltip,
  Stack,
  Popover,
  Link
} from '@mui/material';
import { AppRoutes } from '../lib/routes';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import TitleIcon from '@mui/icons-material/Title';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Список предопределенных тегов для выбора
const suggestedTags = [
  'React', 'JavaScript', 'TypeScript', 'Frontend', 'Backend', 
  'Node.js', 'GraphQL', 'REST API', 'Database', 'Performance', 
  'Security', 'Architecture', 'Testing', 'Mobile', 'Web', 
  'Desktop', 'DevOps', 'Docker', 'Kubernetes', 'AWS',
  'Azure', 'GCP', 'Machine Learning', 'Artificial Intelligence'
];

interface MaterialForm {
  title: string;
  content: string;
  tags: string[];
  coverImage: string;
}

// Тип для попаперов с формами
interface EditorPopover {
  type: 'link' | 'image' | null;
  anchorEl: HTMLElement | null;
  url: string;
  text: string;
}

// Вспомогательные функции для работы с выделенным текстом
const getSelectedText = () => {
  const selection = window.getSelection();
  return selection?.toString() || '';
};

const insertTextAtCursor = (textArea: HTMLTextAreaElement, textToInsert: string, updateState: (value: string) => void) => {
  const isSelected = textArea.selectionStart !== textArea.selectionEnd;
  const startPos = textArea.selectionStart;
  const endPos = textArea.selectionEnd;
  const textBefore = textArea.value.substring(0, startPos);
  const textAfter = textArea.value.substring(endPos);
  
  const newValue = textBefore + textToInsert + textAfter;
  
  // Обновляем значение и позицию курсора
  textArea.value = newValue;
  textArea.focus();
  textArea.selectionStart = startPos + textToInsert.length;
  textArea.selectionEnd = startPos + textToInsert.length;
  
  // Обновляем React состояние
  updateState(newValue);
};

const wrapSelectedText = (textArea: HTMLTextAreaElement, beforeText: string, afterText = '', updateState: (value: string) => void) => {
  const startPos = textArea.selectionStart;
  const endPos = textArea.selectionEnd;
  const selectedText = textArea.value.substring(startPos, endPos);
  let newValue = '';
  
  if (selectedText) {
    const textBefore = textArea.value.substring(0, startPos);
    const textAfter = textArea.value.substring(endPos);
    
    newValue = textBefore + beforeText + selectedText + afterText + textAfter;
    
    // Восстанавливаем выделение вместе с обрамляющими тегами
    textArea.value = newValue;
    textArea.focus();
    textArea.selectionStart = startPos + beforeText.length;
    textArea.selectionEnd = startPos + beforeText.length + selectedText.length;
  } else {
    // Если ничего не выделено, просто вставляем и ставим курсор между тегами
    const textBefore = textArea.value.substring(0, startPos);
    const textAfter = textArea.value.substring(startPos);
    
    newValue = textBefore + beforeText + afterText + textAfter;
    
    // Ставим курсор между тегами
    textArea.value = newValue;
    textArea.focus();
    textArea.selectionStart = startPos + beforeText.length;
    textArea.selectionEnd = startPos + beforeText.length;
  }
  
  // Обновляем React состояние
  updateState(newValue);
};

const CreateMaterial = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [form, setForm] = useState<MaterialForm>({
    title: '',
    content: '',
    tags: [],
    coverImage: 'https://picsum.photos/seed/default/800/400'
  });
  
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Режим предпросмотра редактора (markdown/preview)
  const [editorPreview, setEditorPreview] = useState(false);
  
  // Ссылка на текстовое поле для работы с выделением
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Состояние для попаперов вставки ссылок и изображений
  const [popover, setPopover] = useState<EditorPopover>({
    type: null,
    anchorEl: null,
    url: '',
    text: ''
  });
  
  // Обработчик изменения полей формы
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик изменения тегов
  const handleTagsChange = (_event: SyntheticEvent, newValue: string[]) => {
    setForm(prev => ({ ...prev, tags: newValue }));
  };

  // Обработчик изменения URL обложки
  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, coverImage: e.target.value }));
  };

  // Обновление содержимого материала
  const updateContent = (newContent: string) => {
    setForm(prev => ({ ...prev, content: newContent }));
  };

  // Тестовая функция создания материала (мок)
  const handleSubmit = () => {
    console.log('Создан новый материал:', form);
    setSuccessMessage('Материал успешно создан!');
    
    // В реальном приложении здесь был бы запрос к API
    setTimeout(() => {
      navigate(AppRoutes.materials());
    }, 2000);
  };

  // Обработчик открытия модального окна предпросмотра
  const handleOpenPreview = () => {
    setPreviewDialogOpen(true);
  };

  // Обработчик закрытия модального окна предпросмотра
  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
  };

  // Форматирование даты публикации для предпросмотра
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('ru-RU', options);
  };
  
  // Вставка заголовка разного уровня
  const insertHeading = (level: number) => {
    if (!textAreaRef.current) return;
    
    const prefix = '#'.repeat(level) + ' ';
    
    // Проверяем, выделен ли текст
    const selectedText = getSelectedText();
    
    if (selectedText) {
      wrapSelectedText(textAreaRef.current, prefix, '\n', updateContent);
    } else {
      // Вставляем в начало новой строки
      const curPos = textAreaRef.current.selectionStart;
      const text = textAreaRef.current.value;
      
      // Проверяем, находимся ли мы в начале строки
      const insertPos = curPos;
      if (curPos > 0 && text[curPos - 1] !== '\n') {
        // Добавляем перенос строки перед заголовком
        insertTextAtCursor(textAreaRef.current, '\n' + prefix, updateContent);
      } else {
        insertTextAtCursor(textAreaRef.current, prefix, updateContent);
      }
    }
  };
  
  // Вставка жирного текста
  const insertBold = () => {
    if (!textAreaRef.current) return;
    wrapSelectedText(textAreaRef.current, '**', '**', updateContent);
  };
  
  // Вставка курсива
  const insertItalic = () => {
    if (!textAreaRef.current) return;
    wrapSelectedText(textAreaRef.current, '_', '_', updateContent);
  };
  
  // Вставка цитаты
  const insertQuote = () => {
    if (!textAreaRef.current) return;
    
    const selectedText = getSelectedText();
    
    if (selectedText) {
      // Добавляем префикс > к каждой строке выделенного текста
      const quotedText = selectedText
        .split('\n')
        .map(line => '> ' + line)
        .join('\n');
      
      const startPos = textAreaRef.current.selectionStart;
      const endPos = textAreaRef.current.selectionEnd;
      const textBefore = textAreaRef.current.value.substring(0, startPos);
      const textAfter = textAreaRef.current.value.substring(endPos);
      
      const newValue = textBefore + quotedText + textAfter;
      textAreaRef.current.value = newValue;
      
      // Восстанавливаем фокус
      textAreaRef.current.focus();
      textAreaRef.current.selectionStart = startPos;
      textAreaRef.current.selectionEnd = startPos + quotedText.length;
      
      // Обновляем состояние React
      updateContent(newValue);
    } else {
      // Вставляем пустую цитату
      insertTextAtCursor(textAreaRef.current, '> ', updateContent);
    }
  };
  
  // Вставка маркированного списка
  const insertBulletList = () => {
    if (!textAreaRef.current) return;
    
    const selectedText = getSelectedText();
    
    if (selectedText) {
      // Преобразуем выделенный текст в список
      const listItems = selectedText
        .split('\n')
        .map(line => '- ' + line)
        .join('\n');
      
      const startPos = textAreaRef.current.selectionStart;
      const endPos = textAreaRef.current.selectionEnd;
      const textBefore = textAreaRef.current.value.substring(0, startPos);
      const textAfter = textAreaRef.current.value.substring(endPos);
      
      const newValue = textBefore + listItems + textAfter;
      textAreaRef.current.value = newValue;
      
      // Восстанавливаем фокус
      textAreaRef.current.focus();
      textAreaRef.current.selectionStart = startPos;
      textAreaRef.current.selectionEnd = startPos + listItems.length;
      
      // Обновляем состояние React
      updateContent(newValue);
    } else {
      // Вставляем пустой элемент списка
      insertTextAtCursor(textAreaRef.current, '- ', updateContent);
    }
  };
  
  // Вставка нумерованного списка
  const insertNumberedList = () => {
    if (!textAreaRef.current) return;
    
    const selectedText = getSelectedText();
    
    if (selectedText) {
      // Преобразуем выделенный текст в нумерованный список
      const lines = selectedText.split('\n');
      const listItems = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
      
      const startPos = textAreaRef.current.selectionStart;
      const endPos = textAreaRef.current.selectionEnd;
      const textBefore = textAreaRef.current.value.substring(0, startPos);
      const textAfter = textAreaRef.current.value.substring(endPos);
      
      const newValue = textBefore + listItems + textAfter;
      textAreaRef.current.value = newValue;
      
      // Восстанавливаем фокус
      textAreaRef.current.focus();
      textAreaRef.current.selectionStart = startPos;
      textAreaRef.current.selectionEnd = startPos + listItems.length;
      
      // Обновляем состояние React
      updateContent(newValue);
    } else {
      // Вставляем пустой элемент списка
      insertTextAtCursor(textAreaRef.current, '1. ', updateContent);
    }
  };
  
  // Вставка кода
  const insertCode = () => {
    if (!textAreaRef.current) return;
    
    const selectedText = getSelectedText();
    
    if (selectedText.includes('\n')) {
      // Блок кода для многострочного выделения
      wrapSelectedText(textAreaRef.current, '```\n', '\n```', updateContent);
    } else {
      // Встроенный код для однострочного выделения
      wrapSelectedText(textAreaRef.current, '`', '`', updateContent);
    }
  };
  
  // Вставка горизонтальной линии
  const insertHorizontalRule = () => {
    if (!textAreaRef.current) return;
    
    // Вставляем в начало новой строки
    const curPos = textAreaRef.current.selectionStart;
    const text = textAreaRef.current.value;
    
    // Проверяем, находимся ли мы в начале строки
    if (curPos > 0 && text[curPos - 1] !== '\n') {
      // Добавляем перенос строки перед и после
      insertTextAtCursor(textAreaRef.current, '\n\n---\n\n', updateContent);
    } else {
      insertTextAtCursor(textAreaRef.current, '---\n\n', updateContent);
    }
  };
  
  // Открытие попапа для вставки ссылки
  const openLinkPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedText = getSelectedText();
    
    setPopover({
      type: 'link',
      anchorEl: event.currentTarget,
      url: '',
      text: selectedText || 'Текст ссылки'
    });
  };
  
  // Открытие попапа для вставки изображения
  const openImagePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopover({
      type: 'image',
      anchorEl: event.currentTarget,
      url: '',
      text: 'Описание изображения'
    });
  };
  
  // Закрытие попапа
  const closePopover = () => {
    setPopover({
      type: null,
      anchorEl: null,
      url: '',
      text: ''
    });
  };
  
  // Вставка ссылки из попапа
  const insertLink = () => {
    if (!textAreaRef.current || !popover.url) return;
    
    const markdown = `[${popover.text}](${popover.url})`;
    insertTextAtCursor(textAreaRef.current, markdown, updateContent);
    closePopover();
  };
  
  // Вставка изображения из попапа
  const insertImage = () => {
    if (!textAreaRef.current || !popover.url) return;
    
    const markdown = `![${popover.text}](${popover.url})`;
    insertTextAtCursor(textAreaRef.current, markdown, updateContent);
    closePopover();
  };
  
  // Переключение режима предпросмотра редактора
  const toggleEditorPreview = () => {
    setEditorPreview(!editorPreview);
  };
  
  // Рендеринг панели инструментов редактора
  const renderEditorToolbar = () => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 0.5, 
        mb: 1, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: 1,
        '& .MuiIconButton-root': {
          p: '6px',
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
        }
      }}>
        <Tooltip title="Заголовок 1-го уровня">
          <IconButton onClick={() => insertHeading(1)}>
            <Typography component="span" sx={{ fontSize: '1.6rem', fontWeight: 'bold' }}>H1</Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Заголовок 2-го уровня">
          <IconButton onClick={() => insertHeading(2)}>
            <Typography component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>H2</Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Заголовок 3-го уровня">
          <IconButton onClick={() => insertHeading(3)}>
            <Typography component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>H3</Typography>
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem />
        
        <Tooltip title="Полужирный (Ctrl+B)">
          <IconButton onClick={insertBold}>
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Курсив (Ctrl+I)">
          <IconButton onClick={insertItalic}>
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem />
        
        <Tooltip title="Маркированный список">
          <IconButton onClick={insertBulletList}>
            <FormatListBulletedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Нумерованный список">
          <IconButton onClick={insertNumberedList}>
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem />
        
        <Tooltip title="Цитата">
          <IconButton onClick={insertQuote}>
            <FormatQuoteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Код">
          <IconButton onClick={insertCode}>
            <CodeIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem />
        
        <Tooltip title="Вставить ссылку">
          <IconButton onClick={openLinkPopover}>
            <InsertLinkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Вставить изображение">
          <IconButton onClick={openImagePopover}>
            <InsertPhotoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Горизонтальная линия">
          <IconButton onClick={insertHorizontalRule}>
            <HorizontalRuleIcon />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title={editorPreview ? "Режим редактирования" : "Режим предпросмотра"}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<VisibilityIcon />}
            onClick={toggleEditorPreview}
            sx={{ 
              height: 32, 
              mt: '3px',
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
              borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
            }}
          >
            {editorPreview ? "Редактировать" : "Предпросмотр"}
          </Button>
        </Tooltip>
      </Box>
    );
  };
  
  // Рендеринг редактора Markdown
  const renderEditor = () => {
    return (
      <Box sx={{ position: 'relative' }}>
        {renderEditorToolbar()}
        
        {editorPreview ? (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              minHeight: 200,
              '& img': {
                maxWidth: '100%'
              },
              '& pre': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                padding: 2,
                borderRadius: 1,
                overflowX: 'auto'
              },
              '& code': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '0.9em'
              },
              '& blockquote': {
                borderLeft: `3px solid ${theme.palette.divider}`,
                margin: '0 0 1em',
                padding: '0 1em',
                color: theme.palette.text.secondary
              },
              // Улучшенная стилизация заголовков
              '& h1': {
                fontSize: '2rem',
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                marginTop: '1em',
                marginBottom: '0.5em',
                borderBottom: `1px solid ${theme.palette.divider}`,
                paddingBottom: '0.3em'
              },
              '& h2': {
                fontSize: '1.75rem',
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                marginTop: '1em',
                marginBottom: '0.5em',
              },
              '& h3': {
                fontSize: '1.5rem',
                fontWeight: 500,
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.87)' : 'rgba(0,0,0,0.87)',
                marginTop: '1em',
                marginBottom: '0.5em',
              },
              // Улучшенная стилизация ссылок
              '& a': {
                color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.main,
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                  color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                }
              },
              // Улучшенная стилизация списков
              '& ul, & ol': {
                paddingLeft: '1.5em',
                marginBottom: '1em',
              },
              '& li': {
                marginBottom: '0.3em',
              }
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {form.content || '### Предпросмотр контента\n\nЗдесь будет отображаться предпросмотр вашего Markdown-текста.'}
            </ReactMarkdown>
          </Paper>
        ) : (
          <TextField
            name="content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            multiline
            inputRef={textAreaRef}
            minRows={6}
            maxRows={12}
            variant="outlined"
            placeholder="Введите текст в формате Markdown..."
            InputProps={{
              sx: {
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                '& .MuiInputBase-inputMultiline': {
                  minHeight: 180
                }
              }
            }}
          />
        )}
        
        {/* Попап для вставки ссылки */}
        <Popover
          open={popover.type === 'link'}
          anchorEl={popover.anchorEl}
          onClose={closePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Вставить ссылку</Typography>
            <TextField
              label="Текст ссылки"
              value={popover.text}
              fullWidth
              size="small"
              margin="dense"
              onChange={(e) => setPopover({...popover, text: e.target.value})}
            />
            <TextField
              label="URL ссылки"
              value={popover.url}
              fullWidth
              size="small"
              margin="dense"
              onChange={(e) => setPopover({...popover, url: e.target.value})}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button size="small" onClick={closePopover} sx={{ mr: 1 }}>Отмена</Button>
              <Button size="small" variant="contained" onClick={insertLink} disabled={!popover.url}>
                Вставить
              </Button>
            </Box>
          </Box>
        </Popover>
        
        {/* Попап для вставки изображения */}
        <Popover
          open={popover.type === 'image'}
          anchorEl={popover.anchorEl}
          onClose={closePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Вставить изображение</Typography>
            <TextField
              label="Описание (alt)"
              value={popover.text}
              fullWidth
              size="small"
              margin="dense"
              onChange={(e) => setPopover({...popover, text: e.target.value})}
            />
            <TextField
              label="URL изображения"
              value={popover.url}
              fullWidth
              size="small"
              margin="dense"
              onChange={(e) => setPopover({...popover, url: e.target.value})}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button size="small" onClick={closePopover} sx={{ mr: 1 }}>Отмена</Button>
              <Button size="small" variant="contained" onClick={insertImage} disabled={!popover.url}>
                Вставить
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Глобальные стили для Markdown контента */}
      <Box sx={{
        '& .MuiDialogContent-root .MuiCardContent-root .ReactMarkdown': {
          '& img': {
            maxWidth: '100%'
          },
          '& pre': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            padding: 2,
            borderRadius: 1,
            overflowX: 'auto'
          },
          '& code': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            padding: '0.2em 0.4em',
            borderRadius: '3px',
            fontSize: '0.9em'
          },
          '& blockquote': {
            borderLeft: `3px solid ${theme.palette.divider}`,
            margin: '0 0 1em',
            padding: '0 1em',
            color: theme.palette.text.secondary
          },
          // Улучшенная стилизация заголовков
          '& h1': {
            fontSize: '2rem',
            fontWeight: 600,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            marginTop: '1em',
            marginBottom: '0.5em',
            borderBottom: `1px solid ${theme.palette.divider}`,
            paddingBottom: '0.3em'
          },
          '& h2': {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
            marginTop: '1em',
            marginBottom: '0.5em',
          },
          '& h3': {
            fontSize: '1.5rem',
            fontWeight: 500,
            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.87)' : 'rgba(0,0,0,0.87)',
            marginTop: '1em',
            marginBottom: '0.5em',
          },
          // Улучшенная стилизация ссылок
          '& a': {
            color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.main,
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
              color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
            }
          },
          // Улучшенная стилизация списков
          '& ul, & ol': {
            paddingLeft: '1.5em',
            marginBottom: '1em',
          },
          '& li': {
            marginBottom: '0.3em',
          }
        }
      }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создание нового материала
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Используйте Markdown для форматирования текста или воспользуйтесь кнопками панели инструментов.
        </Typography>
      </Box>

      {/* Инструкция по использованию Markdown */}
      <Paper sx={{ mb: 3, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Как использовать Markdown-редактор:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" component="div">
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Выделите текст и нажмите кнопку форматирования</li>
                <li>Или используйте Markdown-синтаксис напрямую</li>
                <li>Нажмите кнопку &quot;Предпросмотр&quot; для просмотра результата</li>
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" component="div">
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li><code># Заголовок</code> - для заголовка 1-го уровня</li>
                <li><code>**жирный текст**</code> - для выделения жирным</li>
                <li><code>_курсив_</code> - для курсива</li>
                <li><code>[текст](http://ссылка)</code> - для ссылок</li>
                <li><code>![описание](url картинки)</code> - для изображений</li>
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Основная форма */}
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Заголовок материала"
            value={form.title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            required
          />

          <TextField
            name="coverImage"
            label="URL изображения обложки"
            value={form.coverImage}
            onChange={handleCoverImageChange}
            fullWidth
            variant="outlined"
            margin="normal"
            helperText="Укажите ссылку на изображение для обложки материала"
          />

          <Autocomplete
            multiple
            id="tags-input"
            options={suggestedTags}
            value={form.tags}
            onChange={handleTagsChange}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const tagProps = getTagProps({ index });
                return (
                  <Chip 
                    key={`tag-${index}-${option}`} 
                    variant="outlined" 
                    label={option} 
                    onDelete={tagProps.onDelete}
                    disabled={tagProps.disabled}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Теги"
                margin="normal"
                helperText="Выберите из списка или добавьте свои теги"
              />
            )}
          />

          <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Содержание материала
            </Typography>
            <IconButton 
              color="primary" 
              onClick={handleOpenPreview}
              disabled={!form.title && !form.content}
              title="Предпросмотр полной статьи"
              aria-label="Предпросмотр полной статьи"
              sx={{ 
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.08)' 
                    : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>

          {/* Редактор Markdown */}
          <Box sx={{ mb: 3 }}>
            {renderEditor()}
          </Box>

          <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => navigate(AppRoutes.materials())}
            >
              Отмена
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubmit}
              disabled={!form.title || !form.content}
            >
              Опубликовать материал
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Модальное окно предпросмотра полной статьи */}
      <Dialog
        open={previewDialogOpen}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
        aria-labelledby="preview-dialog-title"
      >
        <DialogTitle id="preview-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Предпросмотр статьи
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClosePreview}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Card sx={{ boxShadow: 'none' }}>
            {form.coverImage && (
              <CardMedia
                component="img"
                height="300"
                image={form.coverImage}
                alt={form.title || "Обложка материала"}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Материалы';
                }}
                sx={{ borderRadius: 1 }}
              />
            )}
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {form.title || "Заголовок материала"}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {form.tags.map((tag, index) => (
                  <Chip key={`preview-tag-${index}`} label={tag} size="small" />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Автор: Вы • {formatDate()}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 4 }}>
                {form.content ? (
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2,
                      minHeight: 200,
                      '& h1': {
                        fontSize: '2rem',
                        fontWeight: 600,
                        color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                        marginTop: '1em',
                        marginBottom: '0.5em',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        paddingBottom: '0.3em'
                      },
                      '& h2': {
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                        marginTop: '1em',
                        marginBottom: '0.5em',
                      },
                      '& h3': {
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.87)' : 'rgba(0,0,0,0.87)',
                        marginTop: '1em',
                        marginBottom: '0.5em',
                      },
                      '& a': {
                        color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.main,
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                          color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                        }
                      },
                      '& img': {
                        maxWidth: '100%'
                      },
                      '& pre': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        padding: 2,
                        borderRadius: 1,
                        overflowX: 'auto'
                      },
                      '& code': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        padding: '0.2em 0.4em',
                        borderRadius: '3px',
                        fontSize: '0.9em'
                      },
                      '& blockquote': {
                        borderLeft: `3px solid ${theme.palette.divider}`,
                        margin: '0 0 1em',
                        padding: '0 1em',
                        color: theme.palette.text.secondary
                      },
                      '& ul, & ol': {
                        paddingLeft: '1.5em',
                        marginBottom: '1em',
                      },
                      '& li': {
                        marginBottom: '0.3em',
                      },
                      '& p': {
                        marginBottom: '1em',
                      }
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {form.content}
                    </ReactMarkdown>
                  </Paper>
                ) : (
                  <Typography color="text.secondary" align="center">
                    Содержание материала пока не заполнено.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      </Box>
    </Container>
  );
};

export default CreateMaterial; 