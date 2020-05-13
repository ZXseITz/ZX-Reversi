const logger = require('../api/Logger.js').get('auth');
const {ValidationError} = require('../api/Errors');
const {generateHashedPasswordWithSalt, verifyPassword, generateJWT} = require('../api/Authentication.js');
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

        // user loginUser
        router.post("/login", async (req, res) => {
            try {
                const json = loginSchema.validateCreate(req.body);
                const user = await collection.findOne({email: json.email});
                if (user === null) {
                    const errMsg = `Email ${json.email} does not belong to any user`;
                    logger.debug(errMsg)
                    res.status(400).send(errMsg);
                } else if (!verifyPassword(json.password, user['password'])) {
                    const errMsg = `[${user._id}] wrong password`;
                    logger.debug(errMsg)
                    res.status(401).send(errMsg);
                } else {
                    if (user.password) delete user.password
                    const jwt = generateJWT(user);
                    logger.debug(`[${user._id}] login successful`)
                    res.status(200).json({token: jwt, user: user});
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