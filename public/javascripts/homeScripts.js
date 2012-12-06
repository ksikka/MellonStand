var socket = io.connect('http://ksikka.mellonstand.jit.su/');
var username = "tommy";
var psswd = "techcomiscool";
var allMeals = [];

function submitAuth() {
	console.log("submitAuth");

	$("#authPanel").animate({
		opacity : 0
	},600,function() {
		$("#authPanel").hide();
		$("#items").show();
		$("#items").css("opacity",0);
		$("#mainBar").css("opacity",0);
		$("#items").animate({
			opacity : 1
		},600,function() {});
		$("#mainBar").animate({
			opacity : 1
		},600,function() {});
		$("#mainBar").show();
	});

}

function openItem(id) {
	$("#items").animate({
		margin:"0px 0px 0px 15%",
	},600,function(){})
	showInfoPane(id)
}

function showInfoPane(id) {
	$("#infoPane").css("top","100px")
	$("#infoPane").css("left",$(window).width()/2-$("#items").width()/2)
	$("#itemInfoTitle").text(allMeals[id].title + " - $"+ allMeals[id].price)
	$("#itemInfoSeller").text(allMeals[id].name)
	$("#itemInfoLocation").text(allMeals[id].location)
	$("#itemInfoContact").text(allMeals[id].contact)
	$("#itemInfoDesc").text(allMeals[id].description)

	$("#infoPane").show();

	if(allMeals[id].name != username) {
		$("#deletebtn").hide();
	}
	else {
		$("#deletebtn").show();
		$("#deletebtn").attr("onclick",
										"deletePressed("+id+")")
	}

	$("#infoPane").animate({
		left : $("#items").width()+$(window).width()*0.15
	},600,function(){

	})
}

function hideItem() {
	console.log("Hide Item Pressed");
	$("#infoPane").animate({
		left: $(window).width()/2-$("#items").width()/2
	},600,function(){
		$("#infoPane").hide();
	})
	$("#items").animate({
		margin : "0 0 0 " + ($(window).width()/2-$("#items").width()/2)
	},600,function(){
		$("#items").css("margin","0 auto")
	})
}

function showSellPane() {
	$("#sellPane").css("left",$(window).width()/2-$("#sellPane").width()/2-25)
	$("#blackOverlay").show();
	$("#blackOverlay").css("opacity",0)
	$("#blackOverlay").animate({
		opacity : 0.5
	},600,function() {
		$("#sellPane").show()
		topPos = $("#sellPane").css("top")
		$("#sellPane").css("top",-$("#sellPane").height())
		$("#sellPane").animate({
		position : "fixed",
		top: ($(window).height()/2-$("#sellPane").height()/2)
		},600,function(){})
	})
}

function hideSellPane() {
	$("#sellPane").animate({
		top : (-$("#sellPane").height())
	},600,function() {
		$("#sellPane").hide();
		$("#blackOverlay").animate({
			opacity : 0
		},600,function() {
			$("#blackOverlay").hide();
		})
	})
}

function addItem(meal) {
	allMeals[meal.id] = meal

	newItem = $("<div>",{
		"class" : "item",
		itemId : meal.id,
	});

	topDiv = $("<div>",{
		"class" : "top"
	});

	bottomDiv = $("<div>",{
		"class" : "bottom"
	});

	itemTitle = $("<div>",{
		"class" : "itemTitle"
	});
	itemTitle.append(meal.title);

	itemAvailability = $("<div>",{
		"class" : "itemAvailability"
	});
	itemAvailability.append(meal.location);

	itemProfilePicDiv = $("<div>",{
		"class" : "itemProfilePic"
	});

	itemProfilePic = $("<img>",{
		"class" : "itemProfilePic",
		src : meal.prof_pic_url
	});

	itemFoodPicDiv = $("<div>",{
		"class" : "itemFoodPic"
	})

	itemFoodPic = $("<img>",{
		"class" : "itemFoodPic",
		src : meal.food_pic_url
	});

	itemBuyButton = $("<button>",{
		"class" : "itemBuyButton",
		onclick : "openItem("+meal.id+")"
	});
	itemBuyButton.append("$"+meal.price);

	itemProfilePic.appendTo(itemProfilePicDiv);
	itemFoodPic.appendTo(itemFoodPicDiv);
	itemProfilePicDiv.appendTo(topDiv);
	itemFoodPicDiv.appendTo(topDiv);
	itemBuyButton.appendTo(topDiv);
	itemTitle.appendTo(bottomDiv);
	itemAvailability.appendTo(bottomDiv);
	topDiv.appendTo(newItem);
	bottomDiv.appendTo(newItem);

	newLiItem = $("<li>").append(newItem);
	newLiItem.prependTo("#items > ul");
	$("#items > ul > li").css("padding-top","0"); 
	newLiItem.css("margin-top","-115px");
	newLiItem.css("opacity",0);
	newLiItem.animate({
		"margin-top" : "0",
		"padding-top" : "15px",
		opacity : 1
	},600,function() {});
}

function deletePressed(id) {
	console.log("Deleting item: " + id)
	removeItem(id);
	socket.emit("delMeal",id)
	hideItem();
}

function removeItem(itemID) {
	allMeals[itemID] = null

	toBeRemoved = $("div[itemid = "+itemID+"]")
	toBeRemoved.animate({
		"margin-top": "-130px",
		opacity : 0
	},600,function(){
		toBeRemoved.remove();
	});
}

function submitFoodItem() {
	meal = {
		name : username,
		password : psswd,
		title : $("#titleInput").val(),
		price : (($("#priceInput").val()).replace("$","")),
		contact : $("#phoneNumberInput").val(),
		location : $("#locationInput").val(),
		description : $("#descriptionInput").val()
	}
	console.log(meal);
	socket.emit("sellMeal",meal);
	hideSellPane();
}

socket.on("initData",function(meals) {
	for (var i = 0; i < meals.length; i++) {
		allMeals[meals[i].id] = meals[i]
		addItem(meals[i]);
	};
})

socket.on("newMeal",addItem);

socket.on("delMeal",removeItem);


