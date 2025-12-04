import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("evcharge_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (nickname) => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    const newUser = { id: trimmed, name: trimmed };
    setUser(newUser);
    localStorage.setItem("evcharge_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("evcharge_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
