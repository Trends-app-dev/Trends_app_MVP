import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
  const activeStyle = 'underline'

  return (
    <nav className='flex justify-center items-center fixed z-10 w-full py-5 px-8 text-sm font-light border-2'>
      <ul className='flex items-center gap-3'>
        <li className='font-semibold text-lg'>
          <NavLink
            to={'/Trends_app_MVP/chat'}
            className={({isActive}) => isActive ? activeStyle: undefined }
          >
            Chat
          </NavLink>
        </li>
        <li>
          <NavLink
            to={'/Trends_app_MVP/register'}
            className={({isActive}) => isActive ? activeStyle: undefined }
          >
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar