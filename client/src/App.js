import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './pages/auth/Login'; 
import Register from './pages/auth/Register'; 
import Logout from './pages/auth/Logout';

import Navbar from './components/Navbar';

import Dashboard from './pages/journal/dashboard/Dashboard';
import Profile from './pages/profile/Profile';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Fragment>
      <Navbar/>
      <Switch>
        <Route path = '/login' component = {Login}/>
        <Route path = '/register' component = {Register}/>
        <Route path = '/logout' component = {Logout}/>
        <Route path = '/dashboard' component = {Dashboard}/>
        <Route path = '/profile' component = {Profile}/>
      </Switch>
    </Fragment>
    </BrowserRouter>
  );
}

export default App;
