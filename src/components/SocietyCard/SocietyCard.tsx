import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';

interface SocietyCardProps {
    uuid: string;
    name: string;
    description: string;
    is_private: boolean;
}

export const SocietyCard = ({ uuid, name, description, is_private }: SocietyCardProps) => {
    return (
        <Box style={{ backgroundColor: "white", display: "flex", flexGrow: 1, padding: "15px", borderRadius: "5px" }}>
            <Box display={"flex"} width={"100%"}>
                <Box mr={2}>
                    <Link to={`/society/${uuid}`}>
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            {name}
                            {is_private && <LockIcon fontSize="small" />}
                        </h3>
                        <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>
                    </Link>
                </Box>

                <Box ml={"auto"} display={"flex"} flexDirection={"column"} justifyContent={"flex-end"} gap={1}>
                    <Button 
                        style={{ minWidth: '140px', minHeight: '32px' }} 
                        variant="contained" 
                        size="small"
                    >
                        Присоединиться
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}; 