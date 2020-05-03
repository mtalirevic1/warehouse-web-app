import React from 'react';
import './MyHeader.css';
import { Layout, Menu } from 'antd';
import {
    ShoppingCartOutlined,
    ShopOutlined,
    UserOutlined,
    UnorderedListOutlined,
    NotificationOutlined,
    InboxOutlined
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import MenuItem from "antd/es/menu/MenuItem";
import { Link } from 'react-router-dom';

const { Header } = Layout;

const MyHeader = props => {

    const onLogout = values => {
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
                        title={<span><ShoppingCartOutlined style={{ width: '20px', height: '20px' }} />Products</span>}
                    >
                        <Menu.Item key="2">
                            <Link to='/productsTable'>Display products</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu
                        key="sub2"
                        title={<span><ShopOutlined style={{ width: '20px', height: '20px' }} />Stores</span>}
                    >
                        <Menu.Item key="3">
                            <Link to='/storesTable'>Display stores</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu
                        key="sub3"
                        title={<span><UnorderedListOutlined style={{ width: '20px', height: '20px' }} />Logs</span>}
                    >
                        <Menu.Item key="4">
                            <Link to='/receivedLogs'>Display received product logs</Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to='/sentLogs'>Display sent product logs</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub4"
                        title={<span><InboxOutlined style={{ width: '20px', height: '20px' }} />Requests</span>}
                    >
                        <Menu.Item key="6">
                            <Link to='/requests'>Display requests</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub5"
                        title={<span><NotificationOutlined style={{ width: '20px', height: '20px' }} />Notifications</span>}
                    >
                        <Menu.Item key="7">
                            <Link to='/notifications'>Display notifications</Link>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item id="appName">
                        <Link to='/homePage'>Warehouse Web app</Link>
                    </Menu.Item>
                    <SubMenu className="user"
                        id="user"
                        title={<span><UserOutlined
                            style={{ width: '20px', height: '20px' }} />{props.username}</span>}
                    >
                        <MenuItem onClick={onLogout}>Log out</MenuItem>
                    </SubMenu>
                </Menu>

            </Header>
        </Layout>
    );
};

export default MyHeader;
