export default class Tool{
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
	doubleTapPath(){}

	switch(){}
	mount(){
		this.tag.textContent = this.constructor.name;
	}
}