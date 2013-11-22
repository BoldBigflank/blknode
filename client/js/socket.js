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
	var spectating = (playerObj.state == 'spectating') ? " (Spectating)" : "";
	$(".username").text(playerObj.name + spectating);
});

socket.on('game', function(gameObj){
	game = gameObj;
	if(game.state == "prep")
		$(".status").text("Waiting for more players to join").removeClass("hidden");
	else if(game.state == "ended")
		$(".status").text("Game Over!").removeClass("hidden");
	else{
		$(".status").text("It is currently Player " + (game.turn + 1) + "'s turn").removeClass("hidden");
	}
})

socket.on('alert', function(message) {
	$(".error").text(message).removeClass("hidden");
	console.log(message);
});

