import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import Editor from "../components/Editor/Editor";
import { saveDraftMaterial, publishMaterial, calculateReadTime } from "../lib/api/materials";
import { AppRoutes } from "../lib/routes";

const AUTO_SAVE_DELAY = 3000; // 3 секунды после последнего изменения

const MaterialsNew: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [materialUuid, setMaterialUuid] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

  // Функция автосохранения черновика
  const autoSaveDraft = useCallback(async () => {
    if (!title.trim()) {
      // Не сохраняем, если нет заголовка
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      const readTime = calculateReadTime(content || "");
      
      const response = await saveDraftMaterial({
        title,
        cover_image_url: coverImageUrl || "https://via.placeholder.com/800x400",
        description: description || "",
        content: content || "",
        read_time_minutes: readTime,
      });

      if (!materialUuid) {
        setMaterialUuid(response.uuid);
      }
      
      setLastSaved(new Date());
      hasChangesRef.current = false;
    } catch (err: any) {
      console.error("Ошибка автосохранения:", err);
      setError(err.response?.data?.message || "Ошибка сохранения черновика");
    } finally {
      setIsSaving(false);
    }
  }, [title, coverImageUrl, description, content, materialUuid]);

  // Отслеживание изменений для автосохранения
  useEffect(() => {
    if (hasChangesRef.current) {
      // Очищаем предыдущий таймер
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Устанавливаем новый таймер
      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveDraft();
      }, AUTO_SAVE_DELAY);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, coverImageUrl, description, content, autoSaveDraft]);

  // Отмечаем, что есть изменения
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    hasChangesRef.current = true;
  };

  const handleCoverImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverImageUrl(e.target.value);
    hasChangesRef.current = true;
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    hasChangesRef.current = true;
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    hasChangesRef.current = true;
  };

  // Ручное сохранение черновика
  const handleManualSave = async () => {
    await autoSaveDraft();
    setShowSuccess(true);
  };

  // Публикация материала
  const handlePublish = async () => {
    if (!materialUuid) {
      setError("Сначала нужно сохранить черновик");
      return;
    }

    if (!description.trim()) {
      setError("Добавьте описание перед публикацией");
      return;
    }

    try {
      setIsPublishing(true);
      setError(null);

      await publishMaterial({
        uuid: materialUuid,
        description: description,
      });

      setShowPublishDialog(false);
      navigate(AppRoutes.materials());
    } catch (err: any) {
      console.error("Ошибка публикации:", err);
      setError(err.response?.data?.message || "Ошибка публикации материала");
    } finally {
      setIsPublishing(false);
    }
  };

  const readTime = calculateReadTime(content);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Создание материала
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {lastSaved && (
              <Chip 
                label={`Сохранено: ${lastSaved.toLocaleTimeString()}`}
                color="success"
                size="small"
              />
            )}
            {isSaving && <CircularProgress size={20} />}
            <Chip 
              label={`${readTime} мин чтения`}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Stack spacing={3}>
          <TextField
            label="Название материала *"
            variant="outlined"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            placeholder="Введите название материала"
            helperText="Название обязательно для сохранения"
          />

          <TextField
            label="URL обложки"
            variant="outlined"
            fullWidth
            value={coverImageUrl}
            onChange={handleCoverImageUrlChange}
            placeholder="https://example.com/image.jpg"
            helperText="URL изображения для обложки материала"
          />

          <TextField
            label="Краткое описание *"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Краткое описание материала (обязательно для публикации)"
            helperText="Описание обязательно для публикации"
          />

          <Box>
            <Typography variant="h6" gutterBottom>
              Содержание
            </Typography>
            <Editor
              initialContent={content}
              onChange={handleContentChange}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(AppRoutes.materials())}
            >
              Отмена
            </Button>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleManualSave}
                disabled={isSaving || !title.trim()}
              >
                Сохранить черновик
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PublishIcon />}
                onClick={() => setShowPublishDialog(true)}
                disabled={!materialUuid || !description.trim()}
              >
                Опубликовать
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Диалог подтверждения публикации */}
      <Dialog open={showPublishDialog} onClose={() => setShowPublishDialog(false)}>
        <DialogTitle>Опубликовать материал?</DialogTitle>
        <DialogContent>
          <Typography>
            После публикации материал станет доступен всем пользователям. Вы уверены?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPublishDialog(false)} disabled={isPublishing}>
            Отмена
          </Button>
          <Button 
            onClick={handlePublish} 
            variant="contained" 
            disabled={isPublishing}
            startIcon={isPublishing ? <CircularProgress size={16} /> : <PublishIcon />}
          >
            {isPublishing ? "Публикация..." : "Опубликовать"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar для успешного сохранения */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="Черновик успешно сохранён"
      />
    </Container>
  );
};

export default MaterialsNew;
