import React, { Component } from 'react'
import Chart from "chart.js";
let myLineChart;


export default class LineGraph2 extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const { data, labels, title } = this.props;

        if (typeof myLineChart !== "undefined") myLineChart.destroy();

        myLineChart = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: labels,
                datasets: [
                    {
                        label: title,
                        data: data,
                        fill: false,
                        borderColor: "#0150ac"
                    }
                ]
            },
            options: {
                //Customize chart options

            }
        });
    }

    render() {
        return (
            <div>
                <canvas
                    id="myLineChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}
