import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
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
  return (
    <Card sx={{ width: "100%", display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
      {material.cover_image_url && (
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', sm: 200 }, 
            height: { xs: 200, sm: 'auto' },
            objectFit: 'cover'
          }}
          image={material.cover_image_url}
          alt={material.title}
        />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {material.title}
        </Typography>

        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          gutterBottom
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {material.description}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Chip
            icon={<AccessTimeIcon />}
            label={`${material.read_time_minutes} мин`}
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
