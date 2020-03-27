import React from 'react';
import './HomePage.css';
import { Layout, Menu } from 'antd';
import { ShoppingCartOutlined, ShopOutlined, BarChartOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const MainPage = () => {
    return (
        <Layout>
            <Header className="header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                >
                    <Menu.Item key="1"><ShoppingCartOutlined /></Menu.Item>
                    <Menu.Item key="2"><ShopOutlined /></Menu.Item>
                    <Menu.Item key="3"><BarChartOutlined /></Menu.Item>
                    <Menu.Item id="appName">Warehouse Web app</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <SubMenu
                            key="sub1"
                            title={<span><ShoppingCartOutlined />Proizvodi</span>}
                        >
                            <Menu.Item key="1">Dodavanje novih proizvoda</Menu.Item>
                            <Menu.Item key="2">Izmjena stanja proizvoda</Menu.Item>
                            <Menu.Item key="3">Brisanje proizvoda</Menu.Item>
                            <Menu.Item key="4">Pregled proizvoda</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={<span><ShopOutlined />Poslovnice</span>}
                        >
                            <Menu.Item key="5">Pregled poslovnica</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={<span><BarChartOutlined />Izvještaji</span>}
                        >
                            <Menu.Item key="9">Pregled izvještaja</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 550,
                        }}
                    >

                    </Content>
                </Layout>
            </Layout>
        </Layout >
    );
};

export default MainPage;
