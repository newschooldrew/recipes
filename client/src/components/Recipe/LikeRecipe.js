import React from 'react'
import {Mutation} from 'react-apollo'
import withSession from '../withSession'
import {UNLIKE_RECIPE,LIKE_RECIPE, GET_RECIPE} from '../../queries'

class LikeRecipe extends React.Component {
    constructor(){
        super()
        this.state = {
            liked: false,
            username:''
        }
    }

    componentDidMount(){
        if(this.props.session.getCurrentUser){
            const {username, favorites} = this.props.session.getCurrentUser;
            console.log("favorites " + JSON.stringify(favorites))
            const {_id} = this.props;
            const prevLiked = favorites.findIndex(favorite => favorite._id === _id) > -1;
            this.setState({
                username,
                liked:prevLiked
            })
        }
    }

    updateUnlike = (cache,{data}) => {
        const {_id} = this.props;
        const {unlikeRecipe} = data;
        const {getRecipe} = cache.readQuery({
            query:GET_RECIPE,
            variables:{_id}
        })
        cache.writeQuery({
            query:GET_RECIPE,
            variables:{_id},
            data:{
                getRecipe:{...getRecipe,likes:unlikeRecipe.likes -1 }
            }
        })
    }

    updateLike = (cache,{data}) => {
        const {likeRecipe} = data;
        const {_id} = this.props;
        const {getRecipe} = cache.readQuery({
            query: GET_RECIPE,
            variables:{_id}
        })
        cache.writeQuery({
            query: GET_RECIPE,
            variables:{_id},
            data:{
                getRecipe: {...getRecipe, likes:likeRecipe.likes +1 }
            }
        })
    }

    handleClick = (likeRecipe,unlikeRecipe) =>{
        this.setState(prevState =>({
            liked:!prevState.liked
        }),
        // callback so that the setState is handled synchronously
        // since setState is always asynchronous
        () => this.handleLike(likeRecipe,unlikeRecipe)
        )
    }

    // determining whether we can fire off likRecipe
    // based off the state
    handleLike = (likeRecipe,unlikeRecipe) =>{
        if(this.state.liked){
        likeRecipe().then(async ({data}) => {
            console.log(data)
            await this.props.refetch()
            })
        } else {
            unlikeRecipe().then(async({data}) =>{
                console.log(data)
                await this.props.refetch()
            })
        }
    }

    render(){
        const {liked, username} = this.state;
        const {_id} = this.props;
        return(
        <Mutation mutation={UNLIKE_RECIPE} variables={{_id,username}} update={this.updateUnlike}>
            {
                (unlikeRecipe,{data}) =>{
                    console.log(data)
                    return (
                        <Mutation 
                        mutation={LIKE_RECIPE} 
                        variables={{_id,username}}
                        update={this.updateLike}
                        >
                        {likeRecipe=>
                            username && (<button onClick={() => this.handleClick(likeRecipe,unlikeRecipe)}>
                                {liked ? 'Unlike' : 'Like'}</button>
                        )}
                    </Mutation>
                    )
                }
                
            }
    </Mutation>
        )
    }
}

export default withSession(LikeRecipe);