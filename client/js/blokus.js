var chosenPieceId;
var chosenPiece;

window.onload = function () {
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');

	drawGrid();
	drawPieceList();
	
   boardElem.onclick = getLocation;
   pieceChoices.onclick = choosePiece;
}
	    var pieceCanvasLocation = [
	    {'x':20, 'y':10, 'size':1},
	    {'x':90, 'y':10, 'size':2},
	    {'x':170, 'y':10, 'size':3},
	    {'x':250, 'y':10, 'size':3},
	    {'x':330, 'y':10, 'size':4},
	    {'x':410, 'y':10, 'size':4},
	    {'x':510, 'y':10, 'size':4},
	    {'x':610, 'y':10, 'size':4},
	    {'x':710, 'y':10, 'size':4},
	    {'x':10, 'y':110, 'size':5},
	    {'x':130, 'y':110, 'size':5},
	    {'x':250, 'y':110, 'size':5},
	    {'x':370, 'y':110, 'size':5},
	    {'x':490, 'y':110, 'size':5},
	    {'x':610, 'y':110, 'size':5},
	    {'x':730, 'y':110, 'size':5},
	    {'x':10, 'y':230, 'size':5},
	    {'x':130, 'y':230, 'size':5},
	    {'x':250, 'y':230, 'size':5},
	    {'x':370, 'y':230, 'size':5},
	    {'x':490, 'y':230, 'size':5},
	    {'x':610, 'y':230, 'size':5}
	    ];

function choosePiece(event) {
	var pieceChoices = document.getElementById('pieceChoices');
	
	event = event || window.event;

	var x = Math.floor( event.pageX - pieceChoices.offsetLeft );
	var y = Math.floor( event.pageY - pieceChoices.offsetTop );

	for ( var i = 0; i < pieceCanvasLocation.length; i++ ) {
		var canvasLocation = pieceCanvasLocation[i];
		if ( x >= canvasLocation.x
			&& y >= canvasLocation.y 
			&& x <= canvasLocation.x + canvasLocation.size * 20
			&& y <= canvasLocation.y + canvasLocation.size * 20 ) {
				chosenPieceId = i;
				break;
			}
	}

}
				
function drawGrid() {
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	
	for ( var i = 0; i < 20; i++ ) {
		for ( var j = 0; j < 20; j++ ) {
			context.strokeRect(i*20, j*20, 20, 20);
		}
	}	
}

function getLocation(event) {
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	
	event = event || window.event;

	var x = Math.floor( ( event.pageX - boardElem.offsetLeft ) / 20 );
	var y = Math.floor( ( event.pageY - boardElem.offsetTop ) / 20 );


	if ( chosenPieceId ) {
		chosenPiece = available[chosenPieceId];

					context.fillStyle = chosenPiece[0].color;
					for ( var i = 0; i < chosenPiece.length; i++ ) {
						var point = chosenPiece[i];
						var xLoc = x + point.x;
						var yLoc = y + point.y;
						context.fillRect(xLoc*20, yLoc*20, 20, 20);
			
					}					

		// check if move is legal
		/*
		socket.emit('addPiece', 
			{piece: 1, placement: [{x: 0, y: 0}], function(error) {
				if (error) {
					alert('you fucked up');
				}
				else {
					context.fillStyle = chosenPiece[0].color;
					for ( var i = 0; i < chosenPiece.length; i++ ) {
						var point = chosenPiece[i];
						var xLoc = x + point.x;
						var yLoc = y + point.y;
						context.fillRect(xLoc*20, yLoc*20, 20, 20);
			
					}					
				}
			}
		);
		*/

    }
}



//Draw Piece List Function
function drawPieceList(){
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	for ( var i = 0; i < available.length; i++ ) {
		var piece = available[i];
		pieceContext.fillStyle = colors[2];
		for ( var j = 0; j < piece.length; j++ ) {
			var point = piece[j];
			var canvasLocation = pieceCanvasLocation[i];
			var x = canvasLocation.x;
			var y = canvasLocation.y;
			
			var xLoc = x + ( point.x * 20 );
			var yLoc = y + ( point.y * 20 );
			pieceContext.fillRect(xLoc, yLoc, 20, 20);			
		}
	}
}