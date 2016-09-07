export default class Node{
	constructor(key, center, type,target){
		this.key = key;//uuid
		this.selected = false;
		this.type = 'line';//type: line, curve, smooth, offcurve
		this.center = center;// ( x, y )
		this.view = undefined;
		this.target = target;//append to svg
		this.parent = undefined;
		this.makeNode();

	}

	setParent(parent) {
		this.parent = parent;
	}
	makeRect(){
		let width = 10,
			height = width,
			helfWidth = width/2,
			x = this.center.x - helfWidth,
			y = this.center.y - helfWidth;

		return {width, height, x, y};
	}
	makeNode() {
		
		let	rect = this.makeRect(),
			view = this.target.rect(rect.x, rect.y, 
				rect.width, rect.height);
		
		view.attr({
			id: this.key,
			'class':'node'
		});

		this.view = view;
	}
	moveTo(point){
		this.center = point;
		let rect = this.makeRect();
		this.view.attr(
			{
				'x': rect.x,
				'y': rect.y
			});
	}
	toggleSelected(){
		this.setSelected(!this.selected);
	}
	setSelected(selected){
		this.selected = selected;
		this.view.attr('fill', selected?'#6699ff':'none');
	}
	updateBesideSegment(){
		let nodeIndex = this.parent.nodes.indexOf(this);
		this.parent.updateSegment(nodeIndex);
	}
}