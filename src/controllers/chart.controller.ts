export default fastify => {
    fastify.get('/charts', {
        logLevel: 'warn',
        schema: {
            description: 'Check Chart',
            tags: ['chart']
        }
    }, getChart);

};

const getChart = async (req, res) => {
    return { reply: 'Charts!' };
};