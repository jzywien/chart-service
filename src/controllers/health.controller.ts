export default fastify => {
    fastify.get('/health', {
        logLevel: 'warn',
        schema: {
            description: 'Health Check',
            tags: ['health']
        }
    }, (_, reply) => reply.code(200).send({status: 'Ok'}));

    fastify.get('/ping', {
        logLevel: 'warn',
        schema: {
            description: 'Ping',
            tags: ['health', 'ping']
        }
    }, (_, reply) => reply.code(200).send()); 
};