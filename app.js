const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

mongoose.connection
    .on('errors', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .on('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

mongoose.connect(config.MONGO_URL, {useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const arr = ['hello', 'world', 'test'];

app.get('/create', (req, res) => {
    mongoose.connection[0].
    res.render('index', {arr: arr})
});

app.get('/create', (req, res) => res.render('create'));
app.post('/create', (req, res) => {
    arr.push(req.body.text);
    res.redirect('/');
});

module.exports = app;