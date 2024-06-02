
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to='/'>Home</Link>
      {!user && <Link to='/register'>Register</Link>}
      {!user && <Link to='/login'>Login</Link>}
      {user && <button onClick={logout}>Logout</button>}
    </nav>
  )
}
