import React from 'react';
import Notification from '../Notification';

export default class ToolButton extends React.Component {
	
	offset(){
		Notification.emit('offset');
	}

	render(){
		return (
			<button onClick={this.offset}>
				{this.props.children}
			</button>
		);
	}
}