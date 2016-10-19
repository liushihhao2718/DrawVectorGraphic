class ComponentVisitor{

	visitPath(){}
	willVisitComposite(){}
	didVisitComposite(){}
}

class RenderVisitor{
	constructor(delegate){
		this.delegate = delegate;
	}
	
	visitPath(path){
		this.delegate.visitPath(path);
	}
	willVisitComposite(composite){
		this.delegate.willVisitComposite(composite);
	}
	didVisitComposite(composite){
		this.delegate.didVisitComposite(composite);
	}
}

export default ComponentVisitor;
export {RenderVisitor};