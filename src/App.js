import React, { Component } from 'react';
import './App.css';
import Login from './components/login/Login';
import HomePage from './components/homePage/HomePage';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import ProductsTable from "./components/productsTable/ProductsTable";
import ReceivedLogs from "./components/logs/ReceivedLogs";
import SentLogs from "./components/logs/SentLogs";
import StoresTable from "./components/storesTable/StoresTable";
import Notifications from "./components/notifications/Notifications";
import ShipmentRequests from "./components/shipmentRequests/ShipmentRequests";
import Graphs from "./components/graphs/Graphs";

let socket, stompClient;
const SERVER_URL = 'https://log-server-si.herokuapp.com/ws';

const ProtectedRoute = ({ component: Comp, loggedInStatus, username, token, notifications, path, handleLogout, handleAddNotification, handleDeleteNotification, ...rest }) => {
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
                        notifications={notifications}
                        handleLogout={handleLogout}
                        handleAddNotification={handleAddNotification}
                        handleDeleteNotification={handleDeleteNotification}
                    />
                    : <Redirect to={{
                        pathname: "/"
                    }} />;
            }}
        />
    );
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            username: "",
            token: "",
            notifications: [],
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleAddNotification = this.handleAddNotification.bind(this);
        this.handleDeleteNotification = this.handleDeleteNotification.bind(this);
    }

    componentDidMount() {
        socket = new SockJS(SERVER_URL);
        stompClient = Stomp.over(socket);

            stompClient.connect({}, () => {
            if (stompClient.connected) {
                stompClient.subscribe('/topic/warehouse', msg =>
                 {
                    let data = JSON.parse(msg.body);
                    const newNotification = data.payload.description;
                    const action = data.payload.action;
                    if(action == "open_office" || action == "close_office"){
                        this.handleAddNotification({
                            title: "New notification: " + newNotification,
                            description: new Date().toLocaleString(),
                            href: "/homepage",
                            type: "success"
                        });
                    }
                    else if(action == "request_products_to_office"){
                    this.handleAddNotification({
                        title: "New notification: " + newNotification,
                        description: new Date().toLocaleString(),
                        href: "/requests",
                        type: "success"
                    });
                    }
                });

            }
            }, (err) => {
            console.log('Connection error!');
            });
        }

    handleLogin(data) {
        this.setState({
            loggedInStatus: "LOGGED_IN",
            username: data.username,
            token: data.token,
            notifications: []
        })
    }

    handleLogout() {
        this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            username: "",
            token: "",
            notifications: []
        })
    }

    handleAddNotification(notification) {
        const currentNotifications = this.state.notifications;
        currentNotifications.unshift(notification);
        this.setState({ notifications: currentNotifications });
    }

    handleDeleteNotification(index) {
        const currentNotifications = this.state.notifications;
        currentNotifications.splice(index, 1);
        this.setState({ notifications: currentNotifications });
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
                                handleAddNotification={this.handleAddNotification}
                                handleDeleteNotification={this.handleDeleteNotification}
                            />
                        )}
                    />

                    <ProtectedRoute
                        path="/homepage"
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={HomePage}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />

                    <ProtectedRoute
                        path="/productsTable"
                        exact
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={ProductsTable}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />

                    <ProtectedRoute
                        path="/requests"
                        exact
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={ShipmentRequests}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />

                    <ProtectedRoute
                        path="/sentLogs"
                        exact
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={SentLogs}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />

                    <ProtectedRoute
                        path="/receivedLogs"
                        exact
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={ReceivedLogs}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />

                    <ProtectedRoute
                        path="/storesTable"
                        exact
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={StoresTable}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />
                    <ProtectedRoute
                        path="/notifications"
                        exact
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={Notifications}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />
                    <ProtectedRoute
                        path="/graphicStatistics"
                        exact
                        loggedInStatus={this.state.loggedInStatus}
                        token={this.state.token}
                        username={this.state.username}
                        notifications={this.state.notifications}
                        component={Graphs}
                        handleLogout={this.handleLogout}
                        handleAddNotification={this.handleAddNotification}
                        handleDeleteNotification={this.handleDeleteNotification}
                    />
                </Router>
            </div>
        );
    }
}

export default App;
