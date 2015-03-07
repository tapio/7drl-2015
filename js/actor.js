
function Actor(x, y) {
	this.pos = [ x || 0, y || 0 ];
	this.ch = "@";
	this.color = "#ddd";
	this.path = [];
	this.fov = [];
	this.vision = 15;
}

Actor.prototype.act = function() {
	if (this.path.length) {
		// Pathing
		var waypoint = this.path.shift();
		this.pos[0] = waypoint[0];
		this.pos[1] = waypoint[1];
	}
};
