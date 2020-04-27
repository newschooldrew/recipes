import React from 'react'
import {SIGN_IN_USER} from '../../queries/index'
import {Mutation} from 'react-apollo'
import {withRouter} from 'react-router-dom'

class Signin extends React.Component {

    constructor(){
        super()
        this.state ={
            username:'',
            password:''
        }
    }

    validateForm = () =>{
        const {username, password} = this.state;
        const isValidated = !username || ! password;
        return isValidated
    }

    handleSubmit = (e,signinUser) => {
        e.preventDefault()

        signinUser().then( async ({data}) => {
            const {token} = data.signinUser;
            console.log({token})
            localStorage.setItem("token",token)
            this.props.refetch()

            this.setState({
                username:'',
                password:''
            })

            this.props.history.push('/')
        })
    }

    handleChange = e =>{
        const {name, value} = e.target;
        this.setState({
            [name]:value
        })
    }

    render(){
        const {username, password} = this.state;
        return(
            <Mutation mutation={SIGN_IN_USER} variables={{username, password}}>
                {
                    (signinUser,{data, loading})=>{
                return (
            <form className="form" onSubmit={e => this.handleSubmit(e,signinUser)}>
                <input type="text" name="username" placeholder="Username" value={username} onChange={this.handleChange}/>
                <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange}/>
                <button type="submit" className="button-primary" disabled={loading || this.validateForm()}>Submit</button>
            </form>
                    )
                }}
            </Mutation>
        )
    }
}

export default withRouter(Signin)