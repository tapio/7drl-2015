Dungeon.prototype.generate = function() {
	var this_ = this;
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

	var freeTiles = [];
	for (var y = 0; y < this.height; ++y) {
		for (var x = 0; x < this.width; ++x) {
			if (this.getTile(x, y).ch == TILES.floor.ch)
				freeTiles.push([x, y]);
		}
	}
	shuffle(freeTiles);

	// Items
	this.items = [];
	for (var i = 0; i < 20; ++i) {
		var item = new Item(randProp(ITEMS));
		item.pos = clone(freeTiles.splice(0, 1)[0]);
		this.items.push(item);
	}
};