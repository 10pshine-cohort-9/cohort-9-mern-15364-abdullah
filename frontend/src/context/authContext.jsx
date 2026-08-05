import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getProfile } from "../api/authApi";

const AuthContext = createContext();
const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile(token);
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function register(data) {
    try {
      return await registerUser(data);
    } catch (error) {
      throw error;
    }
  }

  async function login(data) {
    try {
      const response = await loginUser(data);

      localStorage.setItem(TOKEN_KEY, response.data.token);

      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
