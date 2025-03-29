import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import { FaUserCircle, FaHome, FaClipboardList, FaCog, FaHistory } from "react-icons/fa";
import QRCode from "react-qr-code";
import { supabase } from "../supabaseClient";

const Home = ({ players }) => {
  const [displayName, setDisplayName] = useState("Guest");
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigation

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.user) {
        setDisplayName(data.user.user_metadata?.username || "Guest");
        setEmail(data.user.email);
      }
    };
    fetchUser();
  }, []);

  // 🔴 Logout Function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error);
    } else {
      window.location.href = "/"; // Redirect to homepage after logout
    }
  };

  // 🔹 Navigate to Game.jsx
  const handleStartGame = () => {
    navigate("/lobby"); // ✅ Redirects to Lobby instead of Game
};


  const qrLink = "https://tecryst-edu.vercel.app/";

  return (
    <div style={styles.container}>
      {/* 🔥 Sidebar (Transparent + Glow Effect on Hover) */}
      <div
        style={{
          ...styles.sidebar,
          boxShadow: isSidebarHovered ? "0 0 15px rgba(255, 255, 255, 0.4)" : "none",
        }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <h2 style={styles.sidebarHeading}>Dashboard</h2>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarItem}><FaHome /> Home</li>
          <li style={styles.sidebarItem}><FaClipboardList /> Score</li>
          <li style={styles.sidebarItem}><FaHistory /> Match History</li>
          <li style={styles.sidebarItem}><FaCog /> Settings</li>
        </ul>
      </div>

      {/* 🔹 Transparent Navbar with Logout Button */}
      <div style={styles.navbar}>
        <div
          style={styles.userInfo}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <FaUserCircle size={30} />
          {showDropdown && (
            <div style={styles.dropdown}>
              <p><strong>Username:</strong> {displayName}</p>
              <p><strong>Email:</strong> {email}</p>
              <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* 🏏 Center - Match Start Section */}
      <div style={styles.matchContainer}>
        <h1>🏏 PvP Cricket Quiz</h1>
        <p>Scan QR to Join & Play</p>
        <div style={styles.qrContainer}>
          <div style={styles.qrBox}>
            <QRCode value={qrLink} size={180} bgColor="#fff" fgColor="#000" />
          </div>
        </div>
        <p>Players Joined: {players.length}</p>
        <button style={styles.startButton} onClick={handleStartGame}>
          Start Match
        </button>
      </div>
    </div>
  );
};

// 🎨 Styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#111",
    color: "#fff",
    overflow: "hidden",
  },
  sidebar: {
    width: "250px",
    background: "rgba(0, 0, 0, 0.5)", // ✅ Transparent background
    color: "#fff",
    padding: "20px",
    height: "100vh",
    position: "fixed",
    left: "0",
    top: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    transition: "box-shadow 0.3s ease-in-out", // ✅ Smooth glow effect
  },
  sidebarHeading: {
    marginBottom: "20px",
  },
  sidebarList: {
    listStyle: "none",
    padding: "0",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    cursor: "pointer",
    transition: "0.3s",
    borderRadius: "5px",
  },
  navbar: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "15px",
    position: "absolute",
    top: "0",
    right: "0",
    background: "transparent",
    color: "#fff",
  },
  userInfo: {
    position: "relative",
    padding: "10px",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "40px",
    right: "0",
    background: "#222",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.2)",
    textAlign: "left",
    fontSize: "14px",
    whiteSpace: "nowrap",
    width: "180px",
  },
  logoutButton: {
    width: "100%",
    marginTop: "10px",
    padding: "8px",
    background: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  matchContainer: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "90vw",
    overflowX: "hidden",
    flexGrow: 1,
    marginLeft: "260px",
  },
  qrContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  qrBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#fff",
    border: "2px solid #000",
    borderRadius: "10px",
    width: "fit-content",
  },
  startButton: {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "18px",
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#000",
    fontWeight: "bold",
  },
};

export default Home;
