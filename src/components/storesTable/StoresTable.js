import React, { Component } from 'react'
import {Table,Layout, Modal} from 'antd';
import axios from 'axios';

import './StoresTable.css';
import Footer from "../footer/Footer";
import MyHeader from "../header/MyHeader";

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
                {
                    title: 'See products and quantities',
                    dataIndex: 'seeAllProducts',
                    render: (text, record) =>
                        this.state.offices.length >= 1 ? (
                            <div>
                                <a
                                    key={record.id}
                                    onClick={() => this.onOpenModal(record.id)}>See products and quantities</a>
                                <div>{this.renderModal(record)}</div>
                            </div>
                        ) : null,
                },

            ],
            columnsProducts: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    width: '20%',
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                },
                {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                },
            ],
            isLoading: false,
            modalVisible: false,
            activeItemId: null,
        };
    }

    onOpenModal = id => {
        this.setState({ modalVisible: true, activeItemId: id });
        this.seeProducts(id);
    };

    onCloseModal = () => {
        this.setState({ modalVisible: false, activeItemId: null });
    };

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

    seeProducts = id => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/offices/' + id + '/products')
            .then(response =>{
                let arr = [];
                for(let i = 0; i<response.data.length; i++) {
                    response.data[i].product.quantity = response.data[i].quantity;
                    arr.push(response.data[i].product);
                }
                this.setState({ products : arr});
            });
    };

    renderModal = record => {
        const dataSource2 = this.state.products;
        const columns2 = this.state.columnsProducts;
        if (this.state.activeItemId === record.id) {
            return (
                <Modal
                    mask={false}
                    title="See products and quantities"
                    centered
                    visible={this.state.modalVisible}
                    onCancel={() => this.onCloseModal()}
                    onOk={() => this.onCloseModal()}
                >
                    <div>
                        <Table
                            dataSource={dataSource2}
                            columns={columns2}
                        />
                    </div>
                </Modal >
            );
        }
    };

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

