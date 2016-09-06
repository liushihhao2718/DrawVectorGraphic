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

		let node = this.delegate.getNode(event),
			firstNode = this.delegate.handle.firstNode();

		if (this.delegate.handle.nodes.length > 2 && node === firstNode) {
			this.delegate.handle.closed = true;
			this.delegate.handle.drawPath();
			this.delegate.handle = undefined;
		}
	}

	tapBackground(){
		let point = this.delegate.positionOnDrawingPanel(event);
		this.delegate.makePath(point);
	}
	
	doubleTapNode(){}

	dragNode(){}
}

class SelectTool extends Tool{
	constructor(){
		super();
	}

	tapNode(event){
		let node = this.delegate.getNode(event);
		this.delegate.handle = node.parent;
		node.toggleSelected();
	}

	tapBackground(event){
		
	}
	
	doubleTapNode(event){}

	dragNode(event){}
}

export {Tool, DrawTool, SelectTool};