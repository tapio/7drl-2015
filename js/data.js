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
		desc: "Airlock. Passage between the base and outside world."
	},
	sand: {
		ch: [":",";"],
		color: [[204, 102, 0], 20],
		walkable: true,
		transparent: true,
		desc: "Sandy ground."
	},
	rockground: {
		ch: [":",";"],
		color: [[128, 128, 128], 20],
		walkable: true,
		transparent: true,
		desc: "Rock ground."
	},
	rockwall: {
		ch: "#",
		color: [[100, 100, 100], 10],
		walkable: false,
		transparent: false,
		desc: "Rocky wall."
	},
	iceground: {
		ch: "░",
		color: [[200, 255, 255], 20],
		walkable: true,
		transparent: true,
		desc: "Icy ground."
	},
	icewall: {
		ch: "#",
		color: [[44, 163, 163], 20],
		walkable: false,
		transparent: false,
		desc: "Icy wall."
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

var ITEMS = {
	// Weapons
	knife: {
		name: "Space knife", ch: "⚔", color: "#999", canEquip: true,
		weapon: { accuracy: 0.7, damage: [20,30] },
		desc: "Can be used as a backup melee weapon."
	},
	gaussrifle: {
		name: "Gauss rifle", ch: "⚕", color: "#999", canEquip: true,
		weapon: { accuracy: 0.8, damage: [40,60], power: 5, range: 8 }
	},
	// Items
	gluetube: {
		name: "Patch kit", ch: "⊗", color: "#88c",
		resource: "suit", amount: 15, canUse: true, canEquip: true, canConsume: true,
		desc: "Patches leaking space suit."
	},
	oxygentank: {
		name: "O₂ tank", ch: "⊚", color: "#fff",
		resource: "oxygen", amount: 60, canUse: true, canEquip: true,
		desc: "Provides portable oxygen reserves."
	},
	battery: {
		name: "Battery", ch: "⊛", color: "#06f",
		resource: "power", amount: 30, canUse: true, canEquip: true,
		desc: "Powers equipment."
	},
	medikit: {
		name: "Medikit", ch: "⊕", color: "#833",
		resource: "health", amount: 40, canUse: true, canEquip: true, canConsume: true,
		desc: "Can heal wounds."
	},
	metal: {
		name: "Scrap metal", ch: "-", color: "#999",
		resource: "metal", amount: 1
	},
	// Mob weapons
	ratmelee: {
		name: "Rat bite", canEquip: true, canDrop: false,
		weapon: { accuracy: 0.5, damage: [5,15] }
	},
	wolfmelee: {
		name: "Wolf bite", canEquip: true, canDrop: false,
		weapon: { accuracy: 0.6, damage: [10,20] }
	},
	bearmelee: {
		name: "Bear claw", canEquip: true, canDrop: false,
		weapon: { accuracy: 0.7, damage: [20,50] }
	},
	// Devices
	oxygenator: {
		name: "Oxygenator", ch: "♼", color: "#0c5", canCarry: false,
		resource: "oxygen", amount: Infinity,
		desc: "Produces oxygen by separating it from CO₂." },
	rtg: {
		name: "RTG", ch: "☢", color: "#fc0", canCarry: false,
		resource: "power", amount: Infinity ,
		desc: "Radioisotope thermoelectric generator produces electricity from radioactive decay." },
	printer: {
		name: "3d printer", ch: "⚒", color: "#40c", canCarry: false,
		shop: true,
		desc: "Creates things." }
};


var MOBS = {
	rat: {
		name: "Space rat", ch: "r", color: "#d40", ai: "hunter",
		health: 40, weapon: ITEMS.ratmelee, vision: 6 },
	wolf: {
		name: "Space wolf", ch: "w", color: "#f44", ai: "hunter",
		health: 80, weapon: ITEMS.wolfmelee, vision: 8 },
	bear: {
		name: "Space bear", ch: "B", color: "#d40", ai: "hunter",
		health: 200, weapon: ITEMS.bearmelee, vision: 8 }
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
