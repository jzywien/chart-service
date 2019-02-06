import initChartController from './controllers/chart.controller';

export const configureRoutes = fastify => {
    initChartController(fastify);
};