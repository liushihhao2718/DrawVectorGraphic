import Snap from 'snapsvg';
import NodeController from './NodeController';

let svg = Snap('#drawing_panel');
initSVG();


function initSVG(){
	svg.attr({
		width:800,
		height:600
	});
	let nodeController = new NodeController(svg);
}

