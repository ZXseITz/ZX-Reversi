const {MongoClient, Db} = require('mongodb');

const logger = require('./Logger.js').get("database");
const config = require('../config/config.json');

const c = config.database;
const uri = `mongodb://${c.user}:${c.pw}@${c.host}:${c.port}?authSource=${c.authSource}`;

module.exports =  {
    /**
     * Connects to configured database
     * @returns {Promise<Db>}
     */
    connect: async () => {
        const client = await MongoClient.connect(uri, {
            numberOfRetries: 60,
            auto_reconnect: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        const database = client.db(c.name);
        logger.info(`connected to mongodb://${c.host}:${c.port}`);
        return database
    }
};
