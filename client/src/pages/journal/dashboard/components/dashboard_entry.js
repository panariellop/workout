import React, {Fragment} from 'react'

class DashboardEntry extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showSets: false
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle(){
    this.setState({
      showSets: !this.state.showSets
    })
  }

  render(){
    const {props} = this.props

    let caretToggle;
    if(this.state.showSets){
      caretToggle = <button className = "dashboard-journalentry-overview-toggle-up" onClick = {this.handleToggle}>▲</button>
    }else{
      caretToggle = <button className = "dashboard-journalentry-overview-toggle-down" onClick = {this.handleToggle}>
        ▼   {props.sets.length} sets {props.location && <Fragment>at {props.location}</Fragment>}
      </button>
    }

    const sets = props.sets.map((set, i)=> {
        return (
          <p key = {i}>Set {i+1})   Weight: {set.weight} | Reps: {set.reps} | Duration: {set.duration} | Intensity: {set.intensity}</p>
        )
    })

    return(
      <Fragment>
        <div className = "dashboard-journalentry-overview">
          <ul>
            <li className = "dashboard-journalentry-overview-title">{props.exercise}{caretToggle}</li>
            <li className = "dashboard-journalentry-overview-sets">{this.state.showSets && sets}</li>
          </ul>
        </div>
      </Fragment>
    )
  }
}

export default DashboardEntry
