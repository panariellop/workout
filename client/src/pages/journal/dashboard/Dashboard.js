import React, { Fragment } from 'react'
import DashboardDate from './components/dashboard_date.js'
import RefreshAccessToken from '../../../scripts/RefreshAccessToken'
import Cookies from 'js-cookie';
import Search from './components/Search'
import { Link } from 'react-router-dom';

class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          loading: true, 
          entries: [],
          raw_entries: [],
          query_string: "",
					num_entries: 30, //controlls the rendering of how many entries on the dashboard page 
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleFetchEntries = this.handleFetchEntries.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    async handleFetchEntries(){
      this.setState({
        loading: true, 
      })
      const re = /^[0-9\b]+$/;
      var num_entries = this.state.num_entries; 
      //re.test tests for non-alpha characters 
      if(num_entries == null || num_entries <=0 || !re.test(num_entries)){
        num_entries = 1
      }

      var entries = []
      //update tokens
      const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
      .catch(e => console.log(e));
      Cookies.set('accessToken', newAccessToken)
      //make query to get all user entries
      await fetch("/api/journal/entries", {
        method: 'post',
        headers: {
          'x-auth-token': Cookies.get('accessToken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          num_entries: num_entries
        })
      })
      .then(res => res.json())
      .then(data => {
        //Confirm that the data is valid
        if(data !== undefined){
          entries = data
          this.setState({ raw_entries: data })
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
        if(new Date(prev_entry.date).getDay() === new Date(entries[i].date).getDay()){
          //push the entry to the array with the same date
          days[days.length-1].push(entries[i])
        }else{
          //create new dimension with the newest date being the first item
          days.push([entries[i]])
        }
        //make the previous entry the current entry as we move on
        prev_entry = entries[i]
      }

      this.setState({
        entries: days,
        loading: false, 
      })
    }

    //Handles grabbing of all entries and saving them in state  
    async componentDidMount(){
      this.handleFetchEntries()
    }

    handleSearch(data){
      this.setState({
        loading: true, 
      })
      var days = [[]]
      var prev_entry = null
      var entries = []
      if(data.length>0){
        entries = data
      }else{
        entries = this.state.raw_entries
      }
      
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
      this.setState({
        entries: days,
        loading: false, 
      })
      
    }

    

    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      })

    }

    render(){
      var days = null; 
      if(this.state.entries.length>0){
        days = this.state.entries.map((day, i) => <DashboardDate key={i} props = {day}/>)
      }
        return(
            <Fragment>
              <Link className = "link" to = "/entry/new"><button className = "dashboard-journal-newentry-btn">+</button></Link>

              <Search handleSearch = {this.handleSearch} entries = {this.state.raw_entries}/>

              <ul className = "dashboard-journalwrapper">
                {(days || !this.state.loading)? days: <h2>Add some entries to view them here...</h2>}
              </ul>

              <div className = "dashboard-numentries-wrapper">
                <label>Max Number of Entries:</label>
                <input autoComplete = "off" type = "tel" name = "num_entries" placeholder = "Number of entries to display..." value = {this.state.num_entries} onChange = {async (e) => {
                  await this.handleChange(e);
                  await this.handleFetchEntries();
                }}/>
              </div>
            </Fragment>
        )
    }
}

export default Dashboard
