const env = {
    dev: {
        DB_URL: 'localhost:27017/nodetest1'
    },
    prod: {
        DB_URL: process.env.MONGOLAB_URI || 'mongo:27017/nodetest1'
    }
};

const modeIndex = 2;
const envName = process.argv[modeIndex] === 'dev' ? 'dev' : 'prod';

/**
 * The current env with the given parameter
 * @type {Object<string,*>}
 */
module.exports = env[envName];