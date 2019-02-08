import initChartController from './controllers/chart.controller';
import initHealthController from './controllers/health.controller';

export const configureRoutes = fastify => {
    initChartController(fastify);
    initHealthController(fastify);
};