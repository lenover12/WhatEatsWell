
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to='/'>Home</Link>
      {!user && <Link to='/register'>Register</Link>}
      {!user && <Link to='/login'>Login</Link>}
      {user && <Link to='/dashboard'>Dashboard</Link>}
      {user && <Link to='/search'>Search</Link>}
      {user && <Link to='/myfood'>My Food</Link>}
      {user && <button onClick={logout}>Logout</button>}
    </nav>
  )
}
