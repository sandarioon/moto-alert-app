import { router } from "expo-router";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IProvider } from "./types";
import { AUTH_TOKEN_KEY } from "./constants";

export interface AuthContextValue {
  authToken: string;
  updateAuthToken: (authToken: string) => void;
  removeAuthToken: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  authToken: "",
  updateAuthToken: () => {},
  removeAuthToken: () => {},
});

const AuthProvider: IProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState<string>("");

  const updateAuthToken = (authToken: string) => {
    setAuthToken(authToken);
    router.push("/(tabs)");
  };

  const removeAuthToken = () => {
    setAuthToken("");
    AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    router.push("/(auth)");
  };

  useEffect(() => {
    AsyncStorage.getItem(AUTH_TOKEN_KEY).then((authToken) => {
      console.log("Auth token is", authToken);
      setAuthToken(authToken || "");
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ authToken, updateAuthToken, removeAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
