
import { Box, Grid2, TextField } from "@mui/material";
import Header from "../Header/Header";
import PeerCard from "../PeerCard/PeerCard";
import { useEffect, useState } from "react";
import axios from "axios";

export interface PeerData {
    uuid: string,
    login: string,
    fullname: string | null,
    avatar_link: string,
}

export const PeerSearch = () => {
    const [peers, setPeers] = useState<PeerData[]>([{
        uuid: "3e705253-852d-47e9-8e08-f0feecd05954",
        login: "doloresl",
        fullname: "Ольга Шашкова",
        avatar_link: ""
    },
    {
        uuid: "9eb9bfb4-d051-4952-99e9-95de0fa2a10d",
        login: "hakonoze",
        fullname: "Александр Балин",
        avatar_link: ""
    },
    {
        uuid: "3c4c29d1-fa2d-4736-b820-c0e69ac4e6be",
        login: "alcairem",
        fullname: "Даниил Лоскутов",
        avatar_link: ""
    },
    {
        uuid: "9831d05b-968a-4d11-a7dd-6369d9203671",
        login: "tangleto",
        fullname: "Егор Смоленов",
        avatar_link: ""
    },
    {
        uuid: "b5c64cdf-9f82-4a87-a830-c334ab350f07",
        login: "snapehas",
        fullname: "Георгий Канайкин",
        avatar_link: ""
    }]);

    useEffect(() => {
        // TODO: запрос рандомных пиров
        axios.get("/api/", {
            withCredentials: true,
        }).then(data => {
            console.log(data);
            setPeers(data.data)
        }).catch(err => {
            console.warn(err)
        })
    }, []);

    return (
        <div>
            <Header />

            <div className="min-h-screen bg-gray-100 flex flex-col items-center  p-6">
                <Box maxWidth={900} width={"100%"} >
                    <TextField fullWidth label="Поиск пиров" id="fullWidth" placeholder="Введите текст" margin="normal" />

                    <Grid2 container spacing={3} mt={3}>
                        {/* цикл */}
                        {peers.map(peer => (
                            <Grid2 key={peer.uuid} size={6}>
                                <PeerCard {...peer} />
                            </Grid2>
                        ))}
                    </Grid2>

                </Box>


            </div>
        </div>
    );
}

export default PeerSearch;
