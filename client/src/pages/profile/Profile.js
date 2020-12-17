import React, { Fragment } from 'react';
import Cookies from 'js-cookie'
import RefreshAccessToken from '../../scripts/RefreshAccessToken'



async function getUser(){
    //Refresh the token
    const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
    .catch(e => console.log(e));
    await Cookies.set('accessToken', newAccessToken)
    //Make request
    var user = null
    await fetch("/api/profile", {
        method: "get",
        headers: {
            'x-auth-token': Cookies.get('accessToken')
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data !== undefined){
            user = data
        }
    })
    .catch(e => console.log(e))
    return user
}

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: null,
	    new_program_name: "",
	    new_program_link:"",
        }
        this.handleProgramLink = this.handleProgramLink.bind(this)
	this.handleChange = this.handleChange.bind(this)
    }

    async handleChangePassword(){
        var old_password = prompt("Please enter your old password.")
        if(old_password===null){
            return
        }
        var new_password = prompt("What would you like to change your password to?")
        if(new_password===null){
            return
        }
        const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
        .catch(e => console.log(e));
        await Cookies.set('accessToken', newAccessToken)

        await fetch("/api/profile/changepassword", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': Cookies.get('accessToken')
            },
            body: JSON.stringify({
                    old_password: old_password,
                    new_password: new_password
                })
        })
        .then(res => {
            if(res.status === 401) {alert("The password you entered is incorrect.")}
            if(res.status === 200) {alert("Your password was changed successfully")}

        })

    }

    async handleDeleteAccount(){
        var confirm = prompt("Are you sure you want to delete your account? If so, type YES into the input box.")
        if (confirm !== "YES"){
            return
        }
        var password = prompt("Please enter your password to confirm deleting your account.")
        if(password === null){
            return
        }

        //Refresh tokens
        const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
        .catch(e => console.log(e));
        await Cookies.set('accessToken', newAccessToken)
        //make api call to delete account
        fetch('/api/profile', {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': Cookies.get('accessToken')
            },
            body: JSON.stringify({
                password: password
            })
        }).then(res => {
            if(res.status !== 200) return alert("There was an error deleting your account. Please try again.")
            //Forward to register page
            window.location.replace('/login')
            //Remove cookies
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
        })
    }

    async componentDidMount(){
        this.setState({
            user: await getUser(),
	    
        })
	
    }

    handleChange(e){
	this.setState({[e.target.name]: e.target.value})
    }

    async handleProgramLink(reqtype){
        //Update tokens
        //Refresh tokens
        const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
        .catch(e => console.log(e));
        await Cookies.set('accessToken', newAccessToken)

        if(reqtype === 'POST'){
            //make post request to backend 
            fetch('/api/profile/program_links', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json',
                    'x-auth-token': Cookies.get('accessToken')
                },
                body: JSON.stringify({
                    'name': this.state.new_program_name ,
                    'link': this.state.new_program_link
                })
            }).then(res=> {
                if(res.status === 200) return alert("Link successfuly added.")
                else return alert("There was an error adding the link. Please try again.")
            })
        }
        else if(reqtype === 'DELETE'){
            //make delte request to backend 
            fetch('/api/profile/program_links', {
                method: 'delete',
                headers: {
                    'Content-Type' : 'application/json',
                    'x-auth-token': Cookies.get('accessToken')
                },
                body: JSON.stringify({
                    'name': this.state.new_program_name ,
                    'link': this.state.new_program_link
                })
            }).then(res=> {
                if(res.status === 200) return alert("Link successfuly deleted.")
                else return alert("There was an error deleting the link. Please try again.")
            })
        }
        this.setState({
            user: await getUser() //re-updates the local user class 
        })

    }

    linkStyle = {
        color: "blue",
        textDecoration: "none",
    }

    render(){
        return (
            <Fragment>
            {this.state.user && <Fragment>
                <div className = "profile-details">
                <h1>Hi {this.state.user.username}!</h1>
                <div className = "profile-details-wrapper">
                    <ul>
                        <li>Password: {this.state.user.password}
                        <button onClick = {this.handleChangePassword}>CHANGE PASSWORD</button>
                        </li>
                        <li>Email: {this.state.user.email}</li>
                        <li>Account Type: {this.state.user.status}</li>
                        <br/>
                        <a style = {this.linkStyle} href = "/help">Help</a>
                        <br/>
                        <br/>
                        <a style = {this.linkStyle} href = "/about">About</a>

                        {this.state.user.program_links &&
                        <div className = "profile-program-links-wrapper">
                            <h3>Program Links</h3>
                         {Object.keys(this.state.user.program_links).map((obj, i)=> {
                            return (
                                <li key = {i}>{obj} <a>{this.state.user.program_links[obj]}</a></li>
                            )
                        })}
                        <input value = {this.state.new_program_name}
                        onChange = {this.handleChange} name = 'new_program_name'/>
                        <input value = {this.state.new_program_link}
                        onChange = {this.handleChange} name = 'new_program_link'/>
                         <button onClick = {() => {this.handleProgramLink('POST')}}>Add a Link</button>
                        </div>
                        }

                        <br/>
                        <br/>
                        <li><button onClick = {this.handleDeleteAccount} >DELETE ACCOUNT</button></li>
                    </ul>
                </div>
                </div>
            </Fragment>}
            </Fragment>
        )
    }
}

export default Profile
