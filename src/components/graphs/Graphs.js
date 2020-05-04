import React, {Component} from "react";
import {Layout, message} from 'antd';
import MyHeader from "../header/MyHeader";
import Footer from "../footer/Footer";
import axios from "axios";
import { Row, Col } from 'antd';
import BarGraph from "./BarGraph";
import LineGraph from "./LineGraph";
import LineGraph2 from "./LineGraph2";

const {Content} = Layout;

const generateColor = () => {
    return "#" + Math.random().toString(16).substr(-6);
};

export default class Graphs extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + this.props.token;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.get('https://main-server-si.herokuapp.com/api/warehouse/shipping')
            .then(response => {
                let data = response.data, names=[], numbers=[];
                for(let i=0; i<data.length;i++){
                    names.push(data[i].productName);
                    numbers.push(data[i].quantity);
                }
                console.log("NAMES: "+names);
                console.log("QUANTITIES: "+numbers);
                this.setState({names: names, quantities: numbers })
            })
            .catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to load product data!", [0.7]);
            });
        axios.get('https://main-server-si.herokuapp.com/api/warehouse/log')
            .then(response => {
                const collection = response.data.map(x => ({ ...x, date: x.date.split(".").reverse().join("-").substr(1), quantity: Number(x.quantity)}));
                const mapDayToMonth = collection.map(x => ({...x, date: new Date(x.date).getMonth()}));
                const sumPerMonth = mapDayToMonth.reduce((acc, cur) => {
                    acc[cur.date] = acc[cur.date] + cur.quantity || cur.quantity;
                    return acc;
                }, {});
                axios.get('https://main-server-si.herokuapp.com/api/inventory/log')
                    .then(response2 => {
                        const collection2 = response2.data.map(x => ({ ...x, date: x.date.split(".").reverse().join("-").substr(1), quantity: Number(x.quantity)}));
                        const mapDayToMonth2 = collection2.map(x => ({...x, date: new Date(x.date).getMonth()}));
                        const sumPerMonth2 = mapDayToMonth2.reduce((acc, cur) => {
                            acc[cur.date] = acc[cur.date] + cur.quantity || cur.quantity;
                            return acc;
                        }, {});
                        let size=0;
                        if(sumPerMonth2.length>sumPerMonth.length){
                            size=sumPerMonth.length;
                        }
                        else{
                            size=sumPerMonth2.length;
                        }
                        console.log(sumPerMonth);
                        console.log(sumPerMonth2);
                        /*for(let i=0;i<size;i++){
                            sumPerMonth[i]
                        }*/
                        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];
                        this.setState({months: monthNames});

                        let num=[];
                        for(let i=0;i<12;i++){
                            if(sumPerMonth.hasOwnProperty(i)){
                                num.push(Math.abs(Number(sumPerMonth[i])));
                            }
                            else{
                                num.push(0);
                            }
                        }
                        this.setState({imports: num});

                        let num2=[];
                        for(let i=0;i<12;i++){
                            if(sumPerMonth2.hasOwnProperty(i)){
                                num2.push(Math.abs(Number(sumPerMonth2[i])));
                            }
                            else{
                                num2.push(0);
                            }
                        }
                        this.setState({exports: num2});
                    })
                    .catch(er => {
                        console.log("ERROR: " + er);
                        message.error("Unable to load export log data!", [0.7]);
                    });
            })
            .catch(er => {
                console.log("ERROR: " + er);
                message.error("Unable to load import log data!", [0.7]);
            });
    }

    render() {
        return (
            <Layout>
                <MyHeader loggedInStatus={this.props.loggedInStatus}
                          token={this.props.token}
                          username={this.props.username}
                          handleLogout={this.props.handleLogout}
                />
                <Layout>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 70,
                            margin: 0,
                        }}
                    >
                        <>
                            <Row>
                                <Col span={10}>
                                    <h1>Top Products by Traffic</h1>
                                    <BarGraph
                                        data={this.state.quantities}
                                        labels={this.state.names}
                                        title={"Traffic"}
                                    />
                                </Col>
                                <Col span={2}>

                                </Col>
                                <Col span={10}>
                                    <h1>Number of Imports by Month</h1>
                                    <LineGraph
                                        data={this.state.imports}
                                        labels={this.state.months}
                                        title={"Import"}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <h1>Number of Exports by Month</h1>
                                    <LineGraph2
                                        data={this.state.exports}
                                        labels={this.state.months}
                                        title={"Export"}
                                    />
                                </Col>
                            </Row>
                            <Row>

                            </Row>
                        </>
                    </Content>
                </Layout>
                <Footer/>
            </Layout>
        );
    }
}
