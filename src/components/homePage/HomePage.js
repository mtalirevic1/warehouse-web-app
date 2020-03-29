import React from 'react';
import './HomePage.css';
import { Layout } from 'antd';
import { ShoppingCartOutlined, ShopOutlined, BarChartOutlined } from '@ant-design/icons';
import MyHeader from '../header/MyHeader';
import Footer from '../footer/Footer';

const { Content } = Layout;

const HomePage = props => {
    return (
        <Layout>
            <MyHeader loggedInStatus={props.loggedInStatus}
                token={props.token}
                username={props.username} />
            <Layout>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 550,
                    }}
                >
                    <div className="home-content">
                        <h1 className="welcome"> Welcome user {props.username}!</h1>
                        <hr></hr>

                        <div className="circle">
                            <ShoppingCartOutlined style={{ width: '50px', height: '50px' }} className="bigicon" />
                            <h2>Products</h2>
                            <hr className="smallhr"></hr>
                            <p>
                                You can manage receiving new products what includes adding new product or
                                changing products quantity. You also can delete certain product or see
                                all products that are currently in stock.
                            </p>
                        </div>
                        <div className="circle">
                            <ShopOutlined style={{ width: '50px', height: '50px' }} className="bigicon" />
                            <h2>Stores</h2>
                            <hr className="smallhr"></hr>
                            <p>
                                You can receive requests for products from stores and send products to
                                stores that require them. You can see all the stores and supplies of
                                all the products in each of the stores.
                            </p>
                        </div>
                        <div className="circle">
                            <BarChartOutlined style={{ width: '50px', height: '50px' }} className="bigicon" />
                            <h2>Reports</h2>
                            <hr className="smallhr"></hr>
                            <p>
                                You can see different reports on assigned products that can be filtered by date,
                                amount of assigned products, or store name.
                            </p>
                        </div>
                    </div>
                </Content>
            </Layout>
            <Footer />
        </Layout >
    );
};

export default HomePage;
