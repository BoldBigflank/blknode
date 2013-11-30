var socketio = require('socket.io')
var game = require('./game.js')
var availableUUID = 1;
var events = require('events');

module.exports.listen = function(app){
    io = socketio.listen(app)

    io.configure(function () { 
      io.set("transports", ["websocket", "xhr-polling"]); 
      io.set("polling duration", 10); 
    });

    io.sockets.on('connection', function (socket) {
      socket.on('join', function(cb){

        //Turn off persistence
        uuid = availableUUID++;

        socket.set('uuid', uuid)
        game.join(uuid, function(err, res){
          if (err) { socket.emit("alert", err) }
          else{ 
              socket.set('gameId', res.id);
              // socket.emit('game', game.getGame() )
              socket.broadcast.emit(res.id, res )
          }
          cb({game: res, player: game.getPlayer(uuid) });

        })
      })

      // User leaves
      socket.on('disconnect', function(){
        console.log("Disconnect: ", socket.id)
        socket.get('uuid', function(err, uuid){
          socket.get('gameId', function(err, gameId){
            console.log("Disconnect: ", uuid, gameId)
            if(gameId === null) return;
            game.leave(gameId, uuid, function(err, res){
              if (err) { socket.emit("alert", err) }
              else{ 
                socket.broadcast.emit(gameId, res )
              }
            });
          })
        })
      })
      
      socket.on('name', function(data){
        socket.get('uuid', function(err, uuid){
          socket.get('gameId', function(err, gameId){
            game.setName(uuid, encodeURI(data), function(err, res){
              if (err) { socket.emit("alert", err) }
              else{ io.sockets.emit(gameId, res ) }
            })
          })
        })
      })


      // Playing a piece 
      socket.on('addPiece', function(data, cb){
        socket.get('uuid', function(err, uuid){
          socket.get('gameId', function(err, gameId){
            game.addPiece(gameId, uuid, data.placement, data.piece, function(err, res){
              if (err) { socket.emit("alert", err);
                cb(err);
              }
              if (res) { io.sockets.emit(gameId, res);
                cb(null);
              }
            })
          })
        })
      })

      // State
      socket.on('state', function(data){
          game.setState(data, function(err, res){
            if (err) { socket.emit("alert", err) }
            else{ 
                io.sockets.emit(res.id, res )
            }
          })  
      })

      socket.on('reset', function(data){
        game.reset(function(err, res){
          if (err) { socket.emit("alert", err) }
          else{ 
            io.sockets.emit(res.id, res ) 
          }
        })
      })

      socket.on('pass', function(data){
        socket.get('uuid', function(err, uuid){
          socket.get('gameId', function(err, gameId){
            if(gameId === null) return;
            game.leave(gameId, uuid, function(err, res){
              if (err) { socket.emit("alert", err) }
              else{ 
                io.sockets.emit(gameId, res);
              }
            });
          })
        })
      })
    });

    game.eventEmitter.on('state', function(res) {
      io.sockets.emit(res.id, res )
      if(res.state == 'ended') {
        console.log("sending answers", game.getAnswers())
        io.sockets.emit('answers', game.getAnswers())
    }
    });
    return io
}