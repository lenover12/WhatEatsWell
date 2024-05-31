import { useContext, useEffect } from "react";
import { UserContext } from "../../context/user.context";

export default function Dashboard() {
  const { user, fetchUserProfile } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  return (
    <div>
      {user ? (
        <div>Welcome, {user.username}!</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
