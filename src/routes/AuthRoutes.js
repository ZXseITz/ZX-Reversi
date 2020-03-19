const crypto  = require('crypto');
const logger = require('../api/Logger.js').get('auth');

/**
 * Creates a random string with given length
 * @param {number} length - length of random string
 * @returns {string}
 */
const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

/**
 * Hashes the password with given salt
 * @param {string} password - plain text password
 * @param {string} salt - random salt
 * @returns {string}
 */
const hashPasswordWithSHA512 = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

/**
 * Encrypts a password
 * @param {string} password - plain text password
 * @returns {string}
 */
const generateHashedPasswordWithSalt = (password) => {
    const salt = generateRandomString(16);
    const hashedPassword = hashPasswordWithSHA512(password, salt);
    return `${salt}:${hashedPassword}`
};

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
            // todo validate
            const json = req.body;
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