import React, { createContext, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const authContext = createContext<AuthContextType | undefined>(
  undefined
);

//using localStorage for now

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      const { token } = response.data;
      setToken(token);
      setUsername(username);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });
      const { token } = response.data;
      setToken(token);
      setUsername(username);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const isAuthenticated = !!token;

  return (
    <authContext.Provider
      value={{ token, username, login, register, logout, isAuthenticated }}
    >
      {children}
    </authContext.Provider>
  );
};
