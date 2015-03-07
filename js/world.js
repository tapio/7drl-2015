var dungeon;

function World() {
	this.maps = {
		base: new Dungeon("base"),
		overworld: new Dungeon("overworld")
	};
	dungeon = this.maps.base;
}
