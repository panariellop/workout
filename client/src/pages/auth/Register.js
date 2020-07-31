import React from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies(); 

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            password2: "" 
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount(){
        this.setState({
            username: "",
            email: "",
            password: "",
            password2: "" 
        })
    }

    handleChange(e){
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault(); 
        //Validate inputs 
        if (this.state.username==="" || this.state.password ==="" || this.state.password2==="" ||this.state.email===""){
            return alert("Please fill out all of the fields.")
        }
        if(this.state.password !== this.state.password2){
            return alert("Passwords are not the same.")
        }
        //send information to the api 
        fetch('http://localhost:5000/api/auth/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.password,
                status: "STANDARD"

            })
        })
        .then(res=> {
            switch(res.status){
                case 500: 
                    return alert('User already exists. Please use a different email or username.');
                case 401: 
                    return alert('Please fill out the form completely.')
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
            password: "",
            password2: "",
            email: ""
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

                    <label htmlFor = "email">Email</label><br/>
                    <input type = "email" name = "email" onChange = {this.handleChange} value = {this.state.email}/>

                    <br/>

                    <label htmlFor = "password">Password</label><br/>
                    <input type = "password" name = "password" onChange = {this.handleChange} value = {this.state.password}/>

                    <br/>

                    <label htmlFor = "password2">Confirm Password</label><br/>
                    <input type = "password" name = "password2" onChange = {this.handleChange} value = {this.state.password2}/>

                    <br/>
                    <input type = "submit" value = "REGISTER"/>
                </form>
            </div>
        )
    }
}

export default Login 