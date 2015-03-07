"use strict";

if (!String.prototype.contains)
	String.prototype.contains = function() {
		return String.prototype.indexOf.apply(this, arguments) !== -1;
	};

if (!Math.sign)
	Math.sign = function(x) {
		x = +x; // Convert to a number
		if (x === 0 || isNaN(x)) return x;
		else return x > 0 ? 1 : -1;
	};

function $(selector) { return document.querySelector(selector); }

function lerp(a, b, f) { return a + (b - a) * f; }

function distSq(x1, y1, x2, y2) {
	var dx = x2 - x1, dy = y2 - y1;
	return dx * dx + dy * dy;
}

function rand(min, max) { return Math.random() * (max - min) + min; }

function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }

function randProp(obj) {
	var result, count = 0;
	for (var prop in obj)
		if (Math.random() < 1.0 / ++count) result = prop;
	return obj[result];
}

function randElem(arr) { return arr[(Math.random() * arr.length) | 0]; }

function removeElem(arr, elem) { arr.splice(arr.indexOf(elem), 1); }

function last(arr) { return arr[arr.length-1]; }

function shuffle(arr) {
	var s = [];
	while (arr.length) s.push(arr.splice((Math.random() * arr.length)|0, 1)[0]);
	while (s.length) arr.push(s.pop());
}

function buildString(char, amount) {
	var ret = "";
	for (var i = 0; i < amount; ++i)
		ret += char;
	return ret;
}

// If an object has clone() function, it is assumed to return a copy.
function clone(obj) {
	// Handle the 3 simple types, and null or undefined
	if (null === obj || "object" != typeof obj) return obj;
	var copy;
	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; ++i)
			copy[i] = clone(obj[i]);
		return copy;
	}
	// Handle Object
	if (obj instanceof Object) {
		if (obj.constructor) copy = new obj.constructor();
		else copy = {};
		for (var attr in obj)
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		return copy;
	}
	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
}
