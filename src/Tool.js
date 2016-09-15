import {Node, Path} from './Path';

class ToolFactory{
	constructor(delegate){
		this.tools = {
			'draw':new DrawTool(delegate),
			'select':new SelectTool(delegate)
		};
		this.tool = this.tools['select'];
	}

	switchTool(str){
		this.tool.switch();
		this.tool = this.tools[str];
		this.tool.mount();

		return this.tool;
	}
}

class Tool{
	constructor(delegate){
		this.delegate = delegate;
		this.tag = document.getElementById('tool');
	}

	tapNode(){}

	tapBackground(){
	}
	
	holdNode(){}

	dragNode(){}

	tapPath(){}

	switch(){}
	mount(){
		this.tag.textContent = this.constructor.name;
	}
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

	switch(){
		this.handle = undefined;
	}
}

class SelectTool extends Tool{

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

export {ToolFactory};