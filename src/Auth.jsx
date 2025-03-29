import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Importing the CSS file

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Auth({ setIsAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { username: formData.username } },
      });
      if (error) alert(error.message);
      else {
        alert("Sign-up successful! Check your email.");
        setIsAuthenticated(true);
        navigate("/home");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) alert(error.message);
      else {
        alert("Login successful!");
        setIsAuthenticated(true);
        navigate("/home");
      }
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
  };

  const handleGuestUsername = async (e) => {
    e.preventDefault();
    const { data } = await supabase.from("users").select("username").eq("username", formData.username);
    if (data.length > 0) {
      alert("Username is already taken!");
      return;
    }
    alert(`Guest login successful with username: ${formData.username}`);
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {!isGuest ? (
          <>
            <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleAuth}>
              {isSignUp && (
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {isSignUp && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              )}
              <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="link-button">
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </>
        ) : (
          <>
            <h2>Enter Guest Username</h2>
            <form onSubmit={handleGuestUsername}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <button type="submit">Continue as Guest</button>
            </form>
            <button onClick={() => setIsGuest(false)} className="link-button">
              Back to Login
            </button>
          </>
        )}
      </div>
      {!isGuest && (
        <button onClick={handleGuestLogin} className="link-button">
          Login as Guest
        </button>
      )}
    </div>
  );
}
