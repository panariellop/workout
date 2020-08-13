import React, { Fragment } from 'react';

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {
			query_string: "",
			filtered_entries: []
        }
		this.handleChange = this.handleChange.bind(this)
		this.filterEntries = this.filterEntries.bind(this)
    }

    filterEntries(){
		//Need to filter the entries on this state, and then pass up the allowed entries to the 
		//parent state 

		//Parse the information 
		var user_input = [] 
		var filtered_entries = []
		try{
			//Sort mode 
			user_input = this.state.query_string.split(":", 2)
		}catch(e){
			//Normal mode
			user_input.push(this.state.query_string)
		}
		
		//filter by day 
		if(user_input[0] === "date"){
			//loop through each entry and only allow dates that match input 
			for (var i = 0; i<this.props.entries.length; i++){
				try{
					//Specific date 
					var user_date = new Date(user_input[1])
					var entry_date = new Date(this.props.entries[i].date)
					user_date = user_date.toISOString().slice(0,10);
					entry_date = entry_date.toISOString().slice(0,10);

					if(user_date === entry_date){
						//push to filtered_entries array
						filtered_entries.push(this.props.entries[i])
					}
				}catch(e){}
			}
		}
		//filter by name 
		else if(user_input[0] === "name"){
			for (var i = 0; i<this.props.entries.length; i++){
				if(user_input[1] === this.props.entries[i].exercise){
					//push to filtered_entries array
					filtered_entries.push(this.props.entries[i])
				}
			}
		}
		//filter by location 
		else if(user_input[0] === "location"){
			for (var i = 0; i<this.props.entries.length; i++){
				if(user_input[1] === this.props.entries[i].location){
					//push to filtered_entries array
					filtered_entries.push(this.props.entries[i])
				}
			}
		}
		this.setState({
			filtered_entries: filtered_entries
		})
	}


    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value 
        })
    }

    render(){
        return(
            <Fragment>
				<input autoComplete = "off" type = "text" 
				placeholder = "Search..."
				onChange = {async (e) => {
                   await this.handleChange(e); 
				   await this.filterEntries(); 
				   await this.props.handleSearch(this.state.filtered_entries); 
                }} value = {this.state.query_string} name = "query_string" placeholder = "Search"/>
            </Fragment>
        )
    }
}

export default Search