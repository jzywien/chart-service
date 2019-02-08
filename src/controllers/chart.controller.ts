import { ChartRequest, IChartGenerator } from "../charts/charts";
import { ChartConfigurationFactory } from "../charts/chartConfigFactory";
import {PuppeteerChartGenerator} from "../charts/puppeteerChartGenerator";
//import { JsDomChartGenerator } from "../charts/jsdomChartGenerator";

export default fastify => {
    fastify.post('/charts', {
        logLevel: 'warn',
        schema: {
            description: 'Check Chart',
            tags: ['chart']
        }
    }, buildChart);
};

export const buildChart = async (request, reply) => {
    try {
        const chartRequest: ChartRequest = request.body;

        const chartFactory = new ChartConfigurationFactory();
        const chartBuilder = chartFactory.create(chartRequest.type);
        const config = chartBuilder.create(chartRequest);
        const generator: IChartGenerator = new PuppeteerChartGenerator(chartRequest);
        const chartBuffer = await generator.generate(config);

        reply
        .code(200)
        .type('image/png')
        .send(chartBuffer);
    } catch (err) {
        reply
        .code(500)
        .send(err);
    }
};
