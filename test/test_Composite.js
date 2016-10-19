import test from 'ava';
import {Node, Path} from '../src/Path';
import {Composite} from '../src/Component';

function make_2_test_path(){
	let n0 = new Node(100, 100, 'curve'),
		n1 = new Node(50, 150, 'offcurve'),
		n2 = new Node(200, 150, 'offcurve'),
		n3 = new Node(250, 100, 'curve'),

		n6 = new Node(400, 100, 'curve'),
		n7 = new Node(380, 50, 'curve'),
		n8 = new Node(250, 50, 'curve');


	let path1 = new Path([n0,n1,n2,n3]),
		path2 = new Path([n6,n7,n8]);

	return { path1, path2 }; 
}

test('make composite', t=>{
	let { path1, path2 } = make_2_test_path(),
		composite = new Composite(path1, path2);

	t.true(composite.getChilds().includes(path1));
	t.true(composite.getChilds().includes(path2));
});

test('remove element of composite', t=>{
	let { path1, path2 } = make_2_test_path(),
		composite = new Composite(path1, path2);

	composite.remove(path2.key);

	t.true(composite.getChilds().includes(path1));
	t.false(composite.getChilds().includes(path2));
});