import React from 'react';

//<Curve path={path} lock={false}/>
export default class Curve extends React.Component {
	render(){
		let segments = [];
		for(let seg of this.props.path.renderSegment())
			segments.push( this.makeSegment(seg) );
		
		return (<g id={this.props.path.key}>{segments}</g>);
	}

	makeSegment(seg) {
	
		let { d, ctrl } = isLine(seg) ? lineDescription(seg) : curveDescription(seg);		

		let tags = [];

		tags.push(<path className='segment' d={d}/>);

		if(!this.props.lock){
			tags.push(<path className='segment shadow' d={d}/>);
			if ( isLine(seg) )
				tags.concat( pushControlPath(ctrl) );
		}
		return tags;
	}
}

Curve.propTypes = {
	path: React.PropTypes.object,
	lock:React.PropTypes.bool
};

function isLine(segment){
	return segment.length == 2;
}

function lineDescription(seg){
	let p1 = seg[0], p2 = seg[1],
		d = `M${p1.x},${p1.y} L${p2.x},${p2.y}`,
		ctrl = [];

	return { d, ctrl };
}

function curveDescription(seg){
	let p1 = seg[0], p2 = seg[3],
		c1 = seg[1], c2 = seg[2];

	let d = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`,
		ctrl = [];

	ctrl.push(`M${p1.x},${p1.y} L${c1.x},${c1.y}`);
	ctrl.push(`M${p2.x},${p2.y} L${c2.x},${c2.y}`);

	return {d, ctrl};
}

function pushControlPath (ctrl) {
	return [
		<path className='segment' d={ctrl[0]}/>,
		<path className='segment' d={ctrl[1]}/>
	];	
}