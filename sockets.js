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
              socket.emit('game', game.getGame() )
              socket.broadcast.emit("game", res )
          }
        })
        cb(game.getPlayer(uuid));
      })

      // User leaves
      socket.on('disconnect', function(){
        console.log("Disconnect: ", socket.id)
        socket.get('uuid', function(err, uuid){
          game.leave(uuid, function(err, res){
            if (err) { socket.emit("alert", err) }
            else{ 
              socket.broadcast.emit("game", res )
            }
          });
        })
      })
      
      socket.on('name', function(data){
        socket.get('uuid', function(err, uuid){
          game.setName(uuid, encodeURI(data), function(err, res){
            if (err) { socket.emit("alert", err) }
            else{ io.sockets.emit("game", res ) }
          })
          
        })
      })


      // Playing a piece 
      socket.on('addPiece', function(data, cb){
        socket.get('uuid', function(err, uuid){
          game.addPiece(uuid, data.placement, data.piece, function(err, res){
            if (err) { socket.emit("alert", err);
              cb(err);
            }
            if (res) { io.sockets.emit("game", res);
              cb(null);
            }
          })
        })
      })

      // State
      socket.on('state', function(data){
          game.setState(data, function(err, res){
            if (err) { socket.emit("alert", err) }
            else{ 
                io.sockets.emit("game", res )
            }
          })  
      })

      socket.on('reset', function(data){
        game.reset(function(err, res){
          if (err) { socket.emit("alert", err) }
          else{ 
            io.sockets.emit("game", res ) 
          }
        })
      })
    });

    game.eventEmitter.on('state', function(res) {
      io.sockets.emit("game", res )
      if(res.state == 'ended') {
        console.log("sending answers", game.getAnswers())
        io.sockets.emit('answers', game.getAnswers())
    }
    });
    return io
}