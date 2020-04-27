import React from 'react'
import {Mutation} from 'react-apollo'
import {GET_ALL_RECIPES,ADD_RECIPE,GET_USER_RECIPES} from '../../queries'
import {withRouter} from 'react-router-dom'
import withAuth from '../withAuth'

class AddRecipe extends React.Component{

        constructor(){
            super()
            this.state = {
                name:'',
                category:'',
                description:'',
                instructions:'',
                username:''
            }
        }

    componentDidMount(){
        const {session} = this.props;
        console.log(this.props.session)
    }

    validateForm = () =>{
        const {name,category, description} = this.state;
        const isValidated = !name || !category || !description;
        return isValidated;
    }

    updateCache = (cache,{data:addRecipe}) =>{
        const {getAllRecipes} = cache.readQuery({query:GET_ALL_RECIPES})
        console.log("query data " + getAllRecipes);
        console.log('from data '+ addRecipe)
        cache.writeQuery({
            query:GET_ALL_RECIPES,
            data:{
                getAllRecipes:[addRecipe,...getAllRecipes]
            }
        })
    }

    handleSubmit = (e,addRecipe) =>{
        e.preventDefault();
        addRecipe().then(({data}) => {
            console.log(data)
        })
        this.setState({
            name:'',
            category:'',
            description:'',
            instructions:'',
            username:''
        })
        this.props.history.push('/')
    }

    handleChange = e =>{
        const {name,value} = e.target;
        this.setState({
            [name]:value 
        })
    }
    render(){
        const {name,category, description, instructions, username} = this.state;
    return (
        <Mutation 
        update={this.updateCache} 
        mutation={ADD_RECIPE} 
        variables={{name, description,category, instructions,username}}
        refetchQueries={()=>[
            {query:GET_USER_RECIPES,
                variables:{username}
            },
        ]}
        >
    {(addRecipe) =>{
    return (
    <div>
        <h2>Add Recipe</h2>
        <form onSubmit={e => this.handleSubmit(e,addRecipe)}>
            <label>Name</label>
            <input type="text" name="name" value={name} placeholder="Recipe Name" onChange={this.handleChange} /> 
            <label>Description</label>
            <input type="text" name="description" value={description} onChange={this.handleChange} /> 
            <label>Instructions</label>
            <input type="text" name="instructions" value={instructions} onChange={this.handleChange} />
            <label>Category</label>
            <input type="text" name="category" value={category} onChange={this.handleChange} />
            <label>Username</label>
            <input type="text" name="username" value={username} onChange={this.handleChange} />
        <button type="submit" disable={this.validateForm()}></button>
        </form>
    </div>
            )
        }
    }
    </Mutation>
        )
    }
} 

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe))