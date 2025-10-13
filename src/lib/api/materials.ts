import api from './api';
import { ApiRoutes } from '../routes/const/apiRoutes';
import {
  Material,
  SaveDraftMaterialRequest,
  SaveDraftMaterialResponse,
  PublishMaterialRequest,
  PublishMaterialResponse,
  EditMaterialRequest,
  EditMaterialResponse,
  GetAllMaterialsResponse,
  ToggleLikeRequest,
  ToggleLikeResponse,
} from '../types/material';

/**
 * Сохранить черновик материала
 */
export const saveDraftMaterial = async (
  data: SaveDraftMaterialRequest
): Promise<SaveDraftMaterialResponse> => {
  const response = await api.post(ApiRoutes.saveDraftMaterial(), data, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Опубликовать материал
 */
export const publishMaterial = async (
  data: PublishMaterialRequest
): Promise<PublishMaterialResponse> => {
  const response = await api.post(ApiRoutes.publishMaterial(), data, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Редактировать материал
 */
export const editMaterial = async (
  data: EditMaterialRequest
): Promise<EditMaterialResponse> => {
  const response = await api.post(ApiRoutes.editMaterial(), data, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Получить все опубликованные материалы с пагинацией
 */
export const getAllMaterials = async (
  page = 1,
  limit = 10
): Promise<GetAllMaterialsResponse> => {
  const response = await api.get(ApiRoutes.materials(), {
    params: { page, limit },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Получить материал по UUID
 */
export const getMaterialByUuid = async (uuid: string): Promise<Material> => {
  const response = await api.get(ApiRoutes.material(uuid), {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Переключить лайк на материале
 */
export const toggleLikeMaterial = async (
  data: ToggleLikeRequest
): Promise<ToggleLikeResponse> => {
  const response = await api.put(ApiRoutes.toggleLike(), data, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Вычислить примерное время чтения материала (на основе количества слов)
 * Средняя скорость чтения: 200-250 слов в минуту
 */
export const calculateReadTime = (content: string): number => {
  try {
    // Пытаемся распарсить JSON контент от BlockNote
    const parsedContent = JSON.parse(content);
    let text = '';
    
    // Рекурсивная функция для извлечения текста из BlockNote структуры
    const extractText = (blocks: any[]): string => {
      let result = '';
      blocks.forEach((block: any) => {
        if (block.content) {
          block.content.forEach((item: any) => {
            if (item.text) {
              result += item.text + ' ';
            }
          });
        }
        if (block.children && Array.isArray(block.children)) {
          result += extractText(block.children);
        }
      });
      return result;
    };
    
    if (Array.isArray(parsedContent)) {
      text = extractText(parsedContent);
    } else {
      text = content;
    }
    
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes); // Минимум 1 минута
  } catch {
    // Если не JSON, считаем как обычный текст
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  }
};

