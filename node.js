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
	canvas.width = area.offsetWidth;
	canvas.height = area.offsetHeight;
})();










/**
	Nodes
*/

function Node(option) {
	
	Object.assign(this, {
        x: 8,
		y: 8,
        w: 160,
		h: 30,
        r: 6
    }, option);
}



function View(canvas) {
	
	let view = this;
	let context = this.context = canvas.getContext('2d');
	
	this.node = [];
	
	canvas.onclick = function() {
		// console.log(view.node[0].w);
		view.draw();
	}
}



View.prototype.draw = function() {
	
	this.context.clearRect(0, 0, canvas.width, canvas.height);
	
	this.node.each((n) => {
		
	});
}



View.prototype.add = function(node) {
	this.node.push(node);
}



var view = new View(canvas);
view.add(new Node());










/**
	Render
*/

