
function Dungeon() {
	var this_ = this;
	this.width = 60;
	this.height = 24;
	this.actors = [];
	this.map = new Array(this.width * this.height);
	var gen = new ROT.Map.Digger(this.width, this.height);
	// General layout
	gen.create(function(x, y, wall) {
		this_.setTile(x, y, wall ? TILES.wall : TILES.floor);
	});
	// Doors
	this.doors = [];
	var rooms = gen.getRooms();
	for (var i = 0; i < rooms.length; i++) {
		rooms[i].getDoors(function(x, y) {
			this_.setTile(x, y, TILES.door_closed);
			this_.doors.push({ pos: [x, y], open: false });
		});
	}
	this.start = rooms[0].getCenter();
	this.freeTiles = [];
	for (var y = 0; y < this.height; ++y) {
		for (var x = 0; x < this.width; ++x) {
			if (this.getTile(x, y).ch == TILES.floor.ch)
				this.freeTiles.push([x, y]);
		}
	}
	shuffle(this.freeTiles);
	// Items
	this.items = [];
	for (var i = 0; i < 20; ++i) {
		var item = new Item(randProp(ITEMS));
		item.pos = clone(this.freeTiles.splice(0, 1)[0]);
		this.items.push(item);
	}
}

Dungeon.prototype.getTile = function(x, y) {
	if (x < 0 || y < 0 || x >= this.width || y >= this.height) return TILES.empty;
	return this.map[x + y * this.width];
};

Dungeon.prototype.setTile = function(x, y, tile) {
	this.map[x + y * this.width] = typeof tile == "string" ? TILES[tile] : tile;
};

Dungeon.prototype.getPassable = function(x, y) {
	return this.getTile(x, y).walkable;
};

Dungeon.prototype.getTransparent = function(x, y) {
	return this.getTile(x, y).transparent;
};

Dungeon.prototype.findPath = function(x, y, actor) {
	var finder = new ROT.Path.AStar(x, y, this.getPassable.bind(this));
	var success = false;
	actor.path = [];
	finder.compute(actor.pos[0], actor.pos[1], function(x, y) {
		if (x != actor.pos[0] || y != actor.pos[1])
			actor.path.push([x, y]);
		success = true;
	});
	return success;
};

Dungeon.prototype.update = function() {
	// Close all doors
	for (var i = 0, l = this.doors.length; i < l; ++i)
		this.doors[i].open = false;
	// Update actors
	for (var i = 0, l = this.actors.length; i < l; ++i) {
		var actor = this.actors[i];
		actor.act();
		this.autoOpenDoors(actor);
		this.updateVisibility(actor);
	}
	// Update doors
	for (var i = 0, l = this.doors.length; i < l; ++i) {
		var pos = this.doors[i].pos;
		var tile = this.doors[i].open ? TILES.door_open : TILES.door_closed;
		this.setTile(pos[0], pos[1], tile);
	}
};

Dungeon.prototype.autoOpenDoors = function(actor) {
	var x = actor.pos[0];
	var y = actor.pos[1];
	for (var i = 0, l = this.doors.length; i < l; ++i) {
		var door = this.doors[i];
		var dx = Math.abs(x - door.pos[0]);
		var dy = Math.abs(y - door.pos[1]);
		if (Math.max(dx, dy) <= 1)
			door.open = true;
	}
};

Dungeon.prototype.updateVisibility = function(actor) {
	if (actor.fov.length != this.map.length)
		actor.fov = new Array(this.width * this.height);
	actor.fov.forEach(function(element, index, array) {
		if (element == 1) array[index] = 0.5;
		else if (element === undefined) array[index] = 0;
	});
	function callback(x, y, r, visibility) {
		if (visibility > 0)
			actor.fov[x + y * this.width] = 1;
	}
	var fov = new ROT.FOV.PreciseShadowcasting(this.getTransparent.bind(this));
	fov.compute(actor.pos[0], actor.pos[1], actor.vision, callback.bind(this));
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
	for (var i = 0, l = this.map.length; i < l; ++i) {
		var x = (i % this.width) - camera.pos[0];
		var y = ((i / this.width)|0) - camera.pos[1];
		var visibility = player.fov[i];
		var tile = visibility > 0 ? this.map[i] : TILES.empty;
		var color = ROT.Color.fromString(tile.color);

		if (visibility < 1) ROT.Color.multiply_(color, [64, 64, 64]);
		display.draw(x, y, tile.ch, ROT.Color.toHex(color));
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