import React, { Fragment } from 'react'

class About extends React.Component{
    render(){

        const wrapper = {
            marginLeft: '15px',
            marginRight: '15px',
        }

        return(
            <div style = {wrapper}>
                <h1 style = {{textAlign: 'center'}}>About</h1>
            </div>
        )
    }
}

export default About 