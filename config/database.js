const mongoose = require('mongoose');
const config = require('config');
const models = require('../models');

const db = config.get('database');
const mongoURI = db.connection.url;

const mongoConnection = () => {
    const connect = () => {
        const timeout = 50 * 1000;
        const options = {
            connectTimeoutMS: timeout,
            keepAlive: timeout,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        return mongoose.connect(mongoURI, options);
    };

    connect();
    mongoose.set('debug', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);

    models(mongoose);

    mongoose.connection.on('error', function (err) {
        console.error('Mongoose connection: error - ' + err);
    });

    mongoose.connection.on('connected', function () {
        console.info('Mongoose connection: connected');
    });

    return mongoose;
};

module.exports = mongoConnection();