
function Dungeon(id, mapType) {
	"use strict";
	this.id = id;
	this.width = 0;
	this.height = 0;
	this.map = [];
	this.actors = [];
	this.doors = [];
	this.start = [0,0];
	this.items = [];
	this.passableCache = [];
	this.env = {
		oxygenCost: 0
	};
	var generators = {
		base: this.generateBase.bind(this),
		overworld: this.generateOverworld.bind(this),
		cave: this.generateCave.bind(this)
	}
	generators[mapType]();
	this.passableCache.length = this.map.length;
	this.update();
}

Dungeon.prototype.getTile = function(x, y) {
	if (x < 0 || y < 0 || x >= this.width || y >= this.height) return TILES.empty;
	return this.map[x + y * this.width];
};

Dungeon.prototype.setTile = function(x, y, tile) {
	this.map[x + y * this.width] = typeof tile == "string" ? TILES[tile] : tile;
};

Dungeon.prototype.getPassable = function(x, y) {
	//return this.getTile(x, y).walkable;
	return this.passableCache[x + y * this.width];
};

Dungeon.prototype.getTransparent = function(x, y) {
	return this.getTile(x, y).transparent;
};

Dungeon.prototype.findPath = function(x, y, actor) {
	// Init passable cache
	for (var i = 0, l = this.map.length; i < l; ++i)
		this.passableCache[i] = this.map[i].walkable;
	for (var i = 0, l = this.actors.length; i < l; ++i)
		if (this.actors[i] != actor)
			this.passableCache[this.actors[i].pos[0] + this.actors[i].pos[1] * this.width] = false;

	var finder = new ROT.Path.AStar(x, y, this.getPassable.bind(this));
	var success = false;
	actor.path = [];
	finder.compute(actor.pos[0], actor.pos[1], function(x, y) {
		if (x != actor.pos[0] || y != actor.pos[1])
			actor.path.push([x, y]);
		success = true;
	});
	this.passableCache[actor.pos[0] + actor.pos[1] * this.width] = false;
	return success;
};

Dungeon.prototype.update = function() {
	// Clear passable cache
	for (var i = 0, l = this.map.length; i < l; ++i)
		this.passableCache[i] = this.map[i].walkable;
	// Close all doors
	for (var i = 0, l = this.doors.length; i < l; ++i)
		this.doors[i].open = false;
	// Actor related updates
	for (var i = 0, l = this.actors.length; i < l; ++i) {
		var actor = this.actors[i];
		var x = actor.pos[0];
		var y = actor.pos[1];
		this.passableCache[x + y * this.width] = false;
		for (var i = 0, l = this.doors.length; i < l; ++i) {
			var door = this.doors[i];
			var dx = Math.abs(x - door.pos[0]);
			var dy = Math.abs(y - door.pos[1]);
			if (Math.max(dx, dy) <= 1)
				door.open = true;
		}
	}
	// Update door tiles
	for (var i = 0, l = this.doors.length; i < l; ++i) {
		var pos = this.doors[i].pos;
		var tile = this.doors[i].open ? TILES.door_open : TILES.door_closed;
		this.setTile(pos[0], pos[1], tile);
	}
};

Dungeon.prototype.drawCollection = function(stuff, camera, display, player, threshold) {
	for (var i = 0, l = stuff.length; i < l; ++i) {
		var thing = stuff[i];
		var visibility = player.visibility(thing.pos[0], thing.pos[1]);
		if (visibility >= threshold) {
			var color = ROT.Color.fromString(thing.color);
			if (visibility < 1) ROT.Color.multiply_(color, [64, 64, 64]);
			var x = thing.pos[0] - camera.pos[0];
			var y = thing.pos[1] - camera.pos[1];
			display.draw(x, y, thing.ch, ROT.Color.toHex(color));
		}
	}
};

Dungeon.prototype.draw = function(camera, display, player) {
	var w = display.getOptions().width;
	var h = display.getOptions().height;
	for (var j = 0; j < h; ++j) {
		for (var i = 0; i < w; ++i) {
			var x = i + camera.pos[0];
			var y = j + camera.pos[1];
			var visibility = player.visibility(x, y);
			var tile = visibility > 0 ? this.getTile(x, y) : TILES.empty;
			var color = ROT.Color.fromString(tile.color);

			if (visibility < 1) ROT.Color.multiply_(color, [64, 64, 64]);
			display.draw(i, j, tile.ch, ROT.Color.toHex(color));
		}
	}
	this.drawCollection(this.items, camera, display, player, 1);
	this.drawCollection(this.actors, camera, display, player, 1);
};

Dungeon.prototype.collideCollection = function(stuff, pos) {
	for (var i = 0, l = stuff.length; i < l; ++i) {
		var thing = stuff[i];
		if (thing.pos[0] == pos[0] && thing.pos[1] == pos[1])
			return thing;
	}
	return null;
};

Dungeon.prototype.collide = function(pos) {
	var actor = this.collideCollection(this.actors, pos);
	if (actor) return actor;
	var item = this.collideCollection(this.items, pos);
	if (item) return item;
	return this.getTile(pos[0], pos[1]);
};