import React, {Fragment} from 'react'

class FilterEntries extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            query_string: ""
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    render(){
        return (
        <Fragment>
            <input type = "text" name = "query_string" value = {this.state.query_string} placeholder = "Search" onChange = {this.handleChange}/>
        </Fragment>           
        )
    }
}

export default FilterEntries