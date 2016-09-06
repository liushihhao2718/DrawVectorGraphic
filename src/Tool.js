export class Tool{
	constructor(){

	}

	tapNode(){}

	tapBackground(){}
	
	doubleTapNode(){}

	dragNode(){}
}

export class DrawTool extends Tool{
	constructor(){
		super();
		this.handle = undefined;
		
	}

	tapNode(){}

	tapBackground(){}
	
	doubleTapNode(){}

	dragNode(){}
}

export class SelectTool extends Tool{
	constructor(){
		super();
	}

	tapNode(){}

	tapBackground(){}
	
	doubleTapNode(){}

	dragNode(){}
}