import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Stack,
  useTheme,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Material } from "../lib/types/material";
import { getMaterialByUuid, editMaterial, toggleLikeMaterial, calculateReadTime } from "../lib/api/materials";
import { AppRoutes, useAuth } from "../lib/routes";

const MaterialView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuth } = useAuth();
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  
  // Поля для редактирования
  const [editTitle, setEditTitle] = useState("");
  const [editCoverImageUrl, setEditCoverImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  
  // Загрузка материала
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getMaterialByUuid(id);
        setMaterial(data);
        setEditTitle(data.title);
        setEditCoverImageUrl(data.cover_image_url);
        setEditDescription(data.description);
        setEditContent(data.content);
      } catch (err: any) {
        console.error("Ошибка загрузки материала:", err);
        setError(err.response?.data?.message || "Не удалось загрузить материал");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);
  
  // Создаем контент для редакторов
  const getEditorContent = (content: string | undefined) => {
    if (!content) return undefined;
    try {
      return JSON.parse(content);
    } catch {
      return undefined;
    }
  };
  
  // Редактор для режима редактирования
  const editor = useCreateBlockNote({
    initialContent: getEditorContent(editContent),
  });
  
  // Редактор для режима просмотра (read-only)
  const viewEditor = useCreateBlockNote({
    initialContent: getEditorContent(material?.content),
  });

  // Синхронизация контента viewEditor с загруженным материалом
  useEffect(() => {
    if (material?.content && isValidJson(material.content) && viewEditor) {
      try {
        const content = JSON.parse(material.content);
        // Заменяем все блоки в редакторе новым контентом
        viewEditor.replaceBlocks(viewEditor.document, content);
      } catch (err) {
        console.error("Ошибка синхронизации контента:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material?.content]);

  // Синхронизация контента editor с editContent
  useEffect(() => {
    if (editContent && isValidJson(editContent) && editor) {
      try {
        const content = JSON.parse(editContent);
        editor.replaceBlocks(editor.document, content);
      } catch (err) {
        console.error("Ошибка синхронизации editContent:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editContent]);

  // Редактирование материала
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (material) {
      setEditTitle(material.title);
      setEditCoverImageUrl(material.cover_image_url);
      setEditDescription(material.description);
      setEditContent(material.content);
    }
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!material || !id) return;

    try {
      setIsSaving(true);
      setError(null);
      
      const readTime = calculateReadTime(editContent);
      
      const response = await editMaterial({
        uuid: id,
        title: editTitle,
        cover_image_url: editCoverImageUrl,
        description: editDescription,
        content: editContent,
        read_time_minutes: readTime,
      });

      setMaterial(response.material);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Ошибка сохранения материала:", err);
      setError(err.response?.data?.message || "Ошибка сохранения материала");
    } finally {
      setIsSaving(false);
    }
  };

  // Переключение лайка
  const handleToggleLike = async () => {
    if (!id || !isAuth) return;

    try {
      setIsTogglingLike(true);
      const response = await toggleLikeMaterial({ material_uuid: id });
      setIsLiked(response.is_liked);
      setLikesCount(response.likes_count);
    } catch (err: any) {
      console.error("Ошибка переключения лайка:", err);
    } finally {
      setIsTogglingLike(false);
    }
  };

  // Обработчик изменения контента в редакторе
  const handleEditorChange = () => {
    const saveData = JSON.stringify(editor.document);
    setEditContent(saveData);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !material) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Материал не найден"}</Alert>
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(AppRoutes.materials())}
          sx={{ mt: 2 }}
        >
          Вернуться к списку
        </Button>
      </Container>
    );
  }

  // Проверяем, является ли контент валидным JSON
  const isValidJson = (str: string) => {
    if (!str) return false;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        variant="text"
        color="inherit"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(AppRoutes.materials())}
        sx={{
          mb: 3,
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        Вернуться к списку
      </Button>

      <Paper sx={{ p: 4 }}>
        {material.cover_image_url && (
          <Box
            component="img"
            src={material.cover_image_url}
            alt={material.title}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 4
            }}
          />
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Typography variant="h3" component="h1">
            {material.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            {isAuth && (
              <>
                <IconButton 
                  onClick={handleToggleLike}
                  disabled={isTogglingLike}
                  color={isLiked ? "error" : "default"}
                >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
              </>
            )}
          </Stack>
        </Box>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3, fontSize: "1.2rem" }}
        >
          {material.description}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Chip
            icon={<AccessTimeIcon />}
            label={`${material.read_time_minutes} мин чтения`}
            variant="outlined"
          />
          {likesCount > 0 && (
            <Chip
              icon={<FavoriteIcon />}
              label={`${likesCount} ${likesCount === 1 ? 'лайк' : 'лайков'}`}
              variant="outlined"
              color="error"
            />
          )}
        </Stack>

        {/* Контент материала */}
        {material.content && isValidJson(material.content) ? (
          <Box sx={{ 
            '& .bn-container': { border: 'none' },
            '& .bn-editor': { 
              backgroundColor: 'transparent',
              color: theme.palette.text.primary
            }
          }}>
            <BlockNoteView 
              editor={viewEditor} 
              editable={false}
              theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
            />
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              "& p": { mb: 2 },
            }}
          >
            {material.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Typography>
        )}
      </Paper>

      {/* Диалог редактирования */}
      <Dialog 
        open={isEditing} 
        onClose={handleCancelEdit}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Редактирование материала</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Название"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="URL обложки"
              fullWidth
              value={editCoverImageUrl}
              onChange={(e) => setEditCoverImageUrl(e.target.value)}
            />
            <TextField
              label="Описание"
              fullWidth
              multiline
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <Box>
              <Typography variant="h6" gutterBottom>
                Содержание
              </Typography>
              <Box sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                minHeight: 400
              }}>
                <BlockNoteView 
                  editor={editor}
                  onChange={handleEditorChange}
                  theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} disabled={isSaving}>
            Отмена
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaterialView;
