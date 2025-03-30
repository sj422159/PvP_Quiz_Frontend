import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaClipboardList, FaCog, FaHistory, FaQuestionCircle, FaGraduationCap } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const Home = ({ players }) => {
  const [displayName, setDisplayName] = useState("Guest");
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error);
    } else {
      window.location.href = "/";
    }
  };

  const handleStartQuiz = () => {
    navigate("/PVPQuiz");
  };

  const handleExploreClasses = () => {
    window.location.href = "http://localhost:5173/";
  };

  return (
    <div style={styles.container}>
      {/* Sidebar with Hogwarts styling */}
      <div
        style={{
          ...styles.sidebar,
          boxShadow: isSidebarHovered ? "0 0 15px rgba(255, 215, 0, 0.7)" : "none",
        }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <h2 style={styles.sidebarHeading}>Hogwarts Dashboard</h2>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarItem}><FaHome /> Common Room</li>
          <li style={styles.sidebarItem}><FaClipboardList /> House Points</li>
          <li style={styles.sidebarItem}><FaHistory /> Spell History</li>
          <li style={styles.sidebarItem}><FaCog /> Wand Settings</li>
        </ul>
      </div>

      {/* Navbar with Hogwarts styling */}
      <div style={styles.navbar}>
        <div
          style={styles.userInfo}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <FaUserCircle size={30} />
          {showDropdown && (
            <div style={styles.dropdown}>
              <p><strong>Wizard Name:</strong> {displayName}</p>
              <p><strong>Owl Post:</strong> {email}</p>
              <button style={styles.logoutButton} onClick={handleLogout}>Apparate Out</button>
            </div>
          )}
        </div>
      </div>

      {/* Main content with Hogwarts styling */}
      <div style={styles.matchContainer}>
        <h1 style={styles.mainTitle}>🏰 Hogwarts Trivia Challenge</h1>
        <p style={styles.subtitle}>Enter the Wizarding World</p>
        
        <div style={styles.frameContainer}>
          {/* Left Frame - Start Quiz */}
          <div style={styles.frame}>
            <div style={styles.frameIcon}><FaQuestionCircle size={40} /></div>
            <h3 style={styles.frameTitle}>Start Quiz</h3>
            <p style={styles.frameDescription}>
              Test your knowledge of the wizarding world with challenging trivia questions
            </p>
            <button style={styles.frameButton} onClick={handleStartQuiz}>
              Enter Challenge
            </button>
          </div>
          
          {/* Right Frame - Explore Classes */}
          <div style={styles.frame}>
            <div style={styles.frameIcon}><FaGraduationCap size={40} /></div>
            <h3 style={styles.frameTitle}>Explore Classes</h3>
            <p style={styles.frameDescription}>
              Discover magical subjects and learn spells from Hogwarts professors
            </p>
            <button style={styles.frameButton} onClick={handleExploreClasses}>
              Enter Classroom
            </button>
          </div>
          <div style={styles.frame}>
  <div style={styles.frameIcon}><FaGraduationCap size={40} /></div>
  <h3 style={styles.frameTitle}>Doubt Solver</h3>
  <p style={styles.frameDescription}>
    Get your magical doubts resolved by experienced wizards and professors. 
    Ask questions and find answers to enhance your wizarding knowledge.
  </p>
  <button
    style={styles.frameButton}
    onClick={() => {
      window.location.href = "https://doubt-front-alpha.vercel.app/";
    }}
  >
    Solve Doubts
  </button>
</div>

        </div>
        
        {/* <div style={styles.wizardCounter}>
          <p>Wizards Joined: {players.length}</p>
        </div> */}
      </div>
    </div>
  );
};

// Hogwarts-themed styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0E1A40", // Dark blue like Hogwarts night sky
    color: "#F8F0E3", // Parchment color for text
    overflow: "hidden",
    fontFamily: "'Cinzel', serif",
    backgroundImage: "url('/subtle-hogwarts-pattern.png')",
    backgroundSize: "200px",
    backgroundRepeat: "repeat",
  },
  sidebar: {
    width: "250px",
    background: "rgba(60, 16, 83, 0.9)", // Deep purple with transparency
    color: "#F8F0E3",
    padding: "20px",
    height: "100vh",
    position: "fixed",
    left: "0",
    top: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    transition: "box-shadow 0.3s ease-in-out",
    borderRight: "1px solid rgba(255, 215, 0, 0.3)", // Gold border
    zIndex: 100,
  },
  sidebarHeading: {
    marginBottom: "20px",
    color: "#FFD700", // Gold color for heading
    fontFamily: "'Cinzel', serif",
  },
  sidebarList: {
    listStyle: "none",
    padding: "0",
    width: "100%",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    cursor: "pointer",
    transition: "0.3s",
    borderRadius: "5px",
    marginBottom: "5px",
    color: "#F8F0E3", // Parchment color
    "&:hover": {
      backgroundColor: "rgba(255, 215, 0, 0.2)",
    },
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
    color: "#F8F0E3",
    zIndex: 50,
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
    background: "rgba(60, 16, 83, 0.95)", // Deep purple
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(255, 215, 0, 0.3)", // Gold shadow
    textAlign: "left",
    fontSize: "14px",
    whiteSpace: "nowrap",
    width: "200px",
    border: "1px solid #FFD700", // Gold border
    zIndex: 200,
  },
  logoutButton: {
    width: "100%",
    marginTop: "10px",
    padding: "8px",
    background: "#740001", // Gryffindor red
    color: "#F8F0E3",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  matchContainer: {
    textAlign: "center",
    padding: "40px 20px 20px 20px",
    flexGrow: 1,
    marginLeft: "250px",
    background: "rgba(14, 26, 64, 0.8)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mainTitle: {
    color: "#4CAF50", // Green color like in second screenshot
    fontSize: "2.5rem",
    marginBottom: "10px",
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
    fontFamily: "'Cinzel', serif",
  },
  subtitle: {
    color: "#F8F0E3", // Parchment color
    fontSize: "1.2rem",
    marginBottom: "40px",
  },
  frameContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    width: "100%",
    maxWidth: "900px",
    marginBottom: "30px",
  },
  frame: {
    width: "45%",
    background: "rgba(0, 20, 0, 0.7)",
    borderRadius: "10px",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #4CAF50",
    boxShadow: "0px 0px 10px rgba(76, 175, 80, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0px 5px 15px rgba(76, 175, 80, 0.5)",
    },
  },
  frameIcon: {
    color: "#4CAF50",
    marginBottom: "15px",
  },
  frameTitle: {
    color: "#4CAF50",
    fontSize: "1.5rem",
    marginBottom: "15px",
    fontFamily: "'Cinzel', serif",
  },
  frameDescription: {
    color: "#F8F0E3",
    marginBottom: "20px",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },
  frameButton: {
    background: "rgba(76, 175, 80, 0.8)",
    color: "#F8F0E3",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background 0.3s",
    marginTop: "auto",
    "&:hover": {
      background: "rgba(76, 175, 80, 1)",
    },
  },
  wizardCounter: {
    color: "#F8F0E3",
    fontSize: "1.1rem",
    marginBottom: "20px",
  },
};

export default Home;
