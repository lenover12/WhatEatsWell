import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../src/components/Navbar'
import Home from '../src/pages/Home'
import Register from '../src/pages/Register'
import Login from '../src/pages/Login'
import axios from 'axios';
import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from '../context/user.context'
import Dashboard from './pages/Dashboard'
import MyFood from './pages/MyFood'
import Search from './pages/Search'

// port number defined in backend env
const port = 404;
axios.defaults.baseURL = `http://localhost:${port}`
axios.defaults.withCredentials = true

function App() {

  return (
    <UserContextProvider>
    <Navbar />
    <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/myfood' element={<MyFood />} />
      <Route path='/search' element={<Search />} />
    </Routes>
    </UserContextProvider>
  )
}

export default App
