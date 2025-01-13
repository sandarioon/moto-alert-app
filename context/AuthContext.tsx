import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<any | null>(null);

  const login = (token: string) => {
    setToken(token);
  };

  const logout = () => {
    setToken(null);
    AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
