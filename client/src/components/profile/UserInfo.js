import React from 'react'
import {Link} from 'react-router-dom'

const formatDate = date =>{
    const newDate = new Date(date).toLocaleDateString('en-US');
    const newTime = new Date(date).toLocaleTimeString('en-US')
    return `${newDate} at ${newTime}`
}

const UserInfo = ({session}) => (
    <div>
        <h3>UserInfo</h3>
        <p>{session.getCurrentUser.username}</p>
        <p>{session.getCurrentUser.email}</p>
        <p>{formatDate(session.getCurrentUser.joinedDate)}</p>
        <p>Favorites:{session.getCurrentUser.favorites.map(favorite =>(
            <Link to={`/recipe/${favorite._id}`}>
                <p key={favorite._id}>{favorite.name}</p>
            </Link>
))}

</p>
    </div>
)

export default UserInfo