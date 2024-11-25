import {Skeleton} from "@mui/material";

export const ProfileSkeleton = () => {
    return (
        <div style={{
            marginBottom: "10px"
        }}>
            <Skeleton variant={"text"} sx={{ fontSize: '1rem' }} width={300} animation="wave"/>
            <Skeleton variant={"rounded"} width={210} height={60} animation="wave" style={{
                marginBottom: '5px',
            }}/>
            <Skeleton variant={"rounded"} width={210} height={60} animation="wave"/>
        </div>
    )
}

export default ProfileSkeleton;