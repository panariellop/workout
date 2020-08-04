import React, {Fragment} from 'react';
import DashboardEntry from './dashboard_entry.js'

class DashboardDate extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      showMoreInfo: false
    }
  }

  render(){
    const {props} = this.props
    const entries = props.map((entry, i)=> <DashboardEntry key = {i} props = {entry}/>)

    return(
      <Fragment>
      <p className = "dashboard-journalday-overview-date">{new Date(props[0].date).toLocaleDateString()}</p>
        <div className = "dashboard-journalday-overview">
          {entries}
        </div>
      </Fragment>
    )
  }

}

export default DashboardDate
