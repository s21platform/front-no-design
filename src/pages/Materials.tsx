import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Stack
} from "@mui/material";
import Editor from "../components/Editor/Editor";

const Materials: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    // TODO: Добавить сохранение в бэкенд
    console.log("Saving:", { title, content });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создание материала
        </Typography>
        
        <Stack spacing={3}>
          <TextField
            label="Название материала"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Box>
            <Typography variant="h6" gutterBottom>
              Содержание
            </Typography>
            <Editor
              initialContent={content}
              onChange={setContent}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Materials;
