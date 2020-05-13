const logger = require('./api/Logger').get();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dbConnection = require('./api/DbConnection');
const initRoutes = require('./routes/Routes');

const port = 8000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    // CORS
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

dbConnection.connect().then(db => {
    initRoutes(app, db).listen(port, () => logger.info(`running on port ${port}`));
}).catch(err => {
    logger.error(err);
});
