import Snap from 'snapsvg';
import NodeController from './NodeController';
import {Tool, DrawTool, SelectTool} from './Tool';
let svg = Snap('#drawing_panel');
let nodeController = new NodeController(svg);
initSVG();
setKeyUP();

function initSVG(){
	svg.attr({
		width:800,
		height:600
	});
}

function setKeyUP(){

	let toolHandler = new Map(),
		select = new SelectTool(),
		pen = new DrawTool();
	select.setDelegate(nodeController);
	pen.setDelegate(nodeController);

	toolHandler.set(32,  select);//space => select tool
	toolHandler.set(80, pen);//Pp => path tool (drawing tool)
	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		nodeController.tool = toolHandler.get(key);
	};
}

