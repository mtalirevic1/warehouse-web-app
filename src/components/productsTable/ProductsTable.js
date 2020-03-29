import React, { Component } from 'react'
import {Table, Row, Col, Icon, Layout} from 'antd';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";

import './ProductsTable.css';


const API = 'https://main-server-si.herokuapp.com/api/products';


export default class ProductsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    width: '20%',
                },
                {
                    title: 'Naziv',
                    dataIndex: 'name',
                },
                {
                    title: 'Cijena',
                    dataIndex: 'price',
                },
                {
                    title: 'Slika',
                    dataIndex: 'image',
                    render: theImageURL => <img alt={theImageURL} src={theImageURL} width="40" height="40"/>
                },
            ], isLoading: false,
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        fetch(API)
            .then(response => response.json())
            .then(data => this.setState({ products: data, isLoading: false }));
    }

    render() {
        const dataSource = this.state.products;
        const columns = this.state.columns;
        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                          token={this.props.token}
                          username={this.props.username}
                          handleLogout={this.props.handleLogout}/>
                <div className="ant-table">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                    />
                </div>
                <Footer/>
            </Layout>
        );
    }
}


