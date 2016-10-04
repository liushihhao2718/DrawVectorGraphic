let shortid = require( 'shortid');

import React from 'react';
export default class OtherButtonList extends React.Component {
	render(){
		let btn_text = {
			'image':'image'
		};
		let style = {
			'display':'flex'
		};
		return (
			<section style={style}>
				{buttons()}
			</section>
		);

		function buttons(){
			return Object.keys(btn_text)
					.map((k)=>{
						return (
							<OtherButton key={shortid.generate()} tool={k}>
								{btn_text[k]}
							</OtherButton>
						);
					});
		}
	}
}
class OtherButton extends React.Component {
	render(){
		return (
		<div>
			<button>{this.props.children}</button>
		</div>
		);
	}
}