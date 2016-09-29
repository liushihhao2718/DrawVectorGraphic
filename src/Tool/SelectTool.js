import Tool from './Tool';
export default class SelectTool extends Tool{

	tapNode(event){

		let path = this.delegate.getPath(event);
		if (path.selected) {
			this.delegate.toggleSelectPath(path);
		}
		else{
			let node = this.delegate.getNode(event);
			this.delegate.toggleSelected(node);
		}
		
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
	doubleTapPath(){
		let path = this.delegate.getPath(event);
		this.delegate.toggleSelectPath(path);
		this.delegate.render();
	}
	tapBackground(){
		this.delegate.cleanSelected();
		this.delegate.render();
	}
	
	dragNode(event){
		let path = this.delegate.getPath(event);

		if (path.selected) {
			path.move(event.dx, event.dy);
		}
		else{
			path.nodeMove(event.target.id, event.dx, event.dy);
		}
		this.delegate.render();
	}
}