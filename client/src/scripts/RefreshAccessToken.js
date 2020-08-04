const axios = require('axios');

//This function is promise based. You need to call the function
//and then capture the response with newAccessToken().then(res=>console.log(res))

async function RefreshAccessToken(refreshToken){
    var newAccessToken = null
    await axios({
        method: "POST",
        url: "/api/auth/users/token",
        data: {
            token: refreshToken
        }
    })
    .then(res => {
        newAccessToken = res.data.accessToken
    })
    .catch(e=> {
        console.log(e)
    })


    return newAccessToken
}


module.exports = RefreshAccessToken
