import { IChartGenerator, ChartRequest } from "./charts";
import { ChartConfiguration } from "chart.js";
import { stringify } from "../utils/util";
import { chartJsSrc, chartJsPluginSrc } from "./chartjs";

const puppeteer = require('puppeteer');

export class PuppeteerChartGenerator implements IChartGenerator {
    request: ChartRequest;

    constructor(request: ChartRequest) {
        this.request = request;
    }

    async generate(config: ChartConfiguration) {
        const {width, height, padding, data} = this.request;
        const configString = stringify(config);

        const numResponses = data.reduce(
            (prev, curr) => prev + curr.yAxisData, 0);

        const maxValue = data.reduce(
            (prev, curr) => (curr.yAxisData > prev) ? curr.yAxisData : prev, 0);
    
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the viewport, include padding on all sides (top/bottom, left/right)
        await page.setViewport({
            width: width + (padding * 2), 
            height: height + (padding * 2)
        });
    
        // Set the initial page content chrome uses to render the page.
        await page.setContent(`
            <html>
            <body style='padding: ${padding}px'>
            <div id='chart-div' style='font-size:12; width:${width}; height:${height};'>
                <canvas id='myChart' width=${width} height=${height}></canvas>
            </div>                
            </body>
            </html>
        `);
    
        // Add the chart JS script tag to the page first
        await page.addScriptTag({
            content: chartJsSrc
        });
    
        // Add the chart JS datalabels plugin next
        await page.addScriptTag({
            content: chartJsPluginSrc
        });

        // Add the last custom script which will create the chart with the correct config
        // numResponses in the script below is used in the formatters for each
        // individual chart type. Formatter is custom function which needs this value
        // but don't want to calculate for every label
        await page.addScriptTag({
            content: `
                const numResponses = ${numResponses};
                const maxValue = ${maxValue};
                const ctx = document.getElementById("myChart");
                const myChart = new Chart(ctx, ${configString});
            `
        });            
    
        const buffer = await page.screenshot();

        await browser.close();

        return buffer;
    }
}