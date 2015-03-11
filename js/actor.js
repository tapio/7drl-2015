
function Actor(x, y, def) {
	"use strict";
	def = def || {};
	this.name = def.name || "Player";
	this.pos = [ x || 0, y || 0 ];
	this.ch = def.ch || "@";
	this.color = def.color || "#ddd";
	this.path = [];
	this.fov = [];
	this.vision = def.vision || 8;
	this.inv = [];
	if (def.weapon) this.inv.push(new Item(def.weapon));
	this.maxItems = 12;
	this.equipped = this.inv.length ? this.inv[0] : null;
	this.oxygen = 100;
	this.health = def.health || 100;
	this.power = 100;
	this.ai = !def.ai ? null : {
		type: def.ai,
		target: null
	};
	this.faction = def.ai ? 0 : 1;
	this.done = false;
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

Actor.prototype.moveTo = function(x, y) {
	//var target = world.dungeon.getTile(x, y);
	//if (!target.walkable) return;
	if (x == this.pos[0] && y == this.pos[1]) {
		this.done = true; // Skip turn
		return;
	}
	if (!world.dungeon.getPassable(x, y)) return;
	world.dungeon.findPath(x, y, this);
};

Actor.prototype.move = function(dx, dy) {
	this.moveTo(this.pos[0] + dx, this.pos[1] + dy);
};

Actor.prototype.equip = function(item) {
	this.equipped = item;
	if (this == ui.actor)
		ui.msg("Equipped " + item.name + ".");
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
		if (item.canConsume)
			removeElem(this.inv, item);
	}
};

Actor.prototype.drop = function(item) {
	if (!item.canDrop)
		return;
	this.unequip(item);
	removeElem(this.inv, item);
	item.pos = clone(this.pos);
	world.dungeon.items.push(item);
	if (this == ui.actor)
		ui.msg("Dropped " + item.name + ".");
};

// Also accepts actor directly in x
Actor.prototype.shoot = function(x, y) {
	if (!this.equipped || !this.equipped.weapon)
		return;
	var wp = this.equipped.weapon;
	// Power?
	if (wp.power && this.power < wp.power) {
		if (this == ui.actor)
			ui.msg("Not enough power to shoot " + this.equipped.name + ", needs at least ⚡" + wp.power + ".");
		return;
	}
	this.power -= wp.power;
	var target = x instanceof Actor ? x : world.dungeon.collide([x, y]);
	if (target instanceof Actor) {
		// Accuracy?
		if (Math.random() <= this.equipped.weapon.accuracy) {
			var damage = wp.damage;
			target.health -= damage;
			if (target.health <= 0) {
				if (this == ui.actor)
					ui.msg("You killed " + target.name + "!");
				else if (target == ui.actor)
					ui.msg(this.name + " kills you!");
			} else {
				if (this == ui.actor)
					ui.msg("You hit " + target.name + " for " + damage + "!");
				else if (target == ui.actor)
					ui.msg(this.name + " hit you for " + damage + "!");
			}
		} else if (this == ui.actor) {
			ui.msg("You missed " + target.name + "!");
		} else if (target == ui.actor) {
			ui.msg(this.name + " missed you!");
		}
	} else if (this == ui.actor) {
		ui.msg("You didn't hit anything!");
	}
}

Actor.prototype.doPath = function(checkItems) {
	if (this.path.length) {
		var waypoint = this.path.shift();
		var thing = world.dungeon.collide(waypoint);
		// Check enemy
		if (thing instanceof Actor) {
			this.path = [];
			var enemy = thing;
			if (this.faction != enemy.faction) {
				this.shoot(thing);
				return true;
			}
			return false;
		}
		// Check items
		if (checkItems) {
			var item = thing;
			if (item instanceof Item && item.canCarry) {
				if (this.inv.length < this.maxItems) {
					this.inv.push(item);
					removeElem(world.dungeon.items, item);
					if (this == ui.actor)
						ui.msg("Picked up " + item.name + ".");
				} else {
					if (this == ui.actor)
						ui.msg("Can't pick up " + item.name + ". Inventory full! ");
				}
				this.path = [];
				return true;
			}
		}
		this.pos[0] = waypoint[0];
		this.pos[1] = waypoint[1];
		return true;
	}
	return false;
};

Actor.prototype.act = function() {
	if (this.health <= 0)
		return true;

	if (this.done) {
		this.done = false;
		return true;
	}

	if (this.ai)
		return this.hunterAI();

	if (this.doPath(true)) {
		if (this === ui.actor)
			this.updateVisibility();
		// Handle environment stuff
		var env = world.dungeon.env;
		this.oxygen -= env.oxygenCost;
		if (this.oxygen <= 0) {
			this.oxygen = 0;
			this.health -= 5;
		}
		// Check for map change
		var tile = world.dungeon.getTile(this.pos[0], this.pos[1])
		if (tile.entrance && this.path.length == 0) {
			world.changeMap(this, tile.entrance);
		}
		return true;
	}
	return false;
};

Actor.prototype.drunkAI = function() {
	var dx = randInt(-1, 1);
	var dy = randInt(-1, 1);
	var newPos = [ this.pos[0] + dx, this.pos[1] + dy ];
	if (world.dungeon.getTile(newPos[0], newPos[1]).walkable);
		this.path.push(newPos);
	return true;
};

Actor.prototype.hunterAI = function() {
	if (!this.equipped || !this.equipped.weapon)
		return this.drunkAI();
	if (!this.ai.target) {
		var newTarget = ui.actor; // TODO: Other possibilities?
		this.updateVisibility();
		if (this.visibility(newTarget.pos[0], newTarget.pos[1]) < 1)
			return this.drunkAI();
		this.ai.target = ui.actor;
	}
	var target = this.ai.target;
	var tx = target.pos[0], ty = target.pos[1];
	var wp = this.equipped.weapon;
	var range = wp.range ? wp.range : 0;
	if (distSq(this.pos[0], this.pos[1], tx, ty) > range * range) {
		// Pathing
		this.moveTo(target.pos[0], target.pos[1]);
		this.doPath(false);
	} else this.path = [];
	// TODO: Shoot if anyone has a ranged weapon
	return true;
};