import React, { Component } from 'react'
import { Table, Layout, Popconfirm, message, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";

import './ShipmentRequests.css';


const API = 'https://main-server-si.herokuapp.com/api/products';

const { Option } = Select;

export default class ProductsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    dataIndex: "requestId",
                    width: '10%'
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    render: (text, record) => (
                        <span>
                          <a>{record.office.address}</a>
                        </span>
                    )
                },
                {
                    title: 'Details',
                    dataIndex: 'details',
                    width: '10%',
                    render: (text, record) =>
                        this.state.requests.length >= 1 ? (
                            <div>
                                <a
                                    key={record.requestdId}
                                    onClick={() => this.onOpenDetails(record)}>Details</a>
                                <div>{this.renderDetails(record)}</div>
                            </div>
                        ) : null
                },
                {
                    title: 'Accept',
                    dataIndex: 'accept',
                    width: '10%',
                    render: (text, record) =>
                        this.state.requests.length >= 1 ? (
                            <Popconfirm title={"Are you sure you want to accept this request?"} 
                                        onCancel={() => this.onCloseAccept}
                                        onConfirm={() => this.handleAccept(record)}>
                                <a>Accept</a>
                            </Popconfirm>
                        ) : null
                },
                {
                    title: 'Deny',
                    dataIndex: 'deny',
                    width: '10%',
                    render: (text, record) =>
                        this.state.requests.length >= 1 ? (
                            <Popconfirm title={"Are you sure you want to deny this request?"} 
                                        onCancel={() => this.onCloseDeny}
                                        onConfirm={() => this.handleDeny(record)}>
                                <a>Deny</a>
                            </Popconfirm>
                        ) : null
                },
            ],
            columnsProducts: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                          <a>{record.product.name}</a>
                        </span>
                    )
                },
                {
                    title: 'Barcode',
                    dataIndex: 'barcode',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                          <a>{record.product.barcode}</a>
                        </span>
                    )
                },
                {
                    title: 'Availavble quantity',
                    dataIndex: 'availableQuantity',
                    width: '20%'
                },
                {
                    title: 'Requested quantity',
                    dataIndex: 'quantity',
                    width: '20%'
                },
                {
                    title: 'Available',
                    dataIndex: 'available',
                    width: '20%',
                    render: (text, record) => 
                          record.availableQuantity >= record.quantity ? (<a>Available</a>) : (<a className="notAvailable">Not available</a>)
                },

            ],
            isLoading: false,
            detailsVisible: false,
            activeItemId: null,
        };
    }

    onCloseDetails = name => {
        this.setState({ detailsVisible: false, activeItemId: null });
    };

    onOpenDetails = record => {
        this.setState({ detailsVisible: true, activeItemId: record.requestId })
    };

    handleAccept = record => {
        let data = {
            requestId: record.requestId,
            message:'you accepted the request'
        }
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/warehouse/requests/accept', data)
            .then(response => {
                message.success("You accepted the request!");
            }).catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to accept request!", [0.7]);
            });
    }

    onCloseAccept = () => {
        
    }

    handleDeny = record => {
        let data = {
            requestId: record.requestId,
            message:'you denied the request'
        }
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/warehouse/requests/deny', data)
            .then(response => {
                message.success("You denied the request!");
            }).catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to accept request!", [0.7]);
            });
    }

    onCloseDeny = () => {
        
    }

    renderDetails = record => {

        const dataSource2 = record.requests;
        const columns2 = this.state.columnsProducts;

        if (this.state.activeItemId === record.requestId) {
            return (
                <Modal
                    mask={false}
                    title="Request details"
                    centered
                    visible={this.state.detailsVisible}
                    onCancel={this.onCloseDetails}
                    footer={null}
                >
                    <div className="modalPinfo">
                        <h1>Office details</h1>
                        <p>Address: {record.office.address}</p>
                        <p>City: {record.office.city}</p>
                        <p>Country: {record.office.country}</p>
                        <p>E-mail: {record.office.email}</p>
                        <p>Phone number: {record.office.phoneNumber}</p>
                    </div>

                    <div >
                        <Table
                            dataSource={dataSource2}
                            columns={columns2}
                        />
                    </div>
                </Modal>
            );
        }
    };


    componentDidMount() {
        this.setState({ isLoading: true });
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/warehouse/requests')
            .then(response => {
                 this.setState({ requests: response.data, isLoading: false }) })
            .catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to show requests!", [0.7]);
            });
    }


    render() {
        const dataSource = this.state.requests;
        const columns = this.state.columns;
        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                    token={this.props.token}
                    username={this.props.username}
                    handleLogout={this.props.handleLogout} />
                <div className="ant-table">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="address"
                    />
                </div>
                <Footer />
            </Layout>
        );
    }
}