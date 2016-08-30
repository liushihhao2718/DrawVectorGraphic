import test from 'ava';
import Point from '../src/Model/Point.js';


test('foo', t =>{
	t.pass();
});

test('make a point', t =>{
	let p = new Point(10, 10), 
		check = checkPosition(p, 10, 10);

	t.true(check);
});

test('move a point', t =>{
	let p = new Point(10, 10);
	p.moveTo(20, 20);
	let	check = checkPosition(p, 20, 20);
	t.true(check);
});

function checkPosition(point, x, y){
	return ( point.x === x)
		&&( point.y === y)
		&&( typeof point.id === 'string');
}