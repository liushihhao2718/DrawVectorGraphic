
export default class PathController{
	constructor(){
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
	toggleSelectPath(path){
		path.selected = !path.selected;

		if (path.selected) {
			this.selectedPath.add(path);
		}
		else{
			this.selectedPath.delete(path);
		}
	}
	cleanSelected(){
		for(let p of this.selectedPath){
			p.selected = false;
		}

		for(let n of this.selectedNodes){
			n.select = false;
		}
		this.selectedNodes.clear();
		this.selectedPath.clear();
	}
	getNode(event) {
		let key = event.target.getAttribute('path_key');
		let path = this.pathMap.get(key);
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
		this.renderer.render();
	}
}