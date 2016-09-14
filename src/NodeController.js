import interact from 'interact.js'; 
import {DrawTool, SelectTool} from './Tool';

export default class PathController{
	constructor(target){
		this.target = target;//append to svg
		this.pathMap = new Map();
		this.selectedNodes = new Set();

		this.tools = {
			'draw':new DrawTool(this),
			'select':new SelectTool(this)
		};

		this.tool = this.tools['select'];
		this.setListener();
	}
	setListener() {
		interact('#drawing_panel')
			.on('click', this.tapBackground.bind(this));
		
		interact('.node')
			.draggable({onmove:this.dragNode.bind(this)})
			.on('doubletap', this.doubleTapNode.bind(this))
			.on('click', this.tapNode.bind(this));//不bind的話nodeTap裡的this會變別人
		
		interact('.segment').
			on('click', this.tapSegment.bind(this));

		document.addEventListener('keydown', e => {
			var code = (e.keyCode ? e.keyCode : e.which);
			switch(code){
				case 32://space
					this.tool = this.tools['select'];
					break;
				case 80://Pp
					this.tool = this.tools['draw'];
					break;
			}
		});
	}
	setPath(path){
		this.pathMap.set(path.key, path);
	}
	getNode(event) {
		let path = this.pathMap.get(event.target.getAttribute('path_key'));
		return path.nodeMap.get(event.target.id);
	}
	
	dragNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.tool.dragNode(event);	
	}

	tapNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.tool.tapNode(event);
	}
	doubleTapNode(event) {
		if (event.target.classList[0] !== 'node') return;
		this.tool.doubleTapNode(event);
	}
	tapBackground(event){
		if (event.target.nodeName !== 'svg') return;
		this.tool.tapBackground(event);
	}
	tapSegment(event){
		if (event.target.nodeName !== 'path') return;
		this.tool.tapPath(event);
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
	getPath(event){
		let path_key = event.target.getAttribute('path_key');
		return this.pathMap.get(path_key);
	}
	positionOnDrawingPanel(event) {
		let svgtag = document.getElementById('drawing_panel'),
			x = event.clientX - svgtag.getBoundingClientRect().top,
			y = event.clientY - svgtag.getBoundingClientRect().left;
		return {x:Math.floor(x), y:Math.floor(y)};
	}
	render(){
		this.target.clear();
		for(let p of this.pathMap.values()){
			this.makeViewModel(p);
		}
	}

	makeViewModel(path){
		let group = this.target.g();
		group.attr('id', path.key);
		for(let seg of path.renderSegment()){
			this.makeSegment(seg, path.key,group);
		}
		for(let n of path.nodeMap.values()){
			this.makeNode(n, path.key,group);
		}
	}
	makeSegment(seg, path_key,group) {
		let d = '';
		if(seg.length == 4){
			let p1 = seg[0],
				p2 = seg[3],
				c1 = seg[1],
				c2 = seg[2];
			d = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;

			let control_Seg_1 = this.target.path(`M${p1.x},${p1.y} L${c1.x},${c1.y}`);
			control_Seg_1.attr({'class':'control_Seg'});
			let control_Seg_2 = this.target.path(`M${p2.x},${p2.y} L${c2.x},${c2.y}`);
			control_Seg_2.attr({'class':'control_Seg'});

			group.add(control_Seg_1, control_Seg_2);
		}else{
			let p1 = seg[0],
				p2 = seg[1];
			d = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
		}

		let p = this.target.path(d);
		p.attr({
			'class':'segment',
			'path_key':path_key,
			'start-node':seg[0].key,
			'end-node':seg[seg.length-1].key
		});
		group.add(p);
	}
	makeNode(n, path_key, group) {
		let node, node_class='node ';

		switch(n.type){
			case 'offcurve':
				node = this.target.circle(n.x, n.y, 3);
				node_class+='offcurve';
				break;
			case 'curve':
				node = this.target.rect(n.x-5, n.y-5, 10, 10);
				node_class+='rect';
				break;
			case 'smooth':
				node = this.target.circle(n.x, n.y, 6);
				node_class+='circle';
				break;
		}
		if (n.select) node_class += ' select';
		node.attr({
			'id': n.key,
			'class':node_class,
			'path_key':path_key
		});
		group.add(node);
	}
}