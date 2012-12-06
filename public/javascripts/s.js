var socket = io.connect('http://ksikka.mellonstand.jit.su/');
//var socket = io.connect('http://localhost:8080/');

/* FUNCTIONS */
function mealToString(m){
  return _.reduce(["Name: ", m.name
                      , "\nFood: ", m.food
                      , "\nPrice:", m.price]
                    ,function(a,b) {return a.concat(b)})
}

function addMeal(m) {
  var e = document.getElementById("meals");
  if (!e) {
    alert ('no such element');
    return;
  }
  else {
    var p = document.createElement('p');
    p.setAttribute('data_id',m.id);
    var str = mealToString(m);
    p.appendChild(document.createTextNode(str));

    e.insertBefore(p,e.firstChild);
  }
}

function populate(meals) {
  var e = document.getElementById("meals");
  if (!e) {
    alert ('no such element');
    return;
  }
  else {
    _.each(meals,addMeal);
  }
}

function delMeal(id) {
  var mealsdiv = document.getElementById("meals");
  var ps = mealsdiv.childNodes;
  for (var i = 0; i < ps.length; i++)
  {
    if(ps.item(i).getAttribute('data_id') === id.toString())
    {
      mealsdiv.removeChild(ps.item(i));
      break;
    }
  }
}

function testDelMeal(id) {
  delMeal(id);
  socket.emit('delMeal',id);
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

  m.password="techcomiscool";
  //addMeal(m);
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
socket.on('delMeal', function (id) {
  delMeal(id);
});
