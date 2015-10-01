'use strict';

var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/dist'));

var server = http.createServer(app);
server.listen(port);

console.log('HTTP server listening on %d', port);
