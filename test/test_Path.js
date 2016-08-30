import test from 'ava';
import Point from '../src/Model/Point.js';
import Path from '../src/Model/Path/Path.js';
import {LineCommand, CurveCommand} from '../src/Model/Path/Command.js';
test('test Command', t=>{
	let p1 = new Point(10, 10),
		p2 = new Point(20, 20);

	let line = new LineCommand(),
		curve = new CurveCommand(p1, p2);

	t.true( line instanceof LineCommand);
	t.true(curve.p1 === p1);
	t.true(curve.p2 === p2);
});

test('make a Line', t=> {
	let p1 = new Point(10, 10),
		p2 = new Point(20, 20);

	let test_path = new Path(p1, p2, 'Line');

	t.true(test_path.points.length === 2);
	test.true(test_path.commands.length === 1);

	t.true(test_path.points[0] === p1 );
	t.true(test_path.points[1] === p2 );
	t.true( test_path.commands[0] instanceof LineCommand);
});