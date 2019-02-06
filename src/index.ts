import {configureRoutes} from './routing';

const uuidv4 = require('uuid/v4');
const packageJson = require('../package.json');

const fastify = require('fastify')({
    logger: {
        genReqId: function (request) { return uuidv4() }
    },
    caseSensitive: false,
    requestIdHeader: 'X-Correlation-Id'
});

fastify.log.info({func: 'startup'}, 'initilizing routes');
configureRoutes(fastify);

const port = process.env.PORT || 4770;

//info:for manual logging, fake our logging format for kibana since the logger is dead by now and we can't make a new one
process.on('uncaughtException', error => {
    console.log(`{"name":"messenger","module":"unhandledException","log_level":"50","message": "'${error}'","v":"0" }`)
    process.exit(99)
})

process.on('unhandledRejection', error => {
    console.log(`{"name":"messenger","module":"unhandledRejection","log_level":"50","message": "'${error}'","v":"0" }`)
})

const start = async () => {
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
    await start();
})().catch(err => {
    console.log(`{"name":"chart-server","module":"unhandledException","log_level":"50","message": "'${err}'","v":"0" }`)
    process.exit(1);
});
