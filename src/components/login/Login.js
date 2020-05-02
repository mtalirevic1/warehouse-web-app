import React from 'react';
import './Login.css';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Footer from '../footer/Footer';

const Login = props => {

    const onFinish = values => {
        values.role = "ROLE_WAREMAN";
        axios.post('https://main-server-si.herokuapp.com/api/auth/login', values).then(response => {
            props.handleLogin({ username: values.username, token: response.data.token });
            props.handleAddNotification(
                {
                    title: "You have successfully logged in as " + values.username,
                    description: new Date().toLocaleString(),
                    href: "/homepage",
                    type: "success"
                }
            )
            props.history.push('/homepage');
        }).catch(er => {
            console.log(er);
            message.error("Invalid username or password!", [0.7]);
        })
    };


    return (
        <div className="login-container">
            <div className="header-container">
                <h1 className="myheader"> Warehouse Web app</h1>
            </div>
            <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    id="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        }
                    ]}
                >
                    <Input className="login-form-input" prefix={<UserOutlined className="site-form-item-icon" style={{ width: '20px', height: '20px' }} />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    id="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        className="login-form-input"
                        prefix={<LockOutlined className="site-form-item-icon" style={{ width: '20px', height: '20px' }} />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                </Form.Item>
            </Form>
            <Footer />
        </div>
    );
};

export default Login;