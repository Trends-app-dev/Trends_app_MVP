import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { setUserName } from '../../redux/action';
import { useNavigate } from 'react-router-dom';
//import scrollbar from './scrollbar.css?inline';
import scrollbar from './scrollbar.css';

const socket = io('http://localhost:3007');

const Chat = () => {
  // ======================================
  //const [socket, setSocket] = useState(null);
  // ======================================
  const [saludoServer, setSaludoServer] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesRef = useRef(null);
  const userName = useSelector(state => state.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //  console.log(messages)

  const toggleMinimize = (event) => {
    event.preventDefault();
    setIsMinimized(!isMinimized);
  };


  // Capturar el mensage en mi estado local
  const handleChange = (event) => {
    const { value } = event.target;
    setMessage(value);
    //console.log(message);
  }

  const handleKeyDow = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      if(message.trim() !== '')
        handleSubmit(event);
    }
  };

  // Formatear fecha
  const formatDate = (date) => {
    // Obtener el nombre del día de la semana
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const nombreDiaSemana = diasSemana[date.getDay()];
    // Obtener la hora y los minutos
    const hora = date.getHours();
    let minutos = date.getMinutes();
    minutos < 10 ? minutos=`0${minutos}`: minutos;
    // Concatenar fecha
    return `${nombreDiaSemana} ${hora}:${minutos}`;
  };

  const exitChat = (event) => {
    event.preventDefault();
    dispatch(setUserName(''));
    navigate('/Trends_app_MVP/register')
  };


  // Enviando evento al servidor socket
  const handleSubmit = (event) => {
    event.preventDefault();
    const fecha = formatDate(new Date());
    setMessages([...messages, {message, from: userName, fecha}]);
    socket.emit("message", {message, userName, fecha});
    setMessage("");
  };

  useEffect(() => {
    
    //setSocket(io("http://localhost:3007"));

    socket.on('saludo server', data => {
      setSaludoServer(data);
    });
    socket.on("message", receiveMessage);
    return () => {socket.off("message", receiveMessage)};
  },[]);

  useEffect(() => {
    socket.emit("newUser")
  },[socket]);

  useEffect(() => {
    // Controlar el scroll para mejorar experiencia de usuario
    const messageContainer = messagesRef.current;
    messageContainer.scrollTop = messageContainer.scrollHeight
  },[messages])

  // Guardar todos los mensajes para renderizar
  const receiveMessage = message => {
    setMessages(state => [...state, message])
  }

  //  className=' border-2 border-black flex  w-full container-chat mt-[70px]'
  return (
    <div className='flex border-2 border-indigo-600 mt-[70px] '>
      {
        !isMinimized ? (
          <div className='container-chat flex items-center justify-start border-2 border-green-600 px-2'>
            {/* MI USUARIO PANEL IZQUIERDO */}
            <div className='flex flex-col border-2 bg-white w-[390px] h-full p-2'>

              <div className='flex items-center gap-1 bg-slate-400'>
                <div className='flex w-7 h-7 rounded-full bg-gray-500'>
                  <img className='w-full h-full object-cover rounded-full' src='https://img.freepik.com/vector-premium/diseno-ilustracion-vector-personaje-estilo-anime-chica-joven-chica-anime-manga_147933-100.jpg?w=740' alt='' />
                </div>
                <h2 className='my-2'>{userName}</h2>
              </div>

            </div>
            {/* PANEL IZQUIERDO CUERPO DEL CHAT */}
            <div className='flex flex-col w-full p-2'>
              {/* ENCABEZADO */}
              <div className='flex items-center gap-1 bg-slate-500/20 w-full'>
                <div className='flex w-7 h-7 rounded-full bg-gray-500'>
                  <img className='w-full h-full object-cover rounded-full' src='https://i.blogs.es/944446/naruto-el-anime-original-regresa-con-cuatro-nuevos-episodios-por-el-20-aniversario-de-la-serie11/1366_2000.jpeg' alt='' />
                </div>
                <h2 className='my-2'>{userName}</h2>
              </div>
              <form onSubmit={handleSubmit }
                className='text-white p-2 flex-col w-full h-full flex bg-green-400'
              >
                {/* BOTON DE MINIMIZAR */}
                <button
                  onClick={toggleMinimize}
                  className='flex justify-center items-center border-l border-r h-5 w-5 bg-yellow-500 border-blue-950 rounded-md relative left-[620px] bottom-[5px]'
                ><h1 className='text-lg'>-</h1></button>

                <ul ref={messagesRef} className='h-40 w-full p-6 border-s border-e border-blue-950 rounded-lg flex flex-col  overflow-y-auto custom-scrollbar'>
                  {
                    messages.map((message, index) => (
                      <li key={index}
                        className={`my-1 p-2 table text-sm min-w-auto max-w-3/4 rounded-md
                          ${message.from === userName ? "bg-blue-200 text-blue-900 ml-auto": "bg-blue-950 mr-auto"}
                        `}>
                        <div className='flex items-center w-full gap-1'>
                          <div className='flex w-5 h-5 rounded-full bg-gray-500'>
                            <img className='w-full h-full object-cover rounded-full' src='https://img.freepik.com/vector-premium/diseno-ilustracion-vector-personaje-estilo-anime-chica-joven-chica-anime-manga_147933-100.jpg?w=740' alt='' />
                          </div>
                          <span className='text-xs text-slate-500 flex justify-start'>{message.from} {message.fecha}</span>
                        </div>
                        <span className='text-md  flex text-justify'>{message.message}</span>
                      </li>
                    ))
                  }
                </ul>
                <div className='flex bg-green-400 bottom-0 ap-2'>
                  <input
                    type="text"
                    onChange={handleChange}
                    onKeyDown={handleKeyDow}
                    autoComplete='off'
                    placeholder='write your message' name='message' value={message}
                    className='border-2 border-zinc-500 p-2 w-full text-black rounded-lg'
                  />
                  <button
                    onClick={exitChat}
                    type='button'
                    className='bg-blue-800 p-3 rounded-lg mx-2 hover:scale-110'
                  >Salir</button>
                </div>
              </form>

            </div>
          </div>
        ) :
        (
          <div className='flex justify-around cursor-pointer fixed items-center border-2 border-blue-950 rounded-md bottom-10 right-10 w-32 h-10'>
            <span className='font-bold'>Chat</span>
            <button
              onClick={toggleMinimize}
              className='flex justify-center items-center border-2 h-5 w-5 border-blue-950'
            ></button>
          </div>
        )
      }
    </div>
  )
}

export default Chat