import interact from 'interact.js'; 
import Node from './Node';
import Path from './Path';
import {Tool, DrawTool, SelectTool} from './Tool';

export default class NodeController{
	constructor(target){
		this.target = target;//append to svg
		this.data = new Map();
		this.idIndex = 0;
		this.pathIndex = 0;
		this.tool = new DrawTool();
		this.tool.setDelegate(this);

		this.setListener();
	}
	setListener() {
		interact('#drawing_panel')
			.on('tap', this.tapDrawingPanel.bind(this));
		interact('.node')
			.draggable({onmove:this.nodeMoveListener.bind(this)})
			.on('doubletap', this.nodeDoubleTap.bind(this))
			.on('tap', this.nodeTap.bind(this));//不bind的話nodeTap裡的this會變別人
	}
	getNode(event) {
		return this.data.get(event.target.id);
	}
	nodeMoveListener(event){
		let node = this.getNode(event),
			x = node.center.x + event.dx,
			y = node.center.y + event.dy;
		node.moveTo({x, y});
		this.handle.drawPath();
	}

	nodeTap(event){
		if (event.target.classList[0] !== 'node') return;
		this.tool.tapNode(event);
	}

	nodeDoubleTap(event) {
		
	}

	makeLineNode(point) {
		let key = this.getKey(this.idIndex),
			node = new Node(key, point, 'line', this.target);
		this.data.set(key, node);
		this.idIndex++;

		return node;
	}

	getKey(index) {
		return `n-${index}`;
	}

	makePath(point){
		if (!this.handle) {
			this.handle = new Path(`p-${this.pathIndex}`, this.target);
			this.pathIndex++;
		}
		let	node = this.makeLineNode(point);

		this.handle.addNode(node);
	}

	tapDrawingPanel(event){
		console.log(this.tool.constructor.name);
		console.log(this.handle===undefined ? undefined: this.handle.constructor.name);
		if (event.target.nodeName !== 'svg') return;
		this.tool.tapBackground();
	}

	positionOnDrawingPanel(event) {
		let svgtag = document.getElementById('drawing_panel'),
			x = event.clientX - svgtag.getBoundingClientRect().top,
			y = event.clientY - svgtag.getBoundingClientRect().left;
		return {x:Math.floor(x), y:Math.floor(y)};
	}

	clearHandle(){
		this.handle = undefined;
		for(let [key, value] of this.data){
			value.clearSelected();
		}
	}
}