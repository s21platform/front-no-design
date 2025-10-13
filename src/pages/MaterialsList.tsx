import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppRoutes, useAuth } from "../lib/routes";
import { Material } from "../lib/types/material";
import { getAllMaterials } from "../lib/api/materials";
import AddIcon from "@mui/icons-material/Add";
import MaterialCard from "../components/MaterialCard/MaterialCard";

const ITEMS_PER_PAGE = 10;

const MaterialsList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const [page, setPage] = useState(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Загрузка материалов с API
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllMaterials(page, ITEMS_PER_PAGE);
        setMaterials(response.material_list);
        // Предполагаем, что бэкенд возвращает все материалы без пагинации на данном этапе
        // В будущем можно добавить total_count в ответ API
        setTotalPages(Math.ceil(response.material_list.length / ITEMS_PER_PAGE));
      } catch (err: any) {
        console.error("Ошибка загрузки материалов:", err);
        setError(err.response?.data?.message || "Не удалось загрузить материалы");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2 }}
        >
          Попробовать снова
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Материалы
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {isAuth && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(AppRoutes.materialsNew())}
            >
              Создать
            </Button>
          )}
        </Stack>
      </Box>

      {materials.length === 0 ? (
        <Alert severity="info">Материалы пока не добавлены</Alert>
      ) : (
        <>
          <Stack spacing={3}>
            {materials.map((material) => (
              <MaterialCard
                key={material.uuid}
                material={material}
                onReadMore={() => navigate(AppRoutes.materialView(material.uuid))}
              />
            ))}
          </Stack>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default MaterialsList;
