import React, { Component } from 'react'
import { Table, Layout, Popconfirm, message, Modal, Form, Input } from 'antd';
import axios from 'axios';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";

import './ProductsTable.css';


const API = 'https://main-server-si.herokuapp.com/api/products';

const confirmationText = 'Are you sure want to delete this product?';


export default class ProductsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    width: '10%'
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    width: '15%'
                },
                {
                    title: 'Barcode',
                    dataIndex: 'barcode',
                    width: '15%'
                },
                {
                    title: 'Unit',
                    dataIndex: 'unit',
                },
                {
                    title: 'Price',
                    dataIndex: 'price',
                },
                {
                    title: 'Picture',
                    dataIndex: 'image',
                    render: theImageURL => <img className="productPicture" alt={theImageURL} src={theImageURL} width="40" height="40" />
                },
                {
                    title: 'Change quantity',
                    dataIndex: 'changequantity',
                    render: (text, record) =>
                        this.state.products.length >= 1 ? (
                            <div>
                                <a
                                    key={record.id}
                                    onClick={() => this.onOpenModal(record.id)}>Change quantity</a>
                                <div>{this.renderModal(record)}</div>
                            </div>
                        ) : null
                },
                {
                    title: 'Delete',
                    dataIndex: 'deleteButton',
                    render: (text, record) =>
                        this.state.products.length >= 1 ? (
                            <Popconfirm title={confirmationText} onConfirm={() => this.handleDelete(record)}>
                                <a>Delete</a>
                            </Popconfirm>
                        ) : null
                },
            ],
            isLoading: false,
            modalVisible: false,
            activeItemId: null,
            currentQuantity: null,
            addQuantity: null
        };

        this.handleQuantityChange = this.handleQuantityChange.bind(this);
    }

    handleQuantityChange(event) {
        this.setState({ addQuantity: event.target.value });
    }

    onCloseModal = () => {
        this.setState({ modalVisible: false, activeItemId: null, currentQuantity: null, addQuantity: null });
    };

    onOpenModal = id => {
        this.setState({ modalVisible: true, activeItemId: id })
        this.getCurrentQuantity(id);
    };

    getCurrentQuantity = id => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.get('https://main-server-si.herokuapp.com/api/warehouse/products/' + id.toString()).then(p => {
            this.setState({ currentQuantity: p.data.quantity });
        }).catch(err => {
            console.log("ERROR: " + err);
            message.error("Unable to get product quantity!", [0.7]);
        })
        return this.state.currentQuantity;
    }

    changeQuantity = id => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/warehouse', { productId: id, quantity: this.state.addQuantity }).then(p => {
            this.setState({ currentQuantity: p.data.quantity });
            this.onCloseModal();
            message.success("You successfully changed quantity!", [0.7]);
        }).catch(err => {
            console.log("ERROR: " + err);
            message.error("Unable to change product quantity!", [0.7]);
        })
    }

    renderModal = record => {
        if (this.state.activeItemId === record.id) {
            return (
                <Modal
                    mask={false}
                    title="Change product quantity"
                    centered
                    visible={this.state.modalVisible}
                    onOk={() => this.changeQuantity(record.id)}
                    onCancel={() => this.onCloseModal()}
                >
                    <div className="modalPinfo">
                        <h1>Product details</h1>
                        <p>Product id: {record.id}</p>
                        <p>Product name: {record.name}</p>
                        <p>Product barcode: {record.barcode}</p>
                        <p>Product unit: {record.unit}</p>
                        <p>Product price: {record.price}</p>
                    </div>
                    <img className="modalPicture" alt={record.image} src={record.image} />
                    <p className="currentQuantity">Current product quantity: {this.state.currentQuantity}</p>
                    <Form>
                        <Form.Item
                            name="productQuantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the quantity!",

                                },
                            ]}
                        >
                            <Input
                                value={this.state.addQuantity} onChange={this.handleQuantityChange}
                                className="modal-form-input"
                                name="number"
                                id="number"
                                type="number"
                                min={this.state.currentQuantity * (-1)}
                                placeholder="Quantity"
                            />
                        </Form.Item>
                    </Form>
                </Modal >
            );
        }
    };


    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(API)
            .then(response => response.json())
            .then(data => this.setState({ products: data, isLoading: false }));
    }

    handleDelete = record => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.delete('https://main-server-si.herokuapp.com/api/products/' + record.id)
            .then(response => {
                message.success("You successfully deleted a product!")
            }).catch(er => {
                message.error("Unable to remove product!");
            }).then(() => {
                fetch(API)
                    .then(response => response.json())
                    .then(data => this.setState({ products: data, isLoading: false }));
            });
    };

    render() {
        const dataSource = this.state.products;
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
                        rowKey="id"
                    />
                </div>
                <Footer />
            </Layout>
        );
    }
}


