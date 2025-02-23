import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IProvider } from "./types";
import { AUTH_TOKEN_KEY } from "./constants";

export interface AuthContextValue {
  authToken: string;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  authToken: "",
  login: () => {},
  logout: () => {},
});

const AuthProvider: IProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState<string>("");

  const login = (token: string) => {
    setAuthToken(token);
  };

  const logout = () => {
    setAuthToken("");
    AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
