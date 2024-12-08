import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Loader from "../Loader/Loader";
import AvatarSkeleton from "../Skeletons/AvatarSkeleton/AvatarSkeleton";
import Avatar from "@mui/material/Avatar"
import {Button} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import EditIcon from '@mui/icons-material/Edit';

interface AvatarPeerUploaderProps {
    initialAvatarUrl: string;
}

const AvatarPeerBlock: React.FC<AvatarPeerUploaderProps> = ({ initialAvatarUrl }) => {
    const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl);

    useEffect(() => {
        setAvatarUrl(initialAvatarUrl);
    }, [initialAvatarUrl]);

    return (
        <div className="flex flex-col items-center p-2">
            {avatarUrl === "" ? <AvatarSkeleton/> :
                <Avatar src={avatarUrl} sx={{ width: 120, height: 120 }} className={"mb-2"} />
            }
        </div>
    );
};

export default AvatarPeerBlock;
