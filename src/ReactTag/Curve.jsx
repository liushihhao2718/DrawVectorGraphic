import React from 'react';
export default class Curve extends React.Component {
	render(){

		let segments = [];
		for(let seg of path.renderSegment()){
			segments.push( this.makeSegment(seg) );
		}

		return (
			
		);
	}

	makeSegment(seg) {
		let d = '';
		let tags = [];
		if(seg.length == 4){
			let p1 = seg[0],
				p2 = seg[3],
				c1 = seg[1],
				c2 = seg[2];
			d = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
			tags.push(<path className="segment" d={d}/>);
			
			let control_Seg_1 = document.createElementNS(svgNS, 'path');
			control_Seg_1.setAttribute('d', `M${p1.x},${p1.y} L${c1.x},${c1.y}`);
			control_Seg_1.setAttribute('class','control_Seg');



			let control_Seg_2 = document.createElementNS(svgNS, 'path');
			control_Seg_2.setAttribute('d', `M${p2.x},${p2.y} L${c2.x},${c2.y}`);
			control_Seg_2.setAttribute('class','control_Seg');

			group.appendChild(control_Seg_1);
			group.appendChild(control_Seg_2);

		}else{
			let p1 = seg[0],
				p2 = seg[1];
			d = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
		}

		let p = document.createElementNS(svgNS, 'path');
		p.setAttribute('class','segment');
		p.setAttribute('path_key',path.key);
		p.setAttribute('start-node',seg[0].key);
		p.setAttribute('end-node',seg[seg.length-1].key);
		p.setAttribute('d', d);

		let p_shadow = document.createElementNS(svgNS, 'path');
		p_shadow.setAttribute('class','segment shadow');
		p_shadow.setAttribute('path_key',path.key);
		p_shadow.setAttribute('start-node',seg[0].key);
		p_shadow.setAttribute('end-node',seg[seg.length-1].key);
		p_shadow.setAttribute('d', d);

		group.appendChild(p);
		group.appendChild(p_shadow);
	}

	
}

//<Curve path={path} selected={false} lock={false}/>

