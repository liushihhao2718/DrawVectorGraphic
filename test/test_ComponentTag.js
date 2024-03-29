import test from 'ava';
import {Node, Path} from '../src/Path';

import React from 'react';
import {renderJSX, JSX} from 'jsx-test-helpers';
import Curve from '../src/ReactTag/Curve.jsx';
import {Composite} from '../src/Component';
import {RenderVisitor} from '../src/ComponentVisitor';
test('render locked curve', t=>{

	let n0 = new Node(100, 100, 'curve'),
		n1 = new Node(50, 150, 'offcurve'),
		n2 = new Node(200, 150, 'offcurve'),
		n3 = new Node(250, 100, 'curve'),
		path1 = new Path([n0,n1,n2,n3], false);

	let actual = renderJSX(<Curve path={path1} lock={true}/>);

	const expected = JSX(
		<g>
			<path className="segment" d="M100,100 C50,150 200,150 250,100"/>
		</g>
	);

	t.is(actual, expected);
});

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

test('make composite tag', t=>{
	let { path1, path2 } = make_2_test_path(),
		composite = new Composite(path1, path2);
		
	const visitor = new RenderVisitor();
	composite.accept(visitor);

	const tag = JSX(visitor.result),
		expected = JSX(
			<g lock={true}>
				<Curve path={path1} lock={true}/>
				<Curve path={path2} lock={true}/>
			</g>
		);

	t.is(tag, expected);	
});

test('make component tag', t=>{
	let { path1, path2 } = make_2_test_path(),
		composite = new Composite(path1, path2);
		
	const visitor = new RenderVisitor();
	composite.accept(visitor);

	const tag = JSX(visitor.result),
		expected = JSX(
			<g lock={true}>
				<Curve path={path1} lock={true}/>
				<Curve path={path2} lock={true}/>
			</g>
		);

	t.is(tag, expected);	
});


test('make multi layer composite tag', t=>{
	let { path1, path2 } = make_2_test_path(),
		composite = new Composite(path1, path2);
		

	let n1 = new Node(400, 100, 'curve'),
		n2 = new Node(380, 50, 'curve'),
		n3 = new Node(250, 50, 'curve'),
		path3 = new Path([n1,n2,n3], false);

	let composite2 = new Composite(path3, composite);

	const visitor = new RenderVisitor();
	composite2.accept(visitor);

	const tag = JSX(visitor.result),
		expected = JSX(
			<g lock={true}>
				<Curve path={path3} lock={true}/>

				<g lock={true}>
					<Curve path={path1} lock={true}/>
					<Curve path={path2} lock={true}/>
				</g>

			</g>
		);

	t.is(tag, expected);	
});