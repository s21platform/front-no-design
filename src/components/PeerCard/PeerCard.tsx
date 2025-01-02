

import { Avatar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { PeerData } from "../PeerSearch/PeerSearch";
import PeerSubscriptionButton from "../PeerSubscriptionButton/PeerSubscriptionButton";

interface PeerCardProps extends PeerData { }

export const PeerCard = ({ uuid, nickname, name, surname, avatar_link, isFriend }: PeerCardProps) => {
    return (
        <Box style={{ backgroundColor: "white", display: "flex", flexGrow: 1, padding: "15px", borderRadius: "5px" }}>
            <Box display={"flex"} width={"100%"}>
                <Box mr={2}>
                    <Link to={`/peer/${uuid}`}>
                        <Avatar src={avatar_link} sx={{ width: 70, height: 70 }} className="mb-2" />
                        <p>{nickname}</p>
                        <p>{`${name} ${surname}`}</p>
                    </Link>
                </Box>

                <Box ml={"auto"} display={"flex"} flexDirection={"column"} justifyContent={"flex-end"} gap={1}>
                    <Button style={{ minWidth: '140px', minHeight: '32px' }} variant="contained" size="small" onClick={() => window.alert("В разработке!")} disabled>Написать</Button>

                    <PeerSubscriptionButton isActive={isFriend} peerId={uuid} />
                </Box>
            </Box>
        </Box>
    );
}

export default PeerCard;
