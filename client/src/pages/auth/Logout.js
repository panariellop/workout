import React, {Fragment} from 'react';
import Cookies from 'js-cookie'



class Logout extends React.Component {
    constructor(props){
        super(props);
        this.handleToken = this.handleToken.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.state = {
            accessToken: Cookies.get('accessToken'),
            refreshToken: Cookies.get('refreshToken')
        }
    }
    handleToken(){
        var authed = false
        fetch('http://localhost:5000/api/auth/users/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "token": this.state.refreshToken
            })
        })
        .then(async res=> {
            switch(res.status){
                default: 
                    authed = false 
                    break; 
                case 401:
                    console.log("refresh token invalid")
                    break
                case 400: 
                    console.log(this.state.refreshToken, "Refresh token not given")
                    break
                case 200: 
                    authed = true 
                    res = await res.json()
                    //Set the access cookie to the replied access token 
                    Cookies.set('accessToken', res.accessToken)
                    break
            }

        })
        return authed 
    }

    handleLogout(e){
        e.preventDefault()
        fetch('http://localhost:5000/api/auth/users/logout', {
            method: 'DELETE',
            headers: {
                'x-auth-token': Cookies.get('accessToken')
            }
        })
        .then(res=> {
            switch(res.status){
                default: 
                    console.log("Unexpected error")
                    break
                case 200: 
                    window.location.replace('/login')
                    //Remove access and refresh cookies 
                    Cookies.remove('accessToken')
                    Cookies.remove('refreshToken')
                    break
                case 403:
                    var refreshed = this.handleToken() 
                    if(refreshed === true){
                        this.handleLogout()
                    }
                    break
            }
        })
    }
    
    

    render(){
        return(
            <Fragment>
                <h1>LOGO</h1>
                <form onSubmit = {this.handleLogout} className = "loginForm">
                    <input type = "submit" value = "LOGOUT"/>
                </form>
            </Fragment>
        )   
    }
}


export default Logout 