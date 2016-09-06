export default class Path {
	constructor(key, target, nodes){
		this.target = target;//append to svg
		this.nodes = nodes||[];//optional
		this.key = key;
		this.closed = false;

		this.view = this.target.path('')
			.attr({
				fill:this.closed ?'#000':'none',
				stroke:'#000',
				strokeWidth:'2'
			});
	}

	addNode(node){
		this.nodes.push(node);
		this.drawPath();
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
}