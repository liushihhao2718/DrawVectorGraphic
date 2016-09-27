export default class GroupTool{
	constructor(delegate){
		this.delegate = delegate;
		this.tag = document.getElementById('tool');
	}

	tapNode(){}

	tapBackground(){
	}
	
	holdNode(){}

	dragNode(){}

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