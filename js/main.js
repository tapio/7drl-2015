
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
		//ui.msg("Instructions available from the top right corner.");
		window.setInterval(function () {
			var t0 = performance.now();
			updateKeys(ui.actor);
			world.update();
			ui.update();
			ui.render();
			if (ui.actor.health <= 0)
				ui.die();
			var t1 = performance.now();
			//console.log("dt", t1 - t0);
		}, 75);

		// Another hack to make sure display is reset if other methods of
		// detecting web font load fail
		(function checkDimension() {
			if (window.innerWidth < ui.display.getContainer().clientWidth) {
				ui.resetDisplay();
				window.setTimeout(checkDimension, 500);
			}
		})();
	}, 100);
}

FontDetect.onFontLoaded(CONFIG.fontFamily, start, start, { msTimeout: 4000 });
})();