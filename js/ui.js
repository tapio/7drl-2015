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
	this.dom = {
		messages: $("#messages")	
	};
	this.messages = [];
	this.messagesDirty = false;
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
