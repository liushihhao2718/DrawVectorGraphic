import Snap from 'snapsvg';
import {Node, Path} from './Path';
import NodeController from './NodeController';
init();

function init(){
	
	let svg = Snap('#drawing_panel'),
		nodeController = new NodeController(svg);

	svg.attr({
		width:800,
		height:600,
		// viewbox:'0,0,1000,1000'
	});

	// let path = make_test_path();
	// nodeController.pathMap.set(path.key, path);
	nodeController.render();
}

function make_test_path(close = true){
	let n0 = new Node(100, 100, 'curve'),
		n1 = new Node(50, 150, 'offcurve'),
		n2 = new Node(200, 150, 'offcurve'),
		n3 = new Node(250, 100, 'smooth'),
		n4 = new Node(300, 70, 'offcurve'),
		n5 = new Node(350, 150, 'offcurve'),
		n6 = new Node(400, 100, 'curve'),
		n7 = new Node(380, 50, 'curve'),
		n8 = new Node(250, 50, 'curve');

	return new Path([n0,n1,n2,n3,n4,n5,n6,n7,n8], close);
}