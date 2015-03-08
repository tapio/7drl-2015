
var world, ui; // Globals

function render() {
	"use strict";
	ui.display.clear();
	var pl = ui.actor;
	var camera = world.camera;
	camera.pos[0] = pl.pos[0] - camera.center[0];
	camera.pos[1] = pl.pos[1] - camera.center[1];
	world.dungeon.draw(camera, ui.display, pl);
	ui.update();
}

function start() {
	// Still add a small delay as otherwise Firefox,
	// possibly WP8.1, seems fail on first try.
	window.setTimeout(function() {
		world = new World();
		var pl = new Actor(world.dungeon.start[0], world.dungeon.start[1]);
		world.dungeon.actors.push(pl);
		ui = new UI(pl);
		ui.resetDisplay();
		ui.msg("Welcome!");
		ui.msg("You are likely to be eaten by a grue.");
		window.setInterval(function () {
			updateKeys(ui.actor);
			world.dungeon.update();
			render();
		}, 75);
	}, 100);
}

FontDetect.onFontLoaded(CONFIG.fontFamily, start, start, { msTimeout: 4000 });
