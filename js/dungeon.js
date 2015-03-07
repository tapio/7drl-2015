
function Dungeon() {
	var this_ = this;
	this.width = 60;
	this.height = 24;
	this.actors = [];
	this.map = new Array(this.width * this.height);
	var gen = new ROT.Map.Digger(this.width, this.height);
	// General layout
	gen.create(function(x, y, wall) {
		this_.setTile(x, y, wall ? tiles.wall : tiles.floor);
	});
	// Doors
	this.doors = [];
	var rooms = gen.getRooms();
	for (var i = 0; i < rooms.length; i++) {
		rooms[i].getDoors(function(x, y) {
			this_.setTile(x, y, tiles.door_closed);
			this_.doors.push({ pos: [x, y], open: false });
		});
	}
	this.start = rooms[0].getCenter();
}

Dungeon.prototype.getTile = function(x, y) {
	if (x < 0 || y < 0 || x >= this.width || y >= this.height) return tiles.empty;
	return this.map[x + y * this.width];
};

Dungeon.prototype.setTile = function(x, y, tile) {
	this.map[x + y * this.width] = typeof tile == "string" ? tiles[tile] : tile;
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
		var tile = this.doors[i].open ? tiles.door_open : tiles.door_closed;
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

Dungeon.prototype.draw = function(camera, display, player) {
	for (var i = 0, l = this.map.length; i < l; ++i) {
		var x = (i % this.width) - camera.pos[0];
		var y = ((i / this.width)|0) - camera.pos[1];
		var visibility = player.fov[i];
		var tile = visibility > 0 ? this.map[i] : tiles.empty;
		var color = ROT.Color.fromString(tile.color);

		if (visibility < 1) ROT.Color.multiply_(color, [64, 64, 64]);
		display.draw(x, y, tile.ch, ROT.Color.toHex(color));
	}
	for (var i = 0, l = this.actors.length; i < l; ++i) {
		var actor = this.actors[i];
		var x = actor.pos[0] - camera.pos[0];
		var y = actor.pos[1] - camera.pos[1];
		display.draw(x, y, actor.ch, actor.color);
	}
};
