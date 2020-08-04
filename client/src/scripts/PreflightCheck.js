const axios = require('axios');
const cookies = require('js-cookie')
require('dotenv').config()

async function preflightCheck(){
	//Get cookies
	var accessToken = cookies.get('accessToken')
	var refreshToken = cookies.get('refreshToken')

	//Refresh the access token
	var newAccessToken = null
    await axios({
        method: "POST",
        url: "/api/auth/users/token",
        data: {
            token: refreshToken
        }
    }).then(res => {
        newAccessToken = res.data.accessToken
    }).catch(e=> {
        console.log(e)
    })

    //set new access token
    cookies.set('accessToken', newAccessToken)


};

module.exports = preflightCheck;
