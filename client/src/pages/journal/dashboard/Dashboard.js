import React, { Fragment } from 'react'
import DashboardDate from './components/dashboard_date.js'
import RefreshAccessToken from '../../../scripts/RefreshAccessToken'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';


async function getUserEntries(){
  var entries = []
  //update tokens
  const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
  .catch(e => console.log(e));
  await Cookies.set('accessToken', newAccessToken)
  //make query to get all user entries
  await fetch("/api/journal", {
    method: 'get',
    headers: {
      'x-auth-token': Cookies.get('accessToken')
    }
  })
  .then(res => res.json())
  .then(data => {
    //Confirm that the data is valid
    if(data !== undefined){
      entries = data
    }
  })
  .catch(e=> console.log(e))
  //Adding entries to multidim array that is grouped by date
  var days = [[]]
  var prev_entry = null
  for(var i=0; i<entries.length; i++){
    if(prev_entry === null){
      prev_entry = entries[i]
    }
    if(new Date(prev_entry.date).toLocaleDateString() === new Date(entries[i].date).toLocaleDateString()){
      //push the entry to the array with the same date
      days[days.length-1].push(entries[i])
    }else{
      //create new dimension with the newest date being the first item
      days.push([entries[i]])
    }
    //make the previous entry the current entry as we move on
    prev_entry = entries[i]
  }
  return days
}


class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          entries: [],
          query_string: ""
        }
        this.handleChange = this.handleChange.bind(this)
    }

    async componentDidMount(){
      this.setState({
        entries: await getUserEntries()
      })
    }

    async filterEntries(){
      console.log("hi")
    }

    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      })
    }

    render(){
      const days = this.state.entries.map((day, i) => <DashboardDate key={i} props = {day}/>)
        return(
            <Fragment>
              <Link className = "link" to = "/entry/new"><button className = "dashboard-journal-newentry-btn">NEW ENTRY</button></Link>

              <input type = "text" name = "query_string" value = {this.state.query_string} placeholder = "Search" onChange = {this.handleChange, this.filterEntries}/>

              <ul className = "dashboard-journalwrapper">
                {days}
              </ul>
            </Fragment>
        )
    }
}

export default Dashboard
