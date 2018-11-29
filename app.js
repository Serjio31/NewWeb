const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Post = require('./models/post');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/javascripts',
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);


app.get('/', (req, res) => {
  Post.find({}).then(posts => {
      res.render('index', {posts: posts});
  });
});

module.exports = app;