var input = {
	pressed: [],
	onClick: function(e) {
		var coords = ui.display.eventToPosition(e);
		var x = coords[0] + world.camera.pos[0];
		var y = coords[1] + world.camera.pos[1];

		if (ui.state == STATE.GAME) {
			if (ui.actor.visibility(x, y) > 0.1)
				ui.actor.moveTo(x, y);
		} else if (ui.state == STATE.SHOOT) {
			if (ui.actor.visibility(x, y) > 0.9) {
				ui.actor.shoot(x, y);
				ui.actor.done = true;
				//ui.state = STATE.GAME;
			}
		} else if (ui.state == STATE.LOOK) {
			if (ui.actor.visibility(x, y) > 0.1) {
				var thing = world.dungeon.collide([x, y]);
				var desc = thing.getDescription ? thing.getDescription() : thing.desc;
				ui.msg(desc ? desc : (thing.name ? thing.name : "Nothing interesting..."));
			}
		}
	},
	onKeyDown: function(e) {
		input.pressed[e.keyCode] = true;
		if (input.pressed[ROT.VK_CONTROL] || input.pressed[ROT.VK_ALT]) // CTRL/ALT for browser hotkeys
			return;
		if (e.keyCode >= ROT.VK_F1 && e.keyCode <= ROT.VK_F12) // F1-F12
			return;

		if (e.keyCode == ROT.VK_ESCAPE && ui.state == STATE.LOOK)
			$("#look-button").click();
		else if (e.keyCode == ROT.VK_ESCAPE && ui.state != STATE.GAME)
			ui.closeMenus();
		else if (e.keyCode == ROT.VK_ESCAPE)
			$("#mainmenu-open").click();

		if (e.keyCode == ROT.VK_SPACE) {
			ui.closeMenus();
			$("#stats-open").click();
		}
		if (e.keyCode == ROT.VK_I) {
			ui.closeMenus();
			$("#inventory-open").click();
		}

		e.preventDefault();
	},
	onKeyUp: function(e) {
		input.pressed[e.keyCode] = false;
	},

	updateKeys: function(actor) {
		if (ui.state != STATE.GAME && ui.state != STATE.LOOK)
			return;
		var dx = 0, dy = 0;
		if (input.pressed[ROT.VK_LEFT] || input.pressed[ROT.VK_NUMPAD4] || input.pressed[ROT.VK_H])
			dx -= 1;
		if (input.pressed[ROT.VK_RIGHT] || input.pressed[ROT.VK_NUMPAD6] || input.pressed[ROT.VK_L])
			dx += 1;
		if (input.pressed[ROT.VK_UP] || input.pressed[ROT.VK_NUMPAD8] || input.pressed[ROT.VK_K])
			dy -= 1;
		if (input.pressed[ROT.VK_DOWN] || input.pressed[ROT.VK_NUMPAD2] || input.pressed[ROT.VK_J])
			dy += 1;
		if (dx || dy)
			actor.move(dx, dy);
	}
};
document.addEventListener('keydown', input.onKeyDown, false);
document.addEventListener('keyup', input.onKeyUp, false);
