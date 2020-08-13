const axios = require('axios');
const cookies = require('js-cookie')
async function preflightCheck(){
	//Get cookies
	var refreshToken = cookies.get('refreshToken')

	//Refresh the access token
	var accessToken = Cookies.get('accessToken')
    await axios({
        method: "POST",
        url: "/api/auth/users/token",
        data: {
            token: refreshToken
        }
    }).then(res => {
        accessToken = res.data.accessToken
    }).catch(e=> {
        console.log(e)
    })

    //set new access token
    cookies.set('accessToken', accessToken)
};
module.exports = preflightCheck;
