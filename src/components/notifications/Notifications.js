import React, { Component } from "react";
import { List, Avatar, Layout, Button, Popconfirm } from 'antd';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";
import './Notifications.css';
import { CheckCircleTwoTone, InfoCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Content } = Layout;

const confirmationText = 'Are you sure want to delete this notification?';


export default class Notifications extends Component {


    render() {
        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                    token={this.props.token}
                    username={this.props.username}
                    handleLogout={this.props.handleLogout} />
                <Layout>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 100,
                            margin: 0,
                            minHeight: 550,
                        }}
                    >
                        <div>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.props.notifications}
                                renderItem={(item, index) => {
                                    let icon = <CheckCircleTwoTone twoToneColor="#52c41a" />;
                                    if (item.type === "info") icon = <InfoCircleTwoTone />;
                                    else if (item.type === "error") icon = <CloseCircleTwoTone twoToneColor="#d60c09" />;
                                    return (
                                        <List.Item>
                                            <List.Item.Meta
                                                key={index}
                                                avatar={<Avatar icon={icon} />}
                                                title={<Link to={item.href}> {item.title}</Link>}
                                                description={item.description}
                                            />
                                            <Popconfirm title={confirmationText} onConfirm={() => this.props.handleDeleteNotification(index)}>
                                                <Button>Delete</Button>
                                            </Popconfirm>
                                        </List.Item>
                                    );
                                }
                                }
                            />
                        </div>
                    </Content>
                </Layout>
                <Footer />
            </Layout>
        );
    }
}
