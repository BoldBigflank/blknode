var _ = require('underscore')
  , fs = require('fs')
var EventEmitter = require('events').EventEmitter;

exports.eventEmitter = new EventEmitter();


var games=[];
var players = [];

var maxPlayers = 4;
var boardWidth = 20;
var boardHeight = 20;
var names;
var questions;

var newBoard = function(){
    var r = []; while(r.push(null) < boardWidth); // Make a row of 20 0's
    var a = []; while(a.push(r.slice(0)) < boardHeight); // Make 20 rows
    return a;
}

var init = function(cb){
    fs.readFile('names.txt', function(err, data) {
        if(err) throw err;
        names = data.toString().split("\n");
    });
}

var newGame = function(cb){
    var game = {
        id:games.length,
        board:newBoard(),
        players:[],
        turn:null,
        state:"prep"
    }
    games.push(game);
    return game;
}

exports.join = function(uuid, cb){
    if(uuid === undefined) {
        cb("UUID not found")
        return
    }
    var game = _.find(games, function(game){ return game.state == "prep" });
    if(typeof game == "undefined") {
        game = newGame();
        games.push(game);
    }
    // game.now = new Date().getTime()
    var player = _.findWhere( game.players, {id: uuid} )
    if( typeof player === 'undefined'){
        var player = {
            id: uuid
            , name: names.shift() || uuid
            , pieces: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] 
            , state: 'active'
            , position:-1
            , score: 0
        }
    }
    var gameId = _.find()
    if(_.where(game.players, {state:'active'}).length >= maxPlayers) player.state = 'spectating';

    players.push(player); // All players
    game.players.push(player); // Players for the game
    if(_.where(game.players, {state:'active'}).length == maxPlayers){
        game.state = 'active'
        // Add the players to playerOrder
        var playerNumber = 0;
        for( var i in game.players){
            var player = game.players[i]
            if(player.state == 'active'){
                player.position = playerNumber++;
                player.name = "Player " + (player.position+1);
            } 
        }
        game.turn = 0
    }
    cb(null, game)
}

exports.leave = function(gameId, uuid, cb){
    var game = games[gameId];
    // Remove their player
    var player = _.find(game.players, function(player){ return player.id == uuid })
    if(player){
        if(player.state != "spectating") player.state = "disconnect";
        // If only one active player left, end the game
        if(game.state == "active"){
            if(_.where(game.players, {state:'active'}).length <= 1)
                game.state = "ended";
            else {
                while(_.findWhere(game.players, {position:game.turn}).state != 'active'){
                    game.turn = (game.turn+1) % game.players.length;
                }
            }
        } else if(game.state == "prep") {
            // Remove players from games that haven't started
            game.players = _.without(game.players, player);
        }
        cb(null, {players: game.players, state: game.state, turn: game.turn})
    }
    // game.players = _.without(game.players, player)
}

exports.getGame = function(){ return game }

exports.getScores = function(){
    return _.map(game.players, function(val, key){ return { id:val.id, name:val.name, score:val.score }; })
}

exports.getPlayers = function(){ return players }

exports.getPlayer = function(uuid){ return _.find(players, function(player){ return player.id == uuid })}

exports.getState = function(){ return game.state }

exports.getTitle = function(){ return game.title }

exports.getRound = function(){ return game.round }


exports.getWinner = function(){ return game.winner }

exports.getScoreboard = function(){
    return {
        title: game.title
        , scores: _.map(game.players, function(val, key){ return { id:val.id, name:val.name, score:val.score }; })
        , players: game.players.length
    }

}

exports.setName = function(id, name, cb){
    var p = _.find(game.players, function(player){ return player.id == id })
    if(p) p.name = name
    cb(null, { players: game.players })
}

