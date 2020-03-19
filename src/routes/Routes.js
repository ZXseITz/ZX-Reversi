const express = require('express');

const initAuthRouter = require('./AuthRoutes.js');

module.exports = (app, db) => {
    app.use('/auth', initAuthRouter(express.Router(), db));

    return app;
};