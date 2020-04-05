import React, { Component } from 'react'
import { Table, Layout, Popconfirm, message, Modal, Form, Input, InputNumber, Button, Upload } from 'antd';
import axios from 'axios';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";
import FileUploader from '../addProduct/FileUploader';

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
                    title: 'Update product',
                    dataIndex: 'updateProduct',
                    render: (text, record) =>
                        this.state.products.length >= 1 ? (
                            <div>
                                <a
                                    key={record.id}
                                    onClick={() => this.onOpenUpdate(record)}>Update product</a>
                                <div>{this.renderUpdate(record)}</div>
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
            addQuantity: null,

            isLoadingUpdate: false,
            updateVisible: false,
            activeItem: null,
            
            img: null,
            name: null,
            price: null,
            unit: null,
            id: null,
            barcode: null
        };

        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.updateImg = this.updateImg.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    }

    updateImg(data) {
        this.setState({
            img: data
        })
    }

    handleQuantityChange(event) {
        this.setState({ addQuantity: event.target.value });
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handlePriceChange(event) {
        this.setState({price: event.target.value});
    }

    handleUnitChange(event) {
        this.setState({unit: event.target.value});
    }

    handleBarcodeChange(event) {
        this.setState({barcode: event.target.value});
    }

    onCloseModal = () => {
        this.setState({ modalVisible: false, activeItemId: null, currentQuantity: null, addQuantity: null });
    };

    onOpenModal = id => {
        this.setState({ modalVisible: true, activeItemId: id })
        this.getCurrentQuantity(id);
    };

    onOpenUpdate = record => {
        this.setState({ updateVisible: true, name: record.name, img: null,
        id: record.id, price: record.price, unit: record.unit, barcode: record.barcode });
    };

    onCloseUpdate = () => {
        this.setState({ updateVisible: false,  name: null, img: null,
            id: null, price: null, unit: null, barcode: null });
    };

    update = data => {

        let token = 'Bearer ' + this.props.token;
            let data1 = {
                id: this.state.id,
                name: this.state.name,
                price: this.state.price,
                unit: this.state.unit,
                barcode: this.state.barcode
            };
            console.log(this.state);
            console.log(data1);
            axios.defaults.headers.common['Authorization'] = token;
            axios.defaults.headers.common['Content-Type'] = "application/json";
            const fd = new FormData();
            if(this.state.img != null) fd.append('image', this.state.img, this.state.img.name);
            axios.defaults.headers.common['Content-Type'] = "multipart/form-data";
            axios.put('https://main-server-si.herokuapp.com/api/products/' + this.state.id, data1).then(p1 => {
                console.log(p1);

                const fd = new FormData();
                if(this.state.img != null ) {
                    fd.append('image', this.state.img, this.state.img.name);
                    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
                    let data2 = {
                        productId: this.state.id,
                        productName: this.state.name,
                        productPrice: this.state.price,
                        productUnit: this.state.unit,
                        barcode: this.state.barcode
                    };
                    axios.post('https://main-server-si.herokuapp.com/api/products/' +
                        data2.productId.toString() + '/image', fd
                    ).then(pic => {
                        message.success("You successfully changed product!");
                        this.onCloseUpdate();
                    }).catch(er3 => {
                        console.log("ERROR 3: "+er3);
                        message.error("Unable to add product picture!", [0.7]);
                    })
                } else {
                    message.success("You successfully changed product!");
                    this.onCloseUpdate();
                }
            }).catch(er1 => {
                console.log("ERROR 1: "+er1);
                message.error("Unable to add product!", [0.7]);
            }).then(() => {
                fetch(API)
                    .then(response => response.json())
                    .then(data => this.setState({ products: data, isLoading: false }));
            });
    }

    getCurrentQuantity = id => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/warehouse', { productId: id, quantity: 0 }).then(p => {
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

    

    renderUpdate = record => {
        if (this.state.id === record.id) {
            return (
                <Modal
                    mask={false}
                    title="Update product"
                    centered
                    visible={this.state.updateVisible}
                    onOk={() => this.update(record)}
                    onCancel={() => this.onCloseUpdate()}
                >
                    <Form
                            initialValues={{
                                remember: true,
                            }}
                        >

                            <Form.Item
                                name="productImage"
                            >
                                <FileUploader
                                    updateImg={this.updateImg}
                                    className="add-form-input"/>
                            </Form.Item>
                            <Form.Item
                                name="productName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter product name!",

                                    },
                                ]}
                            >
                                <Input
                                    className="add-form-input"
                                    name="name"
                                    id="name"
                                    value={this.state.name} onChange={this.handleNameChange}
                                    defaultValue={record.name}
                                    placeholder="Product name"/>
                            </Form.Item>
                            <Form.Item
                                name="productPrice"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter product price!",

                                    },
                                ]}
                            >
                                <Input
                                    className="add-form-input"
                                    name="price"
                                    type="number"
                                    id="price"
                                    min={0}
                                    value={this.state.price}
                                    onChange={this.handlePriceChange}
                                    defaultValue={record.price}
                                    step={0.05}
                                    placeholder="Price"
                                />
                            </Form.Item>
                            <Form.Item
                                name="productUnit"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a unit!",
                                    },
                                ]}
                            >
                                <Input id="unit" name="unit" placeholder="Unit" 
                                value={this.state.unit}
                                onChange={this.handleUnitChange}
                                defaultValue={record.unit}
                                />
                            </Form.Item>
                            <Form.Item
                                name="productBarcode"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter a 13 digit number!",
                                        pattern: /^(?=.*[0-9]).{13,}$/,
                                    },
                                ]}
                            >
                                <Input
                                    className="add-form-input"
                                    name="barcode"
                                    id="barcode"
                                    value={this.state.barcode}
                                    onChange={this.handleBarcodeChange}
                                    defaultValue={record.barcode}
                                    placeholder="Barcode"
                                />
                            </Form.Item>
                            
                        </Form>
                </Modal >
            );
        }
    };


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
