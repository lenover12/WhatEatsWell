import { useContext } from "react";
import { UserContext } from "../../context/user.context";

export default function Dashboard() {
  const {user} = useContext(UserContext)
  return(
    <div>
      <h1>Dashboard</h1>
      {!!user && (<h2>Welcome {user.username}!</h2>)}
    </div>
  )
}
