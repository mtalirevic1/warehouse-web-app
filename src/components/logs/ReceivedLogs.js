import React, {Component} from "react";
import axios from "axios";
import {Layout, Table, message} from "antd";
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";


export default class ReceivedLogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    key: '1',
                    title: 'Product name',
                    dataIndex: 'productName',
                },
                {
                    key: '2',
                    title: 'Quantity',
                    dataIndex: 'quantity',
                },
                {
                    key: '3',
                    title: 'Collection date',
                    dataIndex: 'date',
                },
                {
                    key: '4',
                    title: 'Collection time',
                    dataIndex: 'time',
                },
            ],
            isLoading: false,
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/warehouse/log')
            .then(response => {this.setState({logs: response.data, isLoading: false})})
            .catch(er => {
                console.log("ERROR: "+er);
                message.error("Unable to show logs!", [0.7]);
            });
    }

    render() {
        const dataSource = this.state.logs;
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
