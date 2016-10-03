import React from 'react';
import ToolFactory from '../Tool/ToolFactory.js';
let shortid = require( 'shortid');

class ToolList extends React.Component {
	render(){
		let btn_text = {
			'select':'Select (S)',
			'pen' : 'Pen (P)',
			'group': 'Group (G)'
		};

		let buttons = toolButtons();

		return (
			<section className='grid'>
				{buttons}
			</section>
		);

		function toolButtons(){
			return Object.keys(ToolFactory.getContext().tools)
					.map((k)=>{
						return (
							<ToolButton key={shortid.generate()} tool={k}>
								{btn_text[k]}
							</ToolButton>
						);
					});
		}
	}
}

class ToolButton extends React.Component {
	
	switch(){
		ToolFactory.getContext().switchTool(this.props.tool);
	}
	render(){
		let self = this;
		return (
		<div>
			<button onClick={self.switch.bind(self)}>
				{self.props.children}
			</button>
		</div>
		);
	}
}

ToolButton.propTypes = {
	key: React.PropTypes.string.isRequired,
	tool: React.PropTypes
};
export default ToolList;