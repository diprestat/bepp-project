const env = {
    dev: {
        DB_URL: 'localhost:27017/nodetest1'
    },
    prod: {
        DB_URL: 'mongo:27017/nodetest1'
    }
};

const modeIndex = 2;
const envName = process.argv[modeIndex] === 'prod' ? 'prod' : 'dev';

/**
 * The current env with the given parameter
 * @type {Object<string,*>}
 */
module.exports = env[envName];