const express = require('express');

const authRouter = require('./AuthRoutes.js');

module.exports = (app, db) => {
    app.use(authRouter.path, authRouter.init(express.Router(), db));

    return app;
};