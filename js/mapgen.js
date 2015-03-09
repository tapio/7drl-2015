Dungeon.prototype.generateBase = function() {
	"use strict";
	this.width = randInt(40, 50);
	this.height = randInt(20, 30);
	this.map = new Array(this.width * this.height);
	var gen = new ROT.Map.Digger(this.width, this.height, {
		roomWidth: [5, 8],
		roomHeight: [5, 6],
		corridorLength: [2, 4],
		dugPercentage: 0.2,
		timeLimit: 3000
	});
	// General layout
	gen.create((function(x, y, wall) {
		this.setTile(x, y, wall ? TILES.wall : TILES.floor);
	}).bind(this));

	// Doors
	this.doors = [];
	var rooms = gen.getRooms();
	for (var i = 0; i < rooms.length; i++) {
		rooms[i].getDoors((function(x, y) {
			this.setTile(x, y, TILES.door_closed);
			this.doors.push({ pos: [x, y], open: false });
		}).bind(this));
	}
	this.start = rooms[0].getCenter();
	// Air lock
	var airlock = clone(TILES.airlock);
	airlock.entrance = { mapId: "overworld", mapType: "overworld" };
	this.setTile(this.start[0]+1, this.start[1]+1, airlock);

	var freeTiles = [];
	for (var y = 0; y < this.height; ++y) {
		for (var x = 0; x < this.width; ++x) {
			if (this.getTile(x, y).ch == TILES.floor.ch)
				freeTiles.push([x, y]);
		}
	}
	shuffle(freeTiles);

	// Items
	var itemChoices = [ ITEMS.oxygentank, ITEMS.medikit, ITEMS.gluetube, ITEMS.battery ];
	this.generateItems(randInt(4,8), itemChoices, freeTiles);
};

Dungeon.prototype.generateOverworld = function() {
	this.env.oxygenCost = 1;
	this.width = randInt(80, 100);
	this.height = randInt(60, 80);
	this.map = new Array(this.width * this.height);

	var gen = new ROT.Map.Arena(this.width, this.height);
	// General layout
	var grounds = [ TILES.ground, TILES.ground2 ];
	var rocks = [ TILES.rock, TILES.rock2, TILES.rock3 ];
	var noise = new ROT.Noise.Simplex();
	var freeTiles = [];
	var caveCount = 0;
	gen.create((function(x, y, wall) {
		var mountainNoise = noise.get(x/20, y/20);
		if (wall || mountainNoise > 0.6) {
			this.setTile(x, y, TILES.mountain);
		} else if (mountainNoise > 0.2) {
			if (rnd() > 0.9) {
				var cave = clone(TILES.cave);
				var id = this.id + "_cave_" + (++caveCount);
				cave.entrance = { mapId: id, mapType: "cave" };
				this.setTile(x, y, cave);
			} else this.setTile(x, y, TILES.hill);
		} else if (rnd() > 0.95) {
			this.setTile(x, y, rocks.random());
		} else {
			this.setTile(x, y, grounds.random());
			freeTiles.push([x, y]);
		}
	}).bind(this));
	shuffle(freeTiles);
	this.start = freeTiles.splice(0, 1)[0];
	// Air lock
	var airlock = clone(TILES.airlock);
	airlock.entrance = { mapId: "base", mapType: "base" };
	this.setTile(this.start[0], this.start[1], airlock);
	// Items & mobs
	this.generateItems(randInt(40,60), [ ITEMS.metal ], freeTiles);
	this.generateMobs(randInt(10,20), [ MOBS.enemy ], freeTiles);
};

Dungeon.prototype.generateCave = function() {
	this.env.oxygenCost = 1;
	this.width = randInt(30, 80);
	this.height = randInt(30, 80);
	this.map = new Array(this.width * this.height);

	var gen = new ROT.Map.Cellular(this.width, this.height);
	gen.randomize(0.5);
	for (var i = 0; i < 3; ++i)
		gen.create(null);
	var grounds = [ TILES.ground, TILES.ground2 ];
	var rocks = [ TILES.rock, TILES.rock2, TILES.rock3 ];
	var freeTiles = [];
	gen.create((function(x, y, wall) {
		if (wall) {
			this.setTile(x, y, TILES.wall);
		} else {
			this.setTile(x, y, grounds.random());
			freeTiles.push([x, y]);
		}
	}).bind(this));
	shuffle(freeTiles);
	this.start = freeTiles.splice(0, 1)[0];
	// Exit
	var caveExit = clone(TILES.cave);
	caveExit.entrance = { mapId: "overworld", mapType: "overworld" };
	this.setTile(this.start[0], this.start[1], caveExit);
	// Items & mobs
	this.generateItems(randInt(40,60), [ ITEMS.metal ], freeTiles);
	this.generateMobs(randInt(10,20), [ MOBS.enemy ], freeTiles);
};

Dungeon.prototype.generateItems = function(amount, choices, freeTiles) {
	for (var i = 0; i < amount; ++i) {
		var item = new Item(choices.random());
		item.pos = freeTiles.splice(0, 1)[0];
		this.items.push(item);
	}
};

Dungeon.prototype.generateMobs = function(amount, choices, freeTiles) {
	for (var i = 0; i < amount; ++i) {
		var pos = freeTiles.splice(0, 1)[0];
		var mob = new Actor(pos[0], pos[1], choices.random());
		this.actors.push(mob);
	}
};