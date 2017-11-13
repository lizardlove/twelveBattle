/*
* @Author: 10261
* @Date:   2017-07-18 19:15:03
* @Last Modified by:   10261
* @Last Modified time: 2017-08-09 21:13:50
*/

'use strict';
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();
function getSpell(name) {
	var spellText = {
    	mouse: ["恭喜！获得子鼠之力", "————水月洞天", "使用鼠符咒时能变换为鼠形态，可以挖掘通过特定的隧道。   持续时间： 5s   冷却时间：10s"],
    	cow: ["恭喜！获得丑牛之力", "————坚韧不屈", "使用牛符咒时能变换为牛形态，可无视一些陷阱伤害。   持续时间：10s    冷却时间： 30s"],
    	rabbit: ["恭喜！获得卯兔之力", "————空中跃步", "使用兔符咒时能变换为兔形态，弹跳持续力增强，跳得更高。   持续时间：8s   冷却时间：16s"],
    	horse: ["恭喜！获得午马之力", "————策马奔腾", "使用马符咒时能变换为马形态，移动处于奔腾状态，跑得更快，跳得更远。   持续时间：8s   冷却时间：16s"],
    	chicken: ["恭喜！获得酉鸡之力", "————凌云之志", "使用鸡符咒时能变换为鸡形态，跳跃或移动状态实现凌空。   无冷却"]
    }
	$("#dialogue").css("display", "block");
	$($("#dialogue p")[0]).html(spellText[name][0]);
	$($("#dialogue p")[1]).html(spellText[name][1]);
	$($("#skillDet p")[0]).html(spellText[name][2]);
	var text = "<div class='skill' data-name='"+ name + "'><img src='./images/" + name + ".png'></div>";
	$("#skillBox").append(text);
}
var audio = new Audio();
var loopAudio = new Audio();
var fireAudio = new Audio();
var elecAudio = new Audio();
elecAudio.loop = true;
fireAudio.loop = true;
fireAudio.src = "./music/fire.wav";
elecAudio.src = "./music/elec.wav";
loopAudio.loop = true;

function loopAudioLoad(url) {
	loopAudio.src = url;
	loopAudio.play();
}
function audioLoad(url) {
	audio.src = url;
	audio.play();
}

