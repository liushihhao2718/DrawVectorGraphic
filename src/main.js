import Snap from 'snapsvg';
import PathController from './PathController';
import MouseEventHanlder from './MouseEventHanlder';
// import ButtonEventHandler from './ButtonEventHandler';
import ToolFactory from './Tool';

init();

function init(){
	
	let svg = Snap('#drawing_panel'),
		pathController = new PathController(svg);

	svg.attr({
		width:800,
		height:600
	});

	const factory = new ToolFactory(pathController);

	let mouseEvent = new MouseEventHanlder(factory);
	mouseEvent.setListener();

	pathController.render();
}