import React, { Component } from 'react'
import {Table,Layout} from 'antd';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";
import axios from 'axios';

import './StoresTable.css';

const API = 'https://main-server-si.herokuapp.com/api/business/offices';

export default class StoresTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                },
                {
                    title: 'City',
                    dataIndex: 'city',
                },
                {
                    title: 'Country',
                    dataIndex: 'country',
                },
                {
                    title: 'Phone',
                    dataIndex: 'phoneNumber',
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                },

            ], isLoading: false,
        };
    }

    componentDidMount() {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.common['Content-Type'] = "application/json";
        this.setState({isLoading: true});
        axios.get(API)
        .then(response => {
            console.log(response);
             this.setState({ offices : response.data});
        })
    }

    render() {
        const dataSource = this.state.offices;
        const columns = this.state.columns;
        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                          token={this.props.token}
                          username={this.props.username}
                          handleLogout={this.props.handleLogout}/>
                <div className="ant-table">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                    />
                </div>
                <Footer/>
            </Layout>
        );
    }
}
