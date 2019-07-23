var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var http = require('http');
var routes = require('./routes/index');

var app = express();


/** Express **/
app.engine('html', require('ejs-locals'));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/** Подключаем роуты **/
app.use(routes);

http.createServer(app).listen(8090, function () {
    console.log('Poster manage example running');
});


module.exports = app;