function World() {
	"use strict";
	this.camera = { pos: [0, 0], center: [0, 0] };
	this.maps = {
		base: new Dungeon("base", "base"),
		overworld: new Dungeon("overworld", "overworld")
	};
	this.dungeon = this.maps.base;
	this.scheduler = new ROT.Scheduler.Simple();
	this.currentActor = null;
	this.roundTimer = 0;
	this.running = true;
}

World.prototype.update = function() {
	if (Date.now() < this.roundTimer || !this.running)
		return;
	if (this.currentActor && !this.currentActor.act())
		return;
	this.dungeon.update();
	this.currentActor = this.scheduler.next();
	while (this.currentActor.act()) {
		this.dungeon.update();
		if (this.currentActor == ui.actor) {
			if (this.currentActor.health <= 0) {
				this.running = false;
				ui.die();
				return;
			}
			break;
		}
		this.currentActor = this.scheduler.next();
	}
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
	this.scheduler.clear();
	for (var i = 0; i < this.dungeon.actors.length; ++i)
		this.scheduler.add(this.dungeon.actors[i], true);
};
