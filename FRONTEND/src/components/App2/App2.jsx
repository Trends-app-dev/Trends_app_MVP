import React from 'react'
import { Route, Routes, useLocation, useRoutes } from 'react-router-dom'
import Chat from '../Chat/Chat'
import Register from '../Register/Register'
import NavBar from '../NavBar/NavBar'
import style from './style.css'
import { useSelector } from 'react-redux'
import Inicio from '../Inicio/Inicio'
import Home from '../Home/Home'
import NotFound from '../NotFound/NotFound'
import Layout from '../Layout/Layout'


const App2 = () => {

  const userName = useSelector(state => state.userName);
  const isMinimized = useSelector(state => state.isMinimized);
  //const location = useLocation();
  //console.log(location)
 
  return (
    <div className='flex h-[calc(100vh-72px)] mt-[72px] top-[72px] flex-col w-[100%] justify-center items-center bg-blue-100'>
      <NavBar />
      {
        userName === '' ? <Register /> : <Chat />
      }
      <Routes>
        <Route path={'/Trends_app_MVP/inicio'} element={<Inicio />} />
        <Route path={'/Trends_app_MVP/'} element={<Home />} />
        <Route path={'/Trends_app_MVP/*'} element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App2