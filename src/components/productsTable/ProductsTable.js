import React, { Component } from 'react'
import { Table, Layout, Popconfirm, message, Modal, Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";
import FileUploader from '../fileUploader/FileUploader';

import './ProductsTable.css';


const API = 'https://main-server-si.herokuapp.com/api/products';

const confirmationText = 'Are you sure want to delete this product?';

const { Option } = Select;

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
                    title: 'VAT',
                    dataIndex: 'pdv',
                },
                {
                    title: 'Picture',
                    dataIndex: 'image',
                    render: theImageURL => <img className="productPicture" alt={theImageURL} src={theImageURL}
                        width="40" height="40" />
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
                            <Popconfirm title={confirmationText} onCancel={() => this.onCloseDelete(record.name)} onConfirm={() => this.handleDelete(record)}>
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
            barcode: null,
            description: null,
            pdv: null,

            addVisible: false,
            addImg: null,
            addName: null,
            addPrice: null,
            addNumber: null,
            addUnit: null,
            addBarcode: null,
            addDescription: null,
            addPdv: null,

            pdvList: null
        };

        this.handleQuantityChange = this.handleQuantityChange.bind(this);

        this.updateImg = this.updateImg.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePdvChange = this.handlePdvChange.bind(this);

        this.updateAddImg = this.updateAddImg.bind(this);
        this.handleAddName = this.handleAddName.bind(this);
        this.handleAddPrice = this.handleAddPrice.bind(this);
        this.handleAddUnit = this.handleAddUnit.bind(this);
        this.handleAddBarcode = this.handleAddBarcode.bind(this);
        this.handleAddDescription = this.handleAddDescription.bind(this);
        this.handleAddQuantity = this.handleAddQuantity.bind(this);
        this.handleAddPdv = this.handleAddPdv.bind(this);
    }

    onCloseDelete = name => {
        this.props.handleAddNotification(
            {
                title: "You have cancelled deleting product " + name,
                description: new Date().toLocaleString(),
                href: "/productsTable",
                type: "info"
            }
        );
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
        this.setState({ name: event.target.value });
    }

    handlePriceChange(event) {
        this.setState({ price: event.target.value });
    }

    handleUnitChange(event) {
        this.setState({ unit: event.target.value });
    }

    handleBarcodeChange(event) {
        this.setState({ barcode: event.target.value });
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value });
    }

    handlePdvChange = (value, event) => {
        this.setState({ pdv: value });
    }

    updateAddImg(data) {
        this.setState({
            addImg: data
        })
    }

    handleAddQuantity(event) {
        this.setState({ addNumber: event.target.value });
    }

    handleAddName(event) {
        this.setState({ addName: event.target.value });
    }

    handleAddPrice(event) {
        this.setState({ addPrice: event.target.value });
    }

    handleAddUnit(event) {
        this.setState({ addUnit: event.target.value });
    }

    handleAddBarcode(event) {
        this.setState({ addBarcode: event.target.value });
    }

    handleAddDescription(event) {
        this.setState({ addDescription: event.target.value });
    }

    handleAddPdv = (value, event) => {
        this.setState({ addPdv: value });
    }

    getPdvList = () => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/pdv/active')
            .then(d => {
                let pdvs = [];
                for (let i = 0; i < d.data.length; i++) {
                    pdvs.push(<Option value={d.data[i].pdv} key={i.toString(36) + i}>{d.data[i].pdv}</Option>);
                }
                this.setState({ pdvList: pdvs });
            })
            .catch(er => {
                console.log("ERROR 1: " + er);
                message.error("Unable to load PDV!", [0.7]);
            })
    };

    onCloseModal = name => {
        this.setState({ modalVisible: false, activeItemId: null, currentQuantity: null, addQuantity: null });
        this.props.handleAddNotification(
            {
                title: "You have cancelled changing quantity of product " + name,
                description: new Date().toLocaleString(),
                href: "/productsTable",
                type: "info"
            }
        );
    };

    onOpenModal = id => {
        this.setState({ modalVisible: true, activeItemId: id })
        this.getCurrentQuantity(id);
    };

    onOpenUpdate = record => {
        this.setState({
            updateVisible: true,
            name: record.name,
            img: null,
            id: record.id,
            price: record.price,
            unit: record.unit,
            barcode: record.barcode,
            description: record.description,
            pdv: record.pdv
        });
    };

    onCloseUpdate = name => {
        this.setState({
            updateVisible: false, name: null, img: null,
            id: null, price: null, unit: null, barcode: null, description: null, pdv: null
        });
        if (name !== null) {
            this.props.handleAddNotification(
                {
                    title: "You have cancelled updating product " + name,
                    description: new Date().toLocaleString(),
                    href: "/productsTable",
                    type: "info"
                }
            );
        }
    };

    onOpenAdd = () => {
        this.setState({
            addVisible: true, addName: null, addImg: null, addPrice: null,
            addUnit: null, addBarcode: null, addDescription: null, addPdv: null
        });
    };

    onCloseAdd = () => {
        this.setState({
            addVisible: false, addName: null, addImg: null, addPrice: null,
            addUnit: null, addBarcode: null, addDescription: null, addPdv: null
        });
        this.props.handleAddNotification(
            {
                title: "You have cancelled adding new product",
                description: new Date().toLocaleString(),
                href: "/productsTable",
                type: "info"
            }
        );
    };

    add = () => {
        let token = 'Bearer ' + this.props.token;
        let data1 = {
            name: this.state.addName,
            price: this.state.addPrice,
            pdv: this.state.addPdv,
            unit: this.state.addUnit,
            barcode: this.state.addBarcode,
            description: this.state.addDescription,
            quantity: this.state.addNumber
        };

        if (this.state.addName === null || this.state.addPrice === null || this.state.addUnit === null ||
            this.state.addBarcode === null || this.state.addNumber === null || this.state.addImg === null) {
            message.error("Missing information in input fields!", [0.7]);
            return;
        }

        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.common['Content-Type'] = "application/json";
        const fd = new FormData();
        fd.append('image', this.state.addImg, this.state.addImg.name);
        axios.defaults.headers.common['Content-Type'] = "multipart/form-data";
        axios.post('https://main-server-si.herokuapp.com/api/products', data1).then(p1 => {
            let data2 = { productId: p1.data.id, quantity: this.state.addNumber };
            axios.post('https://main-server-si.herokuapp.com/api/warehouse', data2).then(p2 => {
                const fd = new FormData();
                fd.append('image', this.state.addImg, this.state.addImg.name);
                axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
                axios.post('https://main-server-si.herokuapp.com/api/products/' +
                    p2.data.productId.toString() + '/image', fd
                ).then(pic => {
                    message.success("You successfully added new product!");
                    this.props.handleAddNotification(
                        {
                            title: "You have successfully added new product " + this.state.addName,
                            description: new Date().toLocaleString(),
                            href: "/productsTable",
                            type: "success",
                        }
                    );
                }).catch(er3 => {
                    console.log("ERROR 3: " + er3);
                    message.error("Unable to add product picture!", [0.7]);
                    this.props.handleAddNotification(
                        {
                            title: "Error while adding new product " + this.state.addName,
                            description: new Date().toLocaleString(),
                            href: "/productsTable",
                            type: "error",
                        }
                    );
                })
            }).catch(er2 => {
                console.log("ERROR 2: " + er2);
                message.error("Unable to add product quantity!", [0.7]);
                this.props.handleAddNotification(
                    {
                        title: "Error while adding new product " + this.state.addName,
                        description: new Date().toLocaleString(),
                        href: "/productsTable",
                        type: "error",
                    }
                );
            })
        }).catch(er1 => {
            console.log("ERROR 1: " + er1);
            message.error("Unable to add product!", [0.7]);
            this.props.handleAddNotification(
                {
                    title: "Error while adding new product " + this.state.addName,
                    description: new Date().toLocaleString(),
                    href: "/productsTable",
                    type: "error",
                }
            );
        }).then(() => {
            fetch(API)
                .then(response => response.json())
                .then(data => this.setState({ products: data, isLoading: false }));
        });

    }

    update = data => {

        let token = 'Bearer ' + this.props.token;
        let data1 = {
            id: this.state.id,
            name: this.state.name,
            price: this.state.price,
            pdv: this.state.pdv,
            unit: this.state.unit,
            barcode: this.state.barcode,
            description: this.state.description
        };
        console.log(this.state);
        console.log(data1);
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.common['Content-Type'] = "application/json";
        const fd = new FormData();
        if (this.state.img != null) fd.append('image', this.state.img, this.state.img.name);
        axios.defaults.headers.common['Content-Type'] = "multipart/form-data";
        axios.put('https://main-server-si.herokuapp.com/api/products/' + this.state.id, data1).then(p1 => {
            console.log(p1);

            const fd = new FormData();
            if (this.state.img != null) {
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
                    this.props.handleAddNotification(
                        {
                            title: "You have successfully updated product " + this.state.name,
                            description: new Date().toLocaleString(),
                            href: "/productsTable",
                            type: "success",
                        }
                    );
                    this.onCloseUpdate(null);
                }).catch(er3 => {
                    console.log("ERROR 3: " + er3);
                    message.error("Unable to add product picture!", [0.7]);
                    this.props.handleAddNotification(
                        {
                            title: "Error while updating product " + this.state.name,
                            description: new Date().toLocaleString(),
                            href: "/productsTable",
                            type: "error",
                        }
                    );
                })
            } else {
                message.success("You successfully changed product!");
                this.props.handleAddNotification(
                    {
                        title: "You have successfully updated product " + this.state.name,
                        description: new Date().toLocaleString(),
                        href: "/productsTable",
                        type: "success",
                    }
                );
                this.onCloseUpdate(null);
            }
        }).catch(er1 => {
            console.log("ERROR 1: " + er1);
            message.error("Unable to add product!", [0.7]);
            this.props.handleAddNotification(
                {
                    title: "Error while updating product " + this.state.name,
                    description: new Date().toLocaleString(),
                    href: "/productsTable",
                    type: "error",
                }
            );

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

    changeQuantity = (id, name, currentQuantity, addQuantity) => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/warehouse', {
            productId: id,
            quantity: this.state.addQuantity
        }).then(p => {
            this.setState({ currentQuantity: p.data.quantity });
            this.onCloseModal(null);
            message.success("You successfully changed quantity!", [0.7]);
            let newQuantity = parseInt(currentQuantity) + parseInt(addQuantity);
            this.props.handleAddNotification(
                {
                    title: "You have successfully changed quantity of product " + name + " from " + currentQuantity + " to " + newQuantity,
                    description: new Date().toLocaleString(),
                    href: "/productsTable",
                    type: "success",
                }
            );
        }).catch(err => {
            console.log("ERROR: " + err);
            message.error("Unable to change product quantity!", [0.7]);
            this.props.handleAddNotification(
                {
                    title: "Error while changing quantity of product " + name,
                    description: new Date().toLocaleString(),
                    href: "/productsTable",
                    type: "error",
                }
            );
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
                    onCancel={() => this.onCloseUpdate(record.name)}
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
                                className="add-form-input" />
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
                                placeholder="Product name" />
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
                        <Form.Item
                            name="productPdv"
                        >
                            <Select
                                className="add-form-select"
                                placeholder="PDV"
                                name="pdv"
                                id="pdv"
                                type="number"
                                value={this.state.pdv}
                                defaultValue={record.pdv}
                                onChange={(value, event) => this.handlePdvChange(value, event)}
                            >
                                {this.state.pdvList}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="productDescription"
                        >
                            <Input id="description" name="description" placeholder="Description"
                                value={this.state.description}
                                defaultValue={this.state.description}
                                onChange={this.handleDescriptionChange}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
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
                    onOk={() => this.changeQuantity(record.id, record.name, this.state.currentQuantity, this.state.addQuantity)}
                    onCancel={() => this.onCloseModal(record.name)}
                >
                    <div className="modalPinfo">
                        <h1>Product details</h1>
                        <p>Product id: {record.id}</p>
                        <p>Product name: {record.name}</p>
                        <p>Product barcode: {record.barcode}</p>
                        <p>Product unit: {record.unit}</p>
                        <p>Product price: {record.price}</p>
                        <p>Product description:</p>
                        <p>{record.description}</p>
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
                </Modal>
            );
        }
    };


    componentDidMount() {
        this.setState({ isLoading: true });
        this.getPdvList();
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
                message.success("You successfully deleted a product!");
                this.props.handleAddNotification(
                    {
                        title: "You have successfully deleted product " + record.name,
                        description: new Date().toLocaleString(),
                        href: "/productsTable",
                        type: "success",
                    }
                );
            }).catch(er => {
                message.error("Unable to remove product!");
                this.props.handleAddNotification(
                    {
                        title: "Error while deleting product " + record.name,
                        description: new Date().toLocaleString(),
                        href: "/productsTable",
                        type: "error",
                    }
                );
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
                    <div className="add">
                        <Button type="primary" onClick={this.onOpenAdd}>
                            Add new product
                        </Button>
                        <Modal
                            title="Add new product"
                            centered
                            visible={this.state.addVisible}
                            onOk={this.add}
                            onCancel={this.onCloseAdd}
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
                                        updateImg={this.updateAddImg}
                                        className="add-form-input" />
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
                                        value={this.state.addName}
                                        defaultValue={this.state.addName}
                                        onChange={this.handleAddName}
                                        placeholder="Product name" />
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
                                        value={this.state.addPrice}
                                        defaultValue={this.state.addPrice}
                                        onChange={this.handleAddPrice}
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
                                        value={this.state.addUnit}
                                        defaultValue={this.state.addUnit}
                                        onChange={this.handleAddUnit}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="productQuantity"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter quantity!",
                                        },
                                    ]}
                                >
                                    <Input type="number" min={0} step={1} id="quantity" name="quantity"
                                        placeholder="Quantity"
                                        value={this.state.addNumber}
                                        defaultValue={this.state.addNumber}
                                        onChange={this.handleAddQuantity}
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
                                        type="number"
                                        value={this.state.addBarcode}
                                        defaultValue={this.state.addBarcode}
                                        onChange={this.handleAddBarcode}
                                        placeholder="Barcode"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="productPdv"
                                >
                                    <Select
                                        className="add-form-select"
                                        placeholder="PDV"
                                        name="pdv"
                                        id="pdv"
                                        type="number"
                                        value={this.state.addPdv}
                                        onChange={(value, event) => this.handleAddPdv(value, event)}
                                    >
                                        {this.state.pdvList}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="productDecsription"
                                >
                                    <Input id="description" name="description" placeholder="Description"
                                        value={this.state.addDescription}
                                        defaultValue={this.state.addDescription}
                                        onChange={this.handleAddDescription}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>


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
