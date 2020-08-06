import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
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
          <p key = {i}>Set {i+1})   Weight: {set.weight} {set.units} | Reps: {set.reps} | Duration: {set.duration} | Intensity: {set.intensity}</p>
        )
    })

    const entry_edit_link = "/entry/" + props._id

    return(
      <Fragment>
        <div className = "dashboard-journalentry-overview">
          <ul>
            <li className = "dashboard-journalentry-overview-title"><Link className = "link" to = {entry_edit_link}>{props.exercise}</Link>{caretToggle}</li>
            <li className = "dashboard-journalentry-overview-sets">{this.state.showSets && sets}</li>
          </ul>
        </div>
      </Fragment>
    )
  }
}

export default DashboardEntry
