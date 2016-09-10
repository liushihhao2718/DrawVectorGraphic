import Snap from 'snapsvg';
import {Node, Path} from './Path';
import interact from 'interact.js';

let svg = Snap('#drawing_panel');
initSVG();
let path = make_test_path();
makeViewModel(path);

interact('.rect').draggable({onmove:rectMove});
interact('.circle').draggable({onmove:rectMove});
interact('.offcurve').draggable({onmove:rectMove});


function rectMove(e) {
	let n = path.nodeMap.get(e.target.id);
	n.x += e.dx;
	n.y += e.dy;

	svg.clear();
	makeViewModel(path);
}
function initSVG(){
	svg.attr({
		width:800,
		height:600
	});
}

function make_test_path(close = true){
	let n0 = new Node(100, 100, 'curve'),
		n1 = new Node(50, 150, 'offcurve'),
		n2 = new Node(200, 150, 'offcurve'),
		n3 = new Node(250, 100, 'smooth'),
		n4 = new Node(300, 70, 'offcurve'),
		n5 = new Node(350, 150, 'offcurve'),
		n6 = new Node(400, 100, 'curve'),
		n7 = new Node(380, 50, 'line'),
		n8 = new Node(250, 50, 'line');

	return new Path([n0,n1,n2,n3,n4,n5,n6,n7,n8], close);
}
function makeViewModel(path){
	for(let seg of path.renderSegment()){
		makePath(seg);
	}
	for(let n of path.nodeMap.values()){
		makeNode(n);
	}
}
function makePath(seg) {
	let d = '';
	if(seg.length == 4){
		let p1 = seg[0],
			p2 = seg[3],
			c1 = seg[1],
			c2 = seg[2];
		d = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;

		let control_Seg_1 = svg.path(`M${p1.x},${p1.y} L${c1.x},${c1.y}`);
		control_Seg_1.attr({'class':'control_Seg'});
		let control_Seg_2 = svg.path(`M${p2.x},${p2.y} L${c2.x},${c2.y}`);
		control_Seg_2.attr({'class':'control_Seg'});
	}else{
		let p1 = seg[0],
			p2 = seg[1];
		d = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
	}

	let p = svg.path(d);
	p.attr({'class':'segment'});
}
function makeNode(n) {
	let node;
	if (n.type === 'offcurve'){ 
		node = svg.circle(n.x, n.y, 3);
		node.attr({'class':'offcurve'});
	}
	else if(n.type === 'line' || n.type === 'curve'){
		node = svg.rect(n.x-5, n.y-5, 10, 10);
		node.attr({'class':'rect'});
	}else{
		node = svg.circle(n.x, n.y, 6);
		node.attr({'class':'circle'});
	}

	node.attr('id', n.key);
}