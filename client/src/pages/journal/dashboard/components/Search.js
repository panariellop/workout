import React, { Fragment } from 'react';

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            query_string: ""
        }
        this.handleChange = this.handleChange.bind(this)
    }

    filterEntries(){

    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value 
        })
    }

    render(){
        return(
            <Fragment>
                <input autoComplete = "off" type = "text" onChange = {async (e) => {
                   await this.handleChange(e); 
                   await this.filterEntries(); 
                }} value = {this.state.query_string} name = "query_string" placeholder = "Search"/>
            </Fragment>
        )
    }
}

export default Search