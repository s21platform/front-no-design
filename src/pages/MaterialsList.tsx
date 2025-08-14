import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppRoutes, useAuth } from "../lib/routes";
import { mockMaterials } from "../lib/types/material";
import AddIcon from "@mui/icons-material/Add";

// Будет создан в следующем шаге
import MaterialCard from "../components/MaterialCard/MaterialCard";

const ITEMS_PER_PAGE = 5;

const MaterialsList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  // В будущем это будет API-запрос
  const sortedMaterials = [...mockMaterials].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "readingTime") {
      return a.readingTime - b.readingTime;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedMaterials.length / ITEMS_PER_PAGE);
  const currentMaterials = sortedMaterials.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Материалы
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label">Сортировка</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="Сортировка"
              onChange={handleSortChange}
            >
              <MenuItem value="newest">Сначала новые</MenuItem>
              <MenuItem value="oldest">Сначала старые</MenuItem>
              <MenuItem value="readingTime">По времени чтения</MenuItem>
            </Select>
          </FormControl>
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

      <Stack spacing={3}>
        {currentMaterials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onReadMore={() => navigate(AppRoutes.materialView(material.id))}
          />
        ))}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default MaterialsList;
