import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Home from "./components/Home";
import Game from "./components/Game";
import Lobby from "./components/Lobby"; 
import PvPQuiz from "./components/PvPQuiz"; // Import the Quiz component
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Howl } from "howler";

const socket = io("https://pvp-quiz-backend.onrender.com");
const startSound = new Howl({ src: ["/sounds/start.mp3"] });

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication

  useEffect(() => {
    socket.on("players", (playerList) => {
      setPlayers(playerList);
    });

    socket.on("startGame", () => {
      setGameStarted(true);
      startSound.play();
    });

    return () => {
      socket.off("players");
      socket.off("startGame");
    };
  }, []);

  const handleStart = () => {
    socket.emit("startGame");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/game/:roomId" element={isAuthenticated ? <Game /> : <Navigate to="/login" />} />
        <Route path="/lobby" element={isAuthenticated ? <Lobby /> : <Navigate to="/login" />} />
        <Route path="/PvPQuiz" element={isAuthenticated ? <PvPQuiz /> : <Navigate to="/login" />} />
        <Route path="/home" element={isAuthenticated ? <Home players={players} handleStart={handleStart} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
