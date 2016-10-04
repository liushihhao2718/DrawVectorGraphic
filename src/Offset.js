import math from 'mathjs';

export default function intersect(points, d){
	let offsets = [];
	let l = points.length;
	for(let i =1;i<= l; i++) {
		let a = offsetedLine( points[(i-1+l)%l], points[i], d);
		let b = offsetedLine( points[i], points[(i+1)%l], d);


		let intersect = math.intersect([a.p1.x, a.p1.y], [a.p2.x, a.p2.y],
			[b.p1.x, b.p1.y], [b.p2.x, b.p2.y]);

		offsets.push({x:intersect[0],y:intersect[1]});
	}

	return offsets;
}

function offsetedLine(p1, p2, d) {
	let v = {
			x : p2.x - p1.x,
			y : p2.y - p1.y
		},
		direct = {
			x : -1*v.y,
			y : v.x
		};

	let offset_1 = offset(p1, direct, d),
		offset_2 = offset(p2, direct, d);
	return { p1:offset_1, p2:offset_2 };
}

function offset(p, direct, d){
	let norm = normalize(direct);

	return {
		x : p.x + norm.x * d,
		y : p.y + norm.y * d
	};
}

function normalize(vector){

	let norm = Math.sqrt( Math.pow(vector.x,2) + Math.pow(vector.y,2) );
	return {
		x : vector.x / norm,
		y : vector.y / norm
	};
}