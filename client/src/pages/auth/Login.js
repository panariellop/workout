import React from 'react';
import Cookies from 'universal-cookie'; 
const cookies = new Cookies(); 

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "", 
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount(){
        this.setState({
            username: "",
            password: ""
        })
    }

    handleChange(e){
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault(); 
        //Validate inputs 
        if (this.state.username==="" || this.state.password ==="" ){
            return alert("Please fill out the userame and password fields")
        }
        //send information to the api 
        fetch('http://localhost:5000/api/auth/users/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
        .then(res=> {
            if (res.status !== 200){
                return alert('Invalid Credentials')
            }
            return res.json()
        })
        .then(res=> {
            if(res === undefined){
                return
            }
            cookies.set('accessToken', res.accessToken, {path: '/'})
            cookies.set('refreshToken', res.refreshToken, {path: '/'})
            //forward to new page 
            window.location.replace('/dashboard')
        })
        this.setState({
            username: "",
            password: ""
        })
    }

    render() {
        return (
            <div className = "container">
                <div><h1>LOGO</h1></div>
                <form onSubmit = {this.handleSubmit} className = "loginForm">
                    <label htmlFor = "username">Username</label><br/>
                    <input type = "text" name = "username" onChange = {this.handleChange} value = {this.state.username}/>

                    <br/>

                    <label htmlFor = "password">Password</label><br/>
                    <input type = "password" name = "password" onChange = {this.handleChange} value = {this.state.password}/>

                    <br/>
                    <input type = "submit" value = "LOGIN"/>
                </form>
            </div>
        )
    }
}

export default Login 