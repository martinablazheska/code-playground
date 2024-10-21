import React, { createContext, useState } from "react";
import axios, { AxiosError } from "axios";

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

//using sessionStorage for now

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(
    sessionStorage.getItem("username")
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
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("username", username);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response) {
          throw new Error(axiosError.response.data.error || "Login failed");
        }
      }
      throw new Error("An unexpected error occurred");
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
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("username", username);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response) {
          throw new Error(axiosError.response.data.error || "Login failed");
        }
      }
      throw new Error("An unexpected error occurred");
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
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
