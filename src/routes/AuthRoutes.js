const logger = require('../api/Logger.js').get('auth');
const {generateHashedPasswordWithSalt} = require('../api/Password.js');
const {userSchema} = require('../api/Schema.js');


/**
 * Inits the authentication routes
 * @param {Router} router
 * @param {Db} db
 * @returns {Router}
 */
module.exports = {
    path: '/auth',
    init: (router, db) => {
        const collection = db.collection("users");

        // user registration
        router.post("/register", async (req, res) => {
            const json = userSchema.validateCreate(req.body);
            const conflict = await collection.findOne({email: json.email});
            if (conflict !== null) {
                logger.warn(`email ${json.email} already exists`);
                res.status(409).send(`email ${json.email} already exists`);
            } else {
                json.password = generateHashedPasswordWithSalt(json.password);
                await collection.insertOne(json);
                logger.info(`registered new user ${json._id}`);
                res.status(201).send();
            }
        });

        // user login
        router.post("/login", async (req, res) => {
            res.status(501).send();
        });

        return router;
    }
};