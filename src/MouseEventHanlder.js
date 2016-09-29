import interact from 'interact.js';
import ToolFactory from './Tool/ToolFactory.js';

export default class MouseEventHanlder {
	constructor(){
		this.toolContext = ToolFactory.getContext();
		this.toolContext.switchTool('select');
	}

	setListener() {
		interact('.node')
			.draggable({onmove:this.dragNode.bind(this)})
			.on('click', this.tapNode.bind(this))//不bind的話nodeTap裡的this會變別人
			.on('hold', this.holdNode.bind(this));

		interact('.segment')
			.on('click', this.tapSegment.bind(this))
			.on('doubletap', this.doubletapSegment.bind(this));

		interact('#drawing_panel')
			.on('click', this.tapBackground.bind(this));

		this.codeMap = new Map();
		this.codeMap.set(83, 'select');//Ss
		this.codeMap.set(80, 'pen');//Pp

		document.addEventListener('keydown', e => {
			let code = (e.keyCode ? e.keyCode : e.which),
				str = this.codeMap.get(code);

			if (str != undefined) {
				this.toolContext.switchTool(str);
			}
		});
	}

	dragNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.toolContext.tool.dragNode(event);
		event.preventDefault();
	}

	tapNode(event){
		if (event.target.classList[0] !== 'node') return;
		this.toolContext.tool.tapNode(event);
		event.preventDefault();
	}

	dragGroup(){
		this.toolContext.dragNode(event);
		event.preventDefault();
	}
	holdNode(event) {
		if (event.target.classList[0] !== 'node') return;
		this.toolContext.tool.holdNode(event);
		event.preventDefault();
	}
	tapBackground(event){
		if (event.target.nodeName !== 'svg') return;
		this.toolContext.tool.tapBackground(event);
		event.preventDefault();
	}
	tapSegment(event){
		if (event.target.nodeName !== 'path') return;
		this.toolContext.tool.tapPath(event);
	}
	doubletapSegment(event){
		if (event.target.nodeName !== 'path') return;
		this.toolContext.tool.doubleTapPath(event);
		event.preventDefault();
	}
}
