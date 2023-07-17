import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3007');

const Chat = () => {
  const [saludoServer, setSaludoServer] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  // Capturar el mensage en mi estado local
  const handleChange = (event) => {
    const { value } = event.target;
    setMessage(value);
    //console.log(message);
  }

  // Enviando evento al servidor socket
  const handleSubmit = (event) => {
    event.preventDefault();
    setMessages([...messages, {message, from: "Me"}]);
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on('saludo server', data => {
      setSaludoServer(data);
    });
    socket.on("message", receiveMessage);
    return () => {socket.off("message", receiveMessage)};
  },[]);

  useEffect(() => {
    // Controlar el scroll para mejorar experiencia de usuario
    const messageContainer = messagesRef.current;
    messageContainer.scrollTop = messageContainer.scrollHeight
  },[messages])

  // Guardar todos los mensajes para renderizar
  const receiveMessage = message => {
    setMessages(state => [...state, message])
  }

  return (
    <div className='h-full flex flex-col items-center justify-start'>
      <h1 className='font-bold my-2'>¡Bienvenido a mi Chat!</h1>
      <h2 className='my-2'>{saludoServer}</h2>
      <form onSubmit={handleSubmit }
        className='text-white p-10 flex-col w-9/12 bg-blue-500 rounded-lg flex'
      >
        <ul ref={messagesRef} className='h-96 w-full p-2 flex flex-col  overflow-y-auto scroll-px-1'>
          {
            messages.map((message, index) => (
              <li key={index}
                className={`my-2 p-2 table text-sm min-w-auto max-w-3/4 rounded-md ${message.from === "Me" ? "bg-blue-200 text-blue-900 ml-auto": "bg-blue-950 mr-auto"} `}
              >
                <span className='text-xs text-slate-500 flex justify-start'>{message.from}</span>
                <span className='text-md  flex text-justify'>{message.message}</span>
              </li>
            ))
          }
        </ul>
        <div className='flex gap-2'>
          <input type="text" onChange={handleChange} placeholder='write your message' name='message' value={message}
            className='border-2 border-zinc-500 p-2 w-full text-black rounded-lg'
          />
        </div>
      </form>
    </div>
  )
}

export default Chat