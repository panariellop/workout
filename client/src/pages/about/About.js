import React from 'react'

class About extends React.Component{
    render(){

        const wrapper = {
            marginLeft: '15px',
            marginRight: '15px',
        }

        return(
            <div style = {wrapper}>
                <h1 style = {{textAlign: 'center'}}>About</h1>
                <p>This software was created by Piero Doré Panariello 
                on August 29, 2020. (c) All Rights Reserved</p>
            </div>
        )
    }
}

export default About 
