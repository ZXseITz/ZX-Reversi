const express = require('express');

const initUserRouter = require('./UserRoutes.js');

module.exports = (app, db) => {
    app.use('/api/users', initUserRouter(express.Router(), db));

    return app;
};