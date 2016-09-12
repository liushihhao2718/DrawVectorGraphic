let uuid = require( 'uuid');

class Node {
	constructor(x, y, type = 'line'){
		this.key = uuid.v1();
		this.type = type;//type: line, curve, smooth, offcurve
		this.x = x;
		this.y = y;

		this.next = undefined;
		this.prev = undefined;
	}

	toString(){
		return `${this.x} ${this.y} ${this.type}`;
	}
}

class Path{
	constructor(nodes, closed = true){
		this.key = uuid.v1();

		this.nodeMap = new Map();
		this.head = undefined;
		this.tail = undefined;

		this.link(nodes, closed);
	}
	link(nodes, closed){

		let handle = nodes[0].key;
		this.head = handle;
		this.nodeMap.set(handle, nodes[0]);

		for (var i = 1; i < nodes.length; i++) {
			let key = nodes[i].key;

			this.nodeMap.get(handle).next = key;
			nodes[i].prev = handle;

			this.nodeMap.set(key, nodes[i]);
			handle = key;
		}

		if (closed) {
			this.nodeMap.get(this.head).prev = handle;
			this.nodeMap.get(handle).next = this.head;
			this.tail = this.head;
		}else{
			this.tail = handle;
			this.nodeMap.get(this.head).prev = undefined;
			this.nodeMap.get(this.tail).next = undefined;
		}
	}
	toString(){
		let state = 'start',buffer=[];
		let error_flag = false;
		let d = '';
		let index = this.head;

		let error_code = 0;

		let round = this.nodeMap.size;
		if (this.closed) round++;//
		for(let i=0;i<=round;i++){

			if (index === undefined) break;
			let n = this.nodeMap.get(index);

			if (error_flag)  break;
			switch(state){
				case 'start':
					if (n.type != 'offcurve') {
						state = 'curve';
						d+=`M${n.x},${n.y}`;
					}
					else error(1);
					break;
				case 'curve':
					if(n.type === 'line' || n.type === 'curve'){
						state = 'line';
						d+=` L${n.x},${n.y}`;
					}
					else if(n.type === 'offcurve'){
						state = 'offcurve';
						buffer.push(n);
					}else error(2);
					break;
				case 'line':
					if(n.type === 'line'){
						state = 'line';
						d+=` L${n.x},${n.y}`;
					}
					else if(n.type === 'curve' || n.type==='smooth'){
						state = 'curve';
						d+=` L${n.x},${n.y}`;
					}
					else error(3);
					break;
				case 'offcurve':
					if(n.type === 'offcurve') {
						state = 'offcurve2';
						buffer.push(n);
					}
					else error(4);
					break;
				case 'offcurve2':
					if(n.type === 'curve' || n.type==='smooth'){
						state = 'curve';
						let c =` C${buffer[0].x},${buffer[0].y}`
							+` ${buffer[1].x},${buffer[1].y}`
							+` ${n.x},${n.y}`;
						d += c;
						buffer.splice(0, 2);
					}
					else error(5);
					break;
			}
			index = this.nodeMap.get(index).next;
		}

		if (error_flag) return 'error'+error_code;
		if (this.closed) d+='Z';
		return d;

		function error(code){
			error_flag = true;
			error_code = code;
		}
	}

	//新的node必須都是line node，然後透過其他操作來改變
	addPoint(x, y){
		if(this.closed) return;
		let new_node = new Node(x,y,'line'),
			key = uuid.v1();

		new_node.prev = this.tail;
		this.nodeMap.get(this.tail).next = key;

		this.nodeMap.set(key, new_node);
		this.tail = key;
	}

	cut(){}

