import React from 'react'
import {Mutation,Query} from 'react-apollo'
import {UPDATE_USER_RECIPE,DELETE_USER_RECIPE,GET_USER_RECIPES,GET_ALL_RECIPES,GET_CURRENT_USER} from '../../queries'
import {Link} from 'react-router-dom'


class UserRecipes extends React.Component {

    constructor(){
        super()
        this.state = {
            _id:'',
            name:'',
            description:'',
            instructions:'',
            category:'',
            modal:false
        }
    }

    commitEdit = (e,updateUserRecipe) => {
        e.preventDefault()
        return (
        updateUserRecipe().then( async ({data}) =>{
            console.log(data)
            this.closeModal()
        })
    )}

    loadRecipe = recipe =>{
        console.log(recipe)
        this.setState({
            _id:recipe._id,
            name:recipe.name,
            description:recipe.description,
            instructions:recipe.instructions,
            modal:true
        })
    }

    handleChange = e =>{
        const {name,value} = e.target;
        this.setState({
            [name]:value 
        })
    }

    handleDelete =  deleteUserRecipe => {
        deleteUserRecipe().then(({data}) =>{
            console.log(data)
    })}

    closeModal = () =>{
        this.setState({
            modal:false
        })
    }

    render(){
        const {username} = this.props;
        const {modal} = this.state;
        return(
            
    <Query query={GET_USER_RECIPES} variables={{username}}>
        {
            ({data, err, loading}) => {
                if (err) return <div>error</div>
                if (loading) return <div>loading</div>
                console.log(data)
                return(
                    <ul>
                        {modal && <EditRecipeModal commitEdit={this.commitEdit} loadedProps={this.state} closeModal={this.closeModal} handleChange={this.handleChange} />}
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
                                                <>
                                                <button onClick={() => this.loadRecipe(recipe)}>Update Recipe</button>
                                                <p onClick={() => this.handleDelete(deleteUserRecipe)}>
                                                    {attrs.loading ? "deleting..." : "x"}
                                                </p>
                                                </>
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

const EditRecipeModal = ({commitEdit,handleChange, recipe, closeModal,loadedProps}) => {
        console.log(loadedProps)
        const {instructions,category,name,description} = loadedProps;
        
return (
    <Mutation mutation={UPDATE_USER_RECIPE} variables={
        {_id:loadedProps._id,
        name:loadedProps.name,
        description:loadedProps.description,
        instructions:loadedProps.instructions,
        category:loadedProps.category}
        }>
        {
            (updateUserRecipe,{data}) =>{
                return(
    <div className="modal modal-open">
        <div className="modal-inner">
            <div className="modal-content">
                <form className="modal-content-inner" action="POST" onSubmit={e => commitEdit(e,updateUserRecipe)}>
                    <h4>Edit Recipe</h4>
                        <label>Name</label>
                        <input type="text" name="name" value={name} placeholder="Recipe Name" onChange={handleChange} /> 
                        <label>Description</label>
                        <input type="text" name="description" value={description} onChange={handleChange} /> 
                        <label>Instructions</label>
                        <input type="text" name="instructions" value={instructions} onChange={handleChange} />
                        <label>Category</label>
                        <input type="text" name="category"  onChange={handleChange} />
                        <hr />
                        <div className="modal-buttons">
                            <button type="submit">Update</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                </form>
            </div>
        </div>
    </div>
                )
            }
        }
    </Mutation>
    )
}
export default UserRecipes;