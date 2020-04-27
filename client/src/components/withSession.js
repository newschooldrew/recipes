import React from 'react'
import {Query} from 'react-apollo'
import {GET_CURRENT_USER} from '../queries'

const withSession = Component => props => (
    <Query query={GET_CURRENT_USER} notifyOnNetworkStatusChange>
        {
            ({data,loading, refetch, networkStatus}) =>{
                console.log(data)
                return (
                    <Component {...props} refetch={refetch} networkStatus={networkStatus} session={data} />
                )
            }
        }
    </Query>
)

export default withSession;