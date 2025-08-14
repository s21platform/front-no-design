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
  
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  // Обработчик изменений в редакторе
  React.useEffect(() => {
    if (onChange) {
      editor.onEditorContentChange(() => {
        const saveData = JSON.stringify(editor.document);
        onChange(saveData);
      });
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
        style={{
          height: '100%',
          backgroundColor: 'inherit',
          '--bn-colors-editor-text': theme.palette.text.primary,
          '--bn-colors-editor-background': 'inherit',
          '--bn-colors-menu-background': theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f5f5',
          '--bn-colors-menu-text': theme.palette.text.primary,
          '--bn-colors-tooltip-background': theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f5f5',
          '--bn-colors-tooltip-text': theme.palette.text.primary,
          '--bn-colors-menu-divider': theme.palette.divider,
        } as React.CSSProperties}
      />
    </Box>
  );
};

export default Editor;