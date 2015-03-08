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
	this.dom = {
		messages: $("#messages"),
		condButton: $("#cond_button"),
		invButton: $("#inv_button"),
		lookButton: $("#look_button"),
		menuButton: $("#menu_button"),
	};
	this.messages = [];
	this.messagesDirty = false;

	this.dom.condButton.addEventListener("click", function() {
		this_.state = this_.state == STATE.CHAR ? STATE.GAME : STATE.CHAR;
	}, true);

	this.dom.invButton.addEventListener("click", function() {
		this_.state = this_.state == STATE.INV ? STATE.GAME : STATE.INV;
	}, true);

	this.dom.lookButton.addEventListener("click", function() {
		if (this_.state != STATE.LOOK) {
			this_.msg((CONFIG.touch ? "Touch" : "Click") + " a tile to examine it.");
			//this_.dom.lookButton.innerHTML = "✖";
			this_.state = STATE.LOOK;
		} else {
			//this_.dom.lookButton.innerHTML = "?";
			this_.state = STATE.GAME;
		}
	}, true);

	this.dom.menuButton.addEventListener("click", function() {
		this_.state = this_.state == STATE.MENU ? STATE.GAME : STATE.MENU;
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
		this.dom.messages.innerHTML = msgBuf;
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

function renderInventoryScreen(display, pl) {
	display.drawTextCentered(2, "Inventory");

	for (var i = 0; i < pl.inv.length; ++i) {
		display.drawTextCentered(4+i, pl.inv[i].name);
	}
}

function renderMenuScreen(display) {
	display.drawTextCentered(2, "Menu");
}
