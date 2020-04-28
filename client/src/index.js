import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {ApolloClient} from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import withSession from './components/withSession'
import Navbar from './components/Navbar'
import Search from './components/Recipe/Search'
import AddRecipe from './components/Recipe/AddRecipe'
import Profile from './components/profile/Profile'
import RecipePage from './components/Recipe/RecipePage'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import Signin from './components/auth/Signin.component'
import Signup from './components/auth/Signup.component'

const Root = ({session, refetch, networkStatus}) =>(
  <Router>
    <Navbar session={session}/>
    <Switch>
      <Route path='/' exact component={App} />
      <Route path='/search' component={Search} />
      <Route path='/signin'  render={()=> <Signin refetch={refetch}/>} />} />
      <Route path='/signup'  render={()=> <Signup refetch={refetch}/>} />} />
      <Route path='/recipe/add' render={()=><AddRecipe session={session} />} />
      <Route path='/recipe/:_id' component={RecipePage} />
      <Route path='/profile' render={()=> <Profile session={session} />} />
      <Redirect to='/' />
    </Switch>
  </Router>
  )

const RootwithSession = withSession(Root);

const httpLink = createHttpLink({
  uri:'https://drewperez.party/graphql',
  credentials:'include'
})

const cache = new InMemoryCache();

    const authLink = setContext(() =>{
        const token = localStorage.getItem('token');
        return {  
          headers:{
              authorization:token
            }
        }
      })


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache, 
    onError: ({networkError}) => {
      if(networkError) {
        console.log('network error', networkError)
      }
    }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootwithSession />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA