let shortid = require( 'shortid');

class Node {
	constructor(x, y, type = 'curve'){
		this.key =  shortid.generate();
		this.type = type;//type: curve, curve, smooth, offcurve
		this.x = x;
		this.y = y;
		this.selected = false;

		this.next = undefined;
		this.prev = undefined;
	}

	toString(){
		return `${this.x} ${this.y} ${this.type}`;
	}
}

class Path{
	constructor(nodes, closed = true){
		this.key = shortid.generate();

		this.nodeMap = new Map();
		this.head = undefined;
		this.tail = undefined;
		this.selected = false;

		this.link(nodes, closed);
	}
	bbox(){
		let lux = Number.MAX_VALUE,
			luy = Number.MAX_VALUE,
			rbx = Number.MIN_VALUE,
			rby = Number.MIN_VALUE;

		for(let v of this.nodeMap.values()) {
			if (lux > v.x) lux = v.x;
			if (luy > v.y) luy = v.y;
			if (rbx < v.x) rbx = v.x;
			if (rby < v.y) rby = v.y;
		}

		return {
			'x': lux,
			'y': luy,
			'width': Math.abs(lux - rbx),
			'height': Math.abs(luy - rby)
		};
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
					if(n.type === 'curve'){
						state = 'curve';
						d+=` L${n.x},${n.y}`;
					}
					else if(n.type === 'offcurve'){
						state = 'offcurve';
						buffer.push(n);
					}else error(2);
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
		let new_node = new Node(x,y,'curve');

		new_node.prev = this.tail;
		this.nodeMap.get(this.tail).next = new_node.key;

		this.nodeMap.set(new_node.key, new_node);
		this.tail = new_node.key;
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
	isOff(key) {
		if(key === undefined) return false;

		return (this.nodeMap.get(key).type == 'offcurve');
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
					if(n.type === 'curve'){
						state = 'curve';
						segments.push([buffer[0], n]);
						buffer.pop();
						buffer.push(n);
					}
					else if(n.type === 'offcurve'){
						state = 'offcurve';
						buffer.push(n);
					}else error(2);
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
						buffer.splice(0, 3);
						buffer.push(n);
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

	nodeMove(key, dx, dy) {
		let node = this.nodeMap.get(key);

		if (node.type === 'smooth') {
			let prev = this.nodeMap.get(node.prev),
				next = this.nodeMap.get(node.next);

			makeSmooth(prev, node, next);
			node.x += dx;
			node.y += dy;
			prev.x += dx;
			prev.y += dy;
			next.x += dx;
			next.y += dy;
		}
		else if(node.type === 'curve') {

			let prev = this.nodeMap.get(node.prev),
				next = this.nodeMap.get(node.next);

			if (prev !== undefined && prev.type === 'offcurve') {
				prev.x += dx;
				prev.y += dy;
			}
			if (next !== undefined && next.type === 'offcurve') {
				next.x += dx;
				next.y += dy;
			}
			node.x += dx;
			node.y += dy;
		}
		else if(node.type === 'offcurve'){
			let prev = this.nodeMap.get(node.prev),
				next = this.nodeMap.get(node.next);

			node.x += dx;
			node.y += dy;

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
			if (Math.abs( dot - 1 )>= 0.001) {
				
				o2.x = Math.floor(s.x + v1.x * d2 / d1);
				o2.y = Math.floor(s.y + v1.y * d2 / d1);
			}
		}
	}

	closePath(){
		this.nodeMap.get(this.head).prev = this.tail;
		this.nodeMap.get(this.tail).next = this.head;
	}
	makeLineSegmentToCurve(p1, p2){
		let in1 = this.interpolation(p1, p2),
			in2 = this.interpolation(p2, p1),
			c1 = new Node(in1.x, in1.y, 'offcurve'),
			c2 = new Node(in2.x, in2.y, 'offcurve');

		this.nodeMap.set(c1.key, c1);
		this.nodeMap.set(c2.key, c2);

		p1.next = c1.key;
		c1.prev = p1.key;
		c1.next = c2.key;
		c2.prev = c1.key;
		c2.next = p2.key;
		p2.prev = c2.key;

	}
	interpolation(p1, p2){
		return {
			'x' : Math.floor( (2*p1.x + p2.x)/3 ),
			'y' : Math.floor( (2*p1.y + p2.y)/3 )
		};
	}

	transferNodeType(key){
		let node = this.nodeMap.get(key),
			prev = node.prev,
			next = node.next;
		if (node.type === 'curve' 
			&& prev != undefined && prev != undefined
			&& this.isOff(prev) && this.isOff(next) ) {
		
			node.type = 'smooth';
		}
		else if (node.type === 'smooth') {
			node.type = 'curve';
		}
	}
}

export {Node, Path};