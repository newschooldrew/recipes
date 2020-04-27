import React from 'react'
import {ApolloConsumer} from 'react-apollo'
import {SEARCH_RECIPES} from '../../queries'
import SearchItem from './SearchItem'

class Search extends React.Component {
    constructor(){
        super()
        this.state = {
            searchResults: []
        }
    }

    handleChange = ({searchRecipes}) =>{
        this.setState({
            searchResults:searchRecipes
        })
    }

    render() {
        const {searchResults} = this.state;
return(
    <ApolloConsumer>
        {client => ( 
            <div>
                <input type="search" placeholder="search for recipes" 
                    onChange={ async e =>{
                        e.persist();
                        //accessing event properties in an asynchronous way
                        const {data} = await client.query({
                            query:SEARCH_RECIPES,
                            variables:{searchTerm:e.target.value}
                            })
                        this.handleChange(data)
                    }}
                    />
                <ul>
                    {searchResults.map(recipe =>(
                        <SearchItem key={recipe._id} {...recipe}/>
                    ))}
                </ul>
            </div>
        )}
        </ApolloConsumer>
        )
    }
}
export default Search