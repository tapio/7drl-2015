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
		ch: "∷",
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
		ch: "○",
		color: "#f40",
		walkable: true,
		transparent: true,
		desc: "Crater."
	},
	rock2: {
		ch: "▰",
		color: "#c50",
		walkable: false,
		transparent: true,
		desc: "Rock."
	},
	rock3: {
		ch: "◾",
		color: "#c50",
		walkable: false,
		transparent: true,
		desc: "Big boulder."
	},
	rock4: {
		ch: ["▟","▙"],
		color: "#d00",
		walkable: false,
		transparent: false,
		desc: "Large rock formation."
	},
	cave: {
		ch: "☖",
		color: "#555",
		walkable: true,
		transparent: true,
		desc: "Cave entrance."
	},
	hill: {
		ch: "▴",
		color: [[255, 100, 0], 20],
		walkable: true,
		transparent: true,
		desc: "Hills."
	},
	mountain: {
		ch: "▲",
		color: [[255, 50, 0], 10],
		walkable: false,
		transparent: false,
		desc: "Impassable mountains."
	},
	// Devices
	oxygenator: {
		name: "Oxygenator", ch: "♼", color: "#0c5",
		resource: "oxygen", amount: 200, intake: "ice", device: true,
		walkable: false,
		transparent: true,
		desc: "Oxygenator. Produces oxygen from water ice."
	},
	generator: {
		name: "Nuclear generator", ch: "☢", color: "#fc0",
		resource: "power", amount: 200, intake: "plutonium", device: true,
		walkable: false,
		transparent: true,
		desc: "Nuclear generator. Produces electricity from radioactive decay. Bring plutonium."
	},
	printer: {
		name: "3d printer", ch: "⚒", color: "#40c",
		shop: true, amount: 0, intake: "mineral", device: true,
		walkable: false,
		transparent: true,
		desc: "3d printer. Creates things from mineral sand."
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
	rifle: {
		name: "Plasma rifle", ch: "⚕", color: "#999", canEquip: true,
		weapon: { accuracy: 0.8, damage: [40,70], power: 5, range: 8 },
		desc: "Accurate and effective long range weapon. Requires power to use."
	},
	// Items
	gluetube: {
		name: "Patch kit", ch: "⊗", color: "#88c",
		resource: "suit", amount: 40, canUse: true, canEquip: true, canConsume: true,
		desc: "Patches leaking space suit.",
		cost: 2
	},
	oxygentank: {
		name: "O₂ tank", ch: "⊚", color: "#fff",
		resource: "oxygen", amount: 80, canUse: true, canEquip: true,
		desc: "Provides portable oxygen reserves.",
		cost: 7
	},
	battery: {
		name: "Battery", ch: "⊛", color: "#06f",
		resource: "power", amount: 40, canUse: true, canEquip: true,
		desc: "Portable power source for the rifle.",
		cost: 5
	},
	medikit: {
		name: "Medikit", ch: "⊕", color: "#833",
		resource: "health", amount: 40, canUse: true, canEquip: true, canConsume: true,
		desc: "Can heal wounds.",
		cost: 3
	},
	plutonium: {
		name: "Plutonium", ch: "▥", color: "#c6a",
		resource: "plutonium", amount: 100,
		desc: "Radioactive material that the generator can convert to electricity."
	},
	mineralsand: {
		name: "Mineral sand", ch: "▦", color: "#cc4",
		resource: "mineral", amount: 1,
		desc: "Raw material for many kinds of 3d prints."
	},
	waterice: {
		name: "Water ice", ch: "▧", color: "#8dd",
		resource: "ice", amount: 100,
		desc: "Frozen water. Oxygenator can turn it into oxygen."
	},
	goalitem: {
		name: "Alien artifact", ch: "⚛", color: "#f0f",
		resource: "goal", amount: 1,
		desc: "Mysterious object. Drop it to the base."
	},
	// Mob weapons
	ratmelee: {
		name: "Rat bite", canEquip: true, canDrop: false,
		weapon: { accuracy: 0.5, damage: [3,10] }
	},
	coyotemelee: {
		name: "Coyote bite", canEquip: true, canDrop: false,
		weapon: { accuracy: 0.6, damage: [7,12] }
	},
	wolfmelee: {
		name: "Wolf bite", canEquip: true, canDrop: false,
		weapon: { accuracy: 0.6, damage: [10,20] }
	},
	bearmelee: {
		name: "Bear claw", canEquip: true, canDrop: false,
		weapon: { accuracy: 0.7, damage: [15,40] }
	}
};


var MOBS = {
	rat: {
		name: "Space rat", ch: "r", color: "#425", ai: "hunter",
		health: 30, weapon: ITEMS.ratmelee, vision: 5 },
	coyote: {
		name: "Space coyote", ch: "c", color: "#973", ai: "hunter",
		health: 60, weapon: ITEMS.coyotemelee, vision: 8 },
	wolf: {
		name: "Space wolf", ch: "w", color: "#987", ai: "hunter",
		health: 80, weapon: ITEMS.wolfmelee, vision: 8 },
	bear: {
		name: "Space bear", ch: "B", color: "#633", ai: "hunter",
		health: 180, weapon: ITEMS.bearmelee, vision: 9 },
	polarbear: {
		name: "Space polar bear", ch: "B", color: "#adf", ai: "hunter",
		health: 200, weapon: ITEMS.bearmelee, vision: 9 }
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
