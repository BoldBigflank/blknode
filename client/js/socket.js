var socket = io.connect("http://localhost:3000");
console.log("socket is defined");
var game = {};

console.log("preparing for sockets");
    
socket.on('game',function(data){
console.log(data);
//	data.board;
});


socket.emit('join', function(playerObj){
	console.log("emitted join", playerObj);
	$(".username").text(playerObj.name);
});

socket.on('game', function(gameObj){
	game = gameObj;
})

socket.on('alert', function(message) {
	console.log(message);
});

