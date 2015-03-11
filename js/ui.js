var STATE = {
	GAME: 1,
	LOOK: 2,
	SHOOT: 3,
	MENU: 4
};

function UI(actor) {
	"use strict";
	var this_ = this;
	this.actor = actor;
	this.state = STATE.GAME;
	this.messages = [];
	this.messagesDirty = false;
	this.selectedInvItem = null;
	this.inventoryElems = [];
	this.display = null;

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
				this_.msg("Select target...");
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

	$("#mainmenu-credits").addEventListener("click", function() {
		window.open("LICENSE.md", "_blank");
	}, true);
	$("#mainmenu-code").addEventListener("click", function() {
		window.open("https://github.com/tapio/7drl-2015", "_blank");
	}, true);

	$("#inventory-equip").addEventListener("click", function() {
		this_.actor.equip(this_.selectedInvItem);
		//this_.updateInventoryScreen(this_.actor);
	}, true);
	$("#inventory-use").addEventListener("click", function() {
		this_.actor.use(this_.selectedInvItem);
		this_.updateInventoryScreen(this_.actor);
	}, true);
	$("#inventory-drop").addEventListener("click", function() {
		this_.actor.drop(this_.selectedInvItem);
		this_.updateInventoryScreen(this_.actor);
	}, true);
}

UI.prototype.msg = function(msg) {
	this.messages.push(msg);
	this.messagesDirty = true;
};

UI.prototype.update = function() {
	if (this.messagesDirty) {
		var msgBuf = "";
		var firstMsg = Math.max(this.messages.length-3, 0);
		var classes = [ "msg2", "msg1", "msg0" ];
		if (this.messages.length <= 2) classes.shift();
		if (this.messages.length <= 1) classes.shift();
		for (var i = firstMsg; i < this.messages.length; ++i)
			msgBuf += '<span class="' + classes.shift() + '">' + this.messages[i] + '</span><br/>';
		$("#messages").innerHTML = msgBuf;
		this.messagesDirty = false;
	}
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
window.addEventListener('resize', function() { ui.resetDisplay(); ui.render(); });

UI.prototype.onClickInventoryItem = function(e) {
	// this = clicked element
	ui.inventoryElems.forEach(function(elem) { elem.removeClass("btn-selected"); });
	this.addClass("btn-selected");
	var item = ui.selectedInvItem = ui.actor.inv[this.dataset.index];
	if (!item) return;
	var desc = item.getDescription();
	$("#inventory-details").innerHTML = desc;
	$("#inventory-actions").style.display = "block";
	if (item.canEquip) $("#inventory-equip").removeClass("btn-disabled");
	else $("#inventory-equip").addClass("btn-disabled");
	if (item.canUse) $("#inventory-use").removeClass("btn-disabled");
	else $("#inventory-use").addClass("btn-disabled");
};

UI.prototype.updateInventoryScreen = function() {
	$("#inventory-actions").style.display = "none";
	ui.selectedInvItem = null;
	var inv = this.actor.inv;
	if (!inv.length) {
		$("#inventory-capacity").innerHTML = "Inventory empty!";
		$("#inventory-details").innerHTML = "";
		return;
	}
	$("#inventory-capacity").innerHTML = "Capacity " + inv.length + "/" + this.actor.maxItems;
	var itemsElem = $("#inventory-items");
	itemsElem.innerHTML = "";
	$("#inventory-details").innerHTML = "Click an item to see details and actions...";

	ui.inventoryElems = [];
	for (var i = 0; i < inv.length; ++i) {
		var item = inv[i];
		var elem = document.createElement("div");
		elem.className = "btn btn-square";
		elem.innerHTML = item.ch;
		elem.title = item.name;
		elem.style.color = item.color;
		elem.dataset.index = i;
		elem.addEventListener("click", this.onClickInventoryItem);
		itemsElem.appendChild(elem);
		ui.inventoryElems.push(elem);
	}
};

UI.prototype.updateStatsScreen = function() {
	$("#stats-health").innerHTML = Math.ceil(this.actor.health);
	$("#stats-oxygen").innerHTML = Math.ceil(this.actor.oxygen);
	var o2cost = world.dungeon.env.oxygenCost;
	$("#stats-oxygen-usage").innerHTML = o2cost;
	$("#stats-oxygen-time").innerHTML = Math.ceil(this.actor.oxygen / o2cost);
	$("#stats-power").innerHTML = Math.ceil(this.actor.power);
	// Environment
	$("#stats-weather").innerHTML = world.dungeon == world.maps.base ? "(Indoors)" : "Good";
	$("#stats-atmosphere").innerHTML = o2cost ? (-o2cost + " O₂") : "Breathable";
}

UI.prototype.die = function() {
	$("#death-screen").style.display = "block";
};

// rot.js extension
ROT.Display.prototype.drawTextCentered = function(y, str) {
	var x = (this.getOptions().width * 0.5 - str.length * 0.5)|0;
	this.drawText(x, y, str);
};
