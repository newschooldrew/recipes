import React from 'react'
import NavbarUnauth from './NavbarUnauth'
import NavbarAuth from './NavbarAuth'
import {NavLink} from 'react-router-dom'

const Navbar = ({session}) =>(
    <nav>
        {session && session.getCurrentUser ?  <NavbarAuth session={session}/> : <NavbarUnauth /> }
    </nav>
)

export default Navbar