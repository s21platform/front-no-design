import React, { useRef, useState } from "react";
import { Avatar, CircularProgress, Box } from "@mui/material";
import { ApiRoutes } from "../../lib/routes";
import api from "../../lib/api/api";

interface SocietyAvatarProps {
	currentUrl: string;
	societyUUID: string;
	canEdit: boolean;
	onChange: (newUrl: string) => void;
}

const SocietyAvatar: React.FC<SocietyAvatarProps> = ({
	currentUrl,
	societyUUID,
	canEdit,
	onChange
}) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [loading, setLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState(currentUrl);

	const handleAvatarClick = () => {
		if (canEdit) {
			fileInputRef.current?.click();
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("avatar", file);
		formData.append("filename", file.name);
		formData.append("societyUUID", societyUUID);

		setLoading(true);
		try {
			const response = await api.post(ApiRoutes.societyAvatar(), formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			});

			const newUrl = response.data.link;
			setAvatarUrl(newUrl);
			onChange(newUrl);
		} catch (error) {
			console.error("Ошибка при обновлении аватара", error);
			alert("Не удалось загрузить аватар");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ position: "relative", width: 120, height: 120 }}>
			<Avatar
				src={avatarUrl}
				onClick={handleAvatarClick}
				sx={{
					width: 120,
					height: 120,
					cursor: canEdit ? "pointer" : "default",
					opacity: loading ? 0.5 : 1,
					transition: "opacity 0.3s"
				}}
			/>
			{loading && (
				<CircularProgress
					size={30}
					sx={{
						position: "absolute",
						top: "calc(50% - 30px / 2)",
						left: "calc(50% - 30px / 2)",
					}}
				/>
			)}
			{canEdit && (
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					style={{ display: "none" }}
					onChange={handleFileChange}
					disabled={loading}
				/>
			)}
		</Box>
	);
};

export default SocietyAvatar;
