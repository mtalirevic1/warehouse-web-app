import React from 'react';
import './MyHeader.css';
import {Layout, Menu} from 'antd';
import {ShoppingCartOutlined, ShopOutlined, BarChartOutlined, UserOutlined} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import MenuItem from "antd/es/menu/MenuItem";
import {Link} from 'react-router-dom';

const {Header} = Layout;

const MyHeader = props => {

    const onLogout = values =>{
        props.handleLogout();
    };

    return (
        <Layout>
            <Header className="header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                >
                    <SubMenu
                        key="sub1"
                        title={<span><ShoppingCartOutlined style={{width: '20px', height: '20px'}}/>Products</span>}
                    >
                        <Menu.Item key="1" style={{marginTop: "0", paddingTop: "0"}}>
                        <Link to='/addProduct'>Add new product</Link>
                        </Menu.Item>
                        <Menu.Item key="2">Change product quantity</Menu.Item>
                        <Menu.Item key="3">Delete product</Menu.Item>
                        <Menu.Item key="4">
                            <Link to='/productsTable'>Display products</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu
                        key="sub2"
                        title={<span><ShopOutlined style={{width: '20px', height: '20px'}}/>Stores</span>}
                    >
                        <Menu.Item key="5">
                          <Link to='/storesTable'>Display stores</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu
                        key="sub3"
                        title={<span><BarChartOutlined style={{width: '20px', height: '20px'}}/>Reports</span>}
                    >
                        <Menu.Item key="9">Display reports</Menu.Item>
                    </SubMenu>
                    <Menu.Item id="appName">
                        <Link to='/homePage'>Warehouse Web app</Link>
                    </Menu.Item>
                    <SubMenu className="user"
                        id="user"
                        title={<span><UserOutlined style={{width: '20px', height: '20px'}}/>{props.username}</span>}
                    >
                        <MenuItem onClick={onLogout}>Log out</MenuItem>
                    </SubMenu>
                </Menu>

            </Header>
        </Layout>
    );
};

export default MyHeader;
