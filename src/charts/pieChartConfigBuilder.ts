import { ChartConfiguration } from "chart.js";
import { IChartConfigBuilder, ChartRequest } from "./charts";
import { backgroundColors } from "./colorPalette";

export class PieChartConfigBuilder implements IChartConfigBuilder {
    create(request: ChartRequest): ChartConfiguration {
        const data = request.data.map(entry => entry.yAxisData);
        const labels = request.data.map(entry => entry.xAxisData);
        const numResponses = data.reduce((memo, item) => memo + item, 0);

        var config: ChartConfiguration = {
            type: 'pie',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors
                }],
                labels: labels         
            },
            options: {
                responsive: false,
                animation: {
                    duration: 0
                },
                layout: {
                    padding: 20
                },
                legend: {
                    position: 'right'
                },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'end',                        
                        formatter: (value) => {
                            return `${Math.round((value / numResponses) * 100)}% (${value})`;
                        },
                        display: (context) => {
                            return context.dataset.data[context.dataIndex] !== 0;
                        }
                    }
                }                
            }
        };
        return config;
    }
}