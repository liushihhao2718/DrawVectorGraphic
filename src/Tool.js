import Path from './Path';
import Node from './Node';
import _ from 'lodash/core';
class Tool{
	constructor(){}

	setDelegate(delegate){
		this.delegate = delegate;
	}
	tapNode(){}

	tapBackground(){
	}
	
	doubleTapNode(){}

	dragNode(){}
}

class DrawTool extends Tool{
	constructor(){
		super();
		this.handle = undefined;
		
	}

	tapNode(event){
		if (!this.handle) return;
		
		let node = this.delegate.getNode(event),
			firstNode = this.handle.firstNode();

		if (this.handle.nodes.length > 2 && node === firstNode) {
			this.handle.closePath();
			this.handle = undefined;
		}
	}

	tapBackground(event){
		let point = this.delegate.positionOnDrawingPanel(event);
		if (!this.handle) {
			this.makePath(point);	
		}

		this.addNodeToHandle(point);
	}

	makePath(){
		this.handle = new Path(`p-${this.delegate.pathIndex}`,
			this.delegate.target);
		
		this.delegate.pathIndex++;
	}

	makeLineNode(point) {
		let key = this.delegate.getKey(this.delegate.idIndex),
			node = new Node(key, point, 'line', this.delegate.target);
		this.delegate.nodeMap.set(key, node);
		this.delegate.idIndex++;

		return node;
	}

	addNodeToHandle(point){
		let	node = this.makeLineNode(point);
		this.handle.addNode(node);
	}
}

class SelectTool extends Tool{

	tapNode(event){
		let node = this.delegate.getNode(event);
		this.delegate.selectedNodes.push(node);
		node.toggleSelected();
	}

	tapBackground(){
		this.delegate.cleanSelectedNodes();
	}
	
	doubleTapNode(event){}

	dragNode(event){
		let node = this.delegate.getNode(event),
			x = node.center.x + event.dx,
			y = node.center.y + event.dy;
		node.moveTo({x, y});
		node.updateBesideSegment();
	}
}

export {Tool, DrawTool, SelectTool};