import React from 'react'
import {Link} from 'react-router-dom';

const RecipeItem = ({recipe}) =>(
    <li key={recipe._id}>
        <Link to={`recipe/${recipe._id}`}>{recipe.name}</Link>
    <p>{recipe._id}</p>
    <p>Created By: {recipe.username}</p>
    <p>Likes: {recipe.likes}</p>
    <p>Instructions: {recipe.instructions}</p>
    <p>Description: {recipe.description}</p>
    </li>
)

export default RecipeItem;