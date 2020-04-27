import React from 'react'
import {withRouter} from 'react-router-dom'
import {GET_RECIPE} from '../../queries'
import {Query} from 'react-apollo'
import LikeRecipe from './LikeRecipe'

const RecipePage = ({match, session}) =>{
    const {_id} = match.params;
    return (
        <Query query={GET_RECIPE} variables={{_id}}>{
            ({data}) => {
                if (!data) return <div>no data</div>
                console.log(data)
                return(
                    <>
                    <h1>{data.getRecipe.name}</h1>
                    <p>Likes:{data.getRecipe.likes}</p>
                    <p>{data.getRecipe.username}</p>
                    <p>{data.getRecipe.description}</p>
                    <LikeRecipe _id={_id} session={session}/>
                    </>
            )
    }}
        </Query>
    )
}
export default withRouter(RecipePage);