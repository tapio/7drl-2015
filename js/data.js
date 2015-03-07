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
	gluetube: { name: "Tube of Glue", ch: "g", color: "#88c", resource: "glue", amount: 100 },
	oxygentank: { name: "O₂ tank", ch: "o", color: "#fff", resource: "oxygen", amount: 100 },
	battery: { name: "Battery", ch: "b", color: "#06f", resource: "energy", amount: 100 }
};

for (var i in ITEMS)
	ITEMS[i].id = i;



var DEVICES = {
	oxygenator: { name: "Oxygenator" },
	rtg: { name: "RTG", desc: "Radioisotope thermoelectric generator produces electricity from radioactive decay." },
	solarpanel: { name: "Solar Panel" }
};

for (var i in DEVICES)
	DEVICES[i].id = i;
