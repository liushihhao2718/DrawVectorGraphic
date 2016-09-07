export default class Path {
	constructor(key, target, nodes){
		this.target = target;//append to svg
		this.nodes = nodes||[];//optional
		this.key = key;
		this.closed = false;

		this.segmnetMap = new Map();
	}

	addNode(node){
		node.setParent(this);
		this.nodes.push(node);

		
		if (this.noSegment()) return;
		let lastOne = this.nodes.length - 1;
		this.drawLineSegment(this.nodes[lastOne-1],
			this.nodes[lastOne]);
	}

	noSegment(){
		return (this.nodes.length <= 1);
	}
	makePathDescription(){
		let path_description = '',
			flag;
		for (var i = 0; i < this.nodes.length; i++) {
			if(i===0) flag = 'M';

			else if(this.nodes[i].type === 'line') flag = ' L';


			path_description +=`${flag}${this.nodes[i].center.x} ${this.nodes[i].center.y}`;
		}

		if (this.closed) path_description+='Z';

		return path_description;
	}

	drawPath(){
		this.view.attr('d', this.makePathDescription());
	}
	drawLineSegment(p1, p2){
		let d = this.makeLineDescript(p1, p2),
			segment = this.target.path(d),
			segmentKey = `${this.key}-${this.nodes.indexOf(p1)}`;
		segment.attr({
			id:segmentKey,
			class:'segment'
		});
		this.segmnetMap.set(segmentKey, segment);
	}
	makeLineDescript(p1, p2){
		//Mx1 y1 L x2 y2
		return `M ${p1.center.x} ${p1.center.y}`
			+` L ${p2.center.x} ${p2.center.y}`;
	}
	updateSegment(present){//0
		let	size = this.nodes.length,//3
			prev = (present - 1 + size)%size,//2
			next = (present + 1 + size)%size,//1
			prevSeg = this.segmnetMap.get(`${this.key}-${prev}`),
			presentSeg = this.segmnetMap.get(`${this.key}-${present}`),
			left_d = this.makeLineDescript(this.nodes[prev], this.nodes[present]),
			right_d = this.makeLineDescript(this.nodes[present], this.nodes[next]);
		prevSeg.attr('d', left_d);
		presentSeg.attr('d', right_d);
	}
	firstNode(){
		return this.nodes[0];
	}

	lastNode(){
		return this.nodes[this.nodes.length-1];
	}
	clearSelected(){
		for(let node of this.nodes){
			node.setSelected(false);
		}
	}
	closePath(){
		this.closed = true;
		this.drawLineSegment(this.lastNode(), this.firstNode());
	}
}