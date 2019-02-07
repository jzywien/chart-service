import { ChartJs } from '../charts';
import {baseBarConfig, basePieConfig} from '../charts/config';

export default fastify => {
    fastify.get('/charts', {
        logLevel: 'warn',
        schema: {
            description: 'Check Chart',
            tags: ['chart']
        }
    }, getChart);

};

const getChart = async (request, reply) => {
    const { body } = request;
    try {
        const cjs = new ChartJs(600, 400);
        await cjs.drawChart(baseBarConfig);
        const chartBuffer = await cjs.toBuffer();
        cjs.destroy();

        reply
            .code(200)
            // .header('Content-Disposition', 'attachment; filename=chart.png') // Include to download resulting file
            .type('image/png')
            .send(chartBuffer);
    } catch (err) {
        reply
            .code(500)
            .send(err);
    }
};