import React, { Component } from 'react'
import {Table, Row, Col, Icon, Layout, Popconfirm, message} from 'antd';
import axios from 'axios';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";

import './ProductsTable.css';


const API = 'https://main-server-si.herokuapp.com/api/products';

const confirmationText = 'Are you sure want to delete this product?';


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
                {
                    title: 'Delete',
                    dataIndex: 'deleteButton',
                    render: (text, record) =>
                        this.state.products.length >= 1 ? (
                            <Popconfirm title={confirmationText} onConfirm={() => this.handleDelete(record)}>
                                <a>Delete</a>
                            </Popconfirm>
                        ) : null,
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

    handleDelete = record => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.delete('https://main-server-si.herokuapp.com/api/products/'+record.id)
            .then(response =>{
                message.success("You successfully deleted a product!")
            }).catch(er => {
                message.error("Unable to remove product!");
        }).then(()=>{
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


