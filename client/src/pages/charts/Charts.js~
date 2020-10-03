import React, { Fragment } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts'; 

class Charts extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            startDate: new Date().toISOString().slice(0,10), 
            endDate: new Date().toISOString().slice(0,10), 
            chartKick: 0,
            set_number: -1, 
            raw_data: [],
            filtered_data: [],
            data_lines: ["weight"]
        }
        this.renderChart = this.renderChart.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleLinesChange = this.handleLinesChange.bind(this)
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
    async handleLinesChange(e){
        if(e.target.name === "new_line" && this.state.data_lines.length<2){
            var new_line = this.state.data_lines
            new_line.push("weight")
            this.setState({
                data_lines: new_line
            })
        }
        else if (e.target.name === "delete_line"){
            var new_line = this.state.data_lines
            new_line.splice(e.target.value, 1)
            this.setState({
                data_lines: new_line
            })
        }
        else{
            var new_lines = this.state.data_lines
            new_lines[e.target.name] = e.target.value 
            this.setState({
                data_lines: new_lines
            })
        }
    }
    
    render(){
		//Makes the y axis label from state 
        var y_axis_label = ""
        for(var i = 0; i<this.state.data_lines.length; i++){
            y_axis_label += this.state.data_lines[i].charAt(0).toUpperCase()+this.state.data_lines[i].slice(1)
            if(i!==this.state.data_lines.length-1){
                y_axis_label += ", "
            }
        }
        return(
            <Fragment>
                <div style = {{marginTop: '100px'}}>
                <ResponsiveContainer 
                width = '100%' height = {500}>
                    <LineChart 
                        key = {this.state.chartKick} data = {this.state.filtered_data} syncId = "anyId">
                        <XAxis dataKey = "date" height = {100} label = {{value: "Date"}}/>
                        <YAxis 
                            orientation = "left"
                            scale = "linear"
                            domain = {['dataMin', 'auto']}
							label = {{value: y_axis_label, angle: -90, position: 'insideLeft'}}/>
                        {this.state.data_lines.map((line, i)=> {
                            if(i===1){
                                return(
                                <Line yAxisId = "2" key = {i} type = 'monotone' dataKey = {this.state.data_lines[i]} stroke="#fa3232" activeDot={{ r: 8 }} />
                                )
                            }else{
                                return(
                                <Line yAxisID = "1" key = {i} type = 'monotone' dataKey = {this.state.data_lines[i]} stroke="#8884d8" activeDot={{ r: 8 }} />
                                )
                            }
                        })}
                        {this.state.data_lines.length === 2? 
                        <YAxis 
                            yAxisId = "2"
                            scale = "linear"
                            orientation = "right"
							domain = {['dataMin', 'auto']}
							dataKey = {this.state.data_lines[1]}
                            /> : null}
                        <Tooltip/>
                        
                    </LineChart>
                </ResponsiveContainer>
                </div>          
				<div className = "charts-options-wrapper">
                <p>Chart Options</p>
                
                {this.state.data_lines.map((line, i) => {
                    return (<Fragment key = {i}>
                        <label>Line {i+1})</label>
                        <select className = "charts-option-yaxis" value = {this.state.data_lines[i]} name = {i} onChange = {this.handleLinesChange}>
                            <option value = "weight">Weight</option>
                            <option value = "reps">Reps</option>
                            <option value = "distance">Distance</option>
                            <option value = "duration">Duration</option>
                            <option value = "intensity">Intensity</option>
                        </select>
                        
                        <button name = "delete_line" onClick = {this.handleLinesChange} value = {i}>-</button>
                        <br/>
                    </Fragment>)
                })}
                {this.state.data_lines.length<2? <button onClick = {this.handleLinesChange} name = "new_line">+</button>:null}
                
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
                </div>

                <div className = "chart-history-wrapper">
                    <h3>History</h3>
                    {this.state.filtered_data.reverse().map((value, i)=> {
                        return(
                        <Fragment>
                            <div className = "chart-history-entry">
								<h3>{this.state.filtered_data[i].date}</h3>
                                <ul>
                                    {this.state.filtered_data[i].weight &&
										<li>Weight: {this.state.filtered_data[i].weight}</li>}
									{this.state.filtered_data[i].units &&
										<li>Units: {this.state.filtered_data[i].units}</li>}
									{this.state.filtered_data[i].reps &&
										<li>Reps: {this.state.filtered_data[i].reps}</li>}
									{this.state.filtered_data[i].duration &&
										<li>Duration: {this.state.filtered_data[i].duration}</li>}
									{this.state.filtered_data[i].intensity &&
										<li>Intensity: {this.state.filtered_data[i].intensity}</li>}
                                </ul>
                            </div>
                        </Fragment>
                        )
                    })}
                </div>
            </Fragment>
        )
    }
}

export default Charts
