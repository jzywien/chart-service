export const baseBarConfig = {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            data: [5, 3, 4, 6, 4, 5, 4]
        }]
    },
    options: {
        title: {
            fontSize: 26,
            fontStyle: 'bold',
            display: true,
            text: 'Hours Online',
            // fontColor: '#818E9B',
            padding: 40
        },

        plugins: [{
            beforeDraw: function (chartInstance) {
                console.log('FOOOOO')
                console.log('HEIGHT/WIDTH', chartInstance.chart.width, chartInstance.chart.height)
                console.log('HIT BEFORE DRAW', chartInstance.chart.config.data.datasets)

                const ctx = chartInstance.chart.ctx
                const dataset = chartInstance.chart.config.data.datasets[0]

                ctx.fillStyle = 'rgb(248, 249, 251)'
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height)

                const meta = dataset._meta

                for (let [key] of Object.keys(meta)) {
                    for (let i = 0; i < meta[key].data.length; i++) {
                        const bar = meta[key].data[i]._model
                        const gradient = ctx.createLinearGradient(0, bar.y, 0, bar.base)

                        gradient.addColorStop(0, '#78C7FF')
                        gradient.addColorStop(1, '#6085E9')

                        bar.backgroundColor = gradient
                    }
                }
            }
        }],
        layout: {
            padding: 20
        },
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    // max: 12,
                    // max,
                    // suggestedMax: max,
                    // fontColor: '#B7BCC2',
                    fontSize: 22,
                    fontStyle: 'bold',
                    // stepSize,
                    padding: 40
                },
                gridLines: {
                    color: '#F0F1F3',
                    zeroLineColor: '#F0F1F3',
                    drawBorder: false,
                    tickMarkLength: 20
                }
            }],
            xAxes: [{
                barThickness: 40,
                ticks: {
                    // fontColor: '#D0D4D8',
                    fontStyle: 'bold',
                    fontSize: 22
                },
                gridLines: {
                    drawOnChartArea: false,
                    color: '#F0F1F3',
                    zeroLineColor: '#F0F1F3',
                    tickMarkLength: 20
                }
            }]
        }
    }
};

export const basePieConfig = {
    type: 'pie',
    data: {

        datasets: [{
            data: [33, 33, 33],
            backgroundColor: [
                'rgb(255,0,0)',
                'rgb(0,255,0)',
                'rgb(0,0,255)'
            ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Yes',
            'No',
            'Maybe'
        ]
    },
    options: {
        legend: {
            position: 'right'
        },
        labels: {
            fontSize: '24pt'
        },
        // plugins: [{
        //     afterDatasetsDraw: (chart) => {
        //         var ctx = chart.ctx;

        //         chart.data.datasets.forEach((dataset, i) => {
        //             var meta = chart.getDatasetMeta(i);
        //             if (!meta.hidden) {
        //                 meta.data.forEach((element, index) => {
        //                     // Draw the text in black, with the specified font
        //                     ctx.fillStyle = 'rgb(0, 0, 0)';

        //                     var fontSize = 16;
        //                     ctx.font = '16px Helvetica Neue';

        //                     var dataString = `${dataset.data[index]}% (1)`;

        //                     // Make sure alignment settings are correct
        //                     ctx.textAlign = 'center';
        //                     ctx.textBaseline = 'middle';

        //                     var padding = 5;
        //                     var position = element.tooltipPosition();
        //                     ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
        //                 });
        //             }
        //         })
        //     }
        // }]
    }
};