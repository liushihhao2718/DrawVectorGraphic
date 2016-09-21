import React from 'react';
import ToolFactory from '../Tool';
let shortid = require( 'shortid');

class ToolList extends React.Component {
	render(){
		let btn_text = {
			'select':'Select (S)',
			'pen' : 'Pen (P)',
			'group': 'Group (G)'
		};

		let buttons = createButtons();

		return (
			<section className="grid">
				{buttons}
			</section>
		);

		function createButtons(){
			return Object.keys(ToolFactory.getContext().tools)
					.map((k)=>{
						return (
							<ToolButton key={shortid.generate()}tool={k}>
								{btn_text[k]}
							</ToolButton>
						);
					});
		}
	}
}

class ToolButton extends React.Component {
	constructor(props){
		super(props);
	}
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
export default ToolList;