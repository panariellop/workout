import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './pages/auth/Login'; 
import Register from './pages/auth/Register'; 
import Logout from './pages/auth/Logout';
import Navbar from './components/Navbar';
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
      </Switch>
    </Fragment>
    </BrowserRouter>
  );
}

export default App;
