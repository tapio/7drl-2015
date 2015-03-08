
function onClick(e) {
	var coords = ui.display.eventToPosition(e);
	var x = coords[0] + world.camera.pos[0];
	var y = coords[1] + world.camera.pos[1];

	if (ui.state == STATE.GAME) {
		pl.moveTo(x, y);
	} else if (ui.state == STATE.LOOK) {
		if (pl.visibility(x, y) > 0.1) {
			var thing = world.dungeon.collide([x, y]);
			ui.msg(thing.desc ? thing.desc : (thing.name ? thing.name : "Nothing interesting..."));
		}
	}
}

var pressed = [];

function onKeyDown(e) {
	keys.pressed[e.keyCode] = true;
	if (keys.pressed[keys.CTRL] || keys.pressed[keys.ALT]) // CTRL/ALT for browser hotkeys
		return;
	if (e.keyCode >= keys.F1 && e.keyCode <= keys.F12) // F1-F12
		return;

	if (e.keyCode == keys.ESCAPE && ui.state == STATE.LOOK)
		$("#look-button").click();
	else if (e.keyCode == keys.ESCAPE && ui.state != STATE.GAME)
		ui.closeMenus();
	else if (e.keyCode == keys.ESCAPE)
		$("#mainmenu-open").click();

	if (e.keyCode == keys.SPACE) {
		ui.closeMenus();
		$("#stats-open").click();
	}
	if (e.keyCode == keys.I) {
		ui.closeMenus();
		$("#inventory-open").click();
	}

	e.preventDefault();
}

function onKeyUp(e) {
	keys.pressed[e.keyCode] = false;
}

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function updateKeys(pl) {
	if (ui.state != STATE.GAME && ui.state != STATE.LOOK)
		return;
	var dx = 0, dy = 0;
	if (keys.pressed[keys.LEFT] || keys.pressed[keys.NUMPAD4] || keys.pressed[keys.H])
		dx -= 1;
	if (keys.pressed[keys.RIGHT] || keys.pressed[keys.NUMPAD6] || keys.pressed[keys.L])
		dx += 1;
	if (keys.pressed[keys.UP] || keys.pressed[keys.NUMPAD8] || keys.pressed[keys.K])
		dy -= 1;
	if (keys.pressed[keys.DOWN] || keys.pressed[keys.NUMPAD2] || keys.pressed[keys.J])
		dy += 1;
	if (dx || dy)
		pl.move(dx, dy);
}

var keys = {
	pressed: [],

	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	ESCAPE: 27,
	SPACE: 32,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	0: 48,
	1: 49,
	2: 50,
	3: 51,
	4: 52,
	5: 53,
	6: 54,
	7: 55,
	8: 56,
	9: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	NUMPAD0: 96,
	NUMPAD1: 97,
	NUMPAD2: 98,
	NUMPAD3: 99,
	NUMPAD4: 100,
	NUMPAD5: 101,
	NUMPAD6: 102,
	NUMPAD7: 103,
	NUMPAD8: 104,
	NUMPAD9: 105,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190
};
