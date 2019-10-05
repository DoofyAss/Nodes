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



var SVG = {
	
	create: function(tag, attributes, inner = null) {
		
		let xml = document.createElementNS("http://www.w3.org/2000/svg", tag);
		
		attributes.each(function(e, i, a) {
			xml.setAttribute(a, e);
		});
		
		xml.innerHTML = inner;
		
		return xml;
	}
}



var XML = {
	
	NODE: {
	
		create: function(node) {
		
			let layerMain = SVG.create('svg', {
				x: node.x,
				y: node.y,
				width: node.w + 32,
				height: node.h + 32,
				filter: 'url(#shadow)'
			});
			
			let layerBody = SVG.create('rect', {
				x: 16,
				y: 16,
				fill: node.fill,
				width: node.w,
				height: node.h,
				rx: node.r,
				ry: node.r
			});
			
			let layerName = SVG.create('text', {
				x: 30,
				y: 40,
				fill: node.color
			}, node.name);
			
			layerMain.append(layerBody, layerName);
			
			
			
			// Pins
			
			node.pin.each((pin, i) => {
				
				let layer = pin.type == 0 ?
				XML.PIN.createCircle(node, pin, i) : XML.PIN.createRhomb(node, pin, i);
				
				layerMain.append(layer.Pin, layer.Dot);
			});
			
			return layerMain;
		}
	},
	
	PIN: {
		
		createCircle: function(node, pin, i) {
			
			let layer = {};
			let position = this.position(node, pin.angle, i);
			
			layer.Pin = SVG.create('circle', {
				id: i,
				r: 4,
				cx: position.x,
				cy: position.y,
				fill: node.fill,
				stroke: pin.color
			});
			
			layer.Dot = SVG.create('circle', {
				id: i,
				r: 2.5,
				cx: position.x,
				cy: position.y,
				fill: pin.color,
				stroke: 'none'
			});
			
			return layer;
		},
		
		createRhomb: function(node, pin, i) {
			
			let layer = {};
			let position = this.position(node, pin.angle, i);
			
			layer.Pin = SVG.create('rect', {
				id: i,
				width: 6.8,
				height: 6.8,
				x: position.x - 3.4,
				y: position.y - 3.4,
				fill: node.fill,
				'stroke-width': 0.85,
				stroke: pin.color,
				rx: 1,
				ry: 1,
				class: 'rhomb'
			});
			
			layer.Dot = SVG.create('rect', {
				id: i,
				width: 4,
				height: 4,
				x: position.x - 2,
				y: position.y - 2,
				fill: pin.color,
				class: 'rhomb'
			});
			
			return layer
		},
		
		position: function(node, a) {
		
			a = a > 360 ? 0 : a;
			
			let TR = { // Top Right
				x: node.w / 2 + node.w / 2 / 45 * a,
				y: 0
			}
			
			let RT = { // Right Top
				x: node.w,
				y: node.h / 2 / 90 * a
			}
			
			let RB = { // Right Bottom
				x: node.w,
				y: node.h / 2 + node.h / 2 / 135 * a
			}
			
			let BR, BL;
			BR = BL = { // Bottom Right, Bottom Left
				x: node.w / 2 + node.w / 2 / 45 * (180 - a),
				y: node.h
			}
			
			let LB = { // Left Bottom
				x: 0,
				y: node.h / 2 + node.h / 2 / 45 * (270 - a)
			}
			
			let LT = { // Left Top
				x: 0,
				y: node.h / 2 / 45 * (315 - a)
			}
			
			let TL = { // Top Left
				x: node.w / 2 - node.w / 2 / 45 * (360 - a),
				y: 0
			}
			
			let position = a < 91 ? 46 > a ? TR : RT :
			a < 181 ? 136 > a ? RB : BR :
			a < 271 ? 226 > a ? BL : LB :
			316 > a ? LT : TL;
			
			position.x += 16;
			position.y += 16;
			
			return position;
		}
	}
}










/**
	Nodes
*/

function Node(option) {
	
	Object.assign(this, {
		x: 16,
		y: 16,
		w: 160,
		h: 64,
		r: 6,
		fill: '#ffffff',
		name: 'Start',
		color: '#6fb7e6',
		
		pin: []
    }, option);
	
	
}



function View() {
	
	this.node = [];
}



View.prototype.add = function(node) {
	this.node.push(node);
	
	node.xml = XML.NODE.create(node);
	area.append(node.xml);
	
	node.xml.onmousedown = function() {
		
		node.grab = true;
		
		this.onmouseup = this.onmouseleave = function() {
			node.grab = false;
			this.onmousemove = null;
		}
		
		this.onmousemove = function(e) {
			
			if (!node.grab) return;
			
			this.x.baseVal.value += e.movementX / window.devicePixelRatio;
			this.y.baseVal.value += e.movementY / window.devicePixelRatio;
		}
	}
	
	return node;
}










var view = new View();

view.add(new Node({
	pin: [
		{ type: 0, angle: 90, color: '#6fb7e6' },
		{ type: 1, angle: 180, color: '#6fb7e6' }
	]
}));

view.add(new Node({
	name: 'Main',
	color: '#5dc580',
	x: 272,
	y: 80,
	pin: [
		{ type: 0, angle: 270, color: '#5dc580' }
	]
}));

view.add(new Node({
	name: 'Value',
	color: '#e06aa3',
	x: 48,
	y: 144,
	pin: [
		{ type: 1, angle: 324, color: '#e06aa3' }
	]
}));


let path1 = SVG.create('path', {
	d: 'M192,64 C224,64 224,128 288,128',
	'stroke-width': 1,
	stroke: 'url(#gradient1)',
	fill: 'none'
});

let path2 = SVG.create('path', {
	d: 'M112,96 C116,136 80,112 80,160',
	'stroke-width': 1,
	stroke: 'url(#gradient2)',
	fill: 'none'
});

area.append(path1);
area.append(path2);