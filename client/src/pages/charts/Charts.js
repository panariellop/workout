import React, { Fragment } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts'; 

class Charts extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            startDate: new Date().toISOString().slice(0,10), 
            endDate: new Date().toISOString().slice(0,10), 
            chartKick: 0,
            value: "weight",
            set_number: -1, 
            raw_data: [],
            filtered_data: []
        }
        this.renderChart = this.renderChart.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

   renderChart(){//Updates the filtered_data array in the state 
        //Need to iterate through the entirety of the raw data exercise, then their sets 
        for(var i = 0; i<this.props.location.state.raw_data.length; i++){
            //Filter any date that does not fall into the start/endDate range 
            if(new Date(this.state.startDate) > new Date(this.props.location.state.raw_data[i].date) || new Date(this.state.endDate) < new Date(this.props.location.state.raw_data[i].date)){
                continue;
            }
            for (var j = 0; j<this.props.location.state.raw_data[i].sets.length; j++){
                //push specific set number 
                if(parseInt(this.state.set_number) !== -1 && parseInt(this.state.set_number) === j){
					//appends filtered_data 
					var new_sets = this.state.filtered_data
					var new_set = this.props.location.state.raw_data[i].sets[j]
					new_set.date = new Date(this.props.location.state.raw_data[i].date).toISOString().slice(0,10)
                    new_sets.push(new_set)
                    this.setState({
                        //Push each set to the set array 
                        filtered_data: new_sets,
                        //kicks the chart to refresh it 
                        chartKick: this.state.chartKick + 1,

                    })
                    break; 
                }
                //push all sets 
                else if(parseInt(this.state.set_number) === -1){
					// add date to each set 
					var new_sets_all = this.state.filtered_data
					var new_dates = this.props.location.state.raw_data[i].sets[j]
					new_dates.date = new Date(this.props.location.state.raw_data[i].date).toISOString().slice(0,10)
                    new_sets_all.push(new_dates)
                    this.setState({
                        //Push each set to the set array 
                        filtered_data: new_sets_all, 
                        //kicks the chart to refresh it 
                        chartKick: this.state.chartKick + 1,
                    })
                }
            }
		}
		this.setState({
			//chronological ordering 
			filtered_data: this.state.filtered_data.reverse()
		})
        
    }

    async componentDidMount() {
		await this.setState({
			raw_data: this.props.location.state.raw_data,
			endDate: new Date(this.props.location.state.raw_data[0].date).toISOString().slice(0,10),
			startDate: new Date(this.props.location.state.raw_data[this.props.location.state.raw_data.length-1].date).toISOString().slice(0,10)
		})
		await this.renderChart() 
    }

    async handleChange(e){
		await this.setState({
			[e.target.name]: e.target.value,
			filtered_data: [],
		})	 
		await this.renderChart()
    }

    handleSave(){
        //TODO save the chart to a png 
    }
			

    render(){
		//Capps the value for the y-axis lable
		var y_axis_label = this.state.value.charAt(0).toUpperCase()+this.state.value.slice(1)
        return(
            <Fragment>
                <ResponsiveContainer width = '100%' aspect={5/2}>
                    <LineChart key = {this.state.chartKick} data = {this.state.filtered_data} syncId = "anyId">
                        <XAxis dataKey = "date" height = {100} label = {{value: "Date"}}/>
						<YAxis 
							domain = {['dataMin', 'dataMax']}
							label = {{value: y_axis_label, angle: -90, position: 'insideLeft'}}/>
                        <Tooltip/>
                        <Line type = 'monotone' dataKey = {this.state.value} stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
								
							<div className = "charts-options-wrapper">
                <p>Chart Options</p>
                <label>Y-axis:</label>
                <select className = "charts-option-yaxis" value = {this.state.value} name = "value" onChange = {this.handleChange}>
                    <option value = "weight">Weight</option>
                    <option value = "reps">Reps</option>
                    <option value = "distance">Distance</option>
                    <option value = "duration">Duration</option>
                    <option value = "intensity">Intensity</option>
                </select>
                <br/>
				<label>Sets: </label>
                <select className = "charts-option-set" value = {this.state.set_number} name = "set_number" onChange = {this.handleChange}>
                    <option value = {-1}>All</option>
                    <option value = {0}>1st Set</option>
                    <option value = {1}>2nd Set</option>
                    <option value = {2}>3rd Set</option>
                    <option value = {3}>4th Set</option>
                    <option value = {4}>5th Set</option>
                </select>
                <br/>
                <h3>Filter Data</h3>
                <label>Start Date: </label>
                <input type = "date" value = {this.state.startDate} name = "startDate" onChange = {this.handleChange} />
                <br/>
                <label>End Date: </label>
                <input type = "date" value = {this.state.endDate} name = "endDate" onChange = {this.handleChange} />
                <button onClick = {this.handleSave} >SAVE CHART</button>
                </div>
            </Fragment>
        )
    }
}

export default Charts
