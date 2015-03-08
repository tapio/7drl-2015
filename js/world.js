var dungeon;

function World() {
	"use strict";
	this.maps = {
		base: new Dungeon("base", "base"),
		overworld: new Dungeon("overworld", "overworld")
	};
	dungeon = this.maps.base;
}

World.prototype.changeMap = function(actor, entrance) {
	removeElem(dungeon.actors, actor);
	dungeon.start = clone(actor.pos);
	if (!this.maps[entrance.mapId]) {
		this.maps[entrance.mapId] = new Dungeon(entrance.mapId, entrance.mapType);
	}
	dungeon = this.maps[entrance.mapId];
	dungeon.actors.push(actor);
	actor.pos[0] = dungeon.start[0];
	actor.pos[1] = dungeon.start[1];
	actor.fov = [];
}
