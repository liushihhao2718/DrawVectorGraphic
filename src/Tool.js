import {Node, Path} from './Path';

class Tool{
	constructor(delegate){
		this.delegate = delegate;		
	}

	tapNode(){}

	tapBackground(){
	}
	
	doubleTapNode(){}

	dragNode(){}

	tapPath(){}
}

class DrawTool extends Tool{
	constructor(delegate){
		super(delegate);
		this.handle = undefined;
		
	}

	tapNode(event){
		if (!this.handle) return;
		
		if (this.handle.nodeMap.size > 2 && event.target.id === this.handle.head) {
			this.handle.closePath();
			this.handle = undefined;

		}
		this.delegate.render();
	}

	tapBackground(event){
		let point = this.delegate.positionOnDrawingPanel(event);
		if (!this.handle) {
			this.makePath(point);	
		}
		else{
			this.addNodeToHandle(point);
		}
		this.delegate.render();
	}

	makePath(point){
		this.handle = new Path(
			[new Node(point.x, point.y)],this.delegate.target);
		this.delegate.setPath(this.handle);
	}

	addNodeToHandle(point){
		this.handle.addPoint(point.x, point.y);
	}
}

class SelectTool extends Tool{

	tapNode(event){
		let node = this.delegate.getNode(event);
		this.delegate.toggleSelected(node);
		this.delegate.render();
	}

	tapPath(event){
		let path = this.delegate.getPath(event),
			start = path.nodeMap.get(event.target.getAttribute('start-node')),
			end = path.nodeMap.get(event.target.getAttribute('end-node'));

		if(start.next === end.key && end.prev === start.key && event.altKey){
			path.makeLineSegmentToCurve(start, end);
			this.delegate.render();
		}

	}
	tapBackground(){
		this.delegate.cleanSelectedNodes();
		this.delegate.render();
	}
	
	dragNode(event){
		let path = this.delegate.getPath(event);
		path.nodeMove(event.target.id, event.dx, event.dy);

		this.delegate.render();
	}
}

export {Tool,DrawTool, SelectTool};