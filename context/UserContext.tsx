import { createContext, useState } from "react";

import { IProvider, User } from "./types";

export interface UserContextValue {
  user: Partial<User>;
  updateUser: (userUpdate: Partial<User>) => void;
}

const UserContext = createContext<UserContextValue>({
  user: {},
  updateUser: () => {},
});

const UserProvider: IProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const updateUser = (userUpdate: Partial<User>) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userUpdate,
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
