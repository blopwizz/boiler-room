var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var low = require('lowdb');
var FileSync = require("lowdb/adapters/FileSync");

// Routes
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/index.js', function(req, res) {
	res.sendFile(__dirname + '/index.js');
});

app.get('/socket.io.js', function(req, res, next) {
	return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

// Create database instance and start server
var adapter = new FileSync('db.json');
var db = low(adapter);
db.defaults({ posts: [] }).write();
http.listen(3000, function() {
	console.log('listening to port 3000 ...');
});

// Socket
io.on('connection', function (socket) {
	socket.on('request: add', function (data) {
		db.get('posts').push(data).write();
		socket.emit('update', db.getState());
	});

	socket.on('request: reset', function() {
		var newState = { posts: [] };
		db.setState(newState);
		socket.emit('update', db.getState());
		console.log('rest request sent');
	})
});