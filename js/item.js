
function Item(def) {
	"use strict";
	this.name = def.name || "Unknown item";
	this.desc = def.desc || "";
	this.ch = def.ch || "*";
	this.color = def.color || "#ccc";
	this.pos = [0, 0];
	this.canEquip = def.canEquip || false;
	this.canConsume = def.canConsume || false;
	this.canUse = def.canUse || false;
}
