import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Chat from '../Chat/Chat'
import Register from '../Register/Register'
import NavBar from '../NavBar/NavBar'

const Home = () => {
  const location = useLocation();
  //console.log(location)
  return (
    <div className='flex border-2 border-red-700 w-full h-[100vh] justify-center items-center'>
      {
        location.pathname === '/Trends_app_MVP' && <Register />
      }
      <Routes>
        <Route path={'/Trends_app_MVP/chat'} element={<Chat />} />
        <Route path={'/Trends_app_MVP/register'} element={<Register />} />
      </Routes>
    </div>
  )
}

export default Home