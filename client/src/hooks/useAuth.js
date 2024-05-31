import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      // encapsulate all logout logic including navigation
      navigate("/");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return { user, logout };
}
