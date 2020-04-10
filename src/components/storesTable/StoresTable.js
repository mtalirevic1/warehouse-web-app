import React, { Component } from 'react'
import { Table, Layout, Modal, AutoComplete, Form, Input, message, Button } from 'antd';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './StoresTable.css';
import Footer from "../footer/Footer";
import MyHeader from "../header/MyHeader";

const API = 'https://main-server-si.herokuapp.com/api/business/offices';

export default class StoresTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    ...this.getColumnSearchProps('id'),
                    sorter: (a, b) => a.id - b.id,
                    width: '8%'
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    ...this.getColumnSearchProps('address'),
                    sorter: (a, b) => a.address.localeCompare(b.address),
                    width: '15%'
                },
                {
                    title: 'City',
                    dataIndex: 'city',
                    ...this.getColumnSearchProps('city'),
                    sorter: (a, b) => a.city.localeCompare(b.city),
                    width: '10%'
                },
                {
                    title: 'Country',
                    dataIndex: 'country',
                    ...this.getColumnSearchProps('country'),
                    sorter: (a, b) => a.country.localeCompare(b.country),
                    width: '10%'
                },
                {
                    title: 'Phone',
                    dataIndex: 'phoneNumber',
                    ...this.getColumnSearchProps('phoneNumber'),
                    sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
                    width: '10%'
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    ...this.getColumnSearchProps('email'),
                    sorter: (a, b) => a.email.localeCompare(b.email),
                    width: '10%'
                },
                {
                    title: 'See products and quantities',
                    dataIndex: 'seeAllProducts',
                    render: (text, record) =>
                        this.state.offices.length >= 1 ? (
                            <div>
                                <a
                                    key={record.id}
                                    onClick={() => this.onOpenModal(record.id)}>See products and quantities</a>
                                <div>{this.renderModal(record)}</div>
                            </div>
                        ) : null,
                },
                {
                    title: 'Transfer products to store',
                    dataIndex: 'transferProducts',
                    render: (text, record) =>
                        this.state.warehouseProducts ? (
                            <div>
                                <a key={record.id}
                                    onClick={() => this.onOpenTransferProductsModal(record.id)}>Transfer products to store</a>
                                <div>
                                    {this.renderTransferProductsModal(record)}
                                </div>
                            </div>
                        ) : null,
                },

            ],
            columnsProducts: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    ...this.getColumnSearchProps('id'),
                    sorter: (a, b) => a.id - b.id,
                    width: '33%'
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    ...this.getColumnSearchProps('name'),
                    sorter: (a, b) => a.name.localeCompare(b.name),
                    width: '33%'
                },
                {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    ...this.getColumnSearchProps('quantity'),
                    sorter: (a, b) => a.quantity - b.quantity,
                    width: '33%'
                },
            ],
            isLoading: false,
            modalVisible: false,
            transferModalVisible: false,
            activeItemId: null,
            warehouseProducts: [],
            quantityOfSelectedProduct: 0,
            addQuantity: 0,
            productId: null,
            searchText: '',
            searchedColumn: ''
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleTransferProducts = this.handleTransferProducts.bind(this);
    }

    handleQuantityChange(event) {
        this.setState({ addQuantity: event.target.value });
    }

    handleSelect(quantity, id) {
        this.setState({ quantityOfSelectedProduct: quantity, productId: id });
    }

    onOpenModal = id => {
        this.setState({ modalVisible: true, activeItemId: id });
        this.seeProducts(id);
    };

    onCloseModal = () => {
        this.setState({ modalVisible: false, activeItemId: null });
    };

    onOpenTransferProductsModal = id => {
        this.setState({ transferModalVisible: true, activeItemId: id });
    };

    onCloseTransferProductsModal = () => {
        this.setState({ transferModalVisible: false, activeItemId: null });
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
            </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                    text
                ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    componentDidMount() {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.common['Content-Type'] = "application/json";
        this.setState({ isLoading: true });
        axios.get(API)
            .then(response => {
                console.log(response);
                this.setState({ offices: response.data });
            });
        axios.get('https://main-server-si.herokuapp.com/api/warehouse')
            .then(response => {
                this.setState({ warehouseProducts: response.data, isLoading: false })
            });
    }

    seeProducts = id => {
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/offices/' + id + '/products')
            .then(response => {
                let arr = [];
                for (let i = 0; i < response.data.length; i++) {
                    response.data[i].product.quantity = response.data[i].quantity;
                    arr.push(response.data[i].product);
                }
                this.setState({ products: arr });
            });
    };

    renderModal = record => {
        const dataSource2 = this.state.products;
        const columns2 = this.state.columnsProducts;
        if (this.state.activeItemId === record.id) {
            return (
                <Modal
                    mask={false}
                    title="See products and quantities"
                    centered
                    visible={this.state.modalVisible}
                    onCancel={() => this.onCloseModal()}
                    onOk={() => this.onCloseModal()}
                >
                    <div>
                        <Table
                            dataSource={dataSource2}
                            columns={columns2}
                        />
                    </div>
                </Modal >
            );
        }
    };

    renderTransferProductsModal = record => {
        var options = [];
        this.state.warehouseProducts.forEach(item => {
            options.push({
                value: item.productName,
                id: item.productId,
                quantity: item.quantity
            });
        });
        if (this.state.activeItemId === record.id) {
            return (
                <Modal
                    mask={false}
                    title="Transfer products to store"
                    centered
                    visible={this.state.transferModalVisible}
                    onCancel={() => this.onCloseTransferProductsModal()}
                    onOk={() => this.handleTransferProducts(this.state.activeItemId, this.state.addQuantity, this.state.quantityOfSelectedProduct)}
                    okText="Transfer"
                >
                    <div>
                        Product:
                        {<AutoComplete
                            style={{ width: 300 }}
                            options={options}
                            placeholder="Enter product name"
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            onSelect={this.onProductSelected}

                        />}
                    </div>
                    {
                        this.state.quantityOfSelectedProduct !== 0 ?
                            <p>
                                Quantity of selected item in warehouse: {this.state.quantityOfSelectedProduct}
                            </p>
                            : null
                    }
                    <Form>
                        <Form.Item
                            name="productQuantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the quantity!",

                                },
                            ]}
                        >
                            <p>Qunatity of products to transfer: </p>
                            <Input
                                value={this.state.addQuantity} onChange={this.handleQuantityChange}
                                className="modal-form-input"
                                id="number"
                                type="number"
                                max={this.state.quantityOfSelectedProduct}
                                min={0}
                                placeholder="quantity"
                            />
                        </Form.Item>
                    </Form>
                </Modal >
            );
        }
    };

    onProductSelected = (value, option) => {
        this.handleSelect(option.quantity, option.id)
    }

    handleTransferProducts(storeId, quantityToAdd, maxAllowed) {
        if (quantityToAdd > maxAllowed || quantityToAdd < 0) {
            message.error("Input not in allowed range");
            return;
        }
        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        console.log(storeId, this.state.productId, quantityToAdd);
        var that = this;
        axios.post('https://main-server-si.herokuapp.com/api/warehouse', { productId: this.state.productId, quantity: -quantityToAdd })
            .then(() => {
                that.state.warehouseProducts = that.state.warehouseProducts.filter(function (item) {
                    return item.quantity !== 0;
                });
                var length = that.state.warehouseProducts.length;
                for (var i = 0; i < length; i++) {
                    if (that.state.warehouseProducts[i].productId === that.state.productId)
                        that.state.warehouseProducts[i].quantity -= quantityToAdd;
                }
                axios.post('https://main-server-si.herokuapp.com/api/inventory', { officeId: storeId, productId: that.state.productId, quantity: quantityToAdd }).then(() => {
                    message.success("Successfully transferred products");
                    this.handleSelect(null, null);
                    that.setState({ addQunatity: null, transferModalVisible: false, activeItemId: null });
                })
            });


    }
    render() {
        const dataSource = this.state.offices;
        const columns = this.state.columns;
        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                    token={this.props.token}
                    username={this.props.username}
                    handleLogout={this.props.handleLogout} />
                <div className="ant-table">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                    />
                </div>
                <Footer />
            </Layout>
        );
    }
}