loopAudioLoad("./music/BG.wav");
var golbal = {
	upDown: false,
	rightDown: false,
	leftDown: false,
	specialDown: false,
	leftFlip: false,
	rightFlip: false,
	reverseFlip: false,
	skillOne: false,
	skillTwo: false,
	skillThree: false,
	map: {},
	order: 2,
	book: 3,
	width: 0,
	height: 0,
	view: {},
	master: {},
	game: true,
	next: false,
	flip: false,
	lastTime: Date.now(),
	direction: 0,
	collisions: [false, false, false, false],
	scene: {
		static: {
			live: [{
				x: 300,
				y: 300,
				width: 600,
				height: 50
			}, {
				x: 300,
				y: 800,
				width: 600,
				height: 50
			}, {
				x: 300,
				y: 350,
				width: 50,
				height: 500
			}, {
				x: 850,
				y: 350,
				width: 50,
				height: 500
			}]
		}
	},
	init: function () {
		var self = this;
		$.ajax({
			type: "POST",
			url: "/map",
			data: {
				order: self.order
			},
			async: false,
			success: function (data) {
				var data = JSON.parse(data);
				console.log(data);
				self.scene = data;
			}
		})
		var bg = $("#bg")[0];
		var master = $("#master")[0];
		var WIDTH = $(window).width();
		var HEIGHT = $(window).height();
		self.width = WIDTH;
		self.height = HEIGHT;
		bg.width = WIDTH;
		bg.height = HEIGHT;
		master.width = WIDTH;
		master.height = HEIGHT;
		self.lastTime = Date.now();
		self.map = new Maps({
			width: self.scene.width,
			height: self.scene.height,
			scene: self.scene
		});
		self.map.render(self.scene);
		loopAudio.pause();
		setInterval(function () {
			for (var i = 0; i < self.scene.department.torch.length; i++) {
				if (self.scene.department.torch[i].size == "big") {
					self.scene.department.torch[i].size = "small";
				} else {
					self.scene.department.torch[i].size = "big";
				}
			}
			if (self.scene.order == 2) {
				self.scene.department.poisonRect.open = !self.scene.department.poisonRect.open;
				self.scene.department.chainsaw.open = !self.scene.department.chainsaw.open;
				self.scene.department.sting.forEach(function (v) {
					var rand = Math.random();
					if (rand > 0.5) {
						v.open = true;
					} else {
						v.open = false;
					}
				});
				self.scene.department.changeBlock.rand = Math.random();
				self.scene.static.cloud.forEach(function (v) {
					var rand = Math.random();
					v.rand = Math.floor(Math.random() * 5) + 1;
					if (rand < 0.2) {
						v.poison = true;
					} else {
						v.poison = false;
					}
				});
			}
			self.map.re = true;
		}, 2000);
		setInterval(function () {
			self.map.re = true;
		}, 1000);
		self.master = new Role({
			x: self.scene.x,
			y: self.scene.y,
			view: master,
			width: 100,
			height: 100,
			sprite: {
				url: "./images/master.png",
				size: [225, 210],
				pos: [0, 0],
				frames: 8,
				speed: 4
			}
		});
		self.view = new Views({
			canvas:bg,
			x: Math.floor(self.master.x + self.master.width - WIDTH / 2), 
			y: Math.floor(self.master.y + self.master.height - HEIGHT * 4 / 5)
		});
		$("body").keydown(function (e) {
			var key = e.which;
			if (key == 87) {
				self.upDown = true;
			} else if (key == 65) {
				self.leftDown = true;
			} else if (key == 68) {
				self.rightDown = true;
			} else if (key == 74) {
				self.leftFlip = true;
			} else if (key == 73) {
				self.reverseFlip = true;
			} else if (key == 76) {
				self.rightFlip = true;
			} else if (key == 83) {
				self.specialDown = true;
			} else if (key == 49) {
				self.skillOne = true;
			} else if (key == 50) {
				self.skillTwo = true;
			} else if (key == 51) {
				self.skillThree = true;
			} else if (key == 52) {
				self.skillFour = true;
			} else if (key == 53) {
				self.skillFive = true;
			}
		});
		$("body").keyup(function (e) {
			var key = e.which;
			if (key == 87) {
				self.upDown = false;
			} else if (key == 65) {
				self.leftDown = false;
			} else if (key == 68) {
				self.rightDown = false;
			} else if (key == 74) {
				self.leftFlip = false
			} else if (key == 73) {
				self.reverseFlip = false;
			} else if (key == 76) {
				self.rightFlip = false;
			} else if (key == 83) {
				self.specialDown = false;
			}else if (key == 49) {
				self.skillOne = false;
			} else if (key == 50) {
				self.skillTwo = false;
			} else if (key == 51) {
				self.skillThree = false;
			} else if (key == 52) {
				self.skillFour = false;
			} else if (key == 53) {
				self.skillFive = false;
			}
		});
		self.update();
	},
	update: function () {
		var self = this;
		var now = Date.now();
		var dt = (now - self.lastTime) / 1000.0;
		var direction = ["south", "west", "north", "east"];
		if (self.skillOne) {
			if (self.master.skillBox[0]) {
				self.master[self.master.skillBox[0]]();
			}
		} else if (self.skillTwo) {
			if (self.master.skillBox[1]) {
				self.master[self.master.skillBox[1]]();
			}
		} else if (self.skillThree) {
			if (self.master.skillBox[2]) {
				self.master[self.master.skillBox[2]]();
			}
		} else if (self.skillFour) {
			if (self.master.skillBox[3]) {
				self.master[self.master.skillBox[3]]();
			}
		} else if (self.skillFive) {
			if (self.master.skillBox[4]) {
				self.master[self.master.skillBox[4]]();
			}
		}
		self.master.skillJudge();
		function delayFlip() {
			self.flip = true;
			setTimeout(function () {
				self.flip = false;
			}, 1000);
		}
		if (!self.flip) {
			if (self.leftFlip) {
				self.direction ++;
				if (self.direction > 3) self.direction -= 4;
				delayFlip();
				audioLoad("./music/flip.wav");
			}
			if (self.reverseFlip) {
				self.direction += 2;
				if (self.direction > 3) self.direction -= 4;
				delayFlip();
				audioLoad("./music/flip.wav");
			}
			if (self.rightFlip) {
				self.direction --;
				if (self.direction < 0) self.direction += 4;
				delayFlip();
				audioLoad("./music/flip.wav");
			}
			self.master.lastGravity = self.master.gravity;
			self.view.lastGravity = self.view.gravity;
			self.view.gravity = direction[self.direction];
			self.master.gravity = direction[self.direction];
			self.view.flip();
			self.master.flip();
		}
		self.master.sprite.update(dt);
		// console.log(self.collisions);
		self.checkCollisions();
		if (self.upDown) {
			self.master.jump();
			if (!loopAudio.paused) {
				loopAudio.pause();
			}
		} else if (self.rightDown) {
			self.master.moveRight();
			if (loopAudio.paused) {
				loopAudio.play();
			}
		} else if (self.leftDown) {
			self.master.moveLeft();
			if (loopAudio.paused) {
				loopAudio.play();
			}
		} else {
			self.master.stand();
			if (!loopAudio.paused) {
				loopAudio.pause();
			}
		}
		self.clear();
		if (self.map.re) {
			self.map.render(self.scene);
			self.map.re = false;
		}
		self.master.draw();
		self.view.render(self.map);
		if (self.book == 4) {
			self.next = true;
		}
		if (self.game) {
			if (!self.next) {
				requestAnimFrame(function () {
					self.update();
			    });
		    } else {
		    	self.die(false);
		    	audioLoad("./music/goal.wav");
		    }
		} else {
			self.die(true);
			audioLoad("./music/death.wav");
		}
	},
	checkCollisions: function () {
		var self = this;
		var mEast, mWest, mSouth, mNorth;
		var boxPoint, deathPoint;
		var live = [], death = [], box = [];
		var e, w, s, n;
		if (self.view.gravity == "east" || self.view.gravity == "west") {
			e = self.view.x + self.view.height;
			w = self.view.x;
			s = self.view.y + self.view.width;
			n = self.view.y;
		} else {
			e = self.view.x + self.view.width;
			w = self.view.x;
			s = self.view.y + self.view.height;
			n = self.view.y;
		}
		this.collisions = [false, false, false, false];
		switch (self.master.gravity) {
			case ("east"): {
				mEast = self.master.x + self.master.height;
				mWest = self.master.x;
				mSouth = self.master.y;
			    mNorth = self.master.y - self.master.width;
				break;
			}
			case ("south"): {
				mEast = self.master.x + self.master.width;
			    mWest = self.master.x;
				mNorth = self.master.y;
			    mSouth = self.master.y + self.master.height;
				break;
			}
			case ("west"): {
				mEast = self.master.x;
				mWest = self.master.x - self.master.height;
				mNorth = self.master.y;
				mSouth = self.master.y + self.master.width;
				break;
			}
			case ("north"): {
				mEast = self.master.x;
				mWest = self.master.x - self.master.width;
				mSouth = self.master.y;
				mNorth = self.master.y - self.master.height;
				break;
			}
			default: break;
		}
		function check(mEast, mWest, mSouth, mNorth, block, gravity) {
			var col = [false, false, false, false];
			for (var i = 0; i < block.length; i++) {
				var item = block[i],
				    iNorth = item.y,
				    iSouth = item.y + item.height,
				    iEast = item.x + item.width,
				    iWest = item.x;
				switch (gravity) {
   					case ("east"): {
   						if (mWest - 20 < iEast && mEast > iWest && mNorth < iSouth && mSouth > iNorth) {
   							col[0] = true;
   						}
   						if (mNorth - 10 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
   							col[1] = true;
   						}
   						if (mEast + 20 > iWest && mWest < iEast && mSouth > iNorth && mNorth < iSouth) {
   							col[2] = true;
   						}
   						if (mSouth + 10 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
   							col[3] = true;
   						}
   						break;
   					}
   					case ("south"): {
   						if (mNorth - 20 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
   							col[0] = true;
   						} 
   						if (mEast + 10 > iWest && mWest < iEast && mNorth < iSouth && mSouth > iNorth) {
   							col[1] = true;
   						} 
   						if (mSouth + 20 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
   							col[2] = true;
   						}
   						if (mWest - 10 < iEast && mEast > iWest && mNorth < iSouth && mSouth > iNorth) {
   							col[3] = true;
   						}
   						break;
   					}
   					case ("west"): {
   						if (mEast + 20 > iWest && mWest < iEast && mSouth > iNorth && mNorth < iSouth) {
   							col[0] = true;
   						}
   						if (mSouth + 10 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
   							col[1] = true;
   						}
   						if (mWest - 20 < iEast && mEast > iWest && mSouth > iNorth && mNorth < iSouth) {
   							col[2] = true;
   						}
   						if (mNorth - 10 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
   							col[3] = true;
   						}
   						break;
   					}
   					case ("north"): {
   						if (mSouth + 20 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
   							col[0] = true;
   						}
   						if (mWest - 10 < iEast && mEast > iWest && mSouth > iNorth && mNorth < iSouth) {
   							col[1] = true;
   						}
   						if (mNorth - 20 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
   							col[2] = true;
   						}
   						if (mEast + 10 > iWest && mWest < iEast && mSouth > iNorth && mNorth < iSouth) {
   							col[3] = true;
   						}
   						break;
   					}
   					default: break;
   				}
			}
			return col;
		}

		//fire music
		box = [];
		self.scene.department.torch.forEach(function (v) {
			box.push(v.fire);
		});
		boxPoint = check(e, w, s, n, box, self.view.gravity);
		boxPoint.forEach(function (v) {
			if (v) {
				if (fireAudio.paused) {
					fireAudio.play();
				}
			}
		})
		if (boxPoint == [false, false, false, false]) {
			if (!fireAudio.paused) {
				fireAudio.pause();
			}
		}
		//jumpBlock
   		box = [];
		box.push(self.scene.department.jumpBlock);
		boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
		if (self.master.gravity === "south" && boxPoint[2]) {
			self.master.jumpMax = 1000;
			self.master.jumpDirection = "UP";
			self.master.jumpHeight = 0;
			self.upDown = true;
			self.map.re = true;
			self.master.jump();
			audioLoad("./music/jumpBlock.wav");
			setTimeout(function () {
				self.upDown = false;
				self.master.jumpMax = 250;
			}, 1000);
		} else {
			for (var i = 0; i < boxPoint.length; i++) {
				if (boxPoint[i]) {
					this.collisions[i] = true;
				}
			}
		}

		//spell
		self.scene.department.spell.forEach(function (v) {
			if (!v.eat) {
				box = [];
				box.push(v);
				boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
				boxPoint.forEach(function (z) {
					if (z) {
						self.master.skillBox.push(v.name);
						v.eat = true;
						getSpell(v.name);
						audioLoad("./music/spell.wav");
					}
				});
			}
		});
		if (self.scene.order == 1) {

			//elec music
			box = [];
   			self.scene.static.electric.forEach(function (v) {
   				box.push(v);
   			})
   			boxPoint = check(e, w, s, n, box, self.view.gravity);
   			boxPoint.forEach(function (v) {
   				if (v) {
   					if (elecAudio.paused) {
   						elecAudio.play();
   					}
   				} 
   			})
   			if (boxPoint == [false, false, false, false]) {
   				elecAudio.pause();
   			}

   			//live
		    live = [];    
   			for (var i = 0; i < self.scene.static.block.length; i++) {
   				live.push(self.scene.static.block[i]);
   			}
   			live.push(self.scene.static.cage);
   			for (var i = 0; i < self.scene.department.control.length; i++) {
   				if (!self.scene.department.control[i].controller.cnt) {
   					live.push(self.scene.department.control[i].wooded);
   				}
   			}
   			if (!self.scene.department.special.R.light) {
   				live.push(self.scene.department.special.block);
   			}
   			if (self.master.skill != "mouse") {
   				for (var i = 0; i < self.scene.department.mouse.length; i++) {
   					live.push(self.scene.department.mouse[i]);
   				}
   			}    
   			// death block
   			death = [];
   			self.scene.static.fog.forEach(function (e) {
   				death.push(e);
   			});
   			self.scene.static.spike.forEach(function (e) {
   				death.push(e);
   			});
   			self.scene.static.electric.forEach(function (e) {
   				death.push(e);
   			});
   			for (var i = 0; i < self.scene.department.torch.length; i++) {
   				var index = self.scene.department.torch[i];
   				if (index.size === "big") {
   					death.push(index.fire);
   				}
   			}			    
   			this.collisions = check(mEast, mWest, mSouth, mNorth, live, self.master.gravity);
   			deathPoint = check(mEast, mWest, mSouth, mNorth, death, self.master.gravity);
   			for (var i = 0; i < deathPoint.length; i++) {
   				if (deathPoint[i]) {
   					if (self.master.skill != "cow") {
   						self.game = false;
   					}
   					// self.game = false;
   				}
   			}    
   			//control
   			for (var i = 0; i < self.scene.department.control.length; i++) {
   				if (!self.scene.department.control[i].controller.cnt) {
   				    box = [];
   				    box.push(self.scene.department.control[i].controller);
   				    boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   				    for (var j = 0; j < boxPoint.length; j++) {
   					    if (boxPoint[j]) {
   						    self.scene.department.control[i].controller.cnt = true;
   						    audioLoad("./music/button.wav");
   						    self.map.re = true;
   					    }
   				    }
   				}
   			}    
       
   			//special
   			box = [];
   			box = self.scene.department.special.skate.block;
   			boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			if (self.master.gravity === "west" && boxPoint[2]) {
   				if (self.master.CY > 1075 && self.master.CY < 1250) {
   					self.scene.department.special.skate.check = true;
   					self.scene.department.special.R.light = true;
   					if (self.leftDown) {
   					    self.master.x = self.master.x + 5;
   					    self.master.CX = self.master.CX + 5;
   					    self.master.viewX = self.master.viewX + 5;
   				    } else if (self.rightDown) {
   				    	self.master.x = self.master.x - 5;
   					    self.master.CX = self.master.CX - 5;
   					    self.master.viewX = self.master.viewX - 5;
   				    }
   					if (self.leftDown) {
   					    self.master.x = self.master.x + 5;
   					    self.master.CX = self.master.CX + 5;
   					    self.master.viewX = self.master.viewX + 5;
   				    } else if (self.rightDown) {
   				    	self.master.x = self.master.x - 5;
   					    self.master.CX = self.master.CX - 5;
   					    self.master.viewX = self.master.viewX - 5;
   				    }
   				}
   				else if (self.master.CY > 900 && self.master.CY < 1075) {
   					self.scene.department.special.skate.check = false;
   					if (self.leftDown) {
   					    self.master.x = self.master.x - 5;
   					    self.master.CX = self.master.CX - 5;
   					    self.master.viewX = self.master.viewX - 5;
   				    } else if (self.rightDown) {
   				    	self.master.x = self.master.x + 5;
   					    self.master.CX = self.master.CX + 5;
   					    self.master.viewX = self.master.viewX + 5;
   				    }
   				}
   				self.collisions[2] = true;
   				if (audio.paused) {
   					audioLoad("./music/light.wav");
   				}
   				self.map.re = true;
   			} else {
   				self.scene.department.special.skate.check = false;
   			}
   			box = [];
   			box.push(self.scene.department.special.button);
   			boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			if (self.scene.department.special.R.light) {
   				for (var i = 0; i < boxPoint.length; i++) {
   					if (boxPoint[i]) {
   						self.scene.department.special.button.cnt = true;
   						audioLoad("./music/button.wav");
   						self.map.re = true;
   					}
   				}
   			}    
   			//trans
   			box = [];
   			box.push(self.scene.department.special.trans[0]);
   			boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			if (self.scene.department.special.button.cnt) {
   				for (var i = 0; i < boxPoint.length; i++) {
   					if (boxPoint[i]) {
   						if (self.scene.department.special.trans[0].T) {
       						self.master.y = self.master.y - 800;
       						self.master.CY = self.master.CY - 800;
       						self.view.y = self.view.y - 800;
       						self.view.CY = self.view.CY - 800;
       						self.scene.department.special.trans[1].T = false;
       						audioLoad("./music/trans.wav");
       						setTimeout(function () {
       							self.scene.department.special.trans[1].T = true;
       						}, 2000);
       					}
   					}
   				}
   			}    
   			//trans
   			box = [];
   			box.push(self.scene.department.special.trans[1]);
   			boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			if (self.scene.department.special.button.cnt) {
   				for (var i = 0; i < boxPoint.length; i++) {
   					if (boxPoint[i]) {
   						if (self.scene.department.special.trans[1].T) {
       						self.master.y = self.master.y + 800;
       						self.master.CY = self.master.CY + 800;
       						self.view.y = self.view.y + 800;
       						self.view.CY = self.view.CY + 800;
       						self.scene.department.special.trans[0].T = false;
       						audioLoad("./music/trans.wav");
       						setTimeout(function () {
       							self.scene.department.special.trans[0].T = true;
       						}, 2000);
       					}
   					}
   				}
   			}
   			
   			//bar
   			box = [];
   			box = self.scene.static.bar;
   			boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			if (boxPoint[0]) {
   				if (!self.specialDown) {
   					self.collisions[2] = true;
   					self.master.grab = true;
   				}
   				 else {
   					self.master.grab = false;
   				}
   			}	    
   			//goal
   			box = self.scene.static.goal;	
   			boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			for (var i = 0; i < boxPoint.length; i++) {
   				if (boxPoint[i]) {
   					self.next = true;
   				}
   			}

   		} else if (self.scene.order == 2) {
   			//department
   		
   			//book
   			self.scene.department.book.forEach(function (v) {
   				if (!v.eat) {
   					box = [];
   					box.push(v);
   					boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   					boxPoint.forEach(function (z) {
   						if (z) {
   							self.book ++;
   							v.eat = true;
   							audioLoad("./music/spell.wav");
   						}
   					});
   				}
   			});
   			//trans
   			self.scene.department.trans.forEach(function (v) {
   				if (v.run && v.gravity == self.master.gravity) {
   					box = [];
   					box.push(v);
   					boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   					boxPoint.forEach(function (z) {
   						if (z) {
   							audioLoad("./music/trans.wav");
   							console.log(v.gravity);
   							switch (v.gravity) {
   								case ("east"): {
   									self.master.x = self.master.x - 5600;
   									self.master.y = self.master.y - 5200;
   									self.master.CX = self.master.x + self.master.height / 2;
   									self.master.CY = self.master.y - self.master.width / 2;
   									self.view.x = self.view.x - 5600;
   									self.view.CX = self.view.x + self.view.height / 2;
   									self.view.y = self.view.y - 5200;
   									self.view.CY = self.view.y + self.view.width / 2;
   									self.scene.department.trans[2].run = false;
   									setTimeout(function () {
   										self.scene.department.trans[2].run = true;
   									}, 1000);
   									break;
   								}
   								case ("south"): {
   									self.master.x = self.master.x - 5200;
   									self.master.y = self.master.y - 5600;
   									self.master.CX = self.master.x + self.master.width / 2;
   									self.master.CY = self.master.y + self.master.height / 2;
   									self.view.x = self.view.x - 5200;
   									self.view.CX = self.view.x + self.view.width / 2;
   									self.view.y = self.view.y - 5600;
   									self.view.CY = self.view.y + self.view.height / 2;
   									self.scene.department.trans[1].run = false;
   									setTimeout(function () {
   										self.scene.department.trans[1].run = true;
   									}, 1000);
   									break;
   								}
   								case ("west"): {
   									self.master.x = self.master.x + 5600;
   									self.master.y = self.master.y + 5200;
   									self.master.CX = self.master.x - self.master.height / 2;
   									self.master.CY = self.master.y + self.master.width / 2;
   									self.view.x = self.view.x + 5600;
   									self.view.CX = self.view.x + self.view.height / 2;
   									self.view.y = self.view.y + 5200;
   									self.view.CY = self.view.y + self.view.width / 2;
   									self.scene.department.trans[3].run = false;
   									setTimeout(function () {
   										self.scene.department.trans[3].run = true;
   									}, 2000);
   									break;
   								}
   								case ("north"): {
   									self.master.x = self.master.x + 5200;
   									self.master.y = self.master.y + 5600;
   									self.master.CX = self.master.x - self.master.width / 2;
   									self.master.CY = self.master.y - self.master.height / 2;
   									self.view.x = self.view.x + 5200;
   									self.view.y = self.view.y + 5600;
   									self.view.CX = self.view.x + self.view.width / 2;
   									self.view.CY = self.view.y + self.view.height / 2;
   									self.scene.department.trans[0].run = false;
   									setTimeout(function () {
   										self.scene.department.trans[0].run = true;
   									}, 1000);
   									break;
   								}
   								default: break;
   							}
   						}
   					})
   				}
   			})
   			//pulley
   			
   			box = [];
   			var O = new Object();
   			O.x = self.scene.department.pulley.block[0].x;
   			O.y = self.scene.department.pulley.block[0].y;
   			O.width = self.scene.department.pulley.block[0].width;
   			O.height = self.scene.department.pulley.block[0].height + 300;
   			box.push(O);
  			    boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			if (self.master.gravity == "south" && boxPoint[2]) {
   				self.scene.department.pulley.rope.left.heavy = true;
   			} else {
   				self.scene.department.pulley.rope.left.heavy = false;
   			}
   			box = [];
   			var O = new Object();
   			O.x = self.scene.department.pulley.block[1].x;
   			O.y = self.scene.department.pulley.block[1].y;
   			O.width = self.scene.department.pulley.block[1].width;
   			O.height = self.scene.department.pulley.block[1].height + 300;
   			box.push(O);
   			boxPoint = check(mEast, mWest, mSouth, mNorth, box, self.master.gravity);
   			if (self.master.gravity == "south" && boxPoint[2]) {
   				self.scene.department.pulley.rope.right.heavy = true;
   			} else {
   				self.scene.department.pulley.rope.right.heavy = false;
   			}
   			
   			//live
   			live = [];
   			death = [];
   			self.scene.static.block.forEach(function (v) {
   				live.push(v);
   			});
   			self.scene.static.earth.forEach(function (v) {
   				live.push(v);
   			});
   			self.scene.static.cloud.forEach(function (v) {
   				if (!v.poison) {
   					live.push(v);
   				} else {
   					death.push(v);
   				}
   			});
   			if (self.master.skill !== "mouse") {
   				self.scene.department.mouse.forEach(function (v) {
   					live.push(v);
   				});
   			}
   			live.push(self.scene.department.poisonRect.block[self.scene.department.poisonRect.random]);
   			var pulley = self.scene.department.pulley;
   			if (pulley.rope.left.heavy) {
   				var O = new Object();
   				O.x = pulley.block[0].x;
   				O.y = pulley.block[0].y + 300;
   				O.width = pulley.block[0].width;
   				O.height = pulley.block[0].height;
   				live.push(O);
   			} else if (pulley.rope.right.heavy) {
   				var O = new Object();
   				O.x = pulley.block[0].x;
   				O.y = pulley.block[0].y - 300;
   				O.width = pulley.block[0].width;
   				O.height = pulley.block[0].height;
   				live.push(O);
   			}
   			if (self.scene.department.changeBlock.rand > 0.5) {
   				live.push(self.scene.department.changeBlock.left);
   			} else {
   				live.push(self.scene.department.changeBlock.right);
   			}
   			this.collisions = check(mEast, mWest, mSouth, mNorth, live, self.master.gravity);
   			//death
   			if (self.master.skill !== "cow") {
       			self.scene.static.water.forEach(function (v) {
       				if (v.size == 2) {
       					death.push(v);
       				}
       			});
       			self.scene.static.fog.forEach(function (v) {
       				death.push(v);
       			});
       			self.scene.static.spike.forEach(function (v) {
       				death.push(v);
       			});
       			if (self.scene.department.poisonRect.open) {
       				self.scene.department.poisonRect.ring.forEach(function (v) {
       					death.push(v);
       				});
       			}
       			if (self.scene.department.chainsaw.open) {
       				self.scene.department.chainsaw.chain.forEach(function (v) {
       					death.push(v);
       				});
       				self.scene.department.chainsaw.spike.forEach(function (v) {
       					death.push(v);
       				});
       			}
       			self.scene.department.sting.forEach(function (v) {
       				if (v.open) {
       					death.push(v);
       				}
       			});
       			self.scene.department.torch.forEach(function (v) {
       				if (v.size == "big") {
       					death.push(v.fire);
       				}
       			}); 
       			if (self.scene.department.changeBlock.rand > 0.5) {
       				death.push(self.scene.department.changeBlock.left);
       			} else {
       				death.push(self.scene.department.changeBlock.right);
       			}
       			deathPoint = check(mEast, mWest, mSouth, mNorth, death, self.master.gravity);
       			deathPoint.forEach(function (v) {
       				if (v) {
       					self.game = false;
       				}
       			});	
       		}	
   		}
	},
	clear: function () {
		var self = this;
		
		self.master.ctx.clearRect(0, 0, self.width, self.height);
		self.view.context.clearRect(0, 0, self.width, self.height);
	}, 
	reverse: function (x) {
		this.map = {};
		this.order = x;
		this.book = 0;
		this.width = 0;
		this.heaght = 0;
		this.view = {};
		this.master = {};
		this.game = true;
		this.next = false;
		this.flip = false;
		this.direction = 0;
		this.collisions = [false, false, false, false];
		this.master.gravity = "south";
		this.view.gravity = "south";
		self.master.skillBox = [];
		self.master.skill = null;
		$("#skillBox").empty();
		fireAudio.pause();
		elecAudio.pause();
	},
	die: function (X) {
		var self = this;
		self.master.sprite.dir = "death";
		$("#choice").css("display", "block");
		$("#choice p").html("Die Die Die");
		$("#over").unbind("click");
		$("#next").unbind("click");
		$("#over").on("click", function () {
			self.reverse(0);
			loopAudioLoad("./music/BG.wav");
			$("#bg").css("display", "none");
			$("#master").css("display", "none");
			$("#init").css("display", "block");
			$("#choice").css("display", "none");
			$("#interactive").css("display", "none");
		});
		if (X) {
			$("#next").html("再来");
			$("#next").on("click", function () {
			    self.reverse(self.order);
			    $("#choice").css("display", "none");
			    self.init();
		    })
		} else {
			if (self.order == 1) {
				$("#choice p").html("你终于出来了，今年归来的年兽太强了，不仅需要十二生肖的符咒，我们还要请出圣书的力量，圣书共有四卷，可年兽他们已经先行一步去寻找圣书了，需要你快赶上去，在年兽之前找到圣书，只有这样，才能赶走它了。。。");
			    $("#next").html("下一关");
			    $("#next").on("click", function () {
			        self.reverse(2);
			        $("#choice").css("display", "none");
			        self.init();
		        });
			} else {
				$("#choice p").html("你成功的先一步拿到了圣书，让我们吹起反攻的号角吧！");
				$("#next").html("决战");
				$("#next").on("click", function () {
					loopAudio.pause();
					audio.pause();
					fireAudio.pause();
					elecAudio.pause();
					$("#choice").css("display", "none");
					$("#bg").css("display", "none");
					$("#master").css("display", "none");
					$("#interactive").css("display", "none");
					$("#final").css("display", "block");
				})
			}
		}
	}
}
$("#init #help").on("click", function () {
	audioLoad("./music/system.wav");
	$("#helpDet").css("display", "block");
});
$("#helpDet #back").on("click", function () {
	$("#helpDet").css("display", "none");
	audioLoad("./music/system.wav");
});
$("#init #start").on("click", function () {
	$("#init #alert").css("display", "block");
	audioLoad("./music/system.wav");
});
$("#alert #close").on("click", function () {
	$("#init #alert").css("display", "none");
	audioLoad("./music/system.wav");
});
$("#dialogue #close").on("click", function () {
	$("#dialogue").css("display", "none");
	audioLoad("./music/system.wav");
});
$("#correct #goBack").on("click", function () {
	$("#correct").css("display", "none");
});
$("#final #back").on("click", function () {
	$("#final").css("display", "none");
	$("#init").css("display", "block");
	loopAudioLoad("./music/BG.wav");
})
$("#correct #GO").on("click", function () {
	$("#init").css("display", "none");
	$("#correct").css("display", "none");
	$("#alert").css("display", "none");
	$("#bg").css("display", "block");
	$("#master").css("display", "block");
	$("#interactive").css("display", "block");	
	loopAudioLoad("./music/run.wav");
	golbal.init();
})
$(".num").each(function () {
	$(this).on("click", function (e) {
		golbal.order = $(this).data("value");
		$("#correct").css("display", "block");
		if (golbal.order == 1) {
			$("#correct p").remove();
			$("#correct").prepend("<p>时逢春节，人们普天同庆，捣蛋的年兽每年遭受驱赶。但去年，它逃窜国外，协同狼人，吸血鬼，巫婆等，回来复仇，他们用邪恶的力量造成时空的扭曲，将十二生肖打散了。你获得了翻转空间的能力，勇敢的少年，快去突破重重阻碍，收集四散的十二生肖符咒，打败邪恶的年兽吧。</p><p>听说有人在下水道中看到鼠符咒的身影。。。</p>");
		} else {
			$("#correct p").remove();
			$("#correct").prepend("<p>你终于出来了，今年归来的年兽太强了，不仅需要十二生肖的符咒，我们还要请出圣书的力量，圣书共有四卷，可年兽他们已经先行一步去寻找圣书了，需要你快赶上去，在年兽之前找到圣书，只有这样，才能赶走它了。。。</p>");
		}
	});
});