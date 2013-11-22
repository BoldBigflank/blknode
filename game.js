var _ = require('underscore')
  , fs = require('fs')
var EventEmitter = require('events').EventEmitter;

exports.eventEmitter = new EventEmitter();

var newBoard = function(){
    var r = []; while(r.push(null) < 20); // Make a row of 20 0's
    var a = []; while(a.push(r.slice(0)) < 20); // Make 20 rows
    return a;
}

var game;
var boardWidth;
var boardHeight;

var maxPlayers = 4;
var answers = []
var names
var questions


var init = function(cb){
    game = {
        board:newBoard(),
        players:[],
        turn:null,
        state:"prep"
    }
    boardWidth = game.board.length;
    boardHeight = game.board[0].length;
    
    fs.readFile('names.txt', function(err, data) {
        if(err) throw err;
        names = data.toString().split("\n");
    });
}

newRound = function(cb){
    // Find the round's winner
    if(game.players.length > 0){
        var winningPlayer = _.max(game.players, function(player){
            return player.score
        })
        if(winningPlayer){
            var winner = {
                name: winningPlayer.name
                , title: game.title
                , score: winningPlayer.score
                , id: winningPlayer.id
            }
            game.winner = winner
        }
    }
    // Remove the current entries from the players
    for(var index in game.players){
        var player = game.players[index]
        player.answer = null;
        player.answerScore = 0;
        game.players[index] = player
    }

    // Refresh when out of questions
    if(questions.length<1){
        fs.readFile('questions.txt', function(err, data) {
            if(err) throw err;
            questions = _.shuffle(data.toString().split("\n"));
        });
    }
    
    var questionArray = questions.shift().split("|");
    game.title = questionArray.shift();
    game.round++ ;
    game.correctAnswer = questionArray[0];
    game.answers = _.shuffle(questionArray);


    // // Load a new file
    // var files = fs.readdirSync('categories')
    // files = _.difference(files, ['.', '..'])
    // var path = files[Math.floor(Math.random()*files.length)]
    // var data = fs.readFileSync('categories/' + path)
    // var dataArray = data.toString().split("\n");
    //     game.title = dataArray[0];
    //     answers = dataArray.splice(1);
    //     game.count = answers.length

    // // Pick the beginning time
    // var now = new Date().getTime(); // Milliseconds
    // var begin = now + prepTime;
    // game.begin = begin;

    // var end = begin + roundTime;
    // game.end = end;

    // game.title = ""

    game.state = "prep"; // DEBUG: Make prep first in prod
    setTimeout(function(){
        console.log("timer 1 ended")
        exports.setState('active', function(err, res){
            if(!err)
                exports.eventEmitter.emit('state', res)
        })
    }, prepTime);
    setTimeout(function(){
        console.log("timer 2 ended")
        exports.setState('ended', function(err, res){
            if(!err)
                exports.eventEmitter.emit('state', res)
        })
    }, prepTime + roundTime);
    cb()
}

exports.join = function(uuid, cb){
    if(uuid === undefined) {
        cb("UUID not found")
        return
    }
    // game.now = new Date().getTime()
    var player = _.find(game.players, function(player){ return player.id == uuid })
    if( typeof player === 'undefined'){
        var player = {
            id: uuid
            , name: names.shift() || uuid
            , pieces: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] 
            , state: 'active'
            , position:-1
        }
        if(_.where(game.players, {state:'active'}).length >= maxPlayers) player.state = 'spectating';

        game.players.push(player)
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
    }
    cb(null, {players: game.players, turn: game.turn, state:game.state})
}

exports.leave = function(uuid, cb){
    // Remove their player
    var player = _.find(game.players, function(player){ return player.id == uuid })
    if(player){
        player.state = "disconnect";
        // If only one active player left, end the game
        if(_.where(game.players, {state:'active'}).length <= 1){
            game.state = "ended";
        }
        else { // Make sure it is an active person's turn
            if(game.state == 'active'){
                while(_.findWhere(game.players, {position:game.turn}).state != 'active'){
                    game.turn = (game.turn+1) % game.players.length;
                }
            }
        }
        cb(null, {players: game.players, state: game.state})
    }
    // game.players = _.without(game.players, player)
}

exports.getAnswers = function(){ return answers }

exports.getGame = function(){ return game }

exports.getScores = function(){
    return _.map(game.players, function(val, key){ return { id:val.id, name:val.name, score:val.score }; })
}

