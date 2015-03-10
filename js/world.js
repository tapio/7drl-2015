function World() {
	"use strict";
	this.camera = { pos: [0, 0], center: [0, 0] };
	this.maps = {
		base: new Dungeon("base", "base"),
		overworld: new Dungeon("overworld", "overworld")
	};
	this.dungeon = this.maps.base;
	this.currentActorIndex = 0;
	this.roundTimer = 0;
	this.running = true;
}

World.prototype.update = function() {
	if (Date.now() < this.roundTimer || !this.running)
		return;
	while (this.dungeon.actors.length) {
		if (this.currentActorIndex >= this.dungeon.actors.length)
			this.currentActorIndex = 0;
		var actor = this.dungeon.actors[this.currentActorIndex];
		if (!actor.act()) break;
		this.dungeon.update();
		this.currentActorIndex++;
		if (actor == ui.actor) {
			if (actor.health <= 0) {
				this.running = false;
				ui.die();
				return;
			}
			break; // Always wait for next round after player action
		}
		//else if (distSq(actor.pos[0], actor.pos[1], ui.actor.pos[0], ui.actor.pos[1]) < 6)
		//	break;
	};
	this.roundTimer = Date.now() + 100;
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
	actor.updateVisibility();
	this.currentActor = null;
};
