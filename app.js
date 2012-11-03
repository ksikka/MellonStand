
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


// XXX Makeshift DB
// seed data...
var meals = [
          {name:"Karan",food:"Pasta",price:3.0}
        , {name:"Ilter",food:"Kebob",price:6.5}
        , {name:"Tommy",food:"Cupcake",price:1.99}
         ];

//input: void
//output: array of "meals"
function getInitialData(){
  return meals;
}

var io = require('socket.io').listen(8080);
io.sockets.on('connection',function (socket) {
  console.log('A socket connected!');
  socket.emit('initData', getInitialData());

  socket.on('sellMeal',function(data){
    // validate maybe?
    meals.push(data);
    socket.broadcast.emit('newMeal',data);
  });
});
