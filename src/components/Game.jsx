import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Game = () => {
    const { roomId } = useParams();
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoom = async () => {
            const { data, error } = await supabase
                .from("rooms")
                .select("*")
                .eq("id", roomId)
                .single();

            if (error) {
                console.error("Error fetching room:", error);
                navigate("/lobby"); // Redirect if room doesn't exist
            } else {
                setPlayers([data.player1, data.player2]);
            }
        };
        fetchRoom();
    }, [roomId, navigate]);

    return (
        <div className="game-container">
            <h1>Multiplayer Quiz</h1>
            <p>Players: {players.join(" vs ")}</p>
            <button onClick={() => navigate("/lobby")}>Exit Game</button>
        </div>
    );
};

export default Game;
