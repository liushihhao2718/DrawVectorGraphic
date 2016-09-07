import interact from 'interact.js'; 
import {DrawTool} from './Tool';

export default class NodeController{
	constructor(target){
		this.target = target;//append to svg
		this.nodeMap = new Map();
		this.idIndex = 0;
		this.pathIndex = 0;
		this.tool = new DrawTool();
		this.tool.setDelegate(this);

		this.setListener();
	}
	setListener() {
		interact('#drawing_panel')
			.on('tap', this.tapBackground.bind(this));
		interact('.node')
			.draggable({onmove:this.dragNode.bind(this)})
			.on('doubletap', this.doubleTapNode.bind(this))
			.on('tap', this.tapNode.bind(this));//不bind的話nodeTap裡的this會變別人
	}
	getNode(event) {
		return this.nodeMap.get(event.target.id);
	}
	dragNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.tool.dragNode(event);	
	}
	tapNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.tool.tapNode(event);
	}
	doubleTapNode(event) {
		if (event.target.classList[0] !== 'node') return;
		this.tool.doubleTapNode(event);
	}
	tapBackground(event){
		// console.log(this.tool.constructor.name);
		if (event.target.nodeName !== 'svg') return;
		this.tool.tapBackground();
	}

	
	getKey(index) {
		return `n-${index}`;
	}
	positionOnDrawingPanel(event) {
		let svgtag = document.getElementById('drawing_panel'),
			x = event.clientX - svgtag.getBoundingClientRect().top,
			y = event.clientY - svgtag.getBoundingClientRect().left;
		return {x:Math.floor(x), y:Math.floor(y)};
	}
}