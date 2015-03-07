var dungeon;

function World() {
	"use strict";
	this.maps = {
		base: new Dungeon("base"),
		overworld: new Dungeon("overworld")
	};
	dungeon = this.maps.base;
}
