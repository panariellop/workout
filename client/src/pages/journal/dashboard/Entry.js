import React, {Fragment} from 'react';

class Entry extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      exercise: "",
      location: "",
      date: new Date().toISOString().slice(0,10),
      sets: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSetChange = this.handleSetChange.bind(this)
    this.handleNewSet = this.handleNewSet.bind(this)
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
      sets: [...this.state.sets, newSet]
    })
  }

  handleSetChange(e){
    const index = e.target.id
    const name = e.target.name
    let newArray = [...this.state.sets]
    newArray[index] = {...newArray[index], [name]: e.target.value}
    this.setState({
      sets: newArray
    })
  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log(this.state)
  }


  render(){
    var sets = this.state.sets.map((set, i)=> {
        return (
          <li key = {i}>
            <p>Set {i+1}</p>
            <input type = "text" name = "weight" id = {i} onChange = {this.handleSetChange}/>
            <input type = "tel" name = "reps" id = {i} onChange = {this.handleSetChange}/>
            <input type = "text" name = "units" id = {i} onChange = {this.handleSetChange}/>
            <input type = "text" name = "duration" id = {i} onChange = {this.handleSetChange}/>
            <input type = "text" name = "distance" id = {i} onChange = {this.handleSetChange}/>
            <input type = "text" name = "intensity" id = {i} onChange = {this.handleSetChange}/>
          </li>
        )
    })

    return (
      <Fragment>
        <form autoComplete="off"className = "journalentry-form" onSubmit = {this.handleSubmit}>
          <input type="text" placeholder = "Exercise" name = "exercise" onChange = {this.handleChange}/><br/>
          <input type="text"  placeholder = "Location" name = "location" onChange = {this.handleChange}/><br/>
          <input type = "date" name = "date" defaultValue = {this.state.date} onChange = {this.handleChange}/><br/>
          <h3>Sets:</h3>
          <ul>
            {sets}
          </ul>
        </form>
        <button onClick = {this.handleNewSet}>NEW SET</button>
      </Fragment>
    )
  }
}

export default Entry
