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
		ch: "A",
		color: "#00f",
		walkable: true,
		transparent: false,
		desc: "Airlock."
	},
	ground: {
		ch: ";",
		color: "#c60",
		walkable: true,
		transparent: true,
		desc: "Sandy ground."
	},
	ground2: {
		ch: ":",
		color: "#c90",
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
	hill: {
		ch: "▴",
		color: "#f40",
		walkable: false,
		transparent: true,
		desc: "Steep hills."
	},
	mountain: {
		ch: "▲",
		color: "#f20",
		walkable: false,
		transparent: false,
		desc: "Impassable mountains."
	}
};

for (var i in TILES)
	TILES[i].id = i;



var RESOURCES = {
	oxygen: { name: "O₂" },
	co2: { name: "CO₂" },
	energy: { name: "Energy" },
	metal: { name: "Metal" },
	glue: { name: "Glue" }
};

for (var i in RESOURCES)
	RESOURCES[i].id = i;



var ITEMS = {
	gluetube: { name: "Tube of glue", ch: "✒", color: "#88c", resource: "glue", amount: 100 },
	oxygentank: { name: "O₂ tank", ch: "⌾", color: "#fff", resource: "oxygen", amount: 100 },
	battery: { name: "Battery", ch: "⌁", color: "#06f", resource: "energy", amount: 100 },
	metal: { name: "Scrap metal", ch: "⍽", color: "#999", resource: "metal", amount: 100 }
};

for (var i in ITEMS)
	ITEMS[i].id = i;



var DEVICES = {
	oxygenator: { name: "Oxygenator", ch: "♼", color: "#ff0" },
	rtg: { name: "RTG", ch: "☢", color: "#ff0", desc: "Radioisotope thermoelectric generator produces electricity from radioactive decay." },
	solarpanel: { name: "Solar panel", ch: "☀", color: "#0f0" }
};

for (var i in DEVICES)
	DEVICES[i].id = i;
