
var world = new World();
var pl = new Actor(dungeon.start[0], dungeon.start[1]);
dungeon.actors.push(pl);
resetDisplay();
var ui = new UI();

ui.msg("Welcome!");
ui.msg("You are likely to be eaten by a grue.");

function render() {
	display.clear();
	if (ui.state == STATE.GAME || ui.state == STATE.LOOK) {
		camera.pos[0] = pl.pos[0] - camera.center[0];
		camera.pos[1] = pl.pos[1] - camera.center[1];
		dungeon.draw(camera, display, pl);
	} else if (ui.state == STATE.CHAR) {
		renderCharacterScreen(display, pl);
	} else if (ui.state == STATE.INV) {
		renderInventoryScreen(display, pl);
	} else if (ui.state == STATE.MENU) {
		renderMenuScreen(display);
	}
	ui.update();
}

window.setInterval(function () {
	updateKeys(pl);
	dungeon.update();
	render();
}, 75);
