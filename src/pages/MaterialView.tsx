import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { mockMaterials } from "../lib/types/material";
import { AppRoutes } from "../lib/routes";

const MaterialView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const material = mockMaterials.find(m => m.id === id);

  if (!material) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1">
          Материал не найден
        </Typography>
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(AppRoutes.materials())}
          sx={{
            mt: 2,
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
      </Container>
    );
  }

  const formattedDate = new Date(material.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            src={material.author.avatar}
            alt={material.author.name}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{material.author.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom>
          {material.title}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3, fontSize: "1.2rem" }}
        >
          {material.description}
        </Typography>

        <Chip
          icon={<AccessTimeIcon />}
          label={`${material.readingTime} мин чтения`}
          variant="outlined"
          sx={{ mb: 4 }}
        />

        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            "& p": { mb: 2 },
            "& code": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              padding: "2px 4px",
              borderRadius: 1,
              fontFamily: "monospace",
            },
          }}
        >
          {material.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Typography>
      </Paper>
    </Container>
  );
};

export default MaterialView;
