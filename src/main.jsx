import PathController from './PathController';
import MouseEventHanlder from './MouseEventHanlder';
// import ButtonEventHandler from './ButtonEventHandler';
import ToolFactory from './Tool/ToolFactory.js';

import React from 'react';
import ReactDOM from 'react-dom';
import ToolList from './ReactTag/ToolList.jsx';
import OtherButtonList from './ReactTag/OtherButtonList.jsx';

init();

function init(){
	
	let svg = document.getElementById('drawing_panel'),
		pathController = new PathController(svg);

	svg.setAttribute('width', '800');
	svg.setAttribute('height','600');


	ToolFactory.createContext(pathController);

	let mouseEvent = new MouseEventHanlder();
	mouseEvent.setListener();

	pathController.render();

	ReactDOM.render(
		(
			<section className="grid">
				<ToolList/>
				<OtherButtonList/>
			</section>
		), document.getElementById('button-list'));
}