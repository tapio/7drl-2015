var STATE = {
	GAME: 1,
	LOOK: 2,
	SHOOT: 3,
	SHOP: 4,
	MENU: 5
};

function UI(actor) {
	"use strict";
	var this_ = this;
	this.actor = actor;
	this.state = STATE.GAME;
	this.display = null;
	this.messages = [];
	this.messagesDirty = false;
	this.selectedInvItem = null;
	this.inventoryElems = [];
	this.shopInv = [
		new Item(ITEMS.oxygentank), new Item(ITEMS.battery),
		new Item(ITEMS.medikit), new Item(ITEMS.gluetube)
	];
	this.shopInv[0].amount = 0;
	this.shopInv[1].amount = 0;
	this.shop = null;

	if (!CONFIG.touch) {
		[].forEach.call(document.querySelectorAll(".btn"), function(elem) {
			elem.addClass("btn-no-touch");
		});
	}

	$("#equipped").addEventListener("click", function() {
		if (this_.state == STATE.SHOOT) {
			$("#equipped").removeClass("btn-selected");
			this_.state = STATE.GAME;
		} else if (this_.actor.equipped) {
			if (this_.actor.equipped.weapon) {
				this_.state = STATE.SHOOT;
				$("#equipped").addClass("btn-selected");
				$("#look-button").removeClass("btn-selected");
				$("#look-button").innerHTML = "☌";
				this_.msg("Select target for " + this_.actor.equipped.name + "...");
			} else this_.actor.use(this_.actor.equipped);
		} else (enterMenu.bind($("#inventory-open")))();
	}, true);

	$("#look-button").addEventListener("click", function() {
		if (this_.state != STATE.LOOK) {
			this_.msg((CONFIG.touch ? "Touch" : "Click") + " a tile to examine it...");
			$("#equipped").removeClass("btn-selected");
			$("#look-button").addClass("btn-selected");
			$("#look-button").innerHTML = "✖";
			this_.state = STATE.LOOK;
		} else {
			$("#look-button").removeClass("btn-selected");
			$("#look-button").innerHTML = "☌";
			this_.state = STATE.GAME;
		}
	}, true);

	function enterMenu() {
		this_.state = STATE.MENU;
		this.addClass("btn-selected");
		$("#look-button").removeClass("btn-selected");
		$("#look-button").innerHTML = "☌";
		$(this.dataset.open).style.display = "block";
		this_.updateInventoryScreen(); // TODO: Move
		this_.updateStatsScreen(); // TODO: Move
	}
	function exitMenu() {
		this_.state = STATE.GAME;
		$("#stats-open").removeClass("btn-selected");
		$("#inventory-open").removeClass("btn-selected");
		$("#mainmenu-open").removeClass("btn-selected");
		$("#look-button").removeClass("btn-selected");
		$(this.dataset.close).style.display = "";
	}

	$("#stats-open").addEventListener("click", enterMenu, true);
	$("#inventory-open").addEventListener("click", enterMenu, true);
	$("#mainmenu-open").addEventListener("click", enterMenu, true);

	$("#stats-close").addEventListener("click", exitMenu, true);
	$("#inventory-close").addEventListener("click", exitMenu, true);
	$("#mainmenu-close").addEventListener("click", exitMenu, true);
	$("#shop-close").addEventListener("click", exitMenu, true);

	$("#info-close").addEventListener("click", function() {
		$("#info").style.display = "";
		window.location.hash = "#game";
	}, true);
	$("#info-ok").addEventListener("click", function() {
		$("#info").style.display = "";
		window.location.hash = "#game";
	}, true);
	$("#mainmenu-howto").addEventListener("click", function() {
		$("#info").style.display = "block";
	}, true);
	$("#mainmenu-credits").addEventListener("click", function() {
		window.open("LICENSE.md", "_blank");
	}, true);
	$("#mainmenu-code").addEventListener("click", function() {
		window.open("https://github.com/tapio/7drl-2015", "_blank");
	}, true);
	$("#mainmenu-bugs").addEventListener("click", function() {
		window.open("https://github.com/tapio/7drl-2015/issues", "_blank");
	}, true);
	$("#mainmenu-restart").addEventListener("click", function() {
		window.location.reload();
	}, true);
	$("#restart").addEventListener("click", function() {
		window.location.reload();
	}, true);

	$("#inventory-equip").addEventListener("click", function() {
		this_.actor.equip(this_.selectedInvItem);
		//this_.updateInventoryScreen();
	}, true);
	$("#inventory-use").addEventListener("click", function() {
		this_.actor.use(this_.selectedInvItem);
		this_.updateInventoryScreen();
	}, true);
	$("#inventory-drop").addEventListener("click", function() {
		this_.actor.drop(this_.selectedInvItem);
		this_.updateInventoryScreen();
	}, true);
	$("#shop-ok").addEventListener("click", function() {
		if (this_.actor.inv.length < this_.actor.maxItems
			&& this_.shop.amount >= this_.selectedInvItem.cost)
		{
			this_.actor.inv.push(new Item(ITEMS[this_.selectedInvItem.id]));
			this_.shop.amount -= this_.selectedInvItem.cost;
		}
		this_.updateShopScreen(this_.actor);
	}, true);

	if (!window.location.hash.contains("game"))
		$("#info").style.display = "block";

	window.addEventListener('resize', function() { ui.resetDisplay(); ui.render(); });
}

