const config = require('./config');
const mongoose = require('mongoose');

module.exports = () => {
    return new Promise((resolve, reject) => {
        mongoose.Promise = global.Promise;
        mongoose.set('debug', true);

        mongoose.connection
            .on('errors', error => reject(error))
            .on('close', () => console.log('Database connection closed.'))
            .on('open', () => {
                const info = mongoose.connections[0];
                console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
            });

        mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });
    });
};