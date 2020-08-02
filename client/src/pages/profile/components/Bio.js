import React, { Fragment } from 'react'

class Bio extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user
        }
    }

    render(){
        return(
            <Fragment>
                <h1>BIO</h1>
            </Fragment>
        )
    }
}
export default Bio 