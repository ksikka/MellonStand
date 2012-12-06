
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io');

var app = module.exports = express.createServer()
   , io = io.listen(app);

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

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// id is incremented
var curr_id = 0;

var meals = [];

function createMeal (data) {
  data.id = curr_id; curr_id += 1;
  if (data.name == "tommy" || data.name == "david" || data.name == "karan")
    data.prof_pic_url = "/images/prof/" + data.name + ".jpg";
  else
    data.prof_pic_url = "/images/blank.jpeg";
  var lcfood = data.title.toLowerCase();
  if (lcfood.indexOf("pizza") != -1) {
    data.food_pic_url = "/images/food/pizza.png";
  } else if (lcfood.indexOf("pasta") != -1) {
    data.food_pic_url = "/images/food/pasta.jpeg";
  } else if (lcfood.indexOf("dinex") != -1) {
    data.food_pic_url = "/images/food/culinart.jpeg";
  } else if (lcfood.indexOf("block") != -1) {
    data.food_pic_url = "/images/food/culinart.jpeg";
  } else {
    data.food_pic_url = "/images/food/blank.gif";
  }
  data.price = parseFloat(data.price);
  meals.push(data);
  return data;
}

function deleteMeal (id) {
  for(var i = 0; i < meals.length; i++) {
    if (meals[i].id == parseInt(id)) {
      meals.splice(i,1);
      return;
    }
  }
}

function getInitialData(){
  return meals;
}

io.sockets.on('connection',function (socket) {
  console.log('A user connected!');
  socket.emit('initData', getInitialData());

  socket.on('sellMeal',function(data){
    var new_food_item = createMeal(data);
    io.sockets.emit('newMeal',new_food_item);
  });

  socket.on('delMeal',function(id){
    // note, this is not authenticated
    deleteMeal(id);
    socket.broadcast.emit('delMeal',id);
  });
});
