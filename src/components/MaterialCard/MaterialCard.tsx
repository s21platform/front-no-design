import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Material } from "../../lib/types/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface MaterialCardProps {
  material: Material;
  onReadMore: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onReadMore }) => {
  // Форматируем дату
  const formattedDate = new Date(material.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Обрезаем контент для превью (первые 300 символов)
  const previewContent = material.content.slice(0, 300) + "...";

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={material.author.avatar}
            alt={material.author.name}
            sx={{ mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle2">{material.author.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom>
          {material.title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {material.description}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {previewContent}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Chip
            icon={<AccessTimeIcon />}
            label={`${material.readingTime} мин`}
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onReadMore}
          >
            Читать далее
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
