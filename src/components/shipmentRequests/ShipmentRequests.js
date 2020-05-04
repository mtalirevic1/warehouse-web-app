import React, {Component} from 'react'
import {Table, Layout, Popconfirm, message, Modal, Form, Input, Select} from 'antd';
import axios from 'axios';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";

import './ShipmentRequests.css';


const API = 'https://main-server-si.herokuapp.com/api/products';

const {Option} = Select;

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
                                        key={record.requestdId}
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
                                        key={record.requestdId}
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
                        record.availableQuantity >= record.quantity ? (<a>Available</a>) : (
                            <a className="notAvailable">Not available</a>)
                },

            ],
            isLoading: false,
            detailsVisible: false,
            activeItemId: null,
        };
    }

    onCloseDetails = name => {
        this.setState({detailsVisible: false, activeItemId: null});
    };

    onOpenDetails = record => {
        this.setState({detailsVisible: true, activeItemId: record.requestId})
    };

    handleAccept = record => {
        let size = record.requests.length;
        let avi = true;
        console.log(size);
        for(let i =  0; i < size; i++){
            let req = record.requests[i];
            if(req.availableQuantity <= req.quantity){
                avi = false;
            }
        }
        if(avi !== true){
            message.error("Not enough products in the warehouse!", [0.7]);
            return;
        }
        let data = {
            requestId: record.requestId,
            message: 'you accepted the request'
        }
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/warehouse/requests/accept', data)
            .then(response => {
                message.success("You accepted the request!");
                let size = record.requests.length;
                console.log(size);
                for (let i = 0; i < size; i++) {
                    let request = record.requests[i];
                    let office = record.office;
                    console.log(request);
                    console.log(office);
                    let data1 = {
                        officeId: office.id,
                        productId: request.product.id,
                        quantity: request.availableQuantity - request.quantity
                    };
                    console.log(data1);
                    axios.post('https://main-server-si.herokuapp.com/api/inventory', data1)
                        .then(response => {
                            message.success("Quantity changed!");
                        }).catch(er => {
                        message.error("Unable to change quantity!", [0.7]);
                    });
                }
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
                axios.defaults.headers.common["Content-Type"] = "application/json";
                axios.get('https://main-server-si.herokuapp.com/api/warehouse/requests')
                    .then(response => {
                        this.setState({requests: response.data, isLoading: false})
                        console.log(response.data);
                    })
                    .catch(er => {
                        console.log("ERROR: " + er);
                        message.error("Unable to show requests!", [0.7]);
                    });
            }).catch(er => {
            message.error("Unable to accept request!", [0.7]);
        });

        /* for(let i =  0; i < record.requests.length; i++){
             axios.post('https://main-server-si.herokuapp.com/api/inventory',
             { officeId: record.office.officeId, productId: record.requests[i].product.id, quantity: record.requests[i].quantity})
             .then(response => {
                 message.success("Quantity changed!");
             }).catch(er => {
                 message.error("Unable to change quantity!", [0.7]);
             });
         }*/
    }

    onCloseAccept = () => {

    }

    handleDeny = record => {
        let data = {
            requestId: record.requestId,
            message: 'you denied the request'
        }
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/warehouse/requests/deny', data)
            .then(response => {
                message.success("You denied the request!");
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
                axios.defaults.headers.common["Content-Type"] = "application/json";
                axios.get('https://main-server-si.herokuapp.com/api/warehouse/requests')
                    .then(response => {
                        this.setState({requests: response.data, isLoading: false})
                        console.log(response.data);
                    })
                    .catch(er => {
                        console.log("ERROR: " + er);
                        message.error("Unable to show requests!", [0.7]);
                    });
            }).catch(er => {
            console.log("ERROR: " + er);
            message.error("Unable to deny request!", [0.7]);
        });
    }

    onCloseDeny = () => {

    }

    renderDetails = record => {

        console.log(record);

        const dataSource2 = record.requests;
        const columns2 = this.state.columnsProducts;

        console.log(record.requests.length);
        console.log(record.requests[0].product.id);
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

                    <div>
                        <Table
                            dataSource={dataSource2}
                            columns={columns2}
                            key="name"
                        />
                    </div>
                </Modal>
            );
        }
    };


    componentDidMount() {
        this.setState({isLoading: true});
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/warehouse/requests')
            .then(response => {
                this.setState({requests: response.data, isLoading: false})
                console.log(response.data);
            })
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
                          handleLogout={this.props.handleLogout}/>
                <div className="ant-table">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="requestId"
                    />
                </div>
                <Footer/>
            </Layout>
        );
    }
}
