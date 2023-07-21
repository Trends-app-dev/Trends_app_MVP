import React,  { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { setUserName } from '../../redux/action';
import { useLocation, useNavigate } from 'react-router-dom';
import adjuntarIcon from '../../assets/adjuntar.png';
import enviarIcon from '../../assets/enviar.png';
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] =useState('');
  const [preview, setPreview] = useState(false);
  const messagesRef = useRef(null);
  const fileInputRef = useRef(null);
  const userName = useSelector(state => state.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //  console.log(messages)

  // Capturar el mensage en mi estado local
  const handleChange = (event) => {
    const { value } = event.target;
    setMessage(value);
    //console.log(message);
  }
  // Función para evitar ejectuar formulario al dar enter y
  const handleKeyDow = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      message.trim() !== ''&& handleSubmit(event);
    }
  };

  const handleSubmitFile = (event) => {
    event.preventDefault();
    const fecha = formatDate(new Date());
    const file = {
      name: selectedFile?.name,
      size: selectedFile?.size,
      type: selectedFile?.type,
      lastModifiedDate: selectedFile?.lastModifiedDate,
      lastModified: selectedFile?.lastModified,
      data: selectedFile
    }
    setMessages([...messages, {message, from: userName, fecha, file}]);
    socket.emit("message", {message, userName, fecha, file});
    setMessage("");
    setSelectedFile(null);
    setPreview(false);
  };
  // Enviando evento al servidor socket
  const handleSubmit = (event) => {
    event.preventDefault();
    if(message !== '' ){
      const fecha = formatDate(new Date());
      setMessages([...messages, {message, from: userName, fecha}]);
      socket.emit("message", {message, userName, fecha});
      setMessage("");
      setPreview(false);
    }
  };
  // !Enviar el archivo al estado local
  const handleFilechange = (event) => {
    const file = event.target.files[0];
    if(file){
      console.log('file: ', file);
      setSelectedFile(file);
      setPreview(true);
      // Crear una URL local temporal para la vista previa del archivo
      setFilePreview(URL.createObjectURL(file));
    }
  };
  //!-----------------------------------
  // Función para cancelar el envio del archivo adjunto
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setFilePreview('');
    setPreview(false);
    if(fileInputRef.current){
      fileInputRef.current.value='';
    }
  };
  // Función para descargar el archivo adjunto
  const downloadFile = (event, fileData) => {
    event.preventDefault();
    const {name, size, type, lastModifiedDate, lastModified, data} = fileData;
    const blob = new Blob([data], {type});
    // Establecer el nombre del archivo de descarga (nombre con el que se guardará en el disco)
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  //!---------------------------------------------
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

  // Función para cambiar el estado de isMinimized
  const toggleMinimize = (event) => {
    event.preventDefault();
    setIsMinimized(!isMinimized);
    if(!isMinimized) navigate('/Trends_app_MVP/chat');
  };

  const exitChat = (event) => {
    event.preventDefault();
    dispatch(setUserName(''));
    //navigate('/Trends_app_MVP/register')
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

  
  //!----------------
  useEffect(() => {
    console.log(filePreview);
    console.log(selectedFile);
    console.log('preview: ', preview)
  },[filePreview, selectedFile, preview]);



  useEffect(() => {
    // Controlar el scroll para mejorar experiencia de usuario
    const messageContainer = messagesRef.current;
    messageContainer.scrollTop = messageContainer.scrollHeight
    console.log(messages);
  },[messages])

  // Función para convertir un ArrayBuffer a base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  // Guardar todos los mensajes para renderizar
  const receiveMessage = message => {
    // if(message.file && message.file.data instanceof ArrayBuffer){
    //   const base64File = arrayBufferToBase64(message.file.data);
    //   setMessages(state => [...state, {...message, file:{...message.file, data: base64File}}]);
    // }
    setMessages(state => [...state, message]);
  }

  useEffect(() => {
    location.pathname !== '/Trends_app_MVP/chat'
      && setIsMinimized(true);
  },[location]);

  return (
    <div className={`flex w-[100%] border-2 mt-[70px] ${!userName && "hidden"}`}>
      {
        !isMinimized ? (
          <div className='container-chat w-[100%] flex items-center justify-start border-2'>

            {/* MI USUARIO PANEL IZQUIERDO */}
            <div className='flex flex-col bg-white border-2 border-slate-400 w-[30%] h-full '>
              {/* ENCABEZADO IZQUIERDO */}
              <div className='flex items-center left-[4px] top-[70] gap-3 bg-slate-400 w-[29.3%] h-[50px] fixed'>
                <div className='flex w-7 h-7 ml-[5px] rounded-full bg-gray-500'>
                  <img className='w-full h-full object-cover rounded-full' src='https://img.freepik.com/vector-premium/diseno-ilustracion-vector-personaje-estilo-anime-chica-joven-chica-anime-manga_147933-100.jpg?w=740' alt='' />
                </div>
                <h2 className='my-2'>{userName}</h2>
              </div>
            </div>

            {/* PANEL DERECHO CUERPO DEL CHAT */}
            <div className='flex flex-col w-[70%] h-full pb-[0px] border-2 border-slate-500'>

              {/* ENCABEZADO DERECHO */}
              <div className='flex justify-between items-center pr-[15px] gap-1 bg-slate-500 w-[69%] h-[50px] fixed'>
                <div className='flex items-center  ml-[5px] gap-3'>
                  <div className='flex w-7 h-7 rounded-full bg-gray-500'>
                    <img className='w-full h-full object-cover rounded-full' src='https://i.blogs.es/944446/naruto-el-anime-original-regresa-con-cuatro-nuevos-episodios-por-el-20-aniversario-de-la-serie11/1366_2000.jpeg' alt='' />
                  </div>
                  <h2 className='my-2'>CHAT GRUPAL{}</h2>
                </div>
                {/* BOTONES CHAT */}
                <div className='flex gap-3 p-2'>
                  {/* BOTON DE MINIMIZAR */}
                  <button
                    onClick={toggleMinimize}
                    className='flex justify-center items-center border-l border-r h-5 w-5 bg-yellow-500 border-blue-950 rounded-md'
                  ><h1 className='text-lg'>-</h1></button>
                  {/* BOTON DE CERRAR */}
                  <button
                    onClick={exitChat}
                    className='flex justify-center items-center border-l border-r h-5 w-5 bg-red-500 border-blue-950 rounded-md'
                  ><h1 className='text-lg'>x</h1></button>
                </div>
              </div>
              <form onSubmit={handleSubmit }
                className='text-white flex-col w-full h-full flex'
              >
                {/* CHAT MENSAJES */}
                <ul ref={messagesRef} className='h-full w-[100%] pl-[40px] pr-[10px] items-end bg-white flex flex-col overflow-y-auto custom-scrollbar'>
                  {
                    messages.map((message, index) => (
                      <li key={index}
                        className={`my-[2px] mx-[3px] p-1 table text-sm w-[100%] max-w-[60%] rounded-md
                          ${message.from === userName ? "bg-blue-200 text-blue-900 ml-auto": "li-message mr-auto"}
                        `}>
                        {/* MENSAJE INDIVIDUAL ENCABEZADO  */}
                        <div className='flex items-center w-full gap-2 px-1 mt-0 mb-1'>
                          {
                            message.from !== userName && <div className='flex w-7 h-7 rounded-full bg-gray-500 relative right-[46px]'>
                              <img className='w-full h-full object-cover rounded-full' src='https://img.freepik.com/vector-premium/diseno-ilustracion-vector-personaje-estilo-anime-chica-joven-chica-anime-manga_147933-100.jpg?w=740' alt='' />
                            </div>
                          }
                          {
                            message.from !== userName &&
                              <span
                                className='text-[18px] font-bold text-slate-300 flex relative right-[37px]'
                              >{message.from}</span>
                          }
                          <span
                            className={`text-sm text-slate-500 flex relative ${message.from !== userName && "right-[37px]"}`}
                          >{message.fecha}</span>
                        </div>
                        {/*//! MENSAJE */}
                        {
                          message.file?.data &&
                          (
                            <div className='flex flex-col h-[auto]'>
                              <img
                                src={message.file && message.file.data instanceof ArrayBuffer ? `data:${message.file.type};base64,${arrayBufferToBase64(message.file.data)}`: filePreview}
                                alt={message.file.name}
                                className='w-[300px] h-[auto] object-cover'
                              />
                              <button onClick={(event) => {downloadFile(event,message.file)}}
                              >Download</button>
                            </div>
                          )
                        }
                        <span className='ml-[5px] text-md  flex text-justify'>{message.message}</span>
                      </li>
                    ))
                  }
                  {/* PREVISUALIZAR ARCHIVO */}
                  {
                    preview &&
                      (
                        <div className='flex flex-col w-[500px] h-[500px] border-[3px] p-3 rounded-md my-2 justify-around items-center'>
                          <div className='flex'>
                            <button
                              className='flex justify-center items-center w-[20px] h-[20px] font-bold bg-red-500 rounded-md relative right-[200px]'
                              onClick={handleCancelUpload}
                            >x</button>
                          </div>
                          <img src={filePreview}
                            className='w-[300px] h-[400px] object-cover'
                          />
                          <div className='flex'>
                            <button
                              className='flex justify-center items-center w-[auto] h-[auto] p-[4px] font-bold bg-green-400 rounded-[50%] relative left-[200px]'
                              onClick={handleSubmitFile}
                            >
                              <img src={enviarIcon} className='w-[40px] h-[40px] mr-[6px]' />
                            </button>
                          </div>
                        </div>
                      )
                  }
                </ul>
                <div className={`flex w-[100%] justify-between h-[60px] mt-[10px] bottom-0 p-2 bg-gray-500 ${preview && "hidden"}`}>
                  <input
                    type="text"
                    onChange={handleChange}
                    onKeyDown={handleKeyDow}
                    autoComplete='off'
                    placeholder='write your message' name='message' value={message}
                    className='border-2 border-zinc-500 p-2 w-full text-black rounded-lg'
                  />
                  {
                    !selectedFile &&
                    (
                      <label className='custom-file-upload flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded md cursor-pointer'>
                        <input
                          className='hidden'
                          onKeyDown={handleKeyDow}
                          ref={fileInputRef}
                          type='file' onChange={handleFilechange}
                        />
                        <img src={adjuntarIcon} alt="adjuntar archivo"
                          className='w-[60px] h-[60px] object-cover'
                        />
                      </label>
                    )
                  }
                  <button
                    onClick={handleSubmit}
                    type='button'
                    className='bg-green-500 px-[8px] py-[9px] rounded-[50%] mx-2 hover:scale-110 flex justify-center items-center'
                  >
                    <img src={enviarIcon} className='w-[40px] h-[40px] mr-[6px]' />
                  </button>
                </div>
              </form>

            </div>
          </div>
        ) :
        (
          <div className='flex justify-around  fixed items-center border-2 border-blue-950 rounded-md bottom-10 right-10 w-32 h-10'>
            <span className='font-bold'>Chat</span>
            <button
              onClick={toggleMinimize}
              className='flex justify-center items-center border-2 h-5 w-5 border-blue-950 cursor-pointer'
            ></button>
          </div>
        )
      }
    </div>
  )
}

export default Chat