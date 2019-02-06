import { ChartJs } from '../charts';
const cjs = new ChartJs(600, 400);
import {baseBarConfig} from '../charts/config';


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
    try {
        await cjs.drawChart(baseBarConfig);
        const chartBuffer = await cjs.toBuffer();    

        reply
            .code(200)
            // .header('Content-Disposition', 'attachment; filename=chart.png') // Include to download resulting file
            .type('image/png')
            .send(chartBuffer);
    } catch (err) {
        console.error(err);
    }
};