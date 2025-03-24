import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchUser(token);
  };

  const register = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ) => {
    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
      }),
    });

    if (!response.ok) {
      throw new Error("Nie udało się zarejestrować");
    }

    const data = await response.json();
    await login(data.access);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
