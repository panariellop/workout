import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Logout from './pages/auth/Logout';

import Navbar from './components/Navbar';

import Dashboard from './pages/journal/dashboard/Dashboard';
import Entry from './pages/journal/dashboard/Entry';

import Profile from './pages/profile/Profile';

import About from './pages/about/About';
import Help from './pages/about/Help';

import Charts from './pages/charts/Charts'

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Fragment>
      <Navbar/>
      <div style = {{marginTop: "70px"}}>
      <Switch>
        <Route path = '/login' component = {Login}/>
        <Route path = '/register' component = {Register}/>
        <Route path = '/logout' component = {Logout}/>

        <Route path = '/dashboard' component = {Dashboard}/>
        <Route path = '/entry/:id' component = {Entry}/>
        <Route path = '/profile' component = {Profile}/>

        <Route path = '/about' component = {About}/>
        <Route path = '/help' component = {Help}/>

        <Route path = '/charts' component = {Charts}/>
      </Switch>
    </div>
    </Fragment>
    </BrowserRouter>
  );
}

export default App;
