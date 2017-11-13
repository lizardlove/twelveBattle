/*/*
* @Author: 10261
* @Date:   2017-07-17 20:19:46
* @Last Modified by:   10261
* @Last Modified time: 2017-08-09 21:22:18
*/

'use strict';
(function () {
	function Role (master) {

		this.MAXTOP = Math.floor(master.view.height * 3 / 10);
		this.MAXBOTTOM = Math.floor(master.view.height * 8 / 10);
		this.MAXRIGHT = Math.floor(master.view.width * 7 / 10);
		this.MAXLEFT = Math.floor(master.view.width * 3 / 10);

		this.VX = 10;
		this.VY = 20;

		this.view = master.view;
		this.ctx = this.view.getContext("2d");

		this.x = master.x;
		this.y = master.y;

		this.width = master.width;
		this.height = master.height;

		this.CX = this.x + this.width / 2;
		this.CY = this.y + this.height / 2;

		this.viewX = Math.floor(master.view.width / 2 - this.width);
		this.viewY = Math.floor(master.view.height * 4 / 5 - this.height);	
		this.gravity = "south";
		this.lastGravity = "south";

		this.top = function () {
			this.move(4);
		};
		this.bottom = function () {
			this.move(3);
		};
		this.right = function () {
			this.move(2);
		}
		this.left = function () {
			this.move(1);
		}

		this.sprite = {
			url: master.sprite.url,
			size: master.sprite.size,
			pos: master.sprite.pos,
			_move: 0,
			run: false,
			img: new Image(),
			frames: master.sprite.frames,
			speed: master.sprite.speed,
			dir: "left",
			stand: true,
			update: function (dt) {
				this._move += this.speed * dt;
			}, 
			render: function (ctx, vx, vy) {
				var frames = 0;
				var self = this;
				self.img.src = self.url;

				if (self.run) {
					var max = self.frames;
					var idx = Math.floor(self._move);
					frames = Math.floor(idx % max);
				}

				var x = self.pos[0];
				var y = self.pos[1];

				if (golbal.master.skill == "mouse") {
					self.img.src = "./images/mouse_sprite.png";
				} else if (golbal.master.skill == "cow") {
					self.img.src = "./images/cow_sprite.png";
				} else if (golbal.master.skill == "rabbit") {
					self.img.src = "./images/rabbit_sprite.png";
				} else if (golbal.master.skill == "horse") {
					self.img.src = "./images/horse_sprite.png";
				} else if (golbal.master.skill == "chicken") {
					self.img.src = "./images/chicken_sprite.png";
				} else {
					self.img.src = "./images/master.png";
				}

				if (self.dir != "jump") {
					x +=frames * self.size[0];
				}

				if (self.dir == "right") {
					y += self.size[1];
				}

				if (golbal.master.grab) {
					y = y + self.size[1] * 2;
				}
				if (!golbal.game) {
					y = self.size[1] * 4;
					x = self.size[0] * 4;
					ctx.drawImage(self.img, x, y, 300, self.size[1], vx, vy, 100, 100);
				} else {
					ctx.drawImage(self.img, x, y, self.size[0], self.size[1], vx, vy, 100, 100);
				}
			}
		};

		this.jumpMax = 250;
		this.isJumping = false;
		this.jumpDirection = "UP";
		this.jumpHeight = 0;

		this.direction = 0;

		this.skill = null;
		this.skillTimeout = 0;
		this.skillStatus = {
			mouse: true,
			cow: true,
			rabbit: true,
			horse: true,
			chicken: true
		}
		this.skillBox = [];

		this.grab = false;

	}
	Role.prototype.mouse = function () {
		var self = this;
		if (self.skillStatus.mouse) {
    		self.skill = "mouse";
    		self.skillStatus.mouse = false;
    		$("#skillBox .skill").each(function () {
    			console.log($(this).data("name"));
    			if ($(this).data("name") == "mouse") {
    				$(this).empty();
    			}
    		});
    		if (self.skillTimeout) {
    			clearTimeout(self.skillTimeout);
    		}
    		self.skillTimeout = setTimeout(function () {
    			self.skill = null;
    		}, 5000);
    		setTimeout(function () {
    			self.skillStatus.mouse = true;
    			$("#skillBox .skill").each(function () {
    				console.log($(this).data("name"));
    			    if ($(this).data("name") == "mouse") {
    			    	console.log("xxxxxxxxx");
    				    $(this).append("<img src='./images/mouse.png'>");
    			    }
    		    });
    		}, 10000);
    	}
	}

	Role.prototype.cow = function () {
		var self = this;
		if (self.skillStatus.cow) {
    		self.skill = "cow";
    		self.skillStatus.cow = false;
    		$("#skillBox .skill").each(function () {
    			if ($(this).data("name") == "cow") {
    				$(this).empty();
    			}
    		});
    		if (self.skillTimeout) {
    			clearTimeout(self.skillTimeout);
    		}
    		self.skillTimeout = setTimeout(function () {
    			self.skill = null;
    		}, 10000);
    		setTimeout(function () {
    			self.skillStatus.cow = true;
    			$("#skillBox .skill").each(function () {
    			    if ($(this).data("name") == "cow") {
    				    $(this).append("<img src='./images/cow.png'>");
    			    }
    		    });
    		}, 30000);
    	}
	}

	Role.prototype.rabbit = function () {
		var self = this;
		if (self.skillStatus.rabbit) {
    		self.skill = "rabbit";
    		self.skillStatus.rabbit = false;
    		$("#skillBox .skill").each(function () {
    			if ($(this).data("name") == "rabbit") {
    				$(this).empty();
    			}
    		});
    		if (self.skillTimeout) {
    			clearTimeout(self.skillTimeout);
    		}
    		self.skillTimeout = setTimeout(function () {
    			self.skill = null;
    			self.jumpMax = 250;
    		}, 8000);
    		setTimeout(function () {
    			self.skillStatus.rabbit = true;
    			$("#skillBox .skill").each(function () {
    			    if ($(this).data("name") == "rabbit") {
    				    $(this).append("<img src='./images/rabbit.png'>");
    			    }
    		    });
    		}, 16000);
    	}
	}

	Role.prototype.horse = function () {
		var self = this;
		if (self.skillStatus.horse) {
    		self.skill = "horse";
    		self.skillStatus.horse = false;
    		$("#skillBox .skill").each(function () {
    			if ($(this).data("name") == "horse") {
    				$(this).empty();
    			}
    		});
    		if (self.skillTimeout) {
    			clearTimeout(self.skillTimeout);
    		}
    		self.skillTimeout = setTimeout(function () {
    			self.skill = null;
    		}, 8000);
    		setTimeout(function () {
    			self.skillStatus.horse = true;
    			$("#skillBox .skill").each(function () {
    			    if ($(this).data("name") == "horse") {
    				   $(this).append("<img src='./images/horse.png'>");
    			    }
    		    });
    		}, 16000);
    	}
	}
	Role.prototype.chicken = function () {
		this.skill = "chicken";
	}

	Role.prototype.skillJudge = function () {
		var self = this;
		self.VX = 10;
		self.VY = 20;
		switch (self.skill) {
			case ("mouse"): {
				break;
			}
			case ("cow"): {
				break;
			}
			case ("chicken"): {
				self.VY = 5;
				self.VX = 5;
				break;
			}
			case ("horse"): {
				self.VX = 20;
				break;
			}
			case ("rabbit"): {
				self.jumpMax = 500;
				break;
			}
			default: break;
		}
	}
	Role.prototype.move = function (jud) {

		var L;

		switch (jud) {
			case 1: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VX;
				} else {
					L = this.VY;
				}
				this.x = this.x < golbal.map.width ? this.x + L : this.x;
				this.CX = this.CX < golbal.map.width ? this.CX + L : this.CX;
				break;
			}
			case 2: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VX;
				} else {
					L = this.VY;
				}
				this.x = this.x - L > 0 ? this.x - L : this.x;
				this.CX = this.CX - L > 0 ? this.CX - L : this.CX;
				break;
			}
			case 3: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VY;
				} else {
					L = this.VX;
				}
				this.y = this.y < golbal.map.height ? this.y + L : this.y;
				this.CY = this.CY < golbal.map.height ? this.CY + L : this.CY;
				break;
			}
			case 4: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VY;
				} else {
					L = this.VX;
				}
				this.y = this.y - L> 0 ? this.y - L : this.y;
				this.CY = this.CY - L> 0 ? this.CY - L : this.CY;
				break;
			}
			default: break;
		}
	}

	Role.prototype.flip = function () {
		var self = this;

		function flipChange(top, bottom, left, right) {
			self.top = function () {
				self.move(top);
			};
			self.bottom = function () {
				self.move(bottom);
			};
			self.right = function () {
				self.move(right);
			};
			self.left = function () {
				self.move(left);
			}
		}

		switch (self.gravity) {
			case ("east"): {
				flipChange(2, 1, 3, 4);
				this.x = this.CX - this.height / 2;
				this.y = this.CY + this.width / 2;
				this.viewX = golbal.view.y + golbal.view.width - self.y;
				this.viewY = self.x - golbal.view.x;

				break;
			}
			case ("south"): {
				flipChange(4, 3, 2 ,1);
				this.x = this.CX - this.width / 2;
				this.y = this.CY - this.height / 2;
				this.viewX = this.x - golbal.view.x;
				this.viewY = this.y - golbal.view.y;
				break;
			}
			case ("west"): {
				flipChange(1, 2, 4, 3);
				this.x = this.CX + this.height / 2;
				this.y = this.CY - this.width / 2;
				this.viewY = golbal.view.x + golbal.view.height - this.x;
				this.viewX = this.y - golbal.view.y;
				break;
			}
			case ("north"): {
				flipChange(3, 4, 1, 2);
				this.x = this.CX + this.width / 2;
				this.y = this.CY + this.height / 2;
				this.viewX = golbal.view.x + golbal.view.width - this.x;
				this.viewY = golbal.view.y + golbal.view.height - this.y;
				break;
			}
			default: break;
		}
	}

	Role.prototype.moveRight = function () {
		var self = this;
		console.log('moveright');
		self.sprite.run = true;
		
		if (self.viewX < self.MAXRIGHT && !golbal.collisions[1]) {
			self.right();
			self.viewX += self.VX;
			self.sprite.dir = "right";
		} else if (!golbal.collisions[1]) {
			golbal.view.right();
			self.right();
			self.sprite.dir = "right";
		}
		if (!golbal.collisions[2]) {
			self.sprite.dir = "jump";
			self.jumpDirection = "DOWN";
			self.isJumping = true;
			if (self.viewY + self.height > self.MAXBOTTOM) {
				golbal.view.bottom();
			} else {
				self.viewY += self.VY;
			}
			self.bottom();
		} else {
			self.isJumping = false;
			self.jumpHeight = 0;
		}
	}

	Role.prototype.moveLeft = function () {
		var self = this;
		console.log("moveleft")
		self.sprite.run = true;

		if (self.viewX > self.MAXLEFT && !golbal.collisions[3]) {
			self.left();
			self.viewX -= self.VX;
			self.sprite.dir = "left";
		} else if (!golbal.collisions[3]) {
			golbal.view.left();
			self.left();
			self.sprite.dir = "left";
		}
		if (!golbal.collisions[2]) {
			self.sprite.dir = "jump";
			self.jumpDirection = "DOWN";
			self.isJumping = true;
			if (self.viewY + self.height > self.MAXBOTTOM) {
				golbal.view.bottom();
			} else {
				self.viewY += self.VY;
			}
			self.bottom();
		} else {
			self.isJumping = false;
			self.jumpHeight = 0;
			self.jumpDirection = "UP";
		}
	}

	Role.prototype.jump = function () {
		var self = this;
		self.isJumping = true;
		self.sprite.run = true;
		console.log("jump");

		if (self.jumpDirection == "UP") {
			if (self.jumpHeight < self.jumpMax && !golbal.collisions[0]) {
				self.top();
				self.jumpHeight += self.VY;
				if (self.viewY > self.MAXTOP) {
					self.viewY -= self.VY;
				} else {
					golbal.view.top();
				}
			} else {
				self.jumpDirection = "DOWN";
			}
		} else {
			if (!golbal.collisions[2]) {
				self.bottom();
				if (self.viewY + self.height > self.MAXBOTTOM) {
					golbal.view.bottom();
				} else {
					self.viewY += self.VY;
				}
			} else {
				self.isJumping = false;
				self.jumpDirection = "UP";
				self.jumpHeight = 0;
			} 
		}

		if (golbal.rightDown) {
			if (self.viewX < self.MAXRIGHT && !golbal.collisions[1]) {
				self.right();
				self.viewX += self.VX;
				self.sprite.dir = "right";
			} else if (!golbal.collisions[1]) {
				golbal.view.right();
				self.right();
				self.sprite.dir = "right";
			}
		} else if (golbal.leftDown) {
			if (self.viewX > self.MAXLEFT && !golbal.collisions[3]) {
				self.left();
				self.viewX -= self.VX;
				self.sprite.dir = "left";
			} else if (!golbal.collisions[3]) {
				golbal.view.left();
				self.left();
				self.sprite.dir = "left";
			}
		}
	}

	Role.prototype.stand = function () {
		var self = this;

		if (!golbal.collisions[2]) {
			self.bottom();
			self.jumpDirection = "DOWN";
			
			if (self.viewY + self.height > self.MAXBOTTOM) {
				golbal.view.bottom();
				
			} else {
				self.viewY += self.VY;
			}
			
		} else if (self.isJumping) {
			self.jumpHeight = 0;
			self.jumpDirection = "UP";
			self.isJumping = false;
		} else if (!golbal.rightDown && !golbal.leftDown) {
			self.sprite.run = false;
			self.isJumping = false;
			self.jumpHeight = 0;
		}
	}

	Role.prototype.draw = function () {
		var self = this;
		var ctx = self.ctx;

		self.sprite.render(ctx, self.viewX, self.viewY);

	}
	window.Role = Role;
})()