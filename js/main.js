
var world, ui; // Globals

window.onload = function() {
function start() {
	// Still add a small delay as otherwise Firefox,
	// possibly WP8.1, seems fail on first try.
	//window.setTimeout(function() {
		$("#loading-text").innerHTML = "Initializing...";
		world = new World();
		var pl = new Actor(world.dungeon.start[0], world.dungeon.start[1]);
		world.dungeon.actors.push(pl);
		world.scheduler.add(pl, true);
		ui = new UI(pl);
		ui.resetDisplay();
		ui.msg("Welcome!");
		//ui.msg("Instructions available from the top right corner.");
		(function tick() {
			requestAnimationFrame(tick);
			var t0 = window.performance.now();
			updateKeys(ui.actor);
			world.update();
			ui.update();
			ui.render();
			if (ui.actor.health <= 0)
				ui.die();
			var t1 = window.performance.now();
			//console.log("dt", t1 - t0);
		})();

		// Another hack to make sure display is reset if other methods of
		// detecting web font load fail
		/*(function checkDimension() {
			if (window.innerWidth < ui.display.getContainer().clientWidth) {
				ui.resetDisplay();
				window.setTimeout(checkDimension, 500);
			}
		})();*/
		$("#loading").style.display = "none";
		$("#game").style.display = "block";
	//}, 100);
}

$("#loading-text").innerHTML = "Waiting for a font...";

FontDetect.onFontLoaded(CONFIG.fontFamily, start, start, { msTimeout: 5000 });
};