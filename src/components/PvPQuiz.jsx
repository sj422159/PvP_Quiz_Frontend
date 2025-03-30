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

    // Add this inside your useEffect
socket.on("scoresUpdate", (updatedPlayers) => {
  setScores(updatedPlayers);
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
        "Which Hogwarts founder valued bravery above all else?",
        "What magical creature guards the entrance to the Headmaster's office?",
        "Which Hogwarts house has a badger as its symbol?",
      ];
      socket.emit("sendQuestions", { roomId, questions: sampleQuestions });
    }
  };

  const handleAnswer = (selected) => {
    socket.emit("submitAnswer", { roomId, playerId, answer: selected });

    socket.emit("updateScore", { roomId, playerId, score: selected === "A" ? 10 : 0 });

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

  // Hogwarts theme styles
  const backgroundStyle = {
    backgroundColor: "#050D07",
    backgroundImage: "radial-gradient(#0A1A10 15%, transparent 16%), radial-gradient(#0A1A10 15%, transparent 16%)",
    backgroundSize: "60px 60px",
    backgroundPosition: "0 0, 30px 30px",
    minHeight: "100vh",
    padding: "20px",
    color: "#ACDCB6",
    fontFamily: "'Luminari', 'Harry P', fantasy",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };

  const buttonStyle = {
    margin: "10px",
    padding: "12px 20px",
    backgroundColor: "#1A472A",
    color: "#ACDCB6", 
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const containerStyle = {
    background: "rgba(10, 26, 16, 0.9)",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "800px",
    width: "100%",
    boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
    border: "1px solid #2D4F33",
    textAlign: "center"
  };

  return (
    <div style={backgroundStyle}>
      <motion.h1
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#4CAF50",
          textShadow: "2px 2px 4px #000000",
          margin: "20px 0"
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🏰 Hogwarts Quiz Challenge
      </motion.h1>

      {!roomId ? (
        <div className="room-selection" style={containerStyle}>
          <button className="option-btn" style={buttonStyle} onClick={createRoom}>
            Create Chamber
          </button>
          <input
            type="text"
            placeholder="Enter Chamber ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            style={{
              margin: "10px",
              padding: "12px",
              width: "80%",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #2D4F33",
              backgroundColor: "#050D07",
              color: "#ACDCB6",
            }}
          />
          <button className="option-btn" style={buttonStyle} onClick={joinRoom}>
            Join Chamber
          </button>
        </div>
      ) : (
        <div style={containerStyle}>
          <h2 style={{color: "#ACDCB6"}}>Chamber ID: {roomId}</h2>
          <h3 style={{
            color: "#ACDCB6", 
            backgroundColor: "#1A472A",
            padding: "8px 16px",
            borderRadius: "20px",
            display: "inline-block",
          }}>
            Wizards: {players.length}
          </h3>
          
          <ul style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            margin: "20px 0"
          }}>
            {players.map((p) => (
              <li key={p.id} style={{
                padding: "10px 15px",
                backgroundColor: "#1A472A",
                color: "#ACDCB6",
                borderRadius: "5px",
                border: "1px solid #4CAF50"
              }}>
                {p.name}
              </li>
            ))}
          </ul>

          {!gameStarted ? (
            <button
              style={{
                ...buttonStyle,
                backgroundColor: players.length < 2 ? "#1A472A80" : "#1A472A",
                cursor: players.length < 2 ? "not-allowed" : "pointer",
              }}
              onClick={startGame}
              disabled={players.length < 2}
            >
              {players.length < 2 ? "Waiting for Wizards..." : "Begin Challenge"}
            </button>
          ) : !gameOver ? (
            <>
              <h2 style={{
                fontSize: "24px",
                backgroundColor: "#1A472A",
                color: "#ACDCB6",
                padding: "15px",
                borderRadius: "5px",
                margin: "20px 0"
              }}>
                Q{currentQuestionIndex + 1}. {questions[currentQuestionIndex]}
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
                margin: "20px 0"
              }}>
                {["A", "B", "C", "D"].map((opt) => (
                  <button
                    key={opt}
                    style={buttonStyle}
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Modal for Leaderboard */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              style={{
                backgroundColor: "rgba(10, 26, 16, 0.95)",
                padding: "30px",
                borderRadius: "10px",
                maxWidth: "600px",
                width: "90%",
                boxShadow: "0 8px 16px rgba(0,0,0,0.8)",
                border: "2px solid #4CAF50",
                textAlign: "center"
              }}
            >
              <h2 style={{ 
                fontSize: "32px", 
                color: "#4CAF50", 
                marginBottom: "20px"
              }}>
                🏆 Challenge Complete - Leaderboard
              </h2>
              
              {scores.length > 0 ? (
  scores
    .sort((a, b) => ((b.score || 0) - (a.score || 0)))
    .map((player, index) => (
      <p key={index} style={{
        margin: "10px 0",
        padding: "15px",
        backgroundColor: "#1A472A",
        color: "#ACDCB6",
        borderRadius: "5px",
        border: "1px solid #4CAF50",
        textAlign: "left"
      }}>
        {index + 1}. {player.name || "Unknown"} - Score: {player.score || 0}
      </p>
    ))
) : (
  <p>No scores available</p>
)}
              
              <button
                style={{...buttonStyle, marginTop: "20px"}}
                onClick={() => window.location.reload()}
              >
                New Challenge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PvPQuiz;