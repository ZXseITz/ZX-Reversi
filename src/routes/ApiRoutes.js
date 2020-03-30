const logger = require('../api/Logger.js').get('api');
const {ValidationError} = require('../api/Errors');
const {userSchema} = require('../api/Schema.js');


module.exports = {
    path: '/api',

    /**
     * Inits the authentication routes
     * @param {Router} router
     * @param {Db} db
     * @returns {Router}
     */
    init: (router, db) => {

        // user registration
        router.get("/home", async (req, res) => {
            res.status(200).send("hello")
        });

        return router;
    }
};