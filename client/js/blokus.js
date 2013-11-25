var chosenPieceId = -1;
var chosenPiece;
var completeBoard;

window.onload = function () {
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');

	drawGrid();

	
   boardElem.onclick = getLocation;
   pieceChoices.onclick = choosePiece;
   boardElem.onmousemove = drawOutline;
}


	    var colors = ['green', 'blue', 'purple', 'red'];

	    var available = [
			[{'x':0, 'y':0}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':1, 'y':1}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':2, 'y':0}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':0, 'y':1}, {'x':1, 'y':1}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':2, 'y':0}, {'x':1, 'y':1}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':2, 'y':0}, {'x':3, 'y':0}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':2, 'y':0}, {'x':2, 'y':1}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':1, 'y':1}, {'x':2, 'y':1}],
			[{'x':0, 'y':0}, {'x':0, 'y':1}, {'x':1, 'y':0}, {'x':2, 'y':0}, {'x':3, 'y':0}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':1, 'y':1}, {'x':1, 'y':2}, {'x':2, 'y':0}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':2, 'y':0}, {'x':0, 'y':1}, {'x':0, 'y':2}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':1, 'y':1}, {'x':2, 'y':1}, {'x':3, 'y':1}],
			[{'x':0, 'y':0}, {'x':0, 'y':1}, {'x':1, 'y':1}, {'x':2, 'y':1}, {'x':2, 'y':2}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':2, 'y':0}, {'x':3, 'y':0}, {'x':4, 'y':0}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':0, 'y':1}, {'x':1, 'y':1}, {'x':0, 'y':2}],
			[{'x':0, 'y':0}, {'x':0, 'y':1}, {'x':1, 'y':1}, {'x':1, 'y':2}, {'x':2, 'y':2}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':0, 'y':1}, {'x':0, 'y':2}, {'x':1, 'y':2}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':1, 'y':1}, {'x':1, 'y':2}, {'x':2, 'y':1}],
			[{'x':1, 'y':0}, {'x':0, 'y':1}, {'x':1, 'y':1}, {'x':2, 'y':1}, {'x':1, 'y':2}],
			[{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':1, 'y':1}, {'x':2, 'y':0}, {'x':3, 'y':0}]
		];

	    // where each piece appers on the 'choose piece' canvas
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
	    {'x':490, 'y':210, 'size':5}
	    ];

function getMaxDimension(piece){
	var maxSize = 0;

	for ( var i = 0; i < piece.length; i++ ) {
		var point = piece[i];
		if ( point.x > maxSize ) {
			maxSize = point.x;
		}
		if ( point.y > maxSize ) {
			maxSize = point.y;
		}
	}
	
	return maxSize + 1;
}

function choosePiece(event) {
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	
	event = event || window.event;

	var x = Math.floor( event.pageX - pieceChoices.offsetLeft );
	var y = Math.floor( event.pageY - pieceChoices.offsetTop );

	for ( var i = 0; i < pieceCanvasLocation.length; i++ ) {
		var canvasLocation = pieceCanvasLocation[i];
		if ( x >= canvasLocation.x
			&& y >= canvasLocation.y 
			&& x <= canvasLocation.x + canvasLocation.size * 20
			&& y <= canvasLocation.y + canvasLocation.size * 20 ) {
				if(player.pieces.indexOf(i) != -1)
					chosenPieceId = i;
				console.log("chosenPieceId", chosenPieceId);
				drawPieceList();
				break;
			}
	}

}
				
function drawGrid() {
	var boardElem = document.getElementById('boardCanvas');
	var boardContext = boardElem.getContext('2d');
	boardContext.clearRect(0, 0, boardElem.width, boardElem.height);

	boardContext.fillStyle = colors[0];
	boardContext.fillRect(-5, -5, 10, 10);
	boardContext.fillStyle = colors[1];
	boardContext.fillRect(395, -5, 10, 10);
	boardContext.fillStyle = colors[2];
	boardContext.fillRect(395, 395, 10, 10);
	boardContext.fillStyle = colors[3];
	boardContext.fillRect(-5,395, 10, 10);
	
	for ( var i = 0; i < 20; i++ ) {
		for ( var j = 0; j < 20; j++ ) {
			boardContext.strokeRect(i*20, j*20, 20, 20);
			if ( completeBoard && completeBoard[i][j] != null ) {
				boardContext.fillStyle = colors[completeBoard[i][j]];
				boardContext.fillRect(i*20, j*20, 20, 20);

			/* not sure why this drawImage isn't working - looks like it should */
				var img = new Image();
				img.src = "/img/" + colors[completeBoard[i][j]] +".png";
				boardContext.drawImage(img, i*20, j*20);
			}
		}
	}	

}

var outlineX = -1;
var outlineY = -1;

function drawOutline(event) {
	var boardElem = document.getElementById('boardCanvas');
	var boardContext = boardElem.getContext('2d');

	if ( chosenPieceId != -1 ) {
		var x = Math.floor( ( event.pageX - boardElem.offsetLeft ) / 20 );
		var y = Math.floor( ( event.pageY - boardElem.offsetTop ) / 20 );
		if ( x != outlineX || y != outlineY ) {
			// draw the overlay back to original
			for ( var i = 0; i < available[chosenPieceId].length; i++ ) {
				var pieceX = available[chosenPieceId][i].x + outlineX;
				var pieceY = outlineY + available[chosenPieceId][i].y;

				if ( pieceX >= 0 && pieceY >= 0 && pieceX < 20 && pieceY < 20 ) {
					if ( completeBoard && completeBoard[pieceX][pieceY] != null ) {
						boardContext.fillStyle = colors[completeBoard[pieceX][pieceY]];
						boardContext.fillRect(pieceX*20, pieceY*20, 20, 20);
					} else {
						boardContext.fillStyle = 'white';
						boardContext.fillRect(pieceX*20, pieceY*20, 20, 20);
					}
					boardContext.strokeRect(pieceX*20, pieceY*20, 20, 20);
				}
			}

			// draw an outline of the new version
			for ( var i = 0; i < available[chosenPieceId].length; i++ ) {
				var pieceX = available[chosenPieceId][i].x + x;
				var pieceY = y + available[chosenPieceId][i].y;

				boardContext.fillStyle = 'orange';
				boardContext.fillRect(pieceX*20, pieceY*20, 20, 20);
			}
			// draw the old location with correct items
			// draw the new outline
			outlineX = x;
			outlineY = y;
		}
	}
}

