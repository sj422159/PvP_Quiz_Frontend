import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Styled components remain the same
const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a4d38 0%, #061e28 100%);
  color: white;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -1px;
  background: linear-gradient(45deg, #00ff88, #00b4d8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(0, 255, 136, 0.3);
`;

const AuthBox = styled.div`
  background: rgba(10, 25, 30, 0.8);
  backdrop-filter: blur(16px);
  padding: 2.5rem;
  border-radius: 20px;
  width: 400px;
  border: 1px solid rgba(0, 255, 136, 0.1);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 180, 216, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 180, 216, 0.2);
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #00ff88, #00b4d8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
`;

const InputLabel = styled.label`
  position: absolute;
  left: 16px;
  top: -10px;
  background-color: #0a1920;
  padding: 0 8px;
  font-size: 14px;
  color: #00ff88;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background-color: rgba(10, 25, 30, 0.6);
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #00ff88;
    box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.15);
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 1rem;
  background: linear-gradient(45deg, #00b4d8, #00ff88);
  color: #051218;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 180, 216, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #9eacb3;
  font-size: 15px;
  cursor: pointer;
  margin-top: 1.5rem;
  padding: 5px 10px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: white;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #00b4d8, #00ff88);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

const LoadingSpinner = styled.div`
  margin: 40px auto;
  border: 4px solid rgba(0, 255, 136, 0.1);
  border-radius: 50%;
  border-top: 4px solid #00ff88;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function Auth({ setIsAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          navigate("/home");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(true);
          navigate("/home");
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          navigate("/");
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setIsAuthenticated]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { 
            data: { username: formData.username },
            // Persist the session data in localStorage
            // This will make the session survive browser refresh/restart
            emailRedirectTo: window.location.origin + '/home'
          },
        });
        
        if (error) {
          alert(error.message);
        } else {
          // No need to navigate here; the auth state listener will handle it
          alert("Sign-up successful! Check your email.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          alert(error.message);
        } else {
          // No need to navigate here; the auth state listener will handle it
          alert("Login successful!");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthContainer>
        <Logo>Tecryst</Logo>
        <LoadingSpinner />
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <Logo>Tecryst</Logo>
      <AuthBox>
        <Title>{isSignUp ? "Create Account" : "Welcome Back"}</Title>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <InputGroup>
              <InputLabel>Username</InputLabel>
              <Input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
              />
            </InputGroup>
          )}
          <InputGroup>
            <InputLabel>Email</InputLabel>
            <Input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>Password</InputLabel>
            <Input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </InputGroup>
          {isSignUp && (
            <InputGroup>
              <InputLabel>Confirm Password</InputLabel>
              <Input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
            </InputGroup>
          )}
          <Button type="submit">
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>
        <LinkButton onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Create one"}
        </LinkButton>
      </AuthBox>
      <Footer>© {new Date().getFullYear()} Tecryst. All rights reserved.</Footer>
    </AuthContainer>
  );
}