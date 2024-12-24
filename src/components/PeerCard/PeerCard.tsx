

import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { PeerData } from "../PeerSearch/PeerSearch";

interface PeerCardProps extends PeerData { }

export const PeerCard = ({ uuid, login, fullname, avatar_link }: PeerCardProps) => {
    return (
        <Link to={`/peer/${uuid}`} style={{ backgroundColor: "white", display: "block", padding: "15px", borderRadius: "5px" }}>
            <Avatar src={avatar_link} sx={{ width: 70, height: 70 }} className="mb-2" />
            <p>{login}</p>
            <p>{fullname}</p>
        </Link>
    );
}

export default PeerCard;
