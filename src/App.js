import React, { Component } from 'react';
import './App.css';
import Login from './components/login/Login';
import HomePage from './components/homePage/HomePage';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';


const ProtectedRoute = ({ component: Comp, loggedInStatus, username, token, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return loggedInStatus === "LOGGED_IN"
          ? <Comp
            {...props}
            loggedInStatus={loggedInStatus}
            token={token}
            username={username}
          />
          : <Redirect to={{
            pathname: "/"
          }} />;
      }}
    />
  );
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      username: "",
      token: ""
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      username: data.username,
      token: data.token
    })
  }

  render() {
    return (
      <div className="App">
        <Router>

          <Route
            path="/"
            exact
            render={props => (
              <Login
                {...props}
                handleLogin={this.handleLogin}
              />
            )}
          />

          <ProtectedRoute
            path="/homepage"
            loggedInStatus={this.state.loggedInStatus}
            token={this.state.token}
            username={this.state.username}
            component={HomePage}
          />

        </Router >
      </div >
    );
  }
}

export default App;
