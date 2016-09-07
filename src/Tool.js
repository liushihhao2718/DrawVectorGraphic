import Path from './Path';
import Node from './Node';

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
			this.handle.closed = true;
			this.handle.drawPath();
			this.handle = undefined;
		}
	}

	tapBackground(){
		let point = this.delegate.positionOnDrawingPanel(event);
		this.makePath(point);
	}

	makePath(point){
		if (!this.handle) {
			this.handle = new Path(`p-${this.pathIndex}`, this.delegate.target);
			this.delegate.pathIndex++;
		}

		let	node = this.makeLineNode(point);

		this.handle.addNode(node);
	}

	makeLineNode(point) {
		let key = this.delegate.getKey(this.delegate.idIndex),
			node = new Node(key, point, 'line', this.delegate.target);
		this.delegate.nodeMap.set(key, node);
		this.delegate.idIndex++;

		return node;
	}
}

class SelectTool extends Tool{

	tapNode(event){
		let node = this.delegate.getNode(event);
		node.toggleSelected();
	}

	tapBackground(event){
		
	}
	
	doubleTapNode(event){}

	dragNode(event){
		let node = this.delegate.getNode(event),
			x = node.center.x + event.dx,
			y = node.center.y + event.dy;
		node.moveTo({x, y});
		node.parent.drawPath();
	}
}

export {Tool, DrawTool, SelectTool};