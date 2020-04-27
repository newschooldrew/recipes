import React from 'react'
import {NavLink} from 'react-router-dom'
import Signout from './auth/Signout.component'
const NavbarAuth = ({session}) =>(
    <>
    <ul>
    <li>
        <NavLink exact to="/">Home</NavLink>
    </li>
    <li>
        <NavLink to="/search">Search</NavLink>
    </li>
    <li>
        <NavLink to="/recipe/add">Add Recipes</NavLink>
    </li>
    <li>
        <NavLink to="/profile">Profile</NavLink>
    </li>
</ul>
<Signout />
<h2> Welcome, {session.getCurrentUser.username}</h2>
</>
);

export default NavbarAuth;