import React from 'react';

class Help extends React.Component{

    render() {

        const container = {
            marginLeft: '15px',
            marginRight: '15px'
        }

        const listItem = {
            fontWeight: 'bold',

        }

        const listWrapper = {
            listStyleType: 'decimal'
        }

        return (
            <div style = {container}>
                <h1 style = {{textAlign: "center"}}>Help</h1>
                <h3>Dashboard</h3>
                <ul style = {listWrapper}>
                    <li style = {listItem}>How to use the search feature:</li>
                        <p>Click on the search <span role = "img">🔍</span> icon to start searching.</p>
                        <p>There are 3 keywords: name, location, and date.</p> 
                        <p>To query for a specific exercise's name, (for example exercises 
                            with the name Squat) then type <strong>name:Squat</strong></p>
                        <p>To search for entries on a specific date, (for example August 10, 2020) 
                        then type <strong>date:8/7/20</strong> <br/>Note: <strong>aug 7,2020</strong> 
                        and <strong>august 7,2020</strong> and any other variation that clearly 
                        specifies a date is also acceptable.</p>
                        <p>To search for entries at a specific location, (for example New York), 
                        then type <strong>location:New York</strong></p>
                    <li style = {listItem}>How to create entries:</li>
                        <p>To create an entry, then click the <strong>+</strong> button at 
                        the top of the dashboard page</p>
                    <li style = {listItem}>How to edit/view entries:</li>
                        <p>To view or edit a specific entry, then click on the entry's 
                        name on the dashboard page. As you hover over the name with your 
                        mouse, you should see the name turn blue, indicating that this entry 
                        can be clicked to be viewed in more detail. You can also perform a 
                        search using the search feature to narrow down the selection of entries.</p>
                    <li style = {listItem}>How to delete an entry:</li>
                        <p>To delete an entry, first view the entry by clicking on it 
                        in the dashboard. Then, scroll to the bottom  of the entry page 
                        and hit the delete button in the bottom right hand corner. Then 
                        confirm the deletion</p>
                    <li style = {listItem}>How to view more entries on the dashboard page:</li>
                        <p>To view more entries, scroll to the bottom of the dashboard 
                        page and enter a number larger than the one shown. To view all 
                        entries, enter a very large number in the input field.</p>
                </ul>
                <h3>Profile</h3>
                <ul style = {listWrapper}>
                    <li style = {listItem}>How to change your password:</li>
                        <p>To change your password, first navigate to the profile page 
                        using the navbar. Then, click <strong>CHANGE PASSWORD</strong> 
                        button next to your password. Follow the prompts. You should see 
                        a success message at the end. Note that the prompt will not convert
                         the characters you type into <strong>*</strong>, so make sure nobody
                          is looking when you type in your passwords.</p>
                    <li style = {listItem}>How to delete your account:</li>
                        <p>If you would no longer like to hold an account with us, 
                        then you can opt to delete you account. You must be logged in 
                        to your account first. Then navigate to the profile page using
                         the navbar and click the <strong>DELETE ACCOUNT</strong> button at 
                         the bottom of the page. Follow the prompts. Your account will then 
                         be deleted. There is no way to recover an account once deleted. </p>
                </ul>
            </div>
        )
    }
}

export default Help 
