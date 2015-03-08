
function Actor(x, y) {
	"use strict";
	this.name = "Player";
	this.pos = [ x || 0, y || 0 ];
	this.ch = "@";
	this.color = "#ddd";
	this.path = [];
	this.fov = [];
	this.vision = 10;
	this.inv = [];
	this.maxItems = 12;
}

Actor.prototype.visibility = function(x, y) {
	return this.fov[x + y * dungeon.width];
};

Actor.prototype.act = function() {
	if (this.path.length) {
		var waypoint = this.path.shift();
		// Check items
		var item = dungeon.collide(waypoint);
		if (item instanceof Item) {
			if (this.inv.length < this.maxItems) {
				this.inv.push(item);
				removeElem(dungeon.items, item);
				ui.msg("Picked up " + item.name + ".");
			} else {
				ui.msg("Can't pick up " + item.name + ". Inventory full! ");
			}
		}
		// Move
		this.pos[0] = waypoint[0];
		this.pos[1] = waypoint[1];
		if (dungeon.getTile(waypoint[0], waypoint[1]).id == "airlock") {
			removeElem(dungeon.actors, this);
			dungeon = world.maps.overworld;
			dungeon.actors.push(this);
			this.pos[0] = dungeon.start[0];
			this.pos[1] = dungeon.start[1];
			this.fov = [];
		}
	}
};

Actor.prototype.moveTo = function(x, y) {
	var target = dungeon.getTile(x, y);
	if (!target.walkable) return;
	dungeon.findPath(x, y, pl);
};

Actor.prototype.move = function(dx, dy) {
	this.moveTo(this.pos[0] + dx, this.pos[1] + dy);
};