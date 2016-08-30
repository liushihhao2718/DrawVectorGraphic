import test from 'ava';
import Point from '../src/Model/Point.js';
import Path from '../src/Model/Path/Path.js';
import {LineCommand, CurveCommand} from '../src/Model/Path/Command.js';

let p1 = new Point(10, 10),
	p2 = new Point(20, 20);

test('test Command', t=>{
	let line = new LineCommand(),
		curve = new CurveCommand(p1, p2);

	t.true( line instanceof LineCommand);
	t.true(curve.p1 === p1);
	t.true(curve.p2 === p2);
});

test('make a Line', t=> {
	let test_path = new Path(p1, p2, 'Line');

	t.true(test_path.points.length === 2);
	t.true(test_path.commands.length === 1);

	t.true(test_path.points[0] === p1 );
	t.true(test_path.points[1] === p2 );
	t.true( test_path.commands[0] instanceof LineCommand);
});

test('append LineCommand', t=>{
	let test_path = new Path(p1, p2, 'Line'),
		p3 = new Point(30, 10);

	test_path.appendLineWithPoint(p3);

	/*
	三個點 兩個Line Command
	*	[p1, p2, p3]
		[  L,  L   ]
	*/
	t.true(test_path.points.length === 3);
	t.true(test_path.commands.length === 2);

	t.true(test_path.points[0] === p1 );
	t.true(test_path.points[1] === p2 );
	t.true(test_path.points[2] === p3 );
	t.true( test_path.commands[0] instanceof LineCommand);
	t.true( test_path.commands[1] instanceof LineCommand);
});

test('make polyline with random points', t=>{
	let pointArray = [p1, p2],
		linePath = new Path(p1, p2, 'Line');
	for (let i = 0; i < 10; i++) {
		let p = makeRandomPoint();
		pointArray.push(p);
		linePath.appendLineWithPoint(p);
	}
	for (let i = 0; i < pointArray.length; i++) {
		t.true( linePath.points[i] === pointArray[i] );
		if (i > 0) {
			t.true( linePath.commands[i-1] instanceof LineCommand );
		}
	}

	function makeRandomPoint() {
		let x = oneToTen(),
			y = oneToTen();

		return new Point(x, y);
	}
	function oneToTen() {
		return Math.floor((Math.random() * 10) + 1);
	}
});

test('make line to curve', t=>{
	//p L p L p => p C p L p
	//p: 頂點 C:貝茲控制指令
	//預設建立於線上四分之一處

	let test_path = new Path(p1, p2, 'Line'),
		p3 = new Point(30, 10);
	test_path.appendLineWithPoint(p3);


	let c1 = makeControlPoint(p1, p2),
		c2 = makeControlPoint(p2, p1),
		curve = new CurveCommand(c1, c2);
	test_path.makeCurveWithCommandAtIndex(curve, 0);

	t.true( test_path.commands.length === 2);
	t.true( test_path.commands[0] instanceof CurveCommand);
	t.true( test_path.commands[1] instanceof LineCommand);

	function makeControlPoint(p1, p2) {
		return new Point(quartile(p1.x, p2.x),
				quartile(p1.y, p2.y));
	}
	// 1/4
	function quartile(a, b) {
		return (a + 3*b) /4;
	}
});

test('make curve to line', t=>{
	//p L p L p => p C p L p
	//p: 頂點 C:貝茲控制指令
	//預設建立於線上四分之一處

	let test_path = new Path(p1, p2, 'Line'),
		p3 = new Point(30, 10);
	test_path.appendLineWithPoint(p3);


	let c1 = makeControlPoint(p1, p2),
		c2 = makeControlPoint(p2, p1),
		curve = new CurveCommand(c1, c2);
	test_path.makeCurveWithCommandAtIndex(curve, 0);

	t.true( test_path.commands.length === 2);
	t.true( test_path.commands[0] instanceof CurveCommand);
	t.true( test_path.commands[1] instanceof LineCommand);

	function makeControlPoint(p1, p2) {
		return new Point(quartile(p1.x, p2.x),
				quartile(p1.y, p2.y));
	}
	// 1/4
	function quartile(a, b) {
		return (a + 3*b) /4;
	}
});