import React, {Fragment} from 'react';
import DashboardEntry from './dashboard_entry.js'
import RefreshAccessToken from '../../../../scripts/RefreshAccessToken'
import Cookies from 'js-cookie'

class DashboardDate extends React.Component{
  constructor(props){
    super(props)

    this.state = {
    }
		this.handleNew = this.handleNew.bind(this);

  }

	async handleNew(){
		//grab the date from the component, make a new entry object and save it to db,
		//pass the id into the url and forward the user to that url 
		const cur_date = this.props.props[0].date;
    //update tokens
    const newAccessToken = await RefreshAccessToken(Cookies.get('refreshToken'))
    .catch(e => console.log(e));
    await Cookies.set('accessToken', newAccessToken)
 
		await fetch('/api/journal/', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': Cookies.get('accessToken')
			},
			body: JSON.stringify({
				date: cur_date,
				exercise: "undefined", 
			})
		})
		.then(res => res.json())
		.then(data => {
			window.location.assign('/entry/'+data._id);
		})

	}

  render(){
    //props get input as an array
    const {props} = this.props
    const entries = props.map((entry, i)=> <DashboardEntry key = {i} props = {entry}/>)

    return(
      <Fragment>
      <p className = "dashboard-journalday-overview-date">
        {new Date(props[0].date).toLocaleDateString()}
        <button onClick = {this.handleNew}className = "dashboard-journalday-addentry-btn">+</button>
      </p>
        <div className = "dashboard-journalday-overview">
          {entries}
        </div>
      </Fragment>
    )
  }

}

export default DashboardDate
