var chosenPieceId = -1;
var chosenPiece;
var completeBoard;
var images = [];
var boardWidth = 20;
var boardHeight = 20;

window.onload = function () {
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	
	preLoad();
	drawGrid();
	
   boardElem.onclick = getLocation;
   pieceChoices.onclick = choosePiece;
   boardElem.onmousemove = drawOutline;
   boardElem.onmouseout = removeOutline;
   window.onkeypress = handleKeyPress;
}

function handleKeyPress(e){
	if(e.keyCode == 114 || e.keyCode == 82){
		// Rotate
		removeOutline(e);
		rotate();
		drawOutline(e);
	}
	if(e.keyCode == 102 || e.keyCode == 70){
		removeOutline(e);
		flip();
		drawOutline(e);
	}
	return null;
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

		
function preLoad() {
	for (var i = 0; i < colors.length; ++i) {
		images[i] = new Image();
		images[i].src = "img/" + colors[i] + ".png";
	}
}

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
				boardContext.drawImage(images[completeBoard[i][j]], i*20, j*20);
			}
		}
	}	

}

var outlineX = -1;
var outlineY = -1;

function removeOutline(event){
	if(typeof chosenPieceId == "undefined" || chosenPieceId == -1) return;
	var boardElem = document.getElementById('boardCanvas');
	var boardContext = boardElem.getContext('2d');
	// draw the overlay back to original
	for ( var i = 0; i < available[chosenPieceId].length; i++ ) {
		var pieceX = available[chosenPieceId][i].x + outlineX;
		var pieceY = outlineY + available[chosenPieceId][i].y;

		if ( pieceX >= 0 && pieceY >= 0 && pieceX < 20 && pieceY < 20 ) {
			if ( completeBoard && completeBoard[pieceX][pieceY] != null ) {
				boardContext.drawImage(images[completeBoard[pieceX][pieceY]], pieceX*20, pieceY*20);
			} else {
				boardContext.fillStyle = 'white';
				boardContext.fillRect(pieceX*20, pieceY*20, 20, 20);
			}
			boardContext.strokeRect(pieceX*20, pieceY*20, 20, 20);
		}
	}
}

function drawOutline(event) {
	var boardElem = document.getElementById('boardCanvas');
	var boardContext = boardElem.getContext('2d');

	if ( chosenPieceId != -1 ) {
		var x = Math.floor( ( event.pageX - boardElem.offsetLeft ) / 20 );
		var y = Math.floor( ( event.pageY - boardElem.offsetTop ) / 20 );
		if ( x != outlineX || y != outlineY ) {
			// draw the overlay back to original
			removeOutline(event);

			// draw an outline of the new version
			var validPlacement = isValidPlacement(x,y,available[chosenPieceId]);

			for ( var i = 0; i < available[chosenPieceId].length; i++ ) {
				var pieceX = available[chosenPieceId][i].x + x;
				var pieceY = y + available[chosenPieceId][i].y;
				var fillColor = 'orange'
				if(validPlacement) fillColor = 'green'
				else if ( !isValidPosition({'x':pieceX, 'y':pieceY}) ) fillColor = 'red';
				boardContext.fillStyle = fillColor;
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
	if( typeof chosenPieceId == "undefined" || chosenPieceId == -1 ) return;
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	
	event = event || window.event;

	var x = Math.floor( ( event.pageX - boardElem.offsetLeft ) / 20 );
	var y = Math.floor( ( event.pageY - boardElem.offsetTop ) / 20 );


	var thisPiece = [];
	
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
	
	var positionColor = (player.position>=0) ? player.position : 0;
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
				pieceContext.drawImage( images[positionColor], xLoc, yLoc);
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
	//if ( chosenPieceId != -1 ) {
    for (var x in available){
    	var pieceToChange = available[x];
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
	    		replacementPiece[i].x = replacementPiece[i].x - minX;
	    	}
	    }
    	available[x] = replacementPiece;
    	drawPieceList();
    }
};

function flip() {
    //if ( chosenPieceId != -1 ) {
    for( var x in available){
    	var pieceToChange = available[x];
    	var replacementPiece = [];
    	for ( var i = 0; i < pieceToChange.length; i++ ) {
	    	var point = pieceToChange[i];
	    	replacementPiece.push( {'x':point.y, 'y':point.x } );
    	}
    	available[x] = replacementPiece;
    	drawPieceList();
	}
};

function isValidPlacement(x,y,placement){
	var hasDiagonalConnector = false;
	for(var i in placement){
		var tile = { 'x':x+placement[i].x, 'y':y+placement[i].y }
		
		if( tile.x<0 || tile.y < 0 || tile.x >= boardWidth || tile.y >= boardHeight  ){
            return false;
        }

		hasDiagonalConnector = hasDiagonalConnector || findDiagonalConnector(tile);

		if(!isValidPosition(tile)){
			console.log("isValidPlacement: No", tile.x, tile.y)
			return false;
		} 
	}
	return hasDiagonalConnector;
}

function findDiagonalConnector(tile){
    var x = tile.x;
    var y = tile.y;

    // Starting positions
    if( player.position == 0 && x == 0             && y == 0 )  return true;
    if( player.position == 1 && x == boardWidth-1  && y == 0)  return true;
    if( player.position == 2 && x == boardWidth-1  && y == boardHeight-1  )              return true;
    if( player.position == 3 && x == 0             && y == boardHeight-1  )              return true;

    // Above right
    if( x < boardWidth-1 && y < boardHeight-1 && game.board[x+1][y+1] === player.position ) return true;
    // Above left
    if( x > 0 && y < boardHeight-1 && game.board[x-1][y+1] === player.position ) return true;
    // Below left
    if( x > 0  && y > 0 && game.board[x-1][y-1] === player.position ) return true;
    // Below right
    if( x < boardWidth-1 && y > 0 && game.board[x+1][y-1] === player.position ) return true;
    return false;
}

function isValidPosition(tile){
	// On the board
	if(tile.x < 0 || tile.x >= boardWidth || tile.y < 0 || tile.y >= boardHeight){ 
		console.log("On the board")
		return false;
	}
	// Position is not open
	if (game.board[tile.x][tile.y] !== null){ 
		console.log("position not open", tile.x, tile.y, game.board[tile.x][tile.y])
		return false;
	}
	if (hasFacingTile(tile)){
		console.log("has facing tile") ;
		return false;
	}
	return true;
}



function hasFacingTile(tile){
	var x = tile.x;
    var y = tile.y;
    
    // Above
    if(y < boardHeight-1 && game.board[x][y+1] === player.position ) return true;
    // Below
    if(y > 0 && game.board[x][y-1] === player.position ) return true;
    // Right
    if(x < boardWidth-1 && game.board[x+1][y] === player.position ) return true;
    // Right
    if(x > 0 && game.board[x-1][y] === player.position ) return true;
    return false;
}
