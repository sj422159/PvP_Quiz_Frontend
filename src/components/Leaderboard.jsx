import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import supabase from "./supabaseClient"; // Ensure you have Supabase setup

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("player_scores")
        .select("email, total_score")
        .order("total_score", { ascending: false });
      
      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        setLeaderboard(data);
      }
    };
    
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#4CAF50" }}>🏆 Global Leaderboard</h1>
      <table style={{ margin: "auto", borderCollapse: "collapse", width: "80%" }}>
        <thead>
          <tr>
            <th style={{ padding: "10px", borderBottom: "2px solid #4CAF50" }}>Rank</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #4CAF50" }}>Player</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #4CAF50" }}>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.email} style={{ background: index === 0 ? "#FFD700" : "#FFF" }}>
              <td style={{ padding: "10px", borderBottom: "1px solid #DDD" }}>{index + 1}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #DDD" }}>{player.email}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #DDD" }}>{player.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
