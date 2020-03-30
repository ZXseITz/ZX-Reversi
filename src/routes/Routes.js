const express = require('express');
const {requireUserLogin} = require('../api/Authentication.js');

const authRouter = require('./AuthRoutes.js');
const apiRouter = require('./ApiRoutes.js');

module.exports = (app, db) => {
    app.use(authRouter.path, authRouter.init(express.Router(), db));
    app.use(apiRouter.path, requireUserLogin, apiRouter.init(express.Router(), db));

    return app;
};