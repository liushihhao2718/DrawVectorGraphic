import React from 'react';
import Curve from '../src/ReactTag/Curve.jsx';

class ComponentVisitor{

	visitPath(){}
	willVisitComposite(){}
	didVisitComposite(){}
}
let Comp = Symbol();
class RenderVisitor{
	constructor(){
		this.results = [];
	}
	get result(){
		return this.results[0];
	}
	visitPath(path){
		this.results.push(
			<Curve key={path.key} path={path} lock={true} />
		);
	}
	willVisitComposite(){
		this.results.push(Comp);
	}
	didVisitComposite(composite){
		let child = [];
		while(this._notComp){
			child.push(this.results.pop());
		}
		this._removeComp();
		this.results.push(
			<g lock={true}>
				{child.reverse()}
			</g>
		);
	}
	get _notComp(){
		return this.results[this.results.length - 1] !== Comp;
	}
	_removeComp(){
		if(!this._notComp)
			this.results.pop();
	}
}

export default ComponentVisitor;
export {RenderVisitor};