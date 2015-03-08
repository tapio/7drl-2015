var STATE = {
	GAME: 1,
	LOOK: 2,
	MENU: 3
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

	$("#look-button").addEventListener("click", function() {
		if (this_.state != STATE.LOOK) {
			this_.msg((CONFIG.touch ? "Touch" : "Click") + " a tile to examine it.");
			$("#look-button").addClass("btn-selected");
			this_.state = STATE.LOOK;
		} else {
			$("#look-button").removeClass("btn-selected");
			this_.state = STATE.GAME;
		}
	}, true);

	function enterMenu() {
		this_.state = STATE.MENU;
		this.addClass("btn-selected");
		$("#look-button").removeClass("btn-selected");
		$(this.dataset.open).style.display = "block";
		this_.updateInventoryScreen(this_.actor); // TODO: Move
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

	$("#inventory-equip").addEventListener("click", function() {
		this_.actor.equip(this_.selectedInvItem);
		//this_.updateInventoryScreen(this_.actor);
	}, true);
	$("#inventory-use").addEventListener("click", function() {
		this_.actor.use(this_.selectedInvItem);
		//this_.updateInventoryScreen(this_.actor);
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
		for (var i = firstMsg; i < this.messages.length; ++i)
			msgBuf += this.messages[i] + "<br/>";
		$("#messages").innerHTML = msgBuf;
		this.messagesDirty = false;
	}

	var cursor = "crosshair";
	if (this.state == STATE.LOOK) cursor = "help";
	else if (this.actor.path.length) cursor = "wait";
	this.display.getContainer().style.cursor = cursor;
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
		document.body.removeChild(this.display.getContainer());

	this.display = new ROT.Display({
		width: w,
		height: h,
		//bg: "transparent",
		fontSize: 48,
		layout: "rect",
		spacing: CONFIG.spacing,
		fontFamily: CONFIG.fontFamily
	});
	document.body.appendChild(this.display.getContainer());
	this.display.getContainer().addEventListener("click", INPUT_HANDLERS.onClick, true);
};
window.addEventListener('resize', function() { ui.resetDisplay(); render(); });

UI.prototype.onClickInventoryItem = function(e) {
	// this = clicked element
	ui.inventoryElems.forEach(function(elem) { elem.removeClass("btn-selected"); });
	this.addClass("btn-selected");
	var item = ui.selectedInvItem = ui.actor.inv[this.dataset.index];
	if (!item) return;
	var desc = item.name;
	$("#inventory-details").innerHTML = desc;
	$("#inventory-actions").style.display = "block";
	if (item.canEquip) $("#inventory-equip").removeClass("btn-disabled");
	else $("#inventory-equip").addClass("btn-disabled");
	if (item.canConsume) $("#inventory-use").removeClass("btn-disabled");
	else $("#inventory-use").addClass("btn-disabled");
};

UI.prototype.updateInventoryScreen = function() {
	$("#inventory-actions").style.display = "none";
	ui.selectedInvItem = null;
	var itemsElem = $("#inventory-items");
	var inv = this.actor.inv;
	if (!inv.length) {
		itemsElem.innerHTML = "Inventory empty!";
		$("#inventory-details").innerHTML = "";
		return;
	}
	itemsElem.innerHTML = "";
	$("#inventory-details").innerHTML = "Click an item to see details...";

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
}

// rot.js extension
ROT.Display.prototype.drawTextCentered = function(y, str) {
	var x = (this.getOptions().width * 0.5 - str.length * 0.5)|0;
	this.drawText(x, y, str);
};
