import React from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Box, useTheme } from "@mui/material";

// Default styles for the mantine editor
import "@blocknote/mantine/style.css";
// Include the included Inter font
import "@blocknote/core/fonts/inter.css";

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onChange }) => {
  const theme = useTheme();
  
  // Безопасная обработка initialContent
  const getInitialContent = () => {
    if (!initialContent) return undefined;
    try {
      return JSON.parse(initialContent);
    } catch {
      return undefined;
    }
  };
  
  const editor = useCreateBlockNote({
    initialContent: getInitialContent(),
  });

  // Обработчик изменений в редакторе
  React.useEffect(() => {
    if (onChange) {
      const unsubscribe = editor.onChange(() => {
        const saveData = JSON.stringify(editor.document);
        onChange(saveData);
      });
      return () => unsubscribe?.();
    }
  }, [editor, onChange]);

  return (
    <Box sx={{ 
      width: "100%",
      height: "100%",
      minHeight: "500px",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 0,
      overflow: "hidden",
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
      '& .bn-container': {
        border: 'none',
        height: '100%',
        minHeight: '500px',
        backgroundColor: 'inherit'
      },
      '& .bn-editor': {
        backgroundColor: 'inherit',
        height: '100%'
      }
    }}>
      <BlockNoteView 
        editor={editor}
        theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
      />
    </Box>
  );
};

export default Editor;