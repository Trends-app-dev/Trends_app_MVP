import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Chat from '../Chat/Chat'
import Register from '../Register/Register'
import NavBar from '../NavBar/NavBar'
import style from './style.css'
import { useSelector } from 'react-redux'
import Inicio from '../Inicio/Inicio'

const Home = () => {
  const userName = useSelector(state => state.userName);
  //const location = useLocation();
  //console.log(location)
  return (
    <div className='flex h-[100vh] flex-col w-[100%] justify-center items-center bg-blue-100'>
      {
        userName === '' ? <Register /> : <Chat />
      }
      <NavBar />
      <Routes>
        <Route path={'/Trends_app_MVP/inicio'} element={<Inicio />} />
        {/* <Route path={'/Trends_app_MVP/chat'} element={<Chat />} /> */}
        {/* <Route path={'/Trends_app_MVP/register'} element={<Register />} /> */}
      </Routes>
    </div>
  )
}

export default Home