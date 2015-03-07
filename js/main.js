
var dungeon = new Dungeon();
var pl = new Actor(dungeon.start[0], dungeon.start[1]);
dungeon.actors.push(pl);
var ui = new UI();
var w = Math.floor(window.innerWidth / 30);
var h = Math.floor(window.innerHeight / 50);
var camera = { pos: [0, 0], center: [(w/2)|0, (h/2)|0] };

ui.msg("Welcome!");
ui.msg("You are likely to be eaten by a grue.");

var display = new ROT.Display({
	width: w,
	height: h,
	//bg: "transparent",
	fontSize: 48,
	layout: "rect"
});
document.body.appendChild(display.getContainer());

function onClick(e) {
	var coords = display.eventToPosition(e);
	var x = coords[0] + camera.pos[0]
	var y = coords[1] + camera.pos[1];
	var target = dungeon.getTile(x, y);
	if (!target.walkable) return;
	dungeon.findPath(x, y, pl);
};

display.getContainer().addEventListener("click", onClick, true);

function render() {
	display.clear();
	camera.pos[0] = pl.pos[0] - camera.center[0];
	camera.pos[1] = pl.pos[1] - camera.center[1];
	dungeon.draw(camera, display, pl);
	ui.update();
}

window.setInterval(function () {
	dungeon.update();
	render();
	display.getContainer().style.cursor = pl.path.length ? "wait" : "crosshair";
}, 75);
