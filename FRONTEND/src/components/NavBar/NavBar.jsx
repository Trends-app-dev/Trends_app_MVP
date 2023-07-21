import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
  const activeStyle = 'underline'

  return (
    <nav className='flex justify-center items-center fixed w-[100%] py-5 px-8 text-sm font-light border-2 top-0 bg-blue-950 text-white'>
      <ul className='flex items-center gap-3'>
        <li className='font-semibold text-lg'>
          <NavLink
            to={'/Trends_app_MVP/inicio'}
            className={({isActive}) => isActive ? activeStyle: undefined }
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
           // to={'/Trends_app_MVP/register'}
            className={({isActive}) => isActive ? activeStyle: undefined }
          >
            otra pag
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar