var tiles = {
	empty: {
		ch: "",
		color: "#000",
		walkable: false,
		transparent: false
	},
	floor: {
		ch: "·",
		color: "#666",
		walkable: true,
		transparent: true
	},
	wall: {
		ch: "#", // █
		color: "#777",
		walkable: false,
		transparent: false
	},
	door_open: {
		ch: "/",
		color: "#064",
		walkable: true,
		transparent: true
	},
	door_closed: {
		ch: "+",
		color: "#830",
		walkable: true,
		transparent: false
	},
	door_locked: {
		ch: "+",
		color: "#d00",
		walkable: false,
		transparent: false
	}
};

for (var i in tiles)
	tiles[i].id = i;
