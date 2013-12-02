var socket = io.connect();
var game = {};
var player = {};

function updateGameView(gameObj){
	console.log("gameObj", gameObj)
	game = _.extend(game, gameObj);
	if(gameObj.players) game.players = gameObj.players;

	if ( game.board ) {
		completeBoard = game.board;
		drawGrid();
	}
	if(game.state == "prep")
		$(".status").text("Waiting for more players to join").removeClass("hidden");
	
	//Some what repetitive but allows for multiple winners.	
	else if(game.state == "ended") {
		var players = game.players
		var highestScore = 0;
		var winnerCount = 0;
		var winnerText = "";
		
		for ( var i = 0; i < players.length; i++ ) {
			if (players[i].score > highestScore){
				highestScore = players[i].score;
			}
		}

		for ( var i = 0; i < players.length; i++) {
			if (players[i].score == highestScore) {
				winnerText += " "+ players[i].name + " wins!"; 
			}
		}
		
		$(".status").text("Game Over! " + winnerText).removeClass("hidden");
	}else{
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
			var finishedClass = (thisPlayer.state != 'active') ? "strong" : "";
			if(thisPlayer.state != "spectating")
				$("ul.scoreboard").append("<li class='list-group-item " + finishedClass + "'>" + thisPlayer.name + ": " + thisPlayer.score + "</li>");
		}
		
	}
}

// socket.on('game', function(gameObj){
// 	updateGameView(gameObj);
// })

socket.on('alert', function(message) {
	$(".error").text(message).removeClass("hidden");
	console.log(message);
});


socket.emit('join', function(data){
	console.log("emitted join", data);
	player = data.player
	// playerId = playerObj.id;
	// playerPosition = playerObj.position;
	var spectating = (data.player.state == 'spectating') ? " (Spectating)" : "";
	$(".username").text(data.player.name + spectating);
	updateGameView(data.game);

	socket.on(data.game.id, function(gameObj){
		updateGameView(gameObj);
	})

	drawPieceList(1);
});






