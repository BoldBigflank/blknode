var piece1 = [{color: "Blue"}, {x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:1}];
var piece2 = [{color: "Red"}, {x:0,y:0},{x:0,y:1}];
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

function choosePiece(event) {
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	
	event = event || window.event;

	var x = Math.floor( ( event.pageX - pieceChoices.offsetLeft ) / 20 );
	var y = Math.floor( ( event.pageY - pieceChoices.offsetTop ) / 20 );

	if (x < 10) {
		chosenPiece = piece1;
	}else if ( x >= 10) {		
		chosenPiece = piece2;
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

	if ( chosenPiece ) {
		context.fillStyle = chosenPiece[0].color;
		for ( var i = 0; i < chosenPiece.length; i++ ) {
			var point = chosenPiece[i];
			var xLoc = x + point.x;
			var yLoc = y + point.y;
			context.fillRect(xLoc*20, yLoc*20, 20, 20);
			
		}
		
	}
}

//Draw Piece List Function
function drawPieceList(){
	var boardElem = document.getElementById('boardCanvas');
	var pieceChoices = document.getElementById('pieceChoices');
	var pieceContext = pieceChoices.getContext('2d');
	var context = boardElem.getContext('2d');
	
	//Draw separator line on piece list.
	pieceContext.moveTo(200, 0);
	pieceContext.lineTo(200, 100);
	pieceContext.stroke();

	//Draw first piece on piece list.
	pieceContext.fillStyle = piece1[0].color;
	for ( var i = 1; i < piece1.length; i++ ) {
		var point = piece1[i];
		var x = 5;
		var y = 1;
		
		var xLoc = x + point.x;
		var yLoc = y + point.y;
		pieceContext.fillRect(xLoc*20, yLoc*20, 20, 20);			
	}

	//Draw second piece on piece list.
	pieceContext.fillStyle = piece2[0].color;
	for ( var i = 1; i < piece2.length; i++ ) {
		var point = piece2[i];
		var x = 15;
		var y = 1;
		
		var xLoc = x + point.x;
		var yLoc = y + point.y;
		pieceContext.fillRect(xLoc*20, yLoc*20, 20, 20);
	}
}