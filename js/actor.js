
function Actor(x, y, def) {
	"use strict";
	def = def || {};
	this.name = "Player";
	this.pos = [ x || 0, y || 0 ];
	this.ch = def.ch || "@";
	this.color = def.color || "#ddd";
	this.path = [];
	this.fov = [];
	this.vision = 10;
	this.inv = [];
	this.maxItems = 12;
	this.equipped = null;
	this.oxygen = 100;
	this.health = 100;
	this.ai = def.ai;
}

Actor.prototype.visibility = function(x, y) {
	return this.fov[x + y * world.dungeon.width];
};

Actor.prototype.updateVisibility = function() {
	var dungeon = world.dungeon;
	if (this.fov.length != dungeon.map.length)
		this.fov = new Array(dungeon.width * dungeon.height);
	this.fov.forEach(function(element, index, array) {
		if (element == 1) array[index] = 0.5;
		else if (element === undefined) array[index] = 0;
	});
	function callback(x, y, r, visibility) {
		if (visibility > 0)
			this.fov[x + y * dungeon.width] = 1;
	}
	var fov = new ROT.FOV.PreciseShadowcasting(dungeon.getTransparent.bind(dungeon));
	fov.compute(this.pos[0], this.pos[1], this.vision, callback.bind(this));
};

Actor.prototype.act = function() {
	if (this.health <= 0)
		return true;

	if (this.ai) {
		if (!this.path.length) {
			var dx = randInt(-1, 1);
			var dy = randInt(-1, 1);
			this.path.push([ this.pos[0] + dx, this.pos[1] + dy ]);
		}
	}

	if (this.path.length) {
		var waypoint = this.path.shift();
		// Check items
		var item = world.dungeon.collide(waypoint);
		if (item instanceof Item) {
			if (this.inv.length < this.maxItems) {
				this.inv.push(item);
				removeElem(world.dungeon.items, item);
				if (this == ui.actor)
					ui.msg("Picked up " + item.name + ".");
			} else {
				if (this == ui.actor)
					ui.msg("Can't pick up " + item.name + ". Inventory full! ");
			}
		}
		// Move
		this.pos[0] = waypoint[0];
		this.pos[1] = waypoint[1];
		if (this === ui.actor)
			this.updateVisibility();
		// Handle environment stuff
		var env = world.dungeon.env;
		this.oxygen -= env.oxygenCost;
		if (this.oxygen <= 0) {
			this.oxygen = 0;
			this.health -= 5;
		}
		if (!this.ai) {
			// Check for map change
			var tile = world.dungeon.getTile(waypoint[0], waypoint[1])
			if (tile.entrance && this.path.length == 0) {
				world.changeMap(this, tile.entrance);
			}
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

Actor.prototype.unequip = function(item) {
	if (!item || this.equipped == item)
		this.equipped = null;
};

Actor.prototype.use = function(item) {
	if (item.resource) {
		this[item.resource] += item.amount;
		item.amount = 0;
		this.unequip(item);
		removeElem(this.inv, item);
	}
};

Actor.prototype.drop = function(item) {
	this.unequip(item);
	removeElem(this.inv, item);
	item.pos = clone(this.pos);
	world.dungeon.items.push(item);
	if (this == ui.actor)
		ui.msg("Dropped " + item.name + ".");
};