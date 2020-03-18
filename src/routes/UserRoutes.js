const {ObjectID} = require("mongodb");
const logger = require('../api/Logger.js').get('users');

/**
 *
 * @param {Router} router
 * @param {Db} db
 * @returns {Router}
 */
module.exports = (router, db) => {
    const collection = db.collection("users");

    router.post("/", async (req, res) => {
        const json = req.body;
        await collection.insertOne(json, (err, data) => {
            if (!err) {
                logger.info(`inserted ${json._id}`);
                res.status(204).send()
            } else {
                logger.error(`insertion failed ${err}`);
                res.status(500).send();
            }
        })
    });

    return router;
};