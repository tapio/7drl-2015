
function Item(def) {
	"use strict";
	this.name = def.name || "Unknown item";
	this.desc = def.desc || "";
	this.ch = def.ch || "*";
	this.color = def.color || "#ccc";
	this.pos = [0, 0];
	this.canCarry = def.canCarry === undefined ? true : def.canCarry;
	this.canEquip = def.canEquip || false;
	this.canUse = def.canUse || false;
	this.canConsume = def.canConsume || false;
	this.resource = def.resource || null;
	this.amount = def.amount || 0;
	this.weapon = def.weapon || null;
}

Item.prototype.getDescription = function() {
	var desc = this.name;
	if (this.desc) desc += ": " + this.desc + " ";
	else desc += ". ";
	if (this.resource) {
		if (this.amount) desc += "Contains " + this.amount + " units.";
		else desc += "Empty.";
	}
	return desc;
};