UI.prototype.msg = function(msg, source) {
	if (source === undefined || source == this.actor) {
		this.messages.push(msg);
		this.messagesDirty = true;
	}
};

UI.prototype.update = function() {
	if (this.messagesDirty) {
		var msgBuf = "";
		var firstMsg = Math.max(this.messages.length-5, 0);
		var classes = [ "msg4", "msg3", "msg2", "msg1", "msg0" ];
		if (this.messages.length <= 4) classes.shift();
		if (this.messages.length <= 3) classes.shift();
		if (this.messages.length <= 2) classes.shift();
		if (this.messages.length <= 1) classes.shift();
		for (var i = firstMsg; i < this.messages.length; ++i)
			msgBuf += '<span class="' + classes.shift() + '">' + this.messages[i] + '</span><br/>';
		$("#messages").innerHTML = msgBuf;
		this.messagesDirty = false;
	}
	$("#hud-suit").innerHTML = Math.ceil(this.actor.suit);
	$("#hud-health").innerHTML = Math.ceil(this.actor.health);
	$("#hud-oxygen").innerHTML = Math.ceil(this.actor.oxygen);
	$("#hud-power").innerHTML = Math.ceil(this.actor.power);

	if (this.state == STATE.SHOOT) {
		$("#equipped").innerHTML = "✖";
		$("#equipped").style.color = "";
	} else {
		var equipped = this.actor.equipped;
		$("#equipped").innerHTML = equipped ? equipped.ch : "⬚";
		$("#equipped").style.color = equipped ? equipped.color : "";
	}
	var cursor = "crosshair";
	if (this.state == STATE.LOOK) cursor = "help";
	else if (this.actor.path.length) cursor = "wait";
	this.display.getContainer().style.cursor = cursor;
};

UI.prototype.render = function() {
	this.display.clear();
	var camera = world.camera;
	camera.pos[0] = this.actor.pos[0] - camera.center[0];
	camera.pos[1] = this.actor.pos[1] - camera.center[1];
	world.dungeon.draw(camera, this.display, this.actor);
};

UI.prototype.closeMenus = function() {
	$("#stats-close").click();
	$("#inventory-close").click();
	$("#mainmenu-close").click();
};

UI.prototype.resetDisplay = function() {
	var w = Math.floor(window.innerWidth / 30 / CONFIG.spacing);
	var h = Math.floor(window.innerHeight / 50 / CONFIG.spacing);
	world.camera.center = [(w/2)|0, (h/2)|0];

	if (this.display)
		$("#game").removeChild(this.display.getContainer());

	this.display = new ROT.Display({
		width: w,
		height: h,
		bg: "#111",
		fontSize: 48,
		layout: "rect",
		spacing: CONFIG.spacing,
		fontFamily: CONFIG.fontFamily
	});
	$("#game").appendChild(this.display.getContainer());
	this.display.getContainer().addEventListener("click", input.onClick, true);
};

// INVENTORY

UI.prototype.onClickInventoryItem = function(e) {
	// this = clicked element
	ui.inventoryElems.forEach(function(elem) { elem.removeClass("btn-selected"); });
	this.addClass("btn-selected");
	var item = ui.selectedInvItem = ui.actor.inv[this.dataset.index];
	if (!item) return;
	var desc = item.getDescription();
	if (item == ui.actor.equipped)
		desc += " Currently equipped.";
	$("#inventory-details").innerHTML = desc;
	$("#inventory-actions").style.display = "block";
	if (item.canEquip) $("#inventory-equip").removeClass("btn-disabled");
	else $("#inventory-equip").addClass("btn-disabled");
	if (item.canUse) $("#inventory-use").removeClass("btn-disabled");
	else $("#inventory-use").addClass("btn-disabled");
	if (item.canDrop) $("#inventory-drop").removeClass("btn-disabled");
	else $("#inventory-drop").addClass("btn-disabled");
};

