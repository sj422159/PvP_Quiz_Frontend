import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Lobby = ({ username }) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("rooms")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "rooms" }, (payload) => {
        console.log("Room updated:", payload.new);
        setRoom(payload.new); // Update room when a player joins
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleJoinGame = async () => {
    setLoading(true);

    let { data: room, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("status", "waiting")
      .order("id", { ascending: true }) // Get the oldest room
      .limit(1)
      .single();

    if (error || !room) {
      console.log("⚡ Creating a new room...");
      const { data, error: createError } = await supabase
        .from("rooms")
        .insert([{ 
          players: [{ name: username, wins: 0 }], 
          status: "waiting" 
        }])
        .select()
        .single();

      if (createError) {
        console.error("❌ Error creating room:", createError);
        setLoading(false);
        return;
      }
      setRoom(data);
    } else {
      console.log("✅ Joining existing room...");
      const updatedPlayers = [...room.players, { name: username, wins: 0 }];

      await supabase.from("rooms").update({ players: updatedPlayers }).eq("id", room.id);

      if (updatedPlayers.length >= 2) {
        console.log("🎮 Starting game!");
        await supabase.from("rooms").update({ status: "active" }).eq("id", room.id);
      }

      setRoom({ ...room, players: updatedPlayers });
    }
    setLoading(false);
  };

  return (
    <div className="lobby-container">
      <h1>QuizMaster</h1>

      {room ? (
        <div className="room-info">
          <h3>Waiting for players - {room.players.length}/4</h3>
          <div className="player-list">
            {room.players.map((player, index) => (
              <div key={index} className="player-card">
                <div className="player-avatar"></div>
                <p>{player.name}</p>
                <span>{player.wins} wins</span>
              </div>
            ))}
          </div>

          {room.players.length >= 2 ? (
            <button
              className="start-btn"
              onClick={() => {
                console.log("Game Start!");
                window.location.href = "/Quiz";
              }}
            >
              Start Game
            </button>
          ) : (
            <p>Waiting for more players...</p>
          )}
        </div>
      ) : (
        <button className="join-btn" onClick={handleJoinGame} disabled={loading}>
          {loading ? "Joining..." : "Join Game"}
        </button>
      )}
    </div>
  );
};

export default Lobby;
