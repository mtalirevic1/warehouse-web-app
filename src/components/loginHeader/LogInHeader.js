import React from 'react';
import './LogInHeader.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { ShoppingCartOutlined, ShopOutlined, BarChartOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import {Link} from 'react-router-dom';


const { Sider } = Layout;

const Header = () => {
    return (
        <div className="header-container">
                <h1 className="header"> Warehouse Web app</h1>
        </div>
    );
};

export default Header;
