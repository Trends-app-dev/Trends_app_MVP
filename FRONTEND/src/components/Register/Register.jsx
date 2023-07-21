import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserName } from '../../redux/action';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [auxUsername, setAuxUsername] = useState('');
  const userName = useSelector(state => state.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = event => {
    const { value } = event.target;
    setAuxUsername(value)
  };
  const register = event => {
    event.preventDefault();
    if(auxUsername === '' ){
      openModal();
      setMessage('Debe ingresar un Username')
    } else {
      dispatch(setUserName(auxUsername));
      navigate('/Trends_app_MVP/chat');
    }
  };
  
  const openModal = () => { setIsModalOpen(true) };
  const closeModal = () => {
    setIsModalOpen(false)
    setMessage('');
  };

  return (
    <div className='flex h-full w-full justify-center items-center'>
      <div className='flex h-56 w-96 flex-col bg-blue-400 justify-center items-center rounded-lg border-blue-950'>
        <h1 className='flex text-lg font-semibold my-2 '>Registrate para entrar al Chat</h1>
        <div className='flex flex-col w-4/5 justify-center items-center'>
          <h2 className='m-2'>Username</h2>
          <input
            type="text"
            placeholder='write a username'
            onChange={handleChange}
            className='border-2 border-zinc-500  p-2 w-full text-black rounded-lg'
          />
          <button
            onClick={register}
            className='flex bg-blue-600 p-2 my-2 w-min rounded-lg text-blue-100 justify-center items-end'
          >Registrarse</button>
        </div>
        <div>
            {
              isModalOpen && (
                <div className='flex h-full w-full fixed border-2 bg-zinc-900/90 inset-y-0 inset-x-0 items-center justify-center'>
                    <div className='bg-white flex flex-col border-2 justify-center items-center p-20 w-auto h-28 rounded-lg'>
                        <h1 className='text-blue-950 my-2'>{message}</h1>
                    <button onClick={closeModal} className='rounded-lg my-2 p-3 text-blue-100 bg-blue-600 w-min ' >Cerrar</button>
                    </div>
                </div>
            )}
          </div>
      </div>
    </div>
  )
}

export default Register