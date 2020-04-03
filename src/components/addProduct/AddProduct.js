import './AddProduct.css';
import React, {Component} from 'react';
import {Form, Input, Button, Layout, message, InputNumber, Select} from 'antd';
import axios from 'axios';
import MyHeader from '../header/MyHeader';
import Footer from '../footer/Footer';
import FileUploader from './FileUploader';
import {Link} from 'react-router-dom';

const {Option} = Select;

class AddProduct extends Component {
    constructor() {
        super();

        this.state = {
            img: null
        };

        this.updateImg = this.updateImg.bind(this);
    }

    updateImg(data) {
        this.setState({
            img: data
        })
    }

    render() {

        const onFinish = values => {
            let token = 'Bearer ' + this.props.token;
            let data1 = {
                name: values.productName,
                price: values.productPrice,
                unit: values.productUnit,
                barcode: values.productBarcode
            };
            axios.defaults.headers.common['Authorization'] = token;
            axios.defaults.headers.common['Content-Type'] = "application/json";
            const fd = new FormData();
            fd.append('image', this.state.img, this.state.img.name);
            axios.defaults.headers.common['Content-Type'] = "multipart/form-data";
            axios.post('https://main-server-si.herokuapp.com/api/products', data1).then(p1 => {
                let data2 = {productId: p1.data.id, quantity: values.productQuantity};
                axios.post('https://main-server-si.herokuapp.com/api/warehouse', data2).then(p2 => {
                    const fd = new FormData();
                    fd.append('image', this.state.img, this.state.img.name);
                    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
                    axios.post('https://main-server-si.herokuapp.com/api/products/' +
                        p2.data.productId.toString() + '/image', fd
                    ).then(pic => {
                        message.success("You successfully added new product!");
                    }).catch(er3 => {
                        console.log("ERROR 3: "+er3);
                        message.error("Unable to add product picture!", [0.7]);
                    })
                }).catch(er2 => {
                    console.log("ERROR 2: "+er2);
                    message.error("Unable to add product quantity!", [0.7]);
                })
            }).catch(er1 => {
                console.log("ERROR 1: "+er1);
                message.error("Unable to add product!", [0.7]);
            })
        };


        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                          token={this.props.token}
                          username={this.props.username}
                          handleLogout={this.props.handleLogout}/>
                <div className="add-container">

                    <div
                        name="add_product"
                        className="add-form"
                    >
                        <Form
                            onFinish={onFinish}
                            initialValues={{
                                remember: true,
                            }}
                        >

                            <h1 className="title">Add new product</h1>

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
                                <InputNumber
                                    className="add-form-input"
                                    name="price"
                                    id="price"
                                    min={0}
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
                                <Select id="unit" name="price" placeholder="Unit">
                                    <Option value="pc.">piece</Option>
                                    <Option value="l">liter</Option>
                                    <Option value="kg">kilogram</Option>
                                </Select>
                            </Form.Item>
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
                                    className="add-form-input"
                                    name="number"
                                    id="number"
                                    type="number"
                                    min="0"
                                    placeholder="Quantity"
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
                                    placeholder="Barcode"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="add-form-button">Add
                                    product</Button>
                            </Form.Item>

                            <Form.Item>
                                <Link to="/homepage">
                                    <Button type="primary" htmlType="button" className="cancel">
                                        Cancel
                                    </Button>
                                </Link>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <Footer/>
            </Layout>
        );
    }
};

export default AddProduct;
