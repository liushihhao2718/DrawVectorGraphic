const svgNS = 'http://www.w3.org/2000/svg';

export default class PathController{
	constructor(target){
		this.target = target;//append to svg
		this.pathMap = new Map();
		this.selectedNodes = new Set();
		this.selectedPath = new Set();
	}
	toggleSelected(node){
		node.select = !node.select;

		if (node.select) {
			this.selectedNodes.add(node);
		}
		else{
			this.selectedNodes.delete(node);
		}
	}
	cleanSelectedNodes(){
		for(let n of this.selectedNodes){
			n.select = false;
		}
		this.selectedNodes.clear();
	}
	getNode(event) {
		let path = this.pathMap.get(event.target.getAttribute('path_key'));
		return path.nodeMap.get(event.target.id);
	}
	getPath(event){
		let path_key = event.target.getAttribute('path_key');
		return this.pathMap.get(path_key);
	}
	setPath(path){
		this.pathMap.set(path.key, path);
	}
	positionOnDrawingPanel(event) {
		let svgtag = document.getElementById('drawing_panel'),
			x = event.layerX - svgtag.getBoundingClientRect().left,
			y = event.layerY - svgtag.getBoundingClientRect().top;

		return {x:Math.floor(x), y:Math.floor(y)};
	}
	render(){
		while (this.target.firstChild) {
			this.target.removeChild(this.target.firstChild);
		}
		for(let p of this.pathMap.values()){
			this.makeViewModel(p);
		}
	}
	selectPath(pathKey){
		let path = this.pathMap.get(pathKey);
		path.selected = !path.selected;
	}
	makeViewModel(path){
		let group = document.createElementNS(svgNS, 'g');
		group.setAttribute('id', path.key);

		if (path.selected) {
			this.makeOnePath(path, group);
			this.makeBBox(path, group);
		}
		else{
			for(let seg of path.renderSegment()){
				this.makeSegment(seg, path,group);
			}
			for(let n of path.nodeMap.values()){
				this.makeNode(n, path.key,group);
			}
		}

		this.target.appendChild(group);
	}
	makeSegment(seg, path,group) {
		let d = '';
		if(seg.length == 4){
			let p1 = seg[0],
				p2 = seg[3],
				c1 = seg[1],
				c2 = seg[2];
			d = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;

			let control_Seg_1 = document.createElementNS(svgNS, 'path');
			control_Seg_1.setAttribute('d', `M${p1.x},${p1.y} L${c1.x},${c1.y}`);
			control_Seg_1.setAttribute('class','control_Seg');



			let control_Seg_2 = document.createElementNS(svgNS, 'path');
			control_Seg_2.setAttribute('d', `M${p2.x},${p2.y} L${c2.x},${c2.y}`);
			control_Seg_2.setAttribute('class','control_Seg');

			group.appendChild(control_Seg_1);
			group.appendChild(control_Seg_2);

		}else{
			let p1 = seg[0],
				p2 = seg[1];
			d = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
		}

		let p = document.createElementNS(svgNS, 'path');
		p.setAttribute('class','segment');
		p.setAttribute('path_key',path.key);
		p.setAttribute('start-node',seg[0].key);
		p.setAttribute('end-node',seg[seg.length-1].key);
		p.setAttribute('d', d);

		let p_shadow = document.createElementNS(svgNS, 'path');
		p_shadow.setAttribute('class','segment shadow');
		p_shadow.setAttribute('path_key',path.key);
		p_shadow.setAttribute('start-node',seg[0].key);
		p_shadow.setAttribute('end-node',seg[seg.length-1].key);
		p_shadow.setAttribute('d', d);

		group.appendChild(p);
		group.appendChild(p_shadow);

	}
	makeNode(n, path_key, group) {
		let node, node_class='node ';

		switch(n.type){
			case 'offcurve':
				node = document.createElementNS(svgNS, 'circle');
				node.setAttribute('cx', n.x);
				node.setAttribute('cy', n.y);
				node.setAttribute('r',  5);
				
				node_class+='offcurve';
				break;
			case 'curve':
				node = document.createElementNS(svgNS, 'rect');
				node.setAttribute('x', n.x-5);
				node.setAttribute('y', n.y-5);
				node.setAttribute('width',  10);
				node.setAttribute('height', 10);
				
				node_class+='rect';
				break;
			case 'smooth':
				node = document.createElementNS(svgNS, 'circle');
				node.setAttribute('cx', n.x);
				node.setAttribute('cy', n.y);
				node.setAttribute('r',  6);

				node_class+='circle';
				break;
		}
		if (n.select) node_class += ' select';

		node.setAttribute('id', n.key);
		node.setAttribute('class',node_class);
		node.setAttribute('path_key',path_key);

		group.appendChild(node);
	}
	makeOnePath(path, group){
		let p = document.createElementNS(svgNS, 'path');
		p.setAttribute('d', path.toString());
		p.setAttribute('class', 'shadow');
		group.appendChild(p);
	}
	makeBBox(path, group){
		let rect = document.createElementNS(svgNS, 'rect'),
			bbox = path.bbox();
		rect.setAttribute('x', bbox.x);
		rect.setAttribute('y', bbox.y);
		rect.setAttribute('width',  bbox.width);
		rect.setAttribute('height', bbox.height);
		rect.setAttribute('path_key',path.key);
		rect.setAttribute('class', 'node shadow');
		group.appendChild(rect);
	}
}