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

  // nickname 대신 userData(객체)를 받도록 수정
  const login = (userData) => {
    if (!userData) return;
    
    // userData는 { userId, password, nickname } 전체가 들어옵니다.
    setUser(userData); 
    localStorage.setItem("evcharge_user", JSON.stringify(userData));
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
