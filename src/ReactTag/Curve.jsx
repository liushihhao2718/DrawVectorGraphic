import React from 'react';
export default class Curve extends React.Component {
	render(){
		let segments = [];
		for(let seg of this.props.path.renderSegment())
			segments.push( this.makeSegment(seg) );
		
		return (<group id={this.props.path.key}>{segments}</group>);
	}

	makeSegment(seg) {
		let d = '';
		let ctrl = [];
		if(seg.length == 4){
			let p1 = seg[0], p2 = seg[3],
				c1 = seg[1], c2 = seg[2];

			d = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
	
			ctrl.push(`M${p1.x},${p1.y} L${c1.x},${c1.y}`);
			ctrl.push(`M${p2.x},${p2.y} L${c2.x},${c2.y}`);

		}else{
			let p1 = seg[0], p2 = seg[1];
			d = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
		}

		let tags = [];

		tags.push(<path className='segment' d={d}/>);

		if(!this.props.lock){
			tags.push(<path className='segment shadow' d={d}/>);
			tags.push(<path className='segment' d={ctrl[0]}/>);
			tags.push(<path className='segment' d={ctrl[1]}/>);
		}
	}
}
Curve.propTypes = {
	path: React.PropTypes.object,
	lock:React.PropTypes.bool
};
//<Curve path={path} selected={false} lock={false}/>