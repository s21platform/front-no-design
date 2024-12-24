

import { Avatar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { PeerData } from "../PeerSearch/PeerSearch";

interface PeerCardProps extends PeerData { }

export const PeerCard = ({ uuid, login, fullname, avatar_link }: PeerCardProps) => {
    return (
        <Link to={`/peer/${uuid}`} style={{ backgroundColor: "white", display: "block", padding: "15px", borderRadius: "5px" }}>
            <Box display={"flex"}>
                <Box>
                    <Avatar src={avatar_link} sx={{ width: 70, height: 70 }} className="mb-2" />
                    <p>{login}</p>
                    <p>{fullname}</p>
                </Box>

                <Box ml={"auto"} display={"flex"} flexDirection={"column"} justifyContent={"flex-end"} gap={1}>
                    <Button variant="contained" size="small" onClick={() => window.alert("В разработке!")}>Написать</Button>
                    <Button variant="contained" size="small" onClick={() => window.alert("В разработке!")}>Подписаться</Button>
                </Box>
            </Box>
        </Link>
    );
}

export default PeerCard;
