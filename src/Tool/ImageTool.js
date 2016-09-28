export default class ImageTool{
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