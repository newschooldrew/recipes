import React from 'react'
import {Mutation,Query} from 'react-apollo'
import {DELETE_USER_RECIPE,GET_USER_RECIPES,GET_ALL_RECIPES,GET_CURRENT_USER} from '../../queries'
import {Link} from 'react-router-dom'


class UserRecipes extends React.Component {

    handleDelete =  deleteUserRecipe => {
        deleteUserRecipe().then(({data}) =>{
            console.log(data)
    })}

    render(){
        const {username} = this.props;
        return(
    <Query query={GET_USER_RECIPES} variables={{username}}>
        {
            ({data, err, loading}) => {
                if (err) return <div>error</div>
                if (loading) return <div>loading</div>
                console.log(data)
                return(
                    <ul>
                        <h3>your recipes</h3>
                    {data.getUserRecipes.map(recipe => (
                        <li key={recipe._id}>
                        <Link to={`/recipe/${recipe._id}`}>
                            <p>{recipe.name}</p>
                        </Link>
                            <p>{recipe.likes}</p>
                            <Mutation 
                                refetchQueries={() =>[
                                    {query: GET_ALL_RECIPES},
                                    {query: GET_CURRENT_USER}
                                ]}
                                mutation={DELETE_USER_RECIPE} 
                                variables={{_id:recipe._id}} 
                                update={(cache,{data:{deleteUserRecipe}})=>{
                                    console.log(cache,data)
                                    const {getUserRecipes} = cache.readQuery({
                                            query:GET_USER_RECIPES,
                                            variables:{username}
                                        })
                                    cache.writeQuery({
                                        query:GET_USER_RECIPES,
                                        variables:{username},
                                        data:{
                                            getUserRecipes:getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
                                            }
                                        })
                                    }}>
                                {
                                    (deleteUserRecipe, attrs={}) => {
                                        return(
                                            <p onClick={() => this.handleDelete(deleteUserRecipe)}>
                                                {attrs.loading ? "deleting..." : "x"}
                                            </p>
                                        )
                                    }
                                }
                            </Mutation>
                        </li>
                        ))}
                    </ul>
                )
            }}
    </Query>
        )
    }
}

export default UserRecipes;