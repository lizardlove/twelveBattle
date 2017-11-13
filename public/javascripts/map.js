/*
* @Author: 10261
* @Date:   2017-07-28 11:18:52
* @Last Modified by:   10261
* @Last Modified time: 2017-08-09 20:52:34
*/

'use strict';
(function () {
	function Maps(O) {
		this.staticCanvas = document.createElement("canvas");
		this.staticCtx = this.staticCanvas.getContext("2d");
		this.staticCanvas.width = O.width;
		this.staticCanvas.height = O.height;

		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = O.width;
		this.canvas.height = O.height;

		this.width = O.width;
		this.height = O.height;

		this.re = false;

		this.static(O.scene);
	}

	Maps.prototype.static = function (scene) {
		var ctx = this.staticCtx;

		if (scene.order == 2) {
			var evePat = ctx.createPattern(resources.get("./images/eve.png"), "repeat");
			var bgBlock = ctx.createPattern(resources.get("./images/bgblock.png"), "repeat");
			var bgPat = ctx.createPattern(resources.get("./images/sky.png"), "repeat");
			ctx.fillStyle = bgBlock;
			ctx.fillRect(2500, 2500, 1000, 1000);
			ctx.fillStyle = evePat;
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(2500, 2500);
			ctx.lineTo(3500, 2500);
			ctx.lineTo(scene.width, 0);
			ctx.closePath();
			ctx.fill();
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(0, scene.height);
			ctx.lineTo(2500, 3500);
			ctx.lineTo(3500, 3500);
			ctx.lineTo(scene.width, scene.height);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
			ctx.restore();
    		ctx.fillStyle = bgPat;
    		ctx.save();
    		ctx.beginPath();
    		ctx.moveTo(0, 0);
    		ctx.lineTo(2500, 2500);
    		ctx.lineTo(2500, 3500);
    		ctx.lineTo(0, scene.height);
    		ctx.closePath();
    		ctx.fill();
    		ctx.restore();
    		ctx.save();
    		ctx.beginPath();
    		ctx.moveTo(scene.width, 0);
    		ctx.lineTo(3500, 2500);
    		ctx.lineTo(3500, 3500);
    		ctx.lineTo(scene.width, scene.height);
    		ctx.closePath();
    		ctx.fill();
    		ctx.restore();

		} else if (scene.order == 1) {
			var bgPat = ctx.createPattern(resources.get("./images/bgblock.png"), "repeat");
			ctx.save();
			ctx.fillStyle = bgPat;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(scene.width, 0);
			ctx.lineTo(scene.width, scene.height);
			ctx.lineTo(0, scene.height);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}

		var blockPat = ctx.createPattern(resources.get("./images/block.png"), "repeat");
		ctx.fillStyle = blockPat;
		for (var i = 0; i < scene.static.block.length; i++) {
			var block = scene.static.block[i];
			ctx.fillRect(block.x, block.y, block.width, block.height);
		}

		for (var i = 0; i < scene.static.fog.length; i++) {
			var fog = scene.static.fog[i];
			ctx.drawImage(resources.get("./images/fog.png"), 0, 0, 100, 111, fog.x, fog.y, fog.width, fog.height);
		}

		var spikePat = ctx.createPattern(resources.get("./images/spike.png"), "repeat");
		ctx.fillStyle = spikePat;
		for (var i = 0; i < scene.static.spike.length; i++) {
			var spike = scene.static.spike[i];
			ctx.save();
			ctx.translate(spike.x, spike.y);
			switch(spike.gravity) {
				case ("north"): {
					ctx.rotate(Math.PI);
					ctx.fillRect(0, 0, -spike.width, -spike.height)
					break;
				}
				case ("south"): {
					ctx.fillRect(0, 0, spike.width, spike.height);
					break;
				}
				case ("west"): {
					ctx.rotate(Math.PI / 2);
					ctx.fillRect(0, 0, spike.height, -spike.width);
					break;
				}
				case ("east"): {
					ctx.rotate(-Math.PI / 2);
					ctx.fillRect(0, 0, -spike.height, spike.width);
					break;
				}
				default: break;
			}
			ctx.restore();
		}

		//mouse
		var mouse = scene.department.mouse;
		for (var i = 0; i <mouse.length; i++) {
				ctx.drawImage(resources.get("./images/mouseB.png"), 0, 0, 77, 110, mouse[i].x, mouse[i].y, mouse[i].width, mouse[i].height);
		}

		if (scene.order == 1) {

		    var elecPat = ctx.createPattern(resources.get("./images/elec.png"), "repeat");
    		ctx.fillStyle = elecPat;
    		for (var i = 0; i < scene.static.electric.length; i++) {
    			var elec = scene.static.electric[i];
    			ctx.fillRect(elec.x, elec.y, elec.width, elec.height);
    		}    

    		//bar
    		for (var i = 0; i < scene.static.bar.length; i++) {
    			var bar = scene.static.bar[i];
    			ctx.save();
    			ctx.translate(bar.x, bar.y);
    			ctx.rotate(-Math.PI / 2);
    			ctx.drawImage(resources.get("./images/wood.png"), 0, 0, 25, 163, 0, 0, bar.height, bar.width);
    			ctx.restore();
    		}    

    		//goal
    		for (var i = 0; i < scene.static.goal.length; i++) {
    			var goal = scene.static.goal[i];
    			ctx.save();
    			ctx.translate(goal.x, goal.y);
    			ctx.rotate(-Math.PI / 2);
    			ctx.drawImage(resources.get("./images/goal.png"), 0, 0, 94, 141, 0, 0, goal.width, goal.height);
    			ctx.restore();
    		}    

    		//cage
    		var cage = scene.static.cage;
    		ctx.save();
    		ctx.translate(cage.x, cage.y);
    		ctx.rotate(-Math.PI / 2);
    		ctx.drawImage(resources.get("./images/cage.png"), 0, 0, 96, 74, 0, 0, cage.width, cage.height);
    		ctx.restore();    

    		//special static
    		//brace
    		var brace = scene.department.special.brace;
    		ctx.save();
    		ctx.translate(brace.x, brace.y);
    		ctx.rotate(Math.PI / 2);
    		ctx.drawImage(resources.get("./images/brace.png"), 0, 0, 75, 66, 0, 0, brace.width, brace.height);
    		ctx.restore();
    		// R
    		var R = scene.department.special.R;
    		ctx.save();
    		ctx.translate(R.x, R.y);
    		ctx.drawImage(resources.get("./images/R.png"), 0, 0, 73, 100, 0, 0, R.width, R.height);
    		ctx.restore();    

    		//trans
    		var trans = scene.department.special.trans[1];
    		ctx.drawImage(resources.get("./images/trans.png"), 0, 0, 76, 106, trans.x, trans.y, trans.width, trans.height);
    	} else if (scene.order == 2) {

    		
    		//water
    		var water = scene.static.water;
    		for (var i = 0; i < water.length; i++) {
    			ctx.save();
    			var waterPat;
    			switch (water[i].size) {
    				case 3: {
    					waterPat = ctx.createPattern(resources.get("./images/water_3.png"), "repeat");
    					ctx.fillStyle = waterPat;
    					ctx.translate(water[i].x, water[i].y);
    					if (water[i].gravity == "west") {
    						ctx.rotate(Math.PI / 2);
    						ctx.fillRect(0, -50, water[i].height, water[i].width);
    					} else if (water[i].gravity == "east"){
    						ctx.rotate(-Math.PI / 2);
    						ctx.fillRect(-water[i].height, 0, water[i].height, water[i].width);
    					}
    					break;
    				}
    				case 2: {
    					waterPat = ctx.createPattern(resources.get("./images/water_2.png"), "repeat");
    					ctx.fillStyle = waterPat;
    					ctx.fillRect(water[i].x, water[i].y, water[i].width, water[i].height);
    					break;
    				}
    				case 1: {
    					waterPat = ctx.createPattern(resources.get("./images/water_1.png"), "repeat");
    					ctx.translate(water[i].x, water[i].y);
    					ctx.fillStyle = waterPat;
    					if (water[i].gravity == "west") {
    						ctx.rotate(Math.PI / 2);
    					    ctx.fillRect(0, -water[i].width, water[i].height, water[i].width);
    					} else if (water[i].gravity == "east"){
    						ctx.rotate(-Math.PI / 2);
    						ctx.fillRect(-water[i].height, 0, water[i].height, water[i].width);
    					}
    					
    					break;
    				}
    				default: break;
    			}
    			ctx.restore();
    		}

    		//earth
    		var earthPat = ctx.createPattern(resources.get("./images/earth.png"), "repeat");
		    ctx.fillStyle = earthPat;
		    for (var i = 0; i < scene.static.earth.length; i++) {
			    var earth = scene.static.earth[i];
			    ctx.fillRect(earth.x, earth.y, earth.width, earth.height);
		    }

    		//trans
    		var trans = scene.department.trans;
    		for (var i = 0; i < trans.length; i++) {
    			ctx.save();
    			ctx.translate(trans[i].x, trans[i].y);
    			switch (trans[i].gravity) {
    				case ('east'): {
    					ctx.rotate(-Math.PI / 2);
    					ctx.drawImage(resources.get("./images/trans.png"), 0, 0, 76, 106, 0, 0, -trans[i].height, trans[i].width);
    					break;
    				}
    				case ("south"): {
    					ctx.drawImage(resources.get("./images/trans.png"), 0, 0, 76, 106, 0, 0, trans[i].width, trans[i].height);
    					break;
    				}
    				case ("west"): {
    					ctx.rotate(Math.PI / 2);
    					ctx.drawImage(resources.get('./images/trans.png'), 0, 0, 76, 106, 0, 0, trans[i].height, -trans[i].width);
    					break;
    				}
    				case ("north"): {
    					ctx.rotate(Math.PI);
    					ctx.drawImage(resources.get("./images/trans.png"), 0, 0, 76, 106, 0, 0, -trans[i].width, -trans[i].height);
    					break;
    				}
    				default: break;
    			}
    			ctx.restore();
    		}
    		
    	}
	}

	Maps.prototype.render = function (scene) {
		var ctx = this.ctx;
		var self = this;
		ctx.clearRect(0, 0, self.width, self.height);
		ctx.drawImage(self.staticCanvas, 0, 0, self.width, self.height, 0, 0, self.width, self.height);

		//fire
		var fire = scene.department.torch;
		for (var i = 0; i < fire.length; i++) {
			switch(fire[i].gravity) {
				case ("east"): {
					ctx.save();
				    ctx.translate(fire[i].base.x, fire[i].base.y);
					ctx.rotate(-Math.PI / 2);
					ctx.drawImage(resources.get("./images/fire_base.png"), 0, 0, 71, 86, 0, 0, fire[i].base.height, fire[i].base.width);
					ctx.restore();
					if (fire[i].size == "big") {
						ctx.save();
						ctx.translate(fire[i].fire.x, fire[i].fire.y);
						ctx.rotate(-Math.PI / 2);
						ctx.drawImage(resources.get("./images/fire.png"), 0, 0, 141, 408, 0, 0, fire[i].fire.height, fire[i].fire.width);
						ctx.restore();
					}
					break;
				}
				case ("north"): {
					ctx.save();
				    ctx.translate(fire[i].base.x, fire[i].base.y);
				    ctx.rotate(Math.PI);
					ctx.drawImage(resources.get("./images/fire_base.png"), 0, 0, 71, 86, 0, 0, -fire[i].base.width, -fire[i].base.height);
					ctx.restore();
					if (fire[i].size == "big") {
						ctx.save();
						ctx.translate(fire[i].fire.x, fire[i].fire.y);
						ctx.rotate(Math.PI);
						ctx.drawImage(resources.get("./images/fire.png"), 0, 0, 141, 408, 0, 0, -fire[i].fire.width, -fire[i].fire.height);
						ctx.restore();
					}
					break;
				}
				default: break;
			}
		}

		//jump
        var jump = scene.department.jumpBlock;
    	if (!jump.ing) {
    		ctx.drawImage(resources.get("./images/jumpBoard.png"), 0, 0, 130, 180, jump.x, jump.y, 100, 200);
    	} else {
    		ctx.drawImage(resources.get("./images/jumpAf.png"), 0, 0, 134, 200, jump.x, jump.y - 20, 100, 200);
    	} 

		//spell
		var spell = scene.department.spell;
		for (var i = 0; i < spell.length; i++) {
			if (!spell[i].eat) {
			    var file = "./images/" + spell[i].name + ".png";
    			ctx.drawImage(resources.get(file), 0, 0, 100, 100, spell[i].x, spell[i].y, spell[i].width, spell[i].height);
    		}
		}

		if (scene.order == 2) {
			//book
			var book = scene.department.book;
			for (var i = 0; i < book.length; i++) {
				if (!book[i].eat) {
					ctx.drawImage(resources.get("./images/book.png"), 0, 0, 70, 118, book[i].x, book[i].y, book[i].width, book[i].height);
				}
			}

			//cloud
			var cloud = scene.static.cloud;
			for (var i = 0; i < cloud.length; i++) {
				var rand = cloud[i].rand;
				var width, height;
				switch (rand) {
					case 1: {
						width = 173;
						height = 45;
						break;
					}
					case 2: {
						width = 178;
						height = 55;
						break;
					}
					case 3: {
						width = 162;
						height = 46;
						break;
					}
					case 4: {
						width = 160;
						height = 59;
						break;
					}
					case 5: {
						width = 154;
						height = 54;
						break;
					}
					default: break;
				}
				var file = "./images/cloud_";
				if (cloud[i].poison) {
					file = file + rand + "_poison.png";
				} else {
					file = file + rand + ".png";
				}
				ctx.save();
				ctx.translate(cloud[i].x, cloud[i].y);
				ctx.rotate(Math.PI / 2);
				ctx.drawImage(resources.get(file), 0, 0, width, height, 0, 0, cloud[i].height, cloud[i].width);
				ctx.restore();
			}
			// chainsaw
			var chainsaw = scene.department.chainsaw;
			if (chainsaw.open) {
				var chainPat = ctx.createPattern(resources.get("./images/chain.png"), "repeat");
				ctx.save();
				ctx.fillStyle = chainPat;
				for (var i = 0; i < chainsaw.chain.length; i++) {
					ctx.fillRect(chainsaw.chain[i].x, chainsaw.chain[i].y, chainsaw.chain[i].width, chainsaw.chain[i].height);
				}
				ctx.restore();
				for (var i = 0; i < chainsaw.spike.length; i++) {
					var spike = chainsaw.spike[i];
					ctx.save();
					ctx.translate(spike.x, spike.y);
					switch(spike.gravity) {
						case ("east"): {
							ctx.rotate(-Math.PI / 2);
							ctx.drawImage(resources.get("./images/spike.png"), 0, 0, 40, 50, 0, 0, -spike.width, spike.height);
							break;
						}
						case ("south"): {
							ctx.drawImage(resources.get("./images/spike.png"), 0, 0, 40, 50, 0, 0, spike.width, spike.height);
							break;
						}
						case ("west"): {
							ctx.rotate(Math.PI / 2);
							ctx.drawImage(resources.get("./images/spike.png"), 0, 0, 40, 50, 0, 0, spike.width, spike.height);
							break;
						}
						case ("north"): {
							ctx.rotate(Math.PI);
							ctx.drawImage(resources.get("./images/spike.png"), 0, 0, 40, 50, 0, 0, -spike.width, spike.height);
							break;
						}
						default: break;
					}
					ctx.restore();
				}
			}

			//pulley
			var pulley = scene.department.pulley;
			for (var i = 0; i < pulley.round.length; i++) {
				ctx.drawImage(resources.get("./images/round.png"), 0, 0, 30, 30, pulley.round[i].x, pulley.round[i].y, pulley.round[i].width, pulley.round[i].height);
			}

			ctx.save();
			var ropePat = ctx.createPattern(resources.get("./images/rope.png"), "repeat");
			ctx.fillStyle = ropePat;
			ctx.fillRect(pulley.rope.middle.x, pulley.rope.middle.y, pulley.rope.middle.width, pulley.rope.middle.height);
			ctx.beginPath();
			ctx.arc(2200, 4290, 40, Math.PI * 1.5, Math.PI, true);
			ctx.arc(2200, 4290, 30, Math.PI, Math.PI * 1.5, false);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.arc(3800, 4290, 40, Math.PI * 1.5, 0, false);
			ctx.arc(3800, 4290, 30, 0, -Math.PI / 2, true);
			ctx.closePath();
			ctx.fill();
			if (pulley.rope.left.heavy) {
				ctx.fillRect(pulley.rope.left.x, pulley.rope.left.y, pulley.rope.left.width, pulley.rope.left.height + 300);
				ctx.fillRect(pulley.rope.right.x, pulley.rope.right.y, pulley.rope.right.width, pulley.rope.right.height - 300);
				ctx.drawImage(resources.get("./images/block.png"), 0, 0, 135, 135, pulley.block[0].x, pulley.block[0].y + 300, pulley.block[0].width, pulley.block[0].height);
				ctx.drawImage(resources.get("./images/block.png"), 0, 0, 135, 135, pulley.block[1].x, pulley.block[1].y - 300, pulley.block[1].width, pulley.block[1].height);
			} else if (pulley.rope.right.heavy) {
				ctx.fillRect(pulley.rope.left.x, pulley.rope.left.y, pulley.rope.left.width, pulley.rope.left.height - 300);
				ctx.fillRect(pulley.rope.right.x, pulley.rope.right.y, pulley.rope.right.width, pulley.rope.right.height + 300);
				ctx.drawImage(resources.get("./images/block.png"), 0, 0, 135, 135, pulley.block[0].x, pulley.block[0].y - 300, pulley.block[0].width, pulley.block[0].height);
				ctx.drawImage(resources.get("./images/block.png"), 0, 0, 135, 135, pulley.block[1].x, pulley.block[1].y + 300, pulley.block[1].width, pulley.block[1].height);
			} else {
				ctx.fillRect(pulley.rope.left.x, pulley.rope.left.y, pulley.rope.left.width, pulley.rope.left.height);
				ctx.fillRect(pulley.rope.right.x, pulley.rope.right.y, pulley.rope.right.width, pulley.rope.right.height);
				ctx.drawImage(resources.get("./images/block.png"), 0, 0, 135, 135, pulley.block[0].x, pulley.block[0].y, pulley.block[0].width, pulley.block[0].height);
				ctx.drawImage(resources.get("./images/block.png"), 0, 0, 135, 135, pulley.block[1].x, pulley.block[1].y, pulley.block[1].width, pulley.block[1].height);
			}
			ctx.restore();

			//sting
			var sting = scene.department.sting;
			for (var i = 0; i < sting.length; i++) {
				if (sting[i].open) {
			    	ctx.save();
			    	ctx.translate(sting[i].x, sting[i].y);
    				switch (sting[i].gravity) {
    					case ("east"): {
    						ctx.rotate(-Math.PI / 2);
    						ctx.drawImage(resources.get("./images/sword.png"), 0, 0, 79, 500, 0, 0, -sting[i].height, sting[i].width);
    						break;
    					}
    					case ("south"): {
    						ctx.drawImage(resources.get("./images/sword.png"), 0, 0, 79, 500, 0, 0, sting[i].width, sting[i].height);
    						break;
    					}
    					case ("west"): {
    						ctx.rotate(Math.PI / 2);
    						ctx.drawImage(resources.get("./images/sword.png"), 0, 0, 79, 500, 0, 0, sting[i].height, -sting[i].width);
    						break;
    					}
    					case ("north"): {
    						ctx.rotate(Math.PI);
    						ctx.drawImage(resources.get("./images/sword.png"), 0, 0, 79, 500, -sting[i].width, -sting[i].height, sting[i].width, sting[i].height);
    						break;
    					}
    					default: break;
    				}
    				ctx.restore();
    			}
    		}

    		//poisonRect
    		var poisonRect = scene.department.poisonRect;
    		if (poisonRect.open) {
    			var ring = poisonRect.ring;
    			for (var i = 0; i < ring.length; i++) {
    				if (ring[i].direction == "hor") {
    					ctx.drawImage(resources.get("./images/cloud_2_poison.png"), 0, 0, 216, 105, ring[i].x, ring[i].y, ring[i].width, ring[i].height);
    				} else if (ring[i].direction == "ver") {
    					ctx.save();
    					ctx.translate(ring[i].x, ring[i].y);
    					ctx.rotate(Math.PI / 2);
    					ctx.drawImage(resources.get("./images/cloud_2_poison.png"), 0, 0, 216, 105, 0, -ring[i].width, ring[i].height, ring[i].width);
    					ctx.restore();
    				}
    			}
    		}
    		rand = poisonRect.random;
    		ctx.drawImage(resources.get("./images/earth.png"), 0, 0, 100, 100, poisonRect.block[rand].x, poisonRect.block[rand].y, poisonRect.block[rand].width, poisonRect.block[rand].height);
			
			//changeBlock
			var change = scene.department.changeBlock;
			var spikePat = ctx.createPattern(resources.get("./images/spike.png"), "repeat");
			var rand = Math.random();
			ctx.fillStyle = spikePat;
			if (rand > 0.5) {
				ctx.drawImage(resources.get("./images/earth.png"), 0, 0, 100, 100, change.left.x, change.left.y, change.left.width, change.left.height);
				ctx.fillRect(change.right.x, change.right.y, change.right.width, change.right.height / 2);
				ctx.save();
				ctx.translate(change.right.x, change.right.y + 50);
				ctx.rotate(Math.PI);
				ctx.fillRect(-change.right.width, -change.right.height / 2, change.right.width, change.right.height / 2);
				ctx.restore();
			} else {
				ctx.drawImage(resources.get("./images/earth.png"), 0, 0, 100, 100, change.right.x, change.right.y, change.right.width, change.right.height);
				ctx.fillRect(change.left.x, change.left.y, change.left.width, change.left.height / 2);
				ctx.save();
				ctx.translate(change.left.x, change.left.y + 50);
				ctx.rotate(Math.PI);
				ctx.fillRect(-change.left.width, -change.left.height / 2, change.left.width, change.left.height / 2);
				ctx.restore();
			}
		} else if (scene.order == 1) {
		//control
		    var control = scene.department.control;
    		for (var i = 0; i < control.length; i++) {
    			if (!control[i].controller.cnt) {
    				ctx.save();
    				ctx.translate(control[i].controller.x, control[i].controller.y);
    				switch (control[i].controller.gravity) {
    					case ("west"): {
    						ctx.rotate(Math.PI / 2);
    						ctx.drawImage(resources.get("./images/button.png"), 0, 0, 60, 29, 0, 0, 60, -30);
    						break;
    					}
    					case ("east"): {
    						ctx.rotate(-Math.PI / 2);
    						ctx.drawImage(resources.get("./images/button.png"), 0, 0, 60, 29, 0, 0, -60, 30);
    						break;
    					}
    					default: break;
    				}
    				ctx.restore();
    				var wood = control[i].wooded;
    				ctx.drawImage(resources.get("./images/wood.png"), 0, 0, 25, 163, wood.x, wood.y, wood.width, wood.height);
    			} else {
    				ctx.save();
    				ctx.translate(control[i].controller.x, control[i].controller.y);
    				switch (control[i].controller.gravity) {
    					case ("west"): {
    						ctx.rotate(Math.PI / 2);
    						ctx.drawImage(resources.get("./images/buttonAf.png"), 0, 0, 60, 22, 0, 0, 60, -30);
    						break;
    					}
    					case ("east"): {
    						ctx.rotate(-Math.PI / 2);
    						ctx.drawImage(resources.get("./images/buttonAf.png"), 0, 0, 60, 22, 0, 0, -60, 30);
    						break;
    					}
    					default: break;
    				}
    				ctx.restore();
    			}
    		}    

    		// special
    		var special = scene.department.special;
    		if (!special.button.cnt) {
    			ctx.drawImage(resources.get("./images/button.png"), 0, 0, 60, 29, special.button.x, special.button.y, special.button.width, special.button.height);
    		} else {
    			ctx.drawImage(resources.get("./images/buttonAf.png"), 0, 0, 61, 22, special.button.x, special.button.y + 10, special.button.width, special.button.height - 10);
    			ctx.drawImage(resources.get("./images/glass.png"), 0, 0, 119, 113, special.glass.x, special.glass.y, special.glass.width, special.glass.height);
    			ctx.drawImage(resources.get("./images/trans.png"), 0, 0, 76, 106, special.trans[0].x, special.trans[0].y, special.trans[0].width, special.trans[0].height);
    		}
    		if (!special.skate.check) {
    		    ctx.save();
    		    ctx.translate(90, 890);
    		    ctx.rotate(Math.PI / 2.5);
    		    ctx.drawImage(resources.get("./images/skate.png"), 0, 0, 316, 28, 0, 0, 350, 50);
    		    ctx.drawImage(resources.get("./images/ball.png"), 0, 0, 52, 49, 0, -50, 50, 50);
    		    ctx.restore();
    	    } else {
    	    	ctx.save();
    	    	ctx.translate(200, 925);
    	    	ctx.rotate(Math.PI / 1.65);
    	    	ctx.drawImage(resources.get("./images/skate.png"), 0, 0, 316, 28, 0, 0, 350, 50);
    	    	ctx.drawImage(resources.get("./images/ball.png"), 0, 0, 52, 49, 0, -50, 50, 50);
    	    	ctx.restore();
    	    }
    	    if (!special.R.light) {
    	    	ctx.drawImage(resources.get("./images/block.png"), 0, 0, 135, 135, special.block.x, special.block.y, special.block.width, special.block.height);
    	    }
    	}

	}

	window.Maps = Maps;
})()