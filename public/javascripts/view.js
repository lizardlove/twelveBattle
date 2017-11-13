/*
* @Author: 10261
* @Date:   2017-07-18 21:07:53
* @Last Modified by:   10261
* @Last Modified time: 2017-08-02 23:29:36
*/

'use strict';
(function () {
	function Views(O) {
		this.canvas = O.canvas;
		this.context = this.canvas.getContext("2d");

		this.x = O.x;
		this.y = O.y;

		this.VX = 10;
		this.VY = 20;

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.CX = this.x + this.width / 2;
		this.CY = this.y + this.height / 2;

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
	}

	Views.prototype.move = function (jud) {

		var L;

		switch (jud) {
			case 1: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VX;
				} else {
					L = this.VY;
				}
				this.x = this.x + L ;
				this.CX = this.CX + L ;
				break;
			}
			case 2: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VX;
				} else {
					L = this.VY;
				}
				this.x = this.x - L > 0 ?  this.x - L : this.x;
				this.CX = this.CX - L > 0 ? this.CX - L : this.CX;
				break;
			}
			case 3: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VY;
				} else {
					L = this.VX;
				}
				this.y = this.y + L;
				this.CY = this.CY + L;
				break;
			}
			case 4: {
				if (this.gravity == "south" || this.gravity == "north") {
					L = this.VY;
				} else {
					L = this.VX;
				}
				this.y = this.y - L > 0 ? this.y - L : this.y;
				this.CY = this.CY - L > 0 ? this.CY - L : this.CY;
				break;
			}
			default: break;
		}
	}

	Views.prototype.flip = function () {
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
				this.y = this.CY - this.width / 2;
				break;
			}
			case ("south"): {
				flipChange(4, 3, 2 ,1);
				this.x = this.CX - this.width / 2;
				this.y = this.CY - this.height / 2;
				break;
			}
			case ("west"): {
				flipChange(1, 2, 4, 3);
				this.x = this.CX - this.height / 2;
				this.y = this.CY - this.width / 2;
				break;
			}
			case ("north"): {
				flipChange(3, 4, 1, 2);
				this.x = this.CX - this.width / 2;
				this.y = this.CY - this.height / 2;
				break;
			}
			default: break;
		}
	}

	Views.prototype.render = function (map) {
    	var self = this;
    
    	switch (self.gravity) {
    		case ("east"): {
    			self.context.save();
    			self.context.translate(self.width, 0);
    			self.context.rotate(Math.PI / 2);
    			self.context.drawImage(map.canvas, self.x, self.y, self.height, self.width, 0, 0, self.height, self.width);
    			self.context.restore();
    			break;
    		}
    		case ("south"): {
    			self.context.drawImage(map.canvas, self.x, self.y, self.width, self.height, 0, 0, self.width, self.height);
    			break;
    		}
    		case ("west"): {
    			self.context.save();
    			self.context.translate(0, self.height);
    			self.context.rotate(-Math.PI / 2);
    			self.context.drawImage(map.canvas, self.x, self.y, self.height, self.width, 0, 0, self.height, self.width);
    			self.context.restore();
    			break;
    		}
    		case ("north"): {
    			self.context.save();
    			self.context.translate(self.width, self.height);
    			self.context.rotate(-Math.PI);
    			self.context.drawImage(map.canvas, self.x, self.y, self.width, self.height, 0, 0, self.width, self.height);
    			self.context.restore();
    			break;
    		}
    		default: break;
    	}

    }
    window.Views = Views;
})();