function hasFacingTile(game, tile){
    var x = tile.x;
    var y = tile.y;
    console.log("(" + x + "," + y + ")" + (x+y) );

    // Above
    if(y < boardHeight-1 && game.board[x][y+1] === game.turn ) return true;
    // Below
    if(y > 0 && game.board[x][y-1] === game.turn ) return true;
    // Right
    if(x < boardWidth-1 && game.board[x+1][y] === game.turn ) return true;
    // Right
    if(x > 0 && game.board[x-1][y] === game.turn ) return true;
    return false;
}

function findDiagonalConnector(game, tile){
    var x = tile.x;
    var y = tile.y;

    // Starting positions
    if( game.turn == 0 && x == 0             && y == 0 )  return true;
    if( game.turn == 1 && x == boardWidth-1  && y == 0)  return true;
    if( game.turn == 2 && x == boardWidth-1  && y == boardHeight-1  )              return true;
    if( game.turn == 3 && x == 0             && y == boardHeight-1  )              return true;

    // Above right
    if( x < boardWidth-1 && y < boardHeight-1 && game.board[x+1][y+1] === game.turn ) return true;
    // Above left
    if( x > 0 && y < boardHeight-1 && game.board[x-1][y+1] === game.turn ) return true;
    // Below left
    if( x > 0  && y > 0 && game.board[x-1][y-1] === game.turn ) return true;
    // Below right
    if( x < boardWidth-1 && y > 0 && game.board[x+1][y-1] === game.turn ) return true;
    return false;
}

exports.addPiece = function(gameId, id, placement, piece, cb){
    // cb(err, res)
    var game = games[gameId];
    var player = _.findWhere(game.players, {position:game.turn})

    if(game.state != "active"){
        cb ("The game has not yet started. Get more friends.", null)
        return;
    } 
    else if( player.id !== id ){
        cb ("It is not your turn", null)
        return;
    }

    // Make sure the player owns that piece
    if(player.pieces.indexOf(piece) == -1){
        cb("Player has already used that piece", null)
        return;
    }
    
    // Verify the suggested tile on the board
    var hasDiagonalConnector = false;
    for( var i in placement){
        var tile = placement[i]
        if(typeof tile.x == "undefined" || typeof tile.y== "undefined"){
            cb("Tile does not have a valid x and y coordinate", null)
            return;
        }
        // Check for impossible values
        if( tile.x<0 || tile.y < 0 || tile.x >= boardWidth || tile.y >= boardHeight  ){
            cb("Tile is not on the game board", null)
            return;
        }


        if ( hasFacingTile(game, tile ) == true) {
            cb("This placement has a facing tile at " + tile.x + tile.y, null)
            return;
        };
        hasDiagonalConnector = hasDiagonalConnector || findDiagonalConnector(game, tile);

        // Make sure each position is open
        if(game.board[tile.x][tile.y] !== null){
            cb("This piece is overlapping at " + tile.x + tile.y, null)
            return;
        }

    }
    if ( !hasDiagonalConnector ){
        cb("This placement has no connecting tile diagonal from it", null);
        return;
    }

    // Add the piece to the board
    
    for(var i in placement){
        var position = placement[i];
        var column = game.board[position.x]
        column[position.y] = game.turn;
        // game.board[piece.x][piece.y] = game.turn;
        player.score++;
    }

    // Remove the piece from the user's bag
    player.pieces = _.without(player.pieces, piece)
    if(player.pieces.length == 0){ // Used all pieces
        player.score += 15; // Score bonus
        if(placement.length == 1) player.score += 5; // If the last piece was a monomino
    }
    // player.pieces = _.reject(player.pieces, function(testPiece){
    //     return (_.difference(piece, testPiece).length == 0)
    // }) 

    do{
        game.turn = (game.turn+1) % maxPlayers;
    } while( _.findWhere(game.players, {position:game.turn}).state != "active" )

    cb(null, {board: game.board, players: game.players, turn: game.turn});
}

exports.reset = function(cb){
    init()
    cb(null, game)
}

init()