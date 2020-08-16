import React, { Fragment } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'; 

class Charts extends React.Component{
    constructor(props){
        super(props)
        this.state = {
						chartKick: 0,
            value: "weight",
            set_number: -1, 
            raw_data: [],
            filtered_data: []
        }
        this.renderChart = this.renderChart.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

   renderChart(){//Updates the filtered_data array in the state 
        this.setState({
					filtered_data: null 
				})
				console.log(this.state.filtered_data);
        //Need to iterate through the entirety of the raw data exercise, then their sets 
        for(var i = 0; i<this.props.location.state.raw_data.length; i++){
            for (var j = 0; j<this.props.location.state.raw_data[i].sets.length; j++){
                //push specific set number 
                if(parseInt(this.state.set_number) !== -1 && parseInt(this.state.set_number) === j){
                    var new_sets = this.state.filtered_data
                    new_sets.push(this.props.location.state.raw_data[i].sets[j])
                    this.setState({
                        //Push each set to the set array 
                        filtered_data: new_sets
                    })
                    break; 
                }
                //push all sets 
                else if(parseInt(this.state.set_number) === -1){
                    var new_sets = this.state.filtered_data
                    new_sets.push(this.props.location.state.raw_data[i].sets[j])
                    this.setState({
                        //Push each set to the set array 
                        filtered_data: new_sets
                    })
                }
            }
        }
    }

    componentDidMount() {
				this.setState({
            raw_data: this.props.location.state.raw_data
        })
        this.renderChart() 
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value,
						filtered_data: []
        })
        if(e.target.name === "set_number"){
						//kicks the chart to refresh it 
						this.setState({
							chartKick: this.state.chartKick + 1
						})
        }
        this.renderChart()
    }

    render(){
        return(
            <Fragment>
                <h1>Charts</h1>
                <ResponsiveContainer width = '100%' aspect={5/2}>
                <LineChart key = {this.state.chartKick} data = {this.state.filtered_data} syncId = "anyId">
                    <XAxis dataKey = "date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type = 'monotone' dataKey = {this.state.value} stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>

                <h5>Options</h5>
                <label>Y-axis:</label>
                <select value = {this.state.value} name = "value" onChange = {this.handleChange}>
                    <option value = "weight">Weight</option>
                    <option value = "reps">Reps</option>
                    <option value = "distance">Distance</option>
                    <option value = "duration">Duration</option>
                    <option value = "intensity">Intensity</option>
                </select>
                <br/>
                <label>Sets</label>
                <select value = {this.state.set_number} name = "set_number" onChange = {this.handleChange}>
                    <option value = {-1}>All</option>
                    <option value = {0}>1st Set</option>
                    <option value = {1}>2nd Set</option>
                    <option value = {2}>3rd Set</option>
                    <option value = {3}>4th Set</option>
                    <option value = {4}>5th Set</option>
                </select>
            </Fragment>
        )
    }
}

export default Charts
