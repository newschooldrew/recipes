import React from 'react'
import {Mutation} from 'react-apollo'
import {SIGN_UP_USER} from '../../queries'
import {withRouter} from 'react-router-dom'

class Signup extends React.Component {

    constructor(){
        super()
        this.state = {
            username:'',
            email:'',
            password:'',
            passwordConfirmation:''
        }
    }

    validateForm = () =>{
        const {username,email,password, passwordConfirmation} = this.state;

        const isInvalid = !username || !email || !password || password !== passwordConfirmation;
        return isInvalid
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState({
            [name]:value
        })
    }

handleSubmit = (e,signupUser) =>{
    e.preventDefault()

    const {password, passwordConfirmation} = this.state;

    if (password !== passwordConfirmation) alert('your passwords dont match')

    signupUser().then( async({data}) => {
        const {token} = data.signupUser;
        localStorage.setItem('token',token)

        await this.props.refetch;

        this.setState({
            username:'',
            email:'',
            password:'',
            passwordConfirmation:''
            })
        this.props.history.push('/')
    })
}

    render(){
        const {username, email, password, passwordConfirmation} = this.state;
        return(
            <div className="App">
                <h2 className="App">Signup</h2>
                <Mutation mutation={SIGN_UP_USER} variables={{username,email,password}}>
                    {(signupUser,{data, loading,err})=>{
                    return (
                <form className="form" onSubmit={e => this.handleSubmit(e,signupUser)}>
                    <input type="text" name="username" placeholder="Username" value={username} onChange={this.handleChange}/>
                    <input type="email" name="email" placeholder="Email" value={email} onChange={this.handleChange}/>
                    <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange}/>
                    <input type="text" name="passwordConfirmation" placeholder="Confirm Password" value={passwordConfirmation}  onChange={this.handleChange}/>
                    <button type="submit" className="button-primary" disabled={loading || this.validateForm()}>Submit</button>
                </form>
                    )
                    }}
                </Mutation>
            </div>
        )
    }
}

export default withRouter(Signup)