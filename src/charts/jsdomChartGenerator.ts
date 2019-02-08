import { IChartGenerator, ChartRequest } from "./charts";
import { ChartConfiguration } from "chart.js";
import { chartJsSrc, chartJsPluginSrc } from "./chartjs";

const { JSDOM } = require('jsdom');
const { promisify } = require('util');
const Canvas = require('canvas');
const EventEmitter = require('events');

export class JsDomChartGenerator extends EventEmitter implements IChartGenerator {
    request: ChartRequest;

    constructor(request: ChartRequest) {
        super();
        this.request = request;
        this.width = request.width;
        this.height = request.height;
    }

    async generate(config: ChartConfiguration) {
        this.loadWindow();
        this.drawChart(config);
        const buffer = await this.toBuffer();
        return buffer;
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
                <script>${chartJsPluginSrc}</script>
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
        this.Chart = this.window.Chart;

        // Unregister ChartDataLables from the global scope
        const ChartDataLabels = this.window.ChartDataLabels;
        this.Chart.plugins.unregister(ChartDataLabels);

        this.window.CanvasRenderingContext2D = Canvas.Context2D;
        this.canvas = this.window.document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');        
    }

    drawChart(chartConfig: ChartConfiguration) {
        this._chart && this._chart.destroy()

        chartConfig.options = chartConfig.options || {}
        chartConfig.options.responsive = false
        chartConfig.options.animation = {duration: 0};

        //this.chartConfig = chartConfig

        this.emit('beforeDraw', this.window.Chart)

        if (chartConfig.options.plugins) {
            this.window.Chart.pluginService.register(chartConfig.options.plugins)
        }

        this._chart = new this.Chart(this.ctx, chartConfig)

        return this        
    }

    toBlob (mime) {
        const toBlobRearg = (mime, cb) => this.canvas.toBlob((blob, err) => cb(err, blob), mime)
    
        return promisify(toBlobRearg)(mime)
          .catch(console.error)
      };

    toBuffer(mime = 'image/png') {
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