UI.prototype.updateInventoryScreen = function() {
	var itemsElem = $("#inventory-items");
	itemsElem.innerHTML = "";
	$("#inventory-actions").style.display = "none";
	ui.selectedInvItem = null;
	var inv = this.actor.inv;
	if (!inv.length) {
		$("#inventory-capacity").innerHTML = "Inventory empty!";
		$("#inventory-details").innerHTML = "";
		return;
	}
	$("#inventory-capacity").innerHTML = "Capacity " + inv.length + "/" + this.actor.maxItems;
	$("#inventory-details").innerHTML = "Click an item to see details and actions...";

	ui.inventoryElems = [];
	for (var i = 0; i < inv.length; ++i) {
		var item = inv[i];
		var elem = document.createElement("div");
		elem.className = "btn btn-square";
		if (!CONFIG.touch) elem.className += " btn-no-touch";
		elem.innerHTML = item.ch;
		elem.title = item.name;
		elem.style.color = item.color;
		elem.dataset.index = i;
		elem.addEventListener("click", this.onClickInventoryItem);
		itemsElem.appendChild(elem);
		ui.inventoryElems.push(elem);
	}
};

// PRINTER

UI.prototype.onClickShopItem = function(e) {
	// this = clicked element
	ui.inventoryElems.forEach(function(elem) { elem.removeClass("btn-selected"); });
	this.addClass("btn-selected");
	var item = ui.selectedInvItem = ui.shopInv[this.dataset.index];
	if (!item) return;
	var desc = item.getDescription() + " Cost: " + item.cost;
	$("#shop-details").innerHTML = desc;
	$("#shop-actions").style.display = "block";
	var canCreate = ui.actor.inv.length < ui.actor.maxItems && item.cost <= ui.shop.amount;
	if (canCreate) $("#shop-ok").removeClass("btn-disabled");
	else $("#shop-ok").addClass("btn-disabled");
};

UI.prototype.updateShopScreen = function() {
	$("#shop-actions").style.display = "none";
	ui.selectedInvItem = null;
	var itemsElem = $("#shop-items");
	itemsElem.innerHTML = "";
	$("#shop-money").innerHTML = this.shop.amount;
	$("#shop-details").innerHTML = "Select an item to produce...";

	ui.inventoryElems = [];
	for (var i = 0; i < this.shopInv.length; ++i) {
		var item = this.shopInv[i];
		var elem = document.createElement("div");
		elem.className = "btn btn-square";
		elem.innerHTML = item.ch;
		elem.title = item.name;
		elem.style.color = item.color;
		elem.dataset.index = i;
		elem.addEventListener("click", this.onClickShopItem);
		itemsElem.appendChild(elem);
		ui.inventoryElems.push(elem);
	}
};

UI.prototype.openShop = function(tile) {
	$("#shop").style.display = "block";
	this.state = STATE.SHOP;
	this.shop = tile;
	this.updateShopScreen();
};

// STATS

UI.prototype.updateStatsScreen = function() {
	$("#stats-suit").innerHTML = Math.ceil(this.actor.suit);
	var leakage = "no leaks";
	if (this.actor.suitLeakage > 0)
		leakage = "leaking %s O₂".format(this.actor.suitLeakage.toFixed(1));
	$("#stats-suit-detail").innerHTML = leakage;
	$("#stats-health").innerHTML = Math.ceil(this.actor.health);
	$("#stats-oxygen").innerHTML = Math.ceil(this.actor.oxygen);
	var o2cost = world.dungeon.env.oxygenCost;
	//$("#stats-oxygen-usage").innerHTML = o2cost;
	$("#stats-oxygen-time").innerHTML = Math.ceil(this.actor.oxygen / (o2cost + ui.actor.suitLeakage));
	$("#stats-power").innerHTML = Math.ceil(this.actor.power);
	// Environment
	$("#stats-weather").innerHTML = world.dungeon == world.maps.base ? "(Indoors)" : "Good";
	$("#stats-atmosphere").innerHTML = o2cost ? (-o2cost + " O₂") : "Breathable";
}

UI.prototype.die = function() {
	var stats = ui.actor.stats;
	$("#death-turns").innerHTML = Math.round(stats.turns);
	$("#death-kills").innerHTML = Math.round(stats.kills);
	$("#death-oxygen").innerHTML = Math.round(stats.oxygen);
	$("#death-power").innerHTML = Math.round(stats.power);
	$("#death-screen").style.display = "block";
};

// rot.js extension
ROT.Display.prototype.drawTextCentered = function(y, str) {
	var x = (this.getOptions().width * 0.5 - str.length * 0.5)|0;
	this.drawText(x, y, str);
};
