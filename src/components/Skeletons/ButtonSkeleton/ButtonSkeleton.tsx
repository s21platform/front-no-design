import { Skeleton } from "@mui/material";

export const ButtonSkeleton = () => {
    return (
        <div>
            <Skeleton variant={"text"} sx={{ fontSize: '1rem' }} width={140} height={65} animation="wave" />
        </div>
    )
}

export default ButtonSkeleton
