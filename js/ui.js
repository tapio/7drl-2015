var STATE = {
	GAME: 1,
	LOOK: 2,
	INV: 3,
	CHAR: 4,
	MENU: 5
};

var camera, display;

function UI() {
	"use strict";
	var this_ = this;
	this.state = STATE.GAME;
	this.messages = [];
	this.messagesDirty = false;

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
		updateInventoryScreen(pl); // TODO: Move
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
	if (ui.state == STATE.LOOK) cursor = "help";
	else if (pl.path.length) cursor = "wait";
	display.getContainer().style.cursor = cursor;
};


function resetDisplay() {
	var w = Math.floor(window.innerWidth / 30 / CONFIG.spacing);
	var h = Math.floor(window.innerHeight / 50 / CONFIG.spacing);
	camera = { pos: [0, 0], center: [(w/2)|0, (h/2)|0] };

	if (display)
		document.body.removeChild(display.getContainer());

	display = new ROT.Display({
		width: w,
		height: h,
		//bg: "transparent",
		fontSize: 48,
		layout: "rect",
		spacing: CONFIG.spacing,
		fontFamily: CONFIG.fontFamily
	});
	document.body.appendChild(display.getContainer());
	display.getContainer().addEventListener("click", onClick, true);
	display.width = w;
	display.height = h;
	display. cx = (w/2)|0;
	display. cy = (h/2)|0;
}
window.addEventListener('resize', function() { resetDisplay(); render(); });

ROT.Display.prototype.drawTextCentered = function(y, str) {
	var x = (this.getOptions().width * 0.5 - str.length * 0.5)|0;
	this.drawText(x, y, str);
};

function renderCharacterScreen(display, pl) {
	display.drawTextCentered(2, pl.name);
}

function onClickInventoryItem(e) {
	var item = pl.inv[this.dataset.index];
	if (!item) return;
	var desc = item.name;
	$("#inventory-details").innerHTML = desc;
};

function updateInventoryScreen(pl) {
	var itemsElem = $("#inventory-items");
	if (!pl.inv.length) {
		itemsElem.innerHTML = "Inventory empty!";
		return;
	}
	itemsElem.innerHTML = "";

	for (var i = 0; i < pl.inv.length; ++i) {
		var item = pl.inv[i];
		var elem = document.createElement("div");
		elem.className = "btn btn-square";
		elem.innerHTML = item.ch;
		elem.title = item.name;
		elem.style.color = item.color;
		elem.dataset.index = i;
		elem.addEventListener("click", onClickInventoryItem);
		itemsElem.appendChild(elem);
	}
}

function renderMenuScreen(display) {
	display.drawTextCentered(2, "Menu");
}
