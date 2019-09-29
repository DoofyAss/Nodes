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
		c.call(self[key], self[key], i, key);
	});
}










/**
	Main
*/

var area = o('#area svg');

(document.body.onresize = () => {
	area.viewBox.baseVal.width = area.clientWidth;
	area.viewBox.baseVal.height = area.clientHeight;
})();










/**
	Nodes
*/

function Node(option) {
	
	Object.assign(this, {
		x: 32,
		y: 32,
		w: 160,
		h: 64,
		r: 6, // radius
		f: '#ffffff', // fill
		n: 'Start'
    }, option);
	
	
}



function View() {
	
	this.node = [];
	
	area.onmousemove = function(e) {
		
		view.node.each(function() {
			
		});
	}
}



var SVG = {
	
	create: function(tag, attributes) {
		
		let element = document.createElementNS("http://www.w3.org/2000/svg", tag);
		
		attributes.each(function(e, i, a) {
			element.setAttribute(a, e);
		});
		
		return element;
	}
}

var HTML = {

	Node: {
	
		create: function(node) {
		
			let layerMain = SVG.create('svg', {
				x: node.x,
				y: node.y,
				width: node.w + 16,
				height: node.h + 16,
				cursor: 'grab'
			});
			
			let layerBody = SVG.create('rect', {
				x: 8,
				y: 8,
				fill: node.f,
				width: node.w,
				height: node.h,
				rx: node.r,
				ry: node.r,
				filter: 'url(#shadow)'
			});
			
			layerMain.append(layerBody);
			
			return layerMain;
		}
	}
}



View.prototype.add = function(node) {
	this.node.push(node);
	
	node.element = HTML.Node.create(node);
	area.append(node.element);
	
	node.element.onmousedown = function() {
		
		node.grab = true;
		this.setAttribute('cursor', 'grabbing');
		
		this.onmouseup = this.onmouseleave = function() {
			node.grab = false;
			this.setAttribute('cursor', 'grab');
			this.onmousemove = null;
		}
		
		this.onmousemove = function(e) {
			
			if (!node.grab) return;
			
			// setTimeout(function() { node.element.x.baseVal.value += e.movementX; }, 128);
			// setTimeout(function() { node.element.y.baseVal.value += e.movementY; }, 128);
			this.x.baseVal.value += e.movementX;
			this.y.baseVal.value += e.movementY;
		}
	}
}










var view = new View();
view.add(new Node());
view.add(new Node( { n: 'Main', x: 296, y: 90 } ));
view.add(new Node( { n: 'Value', y: 160 } ));