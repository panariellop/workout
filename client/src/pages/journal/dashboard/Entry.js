import React, {Fragment} from 'react';
import RefreshAccessToken from '../../../scripts/RefreshAccessToken'
import Cookies from 'js-cookie'

class Entry extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      saved: false,
      _id: "",
      exercise: "",
      location: "",
      date: new Date().toISOString().slice(0,10),
      sets: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSetChange = this.handleSetChange.bind(this)
    this.handleNewSet = this.handleNewSet.bind(this)
    this.handleSetDelete = this.handleSetDelete.bind(this)
    this.handleBack = this.handleBack.bind(this)
		this.handleEntryDelete = this.handleEntryDelete.bind(this)
  }

  async componentDidMount(){
    //Check for any entries in the database that match the id of the entry 
    //update tokens
    const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
    .catch(e => console.log(e));
    Cookies.set('accessToken', newAccessToken)
    //make api call 
    const entry_route = "/api/journal/" + this.props.match.params.id; 
    await fetch(entry_route, {
      method: 'get',
      headers: {
        'x-auth-token': Cookies.get('accessToken')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data!== undefined){
        //make the state what the server sends back 
        this.setState({
          saved: true, 
          _id: data._id,
          exercise: data.exercise,
          location: data.location,
          date: data.date.slice(0,10), 
          sets: data.sets,
        })
      }
    })
    .catch(e => console.log(e))
  }

	async handleEntryDelete(){
		const c = window.confirm("Are you sure you want to delete this entry?")
		if(!c) return
		//Handle updating tokens 
		const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
    .catch(e => console.log(e));
    Cookies.set('accessToken', newAccessToken)
    
		await fetch("/api/journal/" + this.state._id, {
			method: 'delete',
			headers: {
				'x-auth-token': Cookies.get('accessToken')
			}
		})
		.then(() => {
			window.location.assign('/dashboard')
		})
		.catch(e=> console.log(e))	
	}

  handleNewSet(){
    const newSet = {
      weight: "",
      units: "",
      duration: "",
      distance: "",
      reps: "",
      intensity: ""
    }
    this.setState({
      sets: [...this.state.sets, newSet],
      saved: false 
    })
  }

  handleSetDelete(e){
    const c = window.confirm(`Delete set ${(parseInt(e.target.id) + 1)}?`)
    if(!c) return 
    const index = e.target.id
    let arr = this.state.sets
    arr.splice(index, 1)
    this.setState({
      sets: arr,
      saved: false 
    })
  }

  handleSetChange(e){
    const index = e.target.id
    const name = e.target.name
    let newArray = [...this.state.sets]
    newArray[index] = {...newArray[index], [name]: e.target.value}
    this.setState({
      sets: newArray,
      saved: false
    })
  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value,
      saved: false
    })
  }

  handleBack(){
    window.history.back();
  }

  async handleSubmit(e){
    e.preventDefault()
    //update tokens
    const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
    .catch(e => console.log(e));
    Cookies.set('accessToken', newAccessToken)
    //make api calls to update or create 
    if (this.props.match.params.id === "new"){
      //create new entry 
      fetch("/api/journal", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('accessToken')
        },
        body: JSON.stringify(this.state)
      }).then(res => {
        if(res.status === 200){
          this.setState({saved: true})
        }
      })
    }else{
      //update entry 
      const update_route = "/api/journal/" + this.state._id
      fetch(update_route, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('accessToken')
        },
        body: JSON.stringify(this.state)
      }).then(res => {
        if(res.status === 200){
          this.setState({saved: true})
        }
      })
    }

  }
   

  render(){
    var sets = this.state.sets.map((set, i)=> {
        return (
          <li key = {i} className = "journal-newset-list">
            <p className = "journal-newset-settitle" >Set {i+1} <button id = {i} type = "button" onClick = {this.handleSetDelete} className = "journal-set-delete-btn">DELETE</button></p>
            <ul className = "journal-newset-setfields">
              <li><label>Weight: </label>
                <input type = "tel" value = {set.weight} name = "weight" id = {i} onChange = {this.handleSetChange}/>
              </li>
              <li>
                <label>Units: </label>
                <input type = "text" value = {set.units} name = "units" id = {i} onChange = {this.handleSetChange}/>
              </li>
              
              <li>
                <label>Reps: </label>
                <input type = "tel" value = {set.reps} name = "reps" id = {i} onChange = {this.handleSetChange}/>
              </li>
              <li>
                <label>Duration: </label>
                <input type = "text" value = {set.duration} name = "duration" id = {i} onChange = {this.handleSetChange}/>
              </li>
              <li>
                <label>Distance: </label>
                <input type = "text" value = {set.distance} name = "distance" id = {i} onChange = {this.handleSetChange}/>
              </li>
              <li>
                <label>Intensity: </label>
                <input type = "text" value = {set.intensity} name = "intensity" id = {i} onChange = {this.handleSetChange}/>
              </li>
              <li>
                
              </li>
            </ul>
          </li>
        )
    })

    return (
      <Fragment>
        <button className = "journalentry-back-btn" onClick = {this.handleBack}>‹</button>
        <div className = "journalentry-wrapper">
        <form autoComplete="off"className = "journalentry-form" onSubmit = {this.handleSubmit}>
          <div className = "jounralentry-form-input">
            <input type="text" placeholder = "Exercise" value = {this.state.exercise} name = "exercise" onChange = {this.handleChange}/><br/>
            <input type="text"  placeholder = "Location" value = {this.state.location} name = "location" onChange = {this.handleChange}/><br/>
            <input type = "date" name = "date" value = {this.state.date} onChange = {this.handleChange}/><br/>
            <h3>Sets:<button type = "button" className = "journal-new-set-btn" onClick = {this.handleNewSet}>+</button></h3>
          </div>
          <ul>
            {sets}
          </ul>
          
          <br/>
          {this.state.saved ? 
          <input className = "journalentry-form-submit-btn-saved" type = "submit" value = "SAVED"/> 
          : <input className = "journalentry-form-submit-btn" type = "submit" value = "SAVE"/>}
          
					<button className = "journalentry-delete-btn" type = "button" onClick = {this.handleEntryDelete}>DELETE</button>
        </form>
				

        </div>
      </Fragment>
    )
  }
}

export default Entry
