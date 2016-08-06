'use strict';
var express = require('express');
var ejs = require('ejs')
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
if('development' == app.get('env')){
	console.log('you are running in dev mode');	
};

//Routes
fs.readdirSync(__dirname + '/routes').forEach(function(filename){
	filename = filename.slice(0, -3);
	filename = require('./routes/' + filename + '.js');
	app.use('/', filename);
});
app.listen(8000, function(req, res){
	console.log('Type in your browser "localhost:8000"');
});
