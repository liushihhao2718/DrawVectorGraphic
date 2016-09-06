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
		this.setListener();
		this.tool = new SelectTool();
	}
	setListener() {
		this.setDrawingPanelListener();
		this.setNodeListener();
	}
	setNodeListener(){
		interact('.node')
			.draggable({onmove:this.nodeMoveListener.bind(this)})
			.on('doubletap', this.nodeDoubleTap.bind(this))
			.on('tap', this.nodeTap.bind(this));//不bind的話nodeTap裡的this會變別人
	}

	nodeMoveListener(event){
		let node = this.data.get(event.target.id),
			x = node.center.x + event.dx,
			y = node.center.y + event.dy;
		node.moveTo({x, y});
		this.handle.drawPath();
	}

	nodeTap(event){
		if (event.target.classList[0] !== 'node') return;

		let node = this.data.get(event.target.id);
		node.toggleSelected();
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
	

	setDrawingPanelListener(){
		interact('#drawing_panel').on('tap', this.tapDrawingPanel.bind(this));
	}

	tapDrawingPanel(event){
		if (event.target.nodeName !== 'svg') return;
		let point = this.positionOnDrawingPanel(event);

		this.makePath(point);
	}

	positionOnDrawingPanel(event) {
		let svgtag = document.getElementById('drawing_panel'),
			x = event.clientX - svgtag.getBoundingClientRect().top,
			y = event.clientY - svgtag.getBoundingClientRect().left;
		return {x:Math.floor(x), y:Math.floor(y)};
	}
}