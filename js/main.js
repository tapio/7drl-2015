
var world = new World();
var pl = new Actor(dungeon.start[0], dungeon.start[1]);
dungeon.actors.push(pl);
var ui = new UI();

ui.msg("Welcome!");
ui.msg("You are likely to be eaten by a grue.");

function render() {
	"use strict";
	display.clear();
	camera.pos[0] = pl.pos[0] - camera.center[0];
	camera.pos[1] = pl.pos[1] - camera.center[1];
	dungeon.draw(camera, display, pl);
	ui.update();
}

function start() {
	// Still add a small delay as otherwise Firefox,
	// possibly WP8.1, seems fail on first try.
	window.setTimeout(function() {
		resetDisplay();
		window.setInterval(function () {
			updateKeys(pl);
			dungeon.update();
			render();
		}, 75);
	}, 100);
}

FontDetect.onFontLoaded(CONFIG.fontFamily, start, start, { msTimeout: 4000 });
