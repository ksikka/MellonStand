var socket = io.connect('http://ksikka.mellonstand.jit.su/');
var username = "Tommy";
var psswd = "techcomiscool";

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

function boop() {
	$("#items").animate({
		margin:"0px 0px 0px 15%",
	},600,function(){})
	showInfoPane()
}

function showInfoPane() {
	$("#infoPane").css("top","100px")
	$("#infoPane").css("left",$(window).width()/2-$("#items").width()/2)
	$("#infoPane").show();
	$("#infoPane").animate({
		left : $("#items").width()+$(window).width()*0.15
	},600,function(){})
}

function showSellPane() {
	$("#sellPane").css("left",$(window).width()/2-$("#sellPane").width()/2-25)
	overlayOpacity = $("#blackOverlay").css("opacity")
	$("#blackOverlay").show();
	$("#blackOverlay").css("opacity",0)
	$("#blackOverlay").animate({
		opacity : overlayOpacity
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

	newItem.attr("description",meal.description);

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

function removeItem(itemID) {
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
		price : $("#priceInput").val(),
		location : $("#locationInput").val(),
		description : $("#descriptionInput").val()
	}

	console.log(meal);
	socket.emit("sellMeal",meal);
	hideSellPane();
}

socket.on("initData",function(meals) {
	for (var i = meals.length-1; i >= 0; i--) {
		addItem(meals[i]);
	};
})

socket.on("newMeal",addItem);

socket.on("delMeal",removeItem);


