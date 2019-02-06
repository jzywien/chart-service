const EventEmitter = require('events');
const { JSDOM } = require('jsdom');
const Canvas = require('canvas');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const chartJsPath = path.dirname(require.resolve('chart.js'));
const chartJsSrc = fs.readFileSync(`${chartJsPath}/../dist/Chart.js`, 'utf-8');

export class ChartJs extends EventEmitter {
    constructor(width = 600, height = 400) {
        super();
        this.height = height;
        this.width = width;

        this.loadWindow();
    }

    loadWindow() {
        const html = `
            <html>
                <body>
                    <div id='chart-div' style='font-size:12; width:${this.width}; height:${this.height};'>
                        <canvas id='myChart' width=${this.width} height=${this.height}></canvas>
                    </div>                
                </body>
                <script>${chartJsSrc}</script>
            </html>
        `;

        const { window } = new JSDOM(html, {
            features: {
                FetchExternalResources: ['script'],
                ProcessExternalResources: ['script'],
                SkipExternalResources: false
            },
            runScripts: 'dangerously'
        });

        this.window = window;
        this.window.CanvasRenderingContext2D = Canvas.Context2D;
        this.canvas = this.window.document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');
    }

    drawChart(chartConfig) {
        this._chart && this._chart.destroy()

        chartConfig.options = chartConfig.options || {}
        chartConfig.options.responsive = false
        chartConfig.options.animation = false

        //this.chartConfig = chartConfig

        this.emit('beforeDraw', this.window.Chart)

        if (chartConfig.options.plugins) {
            this.window.Chart.pluginService.register(chartConfig.options.plugins)
        }

        if (chartConfig.options.charts) {
            for (const chart of chartConfig.options.charts) {
                this.window.Chart.defaults[chart.type] = chart.defaults || {}
                if (chart.baseType) {
                    this.window.Chart.controllers[chart.type] = this.window.Chart.controllers[chart.baseType].extend(chart.controller)
                } else {
                    this.window.Chart.controllers[chart.type] = this.window.Chart.DatasetController.extend(chart.controller)
                }
            }
        }

        this._chart = new this.window.Chart(this.ctx, chartConfig)

        return this
    }

    toBlob (mime) {
        const toBlobRearg = (mime, cb) => this.canvas.toBlob((blob, err) => cb(err, blob), mime)
    
        return promisify(toBlobRearg)(mime)
          .catch(console.error)
      }    

    toBuffer (mime = 'image/png') {
        return this.toBlob(mime)
          .then(blob => new Promise((resolve, reject) => {
            const reader = new this.window.FileReader()
    
            reader.onload = function (){
              const buffer = new Buffer(reader.result)
              resolve(buffer)
            }
    
            reader.readAsArrayBuffer(blob)
          }))
          .catch(console.error)
      }    
}
