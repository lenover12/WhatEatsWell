import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

//wrap entire application in a provider
//send state down the entire application
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get("/profile");
      setUser(data);
    } catch (error) {
      console.error("Failed to set user", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}
