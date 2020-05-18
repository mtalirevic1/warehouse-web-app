import React, { Component } from "react";
import axios from "axios";
import { Layout, Table, message, Popconfirm, Button, Modal, Form, Input, Popover } from "antd";
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";

export default class ItemTypes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    key: '1',
                    title: 'ID',
                    dataIndex: 'id',
                    width: "10%"

                },
                {
                    key: '2',
                    title: 'Item type name',
                    dataIndex: 'name',
                    width: "20%"
                },
                {
                    key: '3',
                    title: 'Show products with this item type',
                    dataIndex: 'showProductsIT',
                    render: (text, record) =>
                        this.state.itemTypes.length >= 1 ? (
                            <div>
                                <a
                                    key={record.id}
                                    onClick={() => this.onOpenModalProductsIT(record.id)}>Show products with this item type</a>
                                <div>{this.renderModalProductsIT(record)}</div>
                            </div>
                        ) : null,
                    width: "30%"
                },
                {
                    key: '4',
                    title: 'Add item',
                    dataIndex: 'addItem',
                    render: (text, record) =>
                        this.state.itemTypes.length >= 1 ? (
                            <div>
                                <a
                                    key={record.id}
                                    onClick={() => this.onOpenModalAddItem(record.id)}>Add item</a>
                                <div>{this.renderModalAddItem(record)}</div>
                            </div>
                        ) : null,
                    width: "20%"
                },
                {
                    key: '5',
                    title: 'Delete item type',
                    dataIndex: 'deleteButton',
                    render: (text, record) =>
                        this.state.itemTypes.length >= 1 ? (
                            <Popconfirm
                                title={'Are you sure want to delete this item type?'}
                                onCancel={() => this.onCloseDelete(record.name)}
                                onConfirm={() => this.handleDelete(record)}>
                                <a>Delete item type</a>
                            </Popconfirm>
                        ) : null,
                    width: "20%"
                }
            ],
            isLoading: false,
            addVisible: false,
            addName: null,

            addItemVisible: false,
            addItemName: null,
            activeItemTypeId: null,
            addItemUnit: null,
            expandedRowKeys: [],

            productsITVisible: null,
            productsIT: null,

            productsIVisible: null,
            productsI: null,
            activeItemId: null
        };

        this.handleAddName = this.handleAddName.bind(this);
        this.handleAddItemName = this.handleAddItemName.bind(this);
        this.handleAddItemUnit = this.handleAddItemUnit.bind(this);
        this.expandedRowRender = this.expandedRowRender.bind(this);
    }

    refreshKey() {
        const key = [];
        key.push(this.state.expandedRowKeys[0]);
        this.setState({ expandedRowKeys: [] });
        this.setState({ expandedRowKeys: key });
    }

    onCloseDelete = name => {
        this.props.handleAddNotification(
            {
                title: "You have cancelled deleting item type " + name,
                description: new Date().toLocaleString(),
                href: "/itemTypes",
                type: "info"
            }
        );
    }

    onCloseItemDelete = name => {
        this.props.handleAddNotification(
            {
                title: "You have cancelled deleting item " + name,
                description: new Date().toLocaleString(),
                href: "/itemTypes",
                type: "info"
            }
        );
    }

    handleDelete = record => {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.delete('https://main-server-si.herokuapp.com/api/itemtypes/' + record.id)
            .then(response => {
                message.success("You successfully deleted an item type!", [0.7]);
                this.props.handleAddNotification(
                    {
                        title: "You have successfully deleted item type " + record.name,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "success",
                    }
                );
                this.setState({ itemTypes: response.data, isLoading: false })
            }).catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to remove item type!", [0.7]);
                this.props.handleAddNotification(
                    {
                        title: "Error while deleting item type " + record.name,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "error",
                    }
                );
            })
    }

    handleItemDelete = record => {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.delete('https://main-server-si.herokuapp.com/api/items/' + record.id)
            .then(response => {
                message.success("You successfully deleted an item!", [0.7]);
                this.props.handleAddNotification(
                    {
                        title: "You have successfully deleted item " + record.name,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "success",
                    }
                );
                for (let i = 0; i < this.state.itemTypes.length; i++) {
                    if (this.state.itemTypes[i].id === this.state.expandedRowKeys[0]) {
                        this.state.itemTypes[i].items = response.data;
                    }
                }
                this.refreshKey();
            }).catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to remove item!", [0.7]);
                this.props.handleAddNotification(
                    {
                        title: "Error while deleting item " + record.name,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "error",
                    }
                );
            })
    }

    handleAddName(event) { this.setState({ addName: event.target.value }); }

    handleAddItemName(event) { this.setState({ addItemName: event.target.value }); }

    handleAddItemUnit(event) { this.setState({ addItemUnit: event.target.value }); }

    onOpenAdd = () => { this.setState({ addVisible: true, addName: null }); }

    onCloseAdd = name => {
        this.setState({ addVisible: false, addName: null });
        if (name !== null) {
            this.props.handleAddNotification(
                {
                    title: "You have cancelled adding new item type",
                    description: new Date().toLocaleString(),
                    href: "/itemTypes",
                    type: "info"
                }
            );
        }
    };

    onCloseAddItem = name => {
        this.setState({ addItemVisible: false, activeItemTypeId: null, addItemName: null, addItemUnit: null });
        if (name !== null) {
            this.props.handleAddNotification(
                {
                    title: "You have cancelled adding new item for item type " + name,
                    description: new Date().toLocaleString(),
                    href: "/itemTypes",
                    type: "info"
                }
            );
        }
    };

    onCloseProductsIT() {
        this.setState({ productsITVisible: false, activeItemTypeId: null, productsIT: null });
    };

    onCloseProductsI() {
        this.setState({ productsIVisible: false, activeItemId: null, productsI: null });
    };

    add = () => {
        if (this.state.addName === null) {
            message.error("Missing information in input field!", [0.7]);
            return;
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common['Content-Type'] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/itemtypes', { name: this.state.addName })
            .then(response => {
                this.props.handleAddNotification(
                    {
                        title: "You have successfully added new item type " + this.state.addName,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "success",
                    }
                );
                this.onCloseAdd(null);
                message.success("You successfully added new item type!", [0.7]);
                this.setState({ itemTypes: response.data, isLoading: false });
            }).catch(e => {
                console.log("ERROR: " + e);
                message.error("Unable to add new item type!", [0.7]);
                this.props.handleAddNotification(
                    {
                        title: "Error while adding new item type " + this.state.addName,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "error",
                    }
                );
            })
    }

    addItem = (itemTypeId, itemTypeName) => {
        if (this.state.addItemName === null || this.state.addItemUnit === null) {
            message.error("Missing information in input field!", [0.7]);
            return;
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common['Content-Type'] = "application/json";
        axios.post('https://main-server-si.herokuapp.com/api/items',
            {
                unit: this.state.addItemUnit,
                name: this.state.addItemName,
                itemTypeId: itemTypeId
            })
            .then(response => {
                this.props.handleAddNotification(
                    {
                        title: "You have successfully added new item " + this.state.addItemName + " for item type " + itemTypeName,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "success",
                    }
                );
                this.onCloseAddItem(null);
                message.success("You successfully added new item!", [0.7]);
                for (let i = 0; i < this.state.itemTypes.length; i++) {
                    if (this.state.itemTypes[i].id === itemTypeId) {
                        this.state.itemTypes[i].items = response.data;
                    }
                }
                this.refreshKey();
            }).catch(e => {
                console.log("ERROR: " + e);
                message.error("Unable to add new item!", [0.7]);
                this.props.handleAddNotification(
                    {
                        title: "Error while adding new item " + this.state.addItemName + " for item type " + itemTypeName,
                        description: new Date().toLocaleString(),
                        href: "/itemTypes",
                        type: "error",
                    }
                );
            })
    }

    setProductsIT = itemTypeId => {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/itemtypes/' + itemTypeId + '/products')
            .then(response => {
                this.setState({ productsIT: response.data });
            }).catch(e => {
                console.log("ERROR: " + e);
                message.error("Unable to show products!", [0.7]);
            });
    }

    setProductsI = itemId => {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/items/' + itemId + '/products')
            .then(response => {
                this.setState({ productsI: response.data });
            }).catch(e => {
                console.log("ERROR: " + e);
                message.error("Unable to show products!", [0.7]);
            });
    }


    onOpenModalAddItem = id => {
        this.setState({ addItemVisible: true, activeItemTypeId: id })
    };

    onOpenModalProductsIT = id => {
        this.setState({ productsITVisible: true, activeItemTypeId: id });
        this.setProductsIT(id);
    };

    onOpenModalProductsI = id => {
        this.setState({ productsIVisible: true, activeItemId: id });
        this.setProductsI(id);
    };

    renderModalAddItem = record => {
        if (this.state.activeItemTypeId === record.id) {
            return (
                <Modal
                    mask={false}
                    title="Add new item"
                    centered
                    visible={this.state.addItemVisible}
                    onOk={() => this.addItem(record.id, record.name)}
                    onCancel={() => this.onCloseAddItem(record.name)}
                >
                    <div className="modalAddIteminfo">
                        <p>Item type id: {record.id}</p>
                    </div>
                    <Form>
                        <Form.Item
                            name="itemName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter item name!",

                                },
                            ]}
                        >
                            <Input
                                onChange={this.handleAddItemName}
                                value={this.state.addItemName}
                                defaultValue={this.state.addItemName}
                                className="add-item-modal-form-input"
                                name="itemName"
                                id="itemName"
                                placeholder="Item type name"
                            />
                        </Form.Item>
                        <Form.Item
                            name="itemUnit"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter item unit!",
                                },
                            ]}
                        >
                            <Input
                                id="itemUnit"
                                name="itemUnit"
                                placeholder="Item unit"
                                value={this.state.addItemUnit}
                                defaultValue={this.state.addItemUnit}
                                onChange={this.handleAddItemUnit}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    };

    getContent = product => {
        let content = [];
        for (let i = 0; i < product.items.length; i++) {
            content.push(<li key={product.items[i].item.id}>{product.items[i].item.name} ({product.items[i].value} {product.items[i].item.unit})</li>);
        }
        if (content.length > 0) return <div><ul>{content}</ul></div>;
        else return <div><p>No items to show for this product!</p></div>
    }


    renderModalProductsIT = record => {
        if (this.state.activeItemTypeId === record.id) {
            const dataSource2 = this.state.productsIT;
            const columns2 = [
                {
                    key: '1',
                    title: 'ID',
                    dataIndex: 'id',
                    width: "10%"
                },
                {
                    key: '2',
                    title: 'Product name',
                    dataIndex: 'name',
                    width: "10%"
                },
                {
                    key: '3',
                    title: 'Product items',
                    dataIndex: 'productItems',
                    width: "10%",
                    render: (text, record) => (
                        <span className="table-operation">
                            <Popover placement="right" content={this.getContent(record)}>
                                <Button type="primary"> Product items</Button>
                            </Popover>
                        </span>
                    )
                }
            ];
            let t = "Products with item type " + record.name;
            return (
                <Modal
                    mask={false}
                    title={t}
                    centered
                    visible={this.state.productsITVisible}
                    onCancel={() => this.onCloseProductsIT()}
                    onOk={() => this.onCloseProductsIT()}
                >
                    <div>
                        <Table
                            dataSource={dataSource2}
                            columns={columns2}
                            rowKey={record => record.id}
                        />
                    </div>
                </Modal >
            );
        }
    };

    renderModalProductsI = record => {
        if (this.state.activeItemId === record.id) {
            const dataSource2 = this.state.productsI;
            const columns2 = [
                {
                    key: '1',
                    title: 'ID',
                    dataIndex: 'id',
                    width: "10%"
                },
                {
                    key: '2',
                    title: 'Product name',
                    dataIndex: 'name',
                    width: "10%"
                },
                {
                    key: '3',
                    title: 'Product items',
                    dataIndex: 'productItems',
                    width: "10%",
                    render: (text, record) => (
                        <span className="table-operation">
                            <Popover placement="right" content={this.getContent(record)}>
                                <Button type="primary"> Product items</Button>
                            </Popover>
                        </span>
                    )
                }
            ];
            let t = "Products with item " + record.name;
            return (
                <Modal
                    mask={false}
                    title={t}
                    centered
                    visible={this.state.productsIVisible}
                    onCancel={() => this.onCloseProductsI()}
                    onOk={() => this.onCloseProductsI()}
                >
                    <div>
                        <Table
                            dataSource={dataSource2}
                            columns={columns2}
                            rowKey={record => record.id}
                        />
                    </div>
                </Modal >
            );
        }
    };

    expandedRowRender = (itemTypeId, i) => {
        const columns = [
            {
                key: '1',
                title: 'ID',
                dataIndex: 'id',
                width: "15%"
            },
            {
                key: '2',
                title: 'Item name',
                dataIndex: 'name',
                width: "20%"
            },
            {
                key: '3',
                title: 'Item unit',
                dataIndex: 'unit',
                width: "15%"
            },
            {
                key: '4',
                title: 'Show products with this item',
                dataIndex: 'showProductsI',
                render: (text, record) =>
                    this.state.itemTypes.length >= 1 ? (
                        <div>
                            <a
                                key={record.id}
                                onClick={() => this.onOpenModalProductsI(record.id)}>Show products with this item</a>
                            <div>{this.renderModalProductsI(record)}</div>
                        </div>
                    ) : null,
                width: "30%"
            },
            {
                key: '5',
                title: 'Delete item',
                dataIndex: 'deleteButton2',
                render: (text, record) =>
                    this.state.itemTypes.length >= 1 ? (
                        <Popconfirm
                            title={'Are you sure want to delete this item?'}
                            onCancel={() => this.onCloseItemDelete(record.name)}
                            onConfirm={() => this.handleItemDelete(record)}>
                            <a>Delete item</a>
                        </Popconfirm>
                    ) : null,
                width: "20%"
            }
        ];

        var data = this.state.itemTypes[i].items;
        if (data.length > 0) {
            return <Table
                style={{
                    marginLeft: 50
                }}
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="id" />;
        }
        else {
            return <p
                style={{
                    marginLeft: 100
                }}
            >No items in this item type!</p>;
        }
    };

    getItems() {
        for (let i = 0; i < this.state.itemTypes.length; i++) {
            axios.get('https://main-server-si.herokuapp.com/api/itemtypes/' + this.state.itemTypes[i].id + '/items')
                .then(response => {
                    this.state.itemTypes[i].items = response.data;
                })
                .catch(er => {
                    console.log("ERROR: " + er);
                    message.error("Unable to get items!", [0.7]);
                });
        }
    }

    onTableRowExpand(expanded, record) {
        var keys = [];
        if (expanded) {
            keys.push(record.id);
        }
        this.setState({ expandedRowKeys: keys });
    }


    componentDidMount() {
        this.setState({ isLoading: true });
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/itemtypes')
            .then(response => {
                this.setState({ itemTypes: response.data, isLoading: false });
                this.getItems();
            })
            .catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to show item types!", [0.7]);
            });
    }

    render() {
        const dataSource = this.state.itemTypes;
        const columns = this.state.columns;
        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                    token={this.props.token}
                    username={this.props.username}
                    handleLogout={this.props.handleLogout} />
                <div className="ant-table">
                    <div className="add">
                        <Button type="primary" onClick={this.onOpenAdd}>
                            Add new item type
                        </Button>
                        <Modal
                            title="Add new item type"
                            centered
                            visible={this.state.addVisible}
                            onOk={this.add}
                            onCancel={this.onCloseAdd}
                        >
                            <Form
                                initialValues={{ remember: true }}
                            >
                                <Form.Item
                                    name="itemTypeName"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter item type name!"
                                        },
                                    ]}
                                >
                                    <Input
                                        className="add-form-input"
                                        name="itemTypeName"
                                        id="itemTypeName"
                                        value={this.state.addName}
                                        defaultValue={this.state.addName}
                                        onChange={this.handleAddName}
                                        placeholder="Item type name" />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowKey={record => record.id}
                        expandedRowRender={(record, i) => this.expandedRowRender(record.id, i)}
                        expandedRowKeys={this.state.expandedRowKeys}
                        onExpand={(expanded, record) => this.onTableRowExpand(expanded, record)}
                    />

                </div>
                <Footer />
            </Layout>
        );
    }
}
