import React from 'react';
import {RenderVisitor} from '../ComponentVisitor';
//<Component component={} />
export default class Component extends React.Component {
	render(){
		const visitor = new RenderVisitor();

		if(this.state.selected){
			return (
				<rect>{visitor.result}</rect>
			);
		}

		return visitor.result; 
	}
}

Component.propTypes = {
	component: React.PropTypes.object,
	lock:React.PropTypes.bool
};