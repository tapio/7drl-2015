var STATE = {
	GAME: 1,
	LOOK: 2,
	INV: 3,
	CHAR: 4,
	MENU: 5
};

var camera, display;

function UI() {
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
		//TODO
	}, true);

	this.dom.invButton.addEventListener("click", function() {
		//TODO
	}, true);

	this.dom.lookButton.addEventListener("click", function() {
		if (this_.state == STATE.GAME) {
			this_.msg((CONFIG.touch ? "Touch" : "Click") + " a tile to examine it.");
			this_.dom.lookButton.innerHTML = "✖";
			this_.state = STATE.LOOK;
		} else {
			this_.dom.lookButton.innerHTML = "🔍";
			this_.state = STATE.GAME;
		}
	}, true);

	this.dom.menuButton.addEventListener("click", function() {
		//TODO
	}, true);
};

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
		spacing: CONFIG.spacing
	});
	document.body.appendChild(display.getContainer());
	display.getContainer().addEventListener("click", onClick, true);
}
window.addEventListener('resize', function() { resetDisplay(); render(); });
