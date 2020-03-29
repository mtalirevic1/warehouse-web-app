import React, {useState} from 'react';
import './AddProduct.css';
import { Form, Input, Button, Layout} from 'antd';
import {CameraOutlined} from '@ant-design/icons'
import axios from 'axios';
import MyHeader from '../header/MyHeader';
import Footer from '../footer/Footer';
import Upload from 'rc-upload';
import ReactDOM from 'react-dom';
import FileUploader from './FileUploader';
import {Link} from 'react-router-dom';
import CurrencyInput from 'react-currency-input';

const onSubmit = e => {

}

const AddProduct = props => {
    const onFinish = values => {
        console.log('Product: ', values);
    };

    const handleChange = e => {
        const state = {
            name: "",
            number:"",
            price:"",
            discount:"",
            nameError:"",
            numberError:"",
            priceError:"",
            discount:"error"
        }
    }

    return (

        <Layout>
            <MyHeader loggedInStatus={props.loggedInStatus}
                token={props.token}
                username={props.username}
                handleLogout={props.handleLogout}/>
        <div className="add-container">

            <div
                name="add_product"
                className="add-form"
            >
               <div className="column3">
               <Form
                        onSubmitCapture={onSubmit}
                        initialValues={{
                        remember: true,
                    }}
                    >
                        <Form.Item
                            name="productImage"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please insert image of the product!',
                                }
                            ]}
                        >
                            <FileUploader/>
                        </Form.Item>
                    </Form>
                </div>
                <div className="column4">
                    <Form
                        onSubmitCapture={onSubmit}
                        initialValues={{
                        remember: true,
                    }}
                    >

                    <h1 className="title">Add new product</h1>
                        <Form.Item
                    name="productName"
                    rules={[
                        {
                            required: true,
                            message: 'Please insert product name!',
                        },
                    ]}
                >
                    <Input name="name"
                      className="add-form-input"
                      placeholder="Product name" />
                </Form.Item>
                <Form.Item
                    name="productNumber"
                    rules={[
                        {
                            required: true,
                            message: 'Please insert number of products!',
                        },
                    ]}
                >
                    <Input
                        type="number"
                        min="0"
                        className="add-form-input"
                        placeholder="Number of products"
                    />
                </Form.Item>
                <Form.Item
                    name="productPrice"
                    rules={[
                        {
                            required: true,
                            message: 'Please insert product price!',
                        },
                    ]}
                >
                    <Input   
                        type="number-float"
                        className="add-form-input"
                        placeholder="Price"
                    />
                </Form.Item>
                <Form.Item
                    name="productDiscount"
                    rules={[
                        {
                            required: false,
                            message: 'Please insert product discount!',
                        },
                    ]}
                >
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        className="add-form-input"
                        placeholder="Discount"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="add-form-button">Add product</Button>
                </Form.Item>
                    </Form>
                    <Link to="/homepage"><Button type="primary" htmlType="button" className="cancel">Cancel</Button></Link>
                </div>
            </div>
        </div>
        <Footer />
        </Layout>
    );
};

export default AddProduct;