import Tool from './Tool';
import {Node, Path} from '../Path';

export default class DrawTool extends Tool{
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

	switch(){
		this.handle = undefined;
	}
}