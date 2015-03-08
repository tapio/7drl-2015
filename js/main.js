
var world, ui; // Globals

(function() {
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
			world.update();
			ui.update();
			ui.render();
			if (ui.actor.health <= 0)
				ui.die();
		}, 75);
	}, 100);
}

FontDetect.onFontLoaded(CONFIG.fontFamily, start, start, { msTimeout: 4000 });
})();