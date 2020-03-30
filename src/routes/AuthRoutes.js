const logger = require('../api/Logger.js').get('auth');
const {ValidationError} = require('../api/Errors');
const {generateHashedPasswordWithSalt} = require('../api/Password.js');
const {loginUser} = require('../api/Authentication.js');
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
        router.post("/login", loginUser);
        // router.post("/loginUser", async (req, res) => {
            // try {
            //     const json = loginSchema.validateCreate(req.body);
            //     loginUser(req, res);
            // } catch (e) {
            //     if (e instanceof ValidationError) {
            //         logger.warn(e.message);
            //         res.status(400).send(e.message);
            //     } else {
            //         logger.error(e.message);
            //         res.status(500).send(e.message);
            //     }
            // }
        // });
        return router;
    }
};