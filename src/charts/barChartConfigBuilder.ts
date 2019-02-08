import { ChartConfiguration } from "chart.js";
import { IChartConfigBuilder, ChartRequest } from "./charts";

export class BarChartConfigBuilder implements IChartConfigBuilder {
    create(request: ChartRequest): ChartConfiguration {
        const labels = request.data.map(entry => entry.xAxisData);
        const data = request.data.map(entry => entry.yAxisData);
        const maxValue = Math.max(...data);

        const config: ChartConfiguration = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: 'rgba(31, 177, 212, 0.9)',
                    borderColor: 'rgba(31, 177, 212, 1)',
                    borderWidth: 1,
                }]

            },
            options: {
                responsive: false,
                animation: {
                    duration: 0
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        // Filter out ticks that are more than the max value
                        afterBuildTicks: (context) => {
                            context.ticks = context.ticks.filter(x => x <= maxValue);
                        },
                        gridLines: {
                            drawOnChartArea: false,
                            drawTicks: true,
                            color: 'black',
                        },
                        ticks: {
                            beginAtZero: true,
                            stepSize: 1,
                            max: maxValue + 0.5,
                            maxTicksLimit: maxValue
                        },
                    }],
                    xAxes: [{
                        gridLines: {
                            color: 'black',
                            display: false
                        }
                    }]
                },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                    }
                }
            }
        };
        return config;
    }
}