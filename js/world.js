function World() {
	"use strict";
	this.camera = { pos: [0, 0], center: [0, 0] };
	this.maps = {
		base: new Dungeon("base", "base"),
		overworld: new Dungeon("overworld", "overworld")
	};
	this.dungeon = this.maps.base;
}

World.prototype.update = function() {
	this.dungeon.update();
};

World.prototype.changeMap = function(actor, entrance) {
	removeElem(this.dungeon.actors, actor);
	this.dungeon.start = clone(actor.pos);
	if (!this.maps[entrance.mapId]) {
		this.maps[entrance.mapId] = new Dungeon(entrance.mapId, entrance.mapType);
	}
	this.dungeon = this.maps[entrance.mapId];
	this.dungeon.actors.push(actor);
	actor.pos[0] = this.dungeon.start[0];
	actor.pos[1] = this.dungeon.start[1];
	actor.fov = [];
};
