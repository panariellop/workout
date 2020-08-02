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
    await fetch("http://localhost:5000/api/profile", {
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
            user: null 
        }
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

        await fetch("http://localhost:5000/api/profile/changepassword", {
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

        //forward to register page
    }

    async componentDidMount(){
        this.setState({
            user: await getUser()
        })
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