var socket = io.connect();
console.log("socket is defined");
var game = {};
var player = {};

// var playerId;
// var playerPosition;

console.log("preparing for sockets");
    
socket.on('game',function(data){
console.log(data);
//	data.board;
});


socket.emit('join', function(playerObj){
	console.log("emitted join", playerObj);
	player = playerObj
	// playerId = playerObj.id;
	// playerPosition = playerObj.position;
	var spectating = (playerObj.state == 'spectating') ? " (Spectating)" : "";
	$(".username").text(playerObj.name + spectating);

	drawPieceList();
});

socket.on('game', function(gameObj){
	game = _.extend(game, gameObj);
	if ( game.board ) {
		completeBoard = game.board;
		drawGrid();
	}
	if(game.state == "prep")
		$(".status").text("Waiting for more players to join").removeClass("hidden");
	else if(game.state == "ended")
		$(".status").text("Game Over!").removeClass("hidden");
	else{
		$(".status").text("It is currently Player " + (game.turn + 1) + "'s turn").removeClass("hidden");
	}
	if(game.state == "active") {
		var players = game.players;
		for ( var i = 0; i < players.length; i++ ) {
			var thisPlayer = players[i];
			if ( thisPlayer.id == player.id ) {
				player = thisPlayer;
				drawPieceList();
			}
		}
		
	}

})

socket.on('alert', function(message) {
	$(".error").text(message).removeClass("hidden");
	console.log(message);
});



