import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'; 

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {
			query_string: "",
			canGraph: false, 
			query_inputs :[],
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
			this.setState({
				canGraph: false, 
			})
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
			//Get the day of the week 
			var day_of_week = null; 
			try{
				switch(user_input[1].toLowerCase()){
					default: 
						break;
					case "mon":
					case "monday":
						day_of_week = 0;
						break; 
					case "tues":
					case "tuesday":
						day_of_week = 1;
						break;
					case "wed":
					case "wednesday":
						day_of_week = 2; 
						break; 
					case "thurs":
					case "thur":
					case "thu":
					case "thursday":
						day_of_week = 3;
						break; 
					case "fri":
					case "friday":
						day_of_week = 4;
						break;
					case "sat":
					case "saturday":
						day_of_week = 5;
						break; 
					case "sun":
					case "sunday":
						day_of_week = 6;
						break; 
				}
			}catch(e){}
			//loop through each entry and only allow days of the week that match input 
			if(day_of_week!== null){
				for (var i = 0; i<this.props.entries.length; i++){
					try{
						//Specific day of the week  
						var entry_date = new Date(this.props.entries[i].date)
						entry_date = entry_date.getDay(); 

						if(day_of_week === entry_date){
							//push to filtered_entries array
							filtered_entries.push(this.props.entries[i])
						}
					}catch(e){}
				}
			}

		}
		//filter by name 
		else if(user_input[0] === "name"){
			this.setState({
				canGraph: true
			})
			for (var i = 0; i<this.props.entries.length; i++){
				//if the names match or if part of the name matches 
				try{
					if(this.props.entries[i].exercise.toLowerCase().includes(user_input[1].toLowerCase())){
						//push to filtered_entries array
						filtered_entries.push(this.props.entries[i])
					}
				}catch(e){}
			}
		}
		//filter by location 
		else if(user_input[0] === "location"){
			this.setState({
				canGraph: true
			})
			for (var i = 0; i<this.props.entries.length; i++){
				//if the location match or if part of the location matches 
				try{
					if(this.props.entries[i].location.toLowerCase().includes(user_input[1].toLowerCase())){
						//push to filtered_entries array
						filtered_entries.push(this.props.entries[i])
					}
				}catch(e){
					continue; 
				}
			}
		}
		else{
			this.setState({
				canGraph: false, 
			})
		}

		this.setState({
			query_inputs: user_input, 
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
							className = "journal-search-bar-input"
							onChange = {async (e) => {
												 await this.handleChange(e); 
								 await this.filterEntries(); 
								 await this.props.handleSearch(this.state.filtered_entries); 
											}} value = {this.state.query_string} name = "query_string" placeholder = "🔍"/>

							{this.state.canGraph&& 
								<Link
								className = "search-creategraph-link"
								to = {{
									pathname: '/charts',
									state: {
										raw_data: this.state.filtered_entries
									}
								}}>Create Chart📈</Link>
							}
            </Fragment>
        )
    }
}

export default Search
