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
import validate from './AddValidation';
import UseForm from './AddValidation';
import { useForm } from 'antd/lib/form/util';

const onSubmit = e => {

}

const AddProduct = props => {
    const onFinish = values => {
        console.log('Product: ', values);
    };


    const {
        values,
        errors,
        handleChange,
        handleSubmit,
    } = UseForm(add, validate);



    function add() {
        console.log('No errors, submit callback called!');
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
                            message: "Plesade enter product name!",

                        },
                    ]}
                >
                    <Input
                      className="add-form-input"
                      name="name"
                      placeholder="Product name" />
                </Form.Item>
                <Form.Item
                    name="productPrice"
                    rules={[
                        {
                            required: true,
                            message: "Plesade enter product price!",

                        },
                    ]}
                >
                    <Input
                        className="add-form-input"
                        name="price"
                        type="number"
                        min="0"
                        placeholder="Price"
                    />
                </Form.Item>
                <Form.Item
                    name="productDiscount"
                    rules={[
                        {
                            required: true,
                            message: "Please enter product discount!",
                        },
                    ]}
                >
                    <Input
                        name="discount"
                        className="add-form-input"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Discount in %"
                    />
                </Form.Item>
                <Form.Item
                    name="productNumber"
                    rules={[
                        {
                            required: true,
                            message: "Plesade enter number of products!",

                        },
                    ]}
                >
                    <Input
                        className="add-form-input"
                        name="number"
                        type="number"
                        min="0"
                        placeholder="Number of products"
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