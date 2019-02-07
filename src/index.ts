import {configureRoutes} from './routing';

const uuidv4 = require('uuid/v4');
const packageJson = require('../package.json');

const fastify = require('fastify')({
    logger: {
        genReqId: () => uuidv4()
    },
    caseSensitive: false,
    requestIdHeader: 'X-Correlation-Id'
});
const fastifyCors = require('fastify-cors');

fastify.register(fastifyCors, {exposedHeaders: 'Content-Disposition'});

fastify.log.info({func: 'startup'}, 'initilizing routes');
configureRoutes(fastify);

process.on('uncaughtException', error => {
    console.error(error);
    process.exit(99)
})

process.on('unhandledRejection', error => {
    console.log(`{"name":"messenger","module":"unhandledRejection","log_level":"50","message": "'${error}'","v":"0" }`)
})

const start = async (port) => {
    try {
        await fastify.listen(port, '0.0.0.0');
        fastify.log.info({ func: 'listen' },
            `starting application version ${packageJson.version}.${packageJson.buildnumber} on port ${fastify.server.address().port}`
        );
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err, 'unhandled exception occurred');
        process.exit(1);
    }
};

(async() => {
    const port = process.env.PORT || 4770;
    await start(port);
})().catch(err => {
    console.log(`{"name":"chart-server","module":"unhandledException","log_level":"50","message": "'${err}'","v":"0" }`)
    process.exit(1);
});
