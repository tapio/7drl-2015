
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
	this.oxygen = 100;
	this.health = 100;
}

Actor.prototype.visibility = function(x, y) {
	return this.fov[x + y * world.dungeon.width];
};

Actor.prototype.act = function() {
	if (this.health <= 0)
		return true;
	if (this.path.length) {
		var waypoint = this.path.shift();
		// Check items
		var item = world.dungeon.collide(waypoint);
		if (item instanceof Item) {
			if (this.inv.length < this.maxItems) {
				this.inv.push(item);
				removeElem(world.dungeon.items, item);
				ui.msg("Picked up " + item.name + ".");
			} else {
				ui.msg("Can't pick up " + item.name + ". Inventory full! ");
			}
		}
		// Move
		this.pos[0] = waypoint[0];
		this.pos[1] = waypoint[1];
		// Handle environment stuff
		var env = world.dungeon.env;
		this.oxygen -= env.oxygenCost;
		if (this.oxygen <= 0) {
			this.oxygen = 0;
			this.health -= 5;
		}
		// Check for map change
		var tile = world.dungeon.getTile(waypoint[0], waypoint[1])
		if (tile.entrance && this.path.length == 0) {
			world.changeMap(this, tile.entrance);
		}
		return true;
	}
	return false;
};

Actor.prototype.moveTo = function(x, y) {
	var target = world.dungeon.getTile(x, y);
	if (!target.walkable) return;
	world.dungeon.findPath(x, y, this);
};

Actor.prototype.move = function(dx, dy) {
	this.moveTo(this.pos[0] + dx, this.pos[1] + dy);
};

Actor.prototype.equip = function(item) {
	this.equipped = item;
};

Actor.prototype.use = function(item) {
	if (item.resource) {
		this[item.resource] += item.amount;
		item.amount = 0;
		removeElem(this.inv, item);
	}
};

Actor.prototype.drop = function(item) {
	removeElem(this.inv, item);
	item.pos = clone(this.pos);
	world.dungeon.items.push(item);
	if (this == ui.actor)
		ui.msg("Dropped " + item.name + ".");
};