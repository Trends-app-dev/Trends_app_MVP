import React from 'react'
import { useSelector } from 'react-redux';
import Register from '../Register/Register';
import Chat from '../Chat/Chat';
import Inicio from '../Inicio/Inicio';

const Home = () => {
  const userName = useSelector(state => state.userName);
  return (
    <div className='flex w-full h-[calc(100vh-80px)] justify-center'>Soy HOME

    </div>
  )
}

export default Home