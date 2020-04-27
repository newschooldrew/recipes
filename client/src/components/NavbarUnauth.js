import React from 'react'
import {NavLink} from 'react-router-dom'

const NavbarUnauth = ({session}) =>(
    <ul>
    <li>
        <NavLink exact to="/">Home</NavLink>
    </li>
    <li>
        <NavLink to="/search">Search</NavLink>
    </li>
    <li>
        <NavLink to="/signin">Sign In</NavLink>
    </li>
    <li>
        <NavLink to="/signup">Sign Up</NavLink>
    </li>
</ul>
);

export default NavbarUnauth;