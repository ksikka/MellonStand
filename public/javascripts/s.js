var socket = io.connect('http://192.168.1.129:8080');

/* FUNCTIONS */
function mealToString(m){
  return _.reduce(["Name: ", m.name
                      , "\nFood: ", m.food
                      , "\nPrice:", m.price]
                    ,function(a,b) {return a.concat(b)})
}

function populate(meals) {
  var e = document.getElementById("meals");
  if (!e) {
    alert ('no such element');
    return;
  }
  else {
    _.each(meals, function(m){
      var p = document.createElement('p');
      var str = mealToString(m);
      p.appendChild(document.createTextNode(str));
      e.appendChild(p);

    });
  }
}

function addMeal(m) {
  var e = document.getElementById("meals");
  if (!e) {
    alert ('no such element');
    return;
  }
  else {
    var p = document.createElement('p');
    var str = mealToString(m);
    p.appendChild(document.createTextNode(str));
    e.insertBefore(p,e.firstChild);
  }
}

function makeNewMeal() {
  var names = ["Harry","Julia","Thomas","George","Georgina",
               "Robert","H4x0r","Sandip","Anastasia","Bill",
               "Abraham","Sleator","Von Ahn"];
  var foods = ["Ramen Noodles","Lasagna","Spaghetti","Pasta",
               "Chicken and rice","Ice Cream","Cupcakes",
               "Sushi","Meatloaf Surprise","Indian cooking",
               "Jello shots"];
  var m = {name:names[_.random(names.length-1)]
        , food:foods[_.random(foods.length-1)]
       , price:_.random(200)/10.0 };

  socket.emit('sellMeal',m);
  return m;
}

/* SOCKET EVENT BINDINGS */
socket.on('initData', function (meals) {
  populate(meals);
});
socket.on('newMeal', function (m) {
  addMeal(m);
});
