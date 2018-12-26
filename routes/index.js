const _ = require('underscore');

module.exports = (app) => _(['api', 'archive']).each((path) => {
    require(`./${path}`)(app)
});
