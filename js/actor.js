
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
	this.equipped = null;
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
		// Check for map change
		var tile = dungeon.getTile(waypoint[0], waypoint[1])
		if (tile.entrance && this.path.length == 0) {
			world.changeMap(this, tile.entrance);
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

Actor.prototype.equip = function(item) {
	this.equipped = item;
};

Actor.prototype.use = function(item) {
	// TODO
};

Actor.prototype.drop = function(item) {
	removeElem(this.inv, item);
	item.pos = clone(this.pos);
	dungeon.items.push(item);
	if (this == ui.actor)
		ui.msg("Dropped " + item.name + ".");
};