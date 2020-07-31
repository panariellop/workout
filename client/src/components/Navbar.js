import React, { Fragment } from 'react';
import Cookie from 'js-cookie';
import { Link } from 'react-router-dom'; 
import './Navbar.css'; 

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            auth: false
        }
    }

    componentDidMount(){
        //Check for any access/refresh tokens in the cookie tray
        var accessToken = Cookie.get('accessToken'); 
        var refreshToken = Cookie.get('refreshToken'); 
        //Auth 
        if(accessToken===undefined || accessToken === "" || refreshToken ===undefined || refreshToken === ""){
            this.setState({auth: false})
        }else{
            this.setState({auth: true})
        }


    }

    render(){
    return (
        <div className = "container">
            <ul className = "menubar-ul">
                <li className="companyLogo">
                    <Link style = {{textDecoration: 'none'}} to = "/">
                        LOGO
                    </Link>
                </li>
                {this.state.auth ? 
                  <Fragment>
                    <li className = "menubar-option">
                        <Link className = "menubar-link" to = '/logout'>Logout</Link>
                    </li>
                    <li className = "menubar-option">
                        <Link className = "menubar-link" to = '/profile'>Profile</Link>
                    </li>
                    <li className = "menubar-option">
                        <Link className = "menubar-link" to = '/dashboard'>Dashboard</Link>
                    </li>
                  </Fragment>
                : <Fragment>
                    <li className = "menubar-option">
                        <Link className = "menubar-link" to = '/login'>Login</Link>
                    </li>
                    <li className = "menubar-option">
                        <Link className = "menubar-link" to = 'register'>Register</Link>
                    </li>
                  </Fragment>}
            </ul>
        </div>
    )
    }
}

export default Navbar 