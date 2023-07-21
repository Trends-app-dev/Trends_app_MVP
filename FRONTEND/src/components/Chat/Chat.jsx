import React,  { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { setIsMinimized, setUserName } from '../../redux/action';
import { useLocation, useNavigate } from 'react-router-dom';
import adjuntarIcon from '../../assets/adjuntar.png';
import enviarIcon from '../../assets/enviar.png';
//import scrollbar from './scrollbar.css?inline';
import scrollbar from './scrollbar.css';
import Layout from '../Layout/Layout';

const socket = io('http://localhost:3007');

const Chat = () => {
  // ?======================================
  // ? Idea en desarrollo
  //?const [socket, setSocket] = useState(null);
  // ?======================================
  // Estados Locales
  //----------------------------------------------------
  const [saludoServer, setSaludoServer] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const [isMinimized, setIsMinimized] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] =useState('');
  const [preview, setPreview] = useState(false);

  // Estados Globales
  //------------------------------------------------------
  const userName = useSelector(state => state.userName);
  const isMinimized = useSelector(state => state.isMinimized);

  // Variables
  //-------------------------------------------------------
  const messagesRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // *=====================================================
  // *                  HANDLERS
  // *=====================================================

  // Capturar el mensage en mi estado local
  const handleChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  }

  // Función para evitar ejectuar formulario al dar enter
  const handleKeyDow = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      message.trim() !== ''&& handleSubmit(event);
    }
  };
  // Función para el envio del archivo adjunto
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

  // Enviando evento (mensaje) al servidor socket
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

  // Enviar el archivo al estado local
  const handleFilechange = (event) => {
    const file = event.target.files[0];
    if(file){
      //console.log('file: ', file);
      setSelectedFile(file);
      setPreview(true);
      // Crear una URL local temporal para la vista previa del archivo
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Función para cancelar el envio del archivo adjunto
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setFilePreview('');
    setPreview(false);
    fileInputRef.current && (fileInputRef.current.value='');
  };

  // *=====================================================
  // *                 FUNCIONES
  // *=====================================================

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
    isMinimized === true ? dispatch(setIsMinimized(false)) : dispatch(setIsMinimized(true));
  };

  // Función para salir del Chat
  const exitChat = (event) => {
    event.preventDefault();
    dispatch(setUserName(''));
  };

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

  // *===================================================
  // *            CICLOS DE VIDA
  // *===================================================
  // Escuchando Eventos del Servidor
  useEffect(() => {
    //setSocket(io("http://localhost:3007"));
    socket.on('saludo server', data => {
      setSaludoServer(data);
    });
    socket.on("message", receiveMessage);
    return () => {socket.off("message", receiveMessage)};
  },[]);

  // ?==========================
  // ?Idea en desarrollo
  // useEffect(() => {
  //   socket.emit("newUser")
  // },[socket]);
  // ?===========================

  // Para Debugin
  useEffect(() => {
    console.log('filePreviwe: ', filePreview);
    console.log('selectedFile: ', selectedFile);
    console.log('preview: ', preview)
    console.log('isMinimizeDefaul-false: ',isMinimized);
    console.log('userName: ',userName);
  },[filePreview, selectedFile, preview, isMinimized,userName]);

  // Controlla el Scroll
  useEffect(() => {
    // Controlar el scroll para mejorar experiencia de usuario
    const messageContainer = messagesRef.current;
    messageContainer && (messageContainer.scrollTop = messageContainer.scrollHeight);
    console.log('messages: ', messages);
  },[messages])

  // Controlar cambio de página se minimize el chat
  // useEffect(() => {
  //   location.pathname !== '/Trends_app_MVP/chat'
  //     && dispatch(setIsMinimized(true));
  // },[location]);

  return (
    <div className={`flex w-[100%] border-2 ${!userName && "hidden"}`}>
      {
        !isMinimized ? (
          // *================================================
          // *CONTENEDOR PRINCIPAL EN PAGINA COMPLETA DEL CHAT
          // *================================================
          <div className='container-chat w-[100%] h-[100%] flex items-center justify-start border-2'>
            {/* //*CONTENEDOR PRINCIPAL PANEL IZQUIERDO */}
            <div className='flex flex-col bg-white border-2 border-slate-400 w-[30%] h-full '>
              {/* ENCABEZADO IZQUIERDO (mi foto y username)*/}
              <div className='flex items-center left-[4px] top-[70] gap-3 bg-slate-400 w-[29.3%] h-[50px] fixed'>
                <div className='flex w-7 h-7 ml-[5px] rounded-full bg-gray-500'>
                  <img className='w-full h-full object-cover rounded-full' src='https://img.freepik.com/vector-premium/diseno-ilustracion-vector-personaje-estilo-anime-chica-joven-chica-anime-manga_147933-100.jpg?w=740' alt='' />
                </div>
                <h2 className='my-2'>{userName}</h2>
              </div>
            </div>

            {/* //* CONTENEDOR PRINCIPAL PANEL DERECHO */}
            <div className='flex flex-col w-[70%] h-[calc(100vh-150px)] relative bottom-[36px] pb-[0px] border-2 border-slate-500'>
              {/* ENCABEZADO DERECHO (foto y nombre del Chat actual, ya se grupal o individual) */}
              <div className='flex justify-between items-center pr-[15px] gap-1 bg-slate-500 w-[100%] h-[50px] '>
                <div className='flex items-center  ml-[5px] gap-3'>
                  <div className='flex w-7 h-7 rounded-full bg-gray-500'>
                    <img className='w-full h-full object-cover rounded-full' src='https://i.blogs.es/944446/naruto-el-anime-original-regresa-con-cuatro-nuevos-episodios-por-el-20-aniversario-de-la-serie11/1366_2000.jpeg' alt='' />
                  </div>
                  <h2 className='my-2'>CHAT GRUPAL{}</h2>
                </div>
                {/* BOTONES CHAT */}
                <div className='flex gap-3 p-2'>
                  {/* minimizar chat*/}
                  <button
                    onClick={toggleMinimize}
                    className='flex justify-center items-center border-l border-r h-5 w-5 bg-yellow-500 border-blue-950 rounded-md'
                  ><h1 className='text-lg'>-</h1></button>
                  {/* cerrar chat*/}
                  <button
                    onClick={exitChat}
                    className='flex justify-center items-center border-l border-r h-5 w-5 bg-red-500 border-blue-950 rounded-md'
                  ><h1 className='text-lg'>x</h1></button>
                </div>
              </div>
              {/* //*CONTENEDOR DEL CHAT */}
              <form onSubmit={handleSubmit }
                className='text-white flex-col w-full h-full flex'
              >
                {/* cuerpo del chat aca se renderizan todos los mensajes */}
                <ul ref={messagesRef} className=' w-[100%] h-[100%] pl-[40px] pr-[10px] bg-white items-end flex flex-col overflow-y-auto custom-scrollbar'>
                  {
                    messages.map((message, index) => (
                      // *CONTENEDOR PRINCIPAL DE CADA MENSAJE INDIVIDUAL
                      //*-------------------------------------------------
                      <li key={index}
                        className={` my-[2px] mx-[3px] p-1 table text-sm w-[auto] max-w-[60%] rounded-md
                          ${message.from === userName ? "bg-blue-200 text-blue-900 ml-auto": "li-message mr-auto"}
                        `}>
                        {/* //*Contenedor para la imagen de perfil, userName, hora mensaje */}
                        <div className='flex items-center w-full gap-2 px-1 mt-0 mb-1'>
                          { /** validación mostrar foto de quien envia mensaje */
                            message.from !== userName && <div className='flex w-7 h-7 rounded-full bg-gray-500 relative right-[46px]'>
                              <img className='w-full h-full object-cover rounded-full' src='https://img.freepik.com/vector-premium/diseno-ilustracion-vector-personaje-estilo-anime-chica-joven-chica-anime-manga_147933-100.jpg?w=740' alt='' />
                            </div>
                          }
                          { /** Validación para mostrar userName de quien envia mensaje */
                            message.from !== userName &&
                              <span
                                className='text-[18px] font-bold text-slate-300 flex relative right-[37px]'
                              >{message.from}</span>
                          }
                          {/** mostrar hora mensaje, validación para ajustar ubicación mensaje recibido */}
                          <span
                            className={`text-sm text-slate-500 flex relative ${message.from !== userName && "right-[37px]"}`}
                          >{message.fecha}</span>
                        </div>
                        { /** Validación si vienen archivo adjunto se renderize */
                          message.file?.data &&
                          (
                            <div className='flex flex-col justify-center items-center w-[100%] h-[30%]'>
                              <img
                                src={message.file && message.file.data instanceof ArrayBuffer ? `data:${message.file.type};base64,${arrayBufferToBase64(message.file.data)}`: filePreview}
                                alt={message.file.name}
                                className='flex w-[200px] object-scale-down'
                              />
                              {/** descargar archivo adjunto */}
                              <button onClick={(event) => {downloadFile(event,message.file)}}
                              >Download</button>
                            </div>
                          )
                        }
                        {/** rederizar mensaje */}
                        <span className='ml-[5px] text-md  flex text-justify'>{message.message}</span>
                      </li>
                    ))
                  }
                  { /** Validación para renderizar si se va enviar archivo adjunto */
                    preview &&
                      (  // *CONTENEDOR PRINCIPAL PREVISUALIZACION ENVIO ARCHIVO ADJUNTO
                        <div className='flex flex-col w-[100%] h-[80%] border-[3px] p-3 rounded-md my-2 justify-around items-center'>
                          {/** cerrar o cancelar previsualización */}
                          <div className='flex mb-[5px] w-[100%]'>
                            <button
                              className='flex justify-center items-center w-[20px] h-[20px] font-bold bg-red-500 rounded-md'
                              onClick={handleCancelUpload}
                            >x</button>
                          </div>
                          {/** previsualización de archivo adjunto */}
                          <img src={filePreview}
                            className='w-[100%] h-[80%] object-scale-down'
                          />
                          {/** icono de enviar */}
                          <div className='flex justify-end w-[100%]'>
                            <button
                              className='flex justify-center items-center w-[auto] h-[auto] p-[4px] font-bold bg-green-400 rounded-[50%]'
                              onClick={handleSubmitFile}
                            >
                              <img src={enviarIcon} className='w-[40px] h-[40px] mr-[6px]' />
                            </button>
                          </div>
                        </div>
                      )
                  }
                </ul>
                {/** //*CONTENEDOR DE INPUT PARA TIPEAR MENSAJE */}
                {/** //*-------------------------------------------- */}
                <div className={`flex w-[100%] justify-between h-[60px] mt-[10px] p-2 bg-gray-500 ${preview && "hidden"}`}>
                  <input
                    type="text"
                    onChange={handleChange}
                    onKeyDown={handleKeyDow}
                    autoComplete='off'
                    placeholder='write your message' name='message' value={message}
                    className='border-2 border-zinc-500 p-2 w-full text-black rounded-lg'
                  />
                  { // Validación
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
          // *================================================
          // *             CHAT MINIMIZADO
          // *================================================
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