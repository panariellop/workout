import React, { Fragment } from 'react';
import Bio from './components/Bio'
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
                        <li>Password: {this.state.user.password}</li>
                        <li>Email: {this.state.user.email}</li>
                        <li>Account Type: {this.state.user.status}</li>
                    </ul>
                </div>
                </div>
            </Fragment>}
            </Fragment>
        )
    }
}

export default Profile 