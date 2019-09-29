"use strict"










/**
	Common
*/

// HTML Element Selector
function o(s) { return document.querySelector(s); }

// Each Object
Object.prototype.each = function(c) {

	let self = this;
	
	Object.keys(this).map(function(key, i) {
		c.call(self[key], self[key], i);
	});
}










/**
	Main
*/

var area = o('#area');
var canvas = o('canvas');

(document.body.onresize = () => {
	canvas.width = canvas.clientWidth; // area.clientWidth;
	canvas.height = canvas.clientHeight; // area.clientHeight;
})();










/**
	Nodes
*/

function Node(option) {
	
	Object.assign(this, {
		x: 116,
		y: 116,
		w: 160,
		h: 64,
		r: 8,				// radius [16, 8, 16, 8]
		f: '#ffffff',		// fill
		s: false			// shadow
    }, option);
}



Node.prototype.hover = function(x, y) {
	return	(this.x < x) && (this.x + this.w > x) &&
			(this.y < y) && (this.y + this.h > y);
}



function View(canvas) {
	
	let view = this;
	let context = this.context = canvas.getContext('2d');
	
	this.node = [];
	
	canvas.onmousemove = function(e) {
		
		view.node.each(function() {
			this.s = this.hover(e.layerX, e.layerY) ? true : false;
		});
		
		view.draw();
	}
}



View.prototype.draw = function() {
	
	this.context.clearRect(0, 0, canvas.width, canvas.height);
	
	this.node.each((node) => {
		draw.rect(
			node.x,
			node.y,
			node.w,
			node.h,
			node.r,
			node.f,
			node.s
		);
	});
}



View.prototype.add = function(node) {
	this.node.push(node);
}



var view = new View(canvas);
view.add(new Node());
view.add(new Node( { x: 356, y: 162, f: '#426c92' } ));
view.add(new Node( { y: 212, f: '#33784c' } ));










/**
	Render
*/

var draw = {
	
	get context() { return view.context; },
	
	
	
	rect: function(x, y, w, h, r, f, s) {
		
		if (typeof r != 'object') r = typeof r == 'number' ? [r, r, r, r] : [0, 0, 0, 0];
		
		let c = this.context;
		
		c.fillStyle = f;
		c.shadowBlur = 0;
		
		c.beginPath();
		c.moveTo(x + r[0], y);
		c.lineTo(x + w - r[1], y);
		c.quadraticCurveTo(x + w, y, x + w, y + r[1]);
		c.lineTo(x + w, y + h - r[2]);
		c.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
		c.lineTo(x + r[3], y + h);
		c.quadraticCurveTo(x, y + h, x, y + h - r[3]);
		c.lineTo(x, y + r[0]);
		c.quadraticCurveTo(x, y, x + r[0], y);
		c.closePath();
		
		if (s) {
			c.shadowColor = '#0000009d';
			c.shadowBlur = 6;
		}
		
		c.fill();
	}
}