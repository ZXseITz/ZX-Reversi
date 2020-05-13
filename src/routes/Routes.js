const express = require('express');

const {verifyJWT} = require('../api/Authentication.js')
const authRouter = require('./AuthRoutes.js');
const apiRouter = require('./ApiRoutes.js');

const bearerRegex = /^Bearer ([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)$/;

module.exports = (app, db) => {
    app.use(authRouter.path, authRouter.init(express.Router(), db));
    app.use(apiRouter.path, (req, res, next) => {
        const header = req.header('authorization')
        const bearar = bearerRegex.exec(header);
        if (!bearar) {
            res.status(401).send("Invalid auth header");
        } else {
            const jwt = bearar[1];
            verifyJWT(jwt, (err, user) => {
                if (err) {
                    res.status(401).send("Invalid jwt");
                } else {
                    req.user = user
                    next();
                }
            });
        }
    }, apiRouter.init(express.Router(), db));

    return app;
};