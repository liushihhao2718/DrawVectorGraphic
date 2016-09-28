export default class GroupTool{
	constructor(delegate){
		this.delegate = delegate;
		this.tag = document.getElementById('tool');
	}

	tapNode(){
		let path = this.delegate.getPath(event);
		this.delegate.selectPath(path.key);
		this.delegate.render();
	}

	tapBackground(){
	}
	
	holdNode(){}

	dragNode(event){
		let path = this.delegate.getPath(event);
		path.move(event.dx, event.dy);
		this.delegate.render();
	}

	tapPath(event){
		let path = this.delegate.getPath(event);
		this.delegate.selectPath(path.key);
		this.delegate.render();
	}

	switch(){}
	mount(){
		this.tag.textContent = this.constructor.name;
	}
}