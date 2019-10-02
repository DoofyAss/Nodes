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
	
	create: function(tag, attributes) {
		
		let xml = document.createElementNS("http://www.w3.org/2000/svg", tag);
		
		attributes.each(function(e, i, a) {
			xml.setAttribute(a, e);
		});
		
		return xml;
	}
}



var XML = {

	Node: {
	
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
				fill: node.f,
				width: node.w,
				height: node.h,
				rx: node.r,
				ry: node.r
			});
			
			layerMain.append(layerBody);
			
			
			
			// pins
			
			node.pin.each((pin) => {
				
				let a = pin.angle > 360 ? 0 : pin.angle;
				
				let TR = { // Top Right
					x: node.x + node.w / 2 + node.w / 2 / 45 * a,
					y: node.y
				}
				
				let RT = { // Right Top
					x: node.x + node.w,
					y: node.y + node.h / 2 / 90 * a
				}
				
				let RB = { // Right Bottom
					x: node.x + node.w,
					y: node.y + node.h / 2 + node.h / 2 / 135 * a
				}
				
				let BR, BL;
				BR = BL = { // Bottom Right, Bottom Left
					x: node.x + node.w / 2 + node.w / 2 / 45 * (180 - a),
					y: node.y + node.h
				}
				
				let LB = { // Left Bottom
					x: node.x,
					y: node.y + node.h / 2 + node.h / 2 / 45 * (270 - a)
				}
				
				let LT = { // Left Top
					x: node.x,
					y: node.y + node.h / 2 / 45 * (315 - a)
				}
				
				let TL = { // Top Left
					x: node.x + node.w / 2 - node.w / 2 / 45 * (360 - a),
					y: node.y
				}
				
				
				let side =
				a < 91 ? 46 > a ? TR : RT :
				a < 181 ? 136 > a ? RB : BR :
				a < 271 ? 226 > a ? BL : LB :
				316 > a ? LT : TL;
				
				console.log(a, side);
				
				
				
				let layerPin = SVG.create('circle', {
					id: 'circle',
					r: 5,
					cx: side.x,
					cy: side.y,
					fill: 'none',
					stroke: 'tomato'
				});
				
				node.cir = layerPin;
				layerMain.append(layerPin);
			});
			
			
			
			
			
			return layerMain;
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
		r: 6, // radius
		f: '#ffffff', // fill
		n: 'Start', // name
		
		pin: [
			// type: 0 - circle, 1 - rhomb
			{ type: 0, angle: 0 },
			{ type: 0, angle: 90 },
			{ type: 0, angle: 180 },
			{ type: 0, angle: 270 },
			{ type: 0, angle: 45 },
			{ type: 0, angle: 135 },
			{ type: 0, angle: 225 },
			{ type: 0, angle: 315 },
			{ type: 0, angle: 23 },
		]
    }, option);
	
	
}



function View() {
	
	this.node = [];
}



View.prototype.add = function(node) {
	this.node.push(node);
	
	node.xml = XML.Node.create(node);
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
let n = view.add(new Node());

// var angl = 136;
// var mov = 1;


// setInterval(function() {
	
	// if (angl > 180) {
		// mov = 0;
	// }
	
	// if (angl < 136) {
		// mov = 1;
	// }
	
	// if (mov) { angl++; } else { angl--; }
	
	// n.cir.setAttribute('cx', n.x + n.w / 2 + n.w / 2 / 45 * (180 - angl));
// }, 25);

// view.add(new Node( { n: 'Main', x: 272, y: 80 } ));
// view.add(new Node( { n: 'Value', x: 48, y: 144 } ));