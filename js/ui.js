var camera, display;

function resetDisplay() {
	var w = Math.floor(window.innerWidth / 30);
	var h = Math.floor(window.innerHeight / 50);
	camera = { pos: [0, 0], center: [(w/2)|0, (h/2)|0] };

	if (display)
		document.body.removeChild(display.getContainer());

	display = new ROT.Display({
		width: w,
		height: h,
		//bg: "transparent",
		fontSize: 48,
		layout: "rect"
	});
	document.body.appendChild(display.getContainer());
	display.getContainer().addEventListener("click", onClick, true);
}
window.addEventListener('resize', function() { resetDisplay(); render(); });

function UI() {
	var this_ = this;
	this.dom = {
		messages: $("#messages"),
		menuButton: $("#menu_button"),
		lookButton: $("#look_button"),
	};
	this.messages = [];
	this.messagesDirty = false;
	this.lookMode = false;

	this.dom.menuButton.addEventListener("click", function() {
		//TODO
	}, true);

	this.dom.lookButton.addEventListener("click", function() {
		this_.lookMode = !this_.lookMode;
		if (this_.lookMode) {
			this_.msg("Click a tile to examine it.");
			this_.dom.lookButton.innerHTML = "✖";
		} else this_.dom.lookButton.innerHTML = "🔍";
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
};
