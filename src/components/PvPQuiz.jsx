import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import "./Quiz.css";

const socket = io("https://pvp-quiz-backend.onrender.com");

const PvPQuiz = () => {
  const [roomId, setRoomId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState([]);
  const [roomInput, setRoomInput] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setPlayerId(socket.id);
    });

    socket.on("playersUpdate", (playerList) => {
      setPlayers(playerList);
    });

    socket.on("startQuiz", () => {
      setGameStarted(true);
    });

    socket.on("quizQuestions", (qs) => {
      setQuestions(qs);
      setCurrentQuestionIndex(0);
    });

    socket.on("showLeaderboard", (playerList) => {
      setScores(playerList);
      setGameOver(true);
      setShowModal(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = async () => {
    const res = await fetch("https://pvp-quiz-backend.onrender.com/createroom", {
      method: "POST",
    });
    const data = await res.json();
    setRoomId(data.roomId);
    socket.emit("joinRoom", { roomId: data.roomId, playerName: "Player-" + data.roomId });
  };

  const joinRoom = () => {
    if (roomInput.trim()) {
      setRoomId(roomInput.trim());
      socket.emit("joinRoom", { roomId: roomInput.trim(), playerName: "Player-" + roomInput.trim() });
    }
  };

  const startGame = () => {
    if (players.length >= 2) {
      socket.emit("startGame", { roomId });
      const sampleQuestions = [
        "What is LBW in cricket?",
        "How many players in a cricket team?",
        "Which country won the first World Cup?",
      ];
      socket.emit("sendQuestions", { roomId, questions: sampleQuestions });
    }
  };

  const handleAnswer = (selected) => {
    socket.emit("submitAnswer", { roomId, playerId, answer: selected });

    if (selected === "A") {
      socket.emit("updateScore", { roomId, playerId, runs: 6, wickets: 0 });
    } else {
      socket.emit("updateScore", { roomId, playerId, runs: 0, wickets: 1 });
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
      }, 1000);
    } else {
      setTimeout(() => {
        socket.emit("endGame", { roomId });
      }, 1000);
    }
  };

  return (
    <div className="quiz-container">
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🏏 PvP Cricket Quiz
      </motion.h1>

      {!roomId ? (
        <div className="room-selection">
          <button className="option-btn" onClick={createRoom}>
            Create Room
          </button>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
          />
          <button className="option-btn" onClick={joinRoom}>
            Join Room
          </button>
        </div>
      ) : (
        <>
          <h2>Room ID: {roomId}</h2>
          <h3>Players: {players.length}</h3>
          <ul>
            {players.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>

          {!gameStarted ? (
            <button
              className="start-btn"
              onClick={startGame}
              disabled={players.length < 2}
            >
              {players.length < 2 ? "Waiting for Players..." : "Start Game"}
            </button>
          ) : !gameOver ? (
            <>
              <h2 className="question">
                Q{currentQuestionIndex + 1}. {questions[currentQuestionIndex]}
              </h2>
              <div className="options">
                {["A", "B", "C", "D"].map((opt) => (
                  <button
                    key={opt}
                    className="option-btn"
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </>
      )}

      {/* 🏆 Modal for Leaderboard */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              <h2>🏆 Match Over - Leaderboard</h2>
              {scores
                .sort((a, b) => b.runs - a.runs)
                .map((player, index) => (
                  <p key={player.id}>
                    {index + 1}. {player.name} - Runs: {player.runs} | Wickets:{" "}
                    {player.wickets}
                  </p>
                ))}
              <button
                className="option-btn"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PvPQuiz;
