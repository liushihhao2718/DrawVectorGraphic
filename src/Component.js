let shortid = require('shortid');

class Component {
	add(){}
	remove(){}
	getChilds(){}
	accept(){}
}

class Composite extends Component{
	constructor(...args){
		super();
		this.key =  shortid.generate();
		this.childs = new Map();

		for(let c of args) {
			this.add(c);
		}
	}

	add(component) {
		this.childs.set(component.key, component);
	}

	remove(key){
		this.childs.delete(key);
	}

	getChilds(){
		return Array.from(this.childs.values() );
	}
	accept(visitor){
		visitor.willVisitComposite(this);

		for(let c of this.getChilds()) c.accept(visitor);

		visitor.didVisitComposite(this);
	}
}

export { Component, Composite };