exports.getPlayers = function(){ return game.players }

exports.getPlayer = function(uuid){ return _.find(game.players, function(player){ return player.id == uuid })}

exports.getState = function(){ return game.state }

exports.getTitle = function(){ return game.title }

exports.getRound = function(){ return game.round }


exports.getWinner = function(){ return game.winner }

exports.getScoreboard = function(){
    return {
        title: game.title
        , scores: _.map(game.players, function(val, key){ return { id:val.id, name:val.name, score:val.score }; })
        , players: game.players.length
        , answers: answers.length
    }

}

exports.setName = function(id, name, cb){
    var p = _.find(game.players, function(player){ return player.id == id })
    if(p) p.name = name
    cb(null, { players: game.players })
}

exports.setState = function(state, cb){
    if(state==game.state) return cb("Already on this state")
    // Only start new rounds when the last is done
    if(game.state != "ended" && state == "prep") return cb("Only start new rounds when the last is done")

    // entry, vote, result
    game.state = state
    // game.now = new Date().getTime()
    if(state=="prep"){ // New round
        // game.help = "Be prepared to list answers that fit the following category."
        newRound(function(){
            cb(null, game)
        });
    }
    else if (state == "active"){
        // game.help = "List items that fit the category."
        cb(null, game)
    }
    else if (state == "ended"){
        
        // Apply the scores to the winners
        _.each(game.players, function(player){
            if(player.answer == game.correctAnswer) player.score += player.answerScore;
        })

        game.players = _.sortBy(game.players, function(player){return -1 *  player.score;});
        // game.help = "The round has ended.  Click 'New Round' to begin."
        cb(null, game)
    }
    else{
        // game.help = "";
        cb(null, game)
    }
}

function findFacingTile(tile){
    var x = tile.x;
    var y = tile.y;
    console.log("(" + x + "," + y + ")" + (x+y) );

    // Above
    console.log("above")
    if(y < boardHeight-1 && game.board[x][y+1] === game.turn ) return true;
    // Below
    console.log("below")
    if(y > 0 && game.board[x][y-1] === game.turn ) return true;
    // Right
    console.log("left")
    if(x < boardWidth-1 && game.board[x+1][y] === game.turn ) return true;
    // Right
    console.log("right")
    if(x > 0 && game.board[x-1][y] === game.turn ) return true;
    console.log("done")
    return false;
}

function findDiagonalConnector(tile){
    var x = tile.x;
    var y = tile.y;

    // Starting positions
    if( game.turn == 0 && x == 0             && y == boardHeight-1 )  return true;
    if( game.turn == 1 && x == boardWidth-1  && y == boardHeight-1 )  return true;
    if( game.turn == 2 && x == boardWidth-1  && y == 0 )              return true;
    if( game.turn == 3 && x == 0             && y == 0 )              return true;

    // Above left
    if( x > 0 && y < boardHeight-1 && game.board[x+1][y-1] === game.turn ) return true;
    // Above right
    if( x < boardWidth-1 && y < boardHeight-1 && game.board[x+1][y+1] === game.turn ) return true;
    // Below left
    if( x > 0  && y > 0 && game.board[x-1][y-1] === game.turn ) return true;
    // Below right
    if( x < boardWidth-1 && y > 0 && game.board[x+1][y-1] === game.turn ) return true;
    return false;
}

exports.addPiece = function(id, placement, piece, cb){
    // cb(err, res)
    var player = _.findWhere(game.players, {position:game.turn})

    if(game.state != "active"){
        cb ("The game has not yet started. Get more friends.", null)
        return;
    } 
    else if( player.id !== id ){
        cb ("It is not your turn", null)
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
        if( x<0 || y < 0 || x >= boardWidth || y >= boardHeight  ){
            cb("Tile is not on the game board", null)
            return;
        }


        if ( findFacingTile( tile ) == true) {
            cb("This placement has a facing tile at " + tile.x + tile.y, null)
            return;
        };
        hasDiagonalConnector = hasDiagonalConnector || findDiagonalConnector(tile);

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
        var piece = placement[i];
        var column = game.board[piece.x]
        column[piece.y] = game.turn;
        // game.board[piece.x][piece.y] = game.turn;

    }

    // Remove the piece from the user's bag
    player.pieces = _.without(player.pieces, piece)
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