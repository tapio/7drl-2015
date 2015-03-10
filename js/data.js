var TILES = {
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
		transparent: true,
		desc: "Empty floor."
	},
	wall: {
		ch: "#", // █
		color: "#777",
		walkable: false,
		transparent: false,
		desc: "Sturdy wall."
	},
	door_open: {
		ch: "/",
		color: "#064",
		walkable: true,
		transparent: true,
		desc: "Open door."
	},
	door_closed: {
		ch: "+",
		color: "#830",
		walkable: true,
		transparent: false,
		desc: "Closed door, will open when somebody is near."
	},
	door_locked: {
		ch: "+",
		color: "#d00",
		walkable: false,
		transparent: false,
		desc: "Locked door."
	},
	airlock: {
		ch: "☖",
		color: "#00f",
		walkable: true,
		transparent: true,
		desc: "Airlock."
	},
	ground: {
		ch: [":",";"],
		color: [[204, 102, 0], 30],
		walkable: true,
		transparent: true,
		desc: "Sandy ground."
	},
	rock: {
		ch: "▁",
		color: "#f40",
		walkable: false,
		transparent: true,
		desc: "Rock."
	},
	rock2: {
		ch: "▂",
		color: "#c50",
		walkable: false,
		transparent: true,
		desc: "Rock."
	},
	rock3: {
		ch: "▃",
		color: "#d00",
		walkable: false,
		transparent: false,
		desc: "Big rock"
	},
	cave: {
		ch: "☖",
		color: "#555",
		walkable: true,
		transparent: true,
		desc: "Cave entrance"
	},
	hill: {
		ch: "▴",
		color: [[255, 100, 0], 20],
		walkable: false,
		transparent: true,
		desc: "Steep hills."
	},
	mountain: {
		ch: "▲",
		color: [[255, 50, 0], 10],
		walkable: false,
		transparent: false,
		desc: "Impassable mountains."
	},

	generateInstance: function(proto) {
		var tile = clone(proto);
		if (tile.ch instanceof Array)
			tile.ch = tile.ch.random();
		if (tile.color instanceof Array)
			tile.color = ROT.Color.toHex(ROT.Color.randomize(tile.color[0], tile.color[1]));
		return tile;
	}
};

var MOBS = {
	enemy: { ch: "@", color: "#f00", ai: "drunk" }
};

var ITEMS = {
	gluetube: { name: "Tube of glue", ch: "⊘", color: "#88c", resource: "glue", amount: 5 },
	oxygentank: { name: "O₂ tank", ch: "⊚", color: "#fff", resource: "oxygen", amount: 60, canUse: true, canEquip: true },
	battery: { name: "Battery", ch: "⊛", color: "#06f", resource: "energy", amount: 30 },
	medikit: { name: "Medikit", ch: "⊕", color: "#833", resource: "health", amount: 40, canUse: true, canEquip: true, desc: "Can heal wounds." },
	metal: { name: "Scrap metal", ch: "-", color: "#999", resource: "metal", amount: 1 },
	oxygenator: { name: "Oxygenator", ch: "♼", color: "#0f0", canCarry: false },
	rtg: { name: "RTG", ch: "☢", color: "#ff0", desc: "Radioisotope thermoelectric generator produces electricity from radioactive decay.", canCarry: false },
	solarpanel: { name: "Solar panel", ch: "☀", color: "#40f", canCarry: false }
};

// Add ids
(function() {
	for (var i in TILES)
		TILES[i].id = i;
	for (var i in MOBS)
		MOBS[i].id = i;
	for (var i in ITEMS)
		ITEMS[i].id = i;
})();
