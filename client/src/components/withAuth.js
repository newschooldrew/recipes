import React from 'react'
import {Query} from 'react-apollo'
import {Redirect} from 'react-router-dom'
import {GET_CURRENT_USER} from '../queries'

const withAuth = conditionalFn => WrappedComponent => props => (
    <Query query={GET_CURRENT_USER}>
        {
            ({data,loading}) =>{
                if (loading) return <div>loading..</div>
                return (
                    conditionalFn(data) ? <WrappedComponent {...props} /> : <Redirect to='/' />
                )
            }
        }
    </Query>
)

export default withAuth
