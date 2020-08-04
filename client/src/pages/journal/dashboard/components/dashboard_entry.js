import React, {Fragment} from 'react'

class DashboardEntry extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    const {props} = this.props
    return(
      <Fragment>
        <div className = "dashboard-journalentry-overview">
          <ul>
            <li className = "dashboard-journalentry-overview-title">{props.exercise}</li>
          </ul>
        </div>
      </Fragment>
    )
  }
}

export default DashboardEntry
