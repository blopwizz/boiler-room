$(document).ready( function() {
	var socket = io();

	$('#add').click(function() {
		var now = Date.now();
		socket.emit('request: add', {time: now});
	})

	$('#reset').click(function() {
		socket.emit('request: reset', {});
	})

	socket.on('update', function (data) {
		var str = JSON.stringify(data, null, '\n');
		$('#state').html(str);
	});

});
