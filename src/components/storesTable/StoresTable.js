import React, { Component } from 'react'
import { Table, Layout, Modal, AutoComplete, Form, Input, message, Button } from 'antd';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './StoresTable.css';
import Footer from "../footer/Footer";
import MyHeader from "../header/MyHeader";
import { exportPDF } from "../manifest/Manifest";

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
            quantityOfSelectedProduct: [],
            addQuantity: [],
            productIds: [],
            searchText: '',
            searchedColumn: '',
            numChildren: 1,
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleTransferProducts = this.handleTransferProducts.bind(this);
    }

    handleQuantityChange(number, event) {
        var newArray = this.state.addQuantity;
        if (number !== -1)
            newArray[number] = parseInt(event.target.value);
        else
            newArray = [];
        this.setState({ addQuantity: newArray });
    }

    handleSelect(number, quantity, id) {
        var newArrayQuantities = this.state.quantityOfSelectedProduct;
        var newArrayProducts = this.state.productIds;
        if (number !== -1) {
            if (number >= newArrayQuantities.length) {
                newArrayQuantities.push(quantity);
                newArrayProducts.push(id);
            } else {
                newArrayQuantities[number] = quantity;
                newArrayProducts[number] = id;
            }
        } else {
            newArrayQuantities = [];
            newArrayProducts = []
        }
        this.setState({ quantityOfSelectedProduct: newArrayQuantities, productIds: newArrayProducts });
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

    onCloseTransferProductsModal = storeId => {
        this.handleSelect(-1);
        this.handleQuantityChange(-1);
        this.setState({ transferModalVisible: false, activeItemId: null, productIds: [], numChildren: 1 });
        if (storeId !== null) {
            this.props.handleAddNotification(
                {
                    title: "You have cancelled transferring products to store with ID " + storeId,
                    description: new Date().toLocaleString(),
                    href: "/storesTable",
                    type: "info"
                }
            );
        }
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

        const children = [];

        for (var i = 0; i < this.state.numChildren; i++) {
            children.push(<ChildComponent that={this} options={options} key={i} number={i} />);
        };

        if (this.state.activeItemId === record.id) {
            return (
                <Modal
                    mask={false}
                    title="Transfer products to store"
                    centered
                    visible={this.state.transferModalVisible}
                    onCancel={() => this.onCloseTransferProductsModal(record.id)}
                    onOk={() => this.handleTransferProducts(this.state.activeItemId, this.state.addQuantity, this.state.quantityOfSelectedProduct)}
                    okText="Transfer"

                >
                    <div>

                    </div>
                    <ParentComponent addChild={this.onAddChild}>
                        {children}
                    </ParentComponent>
                </Modal >
            );
        }
    };


    onAddChild = () => {
        this.setState({
            numChildren: this.state.numChildren + 1,
            addQuantity: [...this.state.addQuantity, 0],
        });
    }

    onProductSelected = (number, option) => {
        this.handleSelect(number, option.quantity, option.id)
    }


    handleTransferProducts(storeId, quantitiesToAdd, quantitiesOnWarehouse) {
        var products = [], productsToSend = [];
        var productNames = "";
        for (var count = 0; count < quantitiesToAdd.length; count++) {
            var quantityToAdd = quantitiesToAdd[count];
            var maxAllowed = quantitiesOnWarehouse[count];
            var productId = this.state.productIds[count];
            if (quantityToAdd > maxAllowed || quantityToAdd < 0) {
                message.error("Input not in allowed range");
                this.props.handleAddNotification(
                    {
                        title: "Error while transferring products to store with ID " + storeId,
                        description: new Date().toLocaleString(),
                        href: "/storesTable",
                        type: "error",
                    }
                );
                return;
            }
            productsToSend.push({productId:productId, officeId:storeId, quantity:quantityToAdd});
        }

        let token = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Authorization"] = token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        var that = this;
        let productBatch={inventory: productsToSend};
        axios.post('https://main-server-si.herokuapp.com/api/inventory/batch', productBatch).then(() => {
            var length = that.state.warehouseProducts.length;
            for (var count = 0; count < quantitiesToAdd.length; count++) {
                for (var i = 0; i < length; i++) {
                    if (that.state.warehouseProducts[i].productId === this.state.productIds[count]) {
                        that.state.warehouseProducts[i].quantity -= quantitiesToAdd[count];

                    }
                }
            }
            that.state.warehouseProducts = that.state.warehouseProducts.filter(function (item) {
                return item.quantity !== 0;
            });
        }, (e) => {
            message.error(e);
            this.props.handleAddNotification(
                {
                    title: "Error while transferring products to store with ID " + storeId,
                    description: new Date().toLocaleString(),
                    href: "/storesTable",
                    type: "error",
                }
            );
        });

        let offLen = this.state.offices.length, adr = "";
        for (let l = 0; l < offLen; l++) {
            if (this.state.offices[l].id === storeId) {
                adr = this.state.offices[l].address;
                break;
            }
        }
        let length = this.state.warehouseProducts.length;
        if (quantitiesToAdd.length !== 1) productNames += "s ";
        else productNames += " ";
        for (let j = 0; j < length; j++) {
            for (let k = 0; k < quantitiesToAdd.length; k++) {
                if (this.state.productIds[k] === this.state.warehouseProducts[j].productId) {
                    let product = { name: this.state.warehouseProducts[j].productName, quantity: quantitiesToAdd[k], address: adr };
                    products.push(product);
                    productNames += this.state.warehouseProducts[j].productName + "(" + quantitiesToAdd[k] + ")";
                    if (k !== quantitiesToAdd.length - 1) productNames += ", ";

                }
            }
        }
        exportPDF(products);
        message.success("You successfully transferred products!");

        this.props.handleAddNotification(
            {
                title: "You have successfully transferred product" + productNames + " to store with ID " + this.state.activeItemId,
                description: new Date().toLocaleString(),
                href: "/storesTable",
                type: "success",
            }
        );
        this.onCloseTransferProductsModal(null);
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


const ParentComponent = props => (
    <div >
        <p><a href="#" onClick={props.addChild}>Add product to transfer</a></p>
        <div id="children-pane">
            {props.children}
        </div>
    </div>
);

const ChildComponent = props => <div>Product:
                                        {<AutoComplete
        style={{ width: 300 }}
        options={props.options}
        placeholder="Enter product name"
        filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={(value, option) => props.that.onProductSelected(props.number, option)}

    />}
    {
        <p>
            Quantity of selected item in warehouse: {props.that.state.quantityOfSelectedProduct[props.number]}
        </p>
    }
    <Form>
        <Form.Item
            rules={[
                {
                    required: true,
                    message: "Please enter the quantity!",

                },
            ]}
        >
            <p>Quantity of products to transfer: </p>
            <Input
                value={props.that.state.addQuantity[props.number]} onChange={(e) => props.that.handleQuantityChange(props.number, e)}
                className="modal-form-input"
                id="number"
                type="number"
                max={props.that.state.quantityOfSelectedProduct[props.number]}
                min={0}
                placeholder="quantity"
            />
        </Form.Item>
    </Form>
</div>;

