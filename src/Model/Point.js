import uuid from 'uuid';

export default class Point {
	constructor(x, y) {
		this.id = this.id_Make();
		this.x = x;
		this.y = y;	
	}

	id_Make() {
		return uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
	}

	moveTo(newX, newY) {
		this.x = newX;
		this.y = newY;
	}
}