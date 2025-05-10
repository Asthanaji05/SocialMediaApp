import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Auto-login on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // ✅ Login function (Save to localStorage)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Logout function (Clear localStorage)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    // console.log("Fetching user...");
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get("/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          // console.log("User fetched:", response.data);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        }
      }
    };
  
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout , setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook for using auth
export const useAuth = () => {
  return useContext(AuthContext);
};
