const _ = require('underscore');

module.exports = (app) => _([
    'auth', 'post', 'comment', 'upload'
]).each((path) => {
    require(`./${path}`)(app)
});