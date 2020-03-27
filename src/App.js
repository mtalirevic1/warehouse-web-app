import React from 'react';
import './App.css';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './components/homePage/HomePage';

import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={Header}></Route>
        <Route path="/" exact component={Login}></Route>
        <Route path="/" component={Footer}></Route>
        <Route path="/homepage" component={HomePage}></Route>
      </div>
    </Router>
  );
}

export default App;
