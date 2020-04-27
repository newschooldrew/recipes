import React from 'react'
import UserInfo from './UserInfo'
import UserRecipes from './UserRecipes'
import withAuth from '../withAuth'

const Profile = ({session}) =>(
    <div>
        <UserRecipes username={session.getCurrentUser.username}/>
        <UserInfo session={session}/>
    </div>
)

export default withAuth(session => session && session.getCurrentUser)(Profile)