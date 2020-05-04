import React, { Component } from 'react'
import Chart from "chart.js";
let myBarChart;


export default class BarGraph extends Component {
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

        if (typeof myBarChart !== "undefined") myBarChart.destroy();

        myBarChart = new Chart(myChartRef, {
            type: "bar",
            data: {
                //Bring in data
                labels: labels,
                datasets: [
                    {
                        label: title,
                        data: data,
                        fill: false,
                        borderColor: "#6610f2"
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
                    id="myBarChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}