function getLocation(event) {
	if( typeof chosenPieceId == "undefined" || chosenPieceId == null ) return;
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	
	event = event || window.event;

	var x = Math.floor( ( event.pageX - boardElem.offsetLeft ) / 20 );
	var y = Math.floor( ( event.pageY - boardElem.offsetTop ) / 20 );


	var thisPiece = [];
	
	if( chosenPieceId != -1 ) {
		for ( var i = 0; i < available[chosenPieceId].length; i++ ) {
			thisPiece.push({'x': available[chosenPieceId][i].x + x , 'y': y + available[chosenPieceId][i].y })
		}
		

		// check if move is legal
		socket.emit('addPiece', { piece: chosenPieceId, placement: thisPiece }, 
			function(error) {
				if (error) {
					console.log(error);
				}
				else {
					// Remove the selection box
					chosenPieceId = -1;
					drawPieceList();
					
					// let the server tell me what board to draw
				}
			}
		);
	}
}



//Draw Piece List Function
function drawPieceList(){
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	pieceContext.clearRect(0, 0, pieceChoices.width, pieceChoices.height);

	if ( chosenPieceId != -1 ) {
		var canvasLocation = pieceCanvasLocation[chosenPieceId];
			
		var thisPiece = available[chosenPieceId];
		pieceContext.strokeRect(canvasLocation.x - 5, canvasLocation.y - 5, getMaxDimension(thisPiece) * 20 + 10, getMaxDimension(thisPiece) * 20 + 10);
	}
	
	var img = new Image();
	var positionColor = (player.position>=0) ? player.position : 0;
	img.src = "img/" + colors[positionColor] +".png";
	img.onload = function(){
		for ( var i = 0; i < available.length; i++ ) {
			// var pieceIndex = player.pieces[i];
			var piece = available[i];

			for ( var j = 0; j < piece.length; j++ ) {
				var point = piece[j];
				var canvasLocation = pieceCanvasLocation[i];
				var x = canvasLocation.x;
				var y = canvasLocation.y;
				
				var xLoc = x + ( point.x * 20 );
				var yLoc = y + ( point.y * 20 );	
				if(player.pieces.indexOf(i) != -1)
					pieceContext.drawImage(img, xLoc, yLoc);
			}
		}
	}
}


function drawPiece(index) {
	var maxSize = available[index].length;

	for ( var i = 0; i < maxSize; i++ ) {
		for ( var j = 0; j < maxSize; j++ ) {
			$( "#link-" + index ).append( "<div id='piece-" + index + "-" + j + "-" + i + "' style='display: inline-block;width:20px;height:20px;' />" );
		}

			$( "#link-" + index ).append( "<br/>");
	}
			$( "#link-" + index ).append( '<a href="#" onclick="javascript:flip(' + index + ');">Flip</a><a href="#" onclick="javascript:rotate(' + index + ');">Rotate</a>');
			$( "#link-" + index ).append( "<br/>");
	
	for( var i = 0; i < available[index].length; i++ ) {
		var thisBlock = available[index][i];
		var element = document.getElementById('piece-' + index + '-' + thisBlock.x + '-' + thisBlock.y);
		element.style.backgroundColor = colors[1];
	}
    
};


	    function rotate() {
		    if ( chosenPieceId != -1 ) {
		    	var pieceToChange = available[chosenPieceId];
		    	var replacementPiece = [];
		    	var minX = pieceToChange.length;
		    	var minY = pieceToChange.length;

		    	for ( var i = 0; i < pieceToChange.length; i++ ) {
			    	var point = pieceToChange[i];
			    	replacementPiece.push( {'x':pieceToChange.length - point.y, 'y':point.x } );
			    	minX = Math.min( minX, pieceToChange.length - point.y );
		    	}
		    	if ( minX > 0 ) {
			    	for ( var i = 0; i < pieceToChange.length; i++ ) {
				    	var point = pieceToChange[i];
				    	replacementPiece.push( {'x':pieceToChange.length - point.y, 'y':point.x } );
				    	minX = Math.min( minX, pieceToChange.length - point.y );
			    	}
			    	if ( minX > 0 ) {
				    	for ( var i = 0; i < pieceToChange.length; i++ ) {
				    		replacementPiece[i].x = replacementPiece[i].x - minX;
				    	}
			    	}
			    	available[chosenPieceId] = replacementPiece;
			    	drawPieceList();
			    }
		    }
	    };

	    function flip() {
		    if ( chosenPieceId != -1 ) {
		    	var pieceToChange = available[chosenPieceId];
		    	var replacementPiece = [];
		    	for ( var i = 0; i < pieceToChange.length; i++ ) {
			    	var point = pieceToChange[i];
			    	replacementPiece.push( {'x':point.y, 'y':point.x } );
		    	}
		    	available[chosenPieceId] = replacementPiece;
		    	drawPieceList();
	    	}
	    };
