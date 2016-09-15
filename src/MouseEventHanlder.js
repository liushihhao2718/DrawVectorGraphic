import interact from 'interact.js';
import {ToolFactory} from './Tool';

export default class MouseEventHanlder {
	constructor(controller){
		this.toolFactory = new ToolFactory(controller);
		this.tool = this.toolFactory.switchTool('select');
	}

	setListener() {
		interact('.node')
			.draggable({onmove:this.dragNode.bind(this)})
			.on('click', this.tapNode.bind(this))//不bind的話nodeTap裡的this會變別人
			.on('hold', this.holdNode.bind(this));
		
		interact('.segment').
			on('click', this.tapSegment.bind(this));

		interact('#drawing_panel')
			.on('click', this.tapBackground.bind(this));

		document.addEventListener('keydown', e => {
			let code = (e.keyCode ? e.keyCode : e.which),
				codeMap = new Map();
			codeMap.set(32, 'select');
			codeMap.set(80, 'draw');

			this.tool = this.toolFactory.switchTool(codeMap.get(code));
		});
	}
	
	dragNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.tool.dragNode(event);	
		event.preventDefault();
	}

	tapNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.tool.tapNode(event);
		event.preventDefault();
	}
	holdNode(event) {
		if (event.target.classList[0] !== 'node') return;
		this.tool.holdNode(event);
		event.preventDefault();
	}
	tapBackground(event){
		if (event.target.nodeName !== 'svg') return;
		this.tool.tapBackground(event);
		event.preventDefault();
	}
	tapSegment(event){
		if (event.target.nodeName !== 'path') return;
		this.tool.tapPath(event);
		event.preventDefault();
	}
}