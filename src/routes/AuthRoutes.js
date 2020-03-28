const logger = require('../api/Logger.js').get('auth');
const {ValidationError} = require('../api/Errors');
const {generateHashedPasswordWithSalt, verifyPassword} = require('../api/Password.js');
const {loginSchema, userSchema} = require('../api/Schema.js');



module.exports = {
    path: '/auth',

    /**
     * Inits the authentication routes
     * @param {Router} router
     * @param {Db} db
     * @returns {Router}
     */
    init: (router, db) => {
        const collection = db.collection("users");

        // user registration
        router.post("/register", async (req, res) => {
            try {
                const json = userSchema.validateCreate(req.body);
                const conflict = await collection.findOne({email: json.email});
                if (conflict !== null) {
                    logger.warn(`${json.email} belongs already to another user`);
                    res.status(409).send(`${json.email} belongs already to another user`);
                } else {
                    json.password = generateHashedPasswordWithSalt(json.password);
                    await collection.insertOne(json);
                    logger.info(`[${json._id}] registered successfully`);
                    res.status(201).send();
                }
            } catch (e) {
                if (e instanceof ValidationError) {
                    logger.warn(e.message);
                    res.status(400).send(e.message);
                } else {
                    logger.error(e.message);
                    res.status(500).send(e.message);
                }
            }
        });

        // user login
        router.post("/login", async (req, res) => {
            try {
                const json = loginSchema.validateCreate(req.body);
                const user = await collection.findOne({email: json.email});
                if (user === null) {
                    logger.warn(`${json.email} does not belong to any user`);
                    res.status(400).send(`${json.email} does not belong to any user`);
                }
                if (verifyPassword(json.password, user['password'])) {
                    logger.info(`[${user._id}] logged in successfully`);
                    res.status(200).send();  //todo token
                } else {
                    logger.info(`[${user._id}] login failed`);
                    res.status(401).send();
                }
            } catch (e) {
                if (e instanceof ValidationError) {
                    logger.warn(e.message);
                    res.status(400).send(e.message);
                } else {
                    logger.error(e.message);
                    res.status(500).send(e.message);
                }
            }
        });

        return router;
    }
};