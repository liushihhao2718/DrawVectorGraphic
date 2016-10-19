import test from 'ava';
import {Node, Path} from '../src/Path';

import React from 'react';
import {renderJSX, JSX} from 'jsx-test-helpers';
import Curve from '../src/ReactTag/Curve.jsx';

const Foo = ({children}) =>
    <div className="Foo">
        <span className="bar">bar</span>
        {children}
        <span className="bar">bar</span>
    </div>;

Foo.propTypes = {
	children: React.PropTypes.any
};

test('renders correct markup', t => {
	const actual = renderJSX(<Foo/>);
	const expected = JSX(
		<div className="Foo">
			<span className="bar">bar</span>
			<span className="bar">bar</span>
		</div>
	);
	t.is(actual, expected);
});

test('renders children when passed in', t => {
	const actual = renderJSX(
		<Foo>
			<div className="unique"/>
		</Foo>
	);
	const expected = renderJSX(
		<Foo>
			<div className="unique"/>
		</Foo>
	);
	t.is(actual, expected);
});

test('render locked curve', t=>{

	let n0 = new Node(100, 100, 'curve'),
		n1 = new Node(50, 150, 'offcurve'),
		n2 = new Node(200, 150, 'offcurve'),
		n3 = new Node(250, 100, 'curve'),
		path1 = new Path([n0,n1,n2,n3], false);

	let actual = renderJSX(<Curve path={path1} lock={true}/>);

	const expected = JSX(
		<g id={path1.key}>
			<path className="segment" d="M100,100 C50,150 200,150 250,100"/>
		</g>
	);

	t.is(actual, expected);
});
test('render locked close curve', t=>{

	let n0 = new Node(100, 100, 'curve'),
		n1 = new Node(50, 150, 'offcurve'),
		n2 = new Node(200, 150, 'offcurve'),
		n3 = new Node(250, 100, 'curve'),
		path1 = new Path([n0,n1,n2,n3], true);

	let actual = renderJSX(<Curve path={path1} lock={true}/>);

	const expected = JSX(
		<g id={path1.key}>
			<path className="segment" d="M100,100 C50,150 200,150 250,100"/>
			<path className="segment" d="M250,100 L100,100"/>
		</g>
	);

	t.is(actual, expected);
});
test('render non-locked curve', t=>{

	let n0 = new Node(100, 100, 'curve'),
		n1 = new Node(50, 150, 'offcurve'),
		n2 = new Node(200, 150, 'offcurve'),
		n3 = new Node(250, 100, 'curve'),
		path1 = new Path([n0,n1,n2,n3], false);

	let actual = renderJSX(<Curve path={path1} lock={false}/>);

	const expected = JSX(
		<g id={path1.key}>
			<path className="segment" d="M100,100 C50,150 200,150 250,100"/>
			<path className="segment shadow" d="M100,100 C50,150 200,150 250,100"/>
		</g>
	);

	t.is(actual, expected);
})