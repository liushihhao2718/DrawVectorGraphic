import Tool from './Tool';
export default class SelectTool extends Tool{

	tapNode(event){
		let node = this.delegate.getNode(event);
		this.delegate.toggleSelected(node);
		this.delegate.render();
	}
	holdNode(event){
		let path = this.delegate.getPath(event),
			node = this.delegate.getNode(event);

		path.transferNodeType(node.key);
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