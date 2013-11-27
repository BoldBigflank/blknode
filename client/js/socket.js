var socket = io.connect();
var game = {};
var player = {};

socket.on('game', function(gameObj){
	game = _.extend(game, gameObj);
	if(gameObj.players) game.players = gameObj.players;

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
		$("ul.scoreboard").html("");
		for ( var i = 0; i < players.length; i++ ) {
			var thisPlayer = players[i];
			if ( thisPlayer.id == player.id ) {
				player = thisPlayer;
				drawPieceList(1);
			}
			if(thisPlayer.state != "spectating")
				$("ul.scoreboard").append("<li class='list-group-item'>" + thisPlayer.name + ": " + thisPlayer.score + "</li>");
		}
		
	}

})

socket.on('alert', function(message) {
	$(".error").text(message).removeClass("hidden");
	console.log(message);
});


socket.emit('join', function(playerObj){
	console.log("emitted join", playerObj);
	player = playerObj
	// playerId = playerObj.id;
	// playerPosition = playerObj.position;
	var spectating = (playerObj.state == 'spectating') ? " (Spectating)" : "";
	$(".username").text(playerObj.name + spectating);

	drawPieceList(1);
});