	deleteNode(key) {
		let leftKey = this.nodeMap.get(key).prev,
			rightKey = this.nodeMap.get(key).next,
			L,R;

		if(key === this.head){
			/** head => (rightKey) => (right2Key) => R
				 *
				 *  			head == R
			*/
			if (rightKey){
				if(this.isOff(rightKey)){
					let right2Key = this.nodeMap.get(rightKey).next;
					R = this.nodeMap.get(right2Key).next;
					this.nodeMap.delete(rightKey);
					this.nodeMap.delete(right2Key);	
				}
				else {
					R = rightKey;
				}		
				this.nodeMap.delete(this.head);
				this.head = R;
				this.nodeMap.get(this.head).prev = undefined;
			}
		}else if(key === this.tail){
			/** L => (left2Key) => (leftKey) => tail
			 *
			 *  			tail == L
			*/
			console.log(this.nodeMap.get(leftKey).toString());
			if(leftKey){
				if (this.isOff(leftKey)) {
					let left2Key = this.nodeMap.get(leftKey).prev;
					L = this.nodeMap.get(left2Key).prev;
					this.nodeMap.delete(leftKey);
					this.nodeMap.delete(left2Key);
				}
				else{
					L = leftKey;
				}

				this.nodeMap.delete(this.tail);
				this.tail = L;
				this.nodeMap.get(this.tail).next = undefined;
			}

		}
		else if(!this.isOff(leftKey) && !this.isOff(rightKey)){
			L = this.nodeMap.get(key).prev,
			R = this.nodeMap.get(key).next;
			if(L) this.nodeMap.get(L).next = R;
			if(R) this.nodeMap.get(R).prev = L;

			this.nodeMap.delete(key);
		}
		else if(this.isOff(leftKey) && this.isOff(rightKey)) {
			/** L => leftKey => key => rightKey => R
			 *
			 *  			L => R
			*/
			L = this.nodeMap.get(leftKey).prev,
			R = this.nodeMap.get(rightKey).next;
			this.nodeMap.get(L).next = R;
			this.nodeMap.get(R).prev = L;

			this.nodeMap.delete(key);
			this.nodeMap.delete(leftKey);
			this.nodeMap.delete(rightKey);
		}
		else if(this.isOff(leftKey) && !this.isOff(rightKey)) {
			/** L => (left2Key) =>leftKey => key => R
			 *
			 *  			L => R
			*/
			let left2Key = this.nodeMap.get(leftKey).prev;
			if (this.isOff(left2Key)) {
				L = this.nodeMap.get(left2Key).prev;
				this.nodeMap.delete(left2Key);
			}
			else{
				L = left2Key;
			}
			R = rightKey;

			this.nodeMap.get(L).next = R;
			this.nodeMap.get(R).prev = L;

			this.nodeMap.delete(key);
			this.nodeMap.delete(leftKey);
		}
		else if(!this.isOff(leftKey) && this.isOff(rightKey)){
			/** L => key => rightKey => (right2Key) => R
				 *
				 *  			L => R
			*/
			let right2Key = this.nodeMap.get(rightKey).next;
			if (this.isOff(right2Key)) {
				R = this.nodeMap.get(right2Key).next;
				this.nodeMap.delete(right2Key);
			}
			else {
				R = right2Key;
			}
			L = leftKey;

			if(L) this.nodeMap.get(L).next = R;
			if(R) this.nodeMap.get(R).prev = L;
			this.nodeMap.delete(key);
			this.nodeMap.delete(rightKey);
		}
	}
	isOff(k) {
		if(k === undefined) return false;

		return (this.nodeMap.get(k).type == 'offcurve');
	}
	renderSegment(){
		let state = 'start',buffer=[], segments = [];
		let error_flag = false;
		let index = this.head;

		let error_code = 0;

		let round = this.nodeMap.size;
		if (this.closed) round++;//
		for(let i=0;i<=round;i++){

			if (index === undefined) break;
			let n = this.nodeMap.get(index);

			if (error_flag)  break;
			switch(state){
				case 'start':
					if (n.type != 'offcurve') {
						state = 'curve';
						buffer.push(n);
					}
					else error(1);
					break;
				case 'curve':
					if(n.type === 'line' || n.type === 'curve'){
						state = 'line';
						segments.push([buffer[0], n]);
						buffer.pop();
						buffer.push(n);
					}
					else if(n.type === 'offcurve'){
						state = 'offcurve';
						buffer.push(n);
					}else error(2);
					break;
				case 'line':
					if(n.type === 'line'){
						state = 'line';
						segments.push([buffer[0], n]);
						buffer.pop();
						buffer.push(n);
					}
					else if(n.type === 'curve' || n.type==='smooth'){
						state = 'curve';
						segments.push([buffer[0], n]);
						buffer.pop();
						buffer.push(n);
					}
					else error(3);
					break;
				case 'offcurve':
					if(n.type === 'offcurve') {
						state = 'offcurve2';
						buffer.push(n);
					}
					else error(4);
					break;
				case 'offcurve2':
					if(n.type === 'curve' || n.type==='smooth'){
						state = 'curve';
						segments.push([ buffer[0], buffer[1], buffer[2],n ]);
						buffer.pop();
						buffer.push(n);
						buffer.splice(0, 2);
					}
					else error(5);
					break;
			}
			index = this.nodeMap.get(index).next;
		}

		if (error_flag) return 'error'+error_code;
		return segments;

		function error(code){
			error_flag = true;
			error_code = code;
		}
	}
	nodeMove(event) {
		let node = this.nodeMap.get(event.target.id);
		if (node.type === 'smooth') {
			let prev = this.nodeMap.get(node.prev),
				next = this.nodeMap.get(node.next);

			makeSmooth(prev, node, next);
			node.x += event.dx;
			node.y += event.dy;
			prev.x += event.dx;
			prev.y += event.dy;
			next.x += event.dx;
			next.y += event.dy;
		}
		else if(node.type === 'curve') {

			let prev = this.nodeMap.get(node.prev),
				next = this.nodeMap.get(node.next);

			if (prev.type === 'offcurve') {
				prev.x += event.dx;
				prev.y += event.dy;
			}
			if (next.type === 'offcurve') {
				next.x += event.dx;
				next.y += event.dy;
			}
			node.x += event.dx;
			node.y += event.dy;
		}
		else if(node.type === 'line'){
			node.x += event.dx;
			node.y += event.dy;
		}
		else if(node.type === 'offcurve'){
			let prev = this.nodeMap.get(node.prev),
				next = this.nodeMap.get(node.next);

			node.x += event.dx;
			node.y += event.dy;

			if (prev.type === 'smooth') {
				makeSmooth(node, prev, this.nodeMap.get(prev.prev));
			}else if(next.type === 'smooth'){
				makeSmooth(node, next, this.nodeMap.get(next.next));
			}
		}

		function makeSmooth(o1, s, o2) {
			let v1 = {
					x : s.x - o1.x,
					y : s.y - o1.y
				},
				v2 = {
					x : o2.x - s.x,
					y : o2.y - s.y
				};
			let d1 = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2)),
				d2 = Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2));
			let dot = 	(v1.x * v2.x + v1.y*v2.y)/(d1*d2);
			if (Math.abs( dot - 1 )>= 0.01) {
				
				o2.x = s.x + v1.x * d2 / Math.floor(d1);
				o2.y = s.y + v1.y * d2 / Math.floor(d1);
			}
		}
	}
}

export {Node, Path};