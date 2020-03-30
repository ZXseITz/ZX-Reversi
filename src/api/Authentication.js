const {verifyPassword} = require('../api/Password.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {ObjectID, Db} = require('mongodb');


const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const apiKey = fs.readFileSync('./config/apikey');
const jwtSettings = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: apiKey,
    jsonWebTokenOptions: {
        expiresIn: "1d"
    }
};

module.exports = {
    /**
     * initializes the authentication module
     * @param {Db} db - database
     */
    initAuthentication: (db) => {
        const collection = db.collection('users');
        passport.use('userLocal', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, callback) => {
            try {
                const user = await collection.findOne({email: email});
                if (user === null) {
                    return callback(null, false, {message: `${email} does not belong to any user`});
                }
                if (!verifyPassword(password, user['password'])) {
                    return callback(null, false, {message: `[${user._id}] wrong password`});
                } else {
                    delete user.password;
                    return callback(null, user, {message: `[${user._id}] login successful`});
                }
            } catch (e) {
                return callback(null, false, {message: `user login failed: ${e.message}`})
            }
        }));
        passport.use('userJWT', new JWTStrategy(jwtSettings, async (jwtTokenPayload, callback) => {
            try {
                const user = await collection.findOne({_id: new ObjectID(jwtTokenPayload._id)});
                if (user === null) {
                    return callback({message: `[${jwtTokenPayload.id}] does not belong to any user`}, null);
                }
                delete user.password;
                return callback(null, user);
            } catch (e) {
                return callback(`user login failed: ${e.message}`, null)
            }
        }));
    },

    /**
     * authenticates user credentials
     *
     * @param req - http request
     * @param res - http response
     * @returns {Function}
     */
    loginUser: (req, res) => {
        return passport.authenticate('userLocal', {
            session: false
        }, (err, authObject, info) => {
            if (err || !authObject) {
                return res.status(400).json({message: 'Authentication failed'});
            }
            req.login(authObject, {session: false}, (err) => {
                if (err) {
                    res.status(400).json({message: 'Authentication failed'});
                }
                if (typeof authObject.password !== "undefined") delete authObject.password;
                const token = jwt.sign(authObject, apiKey);
                return res.json({token: token, identity: authObject});
            });
        }) (req, res);
    },

    /**
     * Checks user jwt token
     * @param req - http request
     * @param res - http response
     * @param next - next middleware
     * @returns {Function} - middleware function
     */
    requireUserLogin: (req, res, next) => {
        return passport.authenticate('userJWT', {
            session: false
        }) (req, res, next);
    }
};