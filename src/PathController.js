
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
	selectPath(pathKey){
		let path = this.pathMap.get(pathKey);
		path.selected = !path.selected;
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
		this.renderer.render();
	}
}