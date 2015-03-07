Dungeon.prototype.generateBase = function() {
	"use strict";
	var this_ = this;
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
	this.setTile(this.start[0]+1, this.start[1]+1, TILES.airlock);

	var freeTiles = [];
	for (var y = 0; y < this.height; ++y) {
		for (var x = 0; x < this.width; ++x) {
			if (this.getTile(x, y).ch == TILES.floor.ch)
				freeTiles.push([x, y]);
		}
	}
	shuffle(freeTiles);

	// Items
	var itemChoices = [ ITEMS.oxygentank, ITEMS.gluetube, ITEMS.battery ];
	this.generateItems(randInt(4,8), itemChoices, freeTiles);
};

Dungeon.prototype.generateOverworld = function() {
	var this_ = this;
	this.width = randInt(80, 100);
	this.height = randInt(60, 80);
	this.map = new Array(this.width * this.height);

	var gen = new ROT.Map.Arena(this.width, this.height);
	// General layout
	var grounds = [ TILES.ground, TILES.ground2 ];
	var rocks = [ TILES.rock, TILES.rock2, TILES.rock3 ];
	var noise = new ROT.Noise.Simplex();
	var freeTiles = [];
	gen.create(function(x, y, wall) {
		if (wall || noise.get(x/20, y/20) > 0.2) {
			this_.setTile(x, y, TILES.mountain);
		} else if (rnd() > 0.95) {
			this_.setTile(x, y, rocks.random());
		} else {
			this_.setTile(x, y, grounds.random());
			freeTiles.push([x, y]);
		}
	});
	shuffle(freeTiles);
	this.start = freeTiles.splice(0, 1)[0];

	// Items
	this.generateItems(randInt(40,60), [ ITEMS.metal ], freeTiles);
};

Dungeon.prototype.generateItems = function(amount, choices, freeTiles) {
	for (var i = 0; i < amount; ++i) {
		var item = new Item(choices.random());
		item.pos = freeTiles.splice(0, 1)[0];
		this.items.push(item);
	}
};