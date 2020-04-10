import React, { Component } from "react";
import axios from "axios";
import { Layout, Table, message, Input, Button } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";
import moment from 'moment';


export default class ReceivedLogs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    key: '1',
                    title: 'Product name',
                    dataIndex: 'productName',
                    ...this.getColumnSearchProps('productName'),
                    sorter: (a, b) => a.productName.localeCompare(b.productName),
                    width: '25%'
                },
                {
                    key: '2',
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    ...this.getColumnSearchProps('quantity'),
                    sorter: (a, b) => a.quantity - b.quantity,
                    width: '25%'
                },
                {
                    key: '3',
                    title: 'Collection date',
                    dataIndex: 'date',
                    ...this.getColumnSearchProps('date'),
                    sorter: (a, b) => new Date(a.date) - new Date(b.date),
                    width: '25%'
                },
                {
                    key: '4',
                    title: 'Collection time',
                    dataIndex: 'time',
                    ...this.getColumnSearchProps('time'),
                    sorter: (a, b) => moment(a.time, 'hh:mm') - moment(b.time, 'hh:mm'),
                    width: '25%'
                },
            ],
            isLoading: false,
            searchText: '',
            searchedColumn: ''
        };
    }

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
        this.setState({ isLoading: true });
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/warehouse/log')
            .then(response => { this.setState({ logs: response.data, isLoading: false }) })
            .catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to show logs!", [0.7]);
            });
    }

    render() {
        const dataSource = this.state.logs;
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
