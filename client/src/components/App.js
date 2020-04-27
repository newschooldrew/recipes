import React from 'react';
import './App.css';
import RecipeItem from './Recipe/RecipeItem'
import {Query} from 'react-apollo'
import {GET_ALL_RECIPES} from '../queries'

const App = () =>(
  <div className="App">
    <h1>Home</h1>
    <Query query={GET_ALL_RECIPES}>
      {
      ({data,loading, err}) =>{
        // window.location.reload()
        if (!data) return <div>refresh it</div>
        if (loading) return <div>Please reload...</div>
        if (err) return <div>Please reload...</div>
        return (
          <ul>{data.getAllRecipes.map(recipe =>(
              <RecipeItem key={recipe._id} recipe={recipe} />
              ))}
          </ul>
        )
      }}
    </Query>
  </div>
)

export default App